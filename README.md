understand.mytime.js
====================

understand.mytime.js is a js library that parses the human understanding of time to a computer readable time format.

## 1. Supported languages: 
* English

(German and Lithuanian will be added later)

## 2. Recognised Inputs

It recognises complete or non-ambigious abriviations of the following type:

### 2.1 Time
	- absolute:
		- am/pm
		- 24h
	- relative:
		- in [number] min / hours

Time format:
minute - hour - timeformat - timezone [optional]

[number] [devider ':'] [number] [devider ' '] [timeformat indecator 'am/pm, h']


### 2.2 Date
* absolute
	- [weekday]
	- next [weekday]
	- today
	- tomorrow
	- [numeric date format]
	- [mixed numeric and literal date format]

* relative
	- in [number] days
	- in [number] weeks
	- in [number] months

Date format:
day - month - year - timezone [optional]

[number] [devider '.', '-', '/' or 'st', 'nd', 'rd', 'th'][+ 'of'] [number or name] [devider '.', '-', '/'] [4 digit number or ''' + 2 digit number]

### 2.3 Timezones
* auto [default]--> usese the current client time-zone
* uk --> GMT+0:00 (western europe)
* de --> GMT+1:00 (central europe)
* lt --> GMT+2:00 (eastern europe)

## 3 Examples