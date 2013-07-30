//SETTINGS//

var end_of_work = '18:00';

var default_time_zone = 'auto'; //or lt, uk, de

var weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'Oktober', 'November', 'December'];

var date_deviders = ['.', '-', '/'];

var time_deviders = [':'];

//--- END SETTINGS ---//

var imploded_time_deviders = implode(time_deviders);



function test_time(test_string)
{
	console.log('testing time!');

	//--- 24 HOURS TIME ---//
	var hour_24_pattern_string = "^\\s*(0?[0-9]|1[0-9]|2[0-4])(?:(?:" + imploded_time_deviders + ")([0-5][0-9]))(?!\\s*(?:am|pm))\\s*h?";

	var hour_24_pattern = new RegExp(hour_24_pattern_string, "i");

	console.log(hour_24_pattern);

	//--- AM/PM TIME ---//
	var am_pm_pattern_string = "^\\s*(0?[0-9]|1[0-2])(?:(?:" + imploded_time_deviders + ")([0-5][0-9]))?\\s*(?:am|pm)";

	var am_pm_pattern = new RegExp(am_pm_pattern_string, "i");

	console.log(am_pm_pattern);

	var result_24 = hour_24_pattern.exec(test_string);

	var result_am_pm = am_pm_pattern.exec(test_string);

	console.log(result_24);
	console.log(result_am_pm);

}

//Setting time-zone
default_time_zone = default_time_zone.trim();

if(default_time_zone == 'auto' || default_time_zone == '')
{
	default_time_zone = new Date().getTimezoneOffset();
}

function test_date(test_string)
{
	var imploded_months = deep_implode(months);

	var literal_date_pattern_string = "(?:\\s+|^\\b)(1(?=st)|2(?=nd)|3(?=rd)|[4-9](?=th)|1[0-9](?=th)|20(?=th)|21(?=st)|22(?=nd)|23(?=rd)|2[4-9](?=th)|30(?=th)|31(?=st)|32(?=nd)|0?[1-9](?=\\.)|[1-2][0-9](?=\\.)|3[0-2](?=\\.))(?:nd|st|th|\\.)\\s+(?:" + imploded_months + ")\\s+(?:20|')(1[3-9]|[2-9][0-9])(?:\\s+|\\b$)";

	var literal_date_pattern = new RegExp(literal_date_pattern_string, "i");

	console.log('pattern: ' + literal_date_pattern);

	var test_result = literal_date_pattern.exec(test_string);
	console.log('result: ' + test_result);

	var imploded_months = deep_implode(months);

	var numeric_date_pattern_string = "(?:\\s+|^\\b)(0?[1-9]|[1-2][0-9]|3[0-1])\\s?(?:" + implode(date_deviders) + ")\\s?(0?[1-9]|1[0-2])\\s?(?:" + implode(date_deviders) + ")\\s?(?:20)?(1[3-9]|[2-9][0-9])(?:\\s+|\\b$)";

	var numeric_date_pattern = new RegExp(numeric_date_pattern_string, "i");

	console.log('pattern: ' + numeric_date_pattern);

	var test_result = numeric_date_pattern.exec(test_string);
	console.log('result: ' + test_result);
}

function test_in_weeks(test_string)
{
	console.log('input: ' + test_string);
	var in_weeks_pattern_string = "(?:\\s+|^\\b)in\\s+(\\d{1,2})\\s+weeks?(?:\\s+|\\b$)";

	var in_weeks_pattern = new RegExp(in_weeks_pattern_string, "i");

	var test_result = in_weeks_pattern.exec(test_string);
	console.log('result: ' + test_result);

	if(test_result != null)
	{
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

	var weekday_pattern_string = "^\\s*(next\\s+)?(?:" + imploded_weekdays + ")\\b";

	var weekday_pattern = new RegExp(weekday_pattern_string, "i");


	//run test
	console.log('test string:' + test_string);

	console.log('pattern:' + weekday_pattern);

	var test_result = weekday_pattern.exec(test_string);

	console.log('result: ' + test_result);

	

	if(test_result != null)
	{		

		var result_length = test_result.length;
		//remove first item from result array
		test_result.shift();
		test_result.shift();		

		for(var i = 0; i < result_length; i++)
		{
			if(test_result[i] != '' && test_result[i] != undefined)
			{
				day_of_the_week = i;
				break;
			}		
		}

		console.log('Found day of the week: ' + day_of_the_week);
	}


	return day_of_the_week;
}


//understand object
var understand = {

	//time function
	time: function(human_time){

		console.log('input: ' + human_time);

		var computer_time = '16:00 26-07-2013 GMT+01:00';

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
