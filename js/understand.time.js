//SETTINGS//

var current_time = new Date();

var default_hour = '18';
var default_minute = '00';
var default_day = current_time.getUTCDate();
var default_month = current_time.getUTCMonth() + 1;
var default_year = current_time.getUTCFullYear();
var default_seconds = '00';

var default_time_zone = 'lt'; //auto or lt, uk, de

var weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'Oktober', 'November', 'December'];

var date_deviders = ['.', '-', '/'];

var time_deviders = [':'];

var timezones = {
	'UTC+00:00': {
		DST: ['uk', 'en'], 
		noDST: []
	},
	'UTC+01:00': {
		DST: ['de', 'fr', 'cz', 'hr', 'be', 'at', 'hu', 'nl', 'no', 'pl', 'rs', 'se', 'ch', 'es', 'it', 'sk', 'si', 'dk'], 
		noDST: []
	},
	'UTC+02:00': {
		DST: ['lt'], 
		noDST: []
	}
};


var run_benchmark = true;


//--- END SETTINGS ---//


//--- VARIABLES ---//
var is_summer_time = true;

var weekday = null; 
var day = 0;
var month = null; 
var year = null; 
var hour = null; 
var minute = null;
var seconds = null;
var timezone = null;
var relative_days = 0;
var timezone_offset_hour = 0;
var timezone_offset_minute = 0;
var time_found = false;
var date_found = false;

/**
 * Date tests:
 * 	01.02(.)
 * 	01-02
 * 	01/02/(20)13
 * 	1(.) F(ebruary) (2013)
 *  1.  --> upcomming relative from now
 *  1st --> upcomming relative from now
 *  F(ebruary) 1(.) (2013)
 *  F(ebruary) 1st (2013)
 *  1st (F(ebruary) (2013))
 *  t(oday)
 *  t(omorrow)
 *  in/+ 2 d(ays)
 *  in/+ 2 w(eeks)
 *  in/+ 2 m(onths)
 *  in/+ 2 y(ears)
 *  next f(riday)
 *  (this) f(riday)
 *  f(riday) in/+ 2 weeks
 *
 * Time tests:
 *  1am
 *  4pm
 *  1:30am
 *  1:30(h/o'clock)
 *  01:30(h)/am/pm
 *  0130 --> military time
 *  0100
 *  0100(h)
 *  noon --> dependent on settings 12:00
 *  midnight --> dependent on settings 24:00
 *  morning --> dependent on settings 9:00
 *  afternoon --> dependent on settings 16:00
 *  evening --> dependent on settings 18:00
 *  (today/tomorrow) --> dependent on settings (end of workday 18:00)
 *  after lunch --> dependent on settings 15:00
 *  before lunch --> dependent on settings 13:00
 *  in 2 hours
 *  in 2 minutes
 *  
 *
 * Timezone tests:
 * 	uk
 * 	de
 * 	lt
 * 	GMT(+)(0)3(:)(00)
 * 	UTC(+)(0)3(:)(00)
 * 	
 * 
 *  
 * 
 */

var imploded_date_deviders = implode(date_deviders);
var imploded_months = deep_implode(months);
var imploded_weekdays = deep_implode(weekdays);
var imploded_hidden_months = deep_implode(months, '|', '(?:', ')', '?')

function get_seconds(test_string)
{	
	seconds = default_seconds;
	
	console.log('SECONDS: ' + seconds);
}

function get_minute(test_string)
{	
	minute = default_minute;

	//tests 24h and am_pm pattern
	var minute_pattern_string = "(?:\\s+|^\\b)(?:(?:0?[0-9]|1[0-9]|2[0-4])(?=.\\d{2}\\s*(?!(?:am|pm)))|(?:0?[0-9]|1[0-2])(?=.\\d{2}(?:am|pm)))(?:" + imploded_time_deviders + ")([0-5][0-9])\\s*(?:am|pm|h|\\s*)(?:\\s+|\\b$)";

	var found = test_string.match(minute_pattern_string);

	if(found != null)
	{
		minute = found[1];

	}
	
	console.log('MINUTE: ' + minute);
}

function get_hour(test_string)
{
	hour = default_hour;

	//tests 24h and am_pm pattern
	var hour_pattern_string = "(?:\\s+|^\\b)((?:0?[0-9]|1[0-9]|2[0-4])(?=.\\d{2}\\s*(?!(?:am|pm)))|(?:0?[0-9]|1[0-2])(?=.\\d{2}(?:am|pm)))(?:" + imploded_time_deviders + ")(?:[0-5][0-9])?\\s*(?:am|pm|h|\\s*)(?:\\s+|\\b$)";

	var found = test_string.match(hour_pattern_string);
	
	if(found != null)
	{
		hour = found[1];
	}

	console.log('HOUR: ' + hour);
}
/*
 * Date tests:
 * 	01.02(.)
 * 	01-02
 * 	01/02/(20)13
 * 	1(.) F(ebruary) (2013)
 *  1.  --> upcomming relative from now
 *  1st --> upcomming relative from now
 *  F(ebruary) 1(.) (2013)
 *  F(ebruary) 1st (2013)
 *  1st (F(ebruary) (2013))
 *  t(oday)
 *  t(omorrow)
 *  in/+ 2 d(ays)
 *  in/+ 2 w(eeks)
 *  in/+ 2 m(onths)
 *  in/+ 2 y(ears)
 *  next f(riday)
 *  (this) f(riday)
 *  f(riday) in/+ 2 weeks
 */
