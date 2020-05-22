/*global gettext*/
(function() {
    'use strict';
    var closestElem = function(elem, tagName) {
Nadia   if (elem.nodeName === tagName.toUpperCase()) {
NadiaNadia  return elem;
Nadia   }
Nadia   if (elem.parentNode.nodeName === 'BODY') {
NadiaNadia  return null;
Nadia   }
Nadia   return elem.parentNode && closestElem(elem.parentNode, tagName);
    };

    window.addEventListener('load', function() {
Nadia   // Add anchor tag for Show/Hide link
Nadia   var fieldsets = document.querySelectorAll('fieldset.collapse');
Nadia   for (var i = 0; i < fieldsets.length; i++) {
NadiaNadia  var elem = fieldsets[i];
NadiaNadia  // Don't hide if fields in this fieldset have errors
NadiaNadia  if (elem.querySelectorAll('div.errors').length === 0) {
NadiaNadiaNadia elem.classList.add('collapsed');
NadiaNadiaNadia var h2 = elem.querySelector('h2');
NadiaNadiaNadia var link = document.createElement('a');
NadiaNadiaNadia link.setAttribute('id', 'fieldsetcollapser' + i);
NadiaNadiaNadia link.setAttribute('class', 'collapse-toggle');
NadiaNadiaNadia link.setAttribute('href', '#');
NadiaNadiaNadia link.textContent = gettext('Show');
NadiaNadiaNadia h2.appendChild(document.createTextNode(' ('));
NadiaNadiaNadia h2.appendChild(link);
NadiaNadiaNadia h2.appendChild(document.createTextNode(')'));
NadiaNadia  }
Nadia   }
Nadia   // Add toggle to hide/show anchor tag
Nadia   var toggleFunc = function(ev) {
NadiaNadia  if (ev.target.matches('.collapse-toggle')) {
NadiaNadiaNadia ev.preventDefault();
NadiaNadiaNadia ev.stopPropagation();
NadiaNadiaNadia var fieldset = closestElem(ev.target, 'fieldset');
NadiaNadiaNadia if (fieldset.classList.contains('collapsed')) {
NadiaNadiaNadiaNadia// Show
NadiaNadiaNadiaNadiaev.target.textContent = gettext('Hide');
NadiaNadiaNadiaNadiafieldset.classList.remove('collapsed');
NadiaNadiaNadia } else {
NadiaNadiaNadiaNadia// Hide
NadiaNadiaNadiaNadiaev.target.textContent = gettext('Show');
NadiaNadiaNadiaNadiafieldset.classList.add('collapsed');
NadiaNadiaNadia }
NadiaNadia  }
Nadia   };
Nadia   var inlineDivs = document.querySelectorAll('fieldset.module');
Nadia   for (i = 0; i < inlineDivs.length; i++) {
NadiaNadia  inlineDivs[i].addEventListener('click', toggleFunc);
Nadia   }
    });
})();
