class Api::CoursesController < ApplicationController
  def index
    if current_user.try(:role) == 'user' 
      @courses = [current_user.student.course]
    else
      @courses = Course.where(active: true)
    end
  end

  def create
    course_id = params[:course_id]
    @course = Course.find_by(canvas_course_id: course_id)

    if @course
      render json: { error: 'Course Added Already!' }, status: :bad_request
    else
      HTTParty::Basement.default_options.update(verify: false)
      #GET COURSE INFO
      course_id = params[:course_id]
      url = "#{ENV['BASE_URL']}/courses/#{course_id}"
      auth = {"Authorization" => "Bearer #{ENV['CANVAS_TOKEN']}"}
      res = HTTParty.get(url, headers: auth)
      body = JSON.parse(res.body)
      @course = Course.find_or_create_by(name: body['name'], canvas_course_id: course_id.to_i)

      #GET COURSE MODULES
      url = "#{url}/modules?per_page=100"
      res = HTTParty.get(url, headers: auth)
      body = JSON.parse(res.body)
      body.each { |mod| @course.mods.find_or_create_by(name: mod['name']) }

      #GET COURSE STUDENTS
      url = "#{ENV['BASE_URL']}/courses/#{course_id}/users?per_page=100"
      res = HTTParty.get(url, headers: auth, query: { include: ['avatar_url'], enrollment_role: 'StudentEnrollment' })
      students = res.parsed_response.map { |u| { name: u['name'], email: u['login_id'], avatar: u['avatar_url'], id: u['id'] }}
      students.each do |student|
        @course.students.create( 
          name: student[:name], 
          avatar: student[:avatar], 
          canvas_id: student[:id],
          email: student[:email]
        )
      end

      #GET COURSE TA's
      url = "#{ENV['BASE_URL']}/courses/#{course_id}/users?per_page=100"
      res = HTTParty.get(url, headers: auth, query: { include: ['avatar_url'], enrollment_role: 'TaEnrollment' })
      tas = res.parsed_response.map { |u| { name: u['name'], avatar: u['avatar_url'], id: u['id'], email: u['login_id'] }}
      tas.each do |ta|
        @course.teaching_assistants.create( name: ta[:name], avatar: ta[:avatar], canvas_id: ta[:id], email: ta[:email] )
      end

      render 'show.json.jbuilder'
    end
  end

  def generate_groups
    @course = Course.find(params[:id])
    @course.mods.each{ |mod| mod.groups.destroy_all }
    modules = @course.mods.where(active: true)
    students = @course.students
    modules.each do |mod|
      tas = @course.teaching_assistants.shuffle
      groups = students.shuffle.in_groups( students.size.quo(students.size / tas.size.to_f).ceil)
      groups.each_with_index do |group, index|
        mod.groups.create(ta: tas[index], students: group.compact)
      end
    end
    @course.reload

    render 'show.json.jbuilder'
  end

  def destroy
    Course.find(params[:id]).destroy
  end
end
