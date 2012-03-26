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
    init : function( options ) {

      var settings = $.extend( {
        resizeWidth:true
      }, options);

      //change the main div to overflow-hidden as we can use the slider now
      this.css('overflow','hidden');
      this.each(function(){
 
        var scrollableEl  = $(this);
        var scrollWrapper = scrollableEl.closest('.scrollable-wrapper');
        //compare the height of the scroll content to the scroll pane to see if we need a scrollbar
        var difference = scrollableEl.height() - scrollWrapper.height();//eg it's 200px longer

        if(difference<=0){
          scrollableEl.css({
            marginTop:0,
            width: settings.resizeWidth ? scrollWrapper.width()-1 : ''
          });
          return true;
        }

        // Adjust scroll wrapper width to insert the scrollbar
        if(settings.resizeWidth) scrollableEl.css({width:scrollWrapper.width()-14});

        var proportion = difference / scrollableEl.height();//eg 200px/500px
        var handleHeight = Math.round((1-proportion)*scrollWrapper.height());//set the proportional height - round it to make sure everything adds up correctly later on
        handleHeight -= handleHeight%2;

        var scrollRail = $('<div class="scroll-box-rail"></div>').appendTo(scrollWrapper);
        var scrollBox =  $('<div class="scroll-box"></div>').appendTo(scrollWrapper);

        scrollBox.height(scrollWrapper.height());//set the height of the slider bar to that of the scroll pane

        //set up the slider
        scrollBox.slider({
          orientation: 'vertical',
          min: 0,
          max: 100,
          value: 100,
          slide: function(event, ui) {//used so the content scrolls when the slider is dragged
            var topValue = -((100-ui.value)*difference/100);
            scrollableEl.css({
              marginTop:topValue
            });//move the top up (negative value) by the percentage the slider has been moved times the difference in height
          },
          change: function(event, ui) {//used so the content scrolls when the slider is changed by a click outside the handle or by the mousewheel
            //console.log('CHANGE!!!');
            var topValue = -((100-ui.value)*difference/100);
            scrollableEl.css({
              marginTop:topValue
            });//move the top up (negative value) by the percentage the slider has been moved times the difference in height
          }

        });

        //set the handle height and bottom margin so the middle of the handle is in line with the slider
        $('.ui-slider-handle', scrollWrapper).css({
          height:handleHeight,
          'margin-bottom':-0.5*handleHeight
        });

        var origSliderHeight = scrollBox.height();//read the original slider height
        var sliderHeight = origSliderHeight - handleHeight ;//the height through which the handle can move needs to be the original height minus the handle height
        var sliderMargin =  (origSliderHeight - sliderHeight)*0.5;//so the slider needs to have both top and bottom margins equal to half the difference
        $('.ui-slider', scrollWrapper).css({
          height:sliderHeight,
          'margin-top':sliderMargin
        });//set the slider height and margins

        $('.ui-slider', scrollWrapper).click(function(event){//stop any clicks on the slider propagating through to the code below
          event.stopPropagation();
        });

        scrollRail.click(function(event){//clicks on the wrap outside the slider range
          var offsetTop = scrollWrapper.offset().top;//read the offset of the scroll pane
          var clickValue = (event.pageY-offsetTop)*100/scrollWrapper.height();//find the click point, subtract the offset, and calculate percentage of the slider clicked
          scrollBox.slider("value", 100-clickValue);//set the new value of the slider
        });

        //additional code for mousewheel
        $(scrollWrapper,scrollRail).mousewheel(function(event, delta){
          var speed = $.browser.webkit ? 5 : 2.5 ;
          var sliderVal = scrollBox.slider("value");//read current value of the slider
          sliderVal += (delta*speed);//increment the current value
          scrollBox.slider("value", sliderVal);//and set the new value of the slider
          event.preventDefault();//stop any default behaviour
        });

      })

    },
    destroy : function() {
      wr = this.closest('.scrollable-wrapper');
      wr.find('.scroll-box-rail').remove();
      wr.find('.scroll-box').remove();
    },
    update : function() {
      if(!this.selector.match(/\.scrollable/)) return false;
      var el = this;
      var wr = this.closest('.scrollable-wrapper');
      var sb = wr.find('.scroll-box');
      valBefore = sb.slider('option', 'value');
      el.scrollable('destroy');
      el.scrollable();
      if(typeof valBefore == 'number') {
        $(".scroll-box", wr).slider( "option", "value", valBefore );
      }
    }
  };

  $.fn.scrollable = function(method) {
    if ( methods[method] ) {
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery ui scrollable' );
    }  
  };
})( jQuery );
