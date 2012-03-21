(function($) {
  $.extend(MediaElementPlayer.prototype, {
    buildvideosplitter: function(player, controls, layers, media) {
      var t = this;
      this.inPoint = null;
      this.outPoint = null;
      t.player = player;
      // create the markIn button
      t.markIn = $('<div id="'+ player.id +'_markIn" class="mejs-button mejs-markIn-button ' + ((player.options.markers) ? 'mejs-markers-on' : 'mejs-markers-off') + '">' +
        '<button type="button" aria-controls="' + t.id + '" title="set IN point"></button>' +
        '</div>')
      // append it to the toolbar
      .appendTo(controls);
      // add a click toggle event
      t.markIn.click(function() {
        $('#'+ t.player.id +'_markIn').removeClass('mejs-markers-off').addClass('mejs-markers-on');
        $('#'+ t.player.id +'_markIn').next().children().html(mejs.Utility.secondsToTimeCode( t.getCurrentTime(), true )).css('color','#fff');
        t.inPoint = this.getCurrentTime();
        if(!t.validInPoint()){
          t.resetOutPoint(); // deactivate out point
          return false;
        }
        if(this.outPoint == null) return false;
        t.ok();
        t.createSubclip(player,media); // create subclip
      }.bind(this));

      t.inTime = $('<div id="'+ player.id +'_inTime" class="mejs-time-in">'+
        '<span class="mejs-currenttime-in">' + (player.options.alwaysShowHours ? '00:' : '')
        + (player.options.showTimecodeFrameCount? '00:00:00':'00:00')+ '</span>'+
        '</div>')
      .appendTo(controls);

      t.outTime = $('<div id="'+ player.id +'_outTime" class="mejs-time-out">'+
        '<span class="mejs-currenttime-out">' + (player.options.alwaysShowHours ? '00:' : '')
        + (player.options.showTimecodeFrameCount? '00:00:00':'00:00')+ '</span>'+
        '</div>')
      .appendTo(controls);


      // create the markOut button
      t.markOut = $('<div id="'+ player.id +'_markOut" class="mejs-button mejs-markOut-button ' + ((player.options.markers) ? 'mejs-markers-on' : 'mejs-markers-off') + '">' +
        '<button type="button" aria-controls="' + t.id + '" title="set OUT point"></button>' +
        '</div>')
      // append it to the toolbar
      .appendTo(controls)
      // add a click toggle event
      t.markOut.click(function() {
        if(t.getCurrentTime() == 0 ) return false;
        $('#'+ t.player.id +'_markOut').removeClass('mejs-markers-off').addClass('mejs-markers-on');
        $('#'+ t.player.id +'_markOut').prev().children().html(mejs.Utility.secondsToTimeCode( t.getCurrentTime(), true )).css('color','#666').css('color','#fff');
        t.outPoint = this.getCurrentTime();
        if(!t.validOutPoint()){
          t.resetInPoint(); // deactivate out point
          return false;
        }
        if(this.inPoint == null) return false;
        t.ok();
        t.createSubclip(player,media);  // create subclip
      }.bind(this));
    },
    fileName: function(media){
      return unescape(media.src.split('/').slice(-1)[0]);
    },
    fullPath: function(player){
      var op = player.options;
      path = (op.clipType == 'subClip') ? op.path.outPath : op.path.inPath;
      return path + '/' + player.options.path.filePath;
    },
    createSubclip: function(player,media){
      var scContainer = $('#subclips');
      this.index = scContainer.children().length;
      var sc = $('<div class="scWrapper">' +
        '  <div class="clip-input-name">' +
        '    File input: <strong>' + this.fileName(media) + '</strong>' +
        '  </div>' +
        '  <div class="clip-controls">' +
        '    <button title="Play/Pause" id="play_'+ this.index +'" class="play" type="button">Riproduci</button>' +
        '    <button title="Cut" id="cut_'+ this.index +'" class="cut" type="button">Taglia</button>' +
        '    <button title="Delete" id="delete_'+ this.index +'" class="delete" type="button">Elimina</button>' +
        '  </div>' +
        '  <div class="clip-output-name">' +
        '    Nome file output: <input type="text" class="clip-output-name" name="clip-output-name-text" />' +
        '  </div>' +
        '  <div class="subClip" style="width:'+ (scContainer.width()-57) +'px;" id="sc_' + this.index + '"></div>' +
        '  <div class="clip-range">' +
        '    Taglio da: <input type="text" value="'+ this.sanitizeTC(mejs.Utility.secondsToTimeCode(this.inPoint, true)) + '" class="clip-range-from" id="clip-range-from-' + this.index + '" />' +
        '    a:         <input type="text" value="'+ this.sanitizeTC(mejs.Utility.secondsToTimeCode(this.outPoint, true)) +'" class="clip-range-to" id="clip-range-to-' + this.index + '" />' +
        '  </div>' +
        '</div>');
      if(this.index == 0){
        sc.appendTo(scContainer);
      }else{
        sc.insertAfter($("div.scWrapper:last"));
      }
      // add "split all" Button
      if(this.index == 1){
        $('<button title="Split all" id="split_all" class="splitAll" type="button">Split all</button>')
        .appendTo(scContainer)
        .click(function(){
          aSubClips = $('div.scWrapper');
          this.split(aSubClips, player, media);
        }.bind(this))
      }
      // Make buttons
      $('button').button();
      // Make slider
      $('#sc_' + this.index).slider({
        range: true,
        min: 0,
        max: media.duration,
        values: [ this.inPoint, this.outPoint],
        slide: function( event, ui ) {
          el = $(event.target);
          el.closest('.scWrapper').find('.clip-range-from').val(
          this.sanitizeTC(mejs.Utility.secondsToTimeCode(ui.values[0], true))
        );
          el.closest('.scWrapper').find('.clip-range-to').val(
          this.sanitizeTC(mejs.Utility.secondsToTimeCode(ui.values[1], true))
        );
        }.bind(this)
      })

      $('#cut_'+ this.index).click( function(ev) {
        el = ev.currentTarget;
        aSubClips = [$(el).closest('div.scWrapper')];
        this.split(aSubClips, player, media);
      }.bind(this));

      $('#play_'+ this.index).click( function(ev) {
        el = ev.currentTarget;
        video_preview.media.removeEventListener('progress');
        // Buffering already complete
        if(video_preview.media.buffered.end(0) == video_preview.media.duration){
          this.seekToInPoint(el);
          return true;
        }
        video_preview.media.addEventListener('progress', this.checkLoadingAndSeek.bind(this));
      }.bind(this))

      $('#delete_'+ this.index).click(function(){
        $(this).closest('div.scWrapper').hide('highlight',{},1000, function(){
          $(this).remove();
          if($('div.scWrapper').length < 2) $('#split_all').remove();
        });
      });
    },
    checkLoadingAndSeek: function(){
      if(video_preview.media.buffered.end(0) / video_preview.media.duration > 0){
        $('div.mejs-loading').hide();
        console.log(video_preview.media.buffered.end(0) / video_preview.media.duration);
        this.seekToInPoint(el);
        video_preview.media.removeEventListener('progress');
      }
    },
    seekToInPoint: function(el){
      wr = $(el).closest('div.scWrapper');
      index = $('div.scWrapper').index(wr);
      console.log("index: " + index);
      video_preview.setCurrentTime(this.TcToSec( $('#clip-range-from-' + index).val() ) );
      video_preview.setCurrentRail();
    },
    split: function(elems, player, media){
      if(elems.length == 0) return false;
      
      // Loading Dialog
      $("#dialog-message").createDialog();

      // Build data to pass
      obj = [];
      $.each(elems, function(index, el) {
        obj.push({
          input_filename: this.fullPath(player),
          output_filename: $(el).find('input.clip-output-name').val(),
          timecode_input: this.TcToSec($(el).find('input.clip-range-from').val() ),
          timecode_output: this.TcToSec($(el).find('input.clip-range-to').val())
        })
      }.bind(this))
      // Request to the server
      $.ajax({
        url: '/video_splitter/split',
        data: {
          split_info: obj,
          callbacks: $.parseJSON( $('#video_splitter_callbacks').val() )
          //,paths: {inPath: player.options.path.inPath, outPath: player.options.path.outPath }
        },
        dataType: 'script'
      })
    },
    ok: function(){
      this.inTime.effect( 'pulsate', {}, 400, function(){
        this.resetInPoint();
      }.bind(this));
      this.outTime.effect( 'pulsate', {}, 400, function(){
        this.resetOutPoint();
      }.bind(this));
    },
    resetInPoint: function(){
      this.markIn.removeClass('mejs-markers-on').addClass('mejs-markers-off');
      this.inTime.children().html(mejs.Utility.secondsToTimeCode(0, true)).css('color','#666')
      this.inPoint = null;
    },
    resetOutPoint: function(){
      this.markOut.removeClass('mejs-markers-on').addClass('mejs-markers-off');
      this.outTime.children().html(mejs.Utility.secondsToTimeCode(0, true)).css('color','#666');
      this.outPoint = null;
    },
    resetAllPoint: function(){
      this.resetInPoint();
      this.resetOutPoint();
    },
    validInPoint: function(){
      if(this.inPoint == 0 && this.TcToSec(this.outTime.children().html()) == '0') return false;
      return (this.inPoint < this.outPoint);
      //return (this.inPoint < this.TcToSec( this.inTime.children().html() ) );
    },
    validOutPoint: function(){
      //if(this.inPoint == 0 && this.TcToSec(this.outTime.children().html()) == '0') return false;
      return (this.inPoint < this.outPoint);
      //return !(this.inPoint == null);
      //return (this.getCurrentTime() >= this.TcToSec( this.outTime.children().html() ) );
    },
    TcToSec: function(val){
      return mejs.Utility.timeCodeToSeconds( this.sanitizeTC(val) );
    },
    sanitizeTC: function(time){
      rtc = [];
      atc = time.split(':');
      if(atc.length == 3) return time;
      for(var i = 3; i >= atc.length; i--){
        if(i > atc.length) rtc.push('00');
      }
      return $.merge(rtc,atc).join(':');
    }
  });

})(mejs.$);


