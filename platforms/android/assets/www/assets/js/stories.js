var STORIES = [];




STORIES.in = function(book){


	$('main header nav a#open_selections').addClass('swell');

	$('textarea, input').trigger('blur');

	// disable translation textarea
	$('#center_panel form#translation textarea#frame_text').attr('disabled', 'true');

	$('main').removeClass('focus_translation_form').removeClass('focus_resources').addClass('focus_tabs');
	// show the stories in this book
	//e.preventDefault();
	
	// $('#dialog header .close').trigger('click');
	
	localStorage.book = book;
	
	//var book = tis.attr('data-book');
		
	$('.tabs a:eq(1)').trigger('click');
	
	$('#put-story-list').html('<li class="title"></li>'); 


	$.ajax({
			
		dataType: "json",
		url: 'assets/json/obs-txt-1-en-obs-en.json',
		error: function(xhr,status,error) {
			//alert('Error reading file: obs-txt-1-en-obs-en.json\n\rxhr: '+xhr+'\n\rstatus: '+status+'\n\rerror: '+error);
			DIALOG.show(
				'Error',
				'Error reading file: obs-txt-1-en-obs-en.json\n\rxhr: '+xhr+'\n\rstatus: '+status+'\n\rerror: '+error,
				'OK',
				function(){}, 
				false,
				function(){}
			);	    	
		},
		success: function(msg){
			
			//console.log(msg.chapters);
			// alert('ajax chapters');
			if(book == 'obs'){
				BOOKS.title = 'Open Bible Stories';
			}
			
			
			
			$('#put-story-list li.title').html('<h1>'+BOOKS.title+'</h1><div id="loader"><dt></dt></div>');
			
			
			//console.log(msg.chapters);
			
			//console.log(typeof msg.chapters);
			
			
			$.Mustache.addFromDom('story-list');
			    
			$('#put-story-list').mustache('story-list', msg.chapters, { method: 'append' }); 
			
			setTimeout(function(){
			
				//$('article.scroll').on('touchstart', function(event){});

			
				$('#put-story-list #loader').remove();
				
				$('[data-story="'+localStorage.story+'"]').addClass('active');
				
				
				// get the stories i have already worked on in this language
				DB.storiesUnderConstruction(localStorage.selected_target_language_id, function(data){
					
					console.log('storiesUnderConstruction');
					console.log(data);
					
					$('[data-story] i.i-wrench').hide();
					
					$.each(data, function (i) {
					
						console.log(data[i]);
						$('[data-story="'+data[i].story+'"] i.i-wrench').show();
					
					});
					
				});

				
				
			}, 500);
			
			
			msg = null; // free up some memory
			tis = null;
			book = null;
			
		} // success
			
	}); //ajax
	
	
	
	// change the hred in the second tab
	$('[data-tab="story"]').attr('href',window.location.hash);
	
	
};