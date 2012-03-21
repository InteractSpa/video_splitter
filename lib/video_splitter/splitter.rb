module VideoSplitter
    
  # This class uses ffmpeg to split video file
  class Splitter
    attr_reader :split_detail

    def initialize _split_detail
      @split_detail = _split_detail
    end

    def split
      ext = @split_detail.filename.split('.').last()
      begin
        cmd = "#{VideoSplitter::Constants::FFMPEG_BINARY_PATH} "
        cmd += "-i '#{@split_detail.video.file_path}' "
        cmd += "-ss #{@split_detail.timecode_input.value} "
        cmd += "-t #{@split_detail.length} "
        cmd += "-vcodec copy -acodec copy "
        cmd += "'#{VideoSplitter::Constants::OUTPUT_ROOT_PATH}/#{@split_detail.output_filename}.#{ext}' 2>&1"
        system cmd
      rescue
        # errore nel comando ffmpeg
        return false
      end
    end


  end
  
end