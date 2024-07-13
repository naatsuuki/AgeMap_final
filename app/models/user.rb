class User < ApplicationRecord
  validates :name, presence: true
  validates :birth_year, presence: true, numericality: { only_integer: true, greater_than: 0 }

  def age_at(year)
    year.to_i - birth_year.to_i
  end
end
