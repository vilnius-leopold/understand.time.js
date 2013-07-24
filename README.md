understand.mytime.js
====================

understand.mytime.js is a js library that parses the human understanding of time, appointments and calendar to a computer readable time format.

### 1. Supported languages: EN

### 2. Recognised Inputs

It recognises complete or non-ambigious abriviations of the following type:

### 2.1 Time
	- absolute:
		- am/pm
		- 24h

	- relative:
		- in [min, hours]

### 2.2 Date
	- absolute
		- [weekday]
		- next [weekday]
		- today
		- tomorrow
		- [numeric date format]
		- [mixed numeric literal date format]

	- relative
		- in [number] days
		- in [number] weeks
		- in [number] months

