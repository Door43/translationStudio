var SHARE = [];

SHARE.return_hash_to = "";
SHARE.all_loaded = false;
SHARE.recent_loaded = false;
SHARE.msg = "";
SHARE.filename = "";
SHARE.directory = "";
SHARE.fullPath = "";



// check boxes // handles the nested checkbox behavior

$(document).on('change', 'form#share input[type="checkbox"]', function(e){
	
	e.preventDefault();
	
	
	if($(this).is(":checked")) {
			
		$(this).closest('li').find('input[type="checkbox"]').prop("checked", true);
	  
	}
	else {
	
		$(this).closest('li').find('input[type="checkbox"]').prop("checked", false);
	  
	}
	
	
});





// toggle collapse

$(document).on('click', 'form#share li a', function(e){
	
	e.preventDefault();
	
	
	$(this).closest('li').toggleClass('exspand');
	$(this).next('ol').children('li').slideToggle();
	
	
});





// click to share
/*
$(document).on('click', '#share_bottom_send a', function(e){
	
	e.preventDefault();
	
	
});
*/





// toggle collapse

$(document).on('click', 'a#back_to_share', function(e){
	
	e.preventDefault();
	
	
	window.history.back();
	
	
});










SHARE.all = function(){

	SHARE.recent_loaded = false;
	localStorage.share_tab = 'all';
	
	$('a#share_unshared').removeClass('active');
	$('a#share_all').addClass('active');
	
	$('#share_panel').show();

	$('#share_preview').hide();
	$('#share_list').show();
	
	
	$('#share_bottom').show();
	$('#share_bottom_send').hide();
	$('a#back_to_share').hide();
	$('a#close_share').show();

	
	setTimeout(function(){
		
		$('#share_panel').removeClass('hide_right');
	
	}, 20);
	
	
	
	
	DB.readLanguages(function(data){
		
		
		console.log(data);
		
	});
	
	
	
	
	
	
	
	
	if(!SHARE.all_loaded){
	
		$('#share .wrap_languages').html('');

/*
		$.Mustache.addFromDom('share-list');
				    
		$('#share .wrap_books').mustache('share-list', SHARE.books, { method: 'append' }); 
*/
		
			
		DB.framesToShare(function(data){
			
			console.log('framesToShare data');
			console.log(data);
			
			$('#share .wrap_languages').html('');
	
			$.Mustache.addFromDom('share-list');
					    
			$('#share .wrap_languages').mustache('share-list', data, { method: 'append' }); 
			
			
		}, true);		
		
		
		$('#share_description p').html("Share all the translations you have done including those you have shared in the past.");
	
		SHARE.all_loaded = true;
	
	}

}; // share all





SHARE.recent = function(){

	SHARE.all_loaded = false;
	localStorage.share_tab = 'recent';
	
	$('a#share_unshared').addClass('active');
	$('a#share_all').removeClass('active');
	
	
	$('#share_panel').show();
	$('#share_preview').hide();
	$('#share_list').show();
	$('#share_bottom').show();
	$('#share_bottom_send').hide();
	$('a#back_to_share').hide();
	$('a#close_share').show();

	setTimeout(function(){
		
		$('#share_panel').removeClass('hide_right');
	
	}, 20);
	
	
	


	
	
	
	
	console.dir(SHARE.books);

	if(!SHARE.recent_loaded){
	

				    
		
		$('#share_description p').html("Share the translations you have done since the last time you shared.");
	
		SHARE.recent_loaded = true;
				
		DB.framesToShare(function(data){
			
			//console.log('framesToShare data');
			//console.log(data);
			
			$('#share .wrap_languages').html('');
	
			$.Mustache.addFromDom('share-list');
					    
			$('#share .wrap_languages').mustache('share-list', data, { method: 'append' }); 
			
			
		}, false);		
		
		
		
		
		
		
	}
	

}; // share recent








// click for share panel
$(document).on('click', '#share_bottom_send a:first-child', function(e){
	
	e.preventDefault();
	
	var frame_ids = [];
	SHARE.msg = $('#share_preview div pre').html();
	
	if(!window.plugins.socialsharing.share){
		console.log('sharing plugin not working.');
	}
	else{
		console.log('sharing plugin seems to be working.');
		
		//https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
		// params: message, subject, image link
		window.plugins.socialsharing.share(SHARE.msg); 
		
		// update shared flag for each frame_id
		$('#share_list input[data-frame-id]:checked').each(function(){
			frame_ids.push($(this).attr('data-frame-id'));// populate the array
		});
		DB.updateSharedFlags(frame_ids, function(rows_affected){
			console.log('rows affected: ' + rows_affected);
		});
		
	}

});



