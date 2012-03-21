module VideoSplitter
  
  # Video class provides info about video file.
  class Video
    
    attr_reader :file_path
    
    def initialize _filepath
      @file_path = _filepath
    end
    
    # Duration in seconds
    def duration_in_sec
      begin
        file = Inspector.new(
          :file => "#{self.file_path}",
          :ffmpeg_binary => VideoSplitter::Constants::FFMPEG_BINARY_PATH
        )
        return (file.duration)/1000
      rescue Exception => ex
        puts "Error calculating video duration: #{ex.message}"
      end
    end
    
    # Duration in hh:mm:ss
    def formatted_duration
      Time.at(self.duration_in_sec).gmtime.strftime('%R:%S')
    end
    
    # Video format
    def format
      unless self.file_path.nil?
        return File.basename(self.file_path).split(".").last
      else
        return nil
      end
    end
    
    # File name without format
    def filename
      File.basename(self.file_path).split(".").first
    end
    
    # File name and format
    def complete_filename
      File.basename(self.file_path)
    end
    
    def audio_codec
      file = Inspector.new(
        :file => self.file_path,
        :ffmpeg_binary => VideoSplitter::Constants::FFMPEG_BINARY_PATH
      )
      return file.audio_codec
    end
    
    def video_codec
      file = Inspector.new(
        :file => self.file_path,
        :ffmpeg_binary => VideoSplitter::Constants::FFMPEG_BINARY_PATH
      )
      return file.video_codec
    end
    
    def valid?
      correct_path? and is_a_video_file? and not empty? and valid_length?
    end
    
    private
    
    def is_a_video_file?
      Inspector.new(
        :file => self.file_path,
        :ffmpeg_binary => VideoSplitter::Constants::FFMPEG_BINARY_PATH
      ).valid?
    end
    
    def correct_path?
      File.exists? "#{self.file_path}"
    end
    
    def empty?
      File.size("#{self.file_path}") == 0
    end
    
    def valid_length?
      self.duration_in_sec != 0
    end
    
  end
  
end