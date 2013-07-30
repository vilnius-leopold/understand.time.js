//SETTINGS//

var current_time = new Date();

var default_hour = '18';
var default_minute = '00';
var default_day = current_time.getDate();
var default_month = current_time.getMonth() + 1;
var default_year = current_time.getFullYear();

var default_time_zone = 'lt'; //auto or lt, uk, de

var weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'Oktober', 'November', 'December'];

var date_deviders = ['.', '-', '/'];

var time_deviders = [':'];

var timezones = {
	GMT0: ['uk', 'en'],
	GMT1: ['de', 'fr', 'cz', 'hr', 'be', 'at', 'hu', 'nl', 'no', 'pl', 'rs', 'se', 'ch', 'es', 'it', 'sk', 'si', 'dk'],
	GMT2: ['lt']
};

summer_time = true;

//--- END SETTINGS ---//

var imploded_time_deviders = implode(time_deviders);

//Setting time-zone
default_time_zone = default_time_zone.trim();

if(default_time_zone == 'auto' || default_time_zone == '')
{
	default_timezone_offset = new Date().getTimezoneOffset();
}
else
{
	default_timezone_offset = -240;
}

var weekday = null; 
var day = null; 
var month = null; 
var year = null; 
var hour = null; 
var minute = null; 
var timezone = null;
var relative_days = 0;

var time_found = false;
var date_found = false;



function test_time(test_string)
{
	console.log('testing time!');

	//--- 24 HOURS TIME ---//
	var hour_24_pattern_string = "(?:\\s+|^\\b)(0?[0-9]|1[0-9]|2[0-4])(?:(?:" + imploded_time_deviders + ")([0-5][0-9]))(?!\\s*(?:am|pm))\\s*h?(?:\\s+|\\b$)";

	var hour_24_pattern = new RegExp(hour_24_pattern_string, "i");

	console.log(hour_24_pattern);

	//--- AM/PM TIME ---//
	var am_pm_pattern_string = "(?:\\s+|^\\b)(0?[0-9]|1[0-2])(?:(?:" + imploded_time_deviders + ")([0-5][0-9]))?\\s*(am|pm)(?:\\s+|\\b$)";

	var am_pm_pattern = new RegExp(am_pm_pattern_string, "i");

	console.log(am_pm_pattern);

	var result_24 = hour_24_pattern.exec(test_string);

	var result_am_pm = am_pm_pattern.exec(test_string);

	console.log(result_24);
	console.log(result_am_pm);


	//24 h time
	if(result_24 != null)
	{
		if(! time_found){time_found = true;}

		hour = result_24[1];

		if(result_24[2] != undefined && result_24[2] != null && result_24[2] != '')
		{
			minute = result_24[2];
		}
		else
		{
			minute = '00';
		}
	}

	//am_pm time
	if(result_am_pm != null)
	{
		if(! time_found){time_found = true;}

		if(result_am_pm[3] == 'pm' )
		{
			hour = parseInt(result_am_pm[1]) + 12;
		}
		else
		{
			hour = result_am_pm[1];
		}
		

		if(result_am_pm[2] != undefined && result_am_pm[2] != null && result_am_pm[2] != '')
		{
			minute = result_am_pm[2];
		}
		else
		{
			minute = '00';
		}
	}
	if( ! time_found)
	{
		hour = default_hour;
		minute = default_minute;
	}

}



