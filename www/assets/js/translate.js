var TRANSLATE = [];

TRANSLATE.i = 0;

//TRANSLATE.int = 0;

TRANSLATE.history = [];


TRANSLATE.index = function(source_language, book, story, frame){
	
	resource_history_reset = typeof resource_history_reset !== 'undefined' ? resource_history_reset : true;
	
	$(window).trigger('resize');
	
	SHARE.recent_loaded = false;
	SHARE.all_loaded = false;
	
	// initialize variables for tracking history on translation resources panel
	RESOURCES.initHistory();
		
	setTimeout(function(){
		$('main header nav a').removeClass('swell');
	}, 1000);


	
	$('main').addClass('focus_translation_form').removeClass('focus_resources').removeClass('focus_tabs');
	
	
	$('#center_panel .show_menu').removeClass('show_menu');
	$('#center_panel form#translation textarea#frame_text').removeAttr('disabled');
	
	// set local storage
	localStorage.remember = window.location.hash;
	localStorage.book = book;
	localStorage.story = story;
	localStorage.frame = frame;
	
	
	// clear all browser history
	// not working
	window.location.replace(window.location.hash);
	
	
	// hide selection panel and profile panel
	$('#selection_panel, #profile_panel, #projects_panel, #projects_panel').addClass('hide_left');
	
	// hide translation resources panel
	if(!$('#translation_resources_panel').hasClass("hide_right")){
		$('#translation_resources_panel').addClass("hide_right");
	}
	// hide share panel
	if(!$('#share_panel').hasClass("hide_right")){
		$('#share_panel').addClass("hide_right");
	}
	// hide settings panel
	if(!$('#settings_panel').hasClass("hide_right")){
		$('#settings_panel').addClass("hide_right");
	}
	// $('#translation_resources_panel').addClass('hide_right');
	// $('#share_panel').addClass('hide_right');
	// $('#settings_panel').addClass('hide_right');

	setTimeout(function(){
		
		$('#translation_resources_panel').hide();
		$('#share_panel').hide();
		$('#settings_panel').hide();

	}, 600);

	// moved to RESOURCES.initHistory
	// $('a#resource_forward').css('opacity','.5');
	
	
	
	
	// if this page is already in the DOM, don't do anything
	if( $('#center_panel').attr('data-id') == window.location.hash ){
		
		console.log('already loaded');
		
	}


	// draw in DOM
		
	else {	
	
	
		
		
		
		
		
		// your on a frame of the story
		// go fetch the source data
		$.ajax({
				
			dataType: "json",
			url: 'assets/json/obs-txt-1-en-obs-en.json',
			success: function(msg){




				// hold on to the hashes
				$('form#translation #frame_hash').val(frame);
				$('form#translation #story_hash').val(story);

				$('#wrap_source_text div#source_text cite').html('['+story+'-'+frame+']');
				$('#toggle_full_screen_b span:first-child').html('['+story+'-'+frame+']');

				// remember the hash to compare
				$('#center_panel').attr('data-id',window.location.hash);

				//console.log(msg.chapters[(story*1)-1]);
				var $frame = [];
				var total_frames = (msg.chapters[(story*1)-1].frames.length);

				$frame.story_title = msg.chapters[(story*1)-1].title;
				$frame.story_ref = msg.chapters[(story*1)-1].ref;




				$('#wrap_source_text nav a').show();

				$('#wrap_source_text nav a:first-child i.i-text-document').show();
				$('#wrap_source_text nav a:first-child i.i-open-book').hide();
				$('#wrap_source_text nav a:last-child i.i-text-document').show();
				$('#wrap_source_text nav a:last-child i.i-info').hide();


				var last_frame = false;
				// TITLE
				if(frame == 'title'){
					
					var prev_frame = 0;
					$('#wrap_source_text nav a:first-child').hide();
					var next_frame = '1';
					$frame.text  = $frame.story_title;	
				}
				
				
				// REF
				else if( frame == 'ref' ){
					
					var prev_frame = total_frames;
					var next_frame = 0;
					$('#wrap_source_text nav a:last-child').hide();
					$frame.text  = $frame.story_ref;	
				}
				
				
				// FRAME
				// your on an actual frame and not on the title or 
				else {
				
					var next_frame = (frame*1)+1;
					var prev_frame = (frame*1)-1;
					
					$frame.id    = msg.chapters[(story*1)-1].frames[(frame*1)-1].id;
					$frame.text  = msg.chapters[(story*1)-1].frames[(frame*1)-1].text;
					
					// your on the last frame of this story
					if(frame*1 == total_frames) {
					
						console.log('your on the last frame of this story');
						// the next ref should point to the reference
						//$('#wrap_source_text nav a:last-child').attr('href','#translate/index/'+source_language+'/'+book+'/'+story+'/ref');
						last_frame = true;
						$('#wrap_source_text nav a:last-child i.i-text-document').hide();
						$('#wrap_source_text nav a:last-child i.i-info').show();
							
					}
				}

				// add leading 0
				next_frame = (next_frame < 10)? '0'+next_frame : next_frame;				
				prev_frame = (prev_frame < 10)? '0'+prev_frame : prev_frame;
				
				
				
				//(prev_frame == '00') ? ($('#wrap_source_text nav a:first-child').hide()) : ($('#wrap_source_text nav a:first-child').show());
				
					
				
				if(prev_frame == '00'){
				
					prev_frame = 'title';
					$('#wrap_source_text nav a:first-child i.i-text-document').hide();
					$('#wrap_source_text nav a:first-child i.i-open-book').show();
					
				}
				
				next_frame = last_frame ? 'ref' :  next_frame;
				
				
				$('#wrap_source_text nav a:first-child').attr('href','#translate/index/'+source_language+'/'+book+'/'+story+'/'+prev_frame);
				$('#wrap_source_text nav a:last-child').attr('href','#translate/index/'+source_language+'/'+book+'/'+story+'/'+ next_frame);
				
				
				// BEN TO DO
				// preload the form if there is any previous data	
				
				//$('form#translation input#story_title').val('foo');
				//$('form#translation textarea#frame_text').val('foo');
				
				//console.log(total_frames);
				
				var st = $('#source_text');
				
				//st.find('h1').html($frame.story_title);
				//st.find('h2').html($frame.story_ref);
				
				st.find('p').html($frame.text);
				
				// this reads any translaions you have done for this frame
				//source_language, book, story, frame
				DB.readFrame(localStorage.selected_target_language_id, story, frame, function(results){
					
					//alert('readFrame callback');
					
					console.log('readFrame results');
					console.log(results);
					
					var form = $('form#translation');
					
					//alert(results.story_title);
					
					form.find('#story_title').val(results.story_title);
					form.find('#story_ref').val(results.story_ref);
					
					// header info
					if(typeof results.story_title !== 'undefined' && results.story_title != '' ){
						
						$('#center_panel header big').html(results.story_title)
							.closest('header').find('small').html(results.story_ref);
					}else{
						$('#center_panel header big').html('Translation')
									.closest('header').find('small').html('Studio');
					}
					
					results.story_title = (typeof results.story_title == 'undefined') ? '' : results.story_title;
					results.story_ref = (typeof results.story_ref == 'undefined') ? '' : results.story_ref;


					
					if(frame == 'title') { 

						results.frame_text = results.story_title; 

					}
					else if(frame == 'ref') { 
						results.frame_text = results.story_ref; 
					}
					
					
					if(results.frame_text != 'undefined'){
						form.find('#frame_text').val(results.frame_text);
					}
					
					else {
						form.find('#frame_text').val('');
					}
					
					
					form.find('#target_story_id').remove();
					form.find('#target_frame_id').remove();
					
					var updateStory = false;
					
					if(typeof results.story_id !== 'undefined'){
		
						form.prepend('<input type="hidden" value="'+results.story_id+'" id="target_story_id" name="target_story_id"/>');
						updateStory = true;
						
					}
					
					// if the story title has not been translated
					if( (results.story_title == '' || results.story_title == 'undefined' || results.story_ref == '' || results.story_ref == 'undefined' || updateStory ==  false) && ( localStorage.selected_target_language  ) ) {
										
						
					} // if 
					else {
						
						
					} //
					
					
					// turned off focus on translation textarea because android removes placeholder text 
					// and still requires user to tap to bring up softkey
/*
					setTimeout(function(){
						
						var txt = form.find('#frame_text');
						
						txt.focus();						
												
					}, 500);
*/

					
					if(typeof results.frame_id !== 'undefined'){
					
						form.prepend('<input type="hidden" value="'+results.frame_id+'" id="target_frame_id" name="target_frame_id"/>');
		
					}
					
				}); //DB.readFrame
				
				
				
				
				
				
				
				// this may need to be changed or moved
				
				//TRANSLATE.history[TRANSLATE.i] = $('form#translation textarea').val();
	
				
				
				
				
				msg    = null; // free up some memory
				//$frame = null; // free up some memory
	/*
				tis = null;
				book = null;
	*/
				
			} // success
				
		}); //ajax
		
		
		$('a#close_resources, a#close_selections, a#close_share, a#close_profile, #close_settings').attr('href', window.location.hash);
//		$('a#close_selections').attr('href', window.location.hash);
		
		
		// #resources/at/en/obs/notes/frames/01-07
		
		//if(!RESOURCES.home){
		
				
		var notes_path = '#resources/at/'+book+'/'+source_language+'/notes/frames/'+story+'-'+frame;
		
		$('a#resource_notes').attr('href', notes_path);
			
		//}
		
		RESOURCES.home = true;
	
		
		
		
		//TRANSLATE.history = [];
		$('#wrap_translation_form nav.history a').hide();
		
		
		
		clearTimeout(TRANSLATE.int);
		// set a timer to auto save
	
	
	
	} // else
	
	TRANSLATE.checkForTargetLanguage();
	
	//if(!localStorage.bookTitle_+localStorage.selected_target_language){
	
	//}

};


