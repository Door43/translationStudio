var FRAMES = [];

FRAMES.title = '';

FRAMES.in = function(book,story){

	$('main').removeClass('focus_translation_form').removeClass('focus_resources').addClass('focus_tabs');


	$('#dialog header .close').trigger('click');

	// save book and story to local storage
	localStorage.book = book;
	localStorage.story = story;
	
	
	
	// show the frames in this story
	//e.preventDefault();
	
	//var tis = $(this);
	
	//var story = tis.attr('data-story');
	
	//var title = 'TITLE';
			
	$('.tabs a:eq(2)').trigger('click');
	
	$('#put-frame-list').html('<li class="title"></li>'); 
			
	$.ajax({
			
		dataType: "json",
		url: 'assets/json/obs-txt-1-en-obs-en.json',
		success: function(msg){
													
			//console.log(msg.chapters[((story*1)-1)]);
			
			FRAMES.title = msg.chapters[((story*1)-1)].title;
			
			$('#put-frame-list li.title').html('<h1>'+FRAMES.title+'</h1><div id="loader"><dt></dt></div>');
			
			
			var frames_obj = msg.chapters[((story*1)-1)].frames;
			
			
			$.each( frames_obj, function( key, value ) {
				////console.log( key + ": " + value );
				
				var ob = frames_obj[key].id.split("-");
				
				frames_obj[key].story = ob[0];
				frames_obj[key].frame = ob[1];
				
			});
			
			//console.log(frames_obj);
			
			$.Mustache.addFromDom('frame-list');
			    
			$('#put-frame-list').mustache('frame-list', frames_obj, { method: 'append' }); 
			
			setTimeout(function(){
			
				$('#put-frame-list #loader').remove();
				
				$('[data-frame="'+	localStorage.frame+'"]').addClass('active');
				
				
				
				DB.framesUnderConstruction(HASH.array[3], localStorage.selected_target_language_id, function(data){
					
					console.log('framesUnderConstruction');
					console.log(data);

					$('[data-frame] i.i-wrench').hide();

					$.each(data, function (i) {
					
						console.log(data[i]);
						$('[data-frame="'+data[i].frame+'"] i.i-wrench').show();
					
					});

					
				});

				
				
				
			}, 500);
			
			
			
			
			
			
			
			msg = null; // free up some memory
			tis = null;
			story = null;
			title = null;
			frames_obj = null;
			
		} // success
			
	}); //ajax
	
	
	
	// change the href in the third tab
	$('[data-tab="frame"]').attr('href',window.location.hash);

	
	
};