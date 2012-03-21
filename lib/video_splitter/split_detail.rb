module VideoSplitter
  
  # This class contains all details about the file(s) to split
  class SplitDetail
    
    attr_reader :output_filename,  
                :timecode_input, 
                :timecode_output, 
                :length, 
                :output_format,
                :video
    
    def initialize _p = {}
      @video = Video.new _p[:input_filename]
      @timecode_input = VideoSplitter::Timecode.new _p[:timecode_input]
      @timecode_output = VideoSplitter::Timecode.new _p[:timecode_output]
      @output_filename = (_p[:output_filename].blank? ? timestamped_name() : check_output(_p[:output_filename]))
      @length = @timecode_output.value - @timecode_input.value
      @output_format = set_output_format _p[:output_format]
    end
    
    def valid?
      return false unless self.video.valid?
      return false unless valid_attrs?
      return false unless valid_timecodes?
      return false if output_already_exists?
      return true
    end
    
    def input_format
      self.video.format
    end
    
    # Return file name and format
    def filename
      self.video.complete_filename
    end
    
    private
    
    # If format param is nil, it takes same input file format
    def set_output_format _format
      return _format unless _format.nil?
      return @video.format
    end
    
    # Return nil if file name doesn't match with pattern, file name otherwise
    def check_output _filename
      return nil if _filename.match(/^([\w\s]*[^ ])$/).nil?
      return _filename
    end

    # A string that includes file name with input and output timecode
    def timestamped_name
      "#{@video.filename}_#{@timecode_input.value}_#{@timecode_output.value}"
    end

    # Check timecode validations
    def valid_timecodes?
      return false if self.video.duration_in_sec < self.timecode_input.value
      return false if self.video.duration_in_sec < self.timecode_output.value
      return false if self.timecode_input.compare_to(self.timecode_output) == 1
      return false if self.timecode_input.compare_to(self.timecode_output) == 0
      return true
    end
    
    def output_already_exists?
      Dir.chdir(VideoSplitter::Constants::OUTPUT_ROOT_PATH)
      return Dir.glob("*").include?"#{self.output_filename}.#{self.output_format}"
    end
    
    def valid_attrs?
      return false if self.instance_values.values.include?nil
      return false unless self.timecode_input.valid?
      return false unless self.timecode_output.valid?
      return true
    end
    
  end
  
end