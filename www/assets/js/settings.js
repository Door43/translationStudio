var SETTINGS = [];



// close settings panel
/*
$(document).on('click', 'a#close_settings', function(e){
	
	e.preventDefault();
	
	$('#settings_panel').addClass('hide_right');
	
	setTimeout(function(){
		
		$('#settings_panel').hide();
	
	}, 600);
	
	window.history.back();

});
*/


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


SETTINGS.index = function(){
	
	
	$('#settings_panel').show();
	
	setTimeout(function(){
		
		$('#settings_panel').removeClass('hide_right');
	
	}, 20);
	
	// empty list
	$('#users_target_languages ol').html('');
	
	
	// BEN TODO
	// create json form language table
	// string, id
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



$(document).ready(function(){
	if ( isMobileDevice() ) {
        document.addEventListener("deviceready", SETTINGS.onDeviceReady, false);
    } else {
        SETTINGS.onDeviceReady();
    }	
});



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
	
	
	
	// 
	
	
	
};






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



// trigger submit when use clicks the plus icon
$(document).on('click','form#new_target_language_form em a',function(e){ 

	e.preventDefault();
	
	$(this).closest('form').trigger('submit');

});


// submit form to add new target languge 
$(document).on('submit','form#new_target_language_form',function(e){ 
	
	e.preventDefault();
	
	
	console.log('submit new_target_language_form');
	
	var tis = $(this);

	var lang = tis.find('input').val();
			
	tis.find('input').val('').blur();
	
	tis.find('em a').hide();
	
	
	
	// insert new record for language table and return it's id
	//then do this as a callback

	DB.insertLanguage(lang, '0', function(language, language_id){
		
		//console.log();
		
		$('#users_target_languages ol').prepend('<li><a data-language-id="'+language_id+'" href="#" id="" class="_checked"><em><i class="i-check"></i><i class="i-uncheck"></i></em><hgroup><form class="language_edit_form"><input type="text" class="language_edit" value="'+language+'"></form></hgroup></a></li>');
		
		
		// see if this is the only language in the list
		setTimeout(function(){
			
			if($('#users_target_languages ol li').length == 1){
				
				// automatically select this option since it's the only option
				$('#users_target_languages ol li a').trigger('click');
			}
			
		}, 100);

		
		
	});

	
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
			localStorage.selected_target_language = language;
			
		}
		//localStorage.selected_target_language = language;
		
	});
	
	
	
});




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





