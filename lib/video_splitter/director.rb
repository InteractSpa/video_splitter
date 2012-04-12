###############################################################################
##################################################################################
#
# This file is part of VIDEO SPLITTER (VS), a video-utility released as a ruby gem
# that allows you to split video files.
#
# Copyright (c) 2012 Interact S.P.A.
#
# VS is free software: you can redistribute it and/or modify
# it under the terms of the GNU Lesser General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# VS is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Lesser General Public License for more details.
#
# You should have received a copy of the GNU Lesser General Public License
# along with VS.  If not, see <http://www.gnu.org/licenses/>.
#
# Contact us via email at meccanica@interact.it or at
#
# Interact S.P.A.
# Via Angelo Bargoni, 78
# 00153 Rome, Italy
#
#################################################################################
#################################################################################

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
        @callbacks[:after_each_split].call(JSON.parse(split_detail.to_json)) if @callbacks[:after_each_split]
      end
      # After all splits callback
      @callbacks[:after_all_splits].call({
        :errors => self.messages[:errors],
        :successful => self.messages[:successful]
      }) if @callbacks[:after_all_splits]
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