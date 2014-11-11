var DIALOG = []; 


console.log('DIALOG');








// show the dialog and defines it't text and behaivior

DIALOG.show = function(heading,text,yes_ui, yes, no_ui, no, show_close){
	console.log('dialog.show');
	
	
	show_close = typeof show_close !== 'undefined' ? show_close : true;
/*
	setTimeout(function(){
		
		$('textarea, input').trigger('blur');
		
	}, 600);
*/
	
	DIALOG.ui = $('#dialog');

	if(!show_close){
		DIALOG.ui.find('header .close').hide();
	}
	
	DIALOG.ui.find('header h1').html(heading);
	//show the dialog ui
	$('body').addClass('show_dialog');
	
	// write text in
	DIALOG.ui.find('heading h1').html(heading);
	DIALOG.ui.find('p').html(text);
	
	// unbind previaous clicks
	DIALOG.ui.find('a').unbind('click');
		
	// the YES button	
	DIALOG.ui.find('a.yes').html(yes_ui).one('click', function(e){
		
		e.preventDefault();
		DIALOG.hide();
		yes();
	});
	
	if(!no_ui){
		DIALOG.ui.find('a.no').hide();
		DIALOG.ui.find('header .close').hide();
	}
	
	else {
		DIALOG.ui.find('a.no').show();
	}
	
	// the NO button
	DIALOG.ui.find('a.no').html(no_ui).one('click', function(e){
		
		e.preventDefault();
		DIALOG.hide();
		no();
	});
	
	
};





// hide the Dialog and reset some things
DIALOG.hide = function(){
	
	//DIALOG.ui.hide(0, function(){
		
		$('body').removeClass('show_dialog');
		
		console.log('dialog.hide');
		if(DIALOG.ui){
		
			setTimeout(function(){
				
				DIALOG.ui.attr('style','').find('heading h1').html('...');
				DIALOG.ui.find('p').html('...');
				
			}, 500);

		}

	//});
	
};



// close button
$(document).on('click', '#dialog a.close', function(e){

	e.preventDefault();

	DIALOG.hide();
	
});

