var SETTINGS = [];


SETTINGS.target_languages_object = '';


// close settings panel
$(document).on('click', 'a#close_settings', function(e){
	
	
	$('#settings_panel').addClass('hide_right');
	
	setTimeout(function(){
		$('#settings_panel').hide();
	}, 600);
	
	// remove icon swell (needed when the left panel is still open)
	setTimeout(function(){
		$('main header nav a#settings').removeClass('swell');
	}, 1000);
	
	// alert( $(this).attr('href') );
	
	
/*
	e.preventDefault();
	
	$('#settings_panel').addClass('hide_right');
	
	setTimeout(function(){
		
		$('#settings_panel').hide();
	
	}, 600);
	
	window.history.back();

*/
});



// RTL 
$(document).on('click', '#settings_panel a#use_rtl', function(e){
	
	e.preventDefault();
	
	var tis = $(this);
	
	if(tis.hasClass('checked')){
		
		// uncheck it
		tis.removeClass('checked');
		$('body').removeClass('translation_rtl');
		
		localStorage.translation_rtl = 'false';
		
	}
	
	else {
		
		// check it
		tis.addClass('checked');
		$('body').addClass('translation_rtl');
		
		localStorage.translation_rtl = 'true';
	}

});


SETTINGS.target_language = function(){


	// do ajax call just once
	$('#language_input_select_list').html('');
	
	$.ajax({
			
		dataType: "json",
		url: 'assets/json/obs-txt-1-langnames.json',
		error: function(xhr,status,error) {
			//alert('Error reading file: obs-txt-1-langnames.json\n\rxhr: '+xhr+'\n\rstatus: '+status+'\n\rerror: '+error);
			
			DIALOG.show(
				'Error',
				'Error reading file: obs-txt-1-langnames.json\n\rxhr: '+xhr+'\n\rstatus: '+status+'\n\rerror: '+error,
				'OK',
				function(){}, 
				false,
				function(){}
			);	    	

		},
		success: function(msg){
			
			console.log('read langnames.json successful');
			SETTINGS.target_languages_object = msg;
			
		} // success
			
	}); //ajax

	$('#settings_panel').show();
	$('#settings_panel').removeClass('hide_right');

	// hide the initial settings UI
	$('#settings_panel #settings_index').hide();
	
	$('#settings_panel #settings_target_language').show();
	

	// empty list and hide legend
	$('#search_for_target_language_results').html('');
	$('#settings_target_language legend').hide();
	
	// focus on the seach field
	// since Android browser removes placeholder text on focus, we decided to not automatically focus on the input field
	// decided to put it back
	$('#search_for_target_language').focus().val("");
	
	// click on the seach field (click required to bring up the keyboard)
	// this "fix" does not work -- keyboard does not show up
	// $('#search_for_target_language').click(function(e){
		// $(this).focus();
	// });
	// $('#search_for_target_language').trigger('click');
	
	// turn off native autocomplete
	$('#search_for_target_language').attr( "autocomplete", "off" );

};



// if the user presses "enter" ( or "search" on an iPhone )
// don't submit the form

$(document).on('submit', 'form#search_for_target_language_form', function(e){
	
	e.preventDefault();
	
	console.log('capture submit event for form#search_for_target_language_form');
	
	$(this).find('input').blur();
	
	// puts the focus on the first result
	$('ul#search_for_target_language_results li:first-child a').focus();
	
});




// on key up event
// search for string within SETTINGS.target_languages_object
$(document).on('keyup', "#search_for_target_language", function(e) {

	console.log('keyup');
	var val = $(this).val(), indexes = [], arr = SETTINGS.target_languages_object, max = 200, results = [], results_row = {};
	console.log('val: '+ val);
	
    for(var i = 0; i < arr.length; i++){
        if (val != "" && (arr[i].lc.trim().toLowerCase().indexOf(val) > -1 || arr[i].ln.trim().toLowerCase().indexOf(val) > -1)){
        	// console.log('arr['+i+'].lc: '+ arr[i].lc);
        	// console.log('arr['+i+'].ln: '+ arr[i].ln);
            indexes.push(i);
        }
    }

	// empty list
	$('#search_for_target_language_results').html('');

	
	//update DOM with no more than 200 choices
	indexes.length > max ? max = max : max = indexes.length;
	
    for(var i = 0; i < max; i++){
    	results_row = SETTINGS.target_languages_object[indexes[i]];
    	results.push(results_row);
    }
    
    // console.log(results);

	$.Mustache.addFromDom('search-for-target-language-results');
	    
	$('#search_for_target_language_results').mustache('search-for-target-language-results', results, { method: 'append' }); 
	
	
	$('#settings_target_language legend').removeClass('red');
	
	if(indexes.length == 1){
	
		$('#settings_target_language legend').show().find('span').html(results.length + ' result');
		
	}
	else if(indexes.length > max){
	
		$('#settings_target_language legend').addClass('red').show().find('span').html('Showing partial results.  Be more specific.');
		
	}
	else if(indexes.length > 1){
	
		$('#settings_target_language legend').show().find('span').html(results.length + ' results');
		
	}
	else {
		$('#settings_target_language legend').addClass('red').show().find('span').html('No results');
	}
	
    
});


