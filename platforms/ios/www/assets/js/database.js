var DB = {}; // for calling custom functions in this file
var myLanguage = 'spanglish';



//tx.executeSql('DROP TABLE IF EXISTS stories');

/*
db.transaction(function (tx) {
        tx.executeSql('DROP TABLE IF EXISTS stories');
    });

db.transaction(function (tx) {
        //tx.executeSql('DELETE FROM books');
        tx.executeSql('DROP TABLE IF EXISTS stories');
    });


*/


function errorHandler(err) {
    alert("Error processing SQL: "+err.code);
}

function successCB() {
    // alert("SQL success!");

	// this function call moved to INIT.js
	//UPDATE.init();

    return true;
}

DB.currentTime = function(){
	var d = new Date();
	return d.getTime();
};

DB.insertProject = function(project_name, source_language_id, target_language_id, rtl, callback){
	
	db.transaction(function (tx) {
		// insert record
		tx.executeSql(
			'INSERT INTO projects (project_name, source_language_id, target_language_id, rtl, created, modified) VALUES (?,?,?,?,?,?)', 
			[project_name, source_language_id, target_language_id, rtl, DB.currentTime(), DB.currentTime()],
			function(tx, results){
				// console.log(results);
				if(results.rowsAffected != 1){
					// something went wrong
				}
				else {
					var project_id = results.insertId;
					callback(project_name, project_id);
					
				}
			}
		);

	});

};

DB.readProjects = function(callback){

	db.transaction(function (tx) {
		
		tx.executeSql('SELECT projects.id, projects.project_name, sl.language AS source_language, tl.language AS target_language FROM projects', +
			'JOIN languages sl ON projects.source_language_id = sl.id ', +
			'JOIN languages tl ON projects.target_language_id = tl.id ' +
			[], 
			function (tx, results) {
				var len = results.rows.length, i;
				data = [];
				for (i = 0; i < len; i++){
					var row = results.rows.item(i);
					data[i] = {project_id: row.id, project_name: row.project_name, source_language: row.source_language, target_language: row.target_language}; //add to json object
				}
				//console.log(json);
				
				callback(data);
				
			}
		);

	});

};

DB.readLanguages = function(callback){

	db.transaction(function (tx) {
		
		tx.executeSql('SELECT * FROM languages WHERE source = "0" ORDER BY language_code',
			[], 
			function (tx, results) {
				var len = results.rows.length, i;
				data = [];
				for (i = 0; i < len; i++){
					var row = results.rows.item(i);
					data[i] = {language_id: row.id, language: row.language, language_code: row.language_code}; //add to json object
				}
				//console.log(json);
				
				callback(data);
				
			}
		);

	});

};

DB.selectLanguageFromString = function(string,callback){

	db.transaction(function (tx) {
		
		tx.executeSql('SELECT * FROM languages WHERE language_code = ?',
			[string], 
			function (tx, results) {
				var len = results.rows.length, i;
				data = [];
				for (i = 0; i < len; i++){
					var row = results.rows.item(i);
					data[i] = {language_id: row.id, language: row.language}; //add to json object
				}
				//console.log(json);
				
				callback(data);
				
			}
		);

	});

};

DB.selectSourceLanguage = function(callback){

	db.transaction(function (tx) {
		
		tx.executeSql('SELECT * FROM languages WHERE source = 1 LIMIT 1',
			[], 
			function (tx, results) {
				var len = results.rows.length, i;
				data = {};
				if(results.rows.length != 1){
					// PROBLEM: no matching data or multiple source languages
				}
				else{
					var row = results.rows.item(0);
					data = {language_id: row.id, language: row.language, language_code: row.language_code}; //add to json object
				}
				callback(data);
			},
		    function(){
				DIALOG.show(
					'Error',
					'DB.selectSourceLanguage failed.',
					'OK',
					function(){}, 
					false,
					function(){}
				);	    	
		    }
			
		);

	});

};

DB.insertLanguage = function(language, language_code, source, callback){
	
	db.transaction(function (tx) {
		// insert record
		tx.executeSql(
			'INSERT INTO languages (language, language_code, source, created, modified) VALUES (?,?,?,?,?)', 
			[language, language_code, source, DB.currentTime(), DB.currentTime()],
			function(tx, results){
				// console.log(results);
				if(results.rowsAffected != 1){
					// something went wrong
				}
				else {
					var language_id = results.insertId;
					callback(language, language_id);
					
				}
			},
		    function(){
				DIALOG.show(
					'Error',
					'DB.insertLanguage failed.\n\rlanguage: '+language,
					'OK',
					function(){}, 
					false,
					function(){}
				);	    	
		    }
			
		);

	});

};