function test_timezone(test_string)
{
	var imploded_timezones = implode_timezones(timezones);

	var timezone_pattern_string = "(?:\\s+|^\\b)(?:" + imploded_timezones + ")(?:\\s+|\\b$)";

	var timezone_pattern = new RegExp(timezone_pattern_string, "i");

	console.log('pattern: ' + timezone_pattern);

	var test_result = timezone_pattern.exec(test_string);
	console.log('result: ' + test_result);

	if(test_result != null)
	{
		test_result.shift();

		var timezone_length = Object.size(timezones);
		console.log('timezones: ' + timezone_length);
		var timezone_offset = null;

		for(var i = 0; i < timezone_length; i++)
		{		
			if(test_result[i] != '' && test_result[i] != undefined && test_result[i] != null)
			{
				timezone_offset = i;
				if(summer_time)
				{
					timezone_offset++;
				}
				break;
			}
		}
	}

	if(timezone_offset == null)
	{

		timezone = 'GMT+0' + ((default_timezone_offset/-60) - 1) + '00';
	}
	else
	{
		timezone = 'GMT+0' + timezone_offset + '00';
	}
	
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function test_date(test_string)
{
	var imploded_months = deep_implode(months);

	var literal_date_pattern_string = "(?:\\s+|^\\b)(1(?=st)|2(?=nd)|3(?=rd)|[4-9](?=th)|1[0-9](?=th)|20(?=th)|21(?=st)|22(?=nd)|23(?=rd)|2[4-9](?=th)|30(?=th)|31(?=st)|32(?=nd)|0?[1-9](?=\\.)|[1-2][0-9](?=\\.)|3[0-2](?=\\.))(?:nd|st|th|\\.)\\s+(?:" + imploded_months + ")\\s+(?:20|')(1[3-9]|[2-9][0-9])(?:\\s+|\\b$)";

	var literal_date_pattern = new RegExp(literal_date_pattern_string, "i");

	console.log('pattern: ' + literal_date_pattern);

	var test_result = literal_date_pattern.exec(test_string);
	console.log('result: ' + test_result);

	if(test_result != null)
	{
		day = test_result[1];
		month = test_result[2];
		year = test_result[3];
	}

	var imploded_months = deep_implode(months);

	var numeric_date_pattern_string = "(?:\\s+|^\\b)(0?[1-9]|[1-2][0-9]|3[0-1])\\s?(?:" + implode(date_deviders) + ")\\s?(0?[1-9]|1[0-2])\\s?(?:" + implode(date_deviders) + ")\\s?(?:20)?(1[3-9]|[2-9][0-9])(?:\\s+|\\b$)";

	var numeric_date_pattern = new RegExp(numeric_date_pattern_string, "i");

	console.log('pattern: ' + numeric_date_pattern);

	var test_result = numeric_date_pattern.exec(test_string);
	console.log('result: ' + test_result);

	if(test_result != null)
	{
		day = test_result[1];
		month = test_result[2];
		year = test_result[3];
	}

	if( ! date_found)
	{
		day = default_day;
		month = default_month;
		year = default_year;
	}

}

function test_in_weeks(test_string)
{
	console.log('input: ' + test_string);
	var in_weeks_pattern_string = "(?:\\s+|^\\b)(?:in\\s+|\\+\\s*)(\\d{1,2})\\s+weeks?(?:\\s+|\\b$)";

	var in_weeks_pattern = new RegExp(in_weeks_pattern_string, "i");

	var test_result = in_weeks_pattern.exec(test_string);
	console.log('result: ' + test_result);

	if(test_result != null)
	{
		relative_days += parseInt(test_result[1]) * 7;

		return test_result[1];
	}
	else
	{
		return null;
	}
}

////////////////////
//--- WEEKDAYS ---//
function test_weekday(test_string)
{
	var day_of_the_week = null;

	//compose regex
	var imploded_weekdays = deep_implode(weekdays);

	var weekday_pattern_string = "^(?:\\s+|^\\b)(?:(?:this\\s+)|(next\\s+))?(?:" + imploded_weekdays + ")(?:\\s+|\\b$)";

	var weekday_pattern = new RegExp(weekday_pattern_string, "i");


	//run test
	console.log('test string:' + test_string);

	console.log('pattern:' + weekday_pattern);

	var test_result = weekday_pattern.exec(test_string);

	console.log('result: ' + test_result);

	

	if(test_result != null)
	{
		var is_next = false;

		var result_length = test_result.length;
		//remove first item from result array
		test_result.shift();
		var next = test_result.shift();

		console.log('NEXT: ' + next);

		if(next != '' && next != null && next != undefined)
		{
			is_next = true;
		}	

		for(var i = 0; i < result_length; i++)
		{
			if(test_result[i] != '' && test_result[i] != undefined)
			{
				day_of_the_week = i + 1;
				break;
			}		
		}

		console.log('Found day of the week: ' + day_of_the_week);

		var current_weekday = current_time.getDay();

		if(current_weekday == day_of_the_week)
		{			
			relative_days += 0;			
		}
		
		if(current_weekday < day_of_the_week)
		{
			relative_days += day_of_the_week - current_weekday;
		}

		if(current_weekday > day_of_the_week)
		{
			relative_days += (7 - current_weekday) + day_of_the_week;			
		}

		if(is_next)
		{
			relative_days += 7;
		}
		
	}


	return day_of_the_week;
}


//understand object
var understand = {

	//time function
	time: function(human_time){

		//start benchmark
		var start_time = Date.now();

		console.log('input: ' + human_time);		
			
		test_time(human_time);

		test_in_weeks(human_time);

		test_date(human_time);

		test_weekday(human_time);

		test_timezone(human_time);

		var time_string = month + " " + (day + relative_days) +" " + year +" " + hour +":" + minute + ":00 " + timezone;

		console.log(time_string);


		var computer_time = new Date(time_string);

		//end benchmark
		var end_time = Date.now();

		relative_days = 0;

		console.log('understood time in ' + ((end_time - start_time) / 1000).toFixed(3) + ' seconds!');

		return computer_time;
	}
}


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

function deep_implode(item_array, devider, prefix, suffix, segmentation)
{

	//DEFAULT VALUES
	devider = typeof devider !== 'undefined' ? devider : '|';
	prefix = typeof prefix !== 'undefined' ? prefix : '(';
	suffix = typeof suffix !== 'undefined' ? suffix : ')';
	segmentation = typeof segmentation !== 'undefined' ? segmentation : '?';

	var imploded_items = ""; 

	item_count = item_array.length;

	//implodes to (Mo?n?d?a?y?)|(Tu?e?s?d?a?y?)|...
	for(var i = 0; i < item_count; i++)
	{
		var item = item_array[i];
		var item_length = item.length;
		
		

		//add Devider
		if(i)
		{
			imploded_items += devider;
		}

		//add prefix and look-ahead to test min and max-lenght
		imploded_items += prefix + '(?=[a-z]{2,' + item_length + '}\\b)';

		//deep implode
		for(var k = 0; k < item_length; k++)
		{
			imploded_items += item.charAt(k);

			if(k)
			{
				imploded_items += segmentation;
			}
					
		}

		//add Suffix
		imploded_items += suffix;	
	}

	return imploded_items;
}

function implode_timezones(timezones)
{
	var imploded_timezones = "";

	var k = 0;
	$.each(timezones,function(index, value){
		if(k)
		{
			imploded_timezones += "|";
		}
		
		imploded_timezones += "(";

		var countries = value;
		var countries_length = countries.length;

		for(var i = 0; i < countries_length; i++)
		{
			if(i)
			{
				imploded_timezones += "|";
			}

			imploded_timezones += countries[i];
		}

		

		imploded_timezones += ")";
		k++;
	});

	return imploded_timezones;
}
