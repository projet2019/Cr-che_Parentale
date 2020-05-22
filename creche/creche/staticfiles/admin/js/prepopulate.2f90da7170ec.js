/*global URLify*/
(function($) {
    'use strict';
    $.fn.prepopulate = function(dependencies, maxLength, allowUnicode) {
Nadia   /*
NadiaNadia  Depends on urlify.js
NadiaNadia  Populates a selected field with the values of the dependent fields,
NadiaNadia  URLifies and shortens the string.
NadiaNadia  dependencies - array of dependent fields ids
NadiaNadia  maxLength - maximum length of the URLify'd string
NadiaNadia  allowUnicode - Unicode support of the URLify'd string
Nadia   */
Nadia   return this.each(function() {
NadiaNadia  var prepopulatedField = $(this);

NadiaNadia  var populate = function() {
NadiaNadiaNadia // Bail if the field's value has been changed by the user
NadiaNadiaNadia if (prepopulatedField.data('_changed')) {
NadiaNadiaNadiaNadiareturn;
NadiaNadiaNadia }

NadiaNadiaNadia var values = [];
NadiaNadiaNadia $.each(dependencies, function(i, field) {
NadiaNadiaNadiaNadiafield = $(field);
NadiaNadiaNadiaNadiaif (field.val().length > 0) {
NadiaNadiaNadiaNadia    values.push(field.val());
NadiaNadiaNadiaNadia}
NadiaNadiaNadia });
NadiaNadiaNadia prepopulatedField.val(URLify(values.join(' '), maxLength, allowUnicode));
NadiaNadia  };

NadiaNadia  prepopulatedField.data('_changed', false);
NadiaNadia  prepopulatedField.on('change', function() {
NadiaNadiaNadia prepopulatedField.data('_changed', true);
NadiaNadia  });

NadiaNadia  if (!prepopulatedField.val()) {
NadiaNadiaNadia $(dependencies.join(',')).on('keyup change focus', populate);
NadiaNadia  }
Nadia   });
    };
})(django.jQuery);