// TODO BEN
// click for SD card
$(document).on('click', '#share_bottom_send a:last-child', function(e){
	
	e.preventDefault();
	
	
	// alert('Save to SD Card');
	

	var frame_ids = [];
	SHARE.msg = $('#share_preview div pre').html();
	
	if(!window.requestFileSystem){
		console.log('file plugin not working.');
	}
	else{
		console.log('file plugin seems to be working.');
		
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, SHARE.gotFS, SHARE.fail);
		
		// update shared flag for each frame_id
		$('#share_list input[data-frame-id]:checked').each(function(){
			frame_ids.push($(this).attr('data-frame-id'));// populate the array
		});
		DB.updateSharedFlags(frame_ids, function(rows_affected){
			console.log('rows affected: ' + rows_affected);
		});
		
	}


	

});




SHARE.preview = function(){
	
	var frame_ids = [];

	$('#share_preview').show();
	$('#share_list').hide();
	$('#share_bottom').hide();
	$('#share_bottom_send').show();
	$('a#back_to_share').show();
	$('a#close_share').hide();
	
	// start array
	$('#share_list input[data-frame-id]:checked').each(function(){
		
		frame_ids.push($(this).attr('data-frame-id'));// populate the array
		
	});
	if(!frame_ids.length){
		// notify user to select at least one frame.
		DIALOG.show(
			'<i class="i-warning"></i> Error',
			'Must select at least one frame to share.',
			'OK',
			function(){
			
				window.history.back();
			
			}, 
			false,
			function(){}
		);
		
		
		
	}
	else{
		// use the array
		DB.selectedFramesToShare(frame_ids, function(data){
			
			console.log('selectedFramesToShare data');
			console.log(data);
			
			$('#share_preview div pre').html('');
	
			$.Mustache.addFromDom('share-preview');
					    
			$('#share_preview div pre').mustache('share-preview', data, { method: 'append' }); 
		
		
			var str = $('#share_preview div pre').html();
		
			str = str.replace(/\[{\]/gi,'{{');
			str = str.replace(/\[}\]/gi,'}}');
			
			$('#share_preview div pre').html(str);
			
		});
	}
	

};

// WRITE FILE FUNCTIONS


/*
function onRequestFileSystem(fileSystem) {
    var directoryReader = fileSystem.root.createReader();
    directoryReader.readEntries(onReadEntries, function (evt){alert("ERRR... 2");});
}

function onReadEntries(entries) {
    for (var i = 0; i < entries.length; i++) {
        console.log(entries[i].name+ "  " + i);
    }
}
*/


SHARE.gotFS = function(fileSystem){
	// alert("gotFS");
	SHARE.directory = fileSystem.root.fullPath;
	SHARE.filename = "obs_"+dateTimeString()+".txt";
	SHARE.fullPath = SHARE.directory.slice(-1) == "\/" ? SHARE.directory + SHARE.filename : SHARE.directory + "\/" +SHARE.filename;
	console.log("DIRECTORY: "+SHARE.directory);
	console.log("FILENAME: "+SHARE.filename);
	fileSystem.root.getFile(SHARE.filename, {create: true, exclusive: false}, SHARE.gotFileEntry, SHARE.fail);
};

SHARE.gotFileEntry = function(fileEntry){
        fileEntry.createWriter(SHARE.gotFileWriter, SHARE.fail);
};

SHARE.gotFileWriter = function(writer) {
	writer.onwriteend = function(evt) {
		// alert("File contents successfully written to " + SHARE.directory + SHARE.filename);
		DIALOG.show(
			'Success',
			'File contents successfully written to ' + SHARE.fullPath,
			'OK',
			function(){}, 
			false,
			function(){}
		);

	};
	writer.write(SHARE.msg);
};

SHARE.fail = function(error) {
    alert("File creation failed.");
	DIALOG.show(
		'Error',
		'File creation failed.',
		'OK',
		function(){}, 
		false,
		function(){}
	);
    
};
