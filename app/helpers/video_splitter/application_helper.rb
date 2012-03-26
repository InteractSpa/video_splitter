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
  module ApplicationHelper

    # Each method in this Helper is overridable by a method in the
    # host_application_root/app/helpers/application_helper.rb file
    # So you ca define a totally custom render_video_splitter method in order to get
    # your desired input files or anything else.

    def render_video_splitter(callbacks = {})
      @callbacks = callbacks.to_json
      Dir.chdir(VideoSplitter::Constants::INPUT_ROOT_PATH)
      path = Pathname.new(VideoSplitter::Constants::INPUT_ROOT_PATH)
      @inputs = inputs(path)
      Dir.chdir(VideoSplitter::Constants::OUTPUT_ROOT_PATH)
      @outputs = Dir.glob("*")
      render :partial => 'video_splitter/application/edit'
    end

    def input_list
      root_key = @inputs.keys.first
      out  = '<ul>'
      @inputs[root_key].each do |elem|
        out += elem.is_a?(String) ? draw_file(elem) : draw_folder(elem)
      end
      out += '</ul>'
      out.html_safe
    end

    def draw_file(elem)
      out = <<-EOS
      <li class="item">
        <a class="loadMedia" rel="#{elem.split('/video/input/').last()}" href="javascript:void(0);">#{elem.split('/').last()}</a>
      </li>
      EOS
      out
    end

    def draw_folder(elems)
      return '' if elems.blank?
      return draw_file(elems) if elems.is_a?(String)
      out = ''
      elems.each_pair do |key,value|
        out += '<li class="folder">'
        out += '<strong><a class="folderLink" href="javascript:void(0);">' + key + '</a></strong>'
        out += '<ul class="items" style="display:none;margin-top:3px;">'
        value.each do |el|
          out += draw_folder(el)
        end
        out += '</ul>'
      end
      out
    end

    private

    def inputs(path)
      aa = HashWithIndifferentAccess.new()
      aa[path.basename.to_s] = []
      files = path.children.select{|el| el.file? }
      folders = path.children.select{|el| el.directory? }
      folders.each do |folder|
        aa[path.basename.to_s].push(inputs(folder) )
      end
      files.each do |file|
        aa[path.basename.to_s].push(file.to_s) unless file.basename.to_s.match(/^\./)
      end
      return aa
    end

  end
end
