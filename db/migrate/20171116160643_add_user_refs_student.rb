class AddUserRefsStudent < ActiveRecord::Migration[5.1]
  def change
    add_reference :students, :user, index: true
  end
end