TRANSLATE.checkForTargetLanguage = function(){

	if( !localStorage.selected_target_language_id  ){

		
		DIALOG.show(
			'No target language selected!',
			'Click the settings <i class="i-cog"></i> button and select a target language.',
			'<i class="i-cog"></i> Settings',
			function(){
			
				window.location.hash = '#settings';
			
			}, 
			'<i class="i-left"></i> Back',
			function(){
			
				window.history.back();
			
			}
		);
		
		$('#dialog header .close').hide();
				
		//e.preventDefault();
		
		return false;

	}
	else {
	
		$('form#translation+cite').html(localStorage.selected_target_language);
		$('a#toggle_full_screen_b span:last-child').html(localStorage.selected_target_language);

		return true;
	
	}
	
};




$(document).on('keyup', "textarea", function(e) {

	console.log('keyup');

    while($(this).outerHeight() < this.scrollHeight + parseFloat($(this).css("borderTopWidth")) + parseFloat($(this).css("borderBottomWidth"))) {
    
        $(this).height($(this).height()+2);
        
    };
    
});

$(document).on('focus', "textarea", function(e) {

	var target_lang_selected = TRANSLATE.checkForTargetLanguage();

	if(target_lang_selected){
	    while($(this).outerHeight() < this.scrollHeight + parseFloat($(this).css("borderTopWidth")) + parseFloat($(this).css("borderBottomWidth"))) {
	    
	        $(this).height($(this).height()+2);
	        
	    };
	    
	    //$(this).closest('.scroll')
	    
	    $("#wrap_translation_form .scroll").animate({ scrollTop: $('#wrap_translation_form .scroll')[0].scrollHeight}, 1000);
	}
	
	else{
		// alert("hide keyboard");
		// hideKeyboard($(this));
	}
    
});



