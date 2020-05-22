(function($) {
    'use strict';
    var SelectBox = {
Nadia   cache: {},
Nadia   init: function(id) {
NadiaNadia  var box = document.getElementById(id);
NadiaNadia  var node;
NadiaNadia  SelectBox.cache[id] = [];
NadiaNadia  var cache = SelectBox.cache[id];
NadiaNadia  var boxOptions = box.options;
NadiaNadia  var boxOptionsLength = boxOptions.length;
NadiaNadia  for (var i = 0, j = boxOptionsLength; i < j; i++) {
NadiaNadiaNadia node = boxOptions[i];
NadiaNadiaNadia cache.push({value: node.value, text: node.text, displayed: 1});
NadiaNadia  }
Nadia   },
Nadia   redisplay: function(id) {
NadiaNadia  // Repopulate HTML select box from cache
NadiaNadia  var box = document.getElementById(id);
NadiaNadia  var node;
NadiaNadia  $(box).empty(); // clear all options
NadiaNadia  var new_options = box.outerHTML.slice(0, -9);  // grab just the opening tag
NadiaNadia  var cache = SelectBox.cache[id];
NadiaNadia  for (var i = 0, j = cache.length; i < j; i++) {
NadiaNadiaNadia node = cache[i];
NadiaNadiaNadia if (node.displayed) {
NadiaNadiaNadiaNadiavar new_option = new Option(node.text, node.value, false, false);
NadiaNadiaNadiaNadia// Shows a tooltip when hovering over the option
NadiaNadiaNadiaNadianew_option.setAttribute("title", node.text);
NadiaNadiaNadiaNadianew_options += new_option.outerHTML;
NadiaNadiaNadia }
NadiaNadia  }
NadiaNadia  new_options += '</select>';
NadiaNadia  box.outerHTML = new_options;
Nadia   },
Nadia   filter: function(id, text) {
NadiaNadia  // Redisplay the HTML select box, displaying only the choices containing ALL
NadiaNadia  // the words in text. (It's an AND search.)
NadiaNadia  var tokens = text.toLowerCase().split(/\s+/);
NadiaNadia  var node, token;
NadiaNadia  var cache = SelectBox.cache[id];
NadiaNadia  for (var i = 0, j = cache.length; i < j; i++) {
NadiaNadiaNadia node = cache[i];
NadiaNadiaNadia node.displayed = 1;
NadiaNadiaNadia var node_text = node.text.toLowerCase();
NadiaNadiaNadia var numTokens = tokens.length;
NadiaNadiaNadia for (var k = 0; k < numTokens; k++) {
NadiaNadiaNadiaNadiatoken = tokens[k];
NadiaNadiaNadiaNadiaif (node_text.indexOf(token) === -1) {
NadiaNadiaNadiaNadia    node.displayed = 0;
NadiaNadiaNadiaNadia    break;  // Once the first token isn't found we're done
NadiaNadiaNadiaNadia}
NadiaNadiaNadia }
NadiaNadia  }
NadiaNadia  SelectBox.redisplay(id);
Nadia   },
Nadia   delete_from_cache: function(id, value) {
NadiaNadia  var node, delete_index = null;
NadiaNadia  var cache = SelectBox.cache[id];
NadiaNadia  for (var i = 0, j = cache.length; i < j; i++) {
NadiaNadiaNadia node = cache[i];
NadiaNadiaNadia if (node.value === value) {
NadiaNadiaNadiaNadiadelete_index = i;
NadiaNadiaNadiaNadiabreak;
NadiaNadiaNadia }
NadiaNadia  }
NadiaNadia  cache.splice(delete_index, 1);
Nadia   },
Nadia   add_to_cache: function(id, option) {
NadiaNadia  SelectBox.cache[id].push({value: option.value, text: option.text, displayed: 1});
Nadia   },
Nadia   cache_contains: function(id, value) {
NadiaNadia  // Check if an item is contained in the cache
NadiaNadia  var node;
NadiaNadia  var cache = SelectBox.cache[id];
NadiaNadia  for (var i = 0, j = cache.length; i < j; i++) {
NadiaNadiaNadia node = cache[i];
NadiaNadiaNadia if (node.value === value) {
NadiaNadiaNadiaNadiareturn true;
NadiaNadiaNadia }
NadiaNadia  }
NadiaNadia  return false;
Nadia   },
Nadia   move: function(from, to) {
NadiaNadia  var from_box = document.getElementById(from);
NadiaNadia  var option;
NadiaNadia  var boxOptions = from_box.options;
NadiaNadia  var boxOptionsLength = boxOptions.length;
NadiaNadia  for (var i = 0, j = boxOptionsLength; i < j; i++) {
NadiaNadiaNadia option = boxOptions[i];
NadiaNadiaNadia var option_value = option.value;
NadiaNadiaNadia if (option.selected && SelectBox.cache_contains(from, option_value)) {
NadiaNadiaNadiaNadiaSelectBox.add_to_cache(to, {value: option_value, text: option.text, displayed: 1});
NadiaNadiaNadiaNadiaSelectBox.delete_from_cache(from, option_value);
NadiaNadiaNadia }
NadiaNadia  }
NadiaNadia  SelectBox.redisplay(from);
NadiaNadia  SelectBox.redisplay(to);
Nadia   },
Nadia   move_all: function(from, to) {
NadiaNadia  var from_box = document.getElementById(from);
NadiaNadia  var option;
NadiaNadia  var boxOptions = from_box.options;
NadiaNadia  var boxOptionsLength = boxOptions.length;
NadiaNadia  for (var i = 0, j = boxOptionsLength; i < j; i++) {
NadiaNadiaNadia option = boxOptions[i];
NadiaNadiaNadia var option_value = option.value;
NadiaNadiaNadia if (SelectBox.cache_contains(from, option_value)) {
NadiaNadiaNadiaNadiaSelectBox.add_to_cache(to, {value: option_value, text: option.text, displayed: 1});
NadiaNadiaNadiaNadiaSelectBox.delete_from_cache(from, option_value);
NadiaNadiaNadia }
NadiaNadia  }
NadiaNadia  SelectBox.redisplay(from);
NadiaNadia  SelectBox.redisplay(to);
Nadia   },
Nadia   sort: function(id) {
NadiaNadia  SelectBox.cache[id].sort(function(a, b) {
NadiaNadiaNadia a = a.text.toLowerCase();
NadiaNadiaNadia b = b.text.toLowerCase();
NadiaNadiaNadia try {
NadiaNadiaNadiaNadiaif (a > b) {
NadiaNadiaNadiaNadia    return 1;
NadiaNadiaNadiaNadia}
NadiaNadiaNadiaNadiaif (a < b) {
NadiaNadiaNadiaNadia    return -1;
NadiaNadiaNadiaNadia}
NadiaNadiaNadia }
NadiaNadiaNadia catch (e) {
NadiaNadiaNadiaNadia// silently fail on IE 'unknown' exception
NadiaNadiaNadia }
NadiaNadiaNadia return 0;
NadiaNadia  } );
Nadia   },
Nadia   select_all: function(id) {
NadiaNadia  var box = document.getElementById(id);
NadiaNadia  var boxOptions = box.options;
NadiaNadia  var boxOptionsLength = boxOptions.length;
NadiaNadia  for (var i = 0; i < boxOptionsLength; i++) {
NadiaNadiaNadia boxOptions[i].selected = 'selected';
NadiaNadia  }
Nadia   }
    };
    window.SelectBox = SelectBox;
})(django.jQuery);
