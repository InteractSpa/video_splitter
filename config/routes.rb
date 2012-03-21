VideoSplitter::Engine.routes.draw do

  match ":action" => "application#:action"

  root :to => "application#index"

end
