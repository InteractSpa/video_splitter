/********************************************************************************
*********************************************************************************
This file is part of VIDEO SPLITTER (VS), a video-utility released as a ruby gem
that allows you to split video files.

Copyright (c) 2012 Interact S.P.A.

VS is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

VS is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with VS.  If not, see <http://www.gnu.org/licenses/>.

Contact us via email at meccanica@interact.it or at

Interact S.P.A.
Via Angelo Bargoni, 78
00153 Rome, Italy
********************************************************************************
********************************************************************************/

/*

  A mediaelement.js plugin that adds in/out markers to it.
  It also draws a subclip timeline using jQuery UI slider.

*/

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
    fullPath: function(player, el){
      var op = player.options;
      path = (op.clipType == 'subClip') ? outPath : inPath;
      return path + '/' + $(el).find('input.clip-input-name').val();
    },
    createSubclip: function(player,media){
      var scContainer = $('#subclips');
      this.index = scContainer.children().length;
      var sc = $('<div class="scWrapper">' +
        '  <div class="clip-input-name">' +
        '    <input type="hidden" value="'+ media.src.split('/input/').slice(-1)[0] +'" class="clip-input-name">' +
        '    Input file : <strong>' + this.fileName(media) + '</strong>' +
        '  </div>' +
        '  <div class="clip-controls">' +
        // TODO: the play button is disabled for now: it's harder than espected play a subclip
        // of a master video. Medialement provides a setCurrentTime method, but it requires a totally
        // ended buffering. In short, is pain in the ass.
        // ' <button title="Play/Pause" id="play_'+ this.index +'" class="play" type="button">Play</button>' +
        '    <button title="Cut" id="cut_'+ this.index +'" class="cut" type="button">Split</button>' +
        '    <button title="Delete" id="delete_'+ this.index +'" class="delete" type="button">Remove</button>' +
        '  </div>' +
        '  <div class="clip-output-name">' +
        '    Output filename: <input type="text" class="clip-output-name" name="clip-output-name-text" />' +
        '  </div>' +
        '  <div class="subClip" style="width:'+ (scContainer.width()-57) +'px;" id="sc_' + this.index + '"></div>' +
        '  <div class="clip-range">' +
        '    Split from: <input readonly="readonly" type="text" value="'+ this.sanitizeTC(mejs.Utility.secondsToTimeCode(this.inPoint, true)) + '" class="clip-range-from" id="clip-range-from-' + this.index + '" />' +
        '    to:         <input readonly="readonly" type="text" value="'+ this.sanitizeTC(mejs.Utility.secondsToTimeCode(this.outPoint, true)) +'" class="clip-range-to" id="clip-range-to-' + this.index + '" />' +
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

      $('#delete_'+ this.index).click(function(){
        $(this).closest('div.scWrapper').hide('highlight',{},1000, function(){
          $(this).remove();
          if($('div.scWrapper').length < 2) $('#split_all').remove();
        });
      });
      
      /*
      TODO
      $('#play_'+ this.index).click( function(ev) {
        el = ev.currentTarget;
        video_player.media.removeEventListener('progress');
        // Buffering already complete
        if(video_player.media.buffered.end(0) == video_player.media.duration){
          this.seekToInPoint(el);
          return true;
        }
        video_player.media.addEventListener('progress', this.checkLoadingAndSeek.bind(this));
      }.bind(this))
      */
    },
    /*
    TODO
    checkLoadingAndSeek: function(){
      if(video_player.media.buffered.end(0) / video_player.media.duration > 0){
        $('div.mejs-loading').hide();
        console.log(video_player.media.buffered.end(0) / video_player.media.duration);
        this.seekToInPoint(el);
        video_player.media.removeEventListener('progress');
      }
    },
    seekToInPoint: function(el){
      wr = $(el).closest('div.scWrapper');
      index = $('div.scWrapper').index(wr);
      playWhat = wr.find('input.clip-input-name').val();
      if(this.sameVideo(playWhat)){
        video_player.setCurrentTime(this.TcToSec( $('#clip-range-from-' + index).val() ) );
        video_player.setCurrentRail();
      }else{
        loadFile({
          clipType: 'master',
          file: playWhat,
          from: this.TcToSec( $('#clip-range-from-' + index).val() )
        });
      }
    },
    */
    sameVideo: function(playWhat){
      return (playWhat == video_player.media.src.split('input/').slice(-1)[0]);
    },
    split: function(elems, player, media){
      if(elems.length == 0) return false;
      
      // Loading Dialog
      $("#dialog-message").createDialog();

      // Build data to pass
      obj = [];
      $.each(elems, function(index, el) {
        obj.push({
          input_filename: this.fullPath(player,el),
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


/*

  A simple mediaelement plugin for drawing a newline

*/
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


var video_player = null;

loadFile = function(options){

  var clipType = options.clipType;
  var master = (clipType == 'master');
  var readFolder = master ? inPath : outPath ;
  var src = '/' + readFolder.split('/public/')[1] + '/' + options.file;
  var ext = options.file.split('.').slice(-1)[0];

  $('.clip-current').removeClass('clip-current');
  var el = options.el;
  $(el).addClass('clip-current');

  var settings = $.extend( {
    src: src,
    clipType: clipType,
    from: options.form
  }, options);

  if(video_player){
    var p_ext = video_player.media.src.split('.').slice(-1)[0];
    if(p_ext != ext){
      video_player = null;
      $('.preview').html('');
      buildPlayer(settings);
      return false;
    }
    video_player.pause();
    video_player.setSrc(src);
    video_player.options.filePath = options.file;
    video_player.options.clipType = clipType;
    if(ext == 'wmv'){
      video_player.load();
    }else{
      video_player.play();
    }
    return false;
  }

  buildPlayer(settings);
  
}

buildPlayer = function(settings){

  var s = settings;
  
  $('<video id="video_player" autoplay="true" src="'+ s.src +'"' +
    'controls="controls" preload="none" width="420" height="340"></video>')
  .appendTo('.preview');

  video_player = new MediaElementPlayer('#video_player', {
    features: ['playpause','current','progress','duration','volume','newline','videosplitter'],
    flashName: flashName, // global
    silverlightName: silverlightName, // global
    alwaysShowHours: true,
    clipType: s.clipType,
    filePath: s.file,
    success: function(){
      $('div.mejs-overlay-play').hide();
      $('div.mejs-loading').show();
      console.log('Player loaded!');
    }
  })

  /*
  if(settings.from){
    video_player.pause();
    setTimeout(function(){
      video_player.setCurrentTime(settings.from);
      video_player.setCurrentRail();
      video_player.play();
    }, 300)
  }
  */
}

