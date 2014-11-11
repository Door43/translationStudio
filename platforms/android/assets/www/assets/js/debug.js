var DEBUG = [];
DEBUG.in_dom = false;





DEBUG.init = function(){
	
	
	if(!DEBUG.in_dom){
		
		
		
		$('body').append('<div id="wrap_debug"><article></article><form><input placeholder="Enter Javascript" type="text"><button type="submit">Go</button></form><nav><a href="#" rel="left"><i class="i-move-left"></i></a><a href="#" class="active"><i class="i-fullscreen"></i></a><a href="#" rel="right"><i class="i-move-right"></i></a></nav></div>');
		
		
		
		DEBUG.init_console_overwrite();
		
		
		
		
		
		DEBUG.in_dom = true;
		
	}
	
	
};



$(document).on('click','#open_debug', function(e){
	
	
	e.preventDefault();
	
	
	if($('#wrap_debug').length){
		
		$('#wrap_debug').slideToggle();
	}
	
	else {
		
		DEBUG.init();
	
	}
	
});





$(document).on('click','div#wrap_debug nav a', function(e){
	
	
	e.preventDefault();
	
	// reset
	$('#wrap_debug').removeClass('left').removeClass('right');
	$('#wrap_debug nav a').removeClass('active');
	
	//
	$('#wrap_debug').addClass( $(this).attr('rel') );
	$(this).addClass('active');
	
});






$(document).on('submit','div#wrap_debug form', function(e){
	
	
	console.log('submit');
	
	e.preventDefault();
	
	var valu = $(this).find('input').val();
	
	$('div#wrap_debug article').append("<br><span>"+valu+"</span><br>");


	
	setTimeout(function(){
		
		$('div#wrap_debug form input').val('');
				
		var d = $('div#wrap_debug article');
		//d.scrollTop(d.prop("scrollHeight"));
		d.animate({scrollTop: d.prop("scrollHeight")}, 800)

		
	}, 50);
	
	eval(valu);
	
	
	
	
	
	
});




function JSONstringifyWithFuncs(obj) {
  Object.prototype.toJSON = function() {
    var sobj = {}, i;
    for (i in this) 
      if (this.hasOwnProperty(i))
        sobj[i] = typeof this[i] == 'function' ?
          this[i].toString() : this[i];

    return sobj;
  };

  var str = JSON.stringify(obj);

  delete Object.prototype.toJSON;

  return str;
}




DEBUG.init_console_overwrite = function(){


	(function () {
	
	
	
	
	    var old = console.log;
	    //var logger = document.getElementById('log');
	    console.log = function (message) {
	    
	    	//alert(typeof message);
	    	
	    	$('div#wrap_debug article').append("<br>typeof: "+(typeof message)+"<br>");
	    
	        if (typeof message == 'object') {
	            //logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(message) : message) + '<br />';
	        
				$('div#wrap_debug article').append("<br>"+ JSONstringifyWithFuncs(message) + '<br />');
	        
	        } else {
	            //logger.innerHTML += message + '<br />';
	            
	            $('div#wrap_debug article').append("<br>"+message+"<br>");
	        }
	        
	        
			setTimeout(function(){
				
				//$('div#wrap_debug form input').val('');
						
				var d = $('div#wrap_debug article');
				//d.scrollTop(d.prop("scrollHeight"));
				
				d.animate({scrollTop: d.prop("scrollHeight")}, 1000);
		
		
				
			}, 100);
			
			//old();        
	        
	   };
	    
	})();


};
