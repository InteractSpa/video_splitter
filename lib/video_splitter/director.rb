module VideoSplitter
  
  # Director class manages whole split process. It uses splitting details to demands
  # the Strategy class and call split method
  class Director
    
    attr_accessor :messages
    
    def initialize(_params = [], callbacks = {})
      @messages = {:successful => [], :errors => []}
      @split_details = load_split_details(_params.values)
      @callbacks = callbacks
    end
   
    def execute
      @split_details.each do |split_detail|
        split_one split_detail
        # After each split callback
        @callbacks[:after_each_split].call(JSON.parse(split_detail.to_json))
      end
      # After all splits callback
      @callbacks[:after_all_splits].call({
        :errors => self.messages[:errors],
        :successful => self.messages[:successful]
      })
    end

    # Reset successful and errors attributes
    def reset
      self.messages[:successful] = []
      self.messages[:errors] = []
    end
    
    private 
    
    def load_split_details(_params)
      arr = [] 
      _params.each do |obj|
        detail = SplitDetail.new(obj)
        if detail.valid?
          check_and_include(arr, detail)
        else
          add_error("#{detail.output_filename}.#{detail.output_format}")
        end
      end
      return arr
    end
    
    # If you're splitting more files, this method verify file name uniqueness and 
    # return an array within SplitDetail instance
    def check_and_include _arr, _detail
      _arr.map{|det| det.output_filename}.include?(_detail.output_filename) ?
          add_error("#{_detail.output_filename}.#{_detail.output_format}") :
          _arr << _detail
    end
    
    # The core method
    def split_one split_detail
      if can_split? split_detail
        splitter = VideoSplitter::SplitterStrategy.make split_detail
        response = splitter.split
        response == false ? add_error("#{split_detail.filename}") :
                            add_notification("#{split_detail.output_filename}.#{split_detail.output_format}")
      else
        add_error("#{split_detail.output_filename}.#{split_detail.output_format}")
      end
    end
    
    # Check if application supports input file format
    def can_split? split_detail
      VideoSplitter::SplitterStrategy.supports? split_detail
    end
    
    def add_error _text
      @messages[:errors] << _text
    end
    
    def add_notification _text
      @messages[:successful] << _text
    end
    
  end

end