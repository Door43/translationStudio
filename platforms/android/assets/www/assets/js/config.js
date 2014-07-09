var CONFIG = [];


/*

Any value that may need to be ajusted later should go here

*/



// default book selection
CONFIG.book = 'obs';

// default story selection
CONFIG.story = '01';

// default frame selection
CONFIG.frame = '01';

// time til autosave
CONFIG.autosave_time = 2000;

// how far back should the undo button go
CONFIG.translation_history_limit = 20;




HASH.myDefault="#books";





/*

+++++++++++++++++++++++++++++++++++

END OF CONFIG -- DON'T CHANGE ANYTHING BELOW

+++++++++++++++++++++++++++++++++++

*/





$(document).ready(function(){
	if ( isMobileDevice() ) {
        document.addEventListener("deviceready", CONFIG.onDeviceReady, false);
    } else {
        CONFIG.onDeviceReady();
    }	
});



CONFIG.onDeviceReady = function(){

	// TODO BEN update the versin number
	localStorage.version = '1.1';


	if(!localStorage.book){
		localStorage.book = CONFIG.book;
	}
	if(!localStorage.story){
		localStorage.story = CONFIG.story;
	}
	if(!localStorage.frame){
		localStorage.frame = CONFIG.frame;
	}

	
	
};