/*global opener */
(function() {
    'use strict';
    var initData = JSON.parse(document.getElementById('django-admin-popup-response-constants').dataset.popupResponse);
    switch(initData.action) {
    case 'change':
Nadia   opener.dismissChangeRelatedObjectPopup(window, initData.value, initData.obj, initData.new_value);
Nadia   break;
    case 'delete':
Nadia   opener.dismissDeleteRelatedObjectPopup(window, initData.value);
Nadia   break;
    default:
Nadia   opener.dismissAddRelatedObjectPopup(window, initData.value, initData.obj);
Nadia   break;
    }
})();
