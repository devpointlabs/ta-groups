class Student < ApplicationRecord
  belongs_to :course
  belongs_to :user, optional: true
end