// for undo and redo
TRANSLATE.load_history = function(){
	
	var new_val = TRANSLATE.history[TRANSLATE.i];
	
	if(TRANSLATE.i <= 0 ){
		TRANSLATE.i = 0;
		$('#wrap_translation_form nav.history a.back').hide();
	}
	
	
	// limit the lowest number to the length - the translation_history_limit
	
	//console.log(TRANSLATE.i);
	//console.log(TRANSLATE.history.length);
	//console.log(CONFIG.translation_history_limit);
	
	
	if( (TRANSLATE.history.length - CONFIG.translation_history_limit ) == TRANSLATE.i ) {
		
		$('#wrap_translation_form nav.history a.back').hide();
	}
	
	
	//console.log('new_val:'+new_val);
	
	
	
	
	
	if(new_val){
		$('form#translation textarea').val(new_val);
	}
	
	
	
	if(TRANSLATE.i >= (TRANSLATE.history.length - 1) ){
		//alert('same');
		$('#wrap_translation_form nav.history a.forward').hide();
	}
	
	
};


// when someone types in the text area
// record the val into a history array
$(document).on('keydown','form#translation textarea',function(){
	
	//$('#center_panel nav a').fadeOut();
	
	var tis = $(this);
	
	////console.log(tis.val());
	
	$('button#submit_form_translation').show().addClass('active');
	
	// adding history to the array
/*
	setTimeout(function(){
		
		
		TRANSLATE.i++;
		TRANSLATE.history[TRANSLATE.i] = tis.val();
		
		// to save memory, we need to remove history that is older than 10? entries ago
		// first check to see that i is not less than 0 -- because you cna't have a negative key
		if((TRANSLATE.i-CONFIG.translation_history_limit) >= 0){
		
			TRANSLATE.history[TRANSLATE.i-CONFIG.translation_history_limit] = null;
		
		}
		
		console.dir(TRANSLATE.history);
	
	}, 200);
*/
	
	
//	$('#wrap_translation_form nav.history a.back').show();
	
	
	
	
	//clearTimeout(TRANSLATE.int);
	
	
	// auto save the form every view seconds
	TRANSLATE.int = setTimeout(function(){
		
		$('form#translation').trigger('submit');
		
	}, CONFIG.autosave_time);
	
	
});


