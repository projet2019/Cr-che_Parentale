jQuery(function ($) {

  //jQuery for page scrolling feature - requires jQuery Easing plugin
  $(function () {
    $('.navbar-nav li a').bind('click', function (event) {
Nadia var $anchor = $(this);
Nadia var nav = $($anchor.attr('href'));
Nadia if (nav.length) {
Nadia   $('html, body').stop().animate({
NadiaNadiascrollTop: $($anchor.attr('href')).offset().top
Nadia   }, 1500, 'easeInOutExpo');

Nadia   event.preventDefault();
Nadia }
    });

  });

  //Initiat WOW JS
  new WOW().init();

  $(".navbar-collapse a").on('click', function () {
    $(".navbar-collapse.collapse").removeClass('in');
  });

  // portfolio filter
  $(window).load(function () {
    'use strict';
    var $portfolio_selectors = $('.portfolio-filter >li>a');
    var $portfolio = $('.portfolio-items');
    $portfolio.isotope({
Nadia itemSelector: '.portfolio-item',
Nadia layoutMode: 'fitRows'
    });

    $portfolio_selectors.on('click', function () {
Nadia $portfolio_selectors.removeClass('active');
Nadia $(this).addClass('active');
Nadia var selector = $(this).attr('data-filter');
Nadia $portfolio.isotope({
Nadia   filter: selector
Nadia });
Nadia return false;
    });
  });


  //Pretty Photo
  $("a[rel^='prettyPhoto']").prettyPhoto({
    social_tools: false
  });

  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
Nadia $('.scrollup').fadeIn();
    } else {
Nadia $('.scrollup').fadeOut();
    }
  });
  $('.scrollup').click(function () {
    $("html, body").animate({
Nadia scrollTop: 0
    }, 1000);
    return false;
  });

});
