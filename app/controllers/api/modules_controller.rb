class Api::ModulesController < ApplicationController
  before_action :set_course, :set_module

  def update
    if @module.update(module_params)
      render 'api/courses/show.json.jbuilder'
    else
      render json: { errors: @module.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private
    def set_course
      @course = Course.find(params[:course_id])
    end

    def set_module
      @module = @course.mods.find(params[:id])
    end

    def module_params
      params.require(:module).permit(:active)
    end
end
