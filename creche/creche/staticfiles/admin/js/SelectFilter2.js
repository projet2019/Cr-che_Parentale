/*global SelectBox, gettext, interpolate, quickElement, SelectFilter*/
/*
SelectFilter2 - Turns a multiple-select box into a filter interface.

Requires jQuery, core.js, and SelectBox.js.
*/
(function($) {
    'use strict';
    function findForm(node) {
Nadia   // returns the node of the form containing the given node
Nadia   if (node.tagName.toLowerCase() !== 'form') {
NadiaNadia  return findForm(node.parentNode);
Nadia   }
Nadia   return node;
    }

    window.SelectFilter = {
Nadia   init: function(field_id, field_name, is_stacked) {
NadiaNadia  if (field_id.match(/__prefix__/)) {
NadiaNadiaNadia // Don't initialize on empty forms.
NadiaNadiaNadia return;
NadiaNadia  }
NadiaNadia  var from_box = document.getElementById(field_id);
NadiaNadia  from_box.id += '_from'; // change its ID
NadiaNadia  from_box.className = 'filtered';

NadiaNadia  var ps = from_box.parentNode.getElementsByTagName('p');
NadiaNadia  for (var i = 0; i < ps.length; i++) {
NadiaNadiaNadia if (ps[i].className.indexOf("info") !== -1) {
NadiaNadiaNadiaNadia// Remove <p class="info">, because it just gets in the way.
NadiaNadiaNadiaNadiafrom_box.parentNode.removeChild(ps[i]);
NadiaNadiaNadia } else if (ps[i].className.indexOf("help") !== -1) {
NadiaNadiaNadiaNadia// Move help text up to the top so it isn't below the select
NadiaNadiaNadiaNadia// boxes or wrapped off on the side to the right of the add
NadiaNadiaNadiaNadia// button:
NadiaNadiaNadiaNadiafrom_box.parentNode.insertBefore(ps[i], from_box.parentNode.firstChild);
NadiaNadiaNadia }
NadiaNadia  }

NadiaNadia  // <div class="selector"> or <div class="selector stacked">
NadiaNadia  var selector_div = quickElement('div', from_box.parentNode);
NadiaNadia  selector_div.className = is_stacked ? 'selector stacked' : 'selector';

NadiaNadia  // <div class="selector-available">
NadiaNadia  var selector_available = quickElement('div', selector_div);
NadiaNadia  selector_available.className = 'selector-available';
NadiaNadia  var title_available = quickElement('h2', selector_available, interpolate(gettext('Available %s') + ' ', [field_name]));
NadiaNadia  quickElement(
NadiaNadiaNadia 'span', title_available, '',
NadiaNadiaNadia 'class', 'help help-tooltip help-icon',
NadiaNadiaNadia 'title', interpolate(
NadiaNadiaNadiaNadiagettext(
NadiaNadiaNadiaNadia    'This is the list of available %s. You may choose some by ' +
NadiaNadiaNadiaNadia    'selecting them in the box below and then clicking the ' +
NadiaNadiaNadiaNadia    '"Choose" arrow between the two boxes.'
NadiaNadiaNadiaNadia),
NadiaNadiaNadiaNadia[field_name]
NadiaNadiaNadia )
NadiaNadia  );

NadiaNadia  var filter_p = quickElement('p', selector_available, '', 'id', field_id + '_filter');
NadiaNadia  filter_p.className = 'selector-filter';

NadiaNadia  var search_filter_label = quickElement('label', filter_p, '', 'for', field_id + '_input');

NadiaNadia  quickElement(
NadiaNadiaNadia 'span', search_filter_label, '',
NadiaNadiaNadia 'class', 'help-tooltip search-label-icon',
NadiaNadiaNadia 'title', interpolate(gettext("Type into this box to filter down the list of available %s."), [field_name])
NadiaNadia  );

NadiaNadia  filter_p.appendChild(document.createTextNode(' '));

NadiaNadia  var filter_input = quickElement('input', filter_p, '', 'type', 'text', 'placeholder', gettext("Filter"));
NadiaNadia  filter_input.id = field_id + '_input';

NadiaNadia  selector_available.appendChild(from_box);
NadiaNadia  var choose_all = quickElement('a', selector_available, gettext('Choose all'), 'title', interpolate(gettext('Click to choose all %s at once.'), [field_name]), 'href', '#', 'id', field_id + '_add_all_link');
NadiaNadia  choose_all.className = 'selector-chooseall';

NadiaNadia  // <ul class="selector-chooser">
NadiaNadia  var selector_chooser = quickElement('ul', selector_div);
NadiaNadia  selector_chooser.className = 'selector-chooser';
NadiaNadia  var add_link = quickElement('a', quickElement('li', selector_chooser), gettext('Choose'), 'title', gettext('Choose'), 'href', '#', 'id', field_id + '_add_link');
NadiaNadia  add_link.className = 'selector-add';
NadiaNadia  var remove_link = quickElement('a', quickElement('li', selector_chooser), gettext('Remove'), 'title', gettext('Remove'), 'href', '#', 'id', field_id + '_remove_link');
NadiaNadia  remove_link.className = 'selector-remove';

NadiaNadia  // <div class="selector-chosen">
NadiaNadia  var selector_chosen = quickElement('div', selector_div);
NadiaNadia  selector_chosen.className = 'selector-chosen';
NadiaNadia  var title_chosen = quickElement('h2', selector_chosen, interpolate(gettext('Chosen %s') + ' ', [field_name]));
NadiaNadia  quickElement(
NadiaNadiaNadia 'span', title_chosen, '',
NadiaNadiaNadia 'class', 'help help-tooltip help-icon',
NadiaNadiaNadia 'title', interpolate(
NadiaNadiaNadiaNadiagettext(
NadiaNadiaNadiaNadia    'This is the list of chosen %s. You may remove some by ' +
NadiaNadiaNadiaNadia    'selecting them in the box below and then clicking the ' +
NadiaNadiaNadiaNadia    '"Remove" arrow between the two boxes.'
NadiaNadiaNadiaNadia),
NadiaNadiaNadiaNadia[field_name]
NadiaNadiaNadia )
NadiaNadia  );

NadiaNadia  var to_box = quickElement('select', selector_chosen, '', 'id', field_id + '_to', 'multiple', 'multiple', 'size', from_box.size, 'name', from_box.getAttribute('name'));
NadiaNadia  to_box.className = 'filtered';
NadiaNadia  var clear_all = quickElement('a', selector_chosen, gettext('Remove all'), 'title', interpolate(gettext('Click to remove all chosen %s at once.'), [field_name]), 'href', '#', 'id', field_id + '_remove_all_link');
NadiaNadia  clear_all.className = 'selector-clearall';

NadiaNadia  from_box.setAttribute('name', from_box.getAttribute('name') + '_old');

NadiaNadia  // Set up the JavaScript event handlers for the select box filter interface
NadiaNadia  var move_selection = function(e, elem, move_func, from, to) {
NadiaNadiaNadia if (elem.className.indexOf('active') !== -1) {
NadiaNadiaNadiaNadiamove_func(from, to);
NadiaNadiaNadiaNadiaSelectFilter.refresh_icons(field_id);
NadiaNadiaNadia }
NadiaNadiaNadia e.preventDefault();
NadiaNadia  };
NadiaNadia  choose_all.addEventListener('click', function(e) {
NadiaNadiaNadia move_selection(e, this, SelectBox.move_all, field_id + '_from', field_id + '_to');
NadiaNadia  });
NadiaNadia  add_link.addEventListener('click', function(e) {
NadiaNadiaNadia move_selection(e, this, SelectBox.move, field_id + '_from', field_id + '_to');
NadiaNadia  });
NadiaNadia  remove_link.addEventListener('click', function(e) {
NadiaNadiaNadia move_selection(e, this, SelectBox.move, field_id + '_to', field_id + '_from');
NadiaNadia  });
NadiaNadia  clear_all.addEventListener('click', function(e) {
NadiaNadiaNadia move_selection(e, this, SelectBox.move_all, field_id + '_to', field_id + '_from');
NadiaNadia  });
NadiaNadia  filter_input.addEventListener('keypress', function(e) {
NadiaNadiaNadia SelectFilter.filter_key_press(e, field_id);
NadiaNadia  });
NadiaNadia  filter_input.addEventListener('keyup', function(e) {
NadiaNadiaNadia SelectFilter.filter_key_up(e, field_id);
NadiaNadia  });
NadiaNadia  filter_input.addEventListener('keydown', function(e) {
NadiaNadiaNadia SelectFilter.filter_key_down(e, field_id);
NadiaNadia  });
NadiaNadia  selector_div.addEventListener('change', function(e) {
NadiaNadiaNadia if (e.target.tagName === 'SELECT') {
NadiaNadiaNadiaNadiaSelectFilter.refresh_icons(field_id);
NadiaNadiaNadia }
NadiaNadia  });
NadiaNadia  selector_div.addEventListener('dblclick', function(e) {
NadiaNadiaNadia if (e.target.tagName === 'OPTION') {
NadiaNadiaNadiaNadiaif (e.target.closest('select').id === field_id + '_to') {
NadiaNadiaNadiaNadia    SelectBox.move(field_id + '_to', field_id + '_from');
NadiaNadiaNadiaNadia} else {
NadiaNadiaNadiaNadia    SelectBox.move(field_id + '_from', field_id + '_to');
NadiaNadiaNadiaNadia}
NadiaNadiaNadiaNadiaSelectFilter.refresh_icons(field_id);
NadiaNadiaNadia }
NadiaNadia  });
NadiaNadia  findForm(from_box).addEventListener('submit', function() {
NadiaNadiaNadia SelectBox.select_all(field_id + '_to');
NadiaNadia  });
NadiaNadia  SelectBox.init(field_id + '_from');
NadiaNadia  SelectBox.init(field_id + '_to');
NadiaNadia  // Move selected from_box options to to_box
NadiaNadia  SelectBox.move(field_id + '_from', field_id + '_to');

NadiaNadia  if (!is_stacked) {
NadiaNadiaNadia // In horizontal mode, give the same height to the two boxes.
NadiaNadiaNadia var j_from_box = $('#' + field_id + '_from');
NadiaNadiaNadia var j_to_box = $('#' + field_id + '_to');
NadiaNadiaNadia j_to_box.height($(filter_p).outerHeight() + j_from_box.outerHeight());
NadiaNadia  }

NadiaNadia  // Initial icon refresh
NadiaNadia  SelectFilter.refresh_icons(field_id);
Nadia   },
Nadia   any_selected: function(field) {
NadiaNadia  var any_selected = false;
NadiaNadia  try {
NadiaNadiaNadia // Temporarily add the required attribute and check validity.
NadiaNadiaNadia // This is much faster in WebKit browsers than the fallback.
NadiaNadiaNadia field.attr('required', 'required');
NadiaNadiaNadia any_selected = field.is(':valid');
NadiaNadiaNadia field.removeAttr('required');
NadiaNadia  } catch (e) {
NadiaNadiaNadia // Browsers that don't support :valid (IE < 10)
NadiaNadiaNadia any_selected = field.find('option:selected').length > 0;
NadiaNadia  }
NadiaNadia  return any_selected;
Nadia   },
Nadia   refresh_icons: function(field_id) {
NadiaNadia  var from = $('#' + field_id + '_from');
NadiaNadia  var to = $('#' + field_id + '_to');
NadiaNadia  // Active if at least one item is selected
NadiaNadia  $('#' + field_id + '_add_link').toggleClass('active', SelectFilter.any_selected(from));
NadiaNadia  $('#' + field_id + '_remove_link').toggleClass('active', SelectFilter.any_selected(to));
NadiaNadia  // Active if the corresponding box isn't empty
NadiaNadia  $('#' + field_id + '_add_all_link').toggleClass('active', from.find('option').length > 0);
NadiaNadia  $('#' + field_id + '_remove_all_link').toggleClass('active', to.find('option').length > 0);
Nadia   },
Nadia   filter_key_press: function(event, field_id) {
NadiaNadia  var from = document.getElementById(field_id + '_from');
NadiaNadia  // don't submit form if user pressed Enter
NadiaNadia  if ((event.which && event.which === 13) || (event.keyCode && event.keyCode === 13)) {
NadiaNadiaNadia from.selectedIndex = 0;
NadiaNadiaNadia SelectBox.move(field_id + '_from', field_id + '_to');
NadiaNadiaNadia from.selectedIndex = 0;
NadiaNadiaNadia event.preventDefault();
NadiaNadiaNadia return false;
NadiaNadia  }
Nadia   },
Nadia   filter_key_up: function(event, field_id) {
NadiaNadia  var from = document.getElementById(field_id + '_from');
NadiaNadia  var temp = from.selectedIndex;
NadiaNadia  SelectBox.filter(field_id + '_from', document.getElementById(field_id + '_input').value);
NadiaNadia  from.selectedIndex = temp;
NadiaNadia  return true;
Nadia   },
Nadia   filter_key_down: function(event, field_id) {
NadiaNadia  var from = document.getElementById(field_id + '_from');
NadiaNadia  // right arrow -- move across
NadiaNadia  if ((event.which && event.which === 39) || (event.keyCode && event.keyCode === 39)) {
NadiaNadiaNadia var old_index = from.selectedIndex;
NadiaNadiaNadia SelectBox.move(field_id + '_from', field_id + '_to');
NadiaNadiaNadia from.selectedIndex = (old_index === from.length) ? from.length - 1 : old_index;
NadiaNadiaNadia return false;
NadiaNadia  }
NadiaNadia  // down arrow -- wrap around
NadiaNadia  if ((event.which && event.which === 40) || (event.keyCode && event.keyCode === 40)) {
NadiaNadiaNadia from.selectedIndex = (from.length === from.selectedIndex + 1) ? 0 : from.selectedIndex + 1;
NadiaNadia  }
NadiaNadia  // up arrow -- wrap around
NadiaNadia  if ((event.which && event.which === 38) || (event.keyCode && event.keyCode === 38)) {
NadiaNadiaNadia from.selectedIndex = (from.selectedIndex === 0) ? from.length - 1 : from.selectedIndex - 1;
NadiaNadia  }
NadiaNadia  return true;
Nadia   }
    };

    window.addEventListener('load', function(e) {
Nadia   $('select.selectfilter, select.selectfilterstacked').each(function() {
NadiaNadia  var $el = $(this),
NadiaNadiaNadia data = $el.data();
NadiaNadia  SelectFilter.init($el.attr('id'), data.fieldName, parseInt(data.isStacked, 10));
Nadia   });
    });

})(django.jQuery);
