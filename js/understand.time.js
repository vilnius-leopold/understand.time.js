
//Date Time Settings//

var end_of_work = '18:00';

var default_time_zone = 'auto'; //or lt, uk, de



var weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'Oktober', 'November', 'December'];

var time_deviders = [':'];

var date_deviders = ['.', '-', '/'];


//matches 28:36h
var hour_24 = /^\s*(0?[0-9]|1[0-9]|2[0-4])(?:(?::)([0-5][0-9]))\s*h?/i;

//matches 28:36h
var am_pm = /^\s*(0?[0-9]|1[0-2])(?:(?::)([0-5][0-9]))\s*(?:am|pm)?/i;


//Setting time-zone
default_time_zone = default_time_zone.trim();

if(default_time_zone == 'auto' || default_time_zone = '')
{
	default_time_zone = new Date().getTimezoneOffset();
}


var imploded_weekdays = "";


//implodes to (M?o?n?d?a?y?)
for(var i = 0; i < 7; i++)
{
	var weekday = weekdays[i];
	var w_length = weekday.length;
	
	if(i)
	{
		imploded_weekdays += "|";
	}

	imploded_weekdays += "(";

	for(var k = 0; k < w_length; k++)
	{
		imploded_weekdays += weekday.charAt(k) + "?";		
	}

	imploded_weekdays += ")";	
}

console.log(imploded_weekdays);

var weekday_pattern_string = "^\\s*(" + imploded_weekdays + ")";


var weekday_pattern = new RegExp("ab+c", "i");