(function($) {
  $.extend(MediaElementPlayer.prototype, {
    buildnewline: function(player, controls, layers, media) {
      var
      t = this,
      // create the newLine stuff
      nl = $('<div class="mejs-breakLine"></div>').appendTo(controls)
    }
  });
})(mejs.$);


var video_preview = null;

function loadFile(options){
  var el = options.el;
  $('.clip-current').removeClass('clip-current');
  $(el).addClass('clip-current');
  var clipType = options.clipType;
  var master = (clipType == 'master');
  var readFolder = master ? options.inPath : options.outPath ;
  var src = '/' + readFolder.split('/public/')[1] + '/' + options.file;
  
  if(video_preview){
    video_preview.pause();
    video_preview = null;
    $('.preview').html('');
  }

  $('<video id="video_preview" autoplay="true" src="'+ src +'"' +
    'controls="controls" preload="none" width="420" height="340"></video>')
  .appendTo('.preview');

  video_preview = new MediaElementPlayer('#video_preview', {
    features: ['playpause','current','progress','duration','volume','newline','videosplitter'],
    flashName: '../flashmediaelement.swf',
    silverlightName: '../silverlightmediaelement.xap',
    alwaysShowHours: true,
    clipType: clipType,
    path: {inPath: options.inPath, outPath: options.outPath, filePath: options.file},
    success: function(){
      $('div.mejs-overlay-play').hide();
      $('div.mejs-loading').show();
      console.log('Player loaded!');
    }
  })

}
