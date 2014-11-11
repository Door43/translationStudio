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
	
	$(window).trigger('resize');
/*	
	var input = $(this);

	
	setTimeout(function(){
	
		window.scrollTo(0, 0);
		document.body.scrollTop = 0;
		$('body main').height(window.innerHeight);
		
		
		
		// moves the curser to the end
		var tmpStr = input.val();
		input.val('');
		input.val(tmpStr);

	
	}, 500);
*/
});









$(document).on('blur','input,textarea', function(){
	
	//$('h1').html('focus 2.1');
	
	$(window).trigger('resize');
	
	setTimeout(function(){
	
		window.scrollTo(0, 0);
		document.body.scrollTop = 0;
		$('body main').height('auto');
		

	
	}, 5);
	
});




// history button functions moved to resources.js (v1.2)
/*
$(document).on('click','a.true_back', function(e){

	e.preventDefault();
	
	window.history.back();
	
	$('#translation_resources_panel a.true_forward').css('opacity','1');
	

});

$(document).on('click','a.true_forward', function(e){

	e.preventDefault();

	window.history.forward();

});
*/


document.addEventListener('touchmove', function (e) { 

	//e.preventDefault(); 
	e.stopPropagation();
	
}, false);



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








CUSTOM.show_terms = function(){

	
	// see if the user has agreed to the terms in the past
	
	if(!localStorage.agree_to_terms){


		DIALOG.show(
	
			'Terms of Use',
			
			'In order to use this app, you must agree to release your work under the terms of the <a id="creative_commons_link" target="_blank" href="http://creativecommons.org/licenses/by-sa/4.0">Creative Commons Attribution-ShareAlike 4.0 International License</a>.',
			
			'I Agree',
			
			function(){
			
			
				//DB.drop_tables();
				
				localStorage.agree_to_terms = "YES";
				
			
			}, 
			
			"No Thanks",
			
			function(){
			
				setTimeout(CUSTOM.show_terms, 1000);
				
			
			},
			
			false
		);		
		
	}				
	
};



$(document).on('click','a#creative_commons_link', function(e){
	
	e.preventDefault();
	
	CUSTOM.creative_commons();
	
});


CUSTOM.creative_commons = function(){

	
	// see if the user has agreed to the terms in the past
	
	if(!localStorage.agree_to_terms){


		DIALOG.show(
	
			'Attribution-ShareAlike 4.0 International',
			
			'You are free to: Share, copy, and redistribute the material in any medium or format; Adapt, remix, transform, and build upon the material for any purpose, even commercially. The licensor cannot revoke these freedoms as long as you follow the license terms.</p> ' +
			'<p>Under the following terms: Attribution - You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use; ShareAlike - If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original; No additional restrictions - You may not apply legal terms or technological measures that legally restrict others from doing anything the license permits. </p> ' +
			'<p>Notices: You do not have to comply with the license for elements of the material in the public domain or where your use is permitted by an applicable exception or limitation; No warranties are given. The license may not give you all of the permissions necessary for your intended use. For example, other rights such as publicity, privacy, or moral rights may limit how you use the material.',
			
			'OK',
			
			function(){
			
			
				//DB.drop_tables();
				setTimeout(CUSTOM.show_terms, 1000);
				//localStorage.agree_to_terms = "YES";
				
			
			}, 
			
			false,
			
			function(){
			
				//setTimeout(CUSTOM.show_terms, 1000);
				
			
			},
			
			false
		);		
		
	}				
	
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

//var r = 0;

$(window).resize(function () {    

	//var h = $('main').height();

	//$('h1').html('resize '+ r + ':' + h);
	
	//r++;
	
	//$('h1').html(window.innerHeight);
	
	if( window.innerHeight < 355 && window.innerWidth > 450 && HASH.myClass == "TRANSLATE"){
		$('body').addClass('hide_translation_nav');
	}
	
	else {
		$('body').removeClass('hide_translation_nav');
	}


	//$('input').trigger('blur');
		window.scrollTo(0, 0);
		document.body.scrollTop = 0;
		$('body main').height(window.innerHeight).css('_border','2px solid red');

});
