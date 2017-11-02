class Api::CoursesController < ApplicationController
  def index
    @courses = Course.where(active: true)
  end

  def create
    HTTParty::Basement.default_options.update(verify: false)
    #GET COURSE INFO
    course = params[:course_id]
    url = "#{ENV['BASE_URL']}/courses/#{course}"
    auth = {"Authorization" => "Bearer #{ENV['CANVAS_TOKEN']}"}
    res = HTTParty.get(url, headers: auth)
    body = JSON.parse(res.body)
    c = Course.find_or_create_by(name: body['name'], canvas_course_id: course.to_i)

    #GET COURSE MODULES
    url = "#{url}/modules?per_page=100"
    res = HTTParty.get(url, headers: auth)
    body = JSON.parse(res.body)
    body.each { |mod| c.mods.find_or_create_by(name: mod['name']) }

    #GET COURSE STUDENTS
    url = "#{ENV['BASE_URL']}/courses/#{course}/users?per_page=100"
    res = HTTParty.get(url, headers: auth, query: { include: ['avatar_url'], enrollment_role: 'StudentEnrollment' })
    students = res.parsed_response.map { |u| { name: u['name'], avatar: u['avatar_url'], id: u['id'] }}
    students.each do |student| 
      c.students.create( name: student[:name], avatar: student[:avatar], canvas_id: student[:id] ) 
    end

    #GET COURSE TA's
    url = "#{ENV['BASE_URL']}/courses/#{course}/users?per_page=100"
    res = HTTParty.get(url, headers: auth, query: { include: ['avatar_url'], enrollment_role: 'TaEnrollment' })
    tas = res.parsed_response.map { |u| { name: u['name'], avatar: u['avatar_url'], id: u['id'] }}
    tas.each do |ta| 
      c.teaching_assistants.create( name: ta[:name], avatar: ta[:avatar], canvas_id: ta[:id] ) 
    end

    render json: { course: { name: c.name, id: c.id }, modules: c.mods }
  end

  def update
  end

  def destroy
  end
end
