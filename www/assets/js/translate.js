var TRANSLATE = [];

TRANSLATE.i = 0;

//TRANSLATE.int = 0;

TRANSLATE.history = [];


TRANSLATE.index = function(source_language, book, story, frame){
	
	
	SHARE.recent_loaded = false;
	SHARE.all_loaded = false;

	
	$('main').addClass('focus_translation_form').removeClass('focus_resources').removeClass('focus_tabs');
	
	
	
	
	// set local storage
	localStorage.remember = window.location.hash;
	localStorage.book = book;
	localStorage.story = story;
	localStorage.frame = frame;
	
	
	// clear all browser history
	// not working
	window.location.replace(window.location.hash);
	
	var next_frame = (frame*1)+1;
	var prev_frame = (frame*1)-1;
	
	next_frame = (next_frame < 10)? '0'+next_frame : next_frame;
	prev_frame = (prev_frame < 10)? '0'+prev_frame : prev_frame;
	
	(prev_frame == '00') ? ($('#wrap_source_text nav a:first-child').hide()) : ($('#wrap_source_text nav a:first-child').show());
	
	$('#wrap_source_text nav a:first-child').attr('href','#translate/index/'+source_language+'/'+book+'/'+story+'/'+prev_frame);
	$('#wrap_source_text nav a:last-child').attr('href','#translate/index/'+source_language+'/'+book+'/'+story+'/'+ next_frame);
	
	
	
	
	// hold on to the hashes
	$('form#translation #frame_hash').val(frame);
	$('form#translation #story_hash').val(story);
	
	
	// hide selection panel and profile panel
	$('#selection_panel, #profile_panel').addClass('hide_left');
	
	
	// hide translation resources panel
	$('#translation_resources_panel').addClass('hide_right');
	$('#share_panel').addClass('hide_right');
	$('#settings_panel').addClass('hide_right');

	setTimeout(function(){
		
		$('#translation_resources_panel').hide();
		$('#share_panel').hide();
		$('#settings_panel').hide();

	}, 600);
	
	
	
	




		

	
	// if this page is already in the DOM, don't do anything
	
	if( $('#center_panel').attr('data-id') == window.location.hash ){
		
		console.log('already loaded');
		
	}
	
	
	else {	
	
	
		$('#wrap_source_text div#source_text cite').html('['+story+'-'+frame+']');
		
		$('#center_panel').attr('data-id',window.location.hash);
		
		$('a#resource_forward').css('opacity','.5');
		
		// BEN TO DO
		// preload the form if there is any previous data	
		
		//$('form#translation input#story_title').val('foo');
		//$('form#translation textarea#frame_text').val('foo');
		
		$('#center_panel header big').html('Translation')
							.closest('header').find('small').html('Studio');

		
		
		
		
		
		
		// go fetch the source data
		$.ajax({
				
			dataType: "json",
			url: 'assets/json/obs-txt-1-en-obs-en.json',
			success: function(msg){
				
				//console.log(msg.chapters[(story*1)-1]);
				//console.log(msg.chapters[(story*1)-1].frame[(frame*1)-1]);
				
				var $frame = [];
				
				$frame.story_title = msg.chapters[(story*1)-1].title;
				$frame.story_ref = msg.chapters[(story*1)-1].ref;
				$frame.id    = msg.chapters[(story*1)-1].frames[(frame*1)-1].id;
				$frame.text  = msg.chapters[(story*1)-1].frames[(frame*1)-1].text;
				
				var total_frames = (msg.chapters[(story*1)-1].frames.length);
				
				console.log(total_frames);
				
				
				(frame*1 == total_frames) ? ($('#wrap_source_text nav a:last-child').hide()) : ($('#wrap_source_text nav a:last-child').show());
				
				
				var st = $('#source_text');
				
				st.find('h1').html($frame.story_title);
				st.find('h2').html($frame.story_ref);
				st.find('p').html($frame.text);
				
				
				//source_language, book, story, frame
				DB.readFrame(localStorage.selected_target_language_id, story, frame, function(results){
					
					//alert('readFrame callback');
					
					console.log('readFrame results');
					console.log(results);
					
					var form = $('form#translation');
					
					//alert(results.story_title);
					
					form.find('#story_title').val(results.story_title);
					form.find('#story_ref').val(results.story_ref);
					
					if(results.story_title != '' ){
						
						$('#center_panel header big').html(results.story_title)
							.closest('header').find('small').html(results.story_ref);
					}
					
					results.story_title = (typeof results.story_title == 'undefined') ? '' : results.story_title;
					results.story_ref = (typeof results.story_ref == 'undefined') ? '' : results.story_ref;

					
					
					if(results.frame_text != 'undefined'){
						form.find('#frame_text').val(results.frame_text);
					}
					
					else {
						form.find('#frame_text').val('');
					}
					
					
					form.find('#target_story_id').remove();
					form.find('#target_frame_id').remove();
					
					var updateStory = false;
					
					if(results.story_id){
		
						form.prepend('<input type="hidden" value="'+results.story_id+'" id="target_story_id" name="target_story_id"/>');
						updateStory = true;
						
					}
					
					if( (results.story_title == '' || results.story_title == 'undefined' || results.story_ref == '' || results.story_ref == 'undefined' || updateStory ==  false) && ( localStorage.selected_target_language  ) ) {
					
					
					
					
						
						DIALOG.show(
				
							'<i class="i-open-book"></i>Translate story info.',
							
							'<form id="translate_story_title"><label><strong>'+$frame.story_title+'</strong></label><input value="'+results.story_title+'" type="text" placeholder="Enter story title." /><label>'+$frame.story_ref+'</label><textarea placeholder="Enter story reference.">'+results.story_ref+'</textarea></form>',
							
							'<i class="i-disk-upload"></i>Save',
							
							function(){
							
								//window.location.hash = '#settings';
								var _story_title = $('form#translate_story_title input').val();
								var _story_ref = $('form#translate_story_title textarea').val();
								
								// insert this in the db
								
								if( updateStory ){
									
									//alert('update story');
									
									DB.updateStory(results.story_id, _story_title, _story_ref, function(){
									
										console.log('sucess update for target_story_id: ' + results.story_id);
									
									});

									
								}
								
								else {
								
									DB.insertStory( localStorage.selected_target_language_id , '0', story, _story_title, _story_ref, function(story_id){
							
										//now i have the story id
										console.log('new story_id: '+story_id);
										
										// add hidden field to DOM
										$('form#translation #target_story_id').remove();
										$('form#translation').prepend('<input type="hidden" value="'+story_id+'" id="target_story_id" name="target_story_id"/>');
																			
									});
								}
								
								$('form#translation').find('#story_title').val(_story_title);
								$('form#translation').find('#story_ref').val(_story_ref);
								
								$('#center_panel header big').html(_story_title)
									.closest('header').find('small').html(_story_ref);
								
								
								
							
							}, 
							
							"Later",
							
							function(){
							
							
								var txt = form.find('#frame_text').focus();													
							
							}
							
						); // DIALOG.show();				
						
					} // else 
					
					
					else {
						
						setTimeout(function(){
							
							var txt = form.find('#frame_text');
							
							txt.focus();						
													
						}, 500);
						
					}
					
					
					
					if(results.frame_id){
					
						form.prepend('<input type="hidden" value="'+results.frame_id+'" id="target_frame_id" name="target_frame_id"/>');
		
					}
					
				});
				
				
				
				
				
				
				
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
	
	
	
	
	
	
	
	
	if( !localStorage.selected_target_language  ){

		
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

	}
	else {
	
		$('form#translation+cite').html(localStorage.selected_target_language);
	
	}
	
	
	
	
	//if(!localStorage.bookTitle_+localStorage.selected_target_language){
	
	

	//}
	
	
		
	
};





$(document).on('keyup', "textarea", function(e) {

	console.log('keyup');

    while($(this).outerHeight() < this.scrollHeight + parseFloat($(this).css("borderTopWidth")) + parseFloat($(this).css("borderBottomWidth"))) {
    
        $(this).height($(this).height()+2);
        
    };
    
});

$(document).on('focus', "textarea", function(e) {

	console.log('focus');

    while($(this).outerHeight() < this.scrollHeight + parseFloat($(this).css("borderTopWidth")) + parseFloat($(this).css("borderBottomWidth"))) {
    
        $(this).height($(this).height()+2);
        
    };
    
    //$(this).closest('.scroll')
    
    $("#wrap_translation_form .scroll").animate({ scrollTop: $('#wrap_translation_form .scroll')[0].scrollHeight}, 1000);
    
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
	
	$('#center_panel nav a').fadeOut();
	
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
	
	$('#center_panel nav a').fadeOut();

	
	// ui
	$('button#submit_form_translation').addClass('saving').addClass('active');
	
	// kill suto save
	clearInterval(TRANSLATE.int);
	
	var tis = $(this);
	
	var story_hash = tis.find('input#story_hash').val();
	var frame_hash = tis.find('input#frame_hash').val();
	var story_title = tis.find('input#story_title').val();
	var story_ref = tis.find('input#story_ref').val();
	var frame_text = tis.find('#frame_text').val();
	
	
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
			TRANSLATE.submit_frame(target_story_id, frame_text, frame_hash);
			
			
		});
		
	}	
	
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
			TRANSLATE.submit_frame(story_id, frame_text, frame_hash);
			
			$('#center_panel nav a').fadeIn();
			
		});
		
	}
	
	
	
	
	
	
	// when finished saving
	setTimeout(function(){
	
		// ui to remove blue styling
		$('button#submit_form_translation').removeClass('active').removeClass('saving').hide();
		$('#center_panel nav a').fadeIn();
		
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
	
	
		var tis = $(this);
	
		var story_title = tis.find('big').html();
		var story_ref = tis.find('small').html();
	
		var source_story_title = $('#source_text h1').html();
		var source_story_ref = $('#source_text h2').html();
	
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
				var _story_id = $('form#translation #target_story_id').val();
				
				// insert this in the db
				
					
					//alert('update story');
					
				DB.updateStory(_story_id, _story_title, _story_ref, function(){
				
					console.log('sucess update for target_story_id: ' + _story_id);
				
				});
				
				$('form#translation').find('#story_title').val(_story_title);
				$('form#translation').find('#story_ref').val(_story_ref);
				
				$('#center_panel header big')
					.html(_story_title)
					.closest('header')
					.find('small')
					.html(_story_ref);
			
			}, 
			
			'<i class="i-close"></i> Close',
			
			function(){}
		);	
		
		
		e.preventDefault();					

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







