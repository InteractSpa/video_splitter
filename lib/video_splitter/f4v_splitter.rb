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