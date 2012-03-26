## Video Splitter

Video Splitter (_VS_) is a video-utility, released as a ruby gem, that allow you to split video files.

## Setup

_VS_ requires rails 3.2 or newer, so first of all, please install it:

> gem install rails -v 3.2

You can easily build up a brand new rails application that use video splitter by using the _video_splitter.rb_ template, executing this command:

> rails my_app -m https://raw.github.com/InteractSpa/interactspa.github.com/master/templates/video_splitter/video_splitter.rb

Or simply include it in your _Gemfile_:

> gem 'video_splitter', :git => 'git@github.com:InteractSpa/video_splitter.git'

and then run

> bundle install
> rails generate video_splitter:install

In both cases you have to setup the _video_splitter.yml_ with your local paths:

* _ffmpeg_path_: path to ffmpeg binaries (tipically /usr/local/bin/ffmpeg)
* _input_folders_: an hash that define a path and a label for your input folders

_VS_ needs _ffmpeg_ installed on your local machine.
For more information about ffmpeg visit http://ffmpeg.org/


## Usage


Copyright (c) 2012 Interact Spa, released under the GPL license

