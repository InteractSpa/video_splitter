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