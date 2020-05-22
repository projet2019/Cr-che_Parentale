/*!
 * Bootstrap v3.3.0 (http://getbootstrap.com)
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery')
}

+function ($) {
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1)) {
    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher')
  }
}(jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.3.0
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
Nadia WebkitTransition : 'webkitTransitionEnd',
Nadia MozTransition    : 'transitionend',
Nadia OTransitionNadia : 'oTransitionEnd otransitionend',
Nadia transitionNadia  : 'transitionend'
    }

    for (var name in transEndEventNames) {
Nadia if (el.style[name] !== undefined) {
Nadia   return { end: transEndEventNames[name] }
Nadia }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
Nadia bindType: $.support.transition.end,
Nadia delegateType: $.support.transition.end,
Nadia handle: function (e) {
Nadia   if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
Nadia }
    }
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.3.0
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.3.0'

  Alert.TRANSITION_DURATION = 150

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
Nadia selector = $this.attr('href')
Nadia selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
Nadia $parent = $this.closest('.alert')
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
Nadia // detach from parent, fire event then clean up data
Nadia $parent.detach().trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
Nadia $parent
Nadia   .one('bsTransitionEnd', removeElement)
Nadia   .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
Nadia removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
Nadia var $this = $(this)
Nadia var data  = $this.data('bs.alert')

Nadia if (!data) $this.data('bs.alert', (data = new Alert(this)))
Nadia if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.alertNadiaNadia   = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.3.0
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.3.0'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
Nadia $el[val](data[state] == null ? this.options[state] : data[state])

Nadia if (state == 'loadingText') {
Nadia   this.isLoading = true
Nadia   $el.addClass(d).attr(d, d)
Nadia } else if (this.isLoading) {
Nadia   this.isLoading = false
Nadia   $el.removeClass(d).removeAttr(d)
Nadia }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
Nadia var $input = this.$element.find('input')
Nadia if ($input.prop('type') == 'radio') {
Nadia   if ($input.prop('checked') && this.$element.hasClass('active')) changed = false
Nadia   else $parent.find('.active').removeClass('active')
Nadia }
Nadia if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change')
    } else {
Nadia this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
    }

    if (changed) this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
Nadia var $this   = $(this)
Nadia var data    = $this.data('bs.button')
Nadia var options = typeof option == 'object' && option

Nadia if (!data) $this.data('bs.button', (data = new Button(this, options)))

Nadia if (option == 'toggle') data.toggle()
Nadia else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.buttonNadiaNadia   = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document)
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
Nadia var $btn = $(e.target)
Nadia if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
Nadia Plugin.call($btn, 'toggle')
Nadia e.preventDefault()
    })
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
Nadia $(e.target).closest('.btn').toggleClass('focus', e.type == 'focus')
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.3.0
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.optionsNadia= options
    this.pausedNadia =
    this.slidingNadia=
    this.interval    =
    this.$activeNadia=
    this.$itemsNadia = null

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
Nadia .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
Nadia .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
  }

  Carousel.VERSION  = '3.3.0'

  Carousel.TRANSITION_DURATION = 600

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  }

  Carousel.prototype.keydown = function (e) {
    switch (e.which) {
Nadia case 37: this.prev(); break
Nadia case 39: this.next(); break
Nadia default: return
    }

    e.preventDefault()
  }

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
Nadia && !this.paused
Nadia && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var delta = direction == 'prev' ? -1 : 1
    var activeIndex = this.getItemIndex(active)
    var itemIndex = (activeIndex + delta) % this.$items.length
    return this.$items.eq(itemIndex)
  }

  Carousel.prototype.to = function (pos) {
    var thatNadia   = this
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)Nadia  return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
Nadia this.$element.trigger($.support.transition.end)
Nadia this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $nextNadia= next || this.getItemForDirection(type, $active)
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var thatNadia = this

    if (!$next.length) {
Nadia if (!this.options.wrap) return
Nadia $next = this.$element.find('.item')[fallback]()
    }

    if ($next.hasClass('active')) return (this.sliding = false)

    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.carousel', {
Nadia relatedTarget: relatedTarget,
Nadia direction: direction
    })
    this.$element.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
Nadia this.$indicators.find('.active').removeClass('active')
Nadia var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
Nadia $nextIndicator && $nextIndicator.addClass('active')
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
Nadia $next.addClass(type)
Nadia $next[0].offsetWidth // force reflow
Nadia $active.addClass(direction)
Nadia $next.addClass(direction)
Nadia $active
Nadia   .one('bsTransitionEnd', function () {
NadiaNadia$next.removeClass([type, direction].join(' ')).addClass('active')
NadiaNadia$active.removeClass(['active', direction].join(' '))
NadiaNadiathat.sliding = false
NadiaNadiasetTimeout(function () {
NadiaNadia  that.$element.trigger(slidEvent)
NadiaNadia}, 0)
Nadia   })
Nadia   .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
    } else {
Nadia $active.removeClass('active')
Nadia $next.addClass('active')
Nadia this.sliding = false
Nadia this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
Nadia var $this   = $(this)
Nadia var data    = $this.data('bs.carousel')
Nadia var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
Nadia var action  = typeof option == 'string' ? option : options.slide

Nadia if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
Nadia if (typeof option == 'number') data.to(option)
Nadia else if (action) data[action]()
Nadia else if (options.interval) data.pause().cycle()
    })
  }

  var old = $.fn.carousel

  $.fn.carouselNadiaNadia   = Plugin
  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  var clickHandler = function (e) {
    var href
    var $this   = $(this)
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('carousel')) return
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    Plugin.call($target, options)

    if (slideIndex) {
Nadia $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  }

  $(document)
    .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
    .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
Nadia var $carousel = $(this)
Nadia Plugin.call($carousel, $carousel.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.3.0
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$elementNadia = $(element)
    this.optionsNadia  = $.extend({}, Collapse.DEFAULTS, options)
    this.$triggerNadia = $(this.options.trigger).filter('[href="#' + element.id + '"], [data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
Nadia this.$parent = this.getParent()
    } else {
Nadia this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.3.0'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true,
    trigger: '[data-toggle="collapse"]'
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    var actives = this.$parent && this.$parent.find('> .panel').children('.in, .collapsing')

    if (actives && actives.length) {
Nadia activesData = actives.data('bs.collapse')
Nadia if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
Nadia Plugin.call(actives, 'hide')
Nadia activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
Nadia .removeClass('collapse')
Nadia .addClass('collapsing')[dimension](0)
Nadia .attr('aria-expanded', true)

    this.$trigger
Nadia .removeClass('collapsed')
Nadia .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
Nadia this.$element
Nadia   .removeClass('collapsing')
Nadia   .addClass('collapse in')[dimension]('')
Nadia this.transitioning = 0
Nadia this.$element
Nadia   .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
Nadia .one('bsTransitionEnd', $.proxy(complete, this))
Nadia .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
Nadia .addClass('collapsing')
Nadia .removeClass('collapse in')
Nadia .attr('aria-expanded', false)

    this.$trigger
Nadia .addClass('collapsed')
Nadia .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
Nadia this.transitioning = 0
Nadia this.$element
Nadia   .removeClass('collapsing')
Nadia   .addClass('collapse')
Nadia   .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
Nadia [dimension](0)
Nadia .one('bsTransitionEnd', $.proxy(complete, this))
Nadia .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
Nadia .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
Nadia .each($.proxy(function (i, element) {
Nadia   var $element = $(element)
Nadia   this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
Nadia }, this))
Nadia .end()
  }

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    $element.attr('aria-expanded', isOpen)
    $trigger
Nadia .toggleClass('collapsed', !isOpen)
Nadia .attr('aria-expanded', isOpen)
  }

  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
Nadia || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
Nadia var $this   = $(this)
Nadia var data    = $this.data('bs.collapse')
Nadia var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

Nadia if (!data && options.toggle && option == 'show') options.toggle = false
Nadia if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
Nadia if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapseNadiaNadia   = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = getTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $.extend({}, $this.data(), { trigger: this })

    Plugin.call($target, option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.0
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.0'

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
Nadia if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
Nadia   // if mobile we use a backdrop because click events don't delegate
Nadia   $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
Nadia }

Nadia var relatedTarget = { relatedTarget: this }
Nadia $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

Nadia if (e.isDefaultPrevented()) return

Nadia $this
Nadia   .trigger('focus')
Nadia   .attr('aria-expanded', 'true')

Nadia $parent
Nadia   .toggleClass('open')
Nadia   .trigger('shown.bs.dropdown', relatedTarget)
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if ((!isActive && e.which != 27) || (isActive && e.which == 27)) {
Nadia if (e.which == 27) $parent.find(toggle).trigger('focus')
Nadia return $this.trigger('click')
    }

    var desc = ' li:not(.divider):visible a'
    var $items = $parent.find('[role="menu"]' + desc + ', [role="listbox"]' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)NadiaNadiaNadia  index--NadiaNadiaNadiaNadia    // up
    if (e.which == 40 && index < $items.length - 1) index++NadiaNadiaNadiaNadia    // down
    if (!~index)NadiaNadiaNadiaNadiaNadiaNadiaNadia   index = 0

    $items.eq(index).trigger('focus')
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
Nadia var $thisNadia    = $(this)
Nadia var $parentNadia  = getParent($this)
Nadia var relatedTarget = { relatedTarget: this }

Nadia if (!$parent.hasClass('open')) return

Nadia $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

Nadia if (e.isDefaultPrevented()) return

Nadia $this.attr('aria-expanded', 'false')
Nadia $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget)
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
Nadia selector = $this.attr('href')
Nadia selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
Nadia var $this = $(this)
Nadia var data  = $this.data('bs.dropdown')

Nadia if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
Nadia if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdownNadiaNadia   = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '[role="menu"]', Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '[role="listbox"]', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.3.0
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.optionsNadia   = options
    this.$bodyNadiaNadia= $(document.body)
    this.$elementNadia  = $(element)
    this.$backdropNadia =
    this.isShownNadia   = null
    this.scrollbarWidth = 0

    if (this.options.remote) {
Nadia this.$element
Nadia   .find('.modal-content')
Nadia   .load(this.options.remote, $.proxy(function () {
NadiaNadiathis.$element.trigger('loaded.bs.modal')
Nadia   }, this))
    }
  }

  Modal.VERSION  = '3.3.0'

  Modal.TRANSITION_DURATION = 300
  Modal.BACKDROP_TRANSITION_DURATION = 150

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.$body.addClass('modal-open')

    this.setScrollbar()
    this.escape()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.backdrop(function () {
Nadia var transition = $.support.transition && that.$element.hasClass('fade')

Nadia if (!that.$element.parent().length) {
Nadia   that.$element.appendTo(that.$body) // don't move modals dom position
Nadia }

Nadia that.$element
Nadia   .show()
Nadia   .scrollTop(0)

Nadia if (transition) {
Nadia   that.$element[0].offsetWidth // force reflow
Nadia }

Nadia that.$element
Nadia   .addClass('in')
Nadia   .attr('aria-hidden', false)

Nadia that.enforceFocus()

Nadia var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

Nadia transition ?
Nadia   that.$element.find('.modal-dialog') // wait for modal to slide in
NadiaNadia.one('bsTransitionEnd', function () {
NadiaNadia  that.$element.trigger('focus').trigger(e)
NadiaNadia})
NadiaNadia.emulateTransitionEnd(Modal.TRANSITION_DURATION) :
Nadia   that.$element.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()

    $(document).off('focusin.bs.modal')

    this.$element
Nadia .removeClass('in')
Nadia .attr('aria-hidden', true)
Nadia .off('click.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
Nadia this.$element
Nadia   .one('bsTransitionEnd', $.proxy(this.hideModal, this))
Nadia   .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
Nadia this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
Nadia .off('focusin.bs.modal') // guard against infinite focus loop
Nadia .on('focusin.bs.modal', $.proxy(function (e) {
Nadia   if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
NadiaNadiathis.$element.trigger('focus')
Nadia   }
Nadia }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
Nadia this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
Nadia   e.which == 27 && this.hide()
Nadia }, this))
    } else if (!this.isShown) {
Nadia this.$element.off('keydown.dismiss.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
Nadia that.$body.removeClass('modal-open')
Nadia that.resetScrollbar()
Nadia that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
Nadia var doAnimate = $.support.transition && animate

Nadia this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
Nadia   .prependTo(this.$element)
Nadia   .on('click.dismiss.bs.modal', $.proxy(function (e) {
NadiaNadiaif (e.target !== e.currentTarget) return
NadiaNadiathis.options.backdrop == 'static'
NadiaNadia  ? this.$element[0].focus.call(this.$element[0])
NadiaNadia  : this.hide.call(this)
Nadia   }, this))

Nadia if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

Nadia this.$backdrop.addClass('in')

Nadia if (!callback) return

Nadia doAnimate ?
Nadia   this.$backdrop
NadiaNadia.one('bsTransitionEnd', callback)
NadiaNadia.emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
Nadia   callback()

    } else if (!this.isShown && this.$backdrop) {
Nadia this.$backdrop.removeClass('in')

Nadia var callbackRemove = function () {
Nadia   that.removeBackdrop()
Nadia   callback && callback()
Nadia }
Nadia $.support.transition && this.$element.hasClass('fade') ?
Nadia   this.$backdrop
NadiaNadia.one('bsTransitionEnd', callbackRemove)
NadiaNadia.emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
Nadia   callbackRemove()

    } else if (callback) {
Nadia callback()
    }
  }

  Modal.prototype.checkScrollbar = function () {
    this.scrollbarWidth = this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    if (this.scrollbarWidth) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', '')
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    if (document.body.clientWidth >= window.innerWidth) return 0
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
Nadia var $this   = $(this)
Nadia var data    = $this.data('bs.modal')
Nadia var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

Nadia if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
Nadia if (typeof option == 'string') data[option](_relatedTarget)
Nadia else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = $.fn.modal

  $.fn.modalNadiaNadia   = Plugin
  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.modal', function (showEvent) {
Nadia if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
Nadia $target.one('hidden.bs.modal', function () {
Nadia   $this.is(':visible') && $this.trigger('focus')
Nadia })
    })
    Plugin.call($target, option, this)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.3.0
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.typeNadia  =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.3.0'

  Tooltip.TRANSITION_DURATION = 150

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
Nadia selector: 'body',
Nadia padding: 0
    }
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.typeNadia = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $(this.options.viewport.selector || this.options.viewport)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
Nadia var trigger = triggers[i]

Nadia if (trigger == 'click') {
Nadia   this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
Nadia } else if (trigger != 'manual') {
Nadia   var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
Nadia   var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

Nadia   this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
Nadia   this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
Nadia }
    }

    this.options.selector ?
Nadia (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
Nadia this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
Nadia options.delay = {
Nadia   show: options.delay,
Nadia   hide: options.delay
Nadia }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
Nadia if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
Nadia obj : $(obj.currentTarget).data('bs.' + this.type)

    if (self && self.$tip && self.$tip.is(':visible')) {
Nadia self.hoverState = 'in'
Nadia return
    }

    if (!self) {
Nadia self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
Nadia $(obj.currentTarget).data('bs.' + this.type, self)
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
Nadia if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
Nadia obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
Nadia self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
Nadia $(obj.currentTarget).data('bs.' + this.type, self)
    }

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
Nadia if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
Nadia this.$element.trigger(e)

Nadia var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
Nadia if (e.isDefaultPrevented() || !inDom) return
Nadia var that = this

Nadia var $tip = this.tip()

Nadia var tipId = this.getUID(this.type)

Nadia this.setContent()
Nadia $tip.attr('id', tipId)
Nadia this.$element.attr('aria-describedby', tipId)

Nadia if (this.options.animation) $tip.addClass('fade')

Nadia var placement = typeof this.options.placement == 'function' ?
Nadia   this.options.placement.call(this, $tip[0], this.$element[0]) :
Nadia   this.options.placement

Nadia var autoToken = /\s?auto?\s?/i
Nadia var autoPlace = autoToken.test(placement)
Nadia if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

Nadia $tip
Nadia   .detach()
Nadia   .css({ top: 0, left: 0, display: 'block' })
Nadia   .addClass(placement)
Nadia   .data('bs.' + this.type, this)

Nadia this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

Nadia var posNadiaNadia= this.getPosition()
Nadia var actualWidth  = $tip[0].offsetWidth
Nadia var actualHeight = $tip[0].offsetHeight

Nadia if (autoPlace) {
Nadia   var orgPlacement = placement
Nadia   var $container   = this.options.container ? $(this.options.container) : this.$element.parent()
Nadia   var containerDim = this.getPosition($container)

Nadia   placement = placement == 'bottom' && pos.bottom + actualHeight > containerDim.bottom ? 'top'    :
NadiaNadiaNadiaNadiaplacement == 'top'    && pos.top    - actualHeight < containerDim.top    ? 'bottom' :
NadiaNadiaNadiaNadiaplacement == 'right'  && pos.right  + actualWidth  > containerDim.width  ? 'left'   :
NadiaNadiaNadiaNadiaplacement == 'left'   && pos.left   - actualWidth  < containerDim.left   ? 'right'  :
NadiaNadiaNadiaNadiaplacement

Nadia   $tip
NadiaNadia.removeClass(orgPlacement)
NadiaNadia.addClass(placement)
Nadia }

Nadia var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

Nadia this.applyPlacement(calculatedOffset, placement)

Nadia var complete = function () {
Nadia   var prevHoverState = that.hoverState
Nadia   that.$element.trigger('shown.bs.' + that.type)
Nadia   that.hoverState = null

Nadia   if (prevHoverState == 'out') that.leave(that)
Nadia }

Nadia $.support.transition && this.$tip.hasClass('fade') ?
Nadia   $tip
NadiaNadia.one('bsTransitionEnd', complete)
NadiaNadia.emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
Nadia   complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
Nadia using: function (props) {
Nadia   $tip.css({
NadiaNadiatop: Math.round(props.top),
NadiaNadialeft: Math.round(props.left)
Nadia   })
Nadia }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
Nadia offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var isVerticalNadiaNadia= /top|bottom/.test(placement)
    var arrowDeltaNadiaNadia= isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, isHorizontal) {
    this.arrow()
Nadia .css(isHorizontal ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
Nadia .css(isHorizontal ? 'top' : 'left', '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function (callback) {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
Nadia if (that.hoverState != 'in') $tip.detach()
Nadia that.$element
Nadia   .removeAttr('aria-describedby')
Nadia   .trigger('hidden.bs.' + that.type)
Nadia callback && callback()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
Nadia $tip
Nadia   .one('bsTransitionEnd', complete)
Nadia   .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
Nadia complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof ($e.attr('data-original-title')) != 'string') {
Nadia $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element

    var elNadia= $element[0]
    var isBody = el.tagName == 'BODY'

    var elRect    = el.getBoundingClientRect()
    if (elRect.width == null) {
Nadia // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
Nadia elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var elOffset  = isBody ? { top: 0, left: 0 } : $element.offset()
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
NadiaNadia placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
NadiaNadia placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
Nadia   /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
Nadia var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
Nadia var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
Nadia if (topEdgeOffset < viewportDimensions.top) { // top overflow
Nadia   delta.top = viewportDimensions.top - topEdgeOffset
Nadia } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
Nadia   delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
Nadia }
    } else {
Nadia var leftEdgeOffset  = pos.left - viewportPadding
Nadia var rightEdgeOffset = pos.left + viewportPadding + actualWidth
Nadia if (leftEdgeOffset < viewportDimensions.left) { // left overflow
Nadia   delta.left = viewportDimensions.left - leftEdgeOffset
Nadia } else if (rightEdgeOffset > viewportDimensions.width) { // right overflow
Nadia   delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
Nadia }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
Nadia || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    return (this.$tip = this.$tip || $(this.options.template))
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
Nadia self = $(e.currentTarget).data('bs.' + this.type)
Nadia if (!self) {
Nadia   self = new this.constructor(e.currentTarget, this.getDelegateOptions())
Nadia   $(e.currentTarget).data('bs.' + this.type, self)
Nadia }
    }

    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    var that = this
    clearTimeout(this.timeout)
    this.hide(function () {
Nadia that.$element.off('.' + that.type).removeData('bs.' + that.type)
    })
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
Nadia var $this    = $(this)
Nadia var dataNadia= $this.data('bs.tooltip')
Nadia var options  = typeof option == 'object' && option
Nadia var selector = options && options.selector

Nadia if (!data && option == 'destroy') return
Nadia if (selector) {
Nadia   if (!data) $this.data('bs.tooltip', (data = {}))
Nadia   if (!data[selector]) data[selector] = new Tooltip(this, options)
Nadia } else {
Nadia   if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
Nadia }
Nadia if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip

  $.fn.tooltipNadiaNadia   = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.3.0
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.VERSION  = '3.3.0'

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
Nadia this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
Nadia || (typeof o.content == 'function' ?
NadiaNadia  o.content.call($e[0]) :
NadiaNadia  o.content)
  }

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  }

  Popover.prototype.tip = function () {
    if (!this.$tip) this.$tip = $(this.options.template)
    return this.$tip
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
Nadia var $this    = $(this)
Nadia var dataNadia= $this.data('bs.popover')
Nadia var options  = typeof option == 'object' && option
Nadia var selector = options && options.selector

Nadia if (!data && option == 'destroy') return
Nadia if (selector) {
Nadia   if (!data) $this.data('bs.popover', (data = {}))
Nadia   if (!data[selector]) data[selector] = new Popover(this, options)
Nadia } else {
Nadia   if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
Nadia }
Nadia if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.popover

  $.fn.popoverNadiaNadia   = Plugin
  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.0
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    var process  = $.proxy(this.process, this)

    this.$bodyNadiaNadia= $('body')
    this.$scrollElement = $(element).is('body') ? $(window) : $(element)
    this.optionsNadia   = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selectorNadia  = (this.options.target || '') + ' .nav li > a'
    this.offsetsNadia   = []
    this.targetsNadia   = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    this.$scrollElement.on('scroll.bs.scrollspy', process)
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.3.0'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var offsetMethod = 'offset'
    var offsetBase   = 0

    if (!$.isWindow(this.$scrollElement[0])) {
Nadia offsetMethod = 'position'
Nadia offsetBase   = this.$scrollElement.scrollTop()
    }

    this.offsets = []
    this.targets = []
    this.scrollHeight = this.getScrollHeight()

    var selfNadia= this

    this.$body
Nadia .find(this.selector)
Nadia .map(function () {
Nadia   var $el   = $(this)
Nadia   var href  = $el.data('target') || $el.attr('href')
Nadia   var $href = /^#./.test(href) && $(href)

Nadia   return ($href
NadiaNadia&& $href.length
NadiaNadia&& $href.is(':visible')
NadiaNadia&& [[$href[offsetMethod]().top + offsetBase, href]]) || null
Nadia })
Nadia .sort(function (a, b) { return a[0] - b[0] })
Nadia .each(function () {
Nadia   self.offsets.push(this[0])
Nadia   self.targets.push(this[1])
Nadia })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.getScrollHeight()
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
    var offsetsNadia = this.offsets
    var targetsNadia = this.targets
    var activeTarget = this.activeTarget
    var i

    if (this.scrollHeight != scrollHeight) {
Nadia this.refresh()
    }

    if (scrollTop >= maxScroll) {
Nadia return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop < offsets[0]) {
Nadia this.activeTarget = null
Nadia return this.clear()
    }

    for (i = offsets.length; i--;) {
Nadia activeTarget != targets[i]
Nadia   && scrollTop >= offsets[i]
Nadia   && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
Nadia   && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    this.clear()

    var selector = this.selector +
Nadia   '[data-target="' + target + '"],' +
Nadia   this.selector + '[href="' + target + '"]'

    var active = $(selector)
Nadia .parents('li')
Nadia .addClass('active')

    if (active.parent('.dropdown-menu').length) {
Nadia active = active
Nadia   .closest('li.dropdown')
Nadia   .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }

  ScrollSpy.prototype.clear = function () {
    $(this.selector)
Nadia .parentsUntil(this.options.target, '.active')
Nadia .removeClass('active')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
Nadia var $this   = $(this)
Nadia var data    = $this.data('bs.scrollspy')
Nadia var options = typeof option == 'object' && option

Nadia if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
Nadia if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspyNadiaNadia   = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
Nadia var $spy = $(this)
Nadia Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.3.0
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.VERSION = '3.3.0'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ulNadia = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
Nadia selector = $this.attr('href')
Nadia selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
Nadia relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
Nadia relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
Nadia $previous.trigger({
Nadia   type: 'hidden.bs.tab',
Nadia   relatedTarget: $this[0]
Nadia })
Nadia $this.trigger({
Nadia   type: 'shown.bs.tab',
Nadia   relatedTarget: $previous[0]
Nadia })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
Nadia && $.support.transition
Nadia && (($active.length && $active.hasClass('fade')) || !!container.find('> .fade').length)

    function next() {
Nadia $active
Nadia   .removeClass('active')
Nadia   .find('> .dropdown-menu > .active')
NadiaNadia.removeClass('active')
Nadia   .end()
Nadia   .find('[data-toggle="tab"]')
NadiaNadia.attr('aria-expanded', false)

Nadia element
Nadia   .addClass('active')
Nadia   .find('[data-toggle="tab"]')
NadiaNadia.attr('aria-expanded', true)

Nadia if (transition) {
Nadia   element[0].offsetWidth // reflow for transition
Nadia   element.addClass('in')
Nadia } else {
Nadia   element.removeClass('fade')
Nadia }

Nadia if (element.parent('.dropdown-menu')) {
Nadia   element
NadiaNadia.closest('li.dropdown')
NadiaNadia  .addClass('active')
NadiaNadia.end()
NadiaNadia.find('[data-toggle="tab"]')
NadiaNadia  .attr('aria-expanded', true)
Nadia }

Nadia callback && callback()
    }

    $active.length && transition ?
Nadia $active
Nadia   .one('bsTransitionEnd', next)
Nadia   .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
Nadia next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
Nadia var $this = $(this)
Nadia var data  = $this.data('bs.tab')

Nadia if (!data) $this.data('bs.tab', (data = new Tab(this)))
Nadia if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tabNadiaNadia   = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.3.0
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
Nadia .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
Nadia .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$elementNadia= $(element)
    this.affixedNadia =
    this.unpinNadia   =
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.3.0'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop()
    var positionNadia= this.$element.offset()
    var targetHeight = this.$target.height()

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

    if (this.affixed == 'bottom') {
Nadia if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
Nadia return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null
    var colliderTop    = initializing ? scrollTop : position.top
    var colliderHeight = initializing ? targetHeight : height

    if (offsetTop != null && colliderTop <= offsetTop) return 'top'
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

    return false
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var heightNadia  = this.$element.height()
    var offsetNadia  = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = $('body').height()

    if (typeof offset != 'object')Nadia    offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
Nadia if (this.unpin != null) this.$element.css('top', '')

Nadia var affixType = 'affix' + (affix ? '-' + affix : '')
Nadia var eNadia    = $.Event(affixType + '.bs.affix')

Nadia this.$element.trigger(e)

Nadia if (e.isDefaultPrevented()) return

Nadia this.affixed = affix
Nadia this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

Nadia this.$element
Nadia   .removeClass(Affix.RESET)
Nadia   .addClass(affixType)
Nadia   .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    if (affix == 'bottom') {
Nadia this.$element.offset({
Nadia   top: scrollHeight - height - offsetBottom
Nadia })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
Nadia var $this   = $(this)
Nadia var data    = $this.data('bs.affix')
Nadia var options = typeof option == 'object' && option

Nadia if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
Nadia if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affixNadiaNadia   = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
Nadia var $spy = $(this)
Nadia var data = $spy.data()

Nadia data.offset = data.offset || {}

Nadia if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
Nadia if (data.offsetTop    != null) data.offset.top    = data.offsetTop

Nadia Plugin.call($spy, data)
    })
  })

}(jQuery);
