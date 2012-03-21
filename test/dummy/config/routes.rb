Rails.application.routes.draw do

  mount VideoSplitter::Engine => "/video_splitter"
end
