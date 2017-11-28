class Note < ApplicationRecord
  belongs_to :group
  validates_uniqueness_of :student_id, scope: :group_id
end
