###############################################################################
##################################################################################
#
# This file is part of VIDEO SPLITTER (VS), a video-utility released as a ruby gem
# that allows you to split video files.
#
# Copyright (c) 2012 Interact S.P.A.
#
# VS is free software: you can redistribute it and/or modify
# it under the terms of the GNU Lesser General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# VS is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Lesser General Public License for more details.
#
# You should have received a copy of the GNU Lesser General Public License
# along with VS.  If not, see <http://www.gnu.org/licenses/>.
#
# Contact us via email at meccanica@interact.it or at
#
# Interact S.P.A.
# Via Angelo Bargoni, 78
# 00153 Rome, Italy
#
#################################################################################
#################################################################################

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

      def copy_split_done_js
        copy_file "video-splitter.split_done.js", "app/assets/javascripts/video-splitter.split_done.js"
      end

      def create_video_folders
        FileUtils.mkdir_p(['public/video/input', 'public/video/output'])
      end

      def add_engine_routes
        route("match ':controller(/:action(/:id))(.:format)'")
        route("root :to => 'application#index'")
        route("mount VideoSplitter::Engine => '/video_splitter'")
      end

      def add_js_and_css_require
        gsub_file "app/assets/javascripts/application.js", "//= require jquery\n", ""
        gsub_file "app/assets/javascripts/application.js", "//= require jquery_ujs\n", ""
        
        inject_into_file "app/assets/javascripts/application.js",
          "//= require video_splitter\n//= require video-splitter.split_done\n",
          :before => "//= require_tree"
        inject_into_file 'app/assets/stylesheets/application.css',
          "\n *= require video_splitter",
          :after => " *= require_self"
      end
      
      def add_favicon
        if yes? "Can I put the video splitter favicon on your application layout?"
          inject_into_file 'app/views/layouts/application.html.erb',
            "\n\t<%= favicon_link_tag asset_path('video_splitter/favicon.png'), {:type => 'image/png', :rel => 'icon'} %>\n",
            :after => "</title>"
        end
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