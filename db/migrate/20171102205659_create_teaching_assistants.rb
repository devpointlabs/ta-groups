class CreateTeachingAssistants < ActiveRecord::Migration[5.1]
  def change
    create_table :teaching_assistants do |t|
      t.string :name
      t.string :avatar
      t.integer :canvas_id
      t.belongs_to :course, foreign_key: true

      t.timestamps
    end
  end
end
