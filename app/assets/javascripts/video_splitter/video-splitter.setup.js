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

(function( $ ) {

  var methods = {
    init : function(options) {
      var settings = $.extend( {
        }, options);

      var el = this;
      // behaviors depend on element selector
      var behaviors = el.selector.replace(/#\w+\s/,'').split('.');
      $.each(behaviors, function(ii, behavior) {
        // Camelize method
        var method = ('make_' + behavior).replace( /[-_]([a-z])/ig, function(z,b){
          return b.toUpperCase();
        });
        if (!methods[method] ) return true ; // Method doesn't exists, skip it!
        // Run method
        return methods[method].apply(this, [settings]);
      }.bind(this))
    },
    makeScrollable: function(options){
      this.scrollable();
    },
    makeAccordion: function(options) {
      this.accordion({
        collapsible: true,
        active: 999999,
        header: 'h3.accordion',
        changestart: function(ev, ui){
          $($('.play-delete-clip', this)).hide();
          ui.newHeader.find('.play-delete-clip').show();
          ui.oldHeader.removeClass('ui-state-hover').bind('mouseleave', function(ev){
            $('.play-delete-clip', this).hide();
            $(this).removeClass('ui-state-hover');
            ev.stopPropagation();
          });
          ui.newHeader.unbind('mouseleave');
        },
        change: function(ev, ui){
          $(this).closest('.scrollable').scrollable('update');
        }
      });
      // Show/Hide play and delete buttons
      this.accordion('clipControls');
    },
    makeButtons: function(options){
      this.find('.play').button({
        icons: {
          primary: "ui-icon-play"
        },
        text: false
      }).click(function(ev){
        console.log('click');
        ev.stopPropagation();
        el = ev.currentTarget;
        opt = {
          file: $(this).closest('h3').attr('title'),
          el: $(el),
          clipType: 'subClip'
        }
        mm = $.extend(options, opt)
        loadFile(mm);
      })

      this.find('.delete').button({
        icons: {
          primary: "ui-icon-trash"
        },
        text: false
      }).click(function(ev){
        ev.stopPropagation();
        $("#dialog-message").createDialog().updateDialog({
          title: 'Delete file',
          text: 'Sei sicuro di voler eliminare il file <br /><strong>' + $(this).closest('h3').attr('title') + '</strong>?',
          buttons: { 
            'delete file': function() {
              var request = $.ajax({
                type: 'POST',
                url: '/video_splitter/delete',
                context: $(this).closest('h3'),
                data: {
                  file: $(this).closest('h3').attr('title')
                }
              })
              request.done(function(msg) {
                index = $('#output_list h3').index($(this));
                $("#dialog-message").dialog('close');
                $('#output_list h3:eq('+ index +'),#output_list div.accordion-item:eq('+ index +')')
                .fadeOut('slow', function() {
                  $(this).removeFromAccordion();
                });

              });
              request.fail(function(jqXHR, textStatus) {
                console.log( "Request failed: " + textStatus );
              });
            }.bind(this),
            'cancel': function() {
              $(this).dialog('close')
            }
          }
        });
      })
    },
    makeTree: function(options){
      $('a.folderLink').click(function(ev){
        el = $(ev.currentTarget).closest('.folder');
        el.toggleClass('open');
        ul = el.find('.items:first');
        if(ul.children().length == 0) return false ;
        el.find('.items:first').toggle('blind', {}, 180, function(ev){
          el.closest('.scrollable').scrollable('update', options);
        });
      })

      $('a.loadMedia').click(function(ev){
        el  = ev.currentTarget;
        opt = {
          file: $(this).attr('rel'),
          el: $(el),
          clipType: 'master'
        };
        mm  = $.extend(options, opt)
        loadFile(mm);
      })
    }
    
  };


  // Factory
  $.fn.setUp = function(method) {
    if ( methods[method] ) {
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on video-splitter.setup.js' );
    }
  };
})( jQuery );




// Some accordion custom method
$.extend($.ui.accordion.prototype, {
  clipControls: function(){
    var el = this.element;
    $('h3', el).mouseenter(function(ev){
      $('.play-delete-clip', this).fadeIn();
      ev.stopPropagation();
    }).mouseleave(function(ev){
      $('.play-delete-clip', this).hide();
      ev.stopPropagation();
    })
  }
})

// -------- Some JQuery custom utility

// Return only the text of element and ignore all child elements
jQuery.fn.justtext = function() {
  str = $(this).clone()
  .children()
  .remove()
  .end()
  .text();
  return $.trim(str);
};

jQuery.fn.createDialog = function() {
  if($("#dialog-message").length > 0){
    $("#dialog-message").resetDialog();
    return $("#dialog-message");
  }
  
  $('<div id="dialog-message" title="Wait"><p><strong>Loading...</strong></p></div>')
  .appendTo('body');

  $("#dialog-message").dialog({
    modal: true,
    hide: 'puff',
    show: 'puff'
  })
  return $("#dialog-message");
}

jQuery.fn.resetDialog = function() {
  $('#dialog-message').dialog( "option", "title", 'Wait');
  $('#dialog-message').find('p').html('Loading...');
  $('#dialog-message').dialog( "option", "buttons", {})
  $("#dialog-message").dialog('open');
}


jQuery.fn.updateDialog = function(options) {
  $('#dialog-message').dialog( "option", "title", options.title);
  $('#dialog-message').dialog( "option", "buttons", options.buttons)
  $('#dialog-message').find('p').html(options.text);
}

jQuery.fn.removeFromAccordion = function() {
  scrollable = $(this).closest('.scrollable');
  el = $(this).closest('h3').length > 0 ? $(this).closest('h3') : $(this).prev('h3') ;
  el.next('.accordion-item').remove();
  el.remove()
  scrollable.scrollable('update');
}

// -------- Some JQuery custom utility END



// Monkey patch on setControlsSize method to
// correctly calculate the rail width
$.extend(MediaElementPlayer.prototype, {
  setControlsSize: function() {
    var t = this,
    usedWidth = 0,
    railWidth = 0,
    rail = t.controls.find('.mejs-time-rail'),
    total = t.controls.find('.mejs-time-total'),
    current = t.controls.find('.mejs-time-current'),
    loaded = t.controls.find('.mejs-time-loaded');
    
    // CUSTOM CODE BEGIN !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    breakLine = t.controls.find('.mejs-breakLine');
    prevs = rail.prevUntil(breakLine);
    next = rail.nextUntil(breakLine);
    others = $.merge(prevs,next) // was rail.siblings();
    // CUSTOM CODE END !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


    // allow the size to come from custom CSS
    if (t.options && !t.options.autosizeProgress) {
      // Also, frontends devs can be more flexible
      // due the opportunity of absolute positioning.
      railWidth = parseInt(rail.css('width'));
    }

    // attempt to autosize
    if (railWidth === 0 || !railWidth) {

      // find the size of all the other controls besides the rail
      others.each(function() {
        if ($(this).css('position') != 'absolute') {
          usedWidth += $(this).outerWidth(true);
        }
      });

      // fit the rail into the remaining space
      railWidth = t.controls.width() - usedWidth - (rail.outerWidth(true) - rail.outerWidth(false));
    }

    // outer area
    rail.width(railWidth);
    // dark space
    total.width(railWidth - (total.outerWidth(true) - total.width()));

    if (t.setProgressRail)
      t.setProgressRail();
    if (t.setCurrentRail)
      t.setCurrentRail();
  }
})