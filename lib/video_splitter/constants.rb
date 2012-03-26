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
require 'video_splitter/after_split' if File.file?(Rails.root.join('lib', 'video_splitter', 'after_split.rb'))

module VideoSplitter

  module Constants
    
    APP_CONFIG_PATH  = Rails.root.join('config', 'video_splitter.yml')
    app_config = YAML.load_file(APP_CONFIG_PATH)

    # Create folders if they doesn't exists
    INPUT_ROOT_PATH  = "#{Rails.root}/public/video/input" unless defined?(INPUT_ROOT_PATH) 
    OUTPUT_ROOT_PATH = "#{Rails.root}/public/video/output" unless defined?(OUTPUT_ROOT_PATH)

    # Store config paths in global constants
    INPUT_FOLDERS = app_config['input_folders'] unless defined?(INPUT_FOLDERS)

    # Create required symlinks for input folders
    FileUtils.ln_s INPUT_FOLDERS.values, INPUT_ROOT_PATH, :force => true

    FFMPEG_BINARY_PATH = app_config['ffmpeg_path'] unless defined?(FFMPEG_BINARY_PATH)

  end
 
end