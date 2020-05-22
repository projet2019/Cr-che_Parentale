jQuery(document).ready(function($) {
  "use strict";

  //Contact
  $('form.contactForm').submit(function() {
    var f = $(this).find('.form-group'),
Nadia ferror = false,
Nadia emailExp = /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i;

    f.children('input').each(function() { // run all inputs

Nadia var i = $(this); // current input
Nadia var rule = i.attr('data-rule');

Nadia if (rule !== undefined) {
Nadia   var ierror = false; // error flag for current input
Nadia   var pos = rule.indexOf(':', 0);
Nadia   if (pos >= 0) {
NadiaNadiavar exp = rule.substr(pos + 1, rule.length);
NadiaNadiarule = rule.substr(0, pos);
Nadia   } else {
NadiaNadiarule = rule.substr(pos + 1, rule.length);
Nadia   }

Nadia   switch (rule) {
NadiaNadiacase 'required':
NadiaNadia  if (i.val() === '') {
NadiaNadia    ferror = ierror = true;
NadiaNadia  }
NadiaNadia  break;

NadiaNadiacase 'minlen':
NadiaNadia  if (i.val().length < parseInt(exp)) {
NadiaNadia    ferror = ierror = true;
NadiaNadia  }
NadiaNadia  break;

NadiaNadiacase 'email':
NadiaNadia  if (!emailExp.test(i.val())) {
NadiaNadia    ferror = ierror = true;
NadiaNadia  }
NadiaNadia  break;

NadiaNadiacase 'checked':
NadiaNadia  if (! i.is(':checked')) {
NadiaNadia    ferror = ierror = true;
NadiaNadia  }
NadiaNadia  break;

NadiaNadiacase 'regexp':
NadiaNadia  exp = new RegExp(exp);
NadiaNadia  if (!exp.test(i.val())) {
NadiaNadia    ferror = ierror = true;
NadiaNadia  }
NadiaNadia  break;
Nadia   }
Nadia   i.next('.validation').html((ierror ? (i.attr('data-msg') !== undefined ? i.attr('data-msg') : 'wrong Input') : '')).show('blind');
Nadia }
    });
    f.children('textarea').each(function() { // run all inputs

Nadia var i = $(this); // current input
Nadia var rule = i.attr('data-rule');

Nadia if (rule !== undefined) {
Nadia   var ierror = false; // error flag for current input
Nadia   var pos = rule.indexOf(':', 0);
Nadia   if (pos >= 0) {
NadiaNadiavar exp = rule.substr(pos + 1, rule.length);
NadiaNadiarule = rule.substr(0, pos);
Nadia   } else {
NadiaNadiarule = rule.substr(pos + 1, rule.length);
Nadia   }

Nadia   switch (rule) {
NadiaNadiacase 'required':
NadiaNadia  if (i.val() === '') {
NadiaNadia    ferror = ierror = true;
NadiaNadia  }
NadiaNadia  break;

NadiaNadiacase 'minlen':
NadiaNadia  if (i.val().length < parseInt(exp)) {
NadiaNadia    ferror = ierror = true;
NadiaNadia  }
NadiaNadia  break;
Nadia   }
Nadia   i.next('.validation').html((ierror ? (i.attr('data-msg') != undefined ? i.attr('data-msg') : 'wrong Input') : '')).show('blind');
Nadia }
    });
    if (ferror) return false;
    else var str = $(this).serialize();
    var action = $(this).attr('action');
    if( ! action ) {
Nadia action = 'contactform/contactform.php';
    }
    $.ajax({
Nadia type: "POST",
Nadia url: action,
Nadia data: str,
Nadia success: function(msg) {
Nadia   // alert(msg);
Nadia   if (msg == 'OK') {
NadiaNadia$("#sendmessage").addClass("show");
NadiaNadia$("#errormessage").removeClass("show");
NadiaNadia$('.contactForm').find("input, textarea").val("");
Nadia   } else {
NadiaNadia$("#sendmessage").removeClass("show");
NadiaNadia$("#errormessage").addClass("show");
NadiaNadia$('#errormessage').html(msg);
Nadia   }

Nadia }
    });
    return false;
  });

});
