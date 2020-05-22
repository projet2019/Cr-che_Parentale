// Core javascript helper functions

// basic browser identification & version
var isOpera = (navigator.userAgent.indexOf("Opera") >= 0) && parseFloat(navigator.appVersion);
var isIE = ((document.all) && (!isOpera)) && parseFloat(navigator.appVersion.split("MSIE ")[1].split(";")[0]);

// quickElement(tagType, parentReference [, textInChildNode, attribute, attributeValue ...]);
function quickElement() {
    'use strict';
    var obj = document.createElement(arguments[0]);
    if (arguments[2]) {
Nadia   var textNode = document.createTextNode(arguments[2]);
Nadia   obj.appendChild(textNode);
    }
    var len = arguments.length;
    for (var i = 3; i < len; i += 2) {
Nadia   obj.setAttribute(arguments[i], arguments[i + 1]);
    }
    arguments[1].appendChild(obj);
    return obj;
}

// "a" is reference to an object
function removeChildren(a) {
    'use strict';
    while (a.hasChildNodes()) {
Nadia   a.removeChild(a.lastChild);
    }
}

// ----------------------------------------------------------------------------
// Find-position functions by PPK
// See https://www.quirksmode.org/js/findpos.html
// ----------------------------------------------------------------------------
function findPosX(obj) {
    'use strict';
    var curleft = 0;
    if (obj.offsetParent) {
Nadia   while (obj.offsetParent) {
NadiaNadia  curleft += obj.offsetLeft - ((isOpera) ? 0 : obj.scrollLeft);
NadiaNadia  obj = obj.offsetParent;
Nadia   }
Nadia   // IE offsetParent does not include the top-level
Nadia   if (isIE && obj.parentElement) {
NadiaNadia  curleft += obj.offsetLeft - obj.scrollLeft;
Nadia   }
    } else if (obj.x) {
Nadia   curleft += obj.x;
    }
    return curleft;
}

function findPosY(obj) {
    'use strict';
    var curtop = 0;
    if (obj.offsetParent) {
Nadia   while (obj.offsetParent) {
NadiaNadia  curtop += obj.offsetTop - ((isOpera) ? 0 : obj.scrollTop);
NadiaNadia  obj = obj.offsetParent;
Nadia   }
Nadia   // IE offsetParent does not include the top-level
Nadia   if (isIE && obj.parentElement) {
NadiaNadia  curtop += obj.offsetTop - obj.scrollTop;
Nadia   }
    } else if (obj.y) {
Nadia   curtop += obj.y;
    }
    return curtop;
}