DB.updateLanguage = function(language_id, language, language_code, callback){

	db.transaction(function (tx) {
		// update record
		tx.executeSql(
			'UPDATE languages SET language = ?, language_code = ?, modified = ? ' +
			'WHERE id = ?' , 
			[language, language_code, DB.currentTime(), language_id],
			function(tx, results){
				// console.log(results);
				if(results.rowsAffected != 1){
					// something went wrong
				}
				else {
					// it worked
				}
				callback();
			}
		);

	});
		
};

// flush out old source data for a given language id
DB.removeSourceForLanguage = function(language_id, callback){

	// delete from frames where language id is language_id and source is "1"
	db.transaction(function (tx) {
		tx.executeSql('DELETE FROM frames ' +
			'WHERE frames.id IN( ' +
				'SELECT frames.id FROM frames ' +
				'JOIN stories ON frames.story_id = stories.id ' +
				'JOIN languages ON stories.language_id = languages.id ' +
				'WHERE languages.id = ? ' +
				'AND frames.source = ? ' +
			')',
			[language_id, 1], 
			function (tx, results) {
				
				// delete from stories where the language id is language_id and the source is "1"
				db.transaction(function (tx) {
					tx.executeSql('DELETE FROM stories ' +
						'WHERE stories.id IN( ' +
							'SELECT stories.id FROM stories ' +
							'JOIN languages ON stories.language_id = languages.id ' +
							'WHERE languages.id = ? ' +
							'AND stories.source = ? ' +
						')',
						[language_id, 1], 
						function (tx, results) {
							
							callback();
							
						}
					);
			
				});

			},
		    function(){
				DIALOG.show(
					'Error',
					'DB.removeSourceForLanguage failed.',
					'OK',
					function(){}, 
					false,
					function(){}
				);	    	
		    }
			
			
		);

	});
			
};

DB.readFrame = function(language_id, story, frame, callback){

	//alert(frame);

	db.transaction(function (tx) {
		
		tx.executeSql('SELECT stories.id AS story_id, story_title, story_ref, frames.id AS frame_id, frame_text FROM frames ' +
			'JOIN stories ON frames.story_id = stories.id ' +
			'JOIN languages ON stories.language_id = languages.id ' +
			'WHERE languages.id = ? ' +
			'AND stories.story = ? ' +
			'AND frames.frame = ? ' +
			'LIMIT 1',
			[language_id, story, frame], 
			function (tx, results) {
			
				var data = {};
				
				//alert(results.rows.length);
				
				if(results.rows.length < 1){
					// no matching data
					DB.readStory(language_id, story, function(storyData){callback(storyData);});
				}
				else{
					var row = results.rows.item(0);
					data = {story_id: row.story_id, story_title: row.story_title, story_ref: row.story_ref, frame_id: row.frame_id, frame_text: row.frame_text}; //add to json object
					callback(data);
				}
			}
		);

	});

};

DB.insertFrame = function(story_id, frame, frame_text, source, callback){
	
	db.transaction(function (tx) {
		// insert record
		tx.executeSql(
			'INSERT INTO frames (story_id, frame, frame_text, source, created, modified) VALUES (?,?,?,?,?,?)', 
			[story_id, frame, frame_text, source, DB.currentTime(), DB.currentTime()],
			function(tx, results){
				// console.log(results);
				if(results.rowsAffected != 1){
					// something went wrong
				}
				else {
					
					var frame_id = results.insertId;
					
					callback(frame_id);
					
				}
			}
		);

	});

};

DB.updateFrame = function(frame_id, frame_text, callback){

	db.transaction(function (tx) {
		// update record
		tx.executeSql(
			'UPDATE frames SET frame_text = ?, modified = ? ' +
			'WHERE id = ? ' , 
			[frame_text, DB.currentTime(), frame_id],
			function(tx, results){
				// console.log(results);
				if(results.rowsAffected != 1){
					// something went wrong
				}
				else {
					callback();
				}
			}
		);

	});
		
};

