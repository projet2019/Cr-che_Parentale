/*global Calendar, findPosX, findPosY, getStyle, get_format, gettext, gettext_noop, interpolate, ngettext, quickElement*/
// Inserts shortcut buttons after all of the following:
//Nadia<input type="text" class="vDateField">
//Nadia<input type="text" class="vTimeField">
(function() {
    'use strict';
    var DateTimeShortcuts = {
Nadia   calendars: [],
Nadia   calendarInputs: [],
Nadia   clockInputs: [],
Nadia   clockHours: {
NadiaNadia  default_: [
NadiaNadiaNadia [gettext_noop('Now'), -1],
NadiaNadiaNadia [gettext_noop('Midnight'), 0],
NadiaNadiaNadia [gettext_noop('6 a.m.'), 6],
NadiaNadiaNadia [gettext_noop('Noon'), 12],
NadiaNadiaNadia [gettext_noop('6 p.m.'), 18]
NadiaNadia  ]
Nadia   },
Nadia   dismissClockFunc: [],
Nadia   dismissCalendarFunc: [],
Nadia   calendarDivName1: 'calendarbox', // name of calendar <div> that gets toggled
Nadia   calendarDivName2: 'calendarin',  // name of <div> that contains calendar
Nadia   calendarLinkName: 'calendarlink',// name of the link that is used to toggle
Nadia   clockDivName: 'clockbox',Nadia   // name of clock <div> that gets toggled
Nadia   clockLinkName: 'clocklink',Nadia // name of the link that is used to toggle
Nadia   shortCutsClass: 'datetimeshortcuts', // class of the clock and cal shortcuts
Nadia   timezoneWarningClass: 'timezonewarning', // class of the warning for timezone mismatch
Nadia   timezoneOffset: 0,
Nadia   init: function() {
NadiaNadia  var body = document.getElementsByTagName('body')[0];
NadiaNadia  var serverOffset = body.getAttribute('data-admin-utc-offset');
NadiaNadia  if (serverOffset) {
NadiaNadiaNadia var localOffset = new Date().getTimezoneOffset() * -60;
NadiaNadiaNadia DateTimeShortcuts.timezoneOffset = localOffset - serverOffset;
NadiaNadia  }

NadiaNadia  var inputs = document.getElementsByTagName('input');
NadiaNadia  for (var i = 0; i < inputs.length; i++) {
NadiaNadiaNadia var inp = inputs[i];
NadiaNadiaNadia if (inp.getAttribute('type') === 'text' && inp.className.match(/vTimeField/)) {
NadiaNadiaNadiaNadiaDateTimeShortcuts.addClock(inp);
NadiaNadiaNadiaNadiaDateTimeShortcuts.addTimezoneWarning(inp);
NadiaNadiaNadia }
NadiaNadiaNadia else if (inp.getAttribute('type') === 'text' && inp.className.match(/vDateField/)) {
NadiaNadiaNadiaNadiaDateTimeShortcuts.addCalendar(inp);
NadiaNadiaNadiaNadiaDateTimeShortcuts.addTimezoneWarning(inp);
NadiaNadiaNadia }
NadiaNadia  }
Nadia   },
Nadia   // Return the current time while accounting for the server timezone.
Nadia   now: function() {
NadiaNadia  var body = document.getElementsByTagName('body')[0];
NadiaNadia  var serverOffset = body.getAttribute('data-admin-utc-offset');
NadiaNadia  if (serverOffset) {
NadiaNadiaNadia var localNow = new Date();
NadiaNadiaNadia var localOffset = localNow.getTimezoneOffset() * -60;
NadiaNadiaNadia localNow.setTime(localNow.getTime() + 1000 * (serverOffset - localOffset));
NadiaNadiaNadia return localNow;
NadiaNadia  } else {
NadiaNadiaNadia return new Date();
NadiaNadia  }
Nadia   },
Nadia   // Add a warning when the time zone in the browser and backend do not match.
Nadia   addTimezoneWarning: function(inp) {
NadiaNadia  var warningClass = DateTimeShortcuts.timezoneWarningClass;
NadiaNadia  var timezoneOffset = DateTimeShortcuts.timezoneOffset / 3600;

NadiaNadia  // Only warn if there is a time zone mismatch.
NadiaNadia  if (!timezoneOffset) {
NadiaNadiaNadia return;
NadiaNadia  }

NadiaNadia  // Check if warning is already there.
NadiaNadia  if (inp.parentNode.querySelectorAll('.' + warningClass).length) {
NadiaNadiaNadia return;
NadiaNadia  }

NadiaNadia  var message;
NadiaNadia  if (timezoneOffset > 0) {
NadiaNadiaNadia message = ngettext(
NadiaNadiaNadiaNadia'Note: You are %s hour ahead of server time.',
NadiaNadiaNadiaNadia'Note: You are %s hours ahead of server time.',
NadiaNadiaNadiaNadiatimezoneOffset
NadiaNadiaNadia );
NadiaNadia  }
NadiaNadia  else {
NadiaNadiaNadia timezoneOffset *= -1;
NadiaNadiaNadia message = ngettext(
NadiaNadiaNadiaNadia'Note: You are %s hour behind server time.',
NadiaNadiaNadiaNadia'Note: You are %s hours behind server time.',
NadiaNadiaNadiaNadiatimezoneOffset
NadiaNadiaNadia );
NadiaNadia  }
NadiaNadia  message = interpolate(message, [timezoneOffset]);

NadiaNadia  var warning = document.createElement('span');
NadiaNadia  warning.className = warningClass;
NadiaNadia  warning.textContent = message;
NadiaNadia  inp.parentNode.appendChild(document.createElement('br'));
NadiaNadia  inp.parentNode.appendChild(warning);
Nadia   },
Nadia   // Add clock widget to a given field
Nadia   addClock: function(inp) {
NadiaNadia  var num = DateTimeShortcuts.clockInputs.length;
NadiaNadia  DateTimeShortcuts.clockInputs[num] = inp;
NadiaNadia  DateTimeShortcuts.dismissClockFunc[num] = function() { DateTimeShortcuts.dismissClock(num); return true; };

NadiaNadia  // Shortcut links (clock icon and "Now" link)
NadiaNadia  var shortcuts_span = document.createElement('span');
NadiaNadia  shortcuts_span.className = DateTimeShortcuts.shortCutsClass;
NadiaNadia  inp.parentNode.insertBefore(shortcuts_span, inp.nextSibling);
NadiaNadia  var now_link = document.createElement('a');
NadiaNadia  now_link.setAttribute('href', "#");
NadiaNadia  now_link.textContent = gettext('Now');
NadiaNadia  now_link.addEventListener('click', function(e) {
NadiaNadiaNadia e.preventDefault();
NadiaNadiaNadia DateTimeShortcuts.handleClockQuicklink(num, -1);
NadiaNadia  });
NadiaNadia  var clock_link = document.createElement('a');
NadiaNadia  clock_link.setAttribute('href', '#');
NadiaNadia  clock_link.id = DateTimeShortcuts.clockLinkName + num;
NadiaNadia  clock_link.addEventListener('click', function(e) {
NadiaNadiaNadia e.preventDefault();
NadiaNadiaNadia // avoid triggering the document click handler to dismiss the clock
NadiaNadiaNadia e.stopPropagation();
NadiaNadiaNadia DateTimeShortcuts.openClock(num);
NadiaNadia  });

NadiaNadia  quickElement(
NadiaNadiaNadia 'span', clock_link, '',
NadiaNadiaNadia 'class', 'clock-icon',
NadiaNadiaNadia 'title', gettext('Choose a Time')
NadiaNadia  );
NadiaNadia  shortcuts_span.appendChild(document.createTextNode('\u00A0'));
NadiaNadia  shortcuts_span.appendChild(now_link);
NadiaNadia  shortcuts_span.appendChild(document.createTextNode('\u00A0|\u00A0'));
NadiaNadia  shortcuts_span.appendChild(clock_link);

NadiaNadia  // Create clock link div
NadiaNadia  //
NadiaNadia  // Markup looks like:
NadiaNadia  // <div id="clockbox1" class="clockbox module">
NadiaNadia  //Nadia<h2>Choose a time</h2>
NadiaNadia  //Nadia<ul class="timelist">
NadiaNadia  //Nadia    <li><a href="#">Now</a></li>
NadiaNadia  //Nadia    <li><a href="#">Midnight</a></li>
NadiaNadia  //Nadia    <li><a href="#">6 a.m.</a></li>
NadiaNadia  //Nadia    <li><a href="#">Noon</a></li>
NadiaNadia  //Nadia    <li><a href="#">6 p.m.</a></li>
NadiaNadia  //Nadia</ul>
NadiaNadia  //Nadia<p class="calendar-cancel"><a href="#">Cancel</a></p>
NadiaNadia  // </div>

NadiaNadia  var clock_box = document.createElement('div');
NadiaNadia  clock_box.style.display = 'none';
NadiaNadia  clock_box.style.position = 'absolute';
NadiaNadia  clock_box.className = 'clockbox module';
NadiaNadia  clock_box.setAttribute('id', DateTimeShortcuts.clockDivName + num);
NadiaNadia  document.body.appendChild(clock_box);
NadiaNadia  clock_box.addEventListener('click', function(e) { e.stopPropagation(); });

NadiaNadia  quickElement('h2', clock_box, gettext('Choose a time'));
NadiaNadia  var time_list = quickElement('ul', clock_box);
NadiaNadia  time_list.className = 'timelist';
NadiaNadia  // The list of choices can be overridden in JavaScript like this:
NadiaNadia  // DateTimeShortcuts.clockHours.name = [['3 a.m.', 3]];
NadiaNadia  // where name is the name attribute of the <input>.
NadiaNadia  var name = typeof DateTimeShortcuts.clockHours[inp.name] === 'undefined' ? 'default_' : inp.name;
NadiaNadia  DateTimeShortcuts.clockHours[name].forEach(function(element) {
NadiaNadiaNadia var time_link = quickElement('a', quickElement('li', time_list), gettext(element[0]), 'href', '#');
NadiaNadiaNadia time_link.addEventListener('click', function(e) {
NadiaNadiaNadiaNadiae.preventDefault();
NadiaNadiaNadiaNadiaDateTimeShortcuts.handleClockQuicklink(num, element[1]);
NadiaNadiaNadia });
NadiaNadia  });

NadiaNadia  var cancel_p = quickElement('p', clock_box);
NadiaNadia  cancel_p.className = 'calendar-cancel';
NadiaNadia  var cancel_link = quickElement('a', cancel_p, gettext('Cancel'), 'href', '#');
NadiaNadia  cancel_link.addEventListener('click', function(e) {
NadiaNadiaNadia e.preventDefault();
NadiaNadiaNadia DateTimeShortcuts.dismissClock(num);
NadiaNadia  });

NadiaNadia  document.addEventListener('keyup', function(event) {
NadiaNadiaNadia if (event.which === 27) {
NadiaNadiaNadiaNadia// ESC key closes popup
NadiaNadiaNadiaNadiaDateTimeShortcuts.dismissClock(num);
NadiaNadiaNadiaNadiaevent.preventDefault();
NadiaNadiaNadia }
NadiaNadia  });
Nadia   },
Nadia   openClock: function(num) {
NadiaNadia  var clock_box = document.getElementById(DateTimeShortcuts.clockDivName + num);
NadiaNadia  var clock_link = document.getElementById(DateTimeShortcuts.clockLinkName + num);

NadiaNadia  // Recalculate the clockbox position
NadiaNadia  // is it left-to-right or right-to-left layout ?
NadiaNadia  if (getStyle(document.body, 'direction') !== 'rtl') {
NadiaNadiaNadia clock_box.style.left = findPosX(clock_link) + 17 + 'px';
NadiaNadia  }
NadiaNadia  else {
NadiaNadiaNadia // since style's width is in em, it'd be tough to calculate
NadiaNadiaNadia // px value of it. let's use an estimated px for now
NadiaNadiaNadia // TODO: IE returns wrong value for findPosX when in rtl mode
NadiaNadiaNadia //Nadia  (it returns as it was left aligned), needs to be fixed.
NadiaNadiaNadia clock_box.style.left = findPosX(clock_link) - 110 + 'px';
NadiaNadia  }
NadiaNadia  clock_box.style.top = Math.max(0, findPosY(clock_link) - 30) + 'px';

NadiaNadia  // Show the clock box
NadiaNadia  clock_box.style.display = 'block';
NadiaNadia  document.addEventListener('click', DateTimeShortcuts.dismissClockFunc[num]);
Nadia   },
Nadia   dismissClock: function(num) {
NadiaNadia  document.getElementById(DateTimeShortcuts.clockDivName + num).style.display = 'none';
NadiaNadia  document.removeEventListener('click', DateTimeShortcuts.dismissClockFunc[num]);
Nadia   },
Nadia   handleClockQuicklink: function(num, val) {
NadiaNadia  var d;
NadiaNadia  if (val === -1) {
NadiaNadiaNadia d = DateTimeShortcuts.now();
NadiaNadia  }
NadiaNadia  else {
NadiaNadiaNadia d = new Date(1970, 1, 1, val, 0, 0, 0);
NadiaNadia  }
NadiaNadia  DateTimeShortcuts.clockInputs[num].value = d.strftime(get_format('TIME_INPUT_FORMATS')[0]);
NadiaNadia  DateTimeShortcuts.clockInputs[num].focus();
NadiaNadia  DateTimeShortcuts.dismissClock(num);
Nadia   },
Nadia   // Add calendar widget to a given field.
Nadia   addCalendar: function(inp) {
NadiaNadia  var num = DateTimeShortcuts.calendars.length;

NadiaNadia  DateTimeShortcuts.calendarInputs[num] = inp;
NadiaNadia  DateTimeShortcuts.dismissCalendarFunc[num] = function() { DateTimeShortcuts.dismissCalendar(num); return true; };

NadiaNadia  // Shortcut links (calendar icon and "Today" link)
NadiaNadia  var shortcuts_span = document.createElement('span');
NadiaNadia  shortcuts_span.className = DateTimeShortcuts.shortCutsClass;
NadiaNadia  inp.parentNode.insertBefore(shortcuts_span, inp.nextSibling);
NadiaNadia  var today_link = document.createElement('a');
NadiaNadia  today_link.setAttribute('href', '#');
NadiaNadia  today_link.appendChild(document.createTextNode(gettext('Today')));
NadiaNadia  today_link.addEventListener('click', function(e) {
NadiaNadiaNadia e.preventDefault();
NadiaNadiaNadia DateTimeShortcuts.handleCalendarQuickLink(num, 0);
NadiaNadia  });
NadiaNadia  var cal_link = document.createElement('a');
NadiaNadia  cal_link.setAttribute('href', '#');
NadiaNadia  cal_link.id = DateTimeShortcuts.calendarLinkName + num;
NadiaNadia  cal_link.addEventListener('click', function(e) {
NadiaNadiaNadia e.preventDefault();
NadiaNadiaNadia // avoid triggering the document click handler to dismiss the calendar
NadiaNadiaNadia e.stopPropagation();
NadiaNadiaNadia DateTimeShortcuts.openCalendar(num);
NadiaNadia  });
NadiaNadia  quickElement(
NadiaNadiaNadia 'span', cal_link, '',
NadiaNadiaNadia 'class', 'date-icon',
NadiaNadiaNadia 'title', gettext('Choose a Date')
NadiaNadia  );
NadiaNadia  shortcuts_span.appendChild(document.createTextNode('\u00A0'));
NadiaNadia  shortcuts_span.appendChild(today_link);
NadiaNadia  shortcuts_span.appendChild(document.createTextNode('\u00A0|\u00A0'));
NadiaNadia  shortcuts_span.appendChild(cal_link);

NadiaNadia  // Create calendarbox div.
NadiaNadia  //
NadiaNadia  // Markup looks like:
NadiaNadia  //
NadiaNadia  // <div id="calendarbox3" class="calendarbox module">
NadiaNadia  //Nadia<h2>
NadiaNadia  //NadiaNadia <a href="#" class="link-previous">&lsaquo;</a>
NadiaNadia  //NadiaNadia <a href="#" class="link-next">&rsaquo;</a> February 2003
NadiaNadia  //Nadia</h2>
NadiaNadia  //Nadia<div class="calendar" id="calendarin3">
NadiaNadia  //Nadia    <!-- (cal) -->
NadiaNadia  //Nadia</div>
NadiaNadia  //Nadia<div class="calendar-shortcuts">
NadiaNadia  //NadiaNadia<a href="#">Yesterday</a> | <a href="#">Today</a> | <a href="#">Tomorrow</a>
NadiaNadia  //Nadia</div>
NadiaNadia  //Nadia<p class="calendar-cancel"><a href="#">Cancel</a></p>
NadiaNadia  // </div>
NadiaNadia  var cal_box = document.createElement('div');
NadiaNadia  cal_box.style.display = 'none';
NadiaNadia  cal_box.style.position = 'absolute';
NadiaNadia  cal_box.className = 'calendarbox module';
NadiaNadia  cal_box.setAttribute('id', DateTimeShortcuts.calendarDivName1 + num);
NadiaNadia  document.body.appendChild(cal_box);
NadiaNadia  cal_box.addEventListener('click', function(e) { e.stopPropagation(); });

NadiaNadia  // next-prev links
NadiaNadia  var cal_nav = quickElement('div', cal_box);
NadiaNadia  var cal_nav_prev = quickElement('a', cal_nav, '<', 'href', '#');
NadiaNadia  cal_nav_prev.className = 'calendarnav-previous';
NadiaNadia  cal_nav_prev.addEventListener('click', function(e) {
NadiaNadiaNadia e.preventDefault();
NadiaNadiaNadia DateTimeShortcuts.drawPrev(num);
NadiaNadia  });

NadiaNadia  var cal_nav_next = quickElement('a', cal_nav, '>', 'href', '#');
NadiaNadia  cal_nav_next.className = 'calendarnav-next';
NadiaNadia  cal_nav_next.addEventListener('click', function(e) {
NadiaNadiaNadia e.preventDefault();
NadiaNadiaNadia DateTimeShortcuts.drawNext(num);
NadiaNadia  });

NadiaNadia  // main box
NadiaNadia  var cal_main = quickElement('div', cal_box, '', 'id', DateTimeShortcuts.calendarDivName2 + num);
NadiaNadia  cal_main.className = 'calendar';
NadiaNadia  DateTimeShortcuts.calendars[num] = new Calendar(DateTimeShortcuts.calendarDivName2 + num, DateTimeShortcuts.handleCalendarCallback(num));
NadiaNadia  DateTimeShortcuts.calendars[num].drawCurrent();

NadiaNadia  // calendar shortcuts
NadiaNadia  var shortcuts = quickElement('div', cal_box);
NadiaNadia  shortcuts.className = 'calendar-shortcuts';
NadiaNadia  var day_link = quickElement('a', shortcuts, gettext('Yesterday'), 'href', '#');
NadiaNadia  day_link.addEventListener('click', function(e) {
NadiaNadiaNadia e.preventDefault();
NadiaNadiaNadia DateTimeShortcuts.handleCalendarQuickLink(num, -1);
NadiaNadia  });
NadiaNadia  shortcuts.appendChild(document.createTextNode('\u00A0|\u00A0'));
NadiaNadia  day_link = quickElement('a', shortcuts, gettext('Today'), 'href', '#');
NadiaNadia  day_link.addEventListener('click', function(e) {
NadiaNadiaNadia e.preventDefault();
NadiaNadiaNadia DateTimeShortcuts.handleCalendarQuickLink(num, 0);
NadiaNadia  });
NadiaNadia  shortcuts.appendChild(document.createTextNode('\u00A0|\u00A0'));
NadiaNadia  day_link = quickElement('a', shortcuts, gettext('Tomorrow'), 'href', '#');
NadiaNadia  day_link.addEventListener('click', function(e) {
NadiaNadiaNadia e.preventDefault();
NadiaNadiaNadia DateTimeShortcuts.handleCalendarQuickLink(num, +1);
NadiaNadia  });

NadiaNadia  // cancel bar
NadiaNadia  var cancel_p = quickElement('p', cal_box);
NadiaNadia  cancel_p.className = 'calendar-cancel';
NadiaNadia  var cancel_link = quickElement('a', cancel_p, gettext('Cancel'), 'href', '#');
NadiaNadia  cancel_link.addEventListener('click', function(e) {
NadiaNadiaNadia e.preventDefault();
NadiaNadiaNadia DateTimeShortcuts.dismissCalendar(num);
NadiaNadia  });
NadiaNadia  document.addEventListener('keyup', function(event) {
NadiaNadiaNadia if (event.which === 27) {
NadiaNadiaNadiaNadia// ESC key closes popup
NadiaNadiaNadiaNadiaDateTimeShortcuts.dismissCalendar(num);
NadiaNadiaNadiaNadiaevent.preventDefault();
NadiaNadiaNadia }
NadiaNadia  });
Nadia   },
Nadia   openCalendar: function(num) {
NadiaNadia  var cal_box = document.getElementById(DateTimeShortcuts.calendarDivName1 + num);
NadiaNadia  var cal_link = document.getElementById(DateTimeShortcuts.calendarLinkName + num);
NadiaNadia  var inp = DateTimeShortcuts.calendarInputs[num];

NadiaNadia  // Determine if the current value in the input has a valid date.
NadiaNadia  // If so, draw the calendar with that date's year and month.
NadiaNadia  if (inp.value) {
NadiaNadiaNadia var format = get_format('DATE_INPUT_FORMATS')[0];
NadiaNadiaNadia var selected = inp.value.strptime(format);
NadiaNadiaNadia var year = selected.getUTCFullYear();
NadiaNadiaNadia var month = selected.getUTCMonth() + 1;
NadiaNadiaNadia var re = /\d{4}/;
NadiaNadiaNadia if (re.test(year.toString()) && month >= 1 && month <= 12) {
NadiaNadiaNadiaNadiaDateTimeShortcuts.calendars[num].drawDate(month, year, selected);
NadiaNadiaNadia }
NadiaNadia  }

NadiaNadia  // Recalculate the clockbox position
NadiaNadia  // is it left-to-right or right-to-left layout ?
NadiaNadia  if (getStyle(document.body, 'direction') !== 'rtl') {
NadiaNadiaNadia cal_box.style.left = findPosX(cal_link) + 17 + 'px';
NadiaNadia  }
NadiaNadia  else {
NadiaNadiaNadia // since style's width is in em, it'd be tough to calculate
NadiaNadiaNadia // px value of it. let's use an estimated px for now
NadiaNadiaNadia // TODO: IE returns wrong value for findPosX when in rtl mode
NadiaNadiaNadia //Nadia  (it returns as it was left aligned), needs to be fixed.
NadiaNadiaNadia cal_box.style.left = findPosX(cal_link) - 180 + 'px';
NadiaNadia  }
NadiaNadia  cal_box.style.top = Math.max(0, findPosY(cal_link) - 75) + 'px';

NadiaNadia  cal_box.style.display = 'block';
NadiaNadia  document.addEventListener('click', DateTimeShortcuts.dismissCalendarFunc[num]);
Nadia   },
Nadia   dismissCalendar: function(num) {
NadiaNadia  document.getElementById(DateTimeShortcuts.calendarDivName1 + num).style.display = 'none';
NadiaNadia  document.removeEventListener('click', DateTimeShortcuts.dismissCalendarFunc[num]);
Nadia   },
Nadia   drawPrev: function(num) {
NadiaNadia  DateTimeShortcuts.calendars[num].drawPreviousMonth();
Nadia   },
Nadia   drawNext: function(num) {
NadiaNadia  DateTimeShortcuts.calendars[num].drawNextMonth();
Nadia   },
Nadia   handleCalendarCallback: function(num) {
NadiaNadia  var format = get_format('DATE_INPUT_FORMATS')[0];
NadiaNadia  // the format needs to be escaped a little
NadiaNadia  format = format.replace('\\', '\\\\')
NadiaNadiaNadiaNadiaNadia  .replace('\r', '\\r')
NadiaNadiaNadiaNadiaNadia  .replace('\n', '\\n')
NadiaNadiaNadiaNadiaNadia  .replace('\t', '\\t')
NadiaNadiaNadiaNadiaNadia  .replace("'", "\\'");
NadiaNadia  return function(y, m, d) {
NadiaNadiaNadia DateTimeShortcuts.calendarInputs[num].value = new Date(y, m - 1, d).strftime(format);
NadiaNadiaNadia DateTimeShortcuts.calendarInputs[num].focus();
NadiaNadiaNadia document.getElementById(DateTimeShortcuts.calendarDivName1 + num).style.display = 'none';
NadiaNadia  };
Nadia   },
Nadia   handleCalendarQuickLink: function(num, offset) {
NadiaNadia  var d = DateTimeShortcuts.now();
NadiaNadia  d.setDate(d.getDate() + offset);
NadiaNadia  DateTimeShortcuts.calendarInputs[num].value = d.strftime(get_format('DATE_INPUT_FORMATS')[0]);
NadiaNadia  DateTimeShortcuts.calendarInputs[num].focus();
NadiaNadia  DateTimeShortcuts.dismissCalendar(num);
Nadia   }
    };

    window.addEventListener('load', DateTimeShortcuts.init);
    window.DateTimeShortcuts = DateTimeShortcuts;
})();
