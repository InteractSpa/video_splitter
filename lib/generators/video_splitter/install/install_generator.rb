require 'fileutils'

module VideoSplitter
  module Generators

    class InstallGenerator < ::Rails::Generators::Base
      source_root File.expand_path('../templates', __FILE__)
      desc "Installs gem files in the newly created rails application"

      def do_nothing
        say_status("", "\n\nThe necessary js and css files are already in your asset pipeline.")
        say_status("", "Just add `//= require video_splitter` to your app/assets/javascripts/application.js")
        say_status("", "Just add `*= require video_splitter` to your app/assets/stylesheets/application.css \n\n")
        # ok, nothing
      end

      def copy_after_split_callbacks
        copy_file "after_split.rb", "lib/video_splitter/after_split.rb"
      end

      def copy_config_yml
        copy_file "video_splitter.yml", "config/video_splitter.yml"
      end

      def create_video_folders
        FileUtils.mkdir_p(['public/video/input', 'public/video/output'])
      end

      def add_engine_route
        route("mount VideoSplitter::Engine => '/video_splitter'")
      end

      def config_instructions
        say_status("", "\n\nOnce you have installed video_splitter you have to modify the config/video_splitter.yml:")
        say_status("", "1) ffmpeg_path: specify the ffmpeg binary path in your local machine")
        say_status("", "2) input_folders: an Hash (key = label, value = path) that contains
                    your input folders structure. These folders will be symlinked at the first
                    request to the standard input path: Rails.root/public/video/input")
      end
      
    end

  end
end