DB.updateSharedFlags = function(frame_ids_array, callback){

	var frame_ids_str = frame_ids_array.join();

	db.transaction(function (tx) {
		// update record
		tx.executeSql(
			'UPDATE frames SET shared = 1, modified = ? ' +
			'WHERE id IN(' + frame_ids_str +') ' , 
			[DB.currentTime()],
			function(tx, results){
				callback(results.rowsAffected);
			}
		);

	});
		
};

DB.readStory = function(language_id, story, callback){

	db.transaction(function (tx) {
		
		tx.executeSql('SELECT stories.id AS story_id, story_title, story_ref FROM stories ' +
			'JOIN languages ON stories.language_id = languages.id ' +
			'WHERE languages.id = ? ' +
			'AND story = ? ' +
			'LIMIT 1',
			[language_id, story], 
			function (tx, results) {
				var data = {};
				if(results.rows.length != 1){
					// no matching data
				}
				else{
					var row = results.rows.item(0);
					data = {story_id: row.story_id, story_title: row.story_title, story_ref: row.story_ref}; //add to json object
				}
				callback(data);
			}
		);

	});

};

DB.selectSourceStory = function(story, callback){

	db.transaction(function (tx) {
		
		tx.executeSql('SELECT stories.id AS story_id, story_title, story_ref FROM stories ' +
			'JOIN languages ON stories.language_id = languages.id ' +
			'WHERE languages.source = 1 ' +
			'AND story = ? ' +
			'LIMIT 1',
			[story], 
			function (tx, results) {
				var data = {};
				if(results.rows.length != 1){
					// no matching data
				}
				else{
					var row = results.rows.item(0);
					data = {story_id: row.story_id, story_title: row.story_title, story_ref: row.story_ref}; //add to json object
				}
				callback(data);
			}
		);

	});

};

DB.storiesUnderConstruction = function(language_id, callback, all){

	
	if (typeof(all) != "undefined"){
		all = true;
	}

	db.transaction(function (tx) {
		
		tx.executeSql('SELECT * FROM stories WHERE language_id = ?',
			[language_id], 
			function (tx, results) {
				var len = results.rows.length, i;
				data = [];
				for (i = 0; i < len; i++){
					var row = results.rows.item(i);
					console.log(row);
					data[i] = {id: row.id, story: row.story, story_title: row.story_title}; //add to json object
				}
				//console.log(json);
				
				callback(data);
				
			}
		);

	});

};

DB.framesUnderConstruction = function(story, language_id, callback){

	//alert(story);
	//alert(language_id);

	db.transaction(function (tx) {
		
		tx.executeSql('SELECT frame FROM frames AS f JOIN stories AS s ON f.story_id = s.id WHERE s.story = ? AND s.language_id = ?',
			[story, language_id], 
			function (tx, results) {
				var len = results.rows.length, i;
				data = [];
				for (i = 0; i < len; i++){
					var row = results.rows.item(i);
					console.log(row);
					data[i] = {frame: row.frame}; //add to json object
				}
				//console.log(json);
				
				
				callback(data);
				
			}
		);

	});

};

DB.framesToShare = function(callback, all){

	all = typeof all !== 'undefined' ? all : false;
	sql_where_clause = all ? '' : 'WHERE frames.shared = 0 ';
	// console.log('hello');
	db.transaction(function (tx) {
		
		tx.executeSql('SELECT languages.id AS language_id, language, story, stories.id AS story_id, story_title, frames.id AS frame_id, frame, frame_text FROM frames ' +
			'JOIN stories ON frames.story_id = stories.id ' +
			'JOIN languages ON stories.language_id = languages.id ' +
			sql_where_clause + 
			' AND languages.source = "0" ' +
			'ORDER BY languages.id, story, frame ASC ',
			[], 
			function (tx, results) {

				var len = results.rows.length, i, j=-1, k=-1, l=-1;
				var data = [];
				var prev_language_id = '';
				var prev_book_id = '';
				var prev_story_id = '';
				var prev_frame_id = '';
				
				for (i = 0; i < len; i++){
					var row = results.rows.item(i);
					cur_language_id = row.language_id;
					cur_story_id = row.story_id;
					cur_frame_id = row.frame_id;
					if(cur_language_id !== prev_language_id){
						// console.log('i: '+ i);
						j++;
						k=-1;
						l=-1;
						data[j] = {
							language_id: row.language_id, 
							language: row.language, 
							book_info : [ 
								{
									book : 'obs',
									story_info : [] 
								}
							]
						}; 
					}
					if(cur_story_id !== prev_story_id){
						// console.log('i: '+ i);

						k++;
						l=-1;
						data[j].book_info[0].story_info[k] = {
							story_id : row.story_id, 
							story_title : row.story_title, 
							frame_info : []
						};
					}
					if(cur_frame_id !== prev_frame_id){
						// console.log('i: '+ i);
						l++;
						data[j].book_info[0].story_info[k].frame_info[l] = {
							frame_id : row.frame_id, 
							frame_text : row.frame_text,
							frame : row.frame,
							story : row.story
						};
					}

						



					// data[i] = {language_id: row.language_id, language: row.language, story_id : row.story_id, story_title : row.story_title, frame_id : row.frame_id, frame: row.frame, frame_text : row.frametext}; //add to json object
					
					// console.log('language index: '+ j);
					// console.log('current language id: '+ cur_language_id);
					// console.log('previous language id: '+ prev_language_id);
					// console.log('story index: '+ k);
					// console.log('current story id: '+ cur_story_id);
					// console.log('previous story id: '+ prev_story_id);
					// console.log('---------------');
					
					prev_language_id = cur_language_id;
					prev_story_id = cur_story_id;
					prev_frame_id = cur_frame_id;
				}

				
				callback(data);
				
			}
		);

	});

};

