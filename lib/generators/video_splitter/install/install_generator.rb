require 'fileutils'

module VideoSplitter
  module Generators

    class InstallGenerator < ::Rails::Generators::Base
      source_root File.expand_path('../templates', __FILE__)
      desc "Installs gem files in the newly created rails application"

      def do_nothing
        say_status("", "\n\nThe necessary js and css files are already in your asset pipeline.")
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

      def add_js_and_css_require
        original_js = File.binread("app/assets/javascripts/application.js")
        
        gsub_file "app/assets/javascripts/application.js", "//= require jquery\n", ""
        gsub_file "app/assets/javascripts/application.js", "//= require jquery_ujs\n", ""
        
        inject_into_file "app/assets/javascripts/application.js",
          "//= require video_splitter\n",
          :before => "//= require_tree"
        inject_into_file 'app/assets/stylesheets/application.css',
          "\n *= require video_splitter",
          :after => " *= require_self"
      end

      def autoload_lib
        # Autoload files in lib
        inject_into_file 'config/application.rb',
          "\n\t config.autoload_paths += %W(\#{config.root}/lib)",
          :after => "# Custom directories with classes and modules you want to be autoloadable."
      end


      def config_instructions
        say_status("", "\n\nOnce you have installed video_splitter you have to modify the config/video_splitter.yml:")
        say_status("", "1) ffmpeg_path: specify the ffmpeg binary path in your local machine")
        say_status("", "2) input_folders: an Hash (key = label, value = path) that contains
                    your input folders structure. These folders will be symlinked at the first
                    request to the standard input path: Rails.root/public/video/input\n\n")
      end
      
    end

  end
end