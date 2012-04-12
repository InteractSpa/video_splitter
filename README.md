# Video Splitter

Video Splitter (VS) is a video-utility, released as a ruby gem, that allows you to split video files.

## Supported formats

VS supports __wmv__, __f4v__ (or __flv__) and __mp4__ video formats.
It implements a splitting strategy based on video file extension.
It's easy to implement others strategy by putting a splitter_strategy.rb file in your
lib/video_splitter folder, and by adding a key/value (:ext => YourFormatSplitter) pair in the @@strategy hash (as you can override the gem class).

## Setup

VS requires rails 3.2 or newer, so first of all, install it:

> gem install rails -v 3.2

You can easily build up a brand new rails application that use video splitter by using the _video_splitter.rb_ template, executing this command:

> rails my_app -m https://raw.github.com/InteractSpa/interactspa.github.com/master/templates/video_splitter/video_splitter.rb

Or simply include it in your _Gemfile_:

> gem 'video_splitter', :git => 'git@github.com:InteractSpa/video_splitter.git'

and then run

> bundle install

> rails generate video_splitter:install

The __video_splitter:install generator__ do some rilevant action that you need to be aware of:

* copies the [__video_splitter.yml__](#video-splitter-configuration "click for details") in your config folder
* copies an [__after_split.rb__](#after-split-callbacks "click for details") class in your lib/video_splitter folder
* copies the [__video-splitter.split_done.js__](#after-split-rendering "click for details") in your assets/javascripts folder
* copies the __index.html.erb__in your app/views/application folder   
and inject the __index action__ (as just to make the application runnning) in your __application_controller.rb__
* creates __input and output video folders__ in your public/video folder
* adds the __video_splitter routes__ in your routes.rb file
* adds [__js and css require__](#js-and-css-require "click for details") in your application.js and in your application.css
* adds the __lib folder__ to the autoload paths

<a name="video-splitter-configuration"></a>
<h3 id="video-splitter-configuration">Video Splitter configuration</h3>
In any case you have to setup the __video_splitter.yml__ with your local paths:

* _ffmpeg_path_: path to your local ffmpeg binaries (tipically /usr/bin/ffmpeg)
* _input_folders_: an hash that define paths and labels for your local input folders

Keep in mind that input folders you specify on video_splitter.yml will be mounted on your __public/video/input__ folder.

<a name="after-split-callbacks"></a>
### After split callbacks
VideoSplitter::AfterSplit class menages the after split process callbacks:

* after_each_split
* after_all_splits (in case of batch splitting)

It defines methods optionally passed to __render_video_splitter__ helper:

> render_video_splitter({
    :after_each_split => :do_something_after_each_split,
    :after_all_splits => :do_something_after_all_splits
})

The __after_each_split__ callback can access info stored in the @options hash:

* _output_filename_: only the new splitted file name, without extension
* _output_format_: the new splitted file extension
* _timecode_input_: the original file inpoint from which the cut was done
* _timecode_output_: the original file outpoint to which the cut was done
* _video[:file_path]_: the original file path
* _length_: length of the new splitted video in seconds

The __after all splits__ callback can access info stored in the @options hash.
It provides informations about the whole splitting process, so you'll have two arrays:

* _successful_: successfuly splitted files (one or many)
* _errors_: unsuccessfuly splitted files (one or many)

<a name="after-split-rendering"></a>
### After split rendering
After all splits (after the whole splitting process) you may want to render something.
To do this, in your assets/javascripts folder you'll find a __video-splitter.split_done.js__ that implements a __splitDone__ method.
You can modify it as you want.
        
<a name="js-and-css-require"></a>
### Js and Css require
As VS is provided with jQuery and jQuery UI libraries, the install generator removes their requires from your application.js

## Requirements and dependencies

VS needs __ffmpeg__ installed on your local machine.
For more information about ffmpeg visit [http://ffmpeg.org/](http://ffmpeg.org/)

Other useful links for a correct ffmpeg installation:

* for [Mac OS](http://ffmpeg.org/trac/ffmpeg/wiki/MacOSXCompilationGuide)
* for [Ubuntu](http://ubuntuforums.org/showpost.php?p=9868359&postcount=1289)

Vs use the __mediaelement.js__ library (HTML5 <video> and <audio> shim and player [http://mediaelementjs.com/](http://mediaelementjs.com/)) and provides
a plugin (mep-feature-videosplitter.js) that adds in/out markers to it. It also draws a __subclip timeline__ using jQuery UI slider.

## Usage

Once you have VS gem installed on your machine and _video_splitter.yml_ properly configured, you can access it at this url: [http://localhost:3000/video_splitter](http://localhost:3000/video_splitter)

## Contributing to VS

* Check out the latest master to make sure the feature hasn't been implemented or the bug hasn't been fixed yet
* Check out the issue tracker to make sure someone already hasn't requested it and/or contributed it
* Fork the project
* Start a feature/bugfix branch
* Commit and push until you are happy with your contribution
* Make sure to add tests for it. This is important so I don't break it in a future version unintentionally.
* Please try not to mess with the Rakefile, version, or history. If you want to have your own version, or is otherwise necessary, that is fine, but please isolate to its own commit so I can cherry-pick around it.


## To do

* Some test.
* Grep TODO annotations.
* A branch for earlier Rails version (e.g. 2.3.14)
* Better methods documentation for Rdoc
* Improve this readme file, possibly with a better english :)
* Publish the VS gem to rubygems.org

## Credits
VS is Copyright (c) 2012 Interact S.P.A.
It is free software, and may be redistributed under the terms specified in the LICENSE.txt file.

