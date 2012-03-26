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