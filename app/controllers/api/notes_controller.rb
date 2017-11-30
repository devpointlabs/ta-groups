class Api::NotesController < ApplicationController
  def index
    student_id = params[:student_id]
    module_id = params[:module_id]
    render json: Mod.student_note(student_id, module_id)
  end

  def update
    @note = Note.find(params[:id])
    @note.update(note_params)
    render json: @note
  end

  private
    def note_params
      params.require(:note).permit(:content)
    end
end
