class Group < ApplicationRecord
  belongs_to :mod
  has_many :notes, dependent: :destroy
end