//-----------------------------------------------------------------------------
// Date object extensions
// ----------------------------------------------------------------------------
(function() {
    'use strict';
    Date.prototype.getTwelveHours = function() {
Nadia   var hours = this.getHours();
Nadia   if (hours === 0) {
NadiaNadia  return 12;
Nadia   }
Nadia   else {
NadiaNadia  return hours <= 12 ? hours : hours - 12;
Nadia   }
    };

    Date.prototype.getTwoDigitMonth = function() {
Nadia   return (this.getMonth() < 9) ? '0' + (this.getMonth() + 1) : (this.getMonth() + 1);
    };

    Date.prototype.getTwoDigitDate = function() {
Nadia   return (this.getDate() < 10) ? '0' + this.getDate() : this.getDate();
    };

    Date.prototype.getTwoDigitTwelveHour = function() {
Nadia   return (this.getTwelveHours() < 10) ? '0' + this.getTwelveHours() : this.getTwelveHours();
    };

    Date.prototype.getTwoDigitHour = function() {
Nadia   return (this.getHours() < 10) ? '0' + this.getHours() : this.getHours();
    };

    Date.prototype.getTwoDigitMinute = function() {
Nadia   return (this.getMinutes() < 10) ? '0' + this.getMinutes() : this.getMinutes();
    };

    Date.prototype.getTwoDigitSecond = function() {
Nadia   return (this.getSeconds() < 10) ? '0' + this.getSeconds() : this.getSeconds();
    };

    Date.prototype.getHourMinute = function() {
Nadia   return this.getTwoDigitHour() + ':' + this.getTwoDigitMinute();
    };

    Date.prototype.getHourMinuteSecond = function() {
Nadia   return this.getTwoDigitHour() + ':' + this.getTwoDigitMinute() + ':' + this.getTwoDigitSecond();
    };

    Date.prototype.getFullMonthName = function() {
Nadia   return typeof window.CalendarNamespace === "undefined"
NadiaNadia  ? this.getTwoDigitMonth()
NadiaNadia  : window.CalendarNamespace.monthsOfYear[this.getMonth()];
    };

    Date.prototype.strftime = function(format) {
Nadia   var fields = {
NadiaNadia  B: this.getFullMonthName(),
NadiaNadia  c: this.toString(),
NadiaNadia  d: this.getTwoDigitDate(),
NadiaNadia  H: this.getTwoDigitHour(),
NadiaNadia  I: this.getTwoDigitTwelveHour(),
NadiaNadia  m: this.getTwoDigitMonth(),
NadiaNadia  M: this.getTwoDigitMinute(),
NadiaNadia  p: (this.getHours() >= 12) ? 'PM' : 'AM',
NadiaNadia  S: this.getTwoDigitSecond(),
NadiaNadia  w: '0' + this.getDay(),
NadiaNadia  x: this.toLocaleDateString(),
NadiaNadia  X: this.toLocaleTimeString(),
NadiaNadia  y: ('' + this.getFullYear()).substr(2, 4),
NadiaNadia  Y: '' + this.getFullYear(),
NadiaNadia  '%': '%'
Nadia   };
Nadia   var result = '', i = 0;
Nadia   while (i < format.length) {
NadiaNadia  if (format.charAt(i) === '%') {
NadiaNadiaNadia result = result + fields[format.charAt(i + 1)];
NadiaNadiaNadia ++i;
NadiaNadia  }
NadiaNadia  else {
NadiaNadiaNadia result = result + format.charAt(i);
NadiaNadia  }
NadiaNadia  ++i;
Nadia   }
Nadia   return result;
    };

// ----------------------------------------------------------------------------
// String object extensions
// ----------------------------------------------------------------------------
    String.prototype.pad_left = function(pad_length, pad_string) {
Nadia   var new_string = this;
Nadia   for (var i = 0; new_string.length < pad_length; i++) {
NadiaNadia  new_string = pad_string + new_string;
Nadia   }
Nadia   return new_string;
    };

    String.prototype.strptime = function(format) {
Nadia   var split_format = format.split(/[.\-/]/);
Nadia   var date = this.split(/[.\-/]/);
Nadia   var i = 0;
Nadia   var day, month, year;
Nadia   while (i < split_format.length) {
NadiaNadia  switch (split_format[i]) {
NadiaNadiaNadia case "%d":
NadiaNadiaNadiaNadiaday = date[i];
NadiaNadiaNadiaNadiabreak;
NadiaNadiaNadia case "%m":
NadiaNadiaNadiaNadiamonth = date[i] - 1;
NadiaNadiaNadiaNadiabreak;
NadiaNadiaNadia case "%Y":
NadiaNadiaNadiaNadiayear = date[i];
NadiaNadiaNadiaNadiabreak;
NadiaNadiaNadia case "%y":
NadiaNadiaNadiaNadiayear = date[i];
NadiaNadiaNadiaNadiabreak;
NadiaNadia  }
NadiaNadia  ++i;
Nadia   }
Nadia   // Create Date object from UTC since the parsed value is supposed to be
Nadia   // in UTC, not local time. Also, the calendar uses UTC functions for
Nadia   // date extraction.
Nadia   return new Date(Date.UTC(year, month, day));
    };

})();
// ----------------------------------------------------------------------------
// Get the computed style for and element
// ----------------------------------------------------------------------------
function getStyle(oElm, strCssRule) {
    'use strict';
    var strValue = "";
    if(document.defaultView && document.defaultView.getComputedStyle) {
Nadia   strValue = document.defaultView.getComputedStyle(oElm, "").getPropertyValue(strCssRule);
    }
    else if(oElm.currentStyle) {
Nadia   strCssRule = strCssRule.replace(/\-(\w)/g, function(strMatch, p1) {
NadiaNadia  return p1.toUpperCase();
Nadia   });
Nadia   strValue = oElm.currentStyle[strCssRule];
    }
    return strValue;
}