// when someone types in the input
/*
$(document).on('keydown','form#translation input#story_title',function(){
	
	$('#center_panel nav a').fadeOut();
	$('button#submit_form_translation').addClass('active');

	clearTimeout(TRANSLATE.int);
	
	TRANSLATE.int = setTimeout(function(){
		
		$('form#translation').trigger('submit');
		
	}, CONFIG.autosave_time);
	
	
});
*/


// when someone types in the story_ref
/*
$(document).on('keydown','form#translation input#story_ref',function(){
	
	$('#center_panel nav a').fadeOut();
	$('button#submit_form_translation').addClass('active');

	clearTimeout(TRANSLATE.int);
	
	TRANSLATE.int = setTimeout(function(){
		
		$('form#translation').trigger('submit');
		
	}, CONFIG.autosave_time);
	
	
});
*/


// undo button
$(document).on('click', '#wrap_translation_form nav.history a.back', function(e){
	
	e.preventDefault();
	
	TRANSLATE.i--;
	
	console.log('i: '+TRANSLATE.i);
	
	TRANSLATE.load_history();
	
	$('#wrap_translation_form nav.history a.forward').show();
	
	return false;
	
});


// redo buttton
$(document).on('click', '#wrap_translation_form nav.history a.forward', function(e){
	
	e.preventDefault();
	
	TRANSLATE.i++;
	
	console.log('i: '+TRANSLATE.i);
	
	TRANSLATE.load_history();

	$('#wrap_translation_form nav.history a.back').show();	

	return false;

});


