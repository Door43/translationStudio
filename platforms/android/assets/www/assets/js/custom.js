var CUSTOM = {};

function createUUID() {
    // http://www.ietf.org/rfc/rfc4122.txt
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}



//alert(createUUID());



// moves the curser to the end
$(document).on('focus','input,textarea', function(){
	
	//$('h1').html('focus 2.1');
	
	//console.log('focus');
	
	var input = $(this);

	
	setTimeout(function(){
	
		window.scrollTo(0, 0);
		document.body.scrollTop = 0;
		$('body main').height(window.innerHeight).css('_border','2px solid red');
		
		
		// moves the curser to the end
		var tmpStr = input.val();
		input.val('');
		input.val(tmpStr);

	
	}, 500);
	
});








$(document).on('blur','input,textarea', function(){
	
	//$('h1').html('focus 2.1');
	
	//console.log('focus');
	
	setTimeout(function(){
	
		window.scrollTo(0, 0);
		document.body.scrollTop = 0;
		$('body main').height('auto');
	
	}, 5);
	
});





$(document).on('click','a.true_back', function(e){

	e.preventDefault();
	
	window.history.back();
	
	$('#translation_resources_panel a.true_forward').css('opacity','1');
	

});

$(document).on('click','a.true_forward', function(e){

	e.preventDefault();

	window.history.forward();

});



$(document).ready(function(){
	if ( isMobileDevice() ) {
        document.addEventListener("deviceready", CUSTOM.onDeviceReady, false);
    } else {
        CUSTOM.onDeviceReady();
    }	
});



CUSTOM.onDeviceReady = function(){
	
	
	$('main').on("touchmove", function(ev) {
	    var e = ev.originalEvent;
	    console.log(e.touches);
	});
	
	
	
	
/*
	$("main").swipe( {
		swipeStatus:function(event, phase, direction, distance, duration, fingerCount)
		{
		  //Here we can check the:
		  //phase : 'start', 'move', 'end', 'cancel'
		  //direction : 'left', 'right', 'up', 'down'
		  //distance : Distance finger is from initial touch point in px
		  //duration : Length of swipe in MS 
		  //fingerCount : the number of fingers used
		  	$('h1').append(distance);
		  
		  },
		  threshold:100,
		  maxTimeThreshold:2500
		  //fingers:'all'
	});
*/

/*
	$("main").swipe({
		swipeStatus:function(event, direction, distance, duration, fingerCount) {
			
			$('p').preppend("<br>You swiped " + direction + ' ' + distance );
			
			//event.preventDefult();
		}
	});
*/
	$("main").swipe( {
		//Generic swipe handler for all directions
		swipeRight:function(event, direction, distance, duration, fingerCount) {
			
			
			//$('p').html("You swiped " + direction ); 
			
			
			if( $('main').hasClass('focus_translation_form') ){
			
				window.location.hash = $('a#open_selections').attr('href');	
				
			}
			else if( $('main').hasClass('focus_resources') ){
									
				window.location.hash = $('a#close_resources').attr('href');					
				
			}

		},
		
		
		swipeLeft:function(event, direction, distance, duration, fingerCount) {
			
			
			//$('p').html("You swiped " + direction ); 
			
			
			if( $('main').hasClass('focus_translation_form') ){
			
				window.location.hash = $('a#resource_notes').attr('href');
				
			}
			else if( $('main').hasClass('focus_tabs') ){
									
				window.location.hash = $('a#close_selections').attr('href');					
				
			}

		},
		
		
		threshold:100
		
	});
      
/*
	$("main #center_panel").swipe( {
		//Generic swipe handler for all directions
		swipeLeft:function(event, direction, distance, duration, fingerCount) {
			
			
			$('p').html("You swiped " + direction ); 
			
			
			if( $('main').hasClass('focus_translation_form') ){
			
				window.location.hash = $('a#resource_notes').attr('href');
				
			}
			else if( $('main').hasClass('focus_tabs') ){
									
				window.location.hash = $('a#close_selections').attr('href');					
				
			}

		},
		
		threshold:100
		
	});
      
*/
      
      
/*
	$("main #center_panel").swipeLeft({
	
		swipeStatus:function(event, direction, distance, duration, fingerCount) {
			
			//$('h1').html("You swiped '" + direction + "' " + distance );
			//$('p').prepend("<br>You swiped '" + direction + "' " + distance );
			console.log(direction+distance);
			
			if( $('main').hasClass('focus_translation_form') ){
			
				if( (direction+distance) == 'endright'){
					
					//alert('endright');
					window.location.hash = $('a#open_selections').attr('href');
					
				}
				
				else if( (direction+distance) == 'endleft'){
					
					//$('a#resource_notes').hide().click();
					window.location.hash = $('a#resource_notes').attr('href');
				}
				
			}
			
			else if( $('main').hasClass('focus_tabs') ){
				
				if( (direction+distance) == 'endleft'){
					
					//alert('endright');
					window.location.hash = $('a#close_selections').attr('href');
					
				}
				
			}
			
			else if( $('main').hasClass('focus_resources') ){
				
				if( (direction+distance) == 'endright'){
					
					//alert('endright');
					window.location.hash = $('a#close_resources').attr('href');
					
				}
				
			}
			
			
			
			//event.preventDefault();
			
			//return true;
			
		}
		,threshold:100
	});

*/


/*

var startx = 0;
var touchobj = 0;;

	document.body.addEventListener('touchstart', function(e){
	
		touchobj = e.changedTouches[0] // reference first touch point (ie: first finger)
		startx = parseInt(touchobj.clientX) // get x position of touch point relative to left edge of browser
		console.log('Status: touchstart<br /> ClientX: ' + startx + 'px');
		//e.preventDefault();
		
	}, false);
 
	document.body.addEventListener('touchmove', function(e){
	
		var touchobj = e.changedTouches[0] // reference first touch point for this event
		var dist = (touchobj.clientX) - startx
		console.log('Status: touchmove<br /> Horizontal distance traveled: ' + dist + 'px');
		e.preventDefault();
		
		
		// 	-webkit-transform: translate3d(-100%,0,0);

		$('#selection_panel').stop().css('-webkit-transform','translate3d('+(dist/2)+'px,0,0)');
		$('#translation_resources_panel').show().stop().css('-webkit-transform','translate3d('+(dist/2)+'px,0,0)');
		
		
		
	}, false);
	
	document.body.addEventListener('touchend', function(e){
	
		var touchobj = e.changedTouches[0] // reference first touch point for this event
		console.log('Status: touchend<br /> Resting x coordinate: ' + touchobj.clientX + 'px');
		//e.preventDefault();
		
	}, false);

*/







	
	
};



$('textarea').off('touchmove');
//$('body').off('touchmove touchstart', '.scrollable');

/*
document.addEventListener(
  'touchmove',
  function(e) {
    e.preventDefault();
    console.log(e);
  },
  false
);

*/

/*
$(document).on('focus','textarea', function(){
	
	$('h1').html('focus 2b');
	
	console.log('focus');
	
	setTimeout(function(){
	
		window.scrollTo(0, 0);
		document.body.scrollTop = 0;
	
	}, 5);
	
});
*/


$(window).resize(function () {    


	//$('input').trigger('blur');
		window.scrollTo(0, 0);
		document.body.scrollTop = 0;
		$('body main').height(window.innerHeight).css('_border','2px solid red');

});
