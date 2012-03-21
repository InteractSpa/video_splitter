module VideoSplitter

  # This class includes supported splitter profile
  class SplitterStrategy

    @@strategy = {
      :f4v => F4vSplitter,
      :wmv => WmvSplitter,
      :mp4 => Mp4Splitter
    }

    def self.make split_detail
      strategy = @@strategy[split_detail.input_format.to_sym].new split_detail
      return strategy
    end

    def self.supports? split_detail
      @@strategy.include? split_detail.input_format.to_sym
    end

  end

end