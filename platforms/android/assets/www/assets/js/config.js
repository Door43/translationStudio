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

// version number
CONFIG.version = '1.2';


// HASH.myDefault="#stories/in/obs";
CONFIG.myDefaultHash="#stories/in/obs";

// for setting the panel close buttons before browser history is established
// CONFIG.myDefaultTranslation="#translate/index/en/obs/01/title";





/*

+++++++++++++++++++++++++++++++++++

END OF CONFIG -- DON'T CHANGE ANYTHING BELOW

+++++++++++++++++++++++++++++++++++

*/





CONFIG.onDeviceReady = function(){

// localStorage.book, localStorage.story, and localStorage.frame set in TABS.onDeviceReady
/*  
	if(!localStorage.book){
		localStorage.book = CONFIG.book;
	}
	if(!localStorage.story){
		localStorage.story = CONFIG.story;
	}
	if(!localStorage.frame){
		localStorage.frame = CONFIG.frame;
	}
*/




	
	
};