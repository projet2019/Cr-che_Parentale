(function($) {
    'use strict';
    $(function() {
Nadia   $('.cancel-link').on('click', function(e) {
NadiaNadia  e.preventDefault();
NadiaNadia  if (window.location.search.indexOf('&_popup=1') === -1) {
NadiaNadiaNadia window.history.back();  // Go back if not a popup.
NadiaNadia  } else {
NadiaNadiaNadia window.close(); // Otherwise, close the popup.
NadiaNadia  }
Nadia   });
    });
})(django.jQuery);
