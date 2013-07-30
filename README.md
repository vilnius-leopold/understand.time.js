understand.time.js
====================

understand.time.js is a js library that parses the human understanding of time to a computer readable time format.  
For a better understanding what understand.time.js does view the [Examples](#3-examples) below.

## 0. Latest Version:
 view the [changelog](https://github.com/vilnius-leopold/understand.time.js/blob/master/CHANGELOG.md).  
 * still in development - version 1.0 coming soon

## 1. Supported languages: 
* English

(German and Lithuanian will be added later)

## 2. Recognised Inputs

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
Next to custom namespace there are the names of countries according to ISO 3166. This corresponds with ccTLD (country code top-level domain).    
Currently there are only european timezones supported.  

* `auto` [default] --> usese the current client time-zone of the browser
* `GMT+0:00 --> uk, gb, pt` (western europe)
* `GMT+1:00 --> de, fr, nl, it, es, at, ch, be, ...` (central europe)
* `GMT+2:00 --> lt, gr, tr, ro, ...` (eastern europe)

## 3 Examples