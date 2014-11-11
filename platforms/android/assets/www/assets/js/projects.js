var PROJECTS = [];


PROJECTS.index = function(){

	$('main').removeClass('focus_translation_form').removeClass('focus_resources').addClass('focus_tabs');

	$('#projects_panel').removeClass('hide_left');

	$('#projects_panel #projects_all').removeClass('hide_left');

	$('#projects_panel #project_new').addClass('hide_right');
	
	$('#projects_panel #project_edit').addClass('hide_right');

	setTimeout(function(){
		
		$('#projects_panel #project_edit, #projects_panel #project_new').hide();

	}, 600);


};



PROJECTS.new = function(){


		
	$('#projects_panel #project_new').show();

	$('main').removeClass('focus_translation_form').removeClass('focus_resources').addClass('focus_tabs');

	$('#projects_panel').removeClass('hide_left');
	

	setTimeout(function(){

		$('#projects_panel #projects_all').addClass('hide_left');
		$('#projects_panel #project_new').removeClass('hide_right');
		$('#projects_panel #project_new').removeClass('hide_left');
		$('#projects_panel #project_books').addClass('hide_right');

	}, 20);
	
	
	setTimeout(function(){
		
		$('#projects_panel #project_edit').hide();
		$('#projects_panel #project_books').hide();

	}, 600);


};






PROJECTS.edit = function(){

	$('#projects_panel #project_edit').show();

	$('main').removeClass('focus_translation_form').removeClass('focus_resources').addClass('focus_tabs');

	$('#projects_panel').removeClass('hide_left');

	$('#projects_panel #project_new').addClass('hide_right');
		
	setTimeout(function(){
	
		$('#projects_panel #projects_all').addClass('hide_left');
		$('#projects_panel #project_edit').removeClass('hide_right');

	}, 20);
	
	setTimeout(function(){
		
		$('#projects_panel #project_new').hide();

	}, 600);


};






PROJECTS.books = function(edit_or_new){

	$('#projects_panel #project_books').show();

	$('main').removeClass('focus_translation_form').removeClass('focus_resources').addClass('focus_tabs');

	$('#projects_panel').removeClass('hide_left');
	

		
	setTimeout(function(){

		$('#projects_panel #project_new').addClass('hide_left');
		$('#projects_panel #project_edit').addClass('hide_left');
		$('#projects_panel #projects_all').addClass('hide_left');
		
		$('#projects_panel #project_books').removeClass('hide_right');

	}, 20);
	
	setTimeout(function(){
		
		//$('#projects_panel #project_new').hide();

	}, 600);


};





// toggle book selections
$(document).on('click', '#projects_panel #project_books ol li a', function(e){
	
	e.preventDefault();
	
	$(this).toggleClass('active');
	
});



