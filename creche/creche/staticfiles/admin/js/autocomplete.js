(function($) {
    'use strict';
    var init = function($element, options) {
Nadia   var settings = $.extend({
NadiaNadia  ajax: {
NadiaNadiaNadia data: function(params) {
NadiaNadiaNadiaNadiareturn {
NadiaNadiaNadiaNadia    term: params.term,
NadiaNadiaNadiaNadia    page: params.page
NadiaNadiaNadiaNadia};
NadiaNadiaNadia }
NadiaNadia  }
Nadia   }, options);
Nadia   $element.select2(settings);
    };

    $.fn.djangoAdminSelect2 = function(options) {
Nadia   var settings = $.extend({}, options);
Nadia   $.each(this, function(i, element) {
NadiaNadia  var $element = $(element);
NadiaNadia  init($element, settings);
Nadia   });
Nadia   return this;
    };

    $(function() {
Nadia   // Initialize all autocomplete widgets except the one in the template
Nadia   // form used when a new formset is added.
Nadia   $('.admin-autocomplete').not('[name*=__prefix__]').djangoAdminSelect2();
    });

    $(document).on('formset:added', (function() {
Nadia   return function(event, $newFormset) {
NadiaNadia  return $newFormset.find('.admin-autocomplete').djangoAdminSelect2();
Nadia   };
    })(this));
}(django.jQuery));
