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
 */


//--- UNDERSTAND OBJECT ---//
var understand = (function(){

	//--- OPTIONS ---//
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


	//--- HELPER FUNCTIONS ---//
	var helpers = {
		implode: function(item_array){
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
		},
		deep_implode: function (item_array, devider, prefix, suffix, segmentation){

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
		}, //end deep_implode
		implode_timezones: function(timezones){
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
		}//end implode timezones
	}//helpers [Object]



	//--- SETTINGS ---//	
	var imploded_date_deviders = helpers.implode(date_deviders);
	var imploded_months = helpers.deep_implode(months);
	var imploded_weekdays = helpers.deep_implode(weekdays);
	var imploded_hidden_months = helpers.deep_implode(months, '|', '(?:', ')', '?')
	var imploded_time_deviders = helpers.implode(time_deviders);

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

	//--- TIME/DATE PATTERNS ---//


	date_found = false;
	date_add_found = false;
	time_found = false;
	time_add_found = false;


	//AVAILABLE PATTERNS
	var patterns = {
		date: [
			{	
				identifier: 'mixed_date_1',
				pattern: "((?:1|21|31)(?=st)|(?:2|22)(?=nd)|(?:3|23)(?=rd)|(?:[4-9]|1[0-9]|2[04-9]|)(?=th)|(?:0?[1-9]|[1-2][0-9]|3[0-2])(?=\\.))(?:nd|st|th|\\.)(?:\\s+(?:" + imploded_months + ")(?:\\s+(?:20|')(1[3-9]|[2-9][0-9]))?)?",
				actions:{
					'1': 	function(index, value){ day = value; },
					'2-13': function(index, value){ month = parseInt(index) - 1; },
					'14': 	function(index, value){ year = '20' + value; }
				}
				
			},
			{
				identifier: 'numeric_date',
				pattern: "(0?[1-9]|[1-2][0-9]|3[0-1])\\s?(?:" + imploded_date_deviders + ")\\s?(0?[1-9]|1[0-2])(?:\\s?(?:" + imploded_date_deviders + ")\\s?(?:20)?(1[3-9]|[2-9][0-9]))?",
				actions:{
					'1': function(index, value){ day = value; },
					'2': function(index, value){ month = value; },
					'3': function(index, value){ year = '20' + value; }
				}
				
			},
			{
				identifier: 'weekday',
				pattern: "(?:(?:this\\s+)|(next\\s+))?(?:" + imploded_weekdays + ")",
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
				identifier: 'in_weeks',
				pattern: "(?:in|\\+)(?=\\s+\\d{1,2}\\s+\\w{1,}){1,5}(?:\\s+(\\d{1,2})\\s+ye?a?r?s?)?(?:\\s+(\\d{1,2})\\s+mo?n?t?h?s?)?(?:\\s+(\\d{1,2})\\s+we?e?k?s?)?(?:\\s+(\\d{1,2})\\s+da?y?s?)?(?:\\s+(?:\\d{1,2})\\s+ho?u?r?s?)?(?:\\s+(?:\\d{1,2})\\s+mi?n?u?t?e?s?)?",
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
				identifier: '24h',
				pattern: "(0?[0-9]|1[0-9]|2[0-4])(?:(?:" + imploded_time_deviders + ")([0-5][0-9]))(?!\\s*(?:am|pm))\\s*h?",
				actions:{
					'1': function(index,value){ hour = value; },
					'2': function(index,value){ minute = value; }
				}
			},
			{				
				identifier: 'am_pm',
				pattern: "(0?[0-9]|1[0-2])(?:(?:" + imploded_time_deviders + ")([0-5][0-9]))?\\s*(?:am|(pm))",
				actions:{
					'1': function(index,value){ hour = parseInt(value);}, // hour
					'2': function(index,value){ minute = parseInt(value); }, // minute
					'3': function(index,value){ hour += 12; } // add pm offset
				}
			}
		],
		time_add: [
			{
				identifier: 'in_hours',
				pattern: "(?:in|\\+)(?=\\s+\\d{1,2}\\s+\\w{1,}){1,5}(?:\\s+(?:\\d{1,2})\\s+ye?a?r?s?)?(?:\\s+(?:\\d{1,2})\\s+mo?n?t?h?s?)?(?:\\s+(?:\\d{1,2})\\s+we?e?k?s?)?(?:\\s+(?:\\d{1,2})\\s+da?y?s?)?(?:\\s+(\\d{1,2})\\s+ho?u?r?s?)?(?:\\s+(\\d{1,2})\\s+mi?n?u?t?e?s?)?",
				actions:{
					'1': function(index,value){ hour = parseInt(hour) + parseInt(value); },
					'2': function(index,value){ minute = parseInt(minute) + parseInt(value); }
				}
			}
		]
	};

	


	var core = {
		test_patterns: function (test_string){

			pattern_object = patterns;

			var start_time = Date.now();

			$.each(pattern_object, function(index, value){
				
				var pattern_group_name = index;

				console.log('Inside: ' + pattern_group_name);

				var pattern_group = value;

				$.each(pattern_group, function(index, value){

					//console.log('Inside: ' + index);

					var single_pattern_obj = value;

					var pattern_string = "(?:\\s+|^\\b)" + single_pattern_obj.pattern + "(?:\\s+|\\b$)";

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

			return 'time/date: ' + hour + ':' + minute + ':' + seconds + ' ' + day + '/' + month + '/' + year;


		}//end test_patterns [function]

	}// end core [Object]
	


	return {
		//time function
		time: function(human_time){

			if(run_benchmark)
			{
				//start benchmark
				var start_time = Date.now();
			}
			
			var computer_time =  core.test_patterns(human_time);

			if(run_benchmark)
			{
				//end benchmark
				var end_time = Date.now();	

				console.log('understood time in ' + ((end_time - start_time) / 1000).toFixed(3) + ' seconds!');
			}

			return computer_time;
		}
	}
})();