class CreateMods < ActiveRecord::Migration[5.1]
  def change
    create_table :mods do |t|
      t.string :name
      t.boolean :active, default: true
      t.belongs_to :course, foreign_key: true

      t.timestamps
    end
  end
end
