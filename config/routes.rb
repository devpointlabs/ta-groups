Rails.application.routes.draw do
  mount_devise_token_auth_for 'User', at: 'api/auth'

  namespace :api do
    # Courses Routes
    get 'courses', to: 'courses#index'
    post 'courses', to: 'courses#create'
    put 'courses/:id/generate_groups', to: 'courses#generate_groups'
    delete 'courses/:id', to: 'courses#destroy'

    # Modules Routes
    put 'courses/:course_id/modules/:id', to: 'modules#update'

    resources :notes, only: [:index, :update]
  end

  #Do not place any routes below this one
  get '*other', to: 'static#index'
end