SETTINGS.index = function(){


	//
	$('main header nav a#settings').addClass('swell');


	SETTINGS.target_languages_object = null;
	
	
	$('#settings_panel').show();
	
	$('#settings_panel #settings_index').show();
	$('#settings_panel #settings_target_language').hide();
	
	$('#center_panel form#translation textarea#frame_text').attr('disabled', 'true');
	
	setTimeout(function(){
		
		$('#settings_panel').removeClass('hide_right');
	
	}, 20);
	

	// empty select list
	$('#language_input_select_list').html('');
	
/*
	$.ajax({
			
		dataType: "json",
		url: 'assets/json/obs-txt-1-langnames.json',
		success: function(msg){
			
			//$.Mustache.addFromDom('target-languages-select-list');
			    
			//$('#language_input_select_list').mustache('target-languages-select-list', msg, { method: 'append' }).prepend('<option value="" disabled="" selected="">Add a new source language.</option>'); 
			
			msg = null; // free up some memory
			
		} // success
			
	}); //ajax
*/



	// empty list
	$('#users_target_languages ol').html('');

	// list out the users previous languages
	DB.readLanguages(function(json){
		
		console.log('json');
		console.log(json);
		console.log(typeof json);
		
		$.Mustache.addFromDom('target-languages-list');
		    
		$('#users_target_languages ol').mustache('target-languages-list', json, { method: 'append' }); 
		
		
		// add check to selected target language
		setTimeout(function(){
			
			$('#users_target_languages ol li a[data-language-id="'+localStorage.selected_target_language_id+'"]').addClass('checked');
			
		}, 100);
		
	});
	
	
	//console.log(languages.length);
	
			
	
	
	

};




SETTINGS.onDeviceReady = function(){

	// init rtl check box
	if(localStorage.translation_rtl == 'true' || localStorage.translation_rtl == true){
		
		$('body').addClass('translation_rtl');
		$('#settings_panel a#use_rtl').addClass('checked');
		
	}
	
	else {	
	
		localStorage.translation_rtl = 'false';
		$('body').removeClass('translation_rtl');
		$('#settings_panel a#use_rtl').removeClass('checked');
		
	}
	
		
/*
	// read langnames.json into localstorage variable langnames 
	if (localStorage.getItem("initial_setup") === null || localStorage.getItem("initial_setup") == "0"){
		
		localStorage.setItem('initial_setup', '0');
		$.ajax({
				
			dataType: "json",
			url: 'assets/json/obs-txt-1-langnames.json',
			success: function(json){
				console.log('hello');
				console.log('langnames: '+json);
				localStorage.setItem('langnames', JSON.stringify(json));
			} // success
				
		}); //ajax
	
		localStorage.setItem('initial_setup', '1');
		// window.location.hash = HASH.myDefault;
		// $(window).trigger("hashchange");
		
	}
*/


	
	
};






/*
// user has type something in the input 
$(document).on('keydown','form#new_target_language_form input',function(){ 
	
	var tis = $(this);
	
	if( (tis.val()).trim() != ''){
	
		tis.closest('form').find('em a').show();
	
	}
	else {
	
		tis.closest('form').find('em a').hide();
	
	}
	
});
*/



/*
// trigger submit when use clicks the plus icon
$(document).on('click','form#new_target_language_form em a',function(e){ 

	e.preventDefault();
	
	$(this).closest('form').trigger('submit');

});
*/

// trigger submit when use selects a language in drop down
$(document).on('change','form#new_target_language_select_form select',function(e){ 

	e.preventDefault();
	
	$(this).closest('form').trigger('submit');

});