DB.selectedFramesToShareOLD = function(frame_ids_array, callback){

	var frame_ids_str = frame_ids_array.join();

	db.transaction(function (tx) {
		
		tx.executeSql('SELECT languages.id AS language_id, language, story, stories.id AS story_id, story_title, story_ref, frames.id AS frame_id, frame, frame_text FROM frames ' +
			'JOIN stories ON frames.story_id = stories.id ' +
			'JOIN languages ON stories.language_id = languages.id ' +
			'WHERE frames.id IN(' + frame_ids_str + ') ' +
			//'AND languages.source = "0" ' +
			'ORDER BY languages.id, story, frame ASC ',
			[], 
			function (tx, results) {

				var len = results.rows.length, i, j=-1, k=-1, l=-1;
				var data = [];
				var prev_language_id = '';
				var prev_book_id = '';
				var prev_story_id = '';
				var prev_frame_id = '';
				
				for (i = 0; i < len; i++){
					var row = results.rows.item(i);
					cur_language_id = row.language_id;
					cur_story_id = row.story_id;
					cur_frame_id = row.frame_id;
					if(cur_language_id !== prev_language_id){
						// console.log('i: '+ i);
						j++;
						k=-1;
						l=-1;
						data[j] = {
							language_id: row.language_id, 
							language: row.language, 
							book_info : [ 
								{
									book : 'obs',
									story_info : [] 
								}
							]
						}; 
					}
					if(cur_story_id !== prev_story_id){
						// console.log('i: '+ i);

						k++;
						l=-1;
						data[j].book_info[0].story_info[k] = {
							story_id : row.story_id, 
							story_title : row.story_title, 
							story_ref : row.story_ref, 
							frame_info : []
						};
					}
					if(cur_frame_id !== prev_frame_id){
						// console.log('i: '+ i);
						l++;
						data[j].book_info[0].story_info[k].frame_info[l] = {
							frame_id : row.frame_id, 
							frame_text : row.frame_text,
							frame : row.frame,
							story : row.story
						};
					}
					
					prev_language_id = cur_language_id;
					prev_story_id = cur_story_id;
					prev_frame_id = cur_frame_id;
				}

				
				callback(data);
				
			}
		);

	});

};

