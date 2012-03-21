require "video_splitter/engine"

VIDEO_SPLITTER_ROOT = File.dirname(__FILE__) unless defined?(VIDEO_SPLITTER_ROOT)

module VideoSplitter
  class << self
    def root
      VIDEO_SPLITTER_ROOT
    end

    def views_root
      File.join(VideoSplitter.root, '..', 'app', 'views')
    end
    
    def config_root
      File.join(VideoSplitter.root, '..', 'config')
    end
  end
end

module VideoSplitter
  autoload :Constants, 'video_splitter/constants'
  autoload :Director, 'video_splitter/director'
  autoload :SplitDetail, 'video_splitter/split_detail'
  autoload :Inspector, 'video_splitter/inspector'
  autoload :Video, 'video_splitter/video'
  autoload :Timecode, 'video_splitter/timecode'
  autoload :SplitterStrategy, 'video_splitter/splitter_strategy'
  autoload :F4vSplitter, 'video_splitter/f4v_splitter'
  autoload :WmvSplitter, 'video_splitter/wmv_splitter'
  autoload :Splitter, 'video_splitter/splitter'
  autoload :Mp4Splitter, 'video_splitter/mp4_splitter'
  autoload :Utils, 'video_splitter/utils'
end

ActiveSupport.on_load(:action_view) do
  include VideoSplitter::ApplicationHelper
end