// click to submit
$(document).on('click', 'button#submit_form_translation', function(e){
	
	e.preventDefault();
	
	$('form#translation').trigger('submit');

});



// SUBMIT FORM

$(document).on('submit', 'form#translation', function(e){
	
	e.preventDefault();
	
	// $('#center_panel nav a').fadeOut();

	
	// ui
	$('button#submit_form_translation').addClass('saving').addClass('active');
	
	// kill suto save
	clearInterval(TRANSLATE.int);
	
	var tis = $(this);
	
	var story_hash = tis.find('input#story_hash').val();
	var frame_hash = tis.find('input#frame_hash').val();
	var frame_text = tis.find('#frame_text').val();
	var story_title =  frame_hash == 'title' ? frame_text : tis.find('input#story_title').val();
	var story_ref = frame_hash == 'ref' ? frame_text : tis.find('input#story_ref').val();
	
	
	// do we have a target_story_id in the DOM?
	
	if( tis.find('input#target_story_id').length ){
		
		// we have story_id
		
		var target_story_id = $('form#translation input#target_story_id').val();
		
		console.log('update for target_story_id: ' + target_story_id);
		
		if(frame_hash == 'title' || frame_hash == 'ref'){

			// update story record
			
			DB.updateStory(target_story_id, story_title, story_ref, function(){
				
				console.log('success update for target_story_id: ' + target_story_id);

				// set title/ref hidden field value
				if(frame_hash == 'title'){
					tis.find('input#story_title').val(story_title);
				}
				else{
					tis.find('input#story_ref').val(story_ref);
				}
	
			});

		}
		else{

			// submit frame
			
			TRANSLATE.submit_frame(target_story_id, frame_text, frame_hash);
			
		}
		
		
	}	
	
	else {

		// we do NOT have story_id
		
		console.log('no story_id, insert new story record');
		console.log('localStorage.selected_target_language_id: '+localStorage.selected_target_language_id);
		console.log('story: '+story_hash);
		console.log('story_title: '+story_title);
		console.log('story_ref: '+story_ref);


		if(frame_hash == 'title' || frame_hash == 'ref'){
			
			// insert story record
			
			DB.insertStory( localStorage.selected_target_language_id , '0', story_hash, story_title, story_ref, function(story_id){
							
				//now i have the story id
				console.log('new story_id: '+story_id);
				
				// add hidden field to DOM
				tis.prepend('<input type="hidden" value="'+story_id+'" id="target_story_id" name="target_story_id"/>');
				
				// set title/ref hidden field value
				if(frame_hash == 'title'){
					tis.find('input#story_title').val(story_title);
				}
				else{
					tis.find('input#story_ref').val(story_ref);
				}
				
				
			});
			
			
		}
		else{

			// insert story record and submit frame

			DB.insertStory( localStorage.selected_target_language_id , '0', story_hash, story_title, story_ref, function(story_id){
							
				//now i have the story id
				console.log('new story_id: '+story_id);
				
				// add hidden field to DOM
				tis.prepend('<input type="hidden" value="'+story_id+'" id="target_story_id" name="target_story_id"/>');
				
				// set title/ref hidden field value
				if(frame_hash == 'title'){
					tis.find('input#story_title').val(story_title);
				}
				else{
					tis.find('input#story_ref').val(story_ref);
				}
				
				// now determine what to do with the frame value
				TRANSLATE.submit_frame(story_id, frame_text, frame_hash);
				
				// $('#center_panel nav a').fadeIn();
				
			});


			
		}


		
	}
	
	
	
	// when finished saving
	setTimeout(function(){
	
		// ui to remove blue styling
		$('button#submit_form_translation').removeClass('active').removeClass('saving').hide();
		// $('#center_panel nav a').fadeIn();
		
	}, 1000);
		
	
	
});

$(document).on('submit', '_form#translation', function(e){
	
	
	e.preventDefault();
	
	//$('#center_panel nav a').fadeOut();

	
	// ui
	$('button#submit_form_translation').addClass('saving').addClass('active');
	
	// kill suto save
	clearInterval(TRANSLATE.int);
	
	var tis = $(this); // <form>


	console.log('HASH.array[5]');
	console.log(HASH.array[5]);
	

	if(HASH.array[5] == 'title'){
		
		//  target_story_id 
		// 	frame_text
		
	}
		
	else if(HASH.array[5] == 'ref'){
		
		// target_story_id
		// frame_text
		
	}
	
	// frame
	else {


	
		var story_hash = tis.find('input#story_hash').val();
		var frame_hash = tis.find('input#frame_hash').val();
		var story_title = tis.find('input#story_title').val();
		var story_ref = tis.find('input#story_ref').val();
		var frame_text = tis.find('#frame_text').val();
		
		
		//alert(story_title);
		
		// BEN TO DO
		// save form data
		
	
		// do we have a target_story_id in the DOM?
		
		if( tis.find('input#target_story_id').length ){
			
			// insert a new story record
			var target_story_id = $('form#translation input#target_story_id').val();
			
			console.log('update for target_story_id: ' + target_story_id);
			
			DB.updateStory(target_story_id, story_title, story_ref, function(){
				
				console.log('sucess update for target_story_id: ' + target_story_id);
	
				// now determine what to do with the frame value			
				TRANSLATE.submit_translation(target_story_id, frame_text, frame_hash);
				
			});
			
		}	
		
		// no target_story_id, create one
		else {
			
			console.log('no story_id, insert new story record');
			
			//var story = HASH.array[4];
					
			// insert a new story record
			
			console.log('localStorage.selected_target_language_id: '+localStorage.selected_target_language_id);
			console.log('story: '+story_hash);
			console.log('story_title: '+story_title);
			console.log('story_ref: '+story_ref);
	
			DB.insertStory( localStorage.selected_target_language_id , '0', story_hash, story_title, story_ref, function(story_id){
							
				//now i have the story id
				console.log('new story_id: '+story_id);
				
				// add hidden field to DOM
				tis.prepend('<input type="hidden" value="'+story_id+'" id="target_story_id" name="target_story_id"/>');
				
				// now determine what to do with the frame value
				TRANSLATE.submit_translation(story_id, frame_text, frame_hash);
				
				//$('#center_panel nav a').fadeIn();
				
			});
			
		}
		
		
		
	} //else frame	
		
		
	// when finished saving
	setTimeout(function(){
	
		// ui to remove blue styling
		$('button#submit_form_translation').removeClass('active').removeClass('saving').hide();
		//$('#center_panel nav a').fadeIn();
		
	}, 1000);
		

});



TRANSLATE.submit_frame = function(target_story_id, frame_text, frame_hash){
	
	
	// we are assuming by this point that the target_story_id is in the DOM
	
	// Do we need to insert a new frame
	// or update existing record?
	if( $('form#translation').find('input#target_frame_id').length ){

		// update frame
		var target_frame_id = $('form#translation input#target_frame_id').val();

		DB.updateFrame(target_frame_id, frame_text, function(){
			
			console.log('frame updated: target_frame_id:'+target_frame_id);
			
		});
	}
	
	else {
		
		//var frame = HASH.array[5];
		
		// insert new frame
		DB.insertFrame(target_story_id, frame_hash, frame_text, '0', function(frame_id){
						
			$('form#translation').prepend('<input type="hidden" value="'+frame_id+'" id="target_frame_id" name="target_frame_id"/>');
			
			console.log('new frame inserted: '+frame_id);

		});
	}
	
	
	
};