function get_day(test_string)
{
	day = default_day;

	//tests 24h and am_pm pattern
	/*
	var day_pattern_string = "(?:\\s+|^\\b)((?:(?:1|21|31)(?=st)|(?:2|22)(?=nd)|(?:3|23)(?=rd)|(?:[4-9]|1[0-9]|20|2[4-9]|30)(?=th)|(?:0?[1-9]|[1-2][0-9]|3[0-2]|)(?=\\.))(?:nd|st|th|\\.)(?:\\s+(?:" + imploded_months + ")(?:\\s+(?:20|')(1[3-9]|[2-9][0-9]))?)?)(?:\\s+|\\b$)";
	*/

	var day_pattern_string = "((?:(?:1|21|31)(?=st)|(?:2|22)(?=nd)|(?:3|23)(?=rd)|(?:[4-9]|1[0-9]|20|2[4-9]|30)(?=th)|(?:0?[1-9]|[12][0-9]|3[0-2])(?=\\.))(?=\\s+(?:" + imploded_months + ")(?=\\s+(?:20|')(?:1[3-9]|[2-9][0-9]))?)?|(?:0?[1-9]|[12][0-9]|3[01])(?=[-/\\.](?:0?[1-9]|1[0-2])[-/\\.]?(?:(?:20)?(?:1[3-9]|[2-9][0-9]))?))";

	console.log(day_pattern_string);

	/* literal
	
	 */
	/*numeric
	(?:\\s+|^\\b)(0?[1-9]|[1-2][0-9]|3[0-1])\\s?(?:" + implode(date_deviders) + ")\\s?(0?[1-9]|1[0-2])\\s?(?:" + implode(date_deviders) + ")\\s?(?:20)?(1[3-9]|[2-9][0-9])(?:\\s+|\\b$)
	*/

	var found = test_string.match(day_pattern_string);
	
	console.log('DAY: ' + found);

	if(found != null)
	{
		day = found[1];
	}

	console.log('DAY: ' + day);
}

function get_relative_day()
{

}

function get_month(test_string)
{
	month = default_month;

	var month_pattern_string = "(?=(?:\\s+|\\b))(?:(?:0?[1-9]|[12][0-9]|3[01])(?:[-/\\.](0?[1-9]|1[0-2])[-/\\.]?(?:(?:20)?(?:1[3-9]|[2-9][0-9]))?)|(?:(?:(?:1|21|31)st|(?:2|22)nd|(?:3|23)rd|(?:[4-9]|1[0-9]|20|2[4-9]|30)th|(?:0?[1-9]|[12][0-9]|3[0-2])\\.)\\s+)(?:" + imploded_months + "))(?=\\s+|\\b)";

	var month_pattern = new RegExp(month_pattern_string, 'i');

	var found = month_pattern.exec(test_string);

	if(found != null)
	{
		console.log('MONTH found: ' + found);
		
		for(var i = 1; i < 14; i++)
		{
			found_month = found[i];
			if(found_month != null && found_month != '' && found_month != undefined)
			{
				console.log('found int : ' + i);

				if(i == 1)
				{
					month = found[i];
				}
				else
				{
					month = i - 1;
				}

				break;
			}
		}
	}
	
}

function get_year(test_string)
{
	year = default_year;

	var year_pattern_string = "(?=(?:\\s+|\\b))(?:(?:0?[1-9]|[12][0-9]|3[01])(?:[-/\\.](?:0?[1-9]|1[0-2])[-/\\.]?(?:(?:20)?(1[3-9]|[2-9][0-9])))|(?:(?:(?:1|21|31)st|(?:2|22)nd|(?:3|23)rd|(?:[4-9]|1[0-9]|20|2[4-9]|30)th|(?:0?[1-9]|[12][0-9]|3[0-2])\\.)\\s+)(?:" + imploded_hidden_months + ")(?:\\s+(?:20|')(1[3-9]|[2-9][0-9])))(?=\\s+|\\b)";

	var year_pattern = new RegExp(year_pattern_string, 'i');

	var found = year_pattern.exec(test_string);

	console.log('year found: ' + found);

	if(found != null)
	{
		console.log('year found: ' + found);		
		
		year = '20' + ((found[1] !== undefined && found[1] !== '' && found[1] !== null) ? found[1] : found[2]);
			
	}
	
}



