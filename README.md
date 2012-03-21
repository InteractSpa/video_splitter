## Video Splitter

Video Splitter is a ruby gem that simply split video files, using a jquery interface.


## Setup

Video_splitter uses Bundler to manage gem dependencies. 
For more information about Bundler, go to http://gembundler.com/
Run "bundle install" to check all dependencies with Video_splitter.
If "Your bundle is complete!..." message not appear, you must install the required gems.

Video_splitter needs ffmpeg installed on your local machine to run correctly.
If you're using Ubuntu 10.04, you can follow this guide to install it:
http://ubuntuforums.org/showpost.php?p=9868359&postcount=1289
For more information about ffmpeg, visit http://ffmpeg.org/

Next step, you must setup __config.yml__ file. In config.yml.sample file you can get idea about
its configuration.
You need to insert parameters as below:

* _ffmbc_path_: path to ffmpeg binaries
* _input_folders_: hash that define a path and a label for existing input folders
* _publication_folders_: hash that define a path and a label for existing publication folders
* _mailer_: sender and receiver email address for notification messages

And finally from the host application root, run the __sync rake task__ :

> rake video_splitter:sync

and you've done!


Copyright (c) 2012 Interact Spa, released under the MIT license
