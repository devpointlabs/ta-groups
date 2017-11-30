class Note < ApplicationRecord
  belongs_to :mod
  validates_uniqueness_of :student_id, scope: :mod
end