function get_timezone(test_string)
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
				timezone_offset = i/2;
				if(is_summer_time)
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
		timezone_offset_hour = (default_timezone_offset/-60) - 1;
	}
	else
	{
		timezone = 'GMT+0' + timezone_offset + '00';
		timezone_offset_hour = timezone_offset;
	}
	
}

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
				if(is_summer_time)
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

		if(run_benchmark)
		{
			//start benchmark
			var start_time = Date.now();
		}
		/*
		console.log('input: ' + human_time);		
			
		test_time(human_time);

		test_in_weeks(human_time);

		test_date(human_time);

		test_weekday(human_time);

		test_timezone(human_time);

		var time_string = month + " " + (day + relative_days) +" " + year +" " + hour +":" + minute + ":00 " + timezone;

		console.log(time_string);
		*/
		get_minute(human_time);
		get_hour(human_time);
		get_seconds(human_time);
		get_day(human_time);
		get_month(human_time);
		get_year(human_time);
		get_timezone(human_time);

		//var computer_time = new Date(time_string);

		debug_time =  hour + ":" + minute + ":" + seconds + " " + day + "/" + month + "/" + year + " " + timezone;

		console.log('DEBUG: ' + debug_time);

		var local_time_obj = new Date(year, month - 1, day, hour, minute, seconds);

		//console.log('Iso-String: ' + local_time_obj.toISOString());

		//console.log('Local-String: ' + local_time_obj.toLocaleString());

		//console.log('Locale-TimeString: ' + local_time_obj.toLocaleTimeString());

		computer_time = local_time_obj.toLocaleString();

		//reset relative days;
		relative_days = 0;

		if(run_benchmark)
		{
			//end benchmark
			var end_time = Date.now();	

			console.log('understood time in ' + ((end_time - start_time) / 1000).toFixed(3) + ' seconds!');
		}

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

date_found = false;
date_add_found = false;
time_found = false;
time_add_found = false;

var patterns = {
	date: [
		{	// 12th Feb 2014
			pattern: "(?:\\s+|^\\b)((?:1|21|31)(?=st)|(?:2|22)(?=nd)|(?:3|23)(?=rd)|(?:[4-9]|1[0-9]|2[04-9]|)(?=th)|(?:0?[1-9]|[1-2][0-9]|3[0-2])(?=\\.))(?:nd|st|th|\\.)(?:\\s+(?:" + imploded_months + ")(?:\\s+(?:20|')(1[3-9]|[2-9][0-9]))?)?(?:\\s+|\\b$)",
			actions:{
				'1': 	function(index, value){ day = value; },
				'2-13': function(index, value){ month = parseInt(index) - 1; },
				'14': 	function(index, value){ year = '20' + value; }
			}
		},
		{
			pattern: "(?:\\s+|^\\b)(0?[1-9]|[1-2][0-9]|3[0-1])\\s?(?:" + implode(date_deviders) + ")\\s?(0?[1-9]|1[0-2])(?:\\s?(?:" + implode(date_deviders) + ")\\s?(?:20)?(1[3-9]|[2-9][0-9]))?(?:\\s+|\\b$)",
			actions:{
				'1': function(index, value){ day = value; },
				'2': function(index, value){ month = value; },
				'3': function(index, value){ year = '20' + value; }
			}
		},
		{
			pattern: "(?:\\s+|^\\b)(?:(?:this\\s+)|(next\\s+))?(?:" + imploded_weekdays + ")(?:\\s+|\\b$)",
			actions:{
				'1': function(index, value){ day = parseInt(day) + 7; },
				'2-8': function(index, value){

					var day_of_the_week = index - 2;

					var current_date = new Date();

					var current_weekday = current_date.getDay();

					day = parseInt(day) + current_date.getDate() + 1;
										
					if(current_weekday < day_of_the_week)
					{
						day += day_of_the_week - current_weekday;
					}

					if(current_weekday > day_of_the_week)
					{
						day += (7 - current_weekday) + day_of_the_week;			
					}

					month = current_date.getMonth() + 1;
					year = current_date.getFullYear();
				}
			}
		}
	],
	date_add: [
		{
			//
			pattern: "(?:\\s+|^\\b)(?:in|\\+)(?=\\s+\\d{1,2}\\s+\\w{1,}){1,5}(?:\\s+(\\d{1,2})\\s+ye?a?r?s?)?(?:\\s+(\\d{1,2})\\s+mo?n?t?h?s?)?(?:\\s+(\\d{1,2})\\s+we?e?k?s?)?(?:\\s+(\\d{1,2})\\s+da?y?s?)?(?:\\s+|\\b$)",
			actions:{
				'1': function(index, value){ console.log('found year: +' + value); year = parseInt(year) + parseInt(value); },
				'2': function(index, value){ month = parseInt(month) + parseInt(value); },
				'3': function(index, value){ day = parseInt(day) + parseInt(value) * 7; },
				'4': function(index, value){ day = parseInt(day) + parseInt(value); }
			}
		}
	],
	time: [
		{
			pattern: "somepattern",
			actions:{
				'1': function(index,value){
					//do this
				},
				'2-14': function(index,value){
					//do that
				},
				'15': function(index,value){
					//do that
				}
			}
		}
	],
	time_add: [
		{
			pattern: "somepattern",
			actions:{
				'1': function(index,value){
					//do this
				},
				'2-13': function(index,value){
					//do that
				},
				'14': function(index,value){
					//do that
				}
			}
		}
	]
};

