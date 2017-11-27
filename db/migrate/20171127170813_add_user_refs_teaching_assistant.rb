class AddUserRefsTeachingAssistant < ActiveRecord::Migration[5.1]
  def change
    add_reference :teaching_assistants, :user, index: true
  end
end
