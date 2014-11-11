/**
 * Determine whether the file loaded from PhoneGap or not
 */
function isMobileDevice() {
	//return (document.location.protocol == "file:");
	return (window.cordova);
	// return (document.URL.indexOf("http://") === -1 && document.URL.indexOf("https://") === -1);
}

function populateDB(tx) {
    tx.executeSql('DROP TABLE IF EXISTS translations');
    tx.executeSql(
    	'CREATE TABLE IF NOT EXISTS translations ( ' +
	    	'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
	    	'language VARCHAR(20), ' +
	    	'book VARCHAR(3), ' +
	    	'story VARCHAR(3), ' +
	    	'frame VARCHAR(3), ' +
	    	'storyHeading TEXT, ' +
	    	'storySubheading TEXT, ' +
	    	'translation TEXT, ' +
	    	'created DATETIME, ' +
	    	'modified DATETIME ' +
	    ')'
    );
    
    var data = {};
    data.language = 'en';
    data.book = 'obs';
    data.story = '01';
    data.frame = '01';
    data.storyHeading = '1. Le Creation';
    data.storySubheading = 'Le Bible story from Genesis 1-2';
    data.translation = 'Le translated text.';
    //'some text';
    var d = new Date();
    
    tx.executeSql('INSERT INTO translations (language, book, story, frame, storyHeading, storySubheading, translation, created, modified) VALUES (?,?,?,?,?,?,?,?,?)', [data.language, data.book, data.story, data.frame, data.storyHeading, data.storySubheading, data.translation, d.getTime(), d.getTime()] );
    tx.executeSql('INSERT INTO translations (language, book, story, frame, storyHeading, storySubheading, translation, created, modified) VALUES (?,?,?,?,?,?,?,?,?)', [data.language, data.book, data.story, data.frame, data.storyHeading, data.storySubheading, data.translation, d.getTime(), d.getTime()] );
}

function errorHandler(err) {
    alert("Error processing SQL: "+err.code);
}

function successCB() {
    // alert("SQL success!");
}

function sqlResults(db){
	db.transaction(function(tx){
		tx.executeSql('SELECT * FROM translations', [], function(tx, results){
			console.log(results);
		});
	}, errorHandler, successCB);
}

$(document).ready(function(){
/*
	if ( isPhoneGap() ) {
	    alert("Running on PhoneGap!");
	} else {
	    alert("Not running on PhoneGap!");
	}
*/
	if ( isMobileDevice() ) {
        document.addEventListener("deviceready", onDeviceReady, false);
    } else {
        onDeviceReady();
    }	
});

function onDeviceReady(){
	if(isMobileDevice()){
		//alert('I\'m a mobile device.');
	}
	if (!window.openDatabase) {
		alert('Databases are not supported on this device. Sorry', 'error');
	}
	else{
		var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
		db.transaction(populateDB, errorHandler, successCB);
		// sqlResults(db);
		var result = {};
		
		db.transaction(function (tx) {
			tx.executeSql('SELECT * FROM translations', [], function(tx, rs){
				for(var i=0; i<rs.rows.length; i++) {
					var row = rs.rows.item(i);
					result[i] = { 
						id: row['id'],
						translation: row['translation'],
						created: row['created'],
						modified: row['modified']
					};
				}
				console.log(result);
				// callBack(result); // <-- new bit here
			}, errorHandler);
		});		
		
	}
}
