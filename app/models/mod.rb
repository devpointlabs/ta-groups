class Mod < ApplicationRecord
  belongs_to :course
  has_many :groups, dependent: :destroy
end
