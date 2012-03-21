module VideoSplitter

  require 'find'
  require 'pathname'

  class VideoSplitter::ApplicationController < ActionController::Base

    respond_to :js, :json

    # ONLY FOR  Index method to render the video splitter output
    # outside.......
    def index
      Dir.chdir(VideoSplitter::Constants::INPUT_ROOT_PATH)
      path = Pathname.new(VideoSplitter::Constants::INPUT_ROOT_PATH)
      @inputs = inputs(path)
      Dir.chdir(VideoSplitter::Constants::OUTPUT_ROOT_PATH)
      @outputs = Dir.glob("*")
    end

    def delete
      file = params[:file]
      Utils.delete(file)
      flash[:messages] = "File eliminato"
      render :text => 'ok', :layout => false
    end

    def split
      callbacks  = get_callbacks()
      split_info = params[:split_info]
      director   = Director.new(split_info, callbacks)
      director.execute()
      @split_out = get_split_out(director.messages)
      respond_with(@split_out) 
    end

    def load

    end

    def edit

    end


    
    private

    def get_split_out(messages)
      # Get output file list
      Dir.chdir(VideoSplitter::Constants::OUTPUT_ROOT_PATH)
      output_files = Dir.glob("*").sort_by{|file|
        File.mtime("#{VideoSplitter::Constants::OUTPUT_ROOT_PATH}/#{file}")
      }.reverse!
      # Get new splitted items
      new_items = render_to_string({ :partial => 'output_file', :collection => messages[:successful] })
      puts new_items
      return {
        :output_files => output_files,
        :new_items => view_context.escape_javascript(new_items), # hack for using ActionView Helper in our controller
        :successful => messages[:successful],
        :errors => messages[:errors],
        :inPath => VideoSplitter::Constants::INPUT_ROOT_PATH,
        :outPath => VideoSplitter::Constants::OUTPUT_ROOT_PATH
      }.to_json.html_safe
    end

    def get_callbacks()
      callbacks = HashWithIndifferentAccess.new()
      params[:callbacks].each{|cb, method|
        callbacks[cb] = Proc.new{|report|
          return false if cb.blank?
          as = AfterSplit.new(report)
          as.send(method)
        }
      }
      return callbacks
    end

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
