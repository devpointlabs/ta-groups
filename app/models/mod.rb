class Mod < ApplicationRecord
  belongs_to :course
  has_many :groups, dependent: :destroy
  has_many :notes, dependent: :destroy

  def self.student_note(student_id, module_id)
    find(module_id)
      .notes
      .where(student_id: student_id)
      .first_or_create do |note|
        note.student_id = student_id
        note.mod_id = module_id
      end
  end
end
