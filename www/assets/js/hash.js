var HASH = [];


//alert('hash.js');


if ("onhashchange" in window) {
}
else {
    alert("The browser does not support the hashchange event!");
}





HASH.first_visit=true;



$(document).ready(function(){
	if ( isMobileDevice() ) {
        document.addEventListener("deviceready", HASH.onDeviceReady, false);
    } else {
        HASH.onDeviceReady();
    }	
});



HASH.onDeviceReady = function(){
	

	
    if(window.location.hash.length == false){
    
    	if(window.location.hash.length==false){
    	
    		window.location.hash=HASH.myDefault;
    	
    	}
    	//$(window).trigger("hashchange");
	}	
	else {
		$(window).trigger("hashchange");
	}
	
};

window.onhashchange = function(){

	//window.location.hash
	
	if( window.location.hash == '#' || window.location.hash == ''){
		//alert('no hash');	
		
		if(localStorage.remember){
			window.location.hash = localStorage.remember;
		}
		
		else {
			window.location.hash = HASH.myDefault;
		}
		
		$(window).trigger("hashchange");

	}
	

	HASH.original=(window.location.hash.replace("#","")).replace(/^\/|\/$/g,"");
	HASH.array=HASH.original.split("/");
	HASH.myClass=HASH.array[0].toUpperCase();

	if(HASH.array.length>1){
		HASH.method=HASH.array[1]
	}
	else{
		HASH.method="index"
	}
	
	HASH.params="";

	for(i=3;i<=HASH.array.length;i++){
		HASH.params = HASH.params+'"'+HASH.array[i-1]+'",'
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