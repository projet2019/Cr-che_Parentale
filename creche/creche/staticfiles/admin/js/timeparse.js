(function() {
    'use strict';
    var timeParsePatterns = [
Nadia   // 9
Nadia   {
NadiaNadia  re: /^\d{1,2}$/i,
NadiaNadia  handler: function(bits) {
NadiaNadiaNadia if (bits[0].length === 1) {
NadiaNadiaNadiaNadiareturn '0' + bits[0] + ':00';
NadiaNadiaNadia } else {
NadiaNadiaNadiaNadiareturn bits[0] + ':00';
NadiaNadiaNadia }
NadiaNadia  }
Nadia   },
Nadia   // 13:00
Nadia   {
NadiaNadia  re: /^\d{2}[:.]\d{2}$/i,
NadiaNadia  handler: function(bits) {
NadiaNadiaNadia return bits[0].replace('.', ':');
NadiaNadia  }
Nadia   },
Nadia   // 9:00
Nadia   {
NadiaNadia  re: /^\d[:.]\d{2}$/i,
NadiaNadia  handler: function(bits) {
NadiaNadiaNadia return '0' + bits[0].replace('.', ':');
NadiaNadia  }
Nadia   },
Nadia   // 3 am / 3 a.m. / 3am
Nadia   {
NadiaNadia  re: /^(\d+)\s*([ap])(?:.?m.?)?$/i,
NadiaNadia  handler: function(bits) {
NadiaNadiaNadia var hour = parseInt(bits[1]);
NadiaNadiaNadia if (hour === 12) {
NadiaNadiaNadiaNadiahour = 0;
NadiaNadiaNadia }
NadiaNadiaNadia if (bits[2].toLowerCase() === 'p') {
NadiaNadiaNadiaNadiaif (hour === 12) {
NadiaNadiaNadiaNadia    hour = 0;
NadiaNadiaNadiaNadia}
NadiaNadiaNadiaNadiareturn (hour + 12) + ':00';
NadiaNadiaNadia } else {
NadiaNadiaNadiaNadiaif (hour < 10) {
NadiaNadiaNadiaNadia    return '0' + hour + ':00';
NadiaNadiaNadiaNadia} else {
NadiaNadiaNadiaNadia    return hour + ':00';
NadiaNadiaNadiaNadia}
NadiaNadiaNadia }
NadiaNadia  }
Nadia   },
Nadia   // 3.30 am / 3:15 a.m. / 3.00am
Nadia   {
NadiaNadia  re: /^(\d+)[.:](\d{2})\s*([ap]).?m.?$/i,
NadiaNadia  handler: function(bits) {
NadiaNadiaNadia var hour = parseInt(bits[1]);
NadiaNadiaNadia var mins = parseInt(bits[2]);
NadiaNadiaNadia if (mins < 10) {
NadiaNadiaNadiaNadiamins = '0' + mins;
NadiaNadiaNadia }
NadiaNadiaNadia if (hour === 12) {
NadiaNadiaNadiaNadiahour = 0;
NadiaNadiaNadia }
NadiaNadiaNadia if (bits[3].toLowerCase() === 'p') {
NadiaNadiaNadiaNadiaif (hour === 12) {
NadiaNadiaNadiaNadia    hour = 0;
NadiaNadiaNadiaNadia}
NadiaNadiaNadiaNadiareturn (hour + 12) + ':' + mins;
NadiaNadiaNadia } else {
NadiaNadiaNadiaNadiaif (hour < 10) {
NadiaNadiaNadiaNadia    return '0' + hour + ':' + mins;
NadiaNadiaNadiaNadia} else {
NadiaNadiaNadiaNadia    return hour + ':' + mins;
NadiaNadiaNadiaNadia}
NadiaNadiaNadia }
NadiaNadia  }
Nadia   },
Nadia   // noon
Nadia   {
NadiaNadia  re: /^no/i,
NadiaNadia  handler: function(bits) {
NadiaNadiaNadia return '12:00';
NadiaNadia  }
Nadia   },
Nadia   // midnight
Nadia   {
NadiaNadia  re: /^mid/i,
NadiaNadia  handler: function(bits) {
NadiaNadiaNadia return '00:00';
NadiaNadia  }
Nadia   }
    ];

    function parseTimeString(s) {
Nadia   for (var i = 0; i < timeParsePatterns.length; i++) {
NadiaNadia  var re = timeParsePatterns[i].re;
NadiaNadia  var handler = timeParsePatterns[i].handler;
NadiaNadia  var bits = re.exec(s);
NadiaNadia  if (bits) {
NadiaNadiaNadia return handler(bits);
NadiaNadia  }
Nadia   }
Nadia   return s;
    }

    window.parseTimeString = parseTimeString;
})();
