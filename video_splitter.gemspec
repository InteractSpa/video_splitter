$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "video_splitter/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "video_splitter"
  s.version     = VideoSplitter::VERSION
  s.authors     = ["Interact S.p.A."]
  s.email       = ["gianluca@interact.it"]
  s.homepage    = "http://www.interact.it"
  s.summary     = %q{Enginization of video splitter}
  s.description = %q{A video-editing utility}

  s.files = Dir["{app,config,db,lib}/**/*"] + ["Rakefile", "README.md"]
  s.test_files = Dir["test/**/*"]

  s.add_runtime_dependency "rails", ">= 3.2.0"
end