DB.selectedFramesToShare = function(frame_ids_array, callback){

	var frame_ids_str = frame_ids_array.join();

	db.transaction(function (tx) {
		
		tx.executeSql('SELECT languages.id AS language_id, language, language_code, story, stories.id AS story_id, story_title, story_ref, frames.id AS frame_id, frame, frame_text FROM frames ' +
			'JOIN stories ON frames.story_id = stories.id ' +
			'JOIN languages ON stories.language_id = languages.id ' +
			'WHERE frames.id IN(' + frame_ids_str + ') ' +
			//'AND languages.source = "0" ' +
			'ORDER BY languages.id, story, frame ASC ',
			[], 
			function (tx, results) {
				
				var len = results.rows.length, i, j=-1, k=-1, l=-1;
				var data = [];
				var prev_language_id = '';
				var prev_book_id = '';
				var prev_story_id = '';
				var prev_frame_id = '';
				
				for (i = 0; i < len; i++){
					var row = results.rows.item(i);
					cur_language_id = row.language_id;
					cur_story_id = row.story_id;
					cur_frame_id = row.frame_id;
					if(cur_language_id !== prev_language_id){
						// console.log('i: '+ i);
						j++;
						k=-1;
						l=-1;
						data[j] = {
							language_id: row.language_id, 
							language: row.language, 
							language_code: row.language_code, 
							book_info : [ 
								{
									book : 'obs',
									story_info : [] 
								}
							]
						}; 
					}
					if(cur_story_id !== prev_story_id){
						// console.log('i: '+ i);

						k++;
						l=-1;
						data[j].book_info[0].story_info[k] = {
							story_id : row.story_id, 
							story : row.story, 
							story_title : row.story_title, 
							story_ref : row.story_ref, 
							frame_info : []
						};
					}
					if(cur_frame_id !== prev_frame_id){
						// console.log('i: '+ i);
						l++;
						data[j].book_info[0].story_info[k].frame_info[l] = {
							frame_id : row.frame_id, 
							frame_text : row.frame_text,
							frame : row.frame,
							story : row.story
						};
					}
					
					prev_language_id = cur_language_id;
					prev_story_id = cur_story_id;
					prev_frame_id = cur_frame_id;
				}

				// callback(data);
				DB.sourceFramesData(data,function(stuff){callback(stuff);});
				
			}
		);

	});

};

DB.sourceFramesData = function(shareData, callback){

	db.transaction(function (tx) {
		
		tx.executeSql('SELECT story, COUNT(frames.id) AS total_frames FROM frames ' +
			'JOIN stories ON frames.story_id = stories.id ' +
			'JOIN languages ON stories.language_id = languages.id ' +
			'WHERE language_code = "en" ' +
			//'AND languages.source = "0" ' +
			'GROUP BY story ' +
			'ORDER BY story, frame ASC ',
			[], 
			function (tx, results) {

				var len = results.rows.length, i;
				sourceData = {};
				for (i = 0; i < len; i++){
					var row = results.rows.item(i);
					// console.log(row);
					sourceData[row.story] = row.total_frames; //add to json object
				}
				
				// loop through shareData and update as needed
				var arrayLength1 = shareData.length;
				for (var i = 0; i < arrayLength1; i++) { // language loop
					// console.log(shareData[i].language);
					arrayLength2 = shareData[i].book_info.length;
					for (var j = 0; j < arrayLength2; j++) { // book loop
						// console.log("  "+shareData[i].book_info[j].book);
						arrayLength3 = shareData[i].book_info[j].story_info.length;
						for (var k = 0; k < arrayLength3; k++) { // story loop
							// console.log("    "+shareData[i].book_info[j].story_info[k].story);
							// arrayLength4 = shareData[i].book_info[j].story_info[k].frame_info.length;
							shareFrameTotal = shareData[i].book_info[j].story_info[k].frame_info.length;
							sourceFrameTotal = sourceData[shareData[i].book_info[j].story_info[k].story];
							// console.log('number of translated frames: '+shareFrameTotal);
							// console.log('number of frames in story: '+shareData[i].book_info[j].story_info[k].story);
							for (var l = 0; l < sourceFrameTotal; l++) { // frame loop
								// console.log("      "+shareData[i].book_info[j].story_info[k].frame_info[l].frame);
								if(sourceData[shareData[i].book_info[j].story_info[k].story] > shareFrameTotal){ // need to add missing frame info to shareData
									// console.log("        There are missing frames.");
									if(typeof shareData[i].book_info[j].story_info[k].frame_info[l] === "undefined" || l+1 < parseInt(shareData[i].book_info[j].story_info[k].frame_info[l].frame)){
										// console.log("          <--insert frame-->");
										var num = l+1;
										var str = num.toString();
										var newFrame = pad(str, 2, "0");
										frameObject = {frame: newFrame, frame_id: "", frame_text: "", story: shareData[i].book_info[j].story_info[k].story};
										shareData[i].book_info[j].story_info[k].frame_info.splice(l, 0, frameObject);
									}
								}
								
							}
						}
					}
					
				}
				
				callback(shareData);
				
			}
		);

	});

};

