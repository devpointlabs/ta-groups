class CreateGroups < ActiveRecord::Migration[5.1]
  def change
    create_table :groups do |t|
      t.jsonb :ta
      t.jsonb :students
      t.belongs_to :mod, foreign_key: true

      t.timestamps
    end
  end
end
