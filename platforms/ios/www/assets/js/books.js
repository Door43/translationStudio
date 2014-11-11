var BOOKS = [];

BOOKS.title = '';


// this page doens't do mucch just yet because there is only one book 'obs'



BOOKS.index = function(){

	$('main header nav a#open_selections').addClass('swell');
	
	$('textarea, input').trigger('blur');

	$('main').removeClass('focus_translation_form').removeClass('focus_resources').addClass('focus_tabs');

	// $('#dialog header .close').trigger('click');
	
	// show the books
	$('.tabs a:first-child').trigger('click');
	
	// set up the default link for the second tab
/*
	if($('span.tabs [data-tab="story"]').attr('href') == '#'){
	
		var href = $('[data-tab-content="book"] li:eq(0) a').attr('href');
	
		$('span.tabs [data-tab="story"]').attr('href', href);
		
	}
*/

		//$('article.scroll').on('touchstart', function(event){});

		
};