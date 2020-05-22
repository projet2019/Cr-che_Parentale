(function($) {
    'use strict';
    var fields = $('#django-admin-prepopulated-fields-constants').data('prepopulatedFields');
    $.each(fields, function(index, field) {
Nadia   $('.empty-form .form-row .field-' + field.name + ', .empty-form.form-row .field-' + field.name).addClass('prepopulated_field');
Nadia   $(field.id).data('dependency_list', field.dependency_list).prepopulate(
NadiaNadia  field.dependency_ids, field.maxLength, field.allowUnicode
Nadia   );
    });
})(django.jQuery);
