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

  # This class includes supported splitter profile
  class SplitterStrategy

    @@strategy = {
      :f4v => F4vSplitter,
      :flv => F4vSplitter,
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