// add new target languge 
$(document).on('click','ul#search_for_target_language_results a',function(e){ 
	// console.log("you picked one");
	e.preventDefault();
	
	
	console.log('selected new target language');
	
	var tis = $(this),
		lang_code = tis.find('figure').text().trim(),
		lang_name = tis.find('h1').text().trim(),
		lang_in_list = false;

/*
	var lang = tis.find('input').val();
			
	tis.find('input').val('').blur();
	
	tis.find('em a').hide();
*/
	
	
	console.log('lang_code: '+lang_code);
	console.log('lang_name: '+lang_name);
	
	// is this language already in user's language list?
	$( "div#settings_panel article#settings_index ul li#users_target_languages ol li a" ).each(function( index, element ) {
		// element == this
		if ( $( this ).attr("data-language-code") == lang_code ) {
			// this language is already in user's language list
			// alert('this language already in list.');
			lang_in_list = true;
		}
	});	
	
	if(lang_in_list){
		console.log('language already in user list');
		setTimeout(function(){
			// automatically select this option since it was chosen in drop down
			$("#users_target_languages ol li a[data-language-code='" + lang_code +"']").trigger('click');
		}, 100);
		window.location.hash = '#settings';		
		
	} // if
	else{
		console.log('language NOT in user list');
		// insert new record for language table and return it's id
		//then do this as a callback
		DB.insertLanguage(lang_name, lang_code, '0', function(language, language_id){
			
			console.log('callback');
			
			$('#users_target_languages ol').prepend('<li><a data-language-id="'+language_id+'" href="#" id="" class="_checked"><em><i class="i-check"></i><i class="i-uncheck"></i></em><hgroup><form class="language_edit_form"><input type="text" class="language_edit" value="'+language+'"></form></hgroup></a></li>');
			
			
	/*
			// see if this is the only language in the list
			setTimeout(function(){
				
				if($('#users_target_languages ol li').length == 1){
					
					// automatically select this option since it's the only option
					$('#users_target_languages ol li a').trigger('click');
				}
				
			}, 100);
	*/
	
			setTimeout(function(){
				
				// automatically select this option since it was chosen in drop down
				$("#users_target_languages ol li a[data-language-code='" + lang_code +"']").trigger('click');
				
			}, 500);
	
			// alert('did I get this far?');
			window.location.hash = '#settings';
			
		});
		
	} // else
	
});





// selecting a target languge from the list
$(document).on('click',"#users_target_languages ol li a", function(e){
	
	e.preventDefault();
	
	
	if( e.target.attributes.class.nodeValue != "language_edit" ){
	
		var tis = $(this);
	
		
		// remove check from all others
		$('#users_target_languages ol li a').removeClass('checked');
	
	
		if(tis.hasClass('checked')){
			
			// uncheck it
			//tis.removeClass('checked');
			//$('body').removeClass('translation_rtl');
			
			//localStorage.translation_rtl = 'false';
			
		}
		
		else {
			
			// check it
			tis.addClass('checked');
			//$('body').addClass('translation_rtl');
			
			localStorage.selected_target_language = (tis.find('input').val()).trim();
			localStorage.selected_target_language_id = tis.attr('data-language-id');
			
			
			// easter egg to show the debug button
			if(localStorage.selected_target_language == 'DEBUG'){
				
				//alert('DEBUG');
				
				$('#open_debug').show().trigger('click').css('top','0'); 
				
			}
			
			
			
			// remove this so it will refresh the form when you change the language
			$('#center_panel').attr('data-id','refresh');
			
			//localStorage.translation_rtl = 'true';
		}
	}
	
});






/*
// when user edits a language
$(document).on('submit', 'form.language_edit_form', function(e){
	
	e.preventDefault();
	e.stopPropagation();

	var tis = $(this);
	
	var language = (tis.find('input').val()).trim();
	var language_id = tis.closest('a').attr('data-language-id');
	
	DB.updateLanguage(language_id, language, function(){
		
		tis.find('input').blur();
		
		if(tis.closest('a').hasClass('checked')){
			
			$('form#translation+cite').html(language);
			$('a#toggle_full_screen_b span:last-child').html(language);
			localStorage.selected_target_language = language;
			
		}
		//localStorage.selected_target_language = language;
		
	});
	
	
	
});
*/




$(document).on('click', '#resetDB', function(e){
	
	e.preventDefault();
	
	var tis = $(this);
	
						DIALOG.show(
				
							'Reset database.',
							
							'This action will delete all data and reset the database.  Are you sure you want to reset the database?',
							
							'Yes',
							
							function(){
							
							
								DB.drop_tables();
								
							
							}, 
							
							"No",
							
							function(){
							
							
							}
						);						
	
	
});





