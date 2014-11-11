var RESOURCES = [];

RESOURCES.title = '';

RESOURCES.home = true;

RESOURCES.trackHistory = null;
RESOURCES.maxHistory = null;

// close resource notes panel
$(document).on('click', 'a#close_resources', function(e){
	
	
	$('#translation_resources_panel').addClass('hide_right');

	setTimeout(function(){
		$('#translation_resources_panel').hide();
	}, 600);
	
	// remove icon swell (needed when the left panel is still open)
	setTimeout(function(){
		$('main header nav a#resource_notes').removeClass('swell');
	}, 1000);
	
});


RESOURCES.at = function(){

	$('main header nav a#resource_notes').addClass('swell');


	$('textarea, input').trigger('blur');

	// disable translation textarea
	$('#center_panel form#translation textarea#frame_text').attr('disabled', 'true');

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
				
			}, 50);
		

			msg    = null; // free up some memory
			
		}, // success
		error: function(){
			
			$('#translation_resources_panel .scroll').html('<h1>File not found.</h1>');
		}	
	}); //ajax
	
};

RESOURCES.initHistory = function(){
	RESOURCES.trackHistory = 0;
	RESOURCES.maxHistory = RESOURCES.trackHistory;
	$('a#resource_forward').css('opacity','.5').attr("disabled","disabled");
	$('a#resource_back').css('opacity','.5').attr("disabled","disabled");
	$('a#resource_home').css('opacity','.5').attr("disabled","disabled");
};



$(document).on('click','#translation_resources_panel .scroll a.wikilink1', function(e){
	
	
	e.preventDefault();

	RESOURCES.trackHistory++;
	RESOURCES.maxHistory = RESOURCES.trackHistory;
	$('a#resource_forward').css('opacity','.5').attr("disabled","disabled");
	$('a#resource_back').css('opacity','1').removeAttr('disabled');
	$('a#resource_home').css('opacity','1').removeAttr('disabled');


	var tis = $(this);
	
	var href = tis.attr('href');
	
	console.log(href);
	
	href = href.replace("/en/", "resources/at/obs/en/");
	href = href.replace("/obs/obs/", "/obs/");
	
	console.log(href);
	
	document.location.hash = href;
	

});


$(document).on('click', 'a#resource_back', function(e){


	e.preventDefault();


	if ($(this).attr('disabled') != undefined) {
		// do nothing
	}
    else{

		RESOURCES.trackHistory--;
		
		window.history.back();
		
		$('a#resource_forward').css('opacity','1').removeAttr('disabled');
		if(RESOURCES.trackHistory == 0){
			$('a#resource_back').css('opacity','.5').attr("disabled","disabled");
		}
    }

});

$(document).on('click', 'a#resource_forward', function(e){
	e.preventDefault();
	
	if ($(this).attr('disabled') != undefined) {
		// do nothing
	}
    else{

		$('a#resource_back').css('opacity','1').removeAttr('disabled');
		$('a#resource_home').css('opacity','1').removeAttr('disabled');
		
		RESOURCES.trackHistory++;
	
		window.history.forward();
	
		if(RESOURCES.trackHistory == RESOURCES.maxHistory){
			$('a#resource_forward').css('opacity','.5').attr("disabled","disabled");	
		}
    	
    }

});


$(document).on('click', 'a#resource_home', function(e){
	
	e.preventDefault();

	if ($(this).attr('disabled') != undefined) {
		// do nothing
	}
    else{
		$('a#resource_home').css('opacity','.5').attr("disabled","disabled");
		$('a#resource_back').css('opacity','.5').attr("disabled","disabled");
		$('a#resource_forward').css('opacity','1').removeAttr('disabled');
			
		var num = -1*(RESOURCES.trackHistory);
		RESOURCES.trackHistory = 0;
		window.history.go(num);
    	
    }

});


