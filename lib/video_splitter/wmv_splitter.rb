module VideoSplitter
  
  # Split wmv format files
  class WmvSplitter < Splitter

    def split 
      begin
        # verificare come splittare correttamente i wmv
        cmd = "#{VideoSplitter::Constants::FFMPEG_BINARY_PATH} "
        cmd += "-i '#{@split_detail.video.file_path}' "
        cmd += "-ss #{@split_detail.timecode_input.value} "
        cmd += "-t #{@split_detail.length} "
        cmd += "-vcodec copy -acodec copy "
        cmd += "'#{VideoSplitter::Constants::OUTPUT_ROOT_PATH}/#{@split_detail.output_filename}.wmv' 2>&1"
        system cmd
      rescue
        # errore nel comando ffmpeg
        return false
      end
    end

  end

end