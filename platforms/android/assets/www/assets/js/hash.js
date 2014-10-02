var HASH = [];


//alert('hash.js');


if ("onhashchange" in window) {
}
else {
    alert("The browser does not support the hashchange event!");
}





HASH.first_visit=true;



HASH.onDeviceReady = function(){
	

	// alert('hash.ondeviceReady');
    if(window.location.hash.length == false){
    	
    	location.hash = CONFIG.myDefaultHash;
    	
    	// android does not display hash the first time the page is loaded, causing a browser history error
    	// fix for android browser not displaying hash on first time loading this page
    	// While this fixes an issue with the Android browser, it causes an ajax problem in the compiled app, perhaps a path issue?
    	// window.history.pushState("object or string", "Title", "/"+CONFIG.myDefaultHash);
    	
    	//$(window).trigger("hashchange");
	}	
	else {
		$(window).trigger("hashchange");
	}
	
};

window.onhashchange = function(){

	// hack to make the scroll work
/*
	$("article.scroll")
		//.css("-webkit-overflow-scrolling", "auto")
		.css('box-shadow','none')
		.unbind('touchstart');
	
	window.setTimeout(function () { 
	
		$("article.scroll")
			.on('touchstart', function(event){})
			//.css("-webkit-overflow-scrolling", "touch")
			.css('box-shadow','inset 0 0 0 5px pink'); 
		
	}, 1000);
*/

	//window.location.hash
	
	CUSTOM.show_terms();
	
	if( window.location.hash == '#' || window.location.hash == ''){
		//alert('no hash');	
		
		if(localStorage.remember){
			window.location.hash = localStorage.remember;
		}
		
		else {
			// window.location.hash = HASH.myDefault;
			window.location.hash = CONFIG.myDefaultHash;
		}
		
		$(window).trigger("hashchange");

	}
	

	HASH.original=(window.location.hash.replace("#","")).replace(/^\/|\/$/g,"");
	HASH.array=HASH.original.split("/");
	HASH.myClass=HASH.array[0].toUpperCase();

	if(HASH.array.length>1){
		HASH.method=HASH.array[1];
	}
	else{
		HASH.method="index";
	}
	
	HASH.params="";

	for(i=3;i<=HASH.array.length;i++){
		HASH.params = HASH.params+'"'+HASH.array[i-1]+'",';
	}
	
	HASH.params=HASH.params.replace(/,$/,"");
	HASH.evall=HASH.myClass+"."+HASH.method+"("+HASH.params+")";

	// CLASS.method(param,param)

	//console.log(HASH.evall);

	//alert(HASH.evall);
	eval(HASH.evall);
	
	//eval('alert("foo")');
	
	//document.write('<script>'+HASH.evall+'</script>')
	
/*
	var s = document.createElement('script');
	s.src = 'data:text/javascript,' + encodeURIComponent(HASH.evall);
	document.body.appendChild(s);
*/
	
	

    HASH.first_visit=false;
	
	////console.log(HASH);
	
};