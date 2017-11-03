class Course < ApplicationRecord
  has_many :mods, dependent: :destroy
  has_many :students, dependent: :destroy
  has_many :teaching_assistants, dependent: :destroy
end
