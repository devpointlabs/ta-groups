class Course < ApplicationRecord
  has_many :mods, dependent: :destroy
  has_many :students
  has_many :teaching_assistants

end