DB.insertStory = function(language_id, source, story, story_title, story_ref, callback){
	
	db.transaction(function (tx) {
		// insert record
		tx.executeSql(
			'INSERT INTO stories (language_id, source, story, story_title, story_ref, created, modified) VALUES (?,?,?,?,?,?,?)', 
			[language_id, source, story, story_title, story_ref, DB.currentTime(), DB.currentTime()],
			function(tx, results){
				// console.log(results);
				if(results.rowsAffected != 1){
					// something went wrong
				}
				else {
					var story_id = results.insertId;
					// console.log(story_id);
					callback(story_id);
				}
			}
		);

	});

};

DB.updateStory = function(story_id, story_title, story_ref, callback){

	db.transaction(function (tx) {
		// update record
		tx.executeSql(
			'UPDATE stories SET story_title = ?, story_ref = ?, modified = ? ' +
			'WHERE id = ? ' , 
			[story_title, story_ref, DB.currentTime(), story_id],
			function(tx, results){
				// console.log(results);
				if(results.rowsAffected != 1){
					// something went wrong
				}
				else {
					callback();
				}
			}
		);

	});
		
};


function setupDB(tx) {
    // tx.executeSql('DROP TABLE IF EXISTS languages');
    tx.executeSql('DROP TABLE IF EXISTS DEMO');
    tx.executeSql('DROP TABLE IF EXISTS books');
    tx.executeSql('DROP TABLE IF EXISTS translations');
    //tx.executeSql('DROP TABLE IF EXISTS stories');
    //tx.executeSql('DROP TABLE IF EXISTS frames');
    
/*
    // old code to create languages table
    tx.executeSql(
    	'CREATE TABLE IF NOT EXISTS languages ( ' +
	    	'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
	    	'language VARCHAR(50) UNIQUE, ' +
	    	'source BOOLEAN DEFAULT 0, ' +
	    	'created DATETIME, ' +
	    	'modified DATETIME ' +
	    ')'
    );
*/
    
    // create languages table
    tx.executeSql(
    	'CREATE TABLE IF NOT EXISTS languages ( ' +
	    	'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
	    	'language_code VARCHAR(20), ' +
	    	'language VARCHAR(200) UNIQUE, ' +
	    	'source BOOLEAN DEFAULT 0, ' +
	    	'created DATETIME, ' +
	    	'modified DATETIME ' +
	    ')',[],null,
	    function(){
			DIALOG.show(
				'Error',
				'Failed to create languages table.',
				'OK',
				function(){}, 
				false,
				function(){}
			);	    	
	    }
    );
    
    // create stories table
    tx.executeSql(
    	'CREATE TABLE IF NOT EXISTS stories ( ' +
	    	'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
	    	'language_id INTEGER, ' +
	    	'source BOOLEAN DEFAULT 0, ' +
	    	'story VARCHAR(3), ' +
	    	'story_title TEXT, ' +
	    	'story_ref TEXT, ' +
	    	'created DATETIME, ' +
	    	'modified DATETIME ' +
	    ')',[],null,
	    function(){
			DIALOG.show(
				'Error',
				'Failed to create stories table.',
				'OK',
				function(){}, 
				false,
				function(){}
			);	    	
	    }
	    
    );
    
    // create frames table
    tx.executeSql(
    	'CREATE TABLE IF NOT EXISTS frames ( ' +
	    	'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
	    	'story_id INTEGER, ' +
	    	'frame VARCHAR(3), ' +
	    	'frame_text TEXT, ' +
	    	'source BOOLEAN DEFAULT 0, ' +
	    	'shared BOOLEAN DEFAULT 0, ' +
	    	'created DATETIME, ' +
	    	'modified DATETIME ' +
	    ')',[],null,
	    function(){
			DIALOG.show(
				'Error',
				'Failed to create frames table.',
				'OK',
				function(){}, 
				false,
				function(){}
			);	    	
	    }
	    
    );    

	// alert('in setupDB.\n\rlocalStorage.version = '+localStorage.version+'\n\rCONFIG.version = '+CONFIG.version);


	// version 1.2 added a new column 'language_code' to the 'languages' table
	
	
    // modify languages table if updating app from previous versions (1.1 or below)
    if(localStorage.version && ( parseFloat(localStorage.version) < parseFloat(CONFIG.version) )){
    	// alert('updating language table');
	    tx.executeSql(
	    	"ALTER TABLE languages ADD COLUMN language_code VARCHAR(20) DEFAULT '' ",[],null,
	   		function(){
				DIALOG.show(
					'Error',
					'Failed to alter languages table.',
					'OK',
					function(){}, 
					false,
					function(){}
				);	    	
		    }
	    );
	    
	    
	// update the source language record
	// version 1.1 has 'en' stored in language field, should now be:
	//    language: 'English'
	//    language_code: 'en'
	DB.selectSourceLanguage(function(data){
		DB.updateLanguage(data.language_id, 'English', 'en', function(){});
	}); 
	    // BELOW SQL NOT SUPPORTED BY SQLITE
	    // tx.executeSql(
	    	// 'ALTER TABLE languages ' +
			// 'RENAME COLUMN language to language_name '
	    // );
	    // tx.executeSql(
	    	// 'ALTER TABLE languages ' +
			// 'MODIFY language_name VARCHAR(200) '
	    // );
	    
	    
    }


/*
 *	code for version 2 (project functionality) 
 *
    // create projects table
    tx.executeSql(
    	'CREATE TABLE IF NOT EXISTS projects ( ' +
	    	'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
	    	'project_name INTEGER, ' +
	    	'source_language_id INTEGER, ' +
	    	'target_language_id INTEGER, ' +
	    	'rtl BOOLEAN DEFAULT 0, ' +
	    	'created DATETIME, ' +
	    	'modified DATETIME ' +
	    ')'
    );    

    // create books table
    tx.executeSql(
    	'CREATE TABLE IF NOT EXISTS books ( ' +
	    	'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
	    	'language_id INTEGER, ' +
	    	'book VARCHAR(10), ' +
	    	'book_title VARCHAR(100), ' +
	    	'created DATETIME, ' +
	    	'modified DATETIME ' +
	    ')'
    );

    // create projects_books_link table
    tx.executeSql(
    	'CREATE TABLE IF NOT EXISTS projects_books_link ( ' +
	    	'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
	    	'project_id INTEGER, ' +
	    	'book_id INTEGER ' +
	    ')'
    );    
*/

/*
	db.transaction(function (tx) {

		var d = new Date();

		tx.executeSql(
			'INSERT INTO books (book, book_title, language_id, created, modified) VALUES (?,?,?,?,?)', 
			['obs', 'Open Bible Stories', '1', d.getTime(), d.getTime()]
		);
		tx.executeSql(
			'INSERT INTO stories (story, book_id, language_id, story_title, story_subtitle, created, modified) VALUES (?,?,?,?,?,?,?)', 
			['01', '1', '1', 'title of story2', 'i am story two subtitle', d.getTime(), d.getTime()]
		);
		tx.executeSql(
			'INSERT INTO stories (story, book_id, language_id, story_title, story_subtitle, created, modified) VALUES (?,?,?,?,?,?,?)', 
			['01', '1', '1', 'title of story', 'i am a subtitle', d.getTime(), d.getTime()]
		);

	});
*/

}

