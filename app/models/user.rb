class User < ActiveRecord::Base
  has_one :student
  after_create :try_associate_student
  # Include default devise modules.
  devise :database_authenticatable, :registerable,
          :recoverable, :rememberable, :trackable, :validatable,
          :omniauthable
  include DeviseTokenAuth::Concerns::User

  def try_associate_student
    student = Student.find_by(email: self.email)
    if student && !student.user_id
      student.user_id = self.id
      student.save
    end
  end
end
