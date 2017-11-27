class AddEmailToTeachingAssistants < ActiveRecord::Migration[5.1]
  def change
    add_column :teaching_assistants, :email, :string
  end
end
