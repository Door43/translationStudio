INIT = {};

$(document).ready(function(){

/*
	setTimeout(function(){
		
		//$('article.scroll').on('touchstart', function(event){});

	}, 500);
*/

	if ( isMobileDevice() ) {
        document.addEventListener("deviceready", INIT.onDeviceReady, false);
    } else {
		INIT.onDeviceReady();
    }	
});

INIT.onDeviceReady = function(){


	var ua = navigator.userAgent.toLowerCase();
	var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
	if(isAndroid) {
		// Do something!
		$('.scroll').css('-webkit-overflow-scrolling','touch');
	}
	
	// setup/update database
    DB.onDeviceReady(function(){
    	
    	// populate database with source text
    	UPDATE.init();
    	
	  	// setup local storage profile items
		PROFILE.onDeviceReady();
	
		// initiolize rtl checkbox (settings panel)
		SETTINGS.onDeviceReady();
	
		// update version number
		localStorage.setItem("version", CONFIG.version);
		// alert('updated localStorage.version\n\rnew value: '+localStorage.version);
	
		// set other localstorage items (book, story, frame) and populate tabs hashes
		TABS.onDeviceReady();
		
		// set other localstorage items (this function was duplicating steps in TABS.onDeviceReady)
		//CONFIG.onDeviceReady();
	
		// launch first page
		HASH.onDeviceReady();
	
	
		// show agree to terms window (this is now fired on hash change)
	   	// CUSTOM.show_terms();
	   	
	   	// set the panel close buttons before browser history is established (close#selections excluded)
		// $('a#close_resources, a#close_share, a#close_profile, #close_settings').attr('href', CONFIG.myDefaultTranslation);
  	
    });
	
};
