class CreateNotes < ActiveRecord::Migration[5.1]
  def change
    create_table :notes do |t|
      t.text :content, default: ''
      t.string :author
      t.belongs_to :mod, foreign_key: true
      t.integer :student_id

      t.timestamps
    end
  end
end
