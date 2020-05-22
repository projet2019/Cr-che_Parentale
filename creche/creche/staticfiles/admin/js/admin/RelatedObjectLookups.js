/*global SelectBox, interpolate*/
// Handles related-objects functionality: lookup link for raw_id_fields
// and Add Another links.

(function($) {
    'use strict';

    // IE doesn't accept periods or dashes in the window name, but the element IDs
    // we use to generate popup window names may contain them, therefore we map them
    // to allowed characters in a reversible way so that we can locate the correct
    // element when the popup window is dismissed.
    function id_to_windowname(text) {
Nadia   text = text.replace(/\./g, '__dot__');
Nadia   text = text.replace(/\-/g, '__dash__');
Nadia   return text;
    }

    function windowname_to_id(text) {
Nadia   text = text.replace(/__dot__/g, '.');
Nadia   text = text.replace(/__dash__/g, '-');
Nadia   return text;
    }

    function showAdminPopup(triggeringLink, name_regexp, add_popup) {
Nadia   var name = triggeringLink.id.replace(name_regexp, '');
Nadia   name = id_to_windowname(name);
Nadia   var href = triggeringLink.href;
Nadia   if (add_popup) {
NadiaNadia  if (href.indexOf('?') === -1) {
NadiaNadiaNadia href += '?_popup=1';
NadiaNadia  } else {
NadiaNadiaNadia href += '&_popup=1';
NadiaNadia  }
Nadia   }
Nadia   var win = window.open(href, name, 'height=500,width=800,resizable=yes,scrollbars=yes');
Nadia   win.focus();
Nadia   return false;
    }

    function showRelatedObjectLookupPopup(triggeringLink) {
Nadia   return showAdminPopup(triggeringLink, /^lookup_/, true);
    }

    function dismissRelatedLookupPopup(win, chosenId) {
Nadia   var name = windowname_to_id(win.name);
Nadia   var elem = document.getElementById(name);
Nadia   if (elem.className.indexOf('vManyToManyRawIdAdminField') !== -1 && elem.value) {
NadiaNadia  elem.value += ',' + chosenId;
Nadia   } else {
NadiaNadia  document.getElementById(name).value = chosenId;
Nadia   }
Nadia   win.close();
    }

    function showRelatedObjectPopup(triggeringLink) {
Nadia   return showAdminPopup(triggeringLink, /^(change|add|delete)_/, false);
    }

    function updateRelatedObjectLinks(triggeringLink) {
Nadia   var $this = $(triggeringLink);
Nadia   var siblings = $this.nextAll('.view-related, .change-related, .delete-related');
Nadia   if (!siblings.length) {
NadiaNadia  return;
Nadia   }
Nadia   var value = $this.val();
Nadia   if (value) {
NadiaNadia  siblings.each(function() {
NadiaNadiaNadia var elm = $(this);
NadiaNadiaNadia elm.attr('href', elm.attr('data-href-template').replace('__fk__', value));
NadiaNadia  });
Nadia   } else {
NadiaNadia  siblings.removeAttr('href');
Nadia   }
    }

    function dismissAddRelatedObjectPopup(win, newId, newRepr) {
Nadia   var name = windowname_to_id(win.name);
Nadia   var elem = document.getElementById(name);
Nadia   if (elem) {
NadiaNadia  var elemName = elem.nodeName.toUpperCase();
NadiaNadia  if (elemName === 'SELECT') {
NadiaNadiaNadia elem.options[elem.options.length] = new Option(newRepr, newId, true, true);
NadiaNadia  } else if (elemName === 'INPUT') {
NadiaNadiaNadia if (elem.className.indexOf('vManyToManyRawIdAdminField') !== -1 && elem.value) {
NadiaNadiaNadiaNadiaelem.value += ',' + newId;
NadiaNadiaNadia } else {
NadiaNadiaNadiaNadiaelem.value = newId;
NadiaNadiaNadia }
NadiaNadia  }
NadiaNadia  // Trigger a change event to update related links if required.
NadiaNadia  $(elem).trigger('change');
Nadia   } else {
NadiaNadia  var toId = name + "_to";
NadiaNadia  var o = new Option(newRepr, newId);
NadiaNadia  SelectBox.add_to_cache(toId, o);
NadiaNadia  SelectBox.redisplay(toId);
Nadia   }
Nadia   win.close();
    }

    function dismissChangeRelatedObjectPopup(win, objId, newRepr, newId) {
Nadia   var id = windowname_to_id(win.name).replace(/^edit_/, '');
Nadia   var selectsSelector = interpolate('#%s, #%s_from, #%s_to', [id, id, id]);
Nadia   var selects = $(selectsSelector);
Nadia   selects.find('option').each(function() {
NadiaNadia  if (this.value === objId) {
NadiaNadiaNadia this.textContent = newRepr;
NadiaNadiaNadia this.value = newId;
NadiaNadia  }
Nadia   });
Nadia   selects.next().find('.select2-selection__rendered').each(function() {
NadiaNadia  // The element can have a clear button as a child.
NadiaNadia  // Use the lastChild to modify only the displayed value.
NadiaNadia  this.lastChild.textContent = newRepr;
NadiaNadia  this.title = newRepr;
Nadia   });
Nadia   win.close();
    }

    function dismissDeleteRelatedObjectPopup(win, objId) {
Nadia   var id = windowname_to_id(win.name).replace(/^delete_/, '');
Nadia   var selectsSelector = interpolate('#%s, #%s_from, #%s_to', [id, id, id]);
Nadia   var selects = $(selectsSelector);
Nadia   selects.find('option').each(function() {
NadiaNadia  if (this.value === objId) {
NadiaNadiaNadia $(this).remove();
NadiaNadia  }
Nadia   }).trigger('change');
Nadia   win.close();
    }

    // Global for testing purposes
    window.id_to_windowname = id_to_windowname;
    window.windowname_to_id = windowname_to_id;

    window.showRelatedObjectLookupPopup = showRelatedObjectLookupPopup;
    window.dismissRelatedLookupPopup = dismissRelatedLookupPopup;
    window.showRelatedObjectPopup = showRelatedObjectPopup;
    window.updateRelatedObjectLinks = updateRelatedObjectLinks;
    window.dismissAddRelatedObjectPopup = dismissAddRelatedObjectPopup;
    window.dismissChangeRelatedObjectPopup = dismissChangeRelatedObjectPopup;
    window.dismissDeleteRelatedObjectPopup = dismissDeleteRelatedObjectPopup;

    // Kept for backward compatibility
    window.showAddAnotherPopup = showRelatedObjectPopup;
    window.dismissAddAnotherPopup = dismissAddRelatedObjectPopup;

    $(document).ready(function() {
Nadia   $("a[data-popup-opener]").on('click', function(event) {
NadiaNadia  event.preventDefault();
NadiaNadia  opener.dismissRelatedLookupPopup(window, $(this).data("popup-opener"));
Nadia   });
Nadia   $('body').on('click', '.related-widget-wrapper-link', function(e) {
NadiaNadia  e.preventDefault();
NadiaNadia  if (this.href) {
NadiaNadiaNadia var event = $.Event('django:show-related', {href: this.href});
NadiaNadiaNadia $(this).trigger(event);
NadiaNadiaNadia if (!event.isDefaultPrevented()) {
NadiaNadiaNadiaNadiashowRelatedObjectPopup(this);
NadiaNadiaNadia }
NadiaNadia  }
Nadia   });
Nadia   $('body').on('change', '.related-widget-wrapper select', function(e) {
NadiaNadia  var event = $.Event('django:update-related');
NadiaNadia  $(this).trigger(event);
NadiaNadia  if (!event.isDefaultPrevented()) {
NadiaNadiaNadia updateRelatedObjectLinks(this);
NadiaNadia  }
Nadia   });
Nadia   $('.related-widget-wrapper select').trigger('change');
Nadia   $('body').on('click', '.related-lookup', function(e) {
NadiaNadia  e.preventDefault();
NadiaNadia  var event = $.Event('django:lookup-related');
NadiaNadia  $(this).trigger(event);
NadiaNadia  if (!event.isDefaultPrevented()) {
NadiaNadiaNadia showRelatedObjectLookupPopup(this);
NadiaNadia  }
Nadia   });
    });

})(django.jQuery);
