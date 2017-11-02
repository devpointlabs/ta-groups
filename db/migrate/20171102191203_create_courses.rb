class CreateCourses < ActiveRecord::Migration[5.1]
  def change
    create_table :courses do |t|
      t.integer :canvas_course_id
      t.string :name
      t.boolean :active, default: true

      t.timestamps
    end
  end
end
