var PROFILE = [];


PROFILE.index = function(){

	$('main header nav a#open_profile').addClass('swell');
	$('#profile_panel').removeClass('hide_left');
	
};


/*
// close the profile panel
$(document).on('click', 'a#close_profile', function(e){
	
	e.preventDefault();
	
	$('#profile_panel').addClass('hide_left');
	
	window.history.back();
	
});
*/


// change inputs 
$(document).on('keydown', '#profile_panel input', function(e){
	
	$('#save_profile').addClass('active');
	
	// hit enter button
	if(event.keyCode == 13){
	
        //$("input[type=button]").click();
        $('form#profile_form').trigger('submit');
        $(this).blur();
        
    }

	
});





// submit form 
$(document).on('submit', 'form#profile_form', function(e){
	
	e.preventDefault();
		
	$('#profile_panel button#save_profile').removeClass('active');
	
	
	if(typeof(Storage)!=="undefined"){
	
	
		localStorage.email = ($('form#profile_form input#email').val()).trim();
		localStorage.name  = ($('form#profile_form input#name').val()).trim();
		
	
	} // storage
	
	
	setTimeout(function(){
		
		
		//$('a#close_profile').trigger('click');
		
		//window.location.hash = '#';
		
	}, 600);
	
});




// click button
$(document).on('click', '#profile_panel button#save_profile', function(e){
	
	e.preventDefault();
	
	$('#profile_panel form').trigger('submit');
	
});


PROFILE.onDeviceReady = function(){

	
	if(typeof(Storage)!=="undefined"){
	
		// init UUID in settings
		if (localStorage.uuid){
			
		
		}
		
		else {
			
			localStorage.uuid = createUUID();
		
		}
		
		$('h1#uuid').html(localStorage.uuid);
		
		
		if (localStorage.email){

			$('form#profile_form input#email').val((localStorage.email).trim());
			$('form#profile_form input#name').val((localStorage.name).trim());
		}
		
	}
	
	
	
};
