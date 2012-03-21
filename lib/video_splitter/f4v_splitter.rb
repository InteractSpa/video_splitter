module VideoSplitter

  # Split f4v format files
  class F4vSplitter < Splitter

    def split 
      begin
        cmd = "#{VideoSplitter::Constants::FFMPEG_BINARY_PATH} "
        cmd += "-ss #{@split_detail.timecode_input.value} "
        cmd += "-t #{@split_detail.length} "
        cmd += "-i '#{@split_detail.video.file_path}' "
        cmd += "-vcodec copy -acodec copy "
        cmd += "-f flv "
        cmd += "'#{VideoSplitter::Constants::OUTPUT_ROOT_PATH}/#{@split_detail.output_filename}.f4v' 2>&1"
        system cmd
      rescue
        # errore nel comando ffmpeg
        return false
      end
    end

  end
  
end