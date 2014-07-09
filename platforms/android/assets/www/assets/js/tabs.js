var TABS = [];








$.Mustache.options.warnOnMissingTemplates = true;

$(document).on('click','.tabs a', function(e){
	
	
	//e.preventDefault();
	
	
	var tis = $(this);
	
	
	tis.addClass('active').siblings().removeClass('active');
	
	var scope = tis.closest('.tabs').attr('data-tabs-controls');
	
	var selection = tis.attr('data-tab');
	
	
	$('[data-tabs-controls-content="'+ scope +'"]').fadeOut();
	
	$('[data-tab-content="'+ selection +'"]').stop().fadeIn();
	
	$('#selection_panel').removeClass('hide_left');
	
	$('a#open_selections').attr('href', window.location.hash);


});



// selected a book
$(document).on('click', '[data-tab-content="book"] ul li a', function(e){
	
	BOOKS.title = $(this).find('h1').html();
	
});




// selected a story
$(document).on('click', '[data-tab-content="story"] ul li a', function(e){
	
	FRAMES.title = $(this).find('h1').html();
	
});







// close selection panel
$(document).on('click', 'a#close_selections', function(e){
	

	if( $(this).attr('href') == '#' && !localStorage.remember  ){

		
		DIALOG.show(
			'No Selection',
			'Make a selection.',
			'OK',
			function(){
			
				//alert('yes');
			
			}, 
			false,
			function(){
			
				//alert('no');
			
			}
		);
				
		e.preventDefault();

	}
	
});




$(document).ready(function(){
	if ( isMobileDevice() ) {
        document.addEventListener("deviceready", TABS.onDeviceReady, false);
    } else {
        TABS.onDeviceReady();
    }	
});


TABS.onDeviceReady = function(){
	
	
	//$('.tabs a:first-child').trigger('click');
	
	
	if(typeof(Storage)!=="undefined"){
		
		
		if (localStorage.book){
		
			CONFIG.book = localStorage.book;
		
		}
		
		else {
			
			localStorage.book = CONFIG.book;
		}
		
		if (localStorage.story){
		
			CONFIG.story = localStorage.story;
		
		}
		else {
			
			localStorage.story = CONFIG.story;
		}
		
		if (localStorage.frame){
		
			CONFIG.frame = localStorage.frame;
		
		}
		else {
			
			localStorage.frame = CONFIG.frame;
		}
		
		
		// populate tabs hashes
		
		if(localStorage.book){
			
			$('#selection_panel .tabs a[data-tab="story"]').attr('href','#stories/in/'+localStorage.book);
			
		}
		
		if(localStorage.story){
			
			$('#selection_panel .tabs a[data-tab="frame"]').attr('href','#frames/in/'+localStorage.book+'/'+localStorage.story);
			
		}
		
		
		
		
	}
	
	else {
		
		alert('localStorage not available');
	}
	
	
	
	
	
	
	
	
	
	
	
	
};