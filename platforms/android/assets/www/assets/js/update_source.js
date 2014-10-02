var UPDATE = [];

// we will store the en source date_modified in local Storage

//$(document).ready(function(){
	
UPDATE.init = function(){
	
	$.ajax({
			
		dataType: "json",
		url: 'assets/json/obs-txt-1-en-obs-en.json',
		success: function(msg){
			
			//console.log(msg.date_modified);
			//console.log(msg);
			
			// see if we need to update the DB
			//20140424
			if( (typeof localStorage.date_modified_en == 'undefined' ) || localStorage.date_modified_en < msg.date_modified ){
			
				localStorage.date_modified_en = msg.date_modified;
				console.log('update DB');
				
				// DB.selectLanguageFromString('en', function(data){
				DB.selectSourceLanguage(function(data){
				
					// this language exists
/*
					if(data.length){
						// remove old source
						DB.removeSourceForLanguage(data[0].language_id, function(){
							UPDATE.source(data[0].language_id, msg);
						});
					}
*/
					console.log('DB.selectSourceLanguage count: '+Object.keys(data).length);
					if(Object.keys(data).length){
						console.log('source language exixts');
						// remove old source
						console.log('remove old source - language_id: '+data.language.id);
						DB.removeSourceForLanguage(data.language_id, function(){
							UPDATE.source(data.language_id, msg);
						});
					}
					
					// this language does not exist
					else {
						// insert language
						DB.insertLanguage('English', 'en', '1', function(language, language_id){
							UPDATE.source(language_id, msg);
						});
					}	
				
				});  // insertLanguage
				
			} // if 
			
			else {
				
				msg = null;
				
			}
			
		} // success
			
	}); //ajax
		
};	

//}); // ready
	
	
	
	
UPDATE.source = function(language_id, msg){


	// loop through stories
	$.each( msg.chapters, function( i ) {


		//console.log( '____________________________________' );
		//console.log( msg.chapters[i] );
		
		
		
		DB.insertStory(language_id, '1', msg.chapters[i].number, msg.chapters[i].title, msg.chapters[i].ref, function(story_id){
			
			// loop through frames
			$.each( msg.chapters[i].frames, function( j ) {
				
				//console.log( '---' );
				//console.log( msg.chapters[i].frames[j] );
				
				var frame = msg.chapters[i].frames[j].id;
				
				frame = frame.split("-");
				
				DB.insertFrame(story_id, frame[1], msg.chapters[i].frames[j].text, '1', function(frame_id){
					
					
				});

			}); // frames
			
		});
		
	}); // stories



};	
	



//alert(localStorage.date_modified_en);

if(typeof localStorage.date_modified_en == 'undefined'){
	
	//alert(localStorage.date_modified_en);
	
	
	
	
	
}