DB.onDeviceReady = function(callback){

	if (!window.openDatabase) {
		
		DIALOG.show(
			'Error',
			'Databases are not supported on this device. Sorry',
			'OK',
			function(){}, 
			false,
			function(){}
		);
		
	}
	else {
		db = window.openDatabase("Database", "1.0", "Translation Studio", 200000);
		db.transaction(setupDB, errorHandler, callback);
	}
};



DB.drop_tables = function(){


	db.transaction(function (tx) {
        tx.executeSql('DROP TABLE IF EXISTS languages');
        tx.executeSql('DROP TABLE IF EXISTS stories');
        tx.executeSql('DROP TABLE IF EXISTS frames');
    });
    
    //clear all local storage
    
/*
    localStorage.removeItem("selected_target_language_id");
    localStorage.removeItem("selected_target_language");
    localStorage.removeItem("date_modified_en");
    localStorage.removeItem("agree_to_terms");
    localStorage.removeItem("book");
    localStorage.removeItem("date_modified_en");
    localStorage.removeItem("remember");
    localStorage.removeItem("email");
    localStorage.removeItem("frame");
    localStorage.removeItem("share_tab");
    localStorage.removeItem("story");
    localStorage.removeItem("translation_rtl");
    localStorage.removeItem("uuid");
    localStorage.removeItem("version");
*/
    
    localStorage.clear();
    
    window.localStorage.clear();
    
    location.reload();

};











