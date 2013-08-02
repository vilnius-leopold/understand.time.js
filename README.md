understand.time.js
====================

`understand.time.js` is a js library that parses the human understanding of time to a computer readable time format.  
For a better understanding what `understand.time.js` does view the [Examples](#4-examples) below.  
This is still code in progress. Please ***get involved*** if you're interested!  
To get a better idea where this code project is supposed to go take a look at the [wiki](https://github.com/vilnius-leopold/understand.time.js/wiki).

## 0 Latest Version:
 view the [changelog](https://github.com/vilnius-leopold/understand.time.js/blob/master/CHANGELOG.md).  
 * still in development - version 1.0 coming soon

## 1 Supported languages: 
* English

(German and Lithuanian will be added later)

## 2 Recognised Inputs

It recognises complete or non-ambigious abriviations of the following type:

### 2.1 Time
* absolute:
	- am/pm
	- 24h
* relative:
	- in [int] min / hours

Time format:  
minute - hour - timeformat - timezone [optional]

[int] [devider ':'] [int] [devider ' '] [timeformat indecator 'am/pm, h']


### 2.2 Date
* absolute
	- [weekday]
	- next [weekday]
	- today
	- tomorrow
	- [numeric date format]
	- [mixed numeric and literal date format]

* relative
	- in [int] days
	- in [int] weeks
	- in [int] months

Date format:  
day - month - year - timezone [optional]  

[int] [devider '.', '-', '/' or 'st', 'nd', 'rd', 'th'][+ 'of'] [int or string] [devider '.', '-', '/'] [4 digit int or ''' + 2 digit int]

### 2.3 Timezones
Next to custom representations for the timezone `understand.time.js` uses the abbriviated names of countries according to [ISO 3166](https://en.wikipedia.org/wiki/ISO_3166) and [ccTLD](http://en.wikipedia.org/wiki/Country_code_top-level_domain) (country code top-level domain).  
Currently there are only european timezones supported.  

* `auto` [default] --> usese the current client time-zone of the browser
* `GMT+0:00 --> uk, gb, pt` (western europe)
* `GMT+1:00 --> de, fr, nl, it, es, at, ch, be, ...` (central europe)
* `GMT+2:00 --> lt, gr, tr, ro, ...` (eastern europe)

## 3 Usage

**Dependencies:**  
understand.time.js is intended to be a stand-alone javascript library (with possible jQuery integration in the futur).  

Currently due to ease of development it still depends on jquery .    

* [jQuery](http://jquery.com/) *(this dependency will be remove in the futur!)*
  
**1 Include jQuery:** *(won't be neccessary in the futur)*  
To do so include the following script tag into your HTML `<head>`-tag:  
* either include the included jQuery library like this:  
`<script src="js/jquery.js"></script>`  
**or**  
* use the Google's hosted jQuery version like this:  
`<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>`  

**2 Include understand.time.js:**  
To do so include the following script tag into your HTML `<head>`-tag:  
`<script src="js/understand.time.js"></script>`  
  
**3 Enjoy:**  
use it in your code like this:  
```javascript
//your input time
var human_time = 'next fri 4pm';

//where the magic happens ;)
var computer_time = understand.time(human_time);

//output the magic
alert('Computer time: ' + computer_time);
```
## 4 Examples

Reference time: 'Wed Jul 31 2013 01:30:00 GMT+0300 (EEST)'  
```javascript
understand.time('next fri 4pm');   // returns 'Fri Aug 09 2013 16:00:00 GMT+0300 (EEST)'

understand.time('12:30 mo in 2 weeks');   // returns 'Mon Aug 19 2013 12:30:00 GMT+0300 (EEST)'
```