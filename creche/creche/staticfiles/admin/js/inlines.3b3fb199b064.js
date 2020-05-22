/*global DateTimeShortcuts, SelectFilter*/
/**
 * Django admin inlines
 *
 * Based on jQuery Formset 1.1
 * @author Stanislaus Madueke (stan DOT madueke AT gmail DOT com)
 * @requires jQuery 1.2.6 or later
 *
 * Copyright (c) 2009, Stanislaus Madueke
 * All rights reserved.
 *
 * Spiced up with Code from Zain Memon's GSoC project 2009
 * and modified for Django by Jannis Leidel, Travis Swicegood and Julien Phalip.
 *
 * Licensed under the New BSD License
 * See: https://opensource.org/licenses/bsd-license.php
 */
(function($) {
    'use strict';
    $.fn.formset = function(opts) {
Nadia   var options = $.extend({}, $.fn.formset.defaults, opts);
Nadia   var $this = $(this);
Nadia   var $parent = $this.parent();
Nadia   var updateElementIndex = function(el, prefix, ndx) {
NadiaNadia  var id_regex = new RegExp("(" + prefix + "-(\\d+|__prefix__))");
NadiaNadia  var replacement = prefix + "-" + ndx;
NadiaNadia  if ($(el).prop("for")) {
NadiaNadiaNadia $(el).prop("for", $(el).prop("for").replace(id_regex, replacement));
NadiaNadia  }
NadiaNadia  if (el.id) {
NadiaNadiaNadia el.id = el.id.replace(id_regex, replacement);
NadiaNadia  }
NadiaNadia  if (el.name) {
NadiaNadiaNadia el.name = el.name.replace(id_regex, replacement);
NadiaNadia  }
Nadia   };
Nadia   var totalForms = $("#id_" + options.prefix + "-TOTAL_FORMS").prop("autocomplete", "off");
Nadia   var nextIndex = parseInt(totalForms.val(), 10);
Nadia   var maxForms = $("#id_" + options.prefix + "-MAX_NUM_FORMS").prop("autocomplete", "off");
Nadia   // only show the add button if we are allowed to add more items,
Nadia   // note that max_num = None translates to a blank string.
Nadia   var showAddButton = maxForms.val() === '' || (maxForms.val() - totalForms.val()) > 0;
Nadia   $this.each(function(i) {
NadiaNadia  $(this).not("." + options.emptyCssClass).addClass(options.formCssClass);
Nadia   });
Nadia   if ($this.length && showAddButton) {
NadiaNadia  var addButton = options.addButton;
NadiaNadia  if (addButton === null) {
NadiaNadiaNadia if ($this.prop("tagName") === "TR") {
NadiaNadiaNadiaNadia// If forms are laid out as table rows, insert the
NadiaNadiaNadiaNadia// "add" button in a new table row:
NadiaNadiaNadiaNadiavar numCols = this.eq(-1).children().length;
NadiaNadiaNadiaNadia$parent.append('<tr class="' + options.addCssClass + '"><td colspan="' + numCols + '"><a href="#">' + options.addText + "</a></tr>");
NadiaNadiaNadiaNadiaaddButton = $parent.find("tr:last a");
NadiaNadiaNadia } else {
NadiaNadiaNadiaNadia// Otherwise, insert it immediately after the last form:
NadiaNadiaNadiaNadia$this.filter(":last").after('<div class="' + options.addCssClass + '"><a href="#">' + options.addText + "</a></div>");
NadiaNadiaNadiaNadiaaddButton = $this.filter(":last").next().find("a");
NadiaNadiaNadia }
NadiaNadia  }
NadiaNadia  addButton.on('click', function(e) {
NadiaNadiaNadia e.preventDefault();
NadiaNadiaNadia var template = $("#" + options.prefix + "-empty");
NadiaNadiaNadia var row = template.clone(true);
NadiaNadiaNadia row.removeClass(options.emptyCssClass)
NadiaNadiaNadia .addClass(options.formCssClass)
NadiaNadiaNadia .attr("id", options.prefix + "-" + nextIndex);
NadiaNadiaNadia if (row.is("tr")) {
NadiaNadiaNadiaNadia// If the forms are laid out in table rows, insert
NadiaNadiaNadiaNadia// the remove button into the last table cell:
NadiaNadiaNadiaNadiarow.children(":last").append('<div><a class="' + options.deleteCssClass + '" href="#">' + options.deleteText + "</a></div>");
NadiaNadiaNadia } else if (row.is("ul") || row.is("ol")) {
NadiaNadiaNadiaNadia// If they're laid out as an ordered/unordered list,
NadiaNadiaNadiaNadia// insert an <li> after the last list item:
NadiaNadiaNadiaNadiarow.append('<li><a class="' + options.deleteCssClass + '" href="#">' + options.deleteText + "</a></li>");
NadiaNadiaNadia } else {
NadiaNadiaNadiaNadia// Otherwise, just insert the remove button as the
NadiaNadiaNadiaNadia// last child element of the form's container:
NadiaNadiaNadiaNadiarow.children(":first").append('<span><a class="' + options.deleteCssClass + '" href="#">' + options.deleteText + "</a></span>");
NadiaNadiaNadia }
NadiaNadiaNadia row.find("*").each(function() {
NadiaNadiaNadiaNadiaupdateElementIndex(this, options.prefix, totalForms.val());
NadiaNadiaNadia });
NadiaNadiaNadia // Insert the new form when it has been fully edited
NadiaNadiaNadia row.insertBefore($(template));
NadiaNadiaNadia // Update number of total forms
NadiaNadiaNadia $(totalForms).val(parseInt(totalForms.val(), 10) + 1);
NadiaNadiaNadia nextIndex += 1;
NadiaNadiaNadia // Hide add button in case we've hit the max, except we want to add infinitely
NadiaNadiaNadia if ((maxForms.val() !== '') && (maxForms.val() - totalForms.val()) <= 0) {
NadiaNadiaNadiaNadiaaddButton.parent().hide();
NadiaNadiaNadia }
NadiaNadiaNadia // The delete button of each row triggers a bunch of other things
NadiaNadiaNadia row.find("a." + options.deleteCssClass).on('click', function(e1) {
NadiaNadiaNadiaNadiae1.preventDefault();
NadiaNadiaNadiaNadia// Remove the parent form containing this button:
NadiaNadiaNadiaNadiarow.remove();
NadiaNadiaNadiaNadianextIndex -= 1;
NadiaNadiaNadiaNadia// If a post-delete callback was provided, call it with the deleted form:
NadiaNadiaNadiaNadiaif (options.removed) {
NadiaNadiaNadiaNadia    options.removed(row);
NadiaNadiaNadiaNadia}
NadiaNadiaNadiaNadia$(document).trigger('formset:removed', [row, options.prefix]);
NadiaNadiaNadiaNadia// Update the TOTAL_FORMS form count.
NadiaNadiaNadiaNadiavar forms = $("." + options.formCssClass);
NadiaNadiaNadiaNadia$("#id_" + options.prefix + "-TOTAL_FORMS").val(forms.length);
NadiaNadiaNadiaNadia// Show add button again once we drop below max
NadiaNadiaNadiaNadiaif ((maxForms.val() === '') || (maxForms.val() - forms.length) > 0) {
NadiaNadiaNadiaNadia    addButton.parent().show();
NadiaNadiaNadiaNadia}
NadiaNadiaNadiaNadia// Also, update names and ids for all remaining form controls
NadiaNadiaNadiaNadia// so they remain in sequence:
NadiaNadiaNadiaNadiavar i, formCount;
NadiaNadiaNadiaNadiavar updateElementCallback = function() {
NadiaNadiaNadiaNadia    updateElementIndex(this, options.prefix, i);
NadiaNadiaNadiaNadia};
NadiaNadiaNadiaNadiafor (i = 0, formCount = forms.length; i < formCount; i++) {
NadiaNadiaNadiaNadia    updateElementIndex($(forms).get(i), options.prefix, i);
NadiaNadiaNadiaNadia    $(forms.get(i)).find("*").each(updateElementCallback);
NadiaNadiaNadiaNadia}
NadiaNadiaNadia });
NadiaNadiaNadia // If a post-add callback was supplied, call it with the added form:
NadiaNadiaNadia if (options.added) {
NadiaNadiaNadiaNadiaoptions.added(row);
NadiaNadiaNadia }
NadiaNadiaNadia $(document).trigger('formset:added', [row, options.prefix]);
NadiaNadia  });
Nadia   }
Nadia   return this;
    };

    /* Setup plugin defaults */
    $.fn.formset.defaults = {
Nadia   prefix: "form",NadiaNadia// The form prefix for your django formset
Nadia   addText: "add another",Nadia // Text for the add link
Nadia   deleteText: "remove",Nadia // Text for the delete link
Nadia   addCssClass: "add-row",Nadia // CSS class applied to the add link
Nadia   deleteCssClass: "delete-row",  // CSS class applied to the delete link
Nadia   emptyCssClass: "empty-row",    // CSS class applied to the empty row
Nadia   formCssClass: "dynamic-form",  // CSS class applied to each form in a formset
Nadia   added: null,NadiaNadia// Function called each time a new form is added
Nadia   removed: null,NadiaNadia// Function called each time a form is deleted
Nadia   addButton: nullNadia  // Existing add button to use
    };


    // Tabular inlines ---------------------------------------------------------
    $.fn.tabularFormset = function(selector, options) {
Nadia   var $rows = $(this);
Nadia   var alternatingRows = function(row) {
NadiaNadia  $(selector).not(".add-row").removeClass("row1 row2")
NadiaNadia  .filter(":even").addClass("row1").end()
NadiaNadia  .filter(":odd").addClass("row2");
Nadia   };

Nadia   var reinitDateTimeShortCuts = function() {
NadiaNadia  // Reinitialize the calendar and clock widgets by force
NadiaNadia  if (typeof DateTimeShortcuts !== "undefined") {
NadiaNadiaNadia $(".datetimeshortcuts").remove();
NadiaNadiaNadia DateTimeShortcuts.init();
NadiaNadia  }
Nadia   };

Nadia   var updateSelectFilter = function() {
NadiaNadia  // If any SelectFilter widgets are a part of the new form,
NadiaNadia  // instantiate a new SelectFilter instance for it.
NadiaNadia  if (typeof SelectFilter !== 'undefined') {
NadiaNadiaNadia $('.selectfilter').each(function(index, value) {
NadiaNadiaNadiaNadiavar namearr = value.name.split('-');
NadiaNadiaNadiaNadiaSelectFilter.init(value.id, namearr[namearr.length - 1], false);
NadiaNadiaNadia });
NadiaNadiaNadia $('.selectfilterstacked').each(function(index, value) {
NadiaNadiaNadiaNadiavar namearr = value.name.split('-');
NadiaNadiaNadiaNadiaSelectFilter.init(value.id, namearr[namearr.length - 1], true);
NadiaNadiaNadia });
NadiaNadia  }
Nadia   };

Nadia   var initPrepopulatedFields = function(row) {
NadiaNadia  row.find('.prepopulated_field').each(function() {
NadiaNadiaNadia var field = $(this),
NadiaNadiaNadiaNadiainput = field.find('input, select, textarea'),
NadiaNadiaNadiaNadiadependency_list = input.data('dependency_list') || [],
NadiaNadiaNadiaNadiadependencies = [];
NadiaNadiaNadia $.each(dependency_list, function(i, field_name) {
NadiaNadiaNadiaNadiadependencies.push('#' + row.find('.field-' + field_name).find('input, select, textarea').attr('id'));
NadiaNadiaNadia });
NadiaNadiaNadia if (dependencies.length) {
NadiaNadiaNadiaNadiainput.prepopulate(dependencies, input.attr('maxlength'));
NadiaNadiaNadia }
NadiaNadia  });
Nadia   };

Nadia   $rows.formset({
NadiaNadia  prefix: options.prefix,
NadiaNadia  addText: options.addText,
NadiaNadia  formCssClass: "dynamic-" + options.prefix,
NadiaNadia  deleteCssClass: "inline-deletelink",
NadiaNadia  deleteText: options.deleteText,
NadiaNadia  emptyCssClass: "empty-form",
NadiaNadia  removed: alternatingRows,
NadiaNadia  added: function(row) {
NadiaNadiaNadia initPrepopulatedFields(row);
NadiaNadiaNadia reinitDateTimeShortCuts();
NadiaNadiaNadia updateSelectFilter();
NadiaNadiaNadia alternatingRows(row);
NadiaNadia  },
NadiaNadia  addButton: options.addButton
Nadia   });

Nadia   return $rows;
    };

    // Stacked inlines ---------------------------------------------------------
    $.fn.stackedFormset = function(selector, options) {
Nadia   var $rows = $(this);
Nadia   var updateInlineLabel = function(row) {
NadiaNadia  $(selector).find(".inline_label").each(function(i) {
NadiaNadiaNadia var count = i + 1;
NadiaNadiaNadia $(this).html($(this).html().replace(/(#\d+)/g, "#" + count));
NadiaNadia  });
Nadia   };

Nadia   var reinitDateTimeShortCuts = function() {
NadiaNadia  // Reinitialize the calendar and clock widgets by force, yuck.
NadiaNadia  if (typeof DateTimeShortcuts !== "undefined") {
NadiaNadiaNadia $(".datetimeshortcuts").remove();
NadiaNadiaNadia DateTimeShortcuts.init();
NadiaNadia  }
Nadia   };

Nadia   var updateSelectFilter = function() {
NadiaNadia  // If any SelectFilter widgets were added, instantiate a new instance.
NadiaNadia  if (typeof SelectFilter !== "undefined") {
NadiaNadiaNadia $(".selectfilter").each(function(index, value) {
NadiaNadiaNadiaNadiavar namearr = value.name.split('-');
NadiaNadiaNadiaNadiaSelectFilter.init(value.id, namearr[namearr.length - 1], false);
NadiaNadiaNadia });
NadiaNadiaNadia $(".selectfilterstacked").each(function(index, value) {
NadiaNadiaNadiaNadiavar namearr = value.name.split('-');
NadiaNadiaNadiaNadiaSelectFilter.init(value.id, namearr[namearr.length - 1], true);
NadiaNadiaNadia });
NadiaNadia  }
Nadia   };

Nadia   var initPrepopulatedFields = function(row) {
NadiaNadia  row.find('.prepopulated_field').each(function() {
NadiaNadiaNadia var field = $(this),
NadiaNadiaNadiaNadiainput = field.find('input, select, textarea'),
NadiaNadiaNadiaNadiadependency_list = input.data('dependency_list') || [],
NadiaNadiaNadiaNadiadependencies = [];
NadiaNadiaNadia $.each(dependency_list, function(i, field_name) {
NadiaNadiaNadiaNadiadependencies.push('#' + row.find('.form-row .field-' + field_name).find('input, select, textarea').attr('id'));
NadiaNadiaNadia });
NadiaNadiaNadia if (dependencies.length) {
NadiaNadiaNadiaNadiainput.prepopulate(dependencies, input.attr('maxlength'));
NadiaNadiaNadia }
NadiaNadia  });
Nadia   };

Nadia   $rows.formset({
NadiaNadia  prefix: options.prefix,
NadiaNadia  addText: options.addText,
NadiaNadia  formCssClass: "dynamic-" + options.prefix,
NadiaNadia  deleteCssClass: "inline-deletelink",
NadiaNadia  deleteText: options.deleteText,
NadiaNadia  emptyCssClass: "empty-form",
NadiaNadia  removed: updateInlineLabel,
NadiaNadia  added: function(row) {
NadiaNadiaNadia initPrepopulatedFields(row);
NadiaNadiaNadia reinitDateTimeShortCuts();
NadiaNadiaNadia updateSelectFilter();
NadiaNadiaNadia updateInlineLabel(row);
NadiaNadia  },
NadiaNadia  addButton: options.addButton
Nadia   });

Nadia   return $rows;
    };

    $(document).ready(function() {
Nadia   $(".js-inline-admin-formset").each(function() {
NadiaNadia  var data = $(this).data(),
NadiaNadiaNadia inlineOptions = data.inlineFormset,
NadiaNadiaNadia selector;
NadiaNadia  switch(data.inlineType) {
NadiaNadia  case "stacked":
NadiaNadiaNadia selector = inlineOptions.name + "-group .inline-related";
NadiaNadiaNadia $(selector).stackedFormset(selector, inlineOptions.options);
NadiaNadiaNadia break;
NadiaNadia  case "tabular":
NadiaNadiaNadia selector = inlineOptions.name + "-group .tabular.inline-related tbody:first > tr";
NadiaNadiaNadia $(selector).tabularFormset(selector, inlineOptions.options);
NadiaNadiaNadia break;
NadiaNadia  }
Nadia   });
    });
})(django.jQuery);