function test_patterns(test_string, pattern_object){

	var start_time = Date.now();

	$.each(pattern_object, function(index, value){
		
		var pattern_group_name = index;

		console.log('Inside: ' + pattern_group_name);

		var pattern_group = value;

		$.each(pattern_group, function(index, value){

			//console.log('Inside: ' + index);

			var single_pattern_obj = value;

			var pattern_string = single_pattern_obj.pattern;

			//console.log('Pattern: ' + pattern_string);

			var pattern = new RegExp(pattern_string, "i");

			var test_result = pattern.exec(test_string);



			if(test_result !== null )
			{
				console.log('Result: ' + test_result);

				//console.log('date_found? ' + date_found);

				var ex_string = pattern_group_name + "_found = true";

				//console.log('ex_string: ' + ex_string);

				eval(ex_string);

				//console.log('date_found? ' + date_found);

				//console.log('!!!TEST RESULT length: ' + test_result.length);
				//console.log('!!!TEST RESULT: ' + test_result);

				var actions = single_pattern_obj.actions;

				$.each(actions, function(index, value){
					var action = value;
					console.log('Action: ' + index);


					//Metadata
					var meta_data_string = index;

					var meta_pattern = /(\d{1,2})(?:-(\d{1,2}))?/i;

					var meta_data = meta_pattern.exec(meta_data_string);

					//console.log('META DATA: ' + meta_data);
					
					var start_index = (meta_data[1] !== '' && meta_data[1] !== null) ? meta_data[1] : null;
					start_index = parseInt(start_index);

					var end_index = (meta_data[2] !== '' && meta_data[2] !== null) ? meta_data[2] : null;
					//end_index = parseInt(end_index);

					//console.log('START END: ' + start_index + ' ' + end_index);

					//Test pattern
					
					var current_index = null;
					

					if(end_index === null || end_index === undefined)
					{
						current_index = start_index;

						var current_value = test_result[start_index];

						//console.log('!!!current value: ' + current_value);					
					}
					else
					{
						//console.log('BEFORE the LOOP');
						//console.log('START END: ' + start_index + ' ' + end_index);

						for(var i = start_index; i < end_index + 1; i++)
						{

							//console.log('in the loop');
							
							//console.log('LOOP index value: ' + i + ' ' + test_result[i]);

							if(test_result[i] !== '' && test_result[i] !== null && test_result[i] != undefined)
							{
								current_value = test_result[i];
								current_index = i;
								break;
							}
						}
					}

					//console.log('current_index: ' + current_index);
					//console.log('current_value: ' + current_value);
					if(current_index !== '' && current_index !== null && current_index != undefined && current_value !== '' && current_value !== null && current_value != undefined)
					{
						action(current_index, current_value);
					}
					

				});

				if(eval(pattern_group_name + '_found') === true)
				{
					//console.log('BREAK!!!');
					return false;
				}

			}

		});//end single pattern obj

	});//end pattern_object

	console.log(Date.now() - start_time);


}//end test_patterns

function implode_timezones(timezones)
{
	var imploded_timezones = "";

	var k = 0;
	$.each(timezones,function(index, value){
		if(k)
		{
			imploded_timezones += "|";
		}
		
		imploded_timezones += "(?:";

		//DST countries
		var countries = value.DST;
		var countries_length = countries.length;

		imploded_timezones += "(";
		for(var i = 0; i < countries_length; i++)
		{
			if(i)
			{
				imploded_timezones += "|";
			}

			imploded_timezones += countries[i];
		}
		imploded_timezones += ")";

		//NoDST countries
		countries = value.noDST;
		countries_length = countries.length;

		imploded_timezones += "|(";
		for(var i = 0; i < countries_length; i++)
		{
			if(i)
			{
				imploded_timezones += "|";
			}

			imploded_timezones += countries[i];
		}
		imploded_timezones += ")";
		

		imploded_timezones += ")";
		k++;
	});

	console.log(imploded_timezones);
	return imploded_timezones;
}
