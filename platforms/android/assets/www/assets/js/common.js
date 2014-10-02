/**
 * Determine whether the file loaded from a mobile device or not
 */
isMobileDevice = function() {
	//return (document.location.protocol == "file:");
	return (window.cordova);
	// return (document.URL.indexOf("http://") === -1 && document.URL.indexOf("https://") === -1);
};

dateTimeString = function() {
	var str = "";
	var date = new Date();
	var year    = date.getFullYear();
	var month   = date.getMonth()+1;
	var day     = date.getDate();
	var hour    = date.getHours();
	var minute  = date.getMinutes();
	var second = date.getSeconds();  
	str = year+pad(month,2,"0")+pad(day,2,"0")+"_"+hour+"."+minute+"."+second;
	return str;
};


/*
	The function takes three arguments. The first argument, input, is the value you want to be padded. The second 
	argument, length, is the desired length of the padded string. The third argument, padding, is the padding value, 
	often just a single character.
*/
pad = function(input, length, padding)
{
  while((input = input.toString()).length + (padding = padding.toString()).length < length)
  {
    padding += padding;
  }
  return padding.substr(0, length - input.length) + input;
};


