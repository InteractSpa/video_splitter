$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "video_splitter/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "video_splitter"
  s.version     = VideoSplitter::VERSION
  s.authors     = ["Interact S.p.A."]
  s.email       = ["gianluca@interact.it"]
  s.homepage    = "TODO"
  s.summary     = %q{Enginization of video splitter}
  s.description = %q{A video-editing utility}

  s.files = `git ls-files -- {LICENSE.txt,Rakefile,README.md} {app,config,db,lib}/*`.split("\n")
  s.test_files = `git ls-files -- {test,spec,features}/*`.split("\n")
  s.executables = `git ls-files -- bin/*`.split("\n").map { |f| File.basename(f) }
  s.require_paths = ["lib"]

  s.add_dependency "bundler", "~> 1.1.0"
  s.add_dependency "rails", "~> 3.2.0"
end
