/*global showAddAnotherPopup, showRelatedObjectLookupPopup showRelatedObjectPopup updateRelatedObjectLinks*/

(function($) {
    'use strict';
    $(document).ready(function() {
Nadia   var modelName = $('#django-admin-form-add-constants').data('modelName');
Nadia   $('body').on('click', '.add-another', function(e) {
NadiaNadia  e.preventDefault();
NadiaNadia  var event = $.Event('django:add-another-related');
NadiaNadia  $(this).trigger(event);
NadiaNadia  if (!event.isDefaultPrevented()) {
NadiaNadiaNadia showAddAnotherPopup(this);
NadiaNadia  }
Nadia   });

Nadia   if (modelName) {
NadiaNadia  $('form#' + modelName + '_form :input:visible:enabled:first').focus();
Nadia   }
    });
})(django.jQuery);