// open dialog to edit story info
$(document).on('click','a#open_story_info', function(e){

	e.preventDefault();		
	
	var target_lang_selected = TRANSLATE.checkForTargetLanguage(),
		story_title,
		story_ref,
		story_id,
		story = localStorage.story,
		mode,
		tis = $(this);

	if(target_lang_selected){
		
		var language_id = localStorage.selected_target_language_id;

		// var story_title = tis.find('big').html();
		// var story_ref = tis.find('small').html();

		DB.readStory(language_id, localStorage.story, function(story_info){
			
			story_title = Object.keys(story_info).length ? story_info.story_title : '';
			story_ref = Object.keys(story_info).length ? story_info.story_ref : '';
			story_id = Object.keys(story_info).length ? story_info.story_id : '';
			
			var source_story = DB.selectSourceStory(localStorage.story, function(source_story){
				var source_story_title = source_story.story_title;
				var source_story_ref = source_story.story_ref;
			
				story_title = (story_title == 'Translation') ? '' : story_title;
				story_ref = (story_ref == 'Studio') ? '' : story_ref;
		
				DIALOG.show(
		
					'<i class="i-open-book"></i>Story info.',
					
					'<form id="update_translate_story_title"><label><strong>'+source_story_title+'</strong></label><input value="'+story_title+'" type="text" placeholder="Enter story title." /><label>'+source_story_ref+'</label><textarea placeholder="Enter story reference.">'+story_ref+'</textarea></form>',
					
					'<i class="i-disk-upload"></i> Update',
					
					function(){ // click save
					
						//window.location.hash = '#settings';
						var _story_title = $('form#update_translate_story_title input').val();
						var _story_ref = $('form#update_translate_story_title textarea').val();
						// var _story_id = $('form#translation #target_story_id').val();
						var _story_id = story_id;
						
						// insert this in the db
						if(_story_id === ''){
							// alert('insert story');
							DB.insertStory(language_id, '0', story, _story_title, _story_ref, function(story_id){
							
								console.log('sucess insert for target_story_id: ' +_story_id);
								$('form#translation #target_story_id').val(story_id);
							});
							
						}
						else{
							// alert('update story');
								
							DB.updateStory(_story_id, _story_title, _story_ref, function(){
							
								console.log('sucess update for target_story_id: ' + _story_id);
							
							});
							
						}
							
	
						// $('form#translation').find('#story_title').val(_story_title);
						// $('form#translation').find('#story_ref').val(_story_ref);
						
						// if we are on title or ref, will need to update the translation text
						if(HASH.array[5] == 'title' || HASH.array[5] == 'ref'){
							text = HASH.array[5] == 'title' ? _story_title : _story_ref;
							$('form#translation').find('#frame_text').val(text);
						}
						
						// if a title was entered, update the top bar title/ref info 
						if(_story_title.length){
							$('#center_panel header big')
								.html(_story_title)
								.closest('header')
								.find('small')
								.html(_story_ref);
						}
					
					}, 
					
					'<i class="i-close"></i> Close',
					
					function(){}
				);	
			
			});		
		
		
		});

		
		
	}			

});





//  
$(document).on('click', 'a#toggle_full_screen_b', function(e){
	
	e.preventDefault();
	
	$('textarea, input').trigger('blur');
	
	$('body').removeClass('hide_translation_nav');
	
});


// toggle mobile menu 
$(document).on('click', 'a#toggle_menu', function(e){
	
	e.preventDefault();
	
	$(this).closest('header').toggleClass('show_menu');
	
	
});




// change inputs 
$(document).on('keydown', '#dialog form input, #dialog form textarea', function(e){
	
	//$('#save_profile').addClass('active');
	
	// hit enter button
	if(event.keyCode == 13){
	
        //$("input[type=button]").click();
        $(this).closest('#dialog').find('a.yes').trigger('click');
        $(this).blur();
        
    }

	
});







