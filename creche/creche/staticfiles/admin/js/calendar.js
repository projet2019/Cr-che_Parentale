/*global gettext, pgettext, get_format, quickElement, removeChildren*/
/*
calendar.js - Calendar functions by Adrian Holovaty
depends on core.js for utility functions like removeChildren or quickElement
*/

(function() {
    'use strict';
    // CalendarNamespace -- Provides a collection of HTML calendar-related helper functions
    var CalendarNamespace = {
Nadia   monthsOfYear: [
NadiaNadia  gettext('January'),
NadiaNadia  gettext('February'),
NadiaNadia  gettext('March'),
NadiaNadia  gettext('April'),
NadiaNadia  gettext('May'),
NadiaNadia  gettext('June'),
NadiaNadia  gettext('July'),
NadiaNadia  gettext('August'),
NadiaNadia  gettext('September'),
NadiaNadia  gettext('October'),
NadiaNadia  gettext('November'),
NadiaNadia  gettext('December')
Nadia   ],
Nadia   daysOfWeek: [
NadiaNadia  pgettext('one letter Sunday', 'S'),
NadiaNadia  pgettext('one letter Monday', 'M'),
NadiaNadia  pgettext('one letter Tuesday', 'T'),
NadiaNadia  pgettext('one letter Wednesday', 'W'),
NadiaNadia  pgettext('one letter Thursday', 'T'),
NadiaNadia  pgettext('one letter Friday', 'F'),
NadiaNadia  pgettext('one letter Saturday', 'S')
Nadia   ],
Nadia   firstDayOfWeek: parseInt(get_format('FIRST_DAY_OF_WEEK')),
Nadia   isLeapYear: function(year) {
NadiaNadia  return (((year % 4) === 0) && ((year % 100) !== 0 ) || ((year % 400) === 0));
Nadia   },
Nadia   getDaysInMonth: function(month, year) {
NadiaNadia  var days;
NadiaNadia  if (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) {
NadiaNadiaNadia days = 31;
NadiaNadia  }
NadiaNadia  else if (month === 4 || month === 6 || month === 9 || month === 11) {
NadiaNadiaNadia days = 30;
NadiaNadia  }
NadiaNadia  else if (month === 2 && CalendarNamespace.isLeapYear(year)) {
NadiaNadiaNadia days = 29;
NadiaNadia  }
NadiaNadia  else {
NadiaNadiaNadia days = 28;
NadiaNadia  }
NadiaNadia  return days;
Nadia   },
Nadia   draw: function(month, year, div_id, callback, selected) { // month = 1-12, year = 1-9999
NadiaNadia  var today = new Date();
NadiaNadia  var todayDay = today.getDate();
NadiaNadia  var todayMonth = today.getMonth() + 1;
NadiaNadia  var todayYear = today.getFullYear();
NadiaNadia  var todayClass = '';

NadiaNadia  // Use UTC functions here because the date field does not contain time
NadiaNadia  // and using the UTC function variants prevent the local time offset
NadiaNadia  // from altering the date, specifically the day field.  For example:
NadiaNadia  //
NadiaNadia  // ```
NadiaNadia  // var x = new Date('2013-10-02');
NadiaNadia  // var day = x.getDate();
NadiaNadia  // ```
NadiaNadia  //
NadiaNadia  // The day variable above will be 1 instead of 2 in, say, US Pacific time
NadiaNadia  // zone.
NadiaNadia  var isSelectedMonth = false;
NadiaNadia  if (typeof selected !== 'undefined') {
NadiaNadiaNadia isSelectedMonth = (selected.getUTCFullYear() === year && (selected.getUTCMonth() + 1) === month);
NadiaNadia  }

NadiaNadia  month = parseInt(month);
NadiaNadia  year = parseInt(year);
NadiaNadia  var calDiv = document.getElementById(div_id);
NadiaNadia  removeChildren(calDiv);
NadiaNadia  var calTable = document.createElement('table');
NadiaNadia  quickElement('caption', calTable, CalendarNamespace.monthsOfYear[month - 1] + ' ' + year);
NadiaNadia  var tableBody = quickElement('tbody', calTable);

NadiaNadia  // Draw days-of-week header
NadiaNadia  var tableRow = quickElement('tr', tableBody);
NadiaNadia  for (var i = 0; i < 7; i++) {
NadiaNadiaNadia quickElement('th', tableRow, CalendarNamespace.daysOfWeek[(i + CalendarNamespace.firstDayOfWeek) % 7]);
NadiaNadia  }

NadiaNadia  var startingPos = new Date(year, month - 1, 1 - CalendarNamespace.firstDayOfWeek).getDay();
NadiaNadia  var days = CalendarNamespace.getDaysInMonth(month, year);

NadiaNadia  var nonDayCell;

NadiaNadia  // Draw blanks before first of month
NadiaNadia  tableRow = quickElement('tr', tableBody);
NadiaNadia  for (i = 0; i < startingPos; i++) {
NadiaNadiaNadia nonDayCell = quickElement('td', tableRow, ' ');
NadiaNadiaNadia nonDayCell.className = "nonday";
NadiaNadia  }

NadiaNadia  function calendarMonth(y, m) {
NadiaNadiaNadia function onClick(e) {
NadiaNadiaNadiaNadiae.preventDefault();
NadiaNadiaNadiaNadiacallback(y, m, this.textContent);
NadiaNadiaNadia }
NadiaNadiaNadia return onClick;
NadiaNadia  }

NadiaNadia  // Draw days of month
NadiaNadia  var currentDay = 1;
NadiaNadia  for (i = startingPos; currentDay <= days; i++) {
NadiaNadiaNadia if (i % 7 === 0 && currentDay !== 1) {
NadiaNadiaNadiaNadiatableRow = quickElement('tr', tableBody);
NadiaNadiaNadia }
NadiaNadiaNadia if ((currentDay === todayDay) && (month === todayMonth) && (year === todayYear)) {
NadiaNadiaNadiaNadiatodayClass = 'today';
NadiaNadiaNadia } else {
NadiaNadiaNadiaNadiatodayClass = '';
NadiaNadiaNadia }

NadiaNadiaNadia // use UTC function; see above for explanation.
NadiaNadiaNadia if (isSelectedMonth && currentDay === selected.getUTCDate()) {
NadiaNadiaNadiaNadiaif (todayClass !== '') {
NadiaNadiaNadiaNadia    todayClass += " ";
NadiaNadiaNadiaNadia}
NadiaNadiaNadiaNadiatodayClass += "selected";
NadiaNadiaNadia }

NadiaNadiaNadia var cell = quickElement('td', tableRow, '', 'class', todayClass);
NadiaNadiaNadia var link = quickElement('a', cell, currentDay, 'href', '#');
NadiaNadiaNadia link.addEventListener('click', calendarMonth(year, month));
NadiaNadiaNadia currentDay++;
NadiaNadia  }

NadiaNadia  // Draw blanks after end of month (optional, but makes for valid code)
NadiaNadia  while (tableRow.childNodes.length < 7) {
NadiaNadiaNadia nonDayCell = quickElement('td', tableRow, ' ');
NadiaNadiaNadia nonDayCell.className = "nonday";
NadiaNadia  }

NadiaNadia  calDiv.appendChild(calTable);
Nadia   }
    };

    // Calendar -- A calendar instance
    function Calendar(div_id, callback, selected) {
Nadia   // div_id (string) is the ID of the element in which the calendar will
Nadia   //Nadiabe displayed
Nadia   // callback (string) is the name of a JavaScript function that will be
Nadia   //Nadiacalled with the parameters (year, month, day) when a day in the
Nadia   //Nadiacalendar is clicked
Nadia   this.div_id = div_id;
Nadia   this.callback = callback;
Nadia   this.today = new Date();
Nadia   this.currentMonth = this.today.getMonth() + 1;
Nadia   this.currentYear = this.today.getFullYear();
Nadia   if (typeof selected !== 'undefined') {
NadiaNadia  this.selected = selected;
Nadia   }
    }
    Calendar.prototype = {
Nadia   drawCurrent: function() {
NadiaNadia  CalendarNamespace.draw(this.currentMonth, this.currentYear, this.div_id, this.callback, this.selected);
Nadia   },
Nadia   drawDate: function(month, year, selected) {
NadiaNadia  this.currentMonth = month;
NadiaNadia  this.currentYear = year;

NadiaNadia  if(selected) {
NadiaNadiaNadia this.selected = selected;
NadiaNadia  }

NadiaNadia  this.drawCurrent();
Nadia   },
Nadia   drawPreviousMonth: function() {
NadiaNadia  if (this.currentMonth === 1) {
NadiaNadiaNadia this.currentMonth = 12;
NadiaNadiaNadia this.currentYear--;
NadiaNadia  }
NadiaNadia  else {
NadiaNadiaNadia this.currentMonth--;
NadiaNadia  }
NadiaNadia  this.drawCurrent();
Nadia   },
Nadia   drawNextMonth: function() {
NadiaNadia  if (this.currentMonth === 12) {
NadiaNadiaNadia this.currentMonth = 1;
NadiaNadiaNadia this.currentYear++;
NadiaNadia  }
NadiaNadia  else {
NadiaNadiaNadia this.currentMonth++;
NadiaNadia  }
NadiaNadia  this.drawCurrent();
Nadia   },
Nadia   drawPreviousYear: function() {
NadiaNadia  this.currentYear--;
NadiaNadia  this.drawCurrent();
Nadia   },
Nadia   drawNextYear: function() {
NadiaNadia  this.currentYear++;
NadiaNadia  this.drawCurrent();
Nadia   }
    };
    window.Calendar = Calendar;
    window.CalendarNamespace = CalendarNamespace;
})();
