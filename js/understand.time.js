//SETTINGS//

var end_of_work = '18:00';

var default_time_zone = 'auto'; //or lt, uk, de

var weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'Oktober', 'November', 'December'];

var date_deviders = ['.', '-', '/'];

var time_deviders = [':'];

//--- END SETTINGS ---//

var imploded_time_deviders = implode(time_deviders);

//--- 24 HOURS TIME ---//
var hour_24_pattern_string = "^\\s*(0?[0-9]|1[0-9]|2[0-4])(?:(?:" + imploded_time_deviders + ")([0-5][0-9]))\\s*h?";

var hour_24_pattern = new RegExp(hour_24_pattern_string, "i");


//--- AM/PM TIME ---//
var am_pm_pattern_string = "^\\s*(0?[0-9]|1[0-2])(?:(?:" + imploded_time_deviders + ")([0-5][0-9]))\\s*(?:am|pm)?";

var am_pm_pattern = new RegExp(am_pm_pattern_string, "i");


//Setting time-zone
default_time_zone = default_time_zone.trim();

if(default_time_zone == 'auto' || default_time_zone == '')
{
	default_time_zone = new Date().getTimezoneOffset();
}


var imploded_weekdays = "";


//implodes to (M?o?n?d?a?y?)|(T?u?e?s?d?a?y?)|...
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


var weekday_pattern = new RegExp(weekday_pattern_string, "i");


//--- FUNCTIONS ---//

function implode(item_array)
{
	var imploded_string = "";

	var item_count = item_array.length;

	for(var i = 0; i < item_count; i++)
	{	
		if(i)
		{
			imploded_string += "|";
		}

		imploded_string += item_array[i];
	}

	return imploded_string;
}

var understand = {

	time: function(human_time){

		console.log('input: ' + human_time);

		var computer_time = '16:00 26-07-2013 GMT+01:00';

		return computer_time;
	}

}