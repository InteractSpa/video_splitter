module VideoSplitter
  module Utils

    # Return file name if it exists in input path, nil otherwise
    def self.find_file _file_name
      Dir.chdir "#{VideoSplitter::Constants::INPUT_ROOT_PATH}"
      if Dir.glob("*").include? _file_name
        return "#{VideoSplitter::Constants::INPUT_ROOT_PATH}/#{_file_name}"
      else
        return nil
      end
    end

    # Run vlc program to play video
    def self.play_video _file_path
      cmd = "vlc #{_file_path}"
      system cmd
    end

    # Delete file
    def self.delete _filename
      cmd = "rm '#{VideoSplitter::Constants::OUTPUT_ROOT_PATH}/#{_filename}'"
      system cmd
    end

  end
end

