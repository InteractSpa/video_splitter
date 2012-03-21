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