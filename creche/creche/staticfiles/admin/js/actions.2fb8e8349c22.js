/*global gettext, interpolate, ngettext*/
(function($) {
    'use strict';
    var lastChecked;

    $.fn.actions = function(opts) {
Nadia   var options = $.extend({}, $.fn.actions.defaults, opts);
Nadia   var actionCheckboxes = $(this);
Nadia   var list_editable_changed = false;
Nadia   var showQuestion = function() {
NadiaNadia  $(options.acrossClears).hide();
NadiaNadia  $(options.acrossQuestions).show();
NadiaNadia  $(options.allContainer).hide();
Nadia   },
Nadia   showClear = function() {
NadiaNadia  $(options.acrossClears).show();
NadiaNadia  $(options.acrossQuestions).hide();
NadiaNadia  $(options.actionContainer).toggleClass(options.selectedClass);
NadiaNadia  $(options.allContainer).show();
NadiaNadia  $(options.counterContainer).hide();
Nadia   },
Nadia   reset = function() {
NadiaNadia  $(options.acrossClears).hide();
NadiaNadia  $(options.acrossQuestions).hide();
NadiaNadia  $(options.allContainer).hide();
NadiaNadia  $(options.counterContainer).show();
Nadia   },
Nadia   clearAcross = function() {
NadiaNadia  reset();
NadiaNadia  $(options.acrossInput).val(0);
NadiaNadia  $(options.actionContainer).removeClass(options.selectedClass);
Nadia   },
Nadia   checker = function(checked) {
NadiaNadia  if (checked) {
NadiaNadiaNadia showQuestion();
NadiaNadia  } else {
NadiaNadiaNadia reset();
NadiaNadia  }
NadiaNadia  $(actionCheckboxes).prop("checked", checked)
NadiaNadiaNadia .parent().parent().toggleClass(options.selectedClass, checked);
Nadia   },
Nadia   updateCounter = function() {
NadiaNadia  var sel = $(actionCheckboxes).filter(":checked").length;
NadiaNadia  // data-actions-icnt is defined in the generated HTML
NadiaNadia  // and contains the total amount of objects in the queryset
NadiaNadia  var actions_icnt = $('.action-counter').data('actionsIcnt');
NadiaNadia  $(options.counterContainer).html(interpolate(
NadiaNadia  ngettext('%(sel)s of %(cnt)s selected', '%(sel)s of %(cnt)s selected', sel), {
NadiaNadiaNadia sel: sel,
NadiaNadiaNadia cnt: actions_icnt
NadiaNadia  }, true));
NadiaNadia  $(options.allToggle).prop("checked", function() {
NadiaNadiaNadia var value;
NadiaNadiaNadia if (sel === actionCheckboxes.length) {
NadiaNadiaNadiaNadiavalue = true;
NadiaNadiaNadiaNadiashowQuestion();
NadiaNadiaNadia } else {
NadiaNadiaNadiaNadiavalue = false;
NadiaNadiaNadiaNadiaclearAcross();
NadiaNadiaNadia }
NadiaNadiaNadia return value;
NadiaNadia  });
Nadia   };
Nadia   // Show counter by default
Nadia   $(options.counterContainer).show();
Nadia   // Check state of checkboxes and reinit state if needed
Nadia   $(this).filter(":checked").each(function(i) {
NadiaNadia  $(this).parent().parent().toggleClass(options.selectedClass);
NadiaNadia  updateCounter();
NadiaNadia  if ($(options.acrossInput).val() === 1) {
NadiaNadiaNadia showClear();
NadiaNadia  }
Nadia   });
Nadia   $(options.allToggle).show().on('click', function() {
NadiaNadia  checker($(this).prop("checked"));
NadiaNadia  updateCounter();
Nadia   });
Nadia   $("a", options.acrossQuestions).on('click', function(event) {
NadiaNadia  event.preventDefault();
NadiaNadia  $(options.acrossInput).val(1);
NadiaNadia  showClear();
Nadia   });
Nadia   $("a", options.acrossClears).on('click', function(event) {
NadiaNadia  event.preventDefault();
NadiaNadia  $(options.allToggle).prop("checked", false);
NadiaNadia  clearAcross();
NadiaNadia  checker(0);
NadiaNadia  updateCounter();
Nadia   });
Nadia   lastChecked = null;
Nadia   $(actionCheckboxes).on('click', function(event) {
NadiaNadia  if (!event) { event = window.event; }
NadiaNadia  var target = event.target ? event.target : event.srcElement;
NadiaNadia  if (lastChecked && $.data(lastChecked) !== $.data(target) && event.shiftKey === true) {
NadiaNadiaNadia var inrange = false;
NadiaNadiaNadia $(lastChecked).prop("checked", target.checked)
NadiaNadiaNadiaNadia.parent().parent().toggleClass(options.selectedClass, target.checked);
NadiaNadiaNadia $(actionCheckboxes).each(function() {
NadiaNadiaNadiaNadiaif ($.data(this) === $.data(lastChecked) || $.data(this) === $.data(target)) {
NadiaNadiaNadiaNadia    inrange = (inrange) ? false : true;
NadiaNadiaNadiaNadia}
NadiaNadiaNadiaNadiaif (inrange) {
NadiaNadiaNadiaNadia    $(this).prop("checked", target.checked)
NadiaNadiaNadiaNadiaNadia   .parent().parent().toggleClass(options.selectedClass, target.checked);
NadiaNadiaNadiaNadia}
NadiaNadiaNadia });
NadiaNadia  }
NadiaNadia  $(target).parent().parent().toggleClass(options.selectedClass, target.checked);
NadiaNadia  lastChecked = target;
NadiaNadia  updateCounter();
Nadia   });
Nadia   $('form#changelist-form table#result_list tr').on('change', 'td:gt(0) :input', function() {
NadiaNadia  list_editable_changed = true;
Nadia   });
Nadia   $('form#changelist-form button[name="index"]').on('click', function(event) {
NadiaNadia  if (list_editable_changed) {
NadiaNadiaNadia return confirm(gettext("You have unsaved changes on individual editable fields. If you run an action, your unsaved changes will be lost."));
NadiaNadia  }
Nadia   });
Nadia   $('form#changelist-form input[name="_save"]').on('click', function(event) {
NadiaNadia  var action_changed = false;
NadiaNadia  $('select option:selected', options.actionContainer).each(function() {
NadiaNadiaNadia if ($(this).val()) {
NadiaNadiaNadiaNadiaaction_changed = true;
NadiaNadiaNadia }
NadiaNadia  });
NadiaNadia  if (action_changed) {
NadiaNadiaNadia if (list_editable_changed) {
NadiaNadiaNadiaNadiareturn confirm(gettext("You have selected an action, but you haven't saved your changes to individual fields yet. Please click OK to save. You'll need to re-run the action."));
NadiaNadiaNadia } else {
NadiaNadiaNadiaNadiareturn confirm(gettext("You have selected an action, and you haven't made any changes on individual fields. You're probably looking for the Go button rather than the Save button."));
NadiaNadiaNadia }
NadiaNadia  }
Nadia   });
    };
    /* Setup plugin defaults */
    $.fn.actions.defaults = {
Nadia   actionContainer: "div.actions",
Nadia   counterContainer: "span.action-counter",
Nadia   allContainer: "div.actions span.all",
Nadia   acrossInput: "div.actions input.select-across",
Nadia   acrossQuestions: "div.actions span.question",
Nadia   acrossClears: "div.actions span.clear",
Nadia   allToggle: "#action-toggle",
Nadia   selectedClass: "selected"
    };
    $(document).ready(function() {
Nadia   var $actionsEls = $('tr input.action-select');
Nadia   if ($actionsEls.length > 0) {
NadiaNadia  $actionsEls.actions();
Nadia   }
    });
})(django.jQuery);
