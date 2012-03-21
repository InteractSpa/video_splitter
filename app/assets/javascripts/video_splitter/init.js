// Once all js and css are loaded,
// initizialize video splitter components.
initialize = function(){
  var req = $.ajax({
    url: "/video_splitter/load",
    success: function(html){
      // Load HTML
      $(element).append(html);
    },
    fail: function(jqXHR, textStatus){
      console.log('FAILED!!');
    }
  }).done(function(msg) {
      // SETUP video splitter
      console.log("DONE!!!");
    });
}

loadJQ = function(file) {
  loadJQ.getScript(file);
  loadJQ.tryReady(0);
}

var ii = 1;
loadLibs = function(file){
  $.getScript(file, function(el) {
    console.log(file + ' loaded');
    if(ii == libs.length-1){
      initialize(); // all libs loaded: initizialize video splitter components
      return false;
    }
    ii++;
    loadLibs(libs[ii]);
  })
}

// Dynamically load any javascript file.
loadJQ.getScript = function(filename){
  var JQtag = document.createElement('script')
  JQtag.setAttribute("src", filename)
  if (typeof JQtag!="undefined") document.getElementsByTagName("head")[0].appendChild(JQtag);
}

// Override getScript method.
// to load js and css
loadJQ.extend = function(){
  jQuery.extend({
    getScript: function(url, callback) {
      var head = document.getElementsByTagName("head")[0];
      var ext = url.replace(/.*\.(\w+)$/, "$1");
      if(ext == 'js'){
        var script = document.createElement("script");
        script.src = url;
        script.type = 'text/javascript';
      } else if(ext == 'css'){
        var script = document.createElement("link");
        script.href = url;
        script.type = 'text/css';
        script.rel = 'stylesheet';
      } else {
        console.log("UNSUPPORTED FORMAT");
        return false;
      }
      // Handle Script loading
      {
        var done = false;
        // Attach handlers for all browsers
        script.onload = script.onreadystatechange = function(){
          if ( !done && (!this.readyState ||
            this.readyState == "loaded" || this.readyState == "complete") ) {
            done = true;
            if (callback)
              callback();
            // Handle memory leak in IE
            script.onload = script.onreadystatechange = null;
          }
        };
      }
      head.appendChild(script);
      // We handle everything using the script element injection
      return undefined;
    }
  });
}

loadJQ.tryReady = function(time_elapsed) {
  // Continually polls to see if file is loaded.
  if (typeof $ == "undefined") { // if file isn't loaded yet...
    if (time_elapsed <= 5000) { // and we havn't given up trying...
      setTimeout(function(){
        loadJQ.tryReady((time_elapsed + 100));
      }, 100)
    } else {
      console.log("Timed out while loading jQuery" )
    }
  }else {
    loadJQ.done();
  }
}

loadJQ.done = function(){
  console.log('JQ loaded!!!!!!!!!!!!!!!!');
  loadJQ.extend();
  loadLibs(libs[1]);
}

loadJQ(libs[0]); // Load first library: always Jquery
