module VideoSplitter
  
  # Timecode class manages input and output timecode values
  class Timecode
    attr_accessor :value
    
    def initialize _time
      @value = _time.to_i unless _time.to_s.match(/^\d+$/).nil?
      @value = $1.to_i*3600 + $2.to_i*60 + $3.to_i unless _time.to_s.match(/^(\d{1,2})\:(\d{1,2})\:(\d{1,2})$/).nil?
      @value = $1.to_i*60 + $2.to_i unless _time.to_s.match(/^(\d{1,2})\:(\d{1,2})$/).nil?
    end
    
    # Return false if timecode value is nil
    def valid?
      !@value.nil?
    end
    
    # Return timecode value in hh:mm:ss
    def formatted_value
      Time.at(@value).gmtime.strftime('%R:%S')
    end
    
    # Compare self with other timecode object. Return 1 if its value 
    # is longer, 0 if equals, -1 if shorter
    def compare_to timecode
      return -1 if shorter? timecode
      return 0 if equal? timecode
      return 1 if longer? timecode
    end
    
    private
    
    def longer? timecode
      return true if self.value > timecode.value
      return false
    end
    
    def shorter? timecode
      return true if self.value < timecode.value
      return false
    end
    
    def equal? timecode
      return true if self.value == timecode.value
      return false
    end
    
  end
  
end