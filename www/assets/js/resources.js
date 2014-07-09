var RESOURCES = [];

RESOURCES.title = '';

RESOURCES.home = true;


RESOURCES.at = function(){

	$('main').removeClass('focus_translation_form').addClass('focus_resources').removeClass('focus_tabs');
	
	// if this is the first resource url, save it to the home button
	if(RESOURCES.home){
		
		$('a#resource_home').attr('href', window.location.hash).css('opacity','1');
		
	}
	
	// if we are sitting on the resource home page
	if($('a#resource_home').attr('href') == window.location.hash) {
		
		$('a#resource_home, #resource_back').css('opacity','.5');
		
	}
	
	else {
		$('a#resource_home, #resource_back').css('opacity','1');
	}
	
	
	// update the href that opens back to this page
	$('a#resource_notes').attr('href', window.location.hash);



	RESOURCES.home = false;

	
	$('#translation_resources_panel').show();
	
	setTimeout(function(){
		$('#translation_resources_panel').removeClass('hide_right');
	}, 50);
			
	//$('a#resource_home').attr('href', window.location.hash);
				
	$('#translation_resources_panel .scroll').html('<h1>Loading...</h1>');

	
	var path = window.location.hash.replace("#resources/at/", "");
	
	path = path.replace(".html", "");
	path = path.replace("en/obs", "en");
	
	path = 'assets/resources/at/'+path+'.html';
	
	console.log(path);
	
	$.ajax({
			
		dataType: "html",
		url: path,
		success: function(msg){
			
			//console.log(msg);
			
			
			$('#translation_resources_panel .scroll').html(msg);
	
	
			// cleanup html
			setTimeout(function(){
				
				$('#translation_resources_panel .scroll img').parent().remove();
				
				$("#translation_resources_panel a:contains('Up')").remove();
				
			}, 50)
		

			msg    = null; // free up some memory
			
		}, // success
		error: function(){
			
			$('#translation_resources_panel .scroll').html('<h1>File not found.</h1>');
		}	
	}); //ajax
	
};




$(document).on('click','#translation_resources_panel .scroll a.wikilink1', function(e){
	
	
	e.preventDefault();
	
	var tis = $(this);
	
	var href = tis.attr('href');
	
	console.log(href);
	
	href = href.replace("/en/", "resources/at/obs/en/");
	href = href.replace("/obs/obs/", "/obs/");
	
	console.log(href);
	
	document.location.hash = href;
	
});

