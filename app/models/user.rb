class User < ActiveRecord::Base
  has_one :student
  has_one :teaching_assistant

  after_create :try_associate_user
  # Include default devise modules.
  devise :database_authenticatable, :registerable,
          :recoverable, :rememberable, :trackable, :validatable,
          :omniauthable
  include DeviseTokenAuth::Concerns::User

  def try_associate_user
    student = Student.find_by(email: self.email)
    ta = TeachingAssistant.find_by(email: self.email)
    if student && !student.user_id
      student.user_id = self.id
      student.save
    elsif ta && !ta.user_id
      ta.user_id = self.id
      ta.save
      self.role = 'ta'
      self.save
    else
      raise ActiveRecord::Rollback, 'Canvas user not found' if self.email != 'admin@devpointlabs.com'
    end
    
    type = student ? 'student' : 'ta'
    update_groups(type, self)
  end

  def update_groups(type, user)
    if type == 'ta'
      groups = Group.where("ta @> '{\"email\": \"#{user.email}\"}'")
      groups.each do |group|
        group.ta['user_id'] = user.id
        group.save
      end
    else
      groups = Group.where("students @> '[{\"email\": \"#{user.email}\"}]'")
      groups.each do |group| 
        students = []
        group.students.each do |student| 
          if student["email"] == user.email
            student["user_id"] = user.id
          end
          students << student
        end
        group.save
      end

    end
  end
end
