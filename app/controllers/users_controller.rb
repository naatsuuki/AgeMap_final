# app/controllers/users_controller.rb
class UsersController < ApplicationController
  # 他のアクションは省略

  def create_age_table
    userName = params[:userName]
    userBirthYear = params[:userBirthYear].to_i
    comparisonName = params[:comparisonName]
    comparisonBirthYear = params[:comparisonBirthYear].to_i

    if userName.present? && userBirthYear.present? && comparisonName.present? && comparisonBirthYear.present?
      age_table_html = generate_age_table(userName, userBirthYear, comparisonName, comparisonBirthYear)
      render json: { table: age_table_html }
    else
      render json: { error: 'パラメータが不足しています' }, status: :unprocessable_entity
    end
  end

  private

  def generate_age_table(user_name, user_birth_year, comparison_name, comparison_birth_year)
    "<table>
      <tr>
        <th>名前</th>
        <th>生まれ年</th>
        <th>年齢</th>
      </tr>
      <tr>
        <td>#{user_name}</td>
        <td>#{user_birth_year}</td>
        <td>#{calculate_age(user_birth_year)}</td>
      </tr>
      <tr>
        <td>#{comparison_name}</td>
        <td>#{comparison_birth_year}</td>
        <td>#{calculate_age(comparison_birth_year)}</td>
      </tr>
    </table>"
  end

  def calculate_age(birth_year)
    current_year = Time.now.year
    current_year - birth_year
  end
end
