/*!
 * Select2 4.0.3
 * https://select2.github.io
 *
 * Released under the MIT license
 * https://github.com/select2/select2/blob/master/LICENSE.md
 */
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function (jQuery) {
  // This is needed so we can catch the AMD loader configuration and use it
  // The inner file should be wrapped (by `banner.start.js`) in a function that
  // returns the AMD loader references.
  var S2 =
(function () {
  // Restore the Select2 AMD loader so it can be used
  // Needed mostly in the language files, where the loader is not inserted
  if (jQuery && jQuery.fn && jQuery.fn.select2 && jQuery.fn.select2.amd) {
    var S2 = jQuery.fn.select2.amd;
  }
var S2;(function () { if (!S2 || !S2.requirejs) {
if (!S2) { S2 = {}; } else { require = S2; }
/**
 * @license almond 0.3.1 Copyright (c) 2011-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
Nadia   defined = {},
Nadia   waiting = {},
Nadia   config = {},
Nadia   defining = {},
Nadia   hasOwn = Object.prototype.hasOwnProperty,
Nadia   aps = [].slice,
Nadia   jsSuffixRegExp = /\.js$/;

    function hasProp(obj, prop) {
Nadia   return hasOwn.call(obj, prop);
    }

    /**
Nadia* Given a relative module name, like ./something, normalize it to
Nadia* a real name that can be mapped to a path.
Nadia* @param {String} name the relative name
Nadia* @param {String} baseName a real name that the name arg is relative
Nadia* to.
Nadia* @returns {String} normalized name
Nadia*/
    function normalize(name, baseName) {
Nadia   var nameParts, nameSegment, mapValue, foundMap, lastIndex,
NadiaNadia  foundI, foundStarMap, starI, i, j, part,
NadiaNadia  baseParts = baseName && baseName.split("/"),
NadiaNadia  map = config.map,
NadiaNadia  starMap = (map && map['*']) || {};

Nadia   //Adjust any relative paths.
Nadia   if (name && name.charAt(0) === ".") {
NadiaNadia  //If have a base name, try to normalize against it,
NadiaNadia  //otherwise, assume it is a top-level require that will
NadiaNadia  //be relative to baseUrl in the end.
NadiaNadia  if (baseName) {
NadiaNadiaNadia name = name.split('/');
NadiaNadiaNadia lastIndex = name.length - 1;

NadiaNadiaNadia // Node .js allowance:
NadiaNadiaNadia if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
NadiaNadiaNadiaNadianame[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
NadiaNadiaNadia }

NadiaNadiaNadia //Lop off the last part of baseParts, so that . matches the
NadiaNadiaNadia //"directory" and not name of the baseName's module. For instance,
NadiaNadiaNadia //baseName of "one/two/three", maps to "one/two/three.js", but we
NadiaNadiaNadia //want the directory, "one/two" for this normalization.
NadiaNadiaNadia name = baseParts.slice(0, baseParts.length - 1).concat(name);

NadiaNadiaNadia //start trimDots
NadiaNadiaNadia for (i = 0; i < name.length; i += 1) {
NadiaNadiaNadiaNadiapart = name[i];
NadiaNadiaNadiaNadiaif (part === ".") {
NadiaNadiaNadiaNadia    name.splice(i, 1);
NadiaNadiaNadiaNadia    i -= 1;
NadiaNadiaNadiaNadia} else if (part === "..") {
NadiaNadiaNadiaNadia    if (i === 1 && (name[2] === '..' || name[0] === '..')) {
NadiaNadiaNadiaNadiaNadia   //End of the line. Keep at least one non-dot
NadiaNadiaNadiaNadiaNadia   //path segment at the front so it can be mapped
NadiaNadiaNadiaNadiaNadia   //correctly to disk. Otherwise, there is likely
NadiaNadiaNadiaNadiaNadia   //no path mapping for a path starting with '..'.
NadiaNadiaNadiaNadiaNadia   //This can still fail, but catches the most reasonable
NadiaNadiaNadiaNadiaNadia   //uses of ..
NadiaNadiaNadiaNadiaNadia   break;
NadiaNadiaNadiaNadia    } else if (i > 0) {
NadiaNadiaNadiaNadiaNadia   name.splice(i - 1, 2);
NadiaNadiaNadiaNadiaNadia   i -= 2;
NadiaNadiaNadiaNadia    }
NadiaNadiaNadiaNadia}
NadiaNadiaNadia }
NadiaNadiaNadia //end trimDots

NadiaNadiaNadia name = name.join("/");
NadiaNadia  } else if (name.indexOf('./') === 0) {
NadiaNadiaNadia // No baseName, so this is ID is resolved relative
NadiaNadiaNadia // to baseUrl, pull off the leading dot.
NadiaNadiaNadia name = name.substring(2);
NadiaNadia  }
Nadia   }

Nadia   //Apply map config if available.
Nadia   if ((baseParts || starMap) && map) {
NadiaNadia  nameParts = name.split('/');

NadiaNadia  for (i = nameParts.length; i > 0; i -= 1) {
NadiaNadiaNadia nameSegment = nameParts.slice(0, i).join("/");

NadiaNadiaNadia if (baseParts) {
NadiaNadiaNadiaNadia//Find the longest baseName segment match in the config.
NadiaNadiaNadiaNadia//So, do joins on the biggest to smallest lengths of baseParts.
NadiaNadiaNadiaNadiafor (j = baseParts.length; j > 0; j -= 1) {
NadiaNadiaNadiaNadia    mapValue = map[baseParts.slice(0, j).join('/')];

NadiaNadiaNadiaNadia    //baseName segment has  config, find if it has one for
NadiaNadiaNadiaNadia    //this name.
NadiaNadiaNadiaNadia    if (mapValue) {
NadiaNadiaNadiaNadiaNadia   mapValue = mapValue[nameSegment];
NadiaNadiaNadiaNadiaNadia   if (mapValue) {
NadiaNadiaNadiaNadiaNadiaNadia  //Match, update name to the new value.
NadiaNadiaNadiaNadiaNadiaNadia  foundMap = mapValue;
NadiaNadiaNadiaNadiaNadiaNadia  foundI = i;
NadiaNadiaNadiaNadiaNadiaNadia  break;
NadiaNadiaNadiaNadiaNadia   }
NadiaNadiaNadiaNadia    }
NadiaNadiaNadiaNadia}
NadiaNadiaNadia }

NadiaNadiaNadia if (foundMap) {
NadiaNadiaNadiaNadiabreak;
NadiaNadiaNadia }

NadiaNadiaNadia //Check for a star map match, but just hold on to it,
NadiaNadiaNadia //if there is a shorter segment match later in a matching
NadiaNadiaNadia //config, then favor over this star map.
NadiaNadiaNadia if (!foundStarMap && starMap && starMap[nameSegment]) {
NadiaNadiaNadiaNadiafoundStarMap = starMap[nameSegment];
NadiaNadiaNadiaNadiastarI = i;
NadiaNadiaNadia }
NadiaNadia  }

NadiaNadia  if (!foundMap && foundStarMap) {
NadiaNadiaNadia foundMap = foundStarMap;
NadiaNadiaNadia foundI = starI;
NadiaNadia  }

NadiaNadia  if (foundMap) {
NadiaNadiaNadia nameParts.splice(0, foundI, foundMap);
NadiaNadiaNadia name = nameParts.join('/');
NadiaNadia  }
Nadia   }

Nadia   return name;
    }

    function makeRequire(relName, forceSync) {
Nadia   return function () {
NadiaNadia  //A version of a require function that passes a moduleName
NadiaNadia  //value for items that may need to
NadiaNadia  //look up paths relative to the moduleName
NadiaNadia  var args = aps.call(arguments, 0);

NadiaNadia  //If first arg is not require('string'), and there is only
NadiaNadia  //one arg, it is the array form without a callback. Insert
NadiaNadia  //a null so that the following concat is correct.
NadiaNadia  if (typeof args[0] !== 'string' && args.length === 1) {
NadiaNadiaNadia args.push(null);
NadiaNadia  }
NadiaNadia  return req.apply(undef, args.concat([relName, forceSync]));
Nadia   };
    }

    function makeNormalize(relName) {
Nadia   return function (name) {
NadiaNadia  return normalize(name, relName);
Nadia   };
    }

    function makeLoad(depName) {
Nadia   return function (value) {
NadiaNadia  defined[depName] = value;
Nadia   };
    }

    function callDep(name) {
Nadia   if (hasProp(waiting, name)) {
NadiaNadia  var args = waiting[name];
NadiaNadia  delete waiting[name];
NadiaNadia  defining[name] = true;
NadiaNadia  main.apply(undef, args);
Nadia   }

Nadia   if (!hasProp(defined, name) && !hasProp(defining, name)) {
NadiaNadia  throw new Error('No ' + name);
Nadia   }
Nadia   return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
Nadia   var prefix,
NadiaNadia  index = name ? name.indexOf('!') : -1;
Nadia   if (index > -1) {
NadiaNadia  prefix = name.substring(0, index);
NadiaNadia  name = name.substring(index + 1, name.length);
Nadia   }
Nadia   return [prefix, name];
    }

    /**
Nadia* Makes a name map, normalizing the name, and using a plugin
Nadia* for normalization if necessary. Grabs a ref to plugin
Nadia* too, as an optimization.
Nadia*/
    makeMap = function (name, relName) {
Nadia   var plugin,
NadiaNadia  parts = splitPrefix(name),
NadiaNadia  prefix = parts[0];

Nadia   name = parts[1];

Nadia   if (prefix) {
NadiaNadia  prefix = normalize(prefix, relName);
NadiaNadia  plugin = callDep(prefix);
Nadia   }

Nadia   //Normalize according
Nadia   if (prefix) {
NadiaNadia  if (plugin && plugin.normalize) {
NadiaNadiaNadia name = plugin.normalize(name, makeNormalize(relName));
NadiaNadia  } else {
NadiaNadiaNadia name = normalize(name, relName);
NadiaNadia  }
Nadia   } else {
NadiaNadia  name = normalize(name, relName);
NadiaNadia  parts = splitPrefix(name);
NadiaNadia  prefix = parts[0];
NadiaNadia  name = parts[1];
NadiaNadia  if (prefix) {
NadiaNadiaNadia plugin = callDep(prefix);
NadiaNadia  }
Nadia   }

Nadia   //Using ridiculous property names for space reasons
Nadia   return {
NadiaNadia  f: prefix ? prefix + '!' + name : name, //fullName
NadiaNadia  n: name,
NadiaNadia  pr: prefix,
NadiaNadia  p: plugin
Nadia   };
    };

    function makeConfig(name) {
Nadia   return function () {
NadiaNadia  return (config && config.config && config.config[name]) || {};
Nadia   };
    }

    handlers = {
Nadia   require: function (name) {
NadiaNadia  return makeRequire(name);
Nadia   },
Nadia   exports: function (name) {
NadiaNadia  var e = defined[name];
NadiaNadia  if (typeof e !== 'undefined') {
NadiaNadiaNadia return e;
NadiaNadia  } else {
NadiaNadiaNadia return (defined[name] = {});
NadiaNadia  }
Nadia   },
Nadia   module: function (name) {
NadiaNadia  return {
NadiaNadiaNadia id: name,
NadiaNadiaNadia uri: '',
NadiaNadiaNadia exports: defined[name],
NadiaNadiaNadia config: makeConfig(name)
NadiaNadia  };
Nadia   }
    };

    main = function (name, deps, callback, relName) {
Nadia   var cjsModule, depName, ret, map, i,
NadiaNadia  args = [],
NadiaNadia  callbackType = typeof callback,
NadiaNadia  usingExports;

Nadia   //Use name if no relName
Nadia   relName = relName || name;

Nadia   //Call the callback to define the module, if necessary.
Nadia   if (callbackType === 'undefined' || callbackType === 'function') {
NadiaNadia  //Pull out the defined dependencies and pass the ordered
NadiaNadia  //values to the callback.
NadiaNadia  //Default to [require, exports, module] if no deps
NadiaNadia  deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
NadiaNadia  for (i = 0; i < deps.length; i += 1) {
NadiaNadiaNadia map = makeMap(deps[i], relName);
NadiaNadiaNadia depName = map.f;

NadiaNadiaNadia //Fast path CommonJS standard dependencies.
NadiaNadiaNadia if (depName === "require") {
NadiaNadiaNadiaNadiaargs[i] = handlers.require(name);
NadiaNadiaNadia } else if (depName === "exports") {
NadiaNadiaNadiaNadia//CommonJS module spec 1.1
NadiaNadiaNadiaNadiaargs[i] = handlers.exports(name);
NadiaNadiaNadiaNadiausingExports = true;
NadiaNadiaNadia } else if (depName === "module") {
NadiaNadiaNadiaNadia//CommonJS module spec 1.1
NadiaNadiaNadiaNadiacjsModule = args[i] = handlers.module(name);
NadiaNadiaNadia } else if (hasProp(defined, depName) ||
NadiaNadiaNadiaNadiaNadia  hasProp(waiting, depName) ||
NadiaNadiaNadiaNadiaNadia  hasProp(defining, depName)) {
NadiaNadiaNadiaNadiaargs[i] = callDep(depName);
NadiaNadiaNadia } else if (map.p) {
NadiaNadiaNadiaNadiamap.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
NadiaNadiaNadiaNadiaargs[i] = defined[depName];
NadiaNadiaNadia } else {
NadiaNadiaNadiaNadiathrow new Error(name + ' missing ' + depName);
NadiaNadiaNadia }
NadiaNadia  }

NadiaNadia  ret = callback ? callback.apply(defined[name], args) : undefined;

NadiaNadia  if (name) {
NadiaNadiaNadia //If setting exports via "module" is in play,
NadiaNadiaNadia //favor that over return value and exports. After that,
NadiaNadiaNadia //favor a non-undefined return value over exports use.
NadiaNadiaNadia if (cjsModule && cjsModule.exports !== undef &&
NadiaNadiaNadiaNadia    cjsModule.exports !== defined[name]) {
NadiaNadiaNadiaNadiadefined[name] = cjsModule.exports;
NadiaNadiaNadia } else if (ret !== undef || !usingExports) {
NadiaNadiaNadiaNadia//Use the return value from the function.
NadiaNadiaNadiaNadiadefined[name] = ret;
NadiaNadiaNadia }
NadiaNadia  }
Nadia   } else if (name) {
NadiaNadia  //May just be an object definition for the module. Only
NadiaNadia  //worry about defining if have a module name.
NadiaNadia  defined[name] = callback;
Nadia   }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
Nadia   if (typeof deps === "string") {
NadiaNadia  if (handlers[deps]) {
NadiaNadiaNadia //callback in this case is really relName
NadiaNadiaNadia return handlers[deps](callback);
NadiaNadia  }
NadiaNadia  //Just return the module wanted. In this scenario, the
NadiaNadia  //deps arg is the module name, and second arg (if passed)
NadiaNadia  //is just the relName.
NadiaNadia  //Normalize module name, if it contains . or ..
NadiaNadia  return callDep(makeMap(deps, callback).f);
Nadia   } else if (!deps.splice) {
NadiaNadia  //deps is a config object, not an array.
NadiaNadia  config = deps;
NadiaNadia  if (config.deps) {
NadiaNadiaNadia req(config.deps, config.callback);
NadiaNadia  }
NadiaNadia  if (!callback) {
NadiaNadiaNadia return;
NadiaNadia  }

NadiaNadia  if (callback.splice) {
NadiaNadiaNadia //callback is an array, which means it is a dependency list.
NadiaNadiaNadia //Adjust args if there are dependencies
NadiaNadiaNadia deps = callback;
NadiaNadiaNadia callback = relName;
NadiaNadiaNadia relName = null;
NadiaNadia  } else {
NadiaNadiaNadia deps = undef;
NadiaNadia  }
Nadia   }

Nadia   //Support require(['a'])
Nadia   callback = callback || function () {};

Nadia   //If relName is a function, it is an errback handler,
Nadia   //so remove it.
Nadia   if (typeof relName === 'function') {
NadiaNadia  relName = forceSync;
NadiaNadia  forceSync = alt;
Nadia   }

Nadia   //Simulate async callback;
Nadia   if (forceSync) {
NadiaNadia  main(undef, deps, callback, relName);
Nadia   } else {
NadiaNadia  //Using a non-zero value because of concern for what old browsers
NadiaNadia  //do, and latest browsers "upgrade" to 4 if lower value is used:
NadiaNadia  //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
NadiaNadia  //If want a value immediately, use require('id') instead -- something
NadiaNadia  //that works in almond on the global level, but not guaranteed and
NadiaNadia  //unlikely to work in other AMD implementations.
NadiaNadia  setTimeout(function () {
NadiaNadiaNadia main(undef, deps, callback, relName);
NadiaNadia  }, 4);
Nadia   }

Nadia   return req;
    };

    /**
Nadia* Just drops the config on the floor, but returns req in case
Nadia* the config return value is used.
Nadia*/
    req.config = function (cfg) {
Nadia   return req(cfg);
    };

    /**
Nadia* Expose module registry for debugging and tooling
Nadia*/
    requirejs._defined = defined;

    define = function (name, deps, callback) {
Nadia   if (typeof name !== 'string') {
NadiaNadia  throw new Error('See almond README: incorrect module build, no module name');
Nadia   }

Nadia   //This module may not have dependencies
Nadia   if (!deps.splice) {
NadiaNadia  //deps is not an array, so probably means
NadiaNadia  //an object literal or factory function for
NadiaNadia  //the value. Adjust args.
NadiaNadia  callback = deps;
NadiaNadia  deps = [];
Nadia   }

Nadia   if (!hasProp(defined, name) && !hasProp(waiting, name)) {
NadiaNadia  waiting[name] = [name, deps, callback];
Nadia   }
    };

    define.amd = {
Nadia   jQuery: true
    };
}());

S2.requirejs = requirejs;S2.require = require;S2.define = define;
}
}());
S2.define("almond", function(){});

/* global jQuery:false, $:false */
S2.define('jquery',[],function () {
  var _$ = jQuery || $;

  if (_$ == null && console && console.error) {
    console.error(
Nadia 'Select2: An instance of jQuery or a jQuery-compatible library was not ' +
Nadia 'found. Make sure that you are including jQuery before Select2 on your ' +
Nadia 'web page.'
    );
  }

  return _$;
});

S2.define('select2/utils',[
  'jquery'
], function ($) {
  var Utils = {};

  Utils.Extend = function (ChildClass, SuperClass) {
    var __hasProp = {}.hasOwnProperty;

    function BaseConstructor () {
Nadia this.constructor = ChildClass;
    }

    for (var key in SuperClass) {
Nadia if (__hasProp.call(SuperClass, key)) {
Nadia   ChildClass[key] = SuperClass[key];
Nadia }
    }

    BaseConstructor.prototype = SuperClass.prototype;
    ChildClass.prototype = new BaseConstructor();
    ChildClass.__super__ = SuperClass.prototype;

    return ChildClass;
  };

  function getMethods (theClass) {
    var proto = theClass.prototype;

    var methods = [];

    for (var methodName in proto) {
Nadia var m = proto[methodName];

Nadia if (typeof m !== 'function') {
Nadia   continue;
Nadia }

Nadia if (methodName === 'constructor') {
Nadia   continue;
Nadia }

Nadia methods.push(methodName);
    }

    return methods;
  }

  Utils.Decorate = function (SuperClass, DecoratorClass) {
    var decoratedMethods = getMethods(DecoratorClass);
    var superMethods = getMethods(SuperClass);

    function DecoratedClass () {
Nadia var unshift = Array.prototype.unshift;

Nadia var argCount = DecoratorClass.prototype.constructor.length;

Nadia var calledConstructor = SuperClass.prototype.constructor;

Nadia if (argCount > 0) {
Nadia   unshift.call(arguments, SuperClass.prototype.constructor);

Nadia   calledConstructor = DecoratorClass.prototype.constructor;
Nadia }

Nadia calledConstructor.apply(this, arguments);
    }

    DecoratorClass.displayName = SuperClass.displayName;

    function ctr () {
Nadia this.constructor = DecoratedClass;
    }

    DecoratedClass.prototype = new ctr();

    for (var m = 0; m < superMethods.length; m++) {
Nadia   var superMethod = superMethods[m];

Nadia   DecoratedClass.prototype[superMethod] =
NadiaNadiaSuperClass.prototype[superMethod];
    }

    var calledMethod = function (methodName) {
Nadia // Stub out the original method if it's not decorating an actual method
Nadia var originalMethod = function () {};

Nadia if (methodName in DecoratedClass.prototype) {
Nadia   originalMethod = DecoratedClass.prototype[methodName];
Nadia }

Nadia var decoratedMethod = DecoratorClass.prototype[methodName];

Nadia return function () {
Nadia   var unshift = Array.prototype.unshift;

Nadia   unshift.call(arguments, originalMethod);

Nadia   return decoratedMethod.apply(this, arguments);
Nadia };
    };

    for (var d = 0; d < decoratedMethods.length; d++) {
Nadia var decoratedMethod = decoratedMethods[d];

Nadia DecoratedClass.prototype[decoratedMethod] = calledMethod(decoratedMethod);
    }

    return DecoratedClass;
  };

  var Observable = function () {
    this.listeners = {};
  };

  Observable.prototype.on = function (event, callback) {
    this.listeners = this.listeners || {};

    if (event in this.listeners) {
Nadia this.listeners[event].push(callback);
    } else {
Nadia this.listeners[event] = [callback];
    }
  };

  Observable.prototype.trigger = function (event) {
    var slice = Array.prototype.slice;
    var params = slice.call(arguments, 1);

    this.listeners = this.listeners || {};

    // Params should always come in as an array
    if (params == null) {
Nadia params = [];
    }

    // If there are no arguments to the event, use a temporary object
    if (params.length === 0) {
Nadia params.push({});
    }

    // Set the `_type` of the first object to the event
    params[0]._type = event;

    if (event in this.listeners) {
Nadia this.invoke(this.listeners[event], slice.call(arguments, 1));
    }

    if ('*' in this.listeners) {
Nadia this.invoke(this.listeners['*'], arguments);
    }
  };

  Observable.prototype.invoke = function (listeners, params) {
    for (var i = 0, len = listeners.length; i < len; i++) {
Nadia listeners[i].apply(this, params);
    }
  };

  Utils.Observable = Observable;

  Utils.generateChars = function (length) {
    var chars = '';

    for (var i = 0; i < length; i++) {
Nadia var randomChar = Math.floor(Math.random() * 36);
Nadia chars += randomChar.toString(36);
    }

    return chars;
  };

  Utils.bind = function (func, context) {
    return function () {
Nadia func.apply(context, arguments);
    };
  };

  Utils._convertData = function (data) {
    for (var originalKey in data) {
Nadia var keys = originalKey.split('-');

Nadia var dataLevel = data;

Nadia if (keys.length === 1) {
Nadia   continue;
Nadia }

Nadia for (var k = 0; k < keys.length; k++) {
Nadia   var key = keys[k];

Nadia   // Lowercase the first letter
Nadia   // By default, dash-separated becomes camelCase
Nadia   key = key.substring(0, 1).toLowerCase() + key.substring(1);

Nadia   if (!(key in dataLevel)) {
NadiaNadiadataLevel[key] = {};
Nadia   }

Nadia   if (k == keys.length - 1) {
NadiaNadiadataLevel[key] = data[originalKey];
Nadia   }

Nadia   dataLevel = dataLevel[key];
Nadia }

Nadia delete data[originalKey];
    }

    return data;
  };

  Utils.hasScroll = function (index, el) {
    // Adapted from the function created by @ShadowScripter
    // and adapted by @BillBarry on the Stack Exchange Code Review website.
    // The original code can be found at
    // http://codereview.stackexchange.com/q/13338
    // and was designed to be used with the Sizzle selector engine.

    var $el = $(el);
    var overflowX = el.style.overflowX;
    var overflowY = el.style.overflowY;

    //Check both x and y declarations
    if (overflowX === overflowY &&
Nadia   (overflowY === 'hidden' || overflowY === 'visible')) {
Nadia return false;
    }

    if (overflowX === 'scroll' || overflowY === 'scroll') {
Nadia return true;
    }

    return ($el.innerHeight() < el.scrollHeight ||
Nadia $el.innerWidth() < el.scrollWidth);
  };

  Utils.escapeMarkup = function (markup) {
    var replaceMap = {
Nadia '\\': '&#92;',
Nadia '&': '&amp;',
Nadia '<': '&lt;',
Nadia '>': '&gt;',
Nadia '"': '&quot;',
Nadia '\'': '&#39;',
Nadia '/': '&#47;'
    };

    // Do not try to escape the markup if it's not a string
    if (typeof markup !== 'string') {
Nadia return markup;
    }

    return String(markup).replace(/[&<>"'\/\\]/g, function (match) {
Nadia return replaceMap[match];
    });
  };

  // Append an array of jQuery nodes to a given element.
  Utils.appendMany = function ($element, $nodes) {
    // jQuery 1.7.x does not support $.fn.append() with an array
    // Fall back to a jQuery object collection using $.fn.add()
    if ($.fn.jquery.substr(0, 3) === '1.7') {
Nadia var $jqNodes = $();

Nadia $.map($nodes, function (node) {
Nadia   $jqNodes = $jqNodes.add(node);
Nadia });

Nadia $nodes = $jqNodes;
    }

    $element.append($nodes);
  };

  return Utils;
});

S2.define('select2/results',[
  'jquery',
  './utils'
], function ($, Utils) {
  function Results ($element, options, dataAdapter) {
    this.$element = $element;
    this.data = dataAdapter;
    this.options = options;

    Results.__super__.constructor.call(this);
  }

  Utils.Extend(Results, Utils.Observable);

  Results.prototype.render = function () {
    var $results = $(
Nadia '<ul class="select2-results__options" role="tree"></ul>'
    );

    if (this.options.get('multiple')) {
Nadia $results.attr('aria-multiselectable', 'true');
    }

    this.$results = $results;

    return $results;
  };

  Results.prototype.clear = function () {
    this.$results.empty();
  };

  Results.prototype.displayMessage = function (params) {
    var escapeMarkup = this.options.get('escapeMarkup');

    this.clear();
    this.hideLoading();

    var $message = $(
Nadia '<li role="treeitem" aria-live="assertive"' +
Nadia ' class="select2-results__option"></li>'
    );

    var message = this.options.get('translations').get(params.message);

    $message.append(
Nadia escapeMarkup(
Nadia   message(params.args)
Nadia )
    );

    $message[0].className += ' select2-results__message';

    this.$results.append($message);
  };

  Results.prototype.hideMessages = function () {
    this.$results.find('.select2-results__message').remove();
  };

  Results.prototype.append = function (data) {
    this.hideLoading();

    var $options = [];

    if (data.results == null || data.results.length === 0) {
Nadia if (this.$results.children().length === 0) {
Nadia   this.trigger('results:message', {
NadiaNadiamessage: 'noResults'
Nadia   });
Nadia }

Nadia return;
    }

    data.results = this.sort(data.results);

    for (var d = 0; d < data.results.length; d++) {
Nadia var item = data.results[d];

Nadia var $option = this.option(item);

Nadia $options.push($option);
    }

    this.$results.append($options);
  };

  Results.prototype.position = function ($results, $dropdown) {
    var $resultsContainer = $dropdown.find('.select2-results');
    $resultsContainer.append($results);
  };

  Results.prototype.sort = function (data) {
    var sorter = this.options.get('sorter');

    return sorter(data);
  };

  Results.prototype.highlightFirstItem = function () {
    var $options = this.$results
Nadia .find('.select2-results__option[aria-selected]');

    var $selected = $options.filter('[aria-selected=true]');

    // Check if there are any selected options
    if ($selected.length > 0) {
Nadia // If there are selected options, highlight the first
Nadia $selected.first().trigger('mouseenter');
    } else {
Nadia // If there are no selected options, highlight the first option
Nadia // in the dropdown
Nadia $options.first().trigger('mouseenter');
    }

    this.ensureHighlightVisible();
  };

  Results.prototype.setClasses = function () {
    var self = this;

    this.data.current(function (selected) {
Nadia var selectedIds = $.map(selected, function (s) {
Nadia   return s.id.toString();
Nadia });

Nadia var $options = self.$results
Nadia   .find('.select2-results__option[aria-selected]');

Nadia $options.each(function () {
Nadia   var $option = $(this);

Nadia   var item = $.data(this, 'data');

Nadia   // id needs to be converted to a string when comparing
Nadia   var id = '' + item.id;

Nadia   if ((item.element != null && item.element.selected) ||
NadiaNadia  (item.element == null && $.inArray(id, selectedIds) > -1)) {
NadiaNadia$option.attr('aria-selected', 'true');
Nadia   } else {
NadiaNadia$option.attr('aria-selected', 'false');
Nadia   }
Nadia });

    });
  };

  Results.prototype.showLoading = function (params) {
    this.hideLoading();

    var loadingMore = this.options.get('translations').get('searching');

    var loading = {
Nadia disabled: true,
Nadia loading: true,
Nadia text: loadingMore(params)
    };
    var $loading = this.option(loading);
    $loading.className += ' loading-results';

    this.$results.prepend($loading);
  };

  Results.prototype.hideLoading = function () {
    this.$results.find('.loading-results').remove();
  };

  Results.prototype.option = function (data) {
    var option = document.createElement('li');
    option.className = 'select2-results__option';

    var attrs = {
Nadia 'role': 'treeitem',
Nadia 'aria-selected': 'false'
    };

    if (data.disabled) {
Nadia delete attrs['aria-selected'];
Nadia attrs['aria-disabled'] = 'true';
    }

    if (data.id == null) {
Nadia delete attrs['aria-selected'];
    }

    if (data._resultId != null) {
Nadia option.id = data._resultId;
    }

    if (data.title) {
Nadia option.title = data.title;
    }

    if (data.children) {
Nadia attrs.role = 'group';
Nadia attrs['aria-label'] = data.text;
Nadia delete attrs['aria-selected'];
    }

    for (var attr in attrs) {
Nadia var val = attrs[attr];

Nadia option.setAttribute(attr, val);
    }

    if (data.children) {
Nadia var $option = $(option);

Nadia var label = document.createElement('strong');
Nadia label.className = 'select2-results__group';

Nadia var $label = $(label);
Nadia this.template(data, label);

Nadia var $children = [];

Nadia for (var c = 0; c < data.children.length; c++) {
Nadia   var child = data.children[c];

Nadia   var $child = this.option(child);

Nadia   $children.push($child);
Nadia }

Nadia var $childrenContainer = $('<ul></ul>', {
Nadia   'class': 'select2-results__options select2-results__options--nested'
Nadia });

Nadia $childrenContainer.append($children);

Nadia $option.append(label);
Nadia $option.append($childrenContainer);
    } else {
Nadia this.template(data, option);
    }

    $.data(option, 'data', data);

    return option;
  };

  Results.prototype.bind = function (container, $container) {
    var self = this;

    var id = container.id + '-results';

    this.$results.attr('id', id);

    container.on('results:all', function (params) {
Nadia self.clear();
Nadia self.append(params.data);

Nadia if (container.isOpen()) {
Nadia   self.setClasses();
Nadia   self.highlightFirstItem();
Nadia }
    });

    container.on('results:append', function (params) {
Nadia self.append(params.data);

Nadia if (container.isOpen()) {
Nadia   self.setClasses();
Nadia }
    });

    container.on('query', function (params) {
Nadia self.hideMessages();
Nadia self.showLoading(params);
    });

    container.on('select', function () {
Nadia if (!container.isOpen()) {
Nadia   return;
Nadia }

Nadia self.setClasses();
Nadia self.highlightFirstItem();
    });

    container.on('unselect', function () {
Nadia if (!container.isOpen()) {
Nadia   return;
Nadia }

Nadia self.setClasses();
Nadia self.highlightFirstItem();
    });

    container.on('open', function () {
Nadia // When the dropdown is open, aria-expended="true"
Nadia self.$results.attr('aria-expanded', 'true');
Nadia self.$results.attr('aria-hidden', 'false');

Nadia self.setClasses();
Nadia self.ensureHighlightVisible();
    });

    container.on('close', function () {
Nadia // When the dropdown is closed, aria-expended="false"
Nadia self.$results.attr('aria-expanded', 'false');
Nadia self.$results.attr('aria-hidden', 'true');
Nadia self.$results.removeAttr('aria-activedescendant');
    });

    container.on('results:toggle', function () {
Nadia var $highlighted = self.getHighlightedResults();

Nadia if ($highlighted.length === 0) {
Nadia   return;
Nadia }

Nadia $highlighted.trigger('mouseup');
    });

    container.on('results:select', function () {
Nadia var $highlighted = self.getHighlightedResults();

Nadia if ($highlighted.length === 0) {
Nadia   return;
Nadia }

Nadia var data = $highlighted.data('data');

Nadia if ($highlighted.attr('aria-selected') == 'true') {
Nadia   self.trigger('close', {});
Nadia } else {
Nadia   self.trigger('select', {
NadiaNadiadata: data
Nadia   });
Nadia }
    });

    container.on('results:previous', function () {
Nadia var $highlighted = self.getHighlightedResults();

Nadia var $options = self.$results.find('[aria-selected]');

Nadia var currentIndex = $options.index($highlighted);

Nadia // If we are already at te top, don't move further
Nadia if (currentIndex === 0) {
Nadia   return;
Nadia }

Nadia var nextIndex = currentIndex - 1;

Nadia // If none are highlighted, highlight the first
Nadia if ($highlighted.length === 0) {
Nadia   nextIndex = 0;
Nadia }

Nadia var $next = $options.eq(nextIndex);

Nadia $next.trigger('mouseenter');

Nadia var currentOffset = self.$results.offset().top;
Nadia var nextTop = $next.offset().top;
Nadia var nextOffset = self.$results.scrollTop() + (nextTop - currentOffset);

Nadia if (nextIndex === 0) {
Nadia   self.$results.scrollTop(0);
Nadia } else if (nextTop - currentOffset < 0) {
Nadia   self.$results.scrollTop(nextOffset);
Nadia }
    });

    container.on('results:next', function () {
Nadia var $highlighted = self.getHighlightedResults();

Nadia var $options = self.$results.find('[aria-selected]');

Nadia var currentIndex = $options.index($highlighted);

Nadia var nextIndex = currentIndex + 1;

Nadia // If we are at the last option, stay there
Nadia if (nextIndex >= $options.length) {
Nadia   return;
Nadia }

Nadia var $next = $options.eq(nextIndex);

Nadia $next.trigger('mouseenter');

Nadia var currentOffset = self.$results.offset().top +
Nadia   self.$results.outerHeight(false);
Nadia var nextBottom = $next.offset().top + $next.outerHeight(false);
Nadia var nextOffset = self.$results.scrollTop() + nextBottom - currentOffset;

Nadia if (nextIndex === 0) {
Nadia   self.$results.scrollTop(0);
Nadia } else if (nextBottom > currentOffset) {
Nadia   self.$results.scrollTop(nextOffset);
Nadia }
    });

    container.on('results:focus', function (params) {
Nadia params.element.addClass('select2-results__option--highlighted');
    });

    container.on('results:message', function (params) {
Nadia self.displayMessage(params);
    });

    if ($.fn.mousewheel) {
Nadia this.$results.on('mousewheel', function (e) {
Nadia   var top = self.$results.scrollTop();

Nadia   var bottom = self.$results.get(0).scrollHeight - top + e.deltaY;

Nadia   var isAtTop = e.deltaY > 0 && top - e.deltaY <= 0;
Nadia   var isAtBottom = e.deltaY < 0 && bottom <= self.$results.height();

Nadia   if (isAtTop) {
NadiaNadiaself.$results.scrollTop(0);

NadiaNadiae.preventDefault();
NadiaNadiae.stopPropagation();
Nadia   } else if (isAtBottom) {
NadiaNadiaself.$results.scrollTop(
NadiaNadia  self.$results.get(0).scrollHeight - self.$results.height()
NadiaNadia);

NadiaNadiae.preventDefault();
NadiaNadiae.stopPropagation();
Nadia   }
Nadia });
    }

    this.$results.on('mouseup', '.select2-results__option[aria-selected]',
Nadia function (evt) {
Nadia var $this = $(this);

Nadia var data = $this.data('data');

Nadia if ($this.attr('aria-selected') === 'true') {
Nadia   if (self.options.get('multiple')) {
NadiaNadiaself.trigger('unselect', {
NadiaNadia  originalEvent: evt,
NadiaNadia  data: data
NadiaNadia});
Nadia   } else {
NadiaNadiaself.trigger('close', {});
Nadia   }

Nadia   return;
Nadia }

Nadia self.trigger('select', {
Nadia   originalEvent: evt,
Nadia   data: data
Nadia });
    });

    this.$results.on('mouseenter', '.select2-results__option[aria-selected]',
Nadia function (evt) {
Nadia var data = $(this).data('data');

Nadia self.getHighlightedResults()
NadiaNadia.removeClass('select2-results__option--highlighted');

Nadia self.trigger('results:focus', {
Nadia   data: data,
Nadia   element: $(this)
Nadia });
    });
  };

  Results.prototype.getHighlightedResults = function () {
    var $highlighted = this.$results
    .find('.select2-results__option--highlighted');

    return $highlighted;
  };

  Results.prototype.destroy = function () {
    this.$results.remove();
  };

  Results.prototype.ensureHighlightVisible = function () {
    var $highlighted = this.getHighlightedResults();

    if ($highlighted.length === 0) {
Nadia return;
    }

    var $options = this.$results.find('[aria-selected]');

    var currentIndex = $options.index($highlighted);

    var currentOffset = this.$results.offset().top;
    var nextTop = $highlighted.offset().top;
    var nextOffset = this.$results.scrollTop() + (nextTop - currentOffset);

    var offsetDelta = nextTop - currentOffset;
    nextOffset -= $highlighted.outerHeight(false) * 2;

    if (currentIndex <= 2) {
Nadia this.$results.scrollTop(0);
    } else if (offsetDelta > this.$results.outerHeight() || offsetDelta < 0) {
Nadia this.$results.scrollTop(nextOffset);
    }
  };

  Results.prototype.template = function (result, container) {
    var template = this.options.get('templateResult');
    var escapeMarkup = this.options.get('escapeMarkup');

    var content = template(result, container);

    if (content == null) {
Nadia container.style.display = 'none';
    } else if (typeof content === 'string') {
Nadia container.innerHTML = escapeMarkup(content);
    } else {
Nadia $(container).append(content);
    }
  };

  return Results;
});

S2.define('select2/keys',[

], function () {
  var KEYS = {
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    ESC: 27,
    SPACE: 32,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    DELETE: 46
  };

  return KEYS;
});

S2.define('select2/selection/base',[
  'jquery',
  '../utils',
  '../keys'
], function ($, Utils, KEYS) {
  function BaseSelection ($element, options) {
    this.$element = $element;
    this.options = options;

    BaseSelection.__super__.constructor.call(this);
  }

  Utils.Extend(BaseSelection, Utils.Observable);

  BaseSelection.prototype.render = function () {
    var $selection = $(
Nadia '<span class="select2-selection" role="combobox" ' +
Nadia ' aria-haspopup="true" aria-expanded="false">' +
Nadia '</span>'
    );

    this._tabindex = 0;

    if (this.$element.data('old-tabindex') != null) {
Nadia this._tabindex = this.$element.data('old-tabindex');
    } else if (this.$element.attr('tabindex') != null) {
Nadia this._tabindex = this.$element.attr('tabindex');
    }

    $selection.attr('title', this.$element.attr('title'));
    $selection.attr('tabindex', this._tabindex);

    this.$selection = $selection;

    return $selection;
  };

  BaseSelection.prototype.bind = function (container, $container) {
    var self = this;

    var id = container.id + '-container';
    var resultsId = container.id + '-results';

    this.container = container;

    this.$selection.on('focus', function (evt) {
Nadia self.trigger('focus', evt);
    });

    this.$selection.on('blur', function (evt) {
Nadia self._handleBlur(evt);
    });

    this.$selection.on('keydown', function (evt) {
Nadia self.trigger('keypress', evt);

Nadia if (evt.which === KEYS.SPACE) {
Nadia   evt.preventDefault();
Nadia }
    });

    container.on('results:focus', function (params) {
Nadia self.$selection.attr('aria-activedescendant', params.data._resultId);
    });

    container.on('selection:update', function (params) {
Nadia self.update(params.data);
    });

    container.on('open', function () {
Nadia // When the dropdown is open, aria-expanded="true"
Nadia self.$selection.attr('aria-expanded', 'true');
Nadia self.$selection.attr('aria-owns', resultsId);

Nadia self._attachCloseHandler(container);
    });

    container.on('close', function () {
Nadia // When the dropdown is closed, aria-expanded="false"
Nadia self.$selection.attr('aria-expanded', 'false');
Nadia self.$selection.removeAttr('aria-activedescendant');
Nadia self.$selection.removeAttr('aria-owns');

Nadia self.$selection.focus();

Nadia self._detachCloseHandler(container);
    });

    container.on('enable', function () {
Nadia self.$selection.attr('tabindex', self._tabindex);
    });

    container.on('disable', function () {
Nadia self.$selection.attr('tabindex', '-1');
    });
  };

  BaseSelection.prototype._handleBlur = function (evt) {
    var self = this;

    // This needs to be delayed as the active element is the body when the tab
    // key is pressed, possibly along with others.
    window.setTimeout(function () {
Nadia // Don't trigger `blur` if the focus is still in the selection
Nadia if (
Nadia   (document.activeElement == self.$selection[0]) ||
Nadia   ($.contains(self.$selection[0], document.activeElement))
Nadia ) {
Nadia   return;
Nadia }

Nadia self.trigger('blur', evt);
    }, 1);
  };

  BaseSelection.prototype._attachCloseHandler = function (container) {
    var self = this;

    $(document.body).on('mousedown.select2.' + container.id, function (e) {
Nadia var $target = $(e.target);

Nadia var $select = $target.closest('.select2');

Nadia var $all = $('.select2.select2-container--open');

Nadia $all.each(function () {
Nadia   var $this = $(this);

Nadia   if (this == $select[0]) {
NadiaNadiareturn;
Nadia   }

Nadia   var $element = $this.data('element');

Nadia   $element.select2('close');
Nadia });
    });
  };

  BaseSelection.prototype._detachCloseHandler = function (container) {
    $(document.body).off('mousedown.select2.' + container.id);
  };

  BaseSelection.prototype.position = function ($selection, $container) {
    var $selectionContainer = $container.find('.selection');
    $selectionContainer.append($selection);
  };

  BaseSelection.prototype.destroy = function () {
    this._detachCloseHandler(this.container);
  };

  BaseSelection.prototype.update = function (data) {
    throw new Error('The `update` method must be defined in child classes.');
  };

  return BaseSelection;
});

S2.define('select2/selection/single',[
  'jquery',
  './base',
  '../utils',
  '../keys'
], function ($, BaseSelection, Utils, KEYS) {
  function SingleSelection () {
    SingleSelection.__super__.constructor.apply(this, arguments);
  }

  Utils.Extend(SingleSelection, BaseSelection);

  SingleSelection.prototype.render = function () {
    var $selection = SingleSelection.__super__.render.call(this);

    $selection.addClass('select2-selection--single');

    $selection.html(
Nadia '<span class="select2-selection__rendered"></span>' +
Nadia '<span class="select2-selection__arrow" role="presentation">' +
Nadia   '<b role="presentation"></b>' +
Nadia '</span>'
    );

    return $selection;
  };

  SingleSelection.prototype.bind = function (container, $container) {
    var self = this;

    SingleSelection.__super__.bind.apply(this, arguments);

    var id = container.id + '-container';

    this.$selection.find('.select2-selection__rendered').attr('id', id);
    this.$selection.attr('aria-labelledby', id);

    this.$selection.on('mousedown', function (evt) {
Nadia // Only respond to left clicks
Nadia if (evt.which !== 1) {
Nadia   return;
Nadia }

Nadia self.trigger('toggle', {
Nadia   originalEvent: evt
Nadia });
    });

    this.$selection.on('focus', function (evt) {
Nadia // User focuses on the container
    });

    this.$selection.on('blur', function (evt) {
Nadia // User exits the container
    });

    container.on('focus', function (evt) {
Nadia if (!container.isOpen()) {
Nadia   self.$selection.focus();
Nadia }
    });

    container.on('selection:update', function (params) {
Nadia self.update(params.data);
    });
  };

  SingleSelection.prototype.clear = function () {
    this.$selection.find('.select2-selection__rendered').empty();
  };

  SingleSelection.prototype.display = function (data, container) {
    var template = this.options.get('templateSelection');
    var escapeMarkup = this.options.get('escapeMarkup');

    return escapeMarkup(template(data, container));
  };

  SingleSelection.prototype.selectionContainer = function () {
    return $('<span></span>');
  };

  SingleSelection.prototype.update = function (data) {
    if (data.length === 0) {
Nadia this.clear();
Nadia return;
    }

    var selection = data[0];

    var $rendered = this.$selection.find('.select2-selection__rendered');
    var formatted = this.display(selection, $rendered);

    $rendered.empty().append(formatted);
    $rendered.prop('title', selection.title || selection.text);
  };

  return SingleSelection;
});

S2.define('select2/selection/multiple',[
  'jquery',
  './base',
  '../utils'
], function ($, BaseSelection, Utils) {
  function MultipleSelection ($element, options) {
    MultipleSelection.__super__.constructor.apply(this, arguments);
  }

  Utils.Extend(MultipleSelection, BaseSelection);

  MultipleSelection.prototype.render = function () {
    var $selection = MultipleSelection.__super__.render.call(this);

    $selection.addClass('select2-selection--multiple');

    $selection.html(
Nadia '<ul class="select2-selection__rendered"></ul>'
    );

    return $selection;
  };

  MultipleSelection.prototype.bind = function (container, $container) {
    var self = this;

    MultipleSelection.__super__.bind.apply(this, arguments);

    this.$selection.on('click', function (evt) {
Nadia self.trigger('toggle', {
Nadia   originalEvent: evt
Nadia });
    });

    this.$selection.on(
Nadia 'click',
Nadia '.select2-selection__choice__remove',
Nadia function (evt) {
Nadia   // Ignore the event if it is disabled
Nadia   if (self.options.get('disabled')) {
NadiaNadiareturn;
Nadia   }

Nadia   var $remove = $(this);
Nadia   var $selection = $remove.parent();

Nadia   var data = $selection.data('data');

Nadia   self.trigger('unselect', {
NadiaNadiaoriginalEvent: evt,
NadiaNadiadata: data
Nadia   });
Nadia }
    );
  };

  MultipleSelection.prototype.clear = function () {
    this.$selection.find('.select2-selection__rendered').empty();
  };

  MultipleSelection.prototype.display = function (data, container) {
    var template = this.options.get('templateSelection');
    var escapeMarkup = this.options.get('escapeMarkup');

    return escapeMarkup(template(data, container));
  };

  MultipleSelection.prototype.selectionContainer = function () {
    var $container = $(
Nadia '<li class="select2-selection__choice">' +
Nadia   '<span class="select2-selection__choice__remove" role="presentation">' +
NadiaNadia'&times;' +
Nadia   '</span>' +
Nadia '</li>'
    );

    return $container;
  };

  MultipleSelection.prototype.update = function (data) {
    this.clear();

    if (data.length === 0) {
Nadia return;
    }

    var $selections = [];

    for (var d = 0; d < data.length; d++) {
Nadia var selection = data[d];

Nadia var $selection = this.selectionContainer();
Nadia var formatted = this.display(selection, $selection);

Nadia $selection.append(formatted);
Nadia $selection.prop('title', selection.title || selection.text);

Nadia $selection.data('data', selection);

Nadia $selections.push($selection);
    }

    var $rendered = this.$selection.find('.select2-selection__rendered');

    Utils.appendMany($rendered, $selections);
  };

  return MultipleSelection;
});

S2.define('select2/selection/placeholder',[
  '../utils'
], function (Utils) {
  function Placeholder (decorated, $element, options) {
    this.placeholder = this.normalizePlaceholder(options.get('placeholder'));

    decorated.call(this, $element, options);
  }

  Placeholder.prototype.normalizePlaceholder = function (_, placeholder) {
    if (typeof placeholder === 'string') {
Nadia placeholder = {
Nadia   id: '',
Nadia   text: placeholder
Nadia };
    }

    return placeholder;
  };

  Placeholder.prototype.createPlaceholder = function (decorated, placeholder) {
    var $placeholder = this.selectionContainer();

    $placeholder.html(this.display(placeholder));
    $placeholder.addClass('select2-selection__placeholder')
NadiaNadiaNadia .removeClass('select2-selection__choice');

    return $placeholder;
  };

  Placeholder.prototype.update = function (decorated, data) {
    var singlePlaceholder = (
Nadia data.length == 1 && data[0].id != this.placeholder.id
    );
    var multipleSelections = data.length > 1;

    if (multipleSelections || singlePlaceholder) {
Nadia return decorated.call(this, data);
    }

    this.clear();

    var $placeholder = this.createPlaceholder(this.placeholder);

    this.$selection.find('.select2-selection__rendered').append($placeholder);
  };

  return Placeholder;
});

S2.define('select2/selection/allowClear',[
  'jquery',
  '../keys'
], function ($, KEYS) {
  function AllowClear () { }

  AllowClear.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    if (this.placeholder == null) {
Nadia if (this.options.get('debug') && window.console && console.error) {
Nadia   console.error(
NadiaNadia'Select2: The `allowClear` option should be used in combination ' +
NadiaNadia'with the `placeholder` option.'
Nadia   );
Nadia }
    }

    this.$selection.on('mousedown', '.select2-selection__clear',
Nadia function (evt) {
Nadia   self._handleClear(evt);
    });

    container.on('keypress', function (evt) {
Nadia self._handleKeyboardClear(evt, container);
    });
  };

  AllowClear.prototype._handleClear = function (_, evt) {
    // Ignore the event if it is disabled
    if (this.options.get('disabled')) {
Nadia return;
    }

    var $clear = this.$selection.find('.select2-selection__clear');

    // Ignore the event if nothing has been selected
    if ($clear.length === 0) {
Nadia return;
    }

    evt.stopPropagation();

    var data = $clear.data('data');

    for (var d = 0; d < data.length; d++) {
Nadia var unselectData = {
Nadia   data: data[d]
Nadia };

Nadia // Trigger the `unselect` event, so people can prevent it from being
Nadia // cleared.
Nadia this.trigger('unselect', unselectData);

Nadia // If the event was prevented, don't clear it out.
Nadia if (unselectData.prevented) {
Nadia   return;
Nadia }
    }

    this.$element.val(this.placeholder.id).trigger('change');

    this.trigger('toggle', {});
  };

  AllowClear.prototype._handleKeyboardClear = function (_, evt, container) {
    if (container.isOpen()) {
Nadia return;
    }

    if (evt.which == KEYS.DELETE || evt.which == KEYS.BACKSPACE) {
Nadia this._handleClear(evt);
    }
  };

  AllowClear.prototype.update = function (decorated, data) {
    decorated.call(this, data);

    if (this.$selection.find('.select2-selection__placeholder').length > 0 ||
Nadia   data.length === 0) {
Nadia return;
    }

    var $remove = $(
Nadia '<span class="select2-selection__clear">' +
Nadia   '&times;' +
Nadia '</span>'
    );
    $remove.data('data', data);

    this.$selection.find('.select2-selection__rendered').prepend($remove);
  };

  return AllowClear;
});

S2.define('select2/selection/search',[
  'jquery',
  '../utils',
  '../keys'
], function ($, Utils, KEYS) {
  function Search (decorated, $element, options) {
    decorated.call(this, $element, options);
  }

  Search.prototype.render = function (decorated) {
    var $search = $(
Nadia '<li class="select2-search select2-search--inline">' +
Nadia   '<input class="select2-search__field" type="search" tabindex="-1"' +
Nadia   ' autocomplete="off" autocorrect="off" autocapitalize="off"' +
Nadia   ' spellcheck="false" role="textbox" aria-autocomplete="list" />' +
Nadia '</li>'
    );

    this.$searchContainer = $search;
    this.$search = $search.find('input');

    var $rendered = decorated.call(this);

    this._transferTabIndex();

    return $rendered;
  };

  Search.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    container.on('open', function () {
Nadia self.$search.trigger('focus');
    });

    container.on('close', function () {
Nadia self.$search.val('');
Nadia self.$search.removeAttr('aria-activedescendant');
Nadia self.$search.trigger('focus');
    });

    container.on('enable', function () {
Nadia self.$search.prop('disabled', false);

Nadia self._transferTabIndex();
    });

    container.on('disable', function () {
Nadia self.$search.prop('disabled', true);
    });

    container.on('focus', function (evt) {
Nadia self.$search.trigger('focus');
    });

    container.on('results:focus', function (params) {
Nadia self.$search.attr('aria-activedescendant', params.id);
    });

    this.$selection.on('focusin', '.select2-search--inline', function (evt) {
Nadia self.trigger('focus', evt);
    });

    this.$selection.on('focusout', '.select2-search--inline', function (evt) {
Nadia self._handleBlur(evt);
    });

    this.$selection.on('keydown', '.select2-search--inline', function (evt) {
Nadia evt.stopPropagation();

Nadia self.trigger('keypress', evt);

Nadia self._keyUpPrevented = evt.isDefaultPrevented();

Nadia var key = evt.which;

Nadia if (key === KEYS.BACKSPACE && self.$search.val() === '') {
Nadia   var $previousChoice = self.$searchContainer
NadiaNadia.prev('.select2-selection__choice');

Nadia   if ($previousChoice.length > 0) {
NadiaNadiavar item = $previousChoice.data('data');

NadiaNadiaself.searchRemoveChoice(item);

NadiaNadiaevt.preventDefault();
Nadia   }
Nadia }
    });

    // Try to detect the IE version should the `documentMode` property that
    // is stored on the document. This is only implemented in IE and is
    // slightly cleaner than doing a user agent check.
    // This property is not available in Edge, but Edge also doesn't have
    // this bug.
    var msie = document.documentMode;
    var disableInputEvents = msie && msie <= 11;

    // Workaround for browsers which do not support the `input` event
    // This will prevent double-triggering of events for browsers which support
    // both the `keyup` and `input` events.
    this.$selection.on(
Nadia 'input.searchcheck',
Nadia '.select2-search--inline',
Nadia function (evt) {
Nadia   // IE will trigger the `input` event when a placeholder is used on a
Nadia   // search box. To get around this issue, we are forced to ignore all
Nadia   // `input` events in IE and keep using `keyup`.
Nadia   if (disableInputEvents) {
NadiaNadiaself.$selection.off('input.search input.searchcheck');
NadiaNadiareturn;
Nadia   }

Nadia   // Unbind the duplicated `keyup` event
Nadia   self.$selection.off('keyup.search');
Nadia }
    );

    this.$selection.on(
Nadia 'keyup.search input.search',
Nadia '.select2-search--inline',
Nadia function (evt) {
Nadia   // IE will trigger the `input` event when a placeholder is used on a
Nadia   // search box. To get around this issue, we are forced to ignore all
Nadia   // `input` events in IE and keep using `keyup`.
Nadia   if (disableInputEvents && evt.type === 'input') {
NadiaNadiaself.$selection.off('input.search input.searchcheck');
NadiaNadiareturn;
Nadia   }

Nadia   var key = evt.which;

Nadia   // We can freely ignore events from modifier keys
Nadia   if (key == KEYS.SHIFT || key == KEYS.CTRL || key == KEYS.ALT) {
NadiaNadiareturn;
Nadia   }

Nadia   // Tabbing will be handled during the `keydown` phase
Nadia   if (key == KEYS.TAB) {
NadiaNadiareturn;
Nadia   }

Nadia   self.handleSearch(evt);
Nadia }
    );
  };

  /**
   * This method will transfer the tabindex attribute from the rendered
   * selection to the search box. This allows for the search box to be used as
   * the primary focus instead of the selection container.
   *
   * @private
   */
  Search.prototype._transferTabIndex = function (decorated) {
    this.$search.attr('tabindex', this.$selection.attr('tabindex'));
    this.$selection.attr('tabindex', '-1');
  };

  Search.prototype.createPlaceholder = function (decorated, placeholder) {
    this.$search.attr('placeholder', placeholder.text);
  };

  Search.prototype.update = function (decorated, data) {
    var searchHadFocus = this.$search[0] == document.activeElement;

    this.$search.attr('placeholder', '');

    decorated.call(this, data);

    this.$selection.find('.select2-selection__rendered')
NadiaNadiaNadia    .append(this.$searchContainer);

    this.resizeSearch();
    if (searchHadFocus) {
Nadia this.$search.focus();
    }
  };

  Search.prototype.handleSearch = function () {
    this.resizeSearch();

    if (!this._keyUpPrevented) {
Nadia var input = this.$search.val();

Nadia this.trigger('query', {
Nadia   term: input
Nadia });
    }

    this._keyUpPrevented = false;
  };

  Search.prototype.searchRemoveChoice = function (decorated, item) {
    this.trigger('unselect', {
Nadia data: item
    });

    this.$search.val(item.text);
    this.handleSearch();
  };

  Search.prototype.resizeSearch = function () {
    this.$search.css('width', '25px');

    var width = '';

    if (this.$search.attr('placeholder') !== '') {
Nadia width = this.$selection.find('.select2-selection__rendered').innerWidth();
    } else {
Nadia var minimumWidth = this.$search.val().length + 1;

Nadia width = (minimumWidth * 0.75) + 'em';
    }

    this.$search.css('width', width);
  };

  return Search;
});

S2.define('select2/selection/eventRelay',[
  'jquery'
], function ($) {
  function EventRelay () { }

  EventRelay.prototype.bind = function (decorated, container, $container) {
    var self = this;
    var relayEvents = [
Nadia 'open', 'opening',
Nadia 'close', 'closing',
Nadia 'select', 'selecting',
Nadia 'unselect', 'unselecting'
    ];

    var preventableEvents = ['opening', 'closing', 'selecting', 'unselecting'];

    decorated.call(this, container, $container);

    container.on('*', function (name, params) {
Nadia // Ignore events that should not be relayed
Nadia if ($.inArray(name, relayEvents) === -1) {
Nadia   return;
Nadia }

Nadia // The parameters should always be an object
Nadia params = params || {};

Nadia // Generate the jQuery event for the Select2 event
Nadia var evt = $.Event('select2:' + name, {
Nadia   params: params
Nadia });

Nadia self.$element.trigger(evt);

Nadia // Only handle preventable events if it was one
Nadia if ($.inArray(name, preventableEvents) === -1) {
Nadia   return;
Nadia }

Nadia params.prevented = evt.isDefaultPrevented();
    });
  };

  return EventRelay;
});

S2.define('select2/translation',[
  'jquery',
  'require'
], function ($, require) {
  function Translation (dict) {
    this.dict = dict || {};
  }

  Translation.prototype.all = function () {
    return this.dict;
  };

  Translation.prototype.get = function (key) {
    return this.dict[key];
  };

  Translation.prototype.extend = function (translation) {
    this.dict = $.extend({}, translation.all(), this.dict);
  };

  // Static functions

  Translation._cache = {};

  Translation.loadPath = function (path) {
    if (!(path in Translation._cache)) {
Nadia var translations = require(path);

Nadia Translation._cache[path] = translations;
    }

    return new Translation(Translation._cache[path]);
  };

  return Translation;
});

S2.define('select2/diacritics',[

], function () {
  var diacritics = {
    '\u24B6': 'A',
    '\uFF21': 'A',
    '\u00C0': 'A',
    '\u00C1': 'A',
    '\u00C2': 'A',
    '\u1EA6': 'A',
    '\u1EA4': 'A',
    '\u1EAA': 'A',
    '\u1EA8': 'A',
    '\u00C3': 'A',
    '\u0100': 'A',
    '\u0102': 'A',
    '\u1EB0': 'A',
    '\u1EAE': 'A',
    '\u1EB4': 'A',
    '\u1EB2': 'A',
    '\u0226': 'A',
    '\u01E0': 'A',
    '\u00C4': 'A',
    '\u01DE': 'A',
    '\u1EA2': 'A',
    '\u00C5': 'A',
    '\u01FA': 'A',
    '\u01CD': 'A',
    '\u0200': 'A',
    '\u0202': 'A',
    '\u1EA0': 'A',
    '\u1EAC': 'A',
    '\u1EB6': 'A',
    '\u1E00': 'A',
    '\u0104': 'A',
    '\u023A': 'A',
    '\u2C6F': 'A',
    '\uA732': 'AA',
    '\u00C6': 'AE',
    '\u01FC': 'AE',
    '\u01E2': 'AE',
    '\uA734': 'AO',
    '\uA736': 'AU',
    '\uA738': 'AV',
    '\uA73A': 'AV',
    '\uA73C': 'AY',
    '\u24B7': 'B',
    '\uFF22': 'B',
    '\u1E02': 'B',
    '\u1E04': 'B',
    '\u1E06': 'B',
    '\u0243': 'B',
    '\u0182': 'B',
    '\u0181': 'B',
    '\u24B8': 'C',
    '\uFF23': 'C',
    '\u0106': 'C',
    '\u0108': 'C',
    '\u010A': 'C',
    '\u010C': 'C',
    '\u00C7': 'C',
    '\u1E08': 'C',
    '\u0187': 'C',
    '\u023B': 'C',
    '\uA73E': 'C',
    '\u24B9': 'D',
    '\uFF24': 'D',
    '\u1E0A': 'D',
    '\u010E': 'D',
    '\u1E0C': 'D',
    '\u1E10': 'D',
    '\u1E12': 'D',
    '\u1E0E': 'D',
    '\u0110': 'D',
    '\u018B': 'D',
    '\u018A': 'D',
    '\u0189': 'D',
    '\uA779': 'D',
    '\u01F1': 'DZ',
    '\u01C4': 'DZ',
    '\u01F2': 'Dz',
    '\u01C5': 'Dz',
    '\u24BA': 'E',
    '\uFF25': 'E',
    '\u00C8': 'E',
    '\u00C9': 'E',
    '\u00CA': 'E',
    '\u1EC0': 'E',
    '\u1EBE': 'E',
    '\u1EC4': 'E',
    '\u1EC2': 'E',
    '\u1EBC': 'E',
    '\u0112': 'E',
    '\u1E14': 'E',
    '\u1E16': 'E',
    '\u0114': 'E',
    '\u0116': 'E',
    '\u00CB': 'E',
    '\u1EBA': 'E',
    '\u011A': 'E',
    '\u0204': 'E',
    '\u0206': 'E',
    '\u1EB8': 'E',
    '\u1EC6': 'E',
    '\u0228': 'E',
    '\u1E1C': 'E',
    '\u0118': 'E',
    '\u1E18': 'E',
    '\u1E1A': 'E',
    '\u0190': 'E',
    '\u018E': 'E',
    '\u24BB': 'F',
    '\uFF26': 'F',
    '\u1E1E': 'F',
    '\u0191': 'F',
    '\uA77B': 'F',
    '\u24BC': 'G',
    '\uFF27': 'G',
    '\u01F4': 'G',
    '\u011C': 'G',
    '\u1E20': 'G',
    '\u011E': 'G',
    '\u0120': 'G',
    '\u01E6': 'G',
    '\u0122': 'G',
    '\u01E4': 'G',
    '\u0193': 'G',
    '\uA7A0': 'G',
    '\uA77D': 'G',
    '\uA77E': 'G',
    '\u24BD': 'H',
    '\uFF28': 'H',
    '\u0124': 'H',
    '\u1E22': 'H',
    '\u1E26': 'H',
    '\u021E': 'H',
    '\u1E24': 'H',
    '\u1E28': 'H',
    '\u1E2A': 'H',
    '\u0126': 'H',
    '\u2C67': 'H',
    '\u2C75': 'H',
    '\uA78D': 'H',
    '\u24BE': 'I',
    '\uFF29': 'I',
    '\u00CC': 'I',
    '\u00CD': 'I',
    '\u00CE': 'I',
    '\u0128': 'I',
    '\u012A': 'I',
    '\u012C': 'I',
    '\u0130': 'I',
    '\u00CF': 'I',
    '\u1E2E': 'I',
    '\u1EC8': 'I',
    '\u01CF': 'I',
    '\u0208': 'I',
    '\u020A': 'I',
    '\u1ECA': 'I',
    '\u012E': 'I',
    '\u1E2C': 'I',
    '\u0197': 'I',
    '\u24BF': 'J',
    '\uFF2A': 'J',
    '\u0134': 'J',
    '\u0248': 'J',
    '\u24C0': 'K',
    '\uFF2B': 'K',
    '\u1E30': 'K',
    '\u01E8': 'K',
    '\u1E32': 'K',
    '\u0136': 'K',
    '\u1E34': 'K',
    '\u0198': 'K',
    '\u2C69': 'K',
    '\uA740': 'K',
    '\uA742': 'K',
    '\uA744': 'K',
    '\uA7A2': 'K',
    '\u24C1': 'L',
    '\uFF2C': 'L',
    '\u013F': 'L',
    '\u0139': 'L',
    '\u013D': 'L',
    '\u1E36': 'L',
    '\u1E38': 'L',
    '\u013B': 'L',
    '\u1E3C': 'L',
    '\u1E3A': 'L',
    '\u0141': 'L',
    '\u023D': 'L',
    '\u2C62': 'L',
    '\u2C60': 'L',
    '\uA748': 'L',
    '\uA746': 'L',
    '\uA780': 'L',
    '\u01C7': 'LJ',
    '\u01C8': 'Lj',
    '\u24C2': 'M',
    '\uFF2D': 'M',
    '\u1E3E': 'M',
    '\u1E40': 'M',
    '\u1E42': 'M',
    '\u2C6E': 'M',
    '\u019C': 'M',
    '\u24C3': 'N',
    '\uFF2E': 'N',
    '\u01F8': 'N',
    '\u0143': 'N',
    '\u00D1': 'N',
    '\u1E44': 'N',
    '\u0147': 'N',
    '\u1E46': 'N',
    '\u0145': 'N',
    '\u1E4A': 'N',
    '\u1E48': 'N',
    '\u0220': 'N',
    '\u019D': 'N',
    '\uA790': 'N',
    '\uA7A4': 'N',
    '\u01CA': 'NJ',
    '\u01CB': 'Nj',
    '\u24C4': 'O',
    '\uFF2F': 'O',
    '\u00D2': 'O',
    '\u00D3': 'O',
    '\u00D4': 'O',
    '\u1ED2': 'O',
    '\u1ED0': 'O',
    '\u1ED6': 'O',
    '\u1ED4': 'O',
    '\u00D5': 'O',
    '\u1E4C': 'O',
    '\u022C': 'O',
    '\u1E4E': 'O',
    '\u014C': 'O',
    '\u1E50': 'O',
    '\u1E52': 'O',
    '\u014E': 'O',
    '\u022E': 'O',
    '\u0230': 'O',
    '\u00D6': 'O',
    '\u022A': 'O',
    '\u1ECE': 'O',
    '\u0150': 'O',
    '\u01D1': 'O',
    '\u020C': 'O',
    '\u020E': 'O',
    '\u01A0': 'O',
    '\u1EDC': 'O',
    '\u1EDA': 'O',
    '\u1EE0': 'O',
    '\u1EDE': 'O',
    '\u1EE2': 'O',
    '\u1ECC': 'O',
    '\u1ED8': 'O',
    '\u01EA': 'O',
    '\u01EC': 'O',
    '\u00D8': 'O',
    '\u01FE': 'O',
    '\u0186': 'O',
    '\u019F': 'O',
    '\uA74A': 'O',
    '\uA74C': 'O',
    '\u01A2': 'OI',
    '\uA74E': 'OO',
    '\u0222': 'OU',
    '\u24C5': 'P',
    '\uFF30': 'P',
    '\u1E54': 'P',
    '\u1E56': 'P',
    '\u01A4': 'P',
    '\u2C63': 'P',
    '\uA750': 'P',
    '\uA752': 'P',
    '\uA754': 'P',
    '\u24C6': 'Q',
    '\uFF31': 'Q',
    '\uA756': 'Q',
    '\uA758': 'Q',
    '\u024A': 'Q',
    '\u24C7': 'R',
    '\uFF32': 'R',
    '\u0154': 'R',
    '\u1E58': 'R',
    '\u0158': 'R',
    '\u0210': 'R',
    '\u0212': 'R',
    '\u1E5A': 'R',
    '\u1E5C': 'R',
    '\u0156': 'R',
    '\u1E5E': 'R',
    '\u024C': 'R',
    '\u2C64': 'R',
    '\uA75A': 'R',
    '\uA7A6': 'R',
    '\uA782': 'R',
    '\u24C8': 'S',
    '\uFF33': 'S',
    '\u1E9E': 'S',
    '\u015A': 'S',
    '\u1E64': 'S',
    '\u015C': 'S',
    '\u1E60': 'S',
    '\u0160': 'S',
    '\u1E66': 'S',
    '\u1E62': 'S',
    '\u1E68': 'S',
    '\u0218': 'S',
    '\u015E': 'S',
    '\u2C7E': 'S',
    '\uA7A8': 'S',
    '\uA784': 'S',
    '\u24C9': 'T',
    '\uFF34': 'T',
    '\u1E6A': 'T',
    '\u0164': 'T',
    '\u1E6C': 'T',
    '\u021A': 'T',
    '\u0162': 'T',
    '\u1E70': 'T',
    '\u1E6E': 'T',
    '\u0166': 'T',
    '\u01AC': 'T',
    '\u01AE': 'T',
    '\u023E': 'T',
    '\uA786': 'T',
    '\uA728': 'TZ',
    '\u24CA': 'U',
    '\uFF35': 'U',
    '\u00D9': 'U',
    '\u00DA': 'U',
    '\u00DB': 'U',
    '\u0168': 'U',
    '\u1E78': 'U',
    '\u016A': 'U',
    '\u1E7A': 'U',
    '\u016C': 'U',
    '\u00DC': 'U',
    '\u01DB': 'U',
    '\u01D7': 'U',
    '\u01D5': 'U',
    '\u01D9': 'U',
    '\u1EE6': 'U',
    '\u016E': 'U',
    '\u0170': 'U',
    '\u01D3': 'U',
    '\u0214': 'U',
    '\u0216': 'U',
    '\u01AF': 'U',
    '\u1EEA': 'U',
    '\u1EE8': 'U',
    '\u1EEE': 'U',
    '\u1EEC': 'U',
    '\u1EF0': 'U',
    '\u1EE4': 'U',
    '\u1E72': 'U',
    '\u0172': 'U',
    '\u1E76': 'U',
    '\u1E74': 'U',
    '\u0244': 'U',
    '\u24CB': 'V',
    '\uFF36': 'V',
    '\u1E7C': 'V',
    '\u1E7E': 'V',
    '\u01B2': 'V',
    '\uA75E': 'V',
    '\u0245': 'V',
    '\uA760': 'VY',
    '\u24CC': 'W',
    '\uFF37': 'W',
    '\u1E80': 'W',
    '\u1E82': 'W',
    '\u0174': 'W',
    '\u1E86': 'W',
    '\u1E84': 'W',
    '\u1E88': 'W',
    '\u2C72': 'W',
    '\u24CD': 'X',
    '\uFF38': 'X',
    '\u1E8A': 'X',
    '\u1E8C': 'X',
    '\u24CE': 'Y',
    '\uFF39': 'Y',
    '\u1EF2': 'Y',
    '\u00DD': 'Y',
    '\u0176': 'Y',
    '\u1EF8': 'Y',
    '\u0232': 'Y',
    '\u1E8E': 'Y',
    '\u0178': 'Y',
    '\u1EF6': 'Y',
    '\u1EF4': 'Y',
    '\u01B3': 'Y',
    '\u024E': 'Y',
    '\u1EFE': 'Y',
    '\u24CF': 'Z',
    '\uFF3A': 'Z',
    '\u0179': 'Z',
    '\u1E90': 'Z',
    '\u017B': 'Z',
    '\u017D': 'Z',
    '\u1E92': 'Z',
    '\u1E94': 'Z',
    '\u01B5': 'Z',
    '\u0224': 'Z',
    '\u2C7F': 'Z',
    '\u2C6B': 'Z',
    '\uA762': 'Z',
    '\u24D0': 'a',
    '\uFF41': 'a',
    '\u1E9A': 'a',
    '\u00E0': 'a',
    '\u00E1': 'a',
    '\u00E2': 'a',
    '\u1EA7': 'a',
    '\u1EA5': 'a',
    '\u1EAB': 'a',
    '\u1EA9': 'a',
    '\u00E3': 'a',
    '\u0101': 'a',
    '\u0103': 'a',
    '\u1EB1': 'a',
    '\u1EAF': 'a',
    '\u1EB5': 'a',
    '\u1EB3': 'a',
    '\u0227': 'a',
    '\u01E1': 'a',
    '\u00E4': 'a',
    '\u01DF': 'a',
    '\u1EA3': 'a',
    '\u00E5': 'a',
    '\u01FB': 'a',
    '\u01CE': 'a',
    '\u0201': 'a',
    '\u0203': 'a',
    '\u1EA1': 'a',
    '\u1EAD': 'a',
    '\u1EB7': 'a',
    '\u1E01': 'a',
    '\u0105': 'a',
    '\u2C65': 'a',
    '\u0250': 'a',
    '\uA733': 'aa',
    '\u00E6': 'ae',
    '\u01FD': 'ae',
    '\u01E3': 'ae',
    '\uA735': 'ao',
    '\uA737': 'au',
    '\uA739': 'av',
    '\uA73B': 'av',
    '\uA73D': 'ay',
    '\u24D1': 'b',
    '\uFF42': 'b',
    '\u1E03': 'b',
    '\u1E05': 'b',
    '\u1E07': 'b',
    '\u0180': 'b',
    '\u0183': 'b',
    '\u0253': 'b',
    '\u24D2': 'c',
    '\uFF43': 'c',
    '\u0107': 'c',
    '\u0109': 'c',
    '\u010B': 'c',
    '\u010D': 'c',
    '\u00E7': 'c',
    '\u1E09': 'c',
    '\u0188': 'c',
    '\u023C': 'c',
    '\uA73F': 'c',
    '\u2184': 'c',
    '\u24D3': 'd',
    '\uFF44': 'd',
    '\u1E0B': 'd',
    '\u010F': 'd',
    '\u1E0D': 'd',
    '\u1E11': 'd',
    '\u1E13': 'd',
    '\u1E0F': 'd',
    '\u0111': 'd',
    '\u018C': 'd',
    '\u0256': 'd',
    '\u0257': 'd',
    '\uA77A': 'd',
    '\u01F3': 'dz',
    '\u01C6': 'dz',
    '\u24D4': 'e',
    '\uFF45': 'e',
    '\u00E8': 'e',
    '\u00E9': 'e',
    '\u00EA': 'e',
    '\u1EC1': 'e',
    '\u1EBF': 'e',
    '\u1EC5': 'e',
    '\u1EC3': 'e',
    '\u1EBD': 'e',
    '\u0113': 'e',
    '\u1E15': 'e',
    '\u1E17': 'e',
    '\u0115': 'e',
    '\u0117': 'e',
    '\u00EB': 'e',
    '\u1EBB': 'e',
    '\u011B': 'e',
    '\u0205': 'e',
    '\u0207': 'e',
    '\u1EB9': 'e',
    '\u1EC7': 'e',
    '\u0229': 'e',
    '\u1E1D': 'e',
    '\u0119': 'e',
    '\u1E19': 'e',
    '\u1E1B': 'e',
    '\u0247': 'e',
    '\u025B': 'e',
    '\u01DD': 'e',
    '\u24D5': 'f',
    '\uFF46': 'f',
    '\u1E1F': 'f',
    '\u0192': 'f',
    '\uA77C': 'f',
    '\u24D6': 'g',
    '\uFF47': 'g',
    '\u01F5': 'g',
    '\u011D': 'g',
    '\u1E21': 'g',
    '\u011F': 'g',
    '\u0121': 'g',
    '\u01E7': 'g',
    '\u0123': 'g',
    '\u01E5': 'g',
    '\u0260': 'g',
    '\uA7A1': 'g',
    '\u1D79': 'g',
    '\uA77F': 'g',
    '\u24D7': 'h',
    '\uFF48': 'h',
    '\u0125': 'h',
    '\u1E23': 'h',
    '\u1E27': 'h',
    '\u021F': 'h',
    '\u1E25': 'h',
    '\u1E29': 'h',
    '\u1E2B': 'h',
    '\u1E96': 'h',
    '\u0127': 'h',
    '\u2C68': 'h',
    '\u2C76': 'h',
    '\u0265': 'h',
    '\u0195': 'hv',
    '\u24D8': 'i',
    '\uFF49': 'i',
    '\u00EC': 'i',
    '\u00ED': 'i',
    '\u00EE': 'i',
    '\u0129': 'i',
    '\u012B': 'i',
    '\u012D': 'i',
    '\u00EF': 'i',
    '\u1E2F': 'i',
    '\u1EC9': 'i',
    '\u01D0': 'i',
    '\u0209': 'i',
    '\u020B': 'i',
    '\u1ECB': 'i',
    '\u012F': 'i',
    '\u1E2D': 'i',
    '\u0268': 'i',
    '\u0131': 'i',
    '\u24D9': 'j',
    '\uFF4A': 'j',
    '\u0135': 'j',
    '\u01F0': 'j',
    '\u0249': 'j',
    '\u24DA': 'k',
    '\uFF4B': 'k',
    '\u1E31': 'k',
    '\u01E9': 'k',
    '\u1E33': 'k',
    '\u0137': 'k',
    '\u1E35': 'k',
    '\u0199': 'k',
    '\u2C6A': 'k',
    '\uA741': 'k',
    '\uA743': 'k',
    '\uA745': 'k',
    '\uA7A3': 'k',
    '\u24DB': 'l',
    '\uFF4C': 'l',
    '\u0140': 'l',
    '\u013A': 'l',
    '\u013E': 'l',
    '\u1E37': 'l',
    '\u1E39': 'l',
    '\u013C': 'l',
    '\u1E3D': 'l',
    '\u1E3B': 'l',
    '\u017F': 'l',
    '\u0142': 'l',
    '\u019A': 'l',
    '\u026B': 'l',
    '\u2C61': 'l',
    '\uA749': 'l',
    '\uA781': 'l',
    '\uA747': 'l',
    '\u01C9': 'lj',
    '\u24DC': 'm',
    '\uFF4D': 'm',
    '\u1E3F': 'm',
    '\u1E41': 'm',
    '\u1E43': 'm',
    '\u0271': 'm',
    '\u026F': 'm',
    '\u24DD': 'n',
    '\uFF4E': 'n',
    '\u01F9': 'n',
    '\u0144': 'n',
    '\u00F1': 'n',
    '\u1E45': 'n',
    '\u0148': 'n',
    '\u1E47': 'n',
    '\u0146': 'n',
    '\u1E4B': 'n',
    '\u1E49': 'n',
    '\u019E': 'n',
    '\u0272': 'n',
    '\u0149': 'n',
    '\uA791': 'n',
    '\uA7A5': 'n',
    '\u01CC': 'nj',
    '\u24DE': 'o',
    '\uFF4F': 'o',
    '\u00F2': 'o',
    '\u00F3': 'o',
    '\u00F4': 'o',
    '\u1ED3': 'o',
    '\u1ED1': 'o',
    '\u1ED7': 'o',
    '\u1ED5': 'o',
    '\u00F5': 'o',
    '\u1E4D': 'o',
    '\u022D': 'o',
    '\u1E4F': 'o',
    '\u014D': 'o',
    '\u1E51': 'o',
    '\u1E53': 'o',
    '\u014F': 'o',
    '\u022F': 'o',
    '\u0231': 'o',
    '\u00F6': 'o',
    '\u022B': 'o',
    '\u1ECF': 'o',
    '\u0151': 'o',
    '\u01D2': 'o',
    '\u020D': 'o',
    '\u020F': 'o',
    '\u01A1': 'o',
    '\u1EDD': 'o',
    '\u1EDB': 'o',
    '\u1EE1': 'o',
    '\u1EDF': 'o',
    '\u1EE3': 'o',
    '\u1ECD': 'o',
    '\u1ED9': 'o',
    '\u01EB': 'o',
    '\u01ED': 'o',
    '\u00F8': 'o',
    '\u01FF': 'o',
    '\u0254': 'o',
    '\uA74B': 'o',
    '\uA74D': 'o',
    '\u0275': 'o',
    '\u01A3': 'oi',
    '\u0223': 'ou',
    '\uA74F': 'oo',
    '\u24DF': 'p',
    '\uFF50': 'p',
    '\u1E55': 'p',
    '\u1E57': 'p',
    '\u01A5': 'p',
    '\u1D7D': 'p',
    '\uA751': 'p',
    '\uA753': 'p',
    '\uA755': 'p',
    '\u24E0': 'q',
    '\uFF51': 'q',
    '\u024B': 'q',
    '\uA757': 'q',
    '\uA759': 'q',
    '\u24E1': 'r',
    '\uFF52': 'r',
    '\u0155': 'r',
    '\u1E59': 'r',
    '\u0159': 'r',
    '\u0211': 'r',
    '\u0213': 'r',
    '\u1E5B': 'r',
    '\u1E5D': 'r',
    '\u0157': 'r',
    '\u1E5F': 'r',
    '\u024D': 'r',
    '\u027D': 'r',
    '\uA75B': 'r',
    '\uA7A7': 'r',
    '\uA783': 'r',
    '\u24E2': 's',
    '\uFF53': 's',
    '\u00DF': 's',
    '\u015B': 's',
    '\u1E65': 's',
    '\u015D': 's',
    '\u1E61': 's',
    '\u0161': 's',
    '\u1E67': 's',
    '\u1E63': 's',
    '\u1E69': 's',
    '\u0219': 's',
    '\u015F': 's',
    '\u023F': 's',
    '\uA7A9': 's',
    '\uA785': 's',
    '\u1E9B': 's',
    '\u24E3': 't',
    '\uFF54': 't',
    '\u1E6B': 't',
    '\u1E97': 't',
    '\u0165': 't',
    '\u1E6D': 't',
    '\u021B': 't',
    '\u0163': 't',
    '\u1E71': 't',
    '\u1E6F': 't',
    '\u0167': 't',
    '\u01AD': 't',
    '\u0288': 't',
    '\u2C66': 't',
    '\uA787': 't',
    '\uA729': 'tz',
    '\u24E4': 'u',
    '\uFF55': 'u',
    '\u00F9': 'u',
    '\u00FA': 'u',
    '\u00FB': 'u',
    '\u0169': 'u',
    '\u1E79': 'u',
    '\u016B': 'u',
    '\u1E7B': 'u',
    '\u016D': 'u',
    '\u00FC': 'u',
    '\u01DC': 'u',
    '\u01D8': 'u',
    '\u01D6': 'u',
    '\u01DA': 'u',
    '\u1EE7': 'u',
    '\u016F': 'u',
    '\u0171': 'u',
    '\u01D4': 'u',
    '\u0215': 'u',
    '\u0217': 'u',
    '\u01B0': 'u',
    '\u1EEB': 'u',
    '\u1EE9': 'u',
    '\u1EEF': 'u',
    '\u1EED': 'u',
    '\u1EF1': 'u',
    '\u1EE5': 'u',
    '\u1E73': 'u',
    '\u0173': 'u',
    '\u1E77': 'u',
    '\u1E75': 'u',
    '\u0289': 'u',
    '\u24E5': 'v',
    '\uFF56': 'v',
    '\u1E7D': 'v',
    '\u1E7F': 'v',
    '\u028B': 'v',
    '\uA75F': 'v',
    '\u028C': 'v',
    '\uA761': 'vy',
    '\u24E6': 'w',
    '\uFF57': 'w',
    '\u1E81': 'w',
    '\u1E83': 'w',
    '\u0175': 'w',
    '\u1E87': 'w',
    '\u1E85': 'w',
    '\u1E98': 'w',
    '\u1E89': 'w',
    '\u2C73': 'w',
    '\u24E7': 'x',
    '\uFF58': 'x',
    '\u1E8B': 'x',
    '\u1E8D': 'x',
    '\u24E8': 'y',
    '\uFF59': 'y',
    '\u1EF3': 'y',
    '\u00FD': 'y',
    '\u0177': 'y',
    '\u1EF9': 'y',
    '\u0233': 'y',
    '\u1E8F': 'y',
    '\u00FF': 'y',
    '\u1EF7': 'y',
    '\u1E99': 'y',
    '\u1EF5': 'y',
    '\u01B4': 'y',
    '\u024F': 'y',
    '\u1EFF': 'y',
    '\u24E9': 'z',
    '\uFF5A': 'z',
    '\u017A': 'z',
    '\u1E91': 'z',
    '\u017C': 'z',
    '\u017E': 'z',
    '\u1E93': 'z',
    '\u1E95': 'z',
    '\u01B6': 'z',
    '\u0225': 'z',
    '\u0240': 'z',
    '\u2C6C': 'z',
    '\uA763': 'z',
    '\u0386': '\u0391',
    '\u0388': '\u0395',
    '\u0389': '\u0397',
    '\u038A': '\u0399',
    '\u03AA': '\u0399',
    '\u038C': '\u039F',
    '\u038E': '\u03A5',
    '\u03AB': '\u03A5',
    '\u038F': '\u03A9',
    '\u03AC': '\u03B1',
    '\u03AD': '\u03B5',
    '\u03AE': '\u03B7',
    '\u03AF': '\u03B9',
    '\u03CA': '\u03B9',
    '\u0390': '\u03B9',
    '\u03CC': '\u03BF',
    '\u03CD': '\u03C5',
    '\u03CB': '\u03C5',
    '\u03B0': '\u03C5',
    '\u03C9': '\u03C9',
    '\u03C2': '\u03C3'
  };

  return diacritics;
});

S2.define('select2/data/base',[
  '../utils'
], function (Utils) {
  function BaseAdapter ($element, options) {
    BaseAdapter.__super__.constructor.call(this);
  }

  Utils.Extend(BaseAdapter, Utils.Observable);

  BaseAdapter.prototype.current = function (callback) {
    throw new Error('The `current` method must be defined in child classes.');
  };

  BaseAdapter.prototype.query = function (params, callback) {
    throw new Error('The `query` method must be defined in child classes.');
  };

  BaseAdapter.prototype.bind = function (container, $container) {
    // Can be implemented in subclasses
  };

  BaseAdapter.prototype.destroy = function () {
    // Can be implemented in subclasses
  };

  BaseAdapter.prototype.generateResultId = function (container, data) {
    var id = container.id + '-result-';

    id += Utils.generateChars(4);

    if (data.id != null) {
Nadia id += '-' + data.id.toString();
    } else {
Nadia id += '-' + Utils.generateChars(4);
    }
    return id;
  };

  return BaseAdapter;
});

S2.define('select2/data/select',[
  './base',
  '../utils',
  'jquery'
], function (BaseAdapter, Utils, $) {
  function SelectAdapter ($element, options) {
    this.$element = $element;
    this.options = options;

    SelectAdapter.__super__.constructor.call(this);
  }

  Utils.Extend(SelectAdapter, BaseAdapter);

  SelectAdapter.prototype.current = function (callback) {
    var data = [];
    var self = this;

    this.$element.find(':selected').each(function () {
Nadia var $option = $(this);

Nadia var option = self.item($option);

Nadia data.push(option);
    });

    callback(data);
  };

  SelectAdapter.prototype.select = function (data) {
    var self = this;

    data.selected = true;

    // If data.element is a DOM node, use it instead
    if ($(data.element).is('option')) {
Nadia data.element.selected = true;

Nadia this.$element.trigger('change');

Nadia return;
    }

    if (this.$element.prop('multiple')) {
Nadia this.current(function (currentData) {
Nadia   var val = [];

Nadia   data = [data];
Nadia   data.push.apply(data, currentData);

Nadia   for (var d = 0; d < data.length; d++) {
NadiaNadiavar id = data[d].id;

NadiaNadiaif ($.inArray(id, val) === -1) {
NadiaNadia  val.push(id);
NadiaNadia}
Nadia   }

Nadia   self.$element.val(val);
Nadia   self.$element.trigger('change');
Nadia });
    } else {
Nadia var val = data.id;

Nadia this.$element.val(val);
Nadia this.$element.trigger('change');
    }
  };

  SelectAdapter.prototype.unselect = function (data) {
    var self = this;

    if (!this.$element.prop('multiple')) {
Nadia return;
    }

    data.selected = false;

    if ($(data.element).is('option')) {
Nadia data.element.selected = false;

Nadia this.$element.trigger('change');

Nadia return;
    }

    this.current(function (currentData) {
Nadia var val = [];

Nadia for (var d = 0; d < currentData.length; d++) {
Nadia   var id = currentData[d].id;

Nadia   if (id !== data.id && $.inArray(id, val) === -1) {
NadiaNadiaval.push(id);
Nadia   }
Nadia }

Nadia self.$element.val(val);

Nadia self.$element.trigger('change');
    });
  };

  SelectAdapter.prototype.bind = function (container, $container) {
    var self = this;

    this.container = container;

    container.on('select', function (params) {
Nadia self.select(params.data);
    });

    container.on('unselect', function (params) {
Nadia self.unselect(params.data);
    });
  };

  SelectAdapter.prototype.destroy = function () {
    // Remove anything added to child elements
    this.$element.find('*').each(function () {
Nadia // Remove any custom data set by Select2
Nadia $.removeData(this, 'data');
    });
  };

  SelectAdapter.prototype.query = function (params, callback) {
    var data = [];
    var self = this;

    var $options = this.$element.children();

    $options.each(function () {
Nadia var $option = $(this);

Nadia if (!$option.is('option') && !$option.is('optgroup')) {
Nadia   return;
Nadia }

Nadia var option = self.item($option);

Nadia var matches = self.matches(params, option);

Nadia if (matches !== null) {
Nadia   data.push(matches);
Nadia }
    });

    callback({
Nadia results: data
    });
  };

  SelectAdapter.prototype.addOptions = function ($options) {
    Utils.appendMany(this.$element, $options);
  };

  SelectAdapter.prototype.option = function (data) {
    var option;

    if (data.children) {
Nadia option = document.createElement('optgroup');
Nadia option.label = data.text;
    } else {
Nadia option = document.createElement('option');

Nadia if (option.textContent !== undefined) {
Nadia   option.textContent = data.text;
Nadia } else {
Nadia   option.innerText = data.text;
Nadia }
    }

    if (data.id) {
Nadia option.value = data.id;
    }

    if (data.disabled) {
Nadia option.disabled = true;
    }

    if (data.selected) {
Nadia option.selected = true;
    }

    if (data.title) {
Nadia option.title = data.title;
    }

    var $option = $(option);

    var normalizedData = this._normalizeItem(data);
    normalizedData.element = option;

    // Override the option's data with the combined data
    $.data(option, 'data', normalizedData);

    return $option;
  };

  SelectAdapter.prototype.item = function ($option) {
    var data = {};

    data = $.data($option[0], 'data');

    if (data != null) {
Nadia return data;
    }

    if ($option.is('option')) {
Nadia data = {
Nadia   id: $option.val(),
Nadia   text: $option.text(),
Nadia   disabled: $option.prop('disabled'),
Nadia   selected: $option.prop('selected'),
Nadia   title: $option.prop('title')
Nadia };
    } else if ($option.is('optgroup')) {
Nadia data = {
Nadia   text: $option.prop('label'),
Nadia   children: [],
Nadia   title: $option.prop('title')
Nadia };

Nadia var $children = $option.children('option');
Nadia var children = [];

Nadia for (var c = 0; c < $children.length; c++) {
Nadia   var $child = $($children[c]);

Nadia   var child = this.item($child);

Nadia   children.push(child);
Nadia }

Nadia data.children = children;
    }

    data = this._normalizeItem(data);
    data.element = $option[0];

    $.data($option[0], 'data', data);

    return data;
  };

  SelectAdapter.prototype._normalizeItem = function (item) {
    if (!$.isPlainObject(item)) {
Nadia item = {
Nadia   id: item,
Nadia   text: item
Nadia };
    }

    item = $.extend({}, {
Nadia text: ''
    }, item);

    var defaults = {
Nadia selected: false,
Nadia disabled: false
    };

    if (item.id != null) {
Nadia item.id = item.id.toString();
    }

    if (item.text != null) {
Nadia item.text = item.text.toString();
    }

    if (item._resultId == null && item.id && this.container != null) {
Nadia item._resultId = this.generateResultId(this.container, item);
    }

    return $.extend({}, defaults, item);
  };

  SelectAdapter.prototype.matches = function (params, data) {
    var matcher = this.options.get('matcher');

    return matcher(params, data);
  };

  return SelectAdapter;
});

S2.define('select2/data/array',[
  './select',
  '../utils',
  'jquery'
], function (SelectAdapter, Utils, $) {
  function ArrayAdapter ($element, options) {
    var data = options.get('data') || [];

    ArrayAdapter.__super__.constructor.call(this, $element, options);

    this.addOptions(this.convertToOptions(data));
  }

  Utils.Extend(ArrayAdapter, SelectAdapter);

  ArrayAdapter.prototype.select = function (data) {
    var $option = this.$element.find('option').filter(function (i, elm) {
Nadia return elm.value == data.id.toString();
    });

    if ($option.length === 0) {
Nadia $option = this.option(data);

Nadia this.addOptions($option);
    }

    ArrayAdapter.__super__.select.call(this, data);
  };

  ArrayAdapter.prototype.convertToOptions = function (data) {
    var self = this;

    var $existing = this.$element.find('option');
    var existingIds = $existing.map(function () {
Nadia return self.item($(this)).id;
    }).get();

    var $options = [];

    // Filter out all items except for the one passed in the argument
    function onlyItem (item) {
Nadia return function () {
Nadia   return $(this).val() == item.id;
Nadia };
    }

    for (var d = 0; d < data.length; d++) {
Nadia var item = this._normalizeItem(data[d]);

Nadia // Skip items which were pre-loaded, only merge the data
Nadia if ($.inArray(item.id, existingIds) >= 0) {
Nadia   var $existingOption = $existing.filter(onlyItem(item));

Nadia   var existingData = this.item($existingOption);
Nadia   var newData = $.extend(true, {}, item, existingData);

Nadia   var $newOption = this.option(newData);

Nadia   $existingOption.replaceWith($newOption);

Nadia   continue;
Nadia }

Nadia var $option = this.option(item);

Nadia if (item.children) {
Nadia   var $children = this.convertToOptions(item.children);

Nadia   Utils.appendMany($option, $children);
Nadia }

Nadia $options.push($option);
    }

    return $options;
  };

  return ArrayAdapter;
});

S2.define('select2/data/ajax',[
  './array',
  '../utils',
  'jquery'
], function (ArrayAdapter, Utils, $) {
  function AjaxAdapter ($element, options) {
    this.ajaxOptions = this._applyDefaults(options.get('ajax'));

    if (this.ajaxOptions.processResults != null) {
Nadia this.processResults = this.ajaxOptions.processResults;
    }

    AjaxAdapter.__super__.constructor.call(this, $element, options);
  }

  Utils.Extend(AjaxAdapter, ArrayAdapter);

  AjaxAdapter.prototype._applyDefaults = function (options) {
    var defaults = {
Nadia data: function (params) {
Nadia   return $.extend({}, params, {
NadiaNadiaq: params.term
Nadia   });
Nadia },
Nadia transport: function (params, success, failure) {
Nadia   var $request = $.ajax(params);

Nadia   $request.then(success);
Nadia   $request.fail(failure);

Nadia   return $request;
Nadia }
    };

    return $.extend({}, defaults, options, true);
  };

  AjaxAdapter.prototype.processResults = function (results) {
    return results;
  };

  AjaxAdapter.prototype.query = function (params, callback) {
    var matches = [];
    var self = this;

    if (this._request != null) {
Nadia // JSONP requests cannot always be aborted
Nadia if ($.isFunction(this._request.abort)) {
Nadia   this._request.abort();
Nadia }

Nadia this._request = null;
    }

    var options = $.extend({
Nadia type: 'GET'
    }, this.ajaxOptions);

    if (typeof options.url === 'function') {
Nadia options.url = options.url.call(this.$element, params);
    }

    if (typeof options.data === 'function') {
Nadia options.data = options.data.call(this.$element, params);
    }

    function request () {
Nadia var $request = options.transport(options, function (data) {
Nadia   var results = self.processResults(data, params);

Nadia   if (self.options.get('debug') && window.console && console.error) {
NadiaNadia// Check to make sure that the response included a `results` key.
NadiaNadiaif (!results || !results.results || !$.isArray(results.results)) {
NadiaNadia  console.error(
NadiaNadia    'Select2: The AJAX results did not return an array in the ' +
NadiaNadia    '`results` key of the response.'
NadiaNadia  );
NadiaNadia}
Nadia   }

Nadia   callback(results);
Nadia }, function () {
Nadia   // Attempt to detect if a request was aborted
Nadia   // Only works if the transport exposes a status property
Nadia   if ($request.status && $request.status === '0') {
NadiaNadiareturn;
Nadia   }

Nadia   self.trigger('results:message', {
NadiaNadiamessage: 'errorLoading'
Nadia   });
Nadia });

Nadia self._request = $request;
    }

    if (this.ajaxOptions.delay && params.term != null) {
Nadia if (this._queryTimeout) {
Nadia   window.clearTimeout(this._queryTimeout);
Nadia }

Nadia this._queryTimeout = window.setTimeout(request, this.ajaxOptions.delay);
    } else {
Nadia request();
    }
  };

  return AjaxAdapter;
});

S2.define('select2/data/tags',[
  'jquery'
], function ($) {
  function Tags (decorated, $element, options) {
    var tags = options.get('tags');

    var createTag = options.get('createTag');

    if (createTag !== undefined) {
Nadia this.createTag = createTag;
    }

    var insertTag = options.get('insertTag');

    if (insertTag !== undefined) {
Nadia   this.insertTag = insertTag;
    }

    decorated.call(this, $element, options);

    if ($.isArray(tags)) {
Nadia for (var t = 0; t < tags.length; t++) {
Nadia   var tag = tags[t];
Nadia   var item = this._normalizeItem(tag);

Nadia   var $option = this.option(item);

Nadia   this.$element.append($option);
Nadia }
    }
  }

  Tags.prototype.query = function (decorated, params, callback) {
    var self = this;

    this._removeOldTags();

    if (params.term == null || params.page != null) {
Nadia decorated.call(this, params, callback);
Nadia return;
    }

    function wrapper (obj, child) {
Nadia var data = obj.results;

Nadia for (var i = 0; i < data.length; i++) {
Nadia   var option = data[i];

Nadia   var checkChildren = (
NadiaNadiaoption.children != null &&
NadiaNadia!wrapper({
NadiaNadia  results: option.children
NadiaNadia}, true)
Nadia   );

Nadia   var checkText = option.text === params.term;

Nadia   if (checkText || checkChildren) {
NadiaNadiaif (child) {
NadiaNadia  return false;
NadiaNadia}

NadiaNadiaobj.data = data;
NadiaNadiacallback(obj);

NadiaNadiareturn;
Nadia   }
Nadia }

Nadia if (child) {
Nadia   return true;
Nadia }

Nadia var tag = self.createTag(params);

Nadia if (tag != null) {
Nadia   var $option = self.option(tag);
Nadia   $option.attr('data-select2-tag', true);

Nadia   self.addOptions([$option]);

Nadia   self.insertTag(data, tag);
Nadia }

Nadia obj.results = data;

Nadia callback(obj);
    }

    decorated.call(this, params, wrapper);
  };

  Tags.prototype.createTag = function (decorated, params) {
    var term = $.trim(params.term);

    if (term === '') {
Nadia return null;
    }

    return {
Nadia id: term,
Nadia text: term
    };
  };

  Tags.prototype.insertTag = function (_, data, tag) {
    data.unshift(tag);
  };

  Tags.prototype._removeOldTags = function (_) {
    var tag = this._lastTag;

    var $options = this.$element.find('option[data-select2-tag]');

    $options.each(function () {
Nadia if (this.selected) {
Nadia   return;
Nadia }

Nadia $(this).remove();
    });
  };

  return Tags;
});

S2.define('select2/data/tokenizer',[
  'jquery'
], function ($) {
  function Tokenizer (decorated, $element, options) {
    var tokenizer = options.get('tokenizer');

    if (tokenizer !== undefined) {
Nadia this.tokenizer = tokenizer;
    }

    decorated.call(this, $element, options);
  }

  Tokenizer.prototype.bind = function (decorated, container, $container) {
    decorated.call(this, container, $container);

    this.$search =  container.dropdown.$search || container.selection.$search ||
Nadia $container.find('.select2-search__field');
  };

  Tokenizer.prototype.query = function (decorated, params, callback) {
    var self = this;

    function createAndSelect (data) {
Nadia // Normalize the data object so we can use it for checks
Nadia var item = self._normalizeItem(data);

Nadia // Check if the data object already exists as a tag
Nadia // Select it if it doesn't
Nadia var $existingOptions = self.$element.find('option').filter(function () {
Nadia   return $(this).val() === item.id;
Nadia });

Nadia // If an existing option wasn't found for it, create the option
Nadia if (!$existingOptions.length) {
Nadia   var $option = self.option(item);
Nadia   $option.attr('data-select2-tag', true);

Nadia   self._removeOldTags();
Nadia   self.addOptions([$option]);
Nadia }

Nadia // Select the item, now that we know there is an option for it
Nadia select(item);
    }

    function select (data) {
Nadia self.trigger('select', {
Nadia   data: data
Nadia });
    }

    params.term = params.term || '';

    var tokenData = this.tokenizer(params, this.options, createAndSelect);

    if (tokenData.term !== params.term) {
Nadia // Replace the search term if we have the search box
Nadia if (this.$search.length) {
Nadia   this.$search.val(tokenData.term);
Nadia   this.$search.focus();
Nadia }

Nadia params.term = tokenData.term;
    }

    decorated.call(this, params, callback);
  };

  Tokenizer.prototype.tokenizer = function (_, params, options, callback) {
    var separators = options.get('tokenSeparators') || [];
    var term = params.term;
    var i = 0;

    var createTag = this.createTag || function (params) {
Nadia return {
Nadia   id: params.term,
Nadia   text: params.term
Nadia };
    };

    while (i < term.length) {
Nadia var termChar = term[i];

Nadia if ($.inArray(termChar, separators) === -1) {
Nadia   i++;

Nadia   continue;
Nadia }

Nadia var part = term.substr(0, i);
Nadia var partParams = $.extend({}, params, {
Nadia   term: part
Nadia });

Nadia var data = createTag(partParams);

Nadia if (data == null) {
Nadia   i++;
Nadia   continue;
Nadia }

Nadia callback(data);

Nadia // Reset the term to not include the tokenized portion
Nadia term = term.substr(i + 1) || '';
Nadia i = 0;
    }

    return {
Nadia term: term
    };
  };

  return Tokenizer;
});

S2.define('select2/data/minimumInputLength',[

], function () {
  function MinimumInputLength (decorated, $e, options) {
    this.minimumInputLength = options.get('minimumInputLength');

    decorated.call(this, $e, options);
  }

  MinimumInputLength.prototype.query = function (decorated, params, callback) {
    params.term = params.term || '';

    if (params.term.length < this.minimumInputLength) {
Nadia this.trigger('results:message', {
Nadia   message: 'inputTooShort',
Nadia   args: {
NadiaNadiaminimum: this.minimumInputLength,
NadiaNadiainput: params.term,
NadiaNadiaparams: params
Nadia   }
Nadia });

Nadia return;
    }

    decorated.call(this, params, callback);
  };

  return MinimumInputLength;
});

S2.define('select2/data/maximumInputLength',[

], function () {
  function MaximumInputLength (decorated, $e, options) {
    this.maximumInputLength = options.get('maximumInputLength');

    decorated.call(this, $e, options);
  }

  MaximumInputLength.prototype.query = function (decorated, params, callback) {
    params.term = params.term || '';

    if (this.maximumInputLength > 0 &&
Nadia   params.term.length > this.maximumInputLength) {
Nadia this.trigger('results:message', {
Nadia   message: 'inputTooLong',
Nadia   args: {
NadiaNadiamaximum: this.maximumInputLength,
NadiaNadiainput: params.term,
NadiaNadiaparams: params
Nadia   }
Nadia });

Nadia return;
    }

    decorated.call(this, params, callback);
  };

  return MaximumInputLength;
});

S2.define('select2/data/maximumSelectionLength',[

], function (){
  function MaximumSelectionLength (decorated, $e, options) {
    this.maximumSelectionLength = options.get('maximumSelectionLength');

    decorated.call(this, $e, options);
  }

  MaximumSelectionLength.prototype.query =
    function (decorated, params, callback) {
Nadia var self = this;

Nadia this.current(function (currentData) {
Nadia   var count = currentData != null ? currentData.length : 0;
Nadia   if (self.maximumSelectionLength > 0 &&
NadiaNadiacount >= self.maximumSelectionLength) {
NadiaNadiaself.trigger('results:message', {
NadiaNadia  message: 'maximumSelected',
NadiaNadia  args: {
NadiaNadia    maximum: self.maximumSelectionLength
NadiaNadia  }
NadiaNadia});
NadiaNadiareturn;
Nadia   }
Nadia   decorated.call(self, params, callback);
Nadia });
  };

  return MaximumSelectionLength;
});

S2.define('select2/dropdown',[
  'jquery',
  './utils'
], function ($, Utils) {
  function Dropdown ($element, options) {
    this.$element = $element;
    this.options = options;

    Dropdown.__super__.constructor.call(this);
  }

  Utils.Extend(Dropdown, Utils.Observable);

  Dropdown.prototype.render = function () {
    var $dropdown = $(
Nadia '<span class="select2-dropdown">' +
Nadia   '<span class="select2-results"></span>' +
Nadia '</span>'
    );

    $dropdown.attr('dir', this.options.get('dir'));

    this.$dropdown = $dropdown;

    return $dropdown;
  };

  Dropdown.prototype.bind = function () {
    // Should be implemented in subclasses
  };

  Dropdown.prototype.position = function ($dropdown, $container) {
    // Should be implmented in subclasses
  };

  Dropdown.prototype.destroy = function () {
    // Remove the dropdown from the DOM
    this.$dropdown.remove();
  };

  return Dropdown;
});

S2.define('select2/dropdown/search',[
  'jquery',
  '../utils'
], function ($, Utils) {
  function Search () { }

  Search.prototype.render = function (decorated) {
    var $rendered = decorated.call(this);

    var $search = $(
Nadia '<span class="select2-search select2-search--dropdown">' +
Nadia   '<input class="select2-search__field" type="search" tabindex="-1"' +
Nadia   ' autocomplete="off" autocorrect="off" autocapitalize="off"' +
Nadia   ' spellcheck="false" role="textbox" />' +
Nadia '</span>'
    );

    this.$searchContainer = $search;
    this.$search = $search.find('input');

    $rendered.prepend($search);

    return $rendered;
  };

  Search.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    this.$search.on('keydown', function (evt) {
Nadia self.trigger('keypress', evt);

Nadia self._keyUpPrevented = evt.isDefaultPrevented();
    });

    // Workaround for browsers which do not support the `input` event
    // This will prevent double-triggering of events for browsers which support
    // both the `keyup` and `input` events.
    this.$search.on('input', function (evt) {
Nadia // Unbind the duplicated `keyup` event
Nadia $(this).off('keyup');
    });

    this.$search.on('keyup input', function (evt) {
Nadia self.handleSearch(evt);
    });

    container.on('open', function () {
Nadia self.$search.attr('tabindex', 0);

Nadia self.$search.focus();

Nadia window.setTimeout(function () {
Nadia   self.$search.focus();
Nadia }, 0);
    });

    container.on('close', function () {
Nadia self.$search.attr('tabindex', -1);

Nadia self.$search.val('');
    });

    container.on('focus', function () {
Nadia if (container.isOpen()) {
Nadia   self.$search.focus();
Nadia }
    });

    container.on('results:all', function (params) {
Nadia if (params.query.term == null || params.query.term === '') {
Nadia   var showSearch = self.showSearch(params);

Nadia   if (showSearch) {
NadiaNadiaself.$searchContainer.removeClass('select2-search--hide');
Nadia   } else {
NadiaNadiaself.$searchContainer.addClass('select2-search--hide');
Nadia   }
Nadia }
    });
  };

  Search.prototype.handleSearch = function (evt) {
    if (!this._keyUpPrevented) {
Nadia var input = this.$search.val();

Nadia this.trigger('query', {
Nadia   term: input
Nadia });
    }

    this._keyUpPrevented = false;
  };

  Search.prototype.showSearch = function (_, params) {
    return true;
  };

  return Search;
});

S2.define('select2/dropdown/hidePlaceholder',[

], function () {
  function HidePlaceholder (decorated, $element, options, dataAdapter) {
    this.placeholder = this.normalizePlaceholder(options.get('placeholder'));

    decorated.call(this, $element, options, dataAdapter);
  }

  HidePlaceholder.prototype.append = function (decorated, data) {
    data.results = this.removePlaceholder(data.results);

    decorated.call(this, data);
  };

  HidePlaceholder.prototype.normalizePlaceholder = function (_, placeholder) {
    if (typeof placeholder === 'string') {
Nadia placeholder = {
Nadia   id: '',
Nadia   text: placeholder
Nadia };
    }

    return placeholder;
  };

  HidePlaceholder.prototype.removePlaceholder = function (_, data) {
    var modifiedData = data.slice(0);

    for (var d = data.length - 1; d >= 0; d--) {
Nadia var item = data[d];

Nadia if (this.placeholder.id === item.id) {
Nadia   modifiedData.splice(d, 1);
Nadia }
    }

    return modifiedData;
  };

  return HidePlaceholder;
});

S2.define('select2/dropdown/infiniteScroll',[
  'jquery'
], function ($) {
  function InfiniteScroll (decorated, $element, options, dataAdapter) {
    this.lastParams = {};

    decorated.call(this, $element, options, dataAdapter);

    this.$loadingMore = this.createLoadingMore();
    this.loading = false;
  }

  InfiniteScroll.prototype.append = function (decorated, data) {
    this.$loadingMore.remove();
    this.loading = false;

    decorated.call(this, data);

    if (this.showLoadingMore(data)) {
Nadia this.$results.append(this.$loadingMore);
    }
  };

  InfiniteScroll.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    container.on('query', function (params) {
Nadia self.lastParams = params;
Nadia self.loading = true;
    });

    container.on('query:append', function (params) {
Nadia self.lastParams = params;
Nadia self.loading = true;
    });

    this.$results.on('scroll', function () {
Nadia var isLoadMoreVisible = $.contains(
Nadia   document.documentElement,
Nadia   self.$loadingMore[0]
Nadia );

Nadia if (self.loading || !isLoadMoreVisible) {
Nadia   return;
Nadia }

Nadia var currentOffset = self.$results.offset().top +
Nadia   self.$results.outerHeight(false);
Nadia var loadingMoreOffset = self.$loadingMore.offset().top +
Nadia   self.$loadingMore.outerHeight(false);

Nadia if (currentOffset + 50 >= loadingMoreOffset) {
Nadia   self.loadMore();
Nadia }
    });
  };

  InfiniteScroll.prototype.loadMore = function () {
    this.loading = true;

    var params = $.extend({}, {page: 1}, this.lastParams);

    params.page++;

    this.trigger('query:append', params);
  };

  InfiniteScroll.prototype.showLoadingMore = function (_, data) {
    return data.pagination && data.pagination.more;
  };

  InfiniteScroll.prototype.createLoadingMore = function () {
    var $option = $(
Nadia '<li ' +
Nadia 'class="select2-results__option select2-results__option--load-more"' +
Nadia 'role="treeitem" aria-disabled="true"></li>'
    );

    var message = this.options.get('translations').get('loadingMore');

    $option.html(message(this.lastParams));

    return $option;
  };

  return InfiniteScroll;
});

S2.define('select2/dropdown/attachBody',[
  'jquery',
  '../utils'
], function ($, Utils) {
  function AttachBody (decorated, $element, options) {
    this.$dropdownParent = options.get('dropdownParent') || $(document.body);

    decorated.call(this, $element, options);
  }

  AttachBody.prototype.bind = function (decorated, container, $container) {
    var self = this;

    var setupResultsEvents = false;

    decorated.call(this, container, $container);

    container.on('open', function () {
Nadia self._showDropdown();
Nadia self._attachPositioningHandler(container);

Nadia if (!setupResultsEvents) {
Nadia   setupResultsEvents = true;

Nadia   container.on('results:all', function () {
NadiaNadiaself._positionDropdown();
NadiaNadiaself._resizeDropdown();
Nadia   });

Nadia   container.on('results:append', function () {
NadiaNadiaself._positionDropdown();
NadiaNadiaself._resizeDropdown();
Nadia   });
Nadia }
    });

    container.on('close', function () {
Nadia self._hideDropdown();
Nadia self._detachPositioningHandler(container);
    });

    this.$dropdownContainer.on('mousedown', function (evt) {
Nadia evt.stopPropagation();
    });
  };

  AttachBody.prototype.destroy = function (decorated) {
    decorated.call(this);

    this.$dropdownContainer.remove();
  };

  AttachBody.prototype.position = function (decorated, $dropdown, $container) {
    // Clone all of the container classes
    $dropdown.attr('class', $container.attr('class'));

    $dropdown.removeClass('select2');
    $dropdown.addClass('select2-container--open');

    $dropdown.css({
Nadia position: 'absolute',
Nadia top: -999999
    });

    this.$container = $container;
  };

  AttachBody.prototype.render = function (decorated) {
    var $container = $('<span></span>');

    var $dropdown = decorated.call(this);
    $container.append($dropdown);

    this.$dropdownContainer = $container;

    return $container;
  };

  AttachBody.prototype._hideDropdown = function (decorated) {
    this.$dropdownContainer.detach();
  };

  AttachBody.prototype._attachPositioningHandler =
Nadia function (decorated, container) {
    var self = this;

    var scrollEvent = 'scroll.select2.' + container.id;
    var resizeEvent = 'resize.select2.' + container.id;
    var orientationEvent = 'orientationchange.select2.' + container.id;

    var $watchers = this.$container.parents().filter(Utils.hasScroll);
    $watchers.each(function () {
Nadia $(this).data('select2-scroll-position', {
Nadia   x: $(this).scrollLeft(),
Nadia   y: $(this).scrollTop()
Nadia });
    });

    $watchers.on(scrollEvent, function (ev) {
Nadia var position = $(this).data('select2-scroll-position');
Nadia $(this).scrollTop(position.y);
    });

    $(window).on(scrollEvent + ' ' + resizeEvent + ' ' + orientationEvent,
Nadia function (e) {
Nadia self._positionDropdown();
Nadia self._resizeDropdown();
    });
  };

  AttachBody.prototype._detachPositioningHandler =
Nadia function (decorated, container) {
    var scrollEvent = 'scroll.select2.' + container.id;
    var resizeEvent = 'resize.select2.' + container.id;
    var orientationEvent = 'orientationchange.select2.' + container.id;

    var $watchers = this.$container.parents().filter(Utils.hasScroll);
    $watchers.off(scrollEvent);

    $(window).off(scrollEvent + ' ' + resizeEvent + ' ' + orientationEvent);
  };

  AttachBody.prototype._positionDropdown = function () {
    var $window = $(window);

    var isCurrentlyAbove = this.$dropdown.hasClass('select2-dropdown--above');
    var isCurrentlyBelow = this.$dropdown.hasClass('select2-dropdown--below');

    var newDirection = null;

    var offset = this.$container.offset();

    offset.bottom = offset.top + this.$container.outerHeight(false);

    var container = {
Nadia height: this.$container.outerHeight(false)
    };

    container.top = offset.top;
    container.bottom = offset.top + container.height;

    var dropdown = {
Nadia height: this.$dropdown.outerHeight(false)
    };

    var viewport = {
Nadia top: $window.scrollTop(),
Nadia bottom: $window.scrollTop() + $window.height()
    };

    var enoughRoomAbove = viewport.top < (offset.top - dropdown.height);
    var enoughRoomBelow = viewport.bottom > (offset.bottom + dropdown.height);

    var css = {
Nadia left: offset.left,
Nadia top: container.bottom
    };

    // Determine what the parent element is to use for calciulating the offset
    var $offsetParent = this.$dropdownParent;

    // For statically positoned elements, we need to get the element
    // that is determining the offset
    if ($offsetParent.css('position') === 'static') {
Nadia $offsetParent = $offsetParent.offsetParent();
    }

    var parentOffset = $offsetParent.offset();

    css.top -= parentOffset.top;
    css.left -= parentOffset.left;

    if (!isCurrentlyAbove && !isCurrentlyBelow) {
Nadia newDirection = 'below';
    }

    if (!enoughRoomBelow && enoughRoomAbove && !isCurrentlyAbove) {
Nadia newDirection = 'above';
    } else if (!enoughRoomAbove && enoughRoomBelow && isCurrentlyAbove) {
Nadia newDirection = 'below';
    }

    if (newDirection == 'above' ||
Nadia (isCurrentlyAbove && newDirection !== 'below')) {
Nadia css.top = container.top - parentOffset.top - dropdown.height;
    }

    if (newDirection != null) {
Nadia this.$dropdown
Nadia   .removeClass('select2-dropdown--below select2-dropdown--above')
Nadia   .addClass('select2-dropdown--' + newDirection);
Nadia this.$container
Nadia   .removeClass('select2-container--below select2-container--above')
Nadia   .addClass('select2-container--' + newDirection);
    }

    this.$dropdownContainer.css(css);
  };

  AttachBody.prototype._resizeDropdown = function () {
    var css = {
Nadia width: this.$container.outerWidth(false) + 'px'
    };

    if (this.options.get('dropdownAutoWidth')) {
Nadia css.minWidth = css.width;
Nadia css.position = 'relative';
Nadia css.width = 'auto';
    }

    this.$dropdown.css(css);
  };

  AttachBody.prototype._showDropdown = function (decorated) {
    this.$dropdownContainer.appendTo(this.$dropdownParent);

    this._positionDropdown();
    this._resizeDropdown();
  };

  return AttachBody;
});

S2.define('select2/dropdown/minimumResultsForSearch',[

], function () {
  function countResults (data) {
    var count = 0;

    for (var d = 0; d < data.length; d++) {
Nadia var item = data[d];

Nadia if (item.children) {
Nadia   count += countResults(item.children);
Nadia } else {
Nadia   count++;
Nadia }
    }

    return count;
  }

  function MinimumResultsForSearch (decorated, $element, options, dataAdapter) {
    this.minimumResultsForSearch = options.get('minimumResultsForSearch');

    if (this.minimumResultsForSearch < 0) {
Nadia this.minimumResultsForSearch = Infinity;
    }

    decorated.call(this, $element, options, dataAdapter);
  }

  MinimumResultsForSearch.prototype.showSearch = function (decorated, params) {
    if (countResults(params.data.results) < this.minimumResultsForSearch) {
Nadia return false;
    }

    return decorated.call(this, params);
  };

  return MinimumResultsForSearch;
});

S2.define('select2/dropdown/selectOnClose',[

], function () {
  function SelectOnClose () { }

  SelectOnClose.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    container.on('close', function (params) {
Nadia self._handleSelectOnClose(params);
    });
  };

  SelectOnClose.prototype._handleSelectOnClose = function (_, params) {
    if (params && params.originalSelect2Event != null) {
Nadia var event = params.originalSelect2Event;

Nadia // Don't select an item if the close event was triggered from a select or
Nadia // unselect event
Nadia if (event._type === 'select' || event._type === 'unselect') {
Nadia   return;
Nadia }
    }

    var $highlightedResults = this.getHighlightedResults();

    // Only select highlighted results
    if ($highlightedResults.length < 1) {
Nadia return;
    }

    var data = $highlightedResults.data('data');

    // Don't re-select already selected resulte
    if (
Nadia (data.element != null && data.element.selected) ||
Nadia (data.element == null && data.selected)
    ) {
Nadia return;
    }

    this.trigger('select', {
Nadia   data: data
    });
  };

  return SelectOnClose;
});

S2.define('select2/dropdown/closeOnSelect',[

], function () {
  function CloseOnSelect () { }

  CloseOnSelect.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    container.on('select', function (evt) {
Nadia self._selectTriggered(evt);
    });

    container.on('unselect', function (evt) {
Nadia self._selectTriggered(evt);
    });
  };

  CloseOnSelect.prototype._selectTriggered = function (_, evt) {
    var originalEvent = evt.originalEvent;

    // Don't close if the control key is being held
    if (originalEvent && originalEvent.ctrlKey) {
Nadia return;
    }

    this.trigger('close', {
Nadia originalEvent: originalEvent,
Nadia originalSelect2Event: evt
    });
  };

  return CloseOnSelect;
});

S2.define('select2/i18n/en',[],function () {
  // English
  return {
    errorLoading: function () {
Nadia return 'The results could not be loaded.';
    },
    inputTooLong: function (args) {
Nadia var overChars = args.input.length - args.maximum;

Nadia var message = 'Please delete ' + overChars + ' character';

Nadia if (overChars != 1) {
Nadia   message += 's';
Nadia }

Nadia return message;
    },
    inputTooShort: function (args) {
Nadia var remainingChars = args.minimum - args.input.length;

Nadia var message = 'Please enter ' + remainingChars + ' or more characters';

Nadia return message;
    },
    loadingMore: function () {
Nadia return 'Loading more results…';
    },
    maximumSelected: function (args) {
Nadia var message = 'You can only select ' + args.maximum + ' item';

Nadia if (args.maximum != 1) {
Nadia   message += 's';
Nadia }

Nadia return message;
    },
    noResults: function () {
Nadia return 'No results found';
    },
    searching: function () {
Nadia return 'Searching…';
    }
  };
});

S2.define('select2/defaults',[
  'jquery',
  'require',

  './results',

  './selection/single',
  './selection/multiple',
  './selection/placeholder',
  './selection/allowClear',
  './selection/search',
  './selection/eventRelay',

  './utils',
  './translation',
  './diacritics',

  './data/select',
  './data/array',
  './data/ajax',
  './data/tags',
  './data/tokenizer',
  './data/minimumInputLength',
  './data/maximumInputLength',
  './data/maximumSelectionLength',

  './dropdown',
  './dropdown/search',
  './dropdown/hidePlaceholder',
  './dropdown/infiniteScroll',
  './dropdown/attachBody',
  './dropdown/minimumResultsForSearch',
  './dropdown/selectOnClose',
  './dropdown/closeOnSelect',

  './i18n/en'
], function ($, require,

NadiaNadia   ResultsList,

NadiaNadia   SingleSelection, MultipleSelection, Placeholder, AllowClear,
NadiaNadia   SelectionSearch, EventRelay,

NadiaNadia   Utils, Translation, DIACRITICS,

NadiaNadia   SelectData, ArrayData, AjaxData, Tags, Tokenizer,
NadiaNadia   MinimumInputLength, MaximumInputLength, MaximumSelectionLength,

NadiaNadia   Dropdown, DropdownSearch, HidePlaceholder, InfiniteScroll,
NadiaNadia   AttachBody, MinimumResultsForSearch, SelectOnClose, CloseOnSelect,

NadiaNadia   EnglishTranslation) {
  function Defaults () {
    this.reset();
  }

  Defaults.prototype.apply = function (options) {
    options = $.extend(true, {}, this.defaults, options);

    if (options.dataAdapter == null) {
Nadia if (options.ajax != null) {
Nadia   options.dataAdapter = AjaxData;
Nadia } else if (options.data != null) {
Nadia   options.dataAdapter = ArrayData;
Nadia } else {
Nadia   options.dataAdapter = SelectData;
Nadia }

Nadia if (options.minimumInputLength > 0) {
Nadia   options.dataAdapter = Utils.Decorate(
NadiaNadiaoptions.dataAdapter,
NadiaNadiaMinimumInputLength
Nadia   );
Nadia }

Nadia if (options.maximumInputLength > 0) {
Nadia   options.dataAdapter = Utils.Decorate(
NadiaNadiaoptions.dataAdapter,
NadiaNadiaMaximumInputLength
Nadia   );
Nadia }

Nadia if (options.maximumSelectionLength > 0) {
Nadia   options.dataAdapter = Utils.Decorate(
NadiaNadiaoptions.dataAdapter,
NadiaNadiaMaximumSelectionLength
Nadia   );
Nadia }

Nadia if (options.tags) {
Nadia   options.dataAdapter = Utils.Decorate(options.dataAdapter, Tags);
Nadia }

Nadia if (options.tokenSeparators != null || options.tokenizer != null) {
Nadia   options.dataAdapter = Utils.Decorate(
NadiaNadiaoptions.dataAdapter,
NadiaNadiaTokenizer
Nadia   );
Nadia }

Nadia if (options.query != null) {
Nadia   var Query = require(options.amdBase + 'compat/query');

Nadia   options.dataAdapter = Utils.Decorate(
NadiaNadiaoptions.dataAdapter,
NadiaNadiaQuery
Nadia   );
Nadia }

Nadia if (options.initSelection != null) {
Nadia   var InitSelection = require(options.amdBase + 'compat/initSelection');

Nadia   options.dataAdapter = Utils.Decorate(
NadiaNadiaoptions.dataAdapter,
NadiaNadiaInitSelection
Nadia   );
Nadia }
    }

    if (options.resultsAdapter == null) {
Nadia options.resultsAdapter = ResultsList;

Nadia if (options.ajax != null) {
Nadia   options.resultsAdapter = Utils.Decorate(
NadiaNadiaoptions.resultsAdapter,
NadiaNadiaInfiniteScroll
Nadia   );
Nadia }

Nadia if (options.placeholder != null) {
Nadia   options.resultsAdapter = Utils.Decorate(
NadiaNadiaoptions.resultsAdapter,
NadiaNadiaHidePlaceholder
Nadia   );
Nadia }

Nadia if (options.selectOnClose) {
Nadia   options.resultsAdapter = Utils.Decorate(
NadiaNadiaoptions.resultsAdapter,
NadiaNadiaSelectOnClose
Nadia   );
Nadia }
    }

    if (options.dropdownAdapter == null) {
Nadia if (options.multiple) {
Nadia   options.dropdownAdapter = Dropdown;
Nadia } else {
Nadia   var SearchableDropdown = Utils.Decorate(Dropdown, DropdownSearch);

Nadia   options.dropdownAdapter = SearchableDropdown;
Nadia }

Nadia if (options.minimumResultsForSearch !== 0) {
Nadia   options.dropdownAdapter = Utils.Decorate(
NadiaNadiaoptions.dropdownAdapter,
NadiaNadiaMinimumResultsForSearch
Nadia   );
Nadia }

Nadia if (options.closeOnSelect) {
Nadia   options.dropdownAdapter = Utils.Decorate(
NadiaNadiaoptions.dropdownAdapter,
NadiaNadiaCloseOnSelect
Nadia   );
Nadia }

Nadia if (
Nadia   options.dropdownCssClass != null ||
Nadia   options.dropdownCss != null ||
Nadia   options.adaptDropdownCssClass != null
Nadia ) {
Nadia   var DropdownCSS = require(options.amdBase + 'compat/dropdownCss');

Nadia   options.dropdownAdapter = Utils.Decorate(
NadiaNadiaoptions.dropdownAdapter,
NadiaNadiaDropdownCSS
Nadia   );
Nadia }

Nadia options.dropdownAdapter = Utils.Decorate(
Nadia   options.dropdownAdapter,
Nadia   AttachBody
Nadia );
    }

    if (options.selectionAdapter == null) {
Nadia if (options.multiple) {
Nadia   options.selectionAdapter = MultipleSelection;
Nadia } else {
Nadia   options.selectionAdapter = SingleSelection;
Nadia }

Nadia // Add the placeholder mixin if a placeholder was specified
Nadia if (options.placeholder != null) {
Nadia   options.selectionAdapter = Utils.Decorate(
NadiaNadiaoptions.selectionAdapter,
NadiaNadiaPlaceholder
Nadia   );
Nadia }

Nadia if (options.allowClear) {
Nadia   options.selectionAdapter = Utils.Decorate(
NadiaNadiaoptions.selectionAdapter,
NadiaNadiaAllowClear
Nadia   );
Nadia }

Nadia if (options.multiple) {
Nadia   options.selectionAdapter = Utils.Decorate(
NadiaNadiaoptions.selectionAdapter,
NadiaNadiaSelectionSearch
Nadia   );
Nadia }

Nadia if (
Nadia   options.containerCssClass != null ||
Nadia   options.containerCss != null ||
Nadia   options.adaptContainerCssClass != null
Nadia ) {
Nadia   var ContainerCSS = require(options.amdBase + 'compat/containerCss');

Nadia   options.selectionAdapter = Utils.Decorate(
NadiaNadiaoptions.selectionAdapter,
NadiaNadiaContainerCSS
Nadia   );
Nadia }

Nadia options.selectionAdapter = Utils.Decorate(
Nadia   options.selectionAdapter,
Nadia   EventRelay
Nadia );
    }

    if (typeof options.language === 'string') {
Nadia // Check if the language is specified with a region
Nadia if (options.language.indexOf('-') > 0) {
Nadia   // Extract the region information if it is included
Nadia   var languageParts = options.language.split('-');
Nadia   var baseLanguage = languageParts[0];

Nadia   options.language = [options.language, baseLanguage];
Nadia } else {
Nadia   options.language = [options.language];
Nadia }
    }

    if ($.isArray(options.language)) {
Nadia var languages = new Translation();
Nadia options.language.push('en');

Nadia var languageNames = options.language;

Nadia for (var l = 0; l < languageNames.length; l++) {
Nadia   var name = languageNames[l];
Nadia   var language = {};

Nadia   try {
NadiaNadia// Try to load it with the original name
NadiaNadialanguage = Translation.loadPath(name);
Nadia   } catch (e) {
NadiaNadiatry {
NadiaNadia  // If we couldn't load it, check if it wasn't the full path
NadiaNadia  name = this.defaults.amdLanguageBase + name;
NadiaNadia  language = Translation.loadPath(name);
NadiaNadia} catch (ex) {
NadiaNadia  // The translation could not be loaded at all. Sometimes this is
NadiaNadia  // because of a configuration problem, other times this can be
NadiaNadia  // because of how Select2 helps load all possible translation files.
NadiaNadia  if (options.debug && window.console && console.warn) {
NadiaNadia    console.warn(
NadiaNadiaNadia 'Select2: The language file for "' + name + '" could not be ' +
NadiaNadiaNadia 'automatically loaded. A fallback will be used instead.'
NadiaNadia    );
NadiaNadia  }

NadiaNadia  continue;
NadiaNadia}
Nadia   }

Nadia   languages.extend(language);
Nadia }

Nadia options.translations = languages;
    } else {
Nadia var baseTranslation = Translation.loadPath(
Nadia   this.defaults.amdLanguageBase + 'en'
Nadia );
Nadia var customTranslation = new Translation(options.language);

Nadia customTranslation.extend(baseTranslation);

Nadia options.translations = customTranslation;
    }

    return options;
  };

  Defaults.prototype.reset = function () {
    function stripDiacritics (text) {
Nadia // Used 'uni range + named function' from http://jsperf.com/diacritics/18
Nadia function match(a) {
Nadia   return DIACRITICS[a] || a;
Nadia }

Nadia return text.replace(/[^\u0000-\u007E]/g, match);
    }

    function matcher (params, data) {
Nadia // Always return the object if there is nothing to compare
Nadia if ($.trim(params.term) === '') {
Nadia   return data;
Nadia }

Nadia // Do a recursive check for options with children
Nadia if (data.children && data.children.length > 0) {
Nadia   // Clone the data object if there are children
Nadia   // This is required as we modify the object to remove any non-matches
Nadia   var match = $.extend(true, {}, data);

Nadia   // Check each child of the option
Nadia   for (var c = data.children.length - 1; c >= 0; c--) {
NadiaNadiavar child = data.children[c];

NadiaNadiavar matches = matcher(params, child);

NadiaNadia// If there wasn't a match, remove the object in the array
NadiaNadiaif (matches == null) {
NadiaNadia  match.children.splice(c, 1);
NadiaNadia}
Nadia   }

Nadia   // If any children matched, return the new object
Nadia   if (match.children.length > 0) {
NadiaNadiareturn match;
Nadia   }

Nadia   // If there were no matching children, check just the plain object
Nadia   return matcher(params, match);
Nadia }

Nadia var original = stripDiacritics(data.text).toUpperCase();
Nadia var term = stripDiacritics(params.term).toUpperCase();

Nadia // Check if the text contains the term
Nadia if (original.indexOf(term) > -1) {
Nadia   return data;
Nadia }

Nadia // If it doesn't contain the term, don't return anything
Nadia return null;
    }

    this.defaults = {
Nadia amdBase: './',
Nadia amdLanguageBase: './i18n/',
Nadia closeOnSelect: true,
Nadia debug: false,
Nadia dropdownAutoWidth: false,
Nadia escapeMarkup: Utils.escapeMarkup,
Nadia language: EnglishTranslation,
Nadia matcher: matcher,
Nadia minimumInputLength: 0,
Nadia maximumInputLength: 0,
Nadia maximumSelectionLength: 0,
Nadia minimumResultsForSearch: 0,
Nadia selectOnClose: false,
Nadia sorter: function (data) {
Nadia   return data;
Nadia },
Nadia templateResult: function (result) {
Nadia   return result.text;
Nadia },
Nadia templateSelection: function (selection) {
Nadia   return selection.text;
Nadia },
Nadia theme: 'default',
Nadia width: 'resolve'
    };
  };

  Defaults.prototype.set = function (key, value) {
    var camelKey = $.camelCase(key);

    var data = {};
    data[camelKey] = value;

    var convertedData = Utils._convertData(data);

    $.extend(this.defaults, convertedData);
  };

  var defaults = new Defaults();

  return defaults;
});

S2.define('select2/options',[
  'require',
  'jquery',
  './defaults',
  './utils'
], function (require, $, Defaults, Utils) {
  function Options (options, $element) {
    this.options = options;

    if ($element != null) {
Nadia this.fromElement($element);
    }

    this.options = Defaults.apply(this.options);

    if ($element && $element.is('input')) {
Nadia var InputCompat = require(this.get('amdBase') + 'compat/inputData');

Nadia this.options.dataAdapter = Utils.Decorate(
Nadia   this.options.dataAdapter,
Nadia   InputCompat
Nadia );
    }
  }

  Options.prototype.fromElement = function ($e) {
    var excludedData = ['select2'];

    if (this.options.multiple == null) {
Nadia this.options.multiple = $e.prop('multiple');
    }

    if (this.options.disabled == null) {
Nadia this.options.disabled = $e.prop('disabled');
    }

    if (this.options.language == null) {
Nadia if ($e.prop('lang')) {
Nadia   this.options.language = $e.prop('lang').toLowerCase();
Nadia } else if ($e.closest('[lang]').prop('lang')) {
Nadia   this.options.language = $e.closest('[lang]').prop('lang');
Nadia }
    }

    if (this.options.dir == null) {
Nadia if ($e.prop('dir')) {
Nadia   this.options.dir = $e.prop('dir');
Nadia } else if ($e.closest('[dir]').prop('dir')) {
Nadia   this.options.dir = $e.closest('[dir]').prop('dir');
Nadia } else {
Nadia   this.options.dir = 'ltr';
Nadia }
    }

    $e.prop('disabled', this.options.disabled);
    $e.prop('multiple', this.options.multiple);

    if ($e.data('select2Tags')) {
Nadia if (this.options.debug && window.console && console.warn) {
Nadia   console.warn(
NadiaNadia'Select2: The `data-select2-tags` attribute has been changed to ' +
NadiaNadia'use the `data-data` and `data-tags="true"` attributes and will be ' +
NadiaNadia'removed in future versions of Select2.'
Nadia   );
Nadia }

Nadia $e.data('data', $e.data('select2Tags'));
Nadia $e.data('tags', true);
    }

    if ($e.data('ajaxUrl')) {
Nadia if (this.options.debug && window.console && console.warn) {
Nadia   console.warn(
NadiaNadia'Select2: The `data-ajax-url` attribute has been changed to ' +
NadiaNadia'`data-ajax--url` and support for the old attribute will be removed' +
NadiaNadia' in future versions of Select2.'
Nadia   );
Nadia }

Nadia $e.attr('ajax--url', $e.data('ajaxUrl'));
Nadia $e.data('ajax--url', $e.data('ajaxUrl'));
    }

    var dataset = {};

    // Prefer the element's `dataset` attribute if it exists
    // jQuery 1.x does not correctly handle data attributes with multiple dashes
    if ($.fn.jquery && $.fn.jquery.substr(0, 2) == '1.' && $e[0].dataset) {
Nadia dataset = $.extend(true, {}, $e[0].dataset, $e.data());
    } else {
Nadia dataset = $e.data();
    }

    var data = $.extend(true, {}, dataset);

    data = Utils._convertData(data);

    for (var key in data) {
Nadia if ($.inArray(key, excludedData) > -1) {
Nadia   continue;
Nadia }

Nadia if ($.isPlainObject(this.options[key])) {
Nadia   $.extend(this.options[key], data[key]);
Nadia } else {
Nadia   this.options[key] = data[key];
Nadia }
    }

    return this;
  };

  Options.prototype.get = function (key) {
    return this.options[key];
  };

  Options.prototype.set = function (key, val) {
    this.options[key] = val;
  };

  return Options;
});

S2.define('select2/core',[
  'jquery',
  './options',
  './utils',
  './keys'
], function ($, Options, Utils, KEYS) {
  var Select2 = function ($element, options) {
    if ($element.data('select2') != null) {
Nadia $element.data('select2').destroy();
    }

    this.$element = $element;

    this.id = this._generateId($element);

    options = options || {};

    this.options = new Options(options, $element);

    Select2.__super__.constructor.call(this);

    // Set up the tabindex

    var tabindex = $element.attr('tabindex') || 0;
    $element.data('old-tabindex', tabindex);
    $element.attr('tabindex', '-1');

    // Set up containers and adapters

    var DataAdapter = this.options.get('dataAdapter');
    this.dataAdapter = new DataAdapter($element, this.options);

    var $container = this.render();

    this._placeContainer($container);

    var SelectionAdapter = this.options.get('selectionAdapter');
    this.selection = new SelectionAdapter($element, this.options);
    this.$selection = this.selection.render();

    this.selection.position(this.$selection, $container);

    var DropdownAdapter = this.options.get('dropdownAdapter');
    this.dropdown = new DropdownAdapter($element, this.options);
    this.$dropdown = this.dropdown.render();

    this.dropdown.position(this.$dropdown, $container);

    var ResultsAdapter = this.options.get('resultsAdapter');
    this.results = new ResultsAdapter($element, this.options, this.dataAdapter);
    this.$results = this.results.render();

    this.results.position(this.$results, this.$dropdown);

    // Bind events

    var self = this;

    // Bind the container to all of the adapters
    this._bindAdapters();

    // Register any DOM event handlers
    this._registerDomEvents();

    // Register any internal event handlers
    this._registerDataEvents();
    this._registerSelectionEvents();
    this._registerDropdownEvents();
    this._registerResultsEvents();
    this._registerEvents();

    // Set the initial state
    this.dataAdapter.current(function (initialData) {
Nadia self.trigger('selection:update', {
Nadia   data: initialData
Nadia });
    });

    // Hide the original select
    $element.addClass('select2-hidden-accessible');
    $element.attr('aria-hidden', 'true');

    // Synchronize any monitored attributes
    this._syncAttributes();

    $element.data('select2', this);
  };

  Utils.Extend(Select2, Utils.Observable);

  Select2.prototype._generateId = function ($element) {
    var id = '';

    if ($element.attr('id') != null) {
Nadia id = $element.attr('id');
    } else if ($element.attr('name') != null) {
Nadia id = $element.attr('name') + '-' + Utils.generateChars(2);
    } else {
Nadia id = Utils.generateChars(4);
    }

    id = id.replace(/(:|\.|\[|\]|,)/g, '');
    id = 'select2-' + id;

    return id;
  };

  Select2.prototype._placeContainer = function ($container) {
    $container.insertAfter(this.$element);

    var width = this._resolveWidth(this.$element, this.options.get('width'));

    if (width != null) {
Nadia $container.css('width', width);
    }
  };

  Select2.prototype._resolveWidth = function ($element, method) {
    var WIDTH = /^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i;

    if (method == 'resolve') {
Nadia var styleWidth = this._resolveWidth($element, 'style');

Nadia if (styleWidth != null) {
Nadia   return styleWidth;
Nadia }

Nadia return this._resolveWidth($element, 'element');
    }

    if (method == 'element') {
Nadia var elementWidth = $element.outerWidth(false);

Nadia if (elementWidth <= 0) {
Nadia   return 'auto';
Nadia }

Nadia return elementWidth + 'px';
    }

    if (method == 'style') {
Nadia var style = $element.attr('style');

Nadia if (typeof(style) !== 'string') {
Nadia   return null;
Nadia }

Nadia var attrs = style.split(';');

Nadia for (var i = 0, l = attrs.length; i < l; i = i + 1) {
Nadia   var attr = attrs[i].replace(/\s/g, '');
Nadia   var matches = attr.match(WIDTH);

Nadia   if (matches !== null && matches.length >= 1) {
NadiaNadiareturn matches[1];
Nadia   }
Nadia }

Nadia return null;
    }

    return method;
  };

  Select2.prototype._bindAdapters = function () {
    this.dataAdapter.bind(this, this.$container);
    this.selection.bind(this, this.$container);

    this.dropdown.bind(this, this.$container);
    this.results.bind(this, this.$container);
  };

  Select2.prototype._registerDomEvents = function () {
    var self = this;

    this.$element.on('change.select2', function () {
Nadia self.dataAdapter.current(function (data) {
Nadia   self.trigger('selection:update', {
NadiaNadiadata: data
Nadia   });
Nadia });
    });

    this.$element.on('focus.select2', function (evt) {
Nadia self.trigger('focus', evt);
    });

    this._syncA = Utils.bind(this._syncAttributes, this);
    this._syncS = Utils.bind(this._syncSubtree, this);

    if (this.$element[0].attachEvent) {
Nadia this.$element[0].attachEvent('onpropertychange', this._syncA);
    }

    var observer = window.MutationObserver ||
Nadia window.WebKitMutationObserver ||
Nadia window.MozMutationObserver
    ;

    if (observer != null) {
Nadia this._observer = new observer(function (mutations) {
Nadia   $.each(mutations, self._syncA);
Nadia   $.each(mutations, self._syncS);
Nadia });
Nadia this._observer.observe(this.$element[0], {
Nadia   attributes: true,
Nadia   childList: true,
Nadia   subtree: false
Nadia });
    } else if (this.$element[0].addEventListener) {
Nadia this.$element[0].addEventListener(
Nadia   'DOMAttrModified',
Nadia   self._syncA,
Nadia   false
Nadia );
Nadia this.$element[0].addEventListener(
Nadia   'DOMNodeInserted',
Nadia   self._syncS,
Nadia   false
Nadia );
Nadia this.$element[0].addEventListener(
Nadia   'DOMNodeRemoved',
Nadia   self._syncS,
Nadia   false
Nadia );
    }
  };

  Select2.prototype._registerDataEvents = function () {
    var self = this;

    this.dataAdapter.on('*', function (name, params) {
Nadia self.trigger(name, params);
    });
  };

  Select2.prototype._registerSelectionEvents = function () {
    var self = this;
    var nonRelayEvents = ['toggle', 'focus'];

    this.selection.on('toggle', function () {
Nadia self.toggleDropdown();
    });

    this.selection.on('focus', function (params) {
Nadia self.focus(params);
    });

    this.selection.on('*', function (name, params) {
Nadia if ($.inArray(name, nonRelayEvents) !== -1) {
Nadia   return;
Nadia }

Nadia self.trigger(name, params);
    });
  };

  Select2.prototype._registerDropdownEvents = function () {
    var self = this;

    this.dropdown.on('*', function (name, params) {
Nadia self.trigger(name, params);
    });
  };

  Select2.prototype._registerResultsEvents = function () {
    var self = this;

    this.results.on('*', function (name, params) {
Nadia self.trigger(name, params);
    });
  };

  Select2.prototype._registerEvents = function () {
    var self = this;

    this.on('open', function () {
Nadia self.$container.addClass('select2-container--open');
    });

    this.on('close', function () {
Nadia self.$container.removeClass('select2-container--open');
    });

    this.on('enable', function () {
Nadia self.$container.removeClass('select2-container--disabled');
    });

    this.on('disable', function () {
Nadia self.$container.addClass('select2-container--disabled');
    });

    this.on('blur', function () {
Nadia self.$container.removeClass('select2-container--focus');
    });

    this.on('query', function (params) {
Nadia if (!self.isOpen()) {
Nadia   self.trigger('open', {});
Nadia }

Nadia this.dataAdapter.query(params, function (data) {
Nadia   self.trigger('results:all', {
NadiaNadiadata: data,
NadiaNadiaquery: params
Nadia   });
Nadia });
    });

    this.on('query:append', function (params) {
Nadia this.dataAdapter.query(params, function (data) {
Nadia   self.trigger('results:append', {
NadiaNadiadata: data,
NadiaNadiaquery: params
Nadia   });
Nadia });
    });

    this.on('keypress', function (evt) {
Nadia var key = evt.which;

Nadia if (self.isOpen()) {
Nadia   if (key === KEYS.ESC || key === KEYS.TAB ||
NadiaNadia  (key === KEYS.UP && evt.altKey)) {
NadiaNadiaself.close();

NadiaNadiaevt.preventDefault();
Nadia   } else if (key === KEYS.ENTER) {
NadiaNadiaself.trigger('results:select', {});

NadiaNadiaevt.preventDefault();
Nadia   } else if ((key === KEYS.SPACE && evt.ctrlKey)) {
NadiaNadiaself.trigger('results:toggle', {});

NadiaNadiaevt.preventDefault();
Nadia   } else if (key === KEYS.UP) {
NadiaNadiaself.trigger('results:previous', {});

NadiaNadiaevt.preventDefault();
Nadia   } else if (key === KEYS.DOWN) {
NadiaNadiaself.trigger('results:next', {});

NadiaNadiaevt.preventDefault();
Nadia   }
Nadia } else {
Nadia   if (key === KEYS.ENTER || key === KEYS.SPACE ||
NadiaNadia  (key === KEYS.DOWN && evt.altKey)) {
NadiaNadiaself.open();

NadiaNadiaevt.preventDefault();
Nadia   }
Nadia }
    });
  };

  Select2.prototype._syncAttributes = function () {
    this.options.set('disabled', this.$element.prop('disabled'));

    if (this.options.get('disabled')) {
Nadia if (this.isOpen()) {
Nadia   this.close();
Nadia }

Nadia this.trigger('disable', {});
    } else {
Nadia this.trigger('enable', {});
    }
  };

  Select2.prototype._syncSubtree = function (evt, mutations) {
    var changed = false;
    var self = this;

    // Ignore any mutation events raised for elements that aren't options or
    // optgroups. This handles the case when the select element is destroyed
    if (
Nadia evt && evt.target && (
Nadia   evt.target.nodeName !== 'OPTION' && evt.target.nodeName !== 'OPTGROUP'
Nadia )
    ) {
Nadia return;
    }

    if (!mutations) {
Nadia // If mutation events aren't supported, then we can only assume that the
Nadia // change affected the selections
Nadia changed = true;
    } else if (mutations.addedNodes && mutations.addedNodes.length > 0) {
Nadia for (var n = 0; n < mutations.addedNodes.length; n++) {
Nadia   var node = mutations.addedNodes[n];

Nadia   if (node.selected) {
NadiaNadiachanged = true;
Nadia   }
Nadia }
    } else if (mutations.removedNodes && mutations.removedNodes.length > 0) {
Nadia changed = true;
    }

    // Only re-pull the data if we think there is a change
    if (changed) {
Nadia this.dataAdapter.current(function (currentData) {
Nadia   self.trigger('selection:update', {
NadiaNadiadata: currentData
Nadia   });
Nadia });
    }
  };

  /**
   * Override the trigger method to automatically trigger pre-events when
   * there are events that can be prevented.
   */
  Select2.prototype.trigger = function (name, args) {
    var actualTrigger = Select2.__super__.trigger;
    var preTriggerMap = {
Nadia 'open': 'opening',
Nadia 'close': 'closing',
Nadia 'select': 'selecting',
Nadia 'unselect': 'unselecting'
    };

    if (args === undefined) {
Nadia args = {};
    }

    if (name in preTriggerMap) {
Nadia var preTriggerName = preTriggerMap[name];
Nadia var preTriggerArgs = {
Nadia   prevented: false,
Nadia   name: name,
Nadia   args: args
Nadia };

Nadia actualTrigger.call(this, preTriggerName, preTriggerArgs);

Nadia if (preTriggerArgs.prevented) {
Nadia   args.prevented = true;

Nadia   return;
Nadia }
    }

    actualTrigger.call(this, name, args);
  };

  Select2.prototype.toggleDropdown = function () {
    if (this.options.get('disabled')) {
Nadia return;
    }

    if (this.isOpen()) {
Nadia this.close();
    } else {
Nadia this.open();
    }
  };

  Select2.prototype.open = function () {
    if (this.isOpen()) {
Nadia return;
    }

    this.trigger('query', {});
  };

  Select2.prototype.close = function () {
    if (!this.isOpen()) {
Nadia return;
    }

    this.trigger('close', {});
  };

  Select2.prototype.isOpen = function () {
    return this.$container.hasClass('select2-container--open');
  };

  Select2.prototype.hasFocus = function () {
    return this.$container.hasClass('select2-container--focus');
  };

  Select2.prototype.focus = function (data) {
    // No need to re-trigger focus events if we are already focused
    if (this.hasFocus()) {
Nadia return;
    }

    this.$container.addClass('select2-container--focus');
    this.trigger('focus', {});
  };

  Select2.prototype.enable = function (args) {
    if (this.options.get('debug') && window.console && console.warn) {
Nadia console.warn(
Nadia   'Select2: The `select2("enable")` method has been deprecated and will' +
Nadia   ' be removed in later Select2 versions. Use $element.prop("disabled")' +
Nadia   ' instead.'
Nadia );
    }

    if (args == null || args.length === 0) {
Nadia args = [true];
    }

    var disabled = !args[0];

    this.$element.prop('disabled', disabled);
  };

  Select2.prototype.data = function () {
    if (this.options.get('debug') &&
Nadia   arguments.length > 0 && window.console && console.warn) {
Nadia console.warn(
Nadia   'Select2: Data can no longer be set using `select2("data")`. You ' +
Nadia   'should consider setting the value instead using `$element.val()`.'
Nadia );
    }

    var data = [];

    this.dataAdapter.current(function (currentData) {
Nadia data = currentData;
    });

    return data;
  };

  Select2.prototype.val = function (args) {
    if (this.options.get('debug') && window.console && console.warn) {
Nadia console.warn(
Nadia   'Select2: The `select2("val")` method has been deprecated and will be' +
Nadia   ' removed in later Select2 versions. Use $element.val() instead.'
Nadia );
    }

    if (args == null || args.length === 0) {
Nadia return this.$element.val();
    }

    var newVal = args[0];

    if ($.isArray(newVal)) {
Nadia newVal = $.map(newVal, function (obj) {
Nadia   return obj.toString();
Nadia });
    }

    this.$element.val(newVal).trigger('change');
  };

  Select2.prototype.destroy = function () {
    this.$container.remove();

    if (this.$element[0].detachEvent) {
Nadia this.$element[0].detachEvent('onpropertychange', this._syncA);
    }

    if (this._observer != null) {
Nadia this._observer.disconnect();
Nadia this._observer = null;
    } else if (this.$element[0].removeEventListener) {
Nadia this.$element[0]
Nadia   .removeEventListener('DOMAttrModified', this._syncA, false);
Nadia this.$element[0]
Nadia   .removeEventListener('DOMNodeInserted', this._syncS, false);
Nadia this.$element[0]
Nadia   .removeEventListener('DOMNodeRemoved', this._syncS, false);
    }

    this._syncA = null;
    this._syncS = null;

    this.$element.off('.select2');
    this.$element.attr('tabindex', this.$element.data('old-tabindex'));

    this.$element.removeClass('select2-hidden-accessible');
    this.$element.attr('aria-hidden', 'false');
    this.$element.removeData('select2');

    this.dataAdapter.destroy();
    this.selection.destroy();
    this.dropdown.destroy();
    this.results.destroy();

    this.dataAdapter = null;
    this.selection = null;
    this.dropdown = null;
    this.results = null;
  };

  Select2.prototype.render = function () {
    var $container = $(
Nadia '<span class="select2 select2-container">' +
Nadia   '<span class="selection"></span>' +
Nadia   '<span class="dropdown-wrapper" aria-hidden="true"></span>' +
Nadia '</span>'
    );

    $container.attr('dir', this.options.get('dir'));

    this.$container = $container;

    this.$container.addClass('select2-container--' + this.options.get('theme'));

    $container.data('element', this.$element);

    return $container;
  };

  return Select2;
});

S2.define('select2/compat/utils',[
  'jquery'
], function ($) {
  function syncCssClasses ($dest, $src, adapter) {
    var classes, replacements = [], adapted;

    classes = $.trim($dest.attr('class'));

    if (classes) {
Nadia classes = '' + classes; // for IE which returns object

Nadia $(classes.split(/\s+/)).each(function () {
Nadia   // Save all Select2 classes
Nadia   if (this.indexOf('select2-') === 0) {
NadiaNadiareplacements.push(this);
Nadia   }
Nadia });
    }

    classes = $.trim($src.attr('class'));

    if (classes) {
Nadia classes = '' + classes; // for IE which returns object

Nadia $(classes.split(/\s+/)).each(function () {
Nadia   // Only adapt non-Select2 classes
Nadia   if (this.indexOf('select2-') !== 0) {
NadiaNadiaadapted = adapter(this);

NadiaNadiaif (adapted != null) {
NadiaNadia  replacements.push(adapted);
NadiaNadia}
Nadia   }
Nadia });
    }

    $dest.attr('class', replacements.join(' '));
  }

  return {
    syncCssClasses: syncCssClasses
  };
});

S2.define('select2/compat/containerCss',[
  'jquery',
  './utils'
], function ($, CompatUtils) {
  // No-op CSS adapter that discards all classes by default
  function _containerAdapter (clazz) {
    return null;
  }

  function ContainerCSS () { }

  ContainerCSS.prototype.render = function (decorated) {
    var $container = decorated.call(this);

    var containerCssClass = this.options.get('containerCssClass') || '';

    if ($.isFunction(containerCssClass)) {
Nadia containerCssClass = containerCssClass(this.$element);
    }

    var containerCssAdapter = this.options.get('adaptContainerCssClass');
    containerCssAdapter = containerCssAdapter || _containerAdapter;

    if (containerCssClass.indexOf(':all:') !== -1) {
Nadia containerCssClass = containerCssClass.replace(':all:', '');

Nadia var _cssAdapter = containerCssAdapter;

Nadia containerCssAdapter = function (clazz) {
Nadia   var adapted = _cssAdapter(clazz);

Nadia   if (adapted != null) {
NadiaNadia// Append the old one along with the adapted one
NadiaNadiareturn adapted + ' ' + clazz;
Nadia   }

Nadia   return clazz;
Nadia };
    }

    var containerCss = this.options.get('containerCss') || {};

    if ($.isFunction(containerCss)) {
Nadia containerCss = containerCss(this.$element);
    }

    CompatUtils.syncCssClasses($container, this.$element, containerCssAdapter);

    $container.css(containerCss);
    $container.addClass(containerCssClass);

    return $container;
  };

  return ContainerCSS;
});

S2.define('select2/compat/dropdownCss',[
  'jquery',
  './utils'
], function ($, CompatUtils) {
  // No-op CSS adapter that discards all classes by default
  function _dropdownAdapter (clazz) {
    return null;
  }

  function DropdownCSS () { }

  DropdownCSS.prototype.render = function (decorated) {
    var $dropdown = decorated.call(this);

    var dropdownCssClass = this.options.get('dropdownCssClass') || '';

    if ($.isFunction(dropdownCssClass)) {
Nadia dropdownCssClass = dropdownCssClass(this.$element);
    }

    var dropdownCssAdapter = this.options.get('adaptDropdownCssClass');
    dropdownCssAdapter = dropdownCssAdapter || _dropdownAdapter;

    if (dropdownCssClass.indexOf(':all:') !== -1) {
Nadia dropdownCssClass = dropdownCssClass.replace(':all:', '');

Nadia var _cssAdapter = dropdownCssAdapter;

Nadia dropdownCssAdapter = function (clazz) {
Nadia   var adapted = _cssAdapter(clazz);

Nadia   if (adapted != null) {
NadiaNadia// Append the old one along with the adapted one
NadiaNadiareturn adapted + ' ' + clazz;
Nadia   }

Nadia   return clazz;
Nadia };
    }

    var dropdownCss = this.options.get('dropdownCss') || {};

    if ($.isFunction(dropdownCss)) {
Nadia dropdownCss = dropdownCss(this.$element);
    }

    CompatUtils.syncCssClasses($dropdown, this.$element, dropdownCssAdapter);

    $dropdown.css(dropdownCss);
    $dropdown.addClass(dropdownCssClass);

    return $dropdown;
  };

  return DropdownCSS;
});

S2.define('select2/compat/initSelection',[
  'jquery'
], function ($) {
  function InitSelection (decorated, $element, options) {
    if (options.get('debug') && window.console && console.warn) {
Nadia console.warn(
Nadia   'Select2: The `initSelection` option has been deprecated in favor' +
Nadia   ' of a custom data adapter that overrides the `current` method. ' +
Nadia   'This method is now called multiple times instead of a single ' +
Nadia   'time when the instance is initialized. Support will be removed ' +
Nadia   'for the `initSelection` option in future versions of Select2'
Nadia );
    }

    this.initSelection = options.get('initSelection');
    this._isInitialized = false;

    decorated.call(this, $element, options);
  }

  InitSelection.prototype.current = function (decorated, callback) {
    var self = this;

    if (this._isInitialized) {
Nadia decorated.call(this, callback);

Nadia return;
    }

    this.initSelection.call(null, this.$element, function (data) {
Nadia self._isInitialized = true;

Nadia if (!$.isArray(data)) {
Nadia   data = [data];
Nadia }

Nadia callback(data);
    });
  };

  return InitSelection;
});

S2.define('select2/compat/inputData',[
  'jquery'
], function ($) {
  function InputData (decorated, $element, options) {
    this._currentData = [];
    this._valueSeparator = options.get('valueSeparator') || ',';

    if ($element.prop('type') === 'hidden') {
Nadia if (options.get('debug') && console && console.warn) {
Nadia   console.warn(
NadiaNadia'Select2: Using a hidden input with Select2 is no longer ' +
NadiaNadia'supported and may stop working in the future. It is recommended ' +
NadiaNadia'to use a `<select>` element instead.'
Nadia   );
Nadia }
    }

    decorated.call(this, $element, options);
  }

  InputData.prototype.current = function (_, callback) {
    function getSelected (data, selectedIds) {
Nadia var selected = [];

Nadia if (data.selected || $.inArray(data.id, selectedIds) !== -1) {
Nadia   data.selected = true;
Nadia   selected.push(data);
Nadia } else {
Nadia   data.selected = false;
Nadia }

Nadia if (data.children) {
Nadia   selected.push.apply(selected, getSelected(data.children, selectedIds));
Nadia }

Nadia return selected;
    }

    var selected = [];

    for (var d = 0; d < this._currentData.length; d++) {
Nadia var data = this._currentData[d];

Nadia selected.push.apply(
Nadia   selected,
Nadia   getSelected(
NadiaNadiadata,
NadiaNadiathis.$element.val().split(
NadiaNadia  this._valueSeparator
NadiaNadia)
Nadia   )
Nadia );
    }

    callback(selected);
  };

  InputData.prototype.select = function (_, data) {
    if (!this.options.get('multiple')) {
Nadia this.current(function (allData) {
Nadia   $.map(allData, function (data) {
NadiaNadiadata.selected = false;
Nadia   });
Nadia });

Nadia this.$element.val(data.id);
Nadia this.$element.trigger('change');
    } else {
Nadia var value = this.$element.val();
Nadia value += this._valueSeparator + data.id;

Nadia this.$element.val(value);
Nadia this.$element.trigger('change');
    }
  };

  InputData.prototype.unselect = function (_, data) {
    var self = this;

    data.selected = false;

    this.current(function (allData) {
Nadia var values = [];

Nadia for (var d = 0; d < allData.length; d++) {
Nadia   var item = allData[d];

Nadia   if (data.id == item.id) {
NadiaNadiacontinue;
Nadia   }

Nadia   values.push(item.id);
Nadia }

Nadia self.$element.val(values.join(self._valueSeparator));
Nadia self.$element.trigger('change');
    });
  };

  InputData.prototype.query = function (_, params, callback) {
    var results = [];

    for (var d = 0; d < this._currentData.length; d++) {
Nadia var data = this._currentData[d];

Nadia var matches = this.matches(params, data);

Nadia if (matches !== null) {
Nadia   results.push(matches);
Nadia }
    }

    callback({
Nadia results: results
    });
  };

  InputData.prototype.addOptions = function (_, $options) {
    var options = $.map($options, function ($option) {
Nadia return $.data($option[0], 'data');
    });

    this._currentData.push.apply(this._currentData, options);
  };

  return InputData;
});

S2.define('select2/compat/matcher',[
  'jquery'
], function ($) {
  function oldMatcher (matcher) {
    function wrappedMatcher (params, data) {
Nadia var match = $.extend(true, {}, data);

Nadia if (params.term == null || $.trim(params.term) === '') {
Nadia   return match;
Nadia }

Nadia if (data.children) {
Nadia   for (var c = data.children.length - 1; c >= 0; c--) {
NadiaNadiavar child = data.children[c];

NadiaNadia// Check if the child object matches
NadiaNadia// The old matcher returned a boolean true or false
NadiaNadiavar doesMatch = matcher(params.term, child.text, child);

NadiaNadia// If the child didn't match, pop it off
NadiaNadiaif (!doesMatch) {
NadiaNadia  match.children.splice(c, 1);
NadiaNadia}
Nadia   }

Nadia   if (match.children.length > 0) {
NadiaNadiareturn match;
Nadia   }
Nadia }

Nadia if (matcher(params.term, data.text, data)) {
Nadia   return match;
Nadia }

Nadia return null;
    }

    return wrappedMatcher;
  }

  return oldMatcher;
});

S2.define('select2/compat/query',[

], function () {
  function Query (decorated, $element, options) {
    if (options.get('debug') && window.console && console.warn) {
Nadia console.warn(
Nadia   'Select2: The `query` option has been deprecated in favor of a ' +
Nadia   'custom data adapter that overrides the `query` method. Support ' +
Nadia   'will be removed for the `query` option in future versions of ' +
Nadia   'Select2.'
Nadia );
    }

    decorated.call(this, $element, options);
  }

  Query.prototype.query = function (_, params, callback) {
    params.callback = callback;

    var query = this.options.get('query');

    query.call(null, params);
  };

  return Query;
});

S2.define('select2/dropdown/attachContainer',[

], function () {
  function AttachContainer (decorated, $element, options) {
    decorated.call(this, $element, options);
  }

  AttachContainer.prototype.position =
    function (decorated, $dropdown, $container) {
    var $dropdownContainer = $container.find('.dropdown-wrapper');
    $dropdownContainer.append($dropdown);

    $dropdown.addClass('select2-dropdown--below');
    $container.addClass('select2-container--below');
  };

  return AttachContainer;
});

S2.define('select2/dropdown/stopPropagation',[

], function () {
  function StopPropagation () { }

  StopPropagation.prototype.bind = function (decorated, container, $container) {
    decorated.call(this, container, $container);

    var stoppedEvents = [
    'blur',
    'change',
    'click',
    'dblclick',
    'focus',
    'focusin',
    'focusout',
    'input',
    'keydown',
    'keyup',
    'keypress',
    'mousedown',
    'mouseenter',
    'mouseleave',
    'mousemove',
    'mouseover',
    'mouseup',
    'search',
    'touchend',
    'touchstart'
    ];

    this.$dropdown.on(stoppedEvents.join(' '), function (evt) {
Nadia evt.stopPropagation();
    });
  };

  return StopPropagation;
});

S2.define('select2/selection/stopPropagation',[

], function () {
  function StopPropagation () { }

  StopPropagation.prototype.bind = function (decorated, container, $container) {
    decorated.call(this, container, $container);

    var stoppedEvents = [
Nadia 'blur',
Nadia 'change',
Nadia 'click',
Nadia 'dblclick',
Nadia 'focus',
Nadia 'focusin',
Nadia 'focusout',
Nadia 'input',
Nadia 'keydown',
Nadia 'keyup',
Nadia 'keypress',
Nadia 'mousedown',
Nadia 'mouseenter',
Nadia 'mouseleave',
Nadia 'mousemove',
Nadia 'mouseover',
Nadia 'mouseup',
Nadia 'search',
Nadia 'touchend',
Nadia 'touchstart'
    ];

    this.$selection.on(stoppedEvents.join(' '), function (evt) {
Nadia evt.stopPropagation();
    });
  };

  return StopPropagation;
});

/*!
 * jQuery Mousewheel 3.1.13
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 */

(function (factory) {
    if ( typeof S2.define === 'function' && S2.define.amd ) {
Nadia   // AMD. Register as an anonymous module.
Nadia   S2.define('jquery-mousewheel',['jquery'], factory);
    } else if (typeof exports === 'object') {
Nadia   // Node/CommonJS style for Browserify
Nadia   module.exports = factory;
    } else {
Nadia   // Browser globals
Nadia   factory(jQuery);
    }
}(function ($) {

    var toFix  = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
Nadia   toBind = ( 'onwheel' in document || document.documentMode >= 9 ) ?
NadiaNadiaNadiaNadia['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
Nadia   slice  = Array.prototype.slice,
Nadia   nullLowestDeltaTimeout, lowestDelta;

    if ( $.event.fixHooks ) {
Nadia   for ( var i = toFix.length; i; ) {
NadiaNadia  $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
Nadia   }
    }

    var special = $.event.special.mousewheel = {
Nadia   version: '3.1.12',

Nadia   setup: function() {
NadiaNadia  if ( this.addEventListener ) {
NadiaNadiaNadia for ( var i = toBind.length; i; ) {
NadiaNadiaNadiaNadiathis.addEventListener( toBind[--i], handler, false );
NadiaNadiaNadia }
NadiaNadia  } else {
NadiaNadiaNadia this.onmousewheel = handler;
NadiaNadia  }
NadiaNadia  // Store the line height and page height for this particular element
NadiaNadia  $.data(this, 'mousewheel-line-height', special.getLineHeight(this));
NadiaNadia  $.data(this, 'mousewheel-page-height', special.getPageHeight(this));
Nadia   },

Nadia   teardown: function() {
NadiaNadia  if ( this.removeEventListener ) {
NadiaNadiaNadia for ( var i = toBind.length; i; ) {
NadiaNadiaNadiaNadiathis.removeEventListener( toBind[--i], handler, false );
NadiaNadiaNadia }
NadiaNadia  } else {
NadiaNadiaNadia this.onmousewheel = null;
NadiaNadia  }
NadiaNadia  // Clean up the data we added to the element
NadiaNadia  $.removeData(this, 'mousewheel-line-height');
NadiaNadia  $.removeData(this, 'mousewheel-page-height');
Nadia   },

Nadia   getLineHeight: function(elem) {
NadiaNadia  var $elem = $(elem),
NadiaNadiaNadia $parent = $elem['offsetParent' in $.fn ? 'offsetParent' : 'parent']();
NadiaNadia  if (!$parent.length) {
NadiaNadiaNadia $parent = $('body');
NadiaNadia  }
NadiaNadia  return parseInt($parent.css('fontSize'), 10) || parseInt($elem.css('fontSize'), 10) || 16;
Nadia   },

Nadia   getPageHeight: function(elem) {
NadiaNadia  return $(elem).height();
Nadia   },

Nadia   settings: {
NadiaNadia  adjustOldDeltas: true, // see shouldAdjustOldDeltas() below
NadiaNadia  normalizeOffset: true  // calls getBoundingClientRect for each event
Nadia   }
    };

    $.fn.extend({
Nadia   mousewheel: function(fn) {
NadiaNadia  return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
Nadia   },

Nadia   unmousewheel: function(fn) {
NadiaNadia  return this.unbind('mousewheel', fn);
Nadia   }
    });


    function handler(event) {
Nadia   var orgEvent   = event || window.event,
NadiaNadia  argsNadia  = slice.call(arguments, 1),
NadiaNadia  deltaNadia = 0,
NadiaNadia  deltaXNadia= 0,
NadiaNadia  deltaYNadia= 0,
NadiaNadia  absDelta   = 0,
NadiaNadia  offsetX    = 0,
NadiaNadia  offsetY    = 0;
Nadia   event = $.event.fix(orgEvent);
Nadia   event.type = 'mousewheel';

Nadia   // Old school scrollwheel delta
Nadia   if ( 'detail'Nadia in orgEvent ) { deltaY = orgEvent.detail * -1;Nadia }
Nadia   if ( 'wheelDelta'  in orgEvent ) { deltaY = orgEvent.wheelDelta;Nadia  }
Nadia   if ( 'wheelDeltaY' in orgEvent ) { deltaY = orgEvent.wheelDeltaY;Nadia }
Nadia   if ( 'wheelDeltaX' in orgEvent ) { deltaX = orgEvent.wheelDeltaX * -1; }

Nadia   // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
Nadia   if ( 'axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
NadiaNadia  deltaX = deltaY * -1;
NadiaNadia  deltaY = 0;
Nadia   }

Nadia   // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
Nadia   delta = deltaY === 0 ? deltaX : deltaY;

Nadia   // New school wheel delta (wheel event)
Nadia   if ( 'deltaY' in orgEvent ) {
NadiaNadia  deltaY = orgEvent.deltaY * -1;
NadiaNadia  delta  = deltaY;
Nadia   }
Nadia   if ( 'deltaX' in orgEvent ) {
NadiaNadia  deltaX = orgEvent.deltaX;
NadiaNadia  if ( deltaY === 0 ) { delta  = deltaX * -1; }
Nadia   }

Nadia   // No change actually happened, no reason to go any further
Nadia   if ( deltaY === 0 && deltaX === 0 ) { return; }

Nadia   // Need to convert lines and pages to pixels if we aren't already in pixels
Nadia   // There are three delta modes:
Nadia   //   * deltaMode 0 is by pixels, nothing to do
Nadia   //   * deltaMode 1 is by lines
Nadia   //   * deltaMode 2 is by pages
Nadia   if ( orgEvent.deltaMode === 1 ) {
NadiaNadia  var lineHeight = $.data(this, 'mousewheel-line-height');
NadiaNadia  delta  *= lineHeight;
NadiaNadia  deltaY *= lineHeight;
NadiaNadia  deltaX *= lineHeight;
Nadia   } else if ( orgEvent.deltaMode === 2 ) {
NadiaNadia  var pageHeight = $.data(this, 'mousewheel-page-height');
NadiaNadia  delta  *= pageHeight;
NadiaNadia  deltaY *= pageHeight;
NadiaNadia  deltaX *= pageHeight;
Nadia   }

Nadia   // Store lowest absolute delta to normalize the delta values
Nadia   absDelta = Math.max( Math.abs(deltaY), Math.abs(deltaX) );

Nadia   if ( !lowestDelta || absDelta < lowestDelta ) {
NadiaNadia  lowestDelta = absDelta;

NadiaNadia  // Adjust older deltas if necessary
NadiaNadia  if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
NadiaNadiaNadia lowestDelta /= 40;
NadiaNadia  }
Nadia   }

Nadia   // Adjust older deltas if necessary
Nadia   if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
NadiaNadia  // Divide all the things by 40!
NadiaNadia  delta  /= 40;
NadiaNadia  deltaX /= 40;
NadiaNadia  deltaY /= 40;
Nadia   }

Nadia   // Get a whole, normalized value for the deltas
Nadia   delta  = Math[ delta  >= 1 ? 'floor' : 'ceil' ](delta  / lowestDelta);
Nadia   deltaX = Math[ deltaX >= 1 ? 'floor' : 'ceil' ](deltaX / lowestDelta);
Nadia   deltaY = Math[ deltaY >= 1 ? 'floor' : 'ceil' ](deltaY / lowestDelta);

Nadia   // Normalise offsetX and offsetY properties
Nadia   if ( special.settings.normalizeOffset && this.getBoundingClientRect ) {
NadiaNadia  var boundingRect = this.getBoundingClientRect();
NadiaNadia  offsetX = event.clientX - boundingRect.left;
NadiaNadia  offsetY = event.clientY - boundingRect.top;
Nadia   }

Nadia   // Add information to the event object
Nadia   event.deltaX = deltaX;
Nadia   event.deltaY = deltaY;
Nadia   event.deltaFactor = lowestDelta;
Nadia   event.offsetX = offsetX;
Nadia   event.offsetY = offsetY;
Nadia   // Go ahead and set deltaMode to 0 since we converted to pixels
Nadia   // Although this is a little odd since we overwrite the deltaX/Y
Nadia   // properties with normalized deltas.
Nadia   event.deltaMode = 0;

Nadia   // Add event and delta to the front of the arguments
Nadia   args.unshift(event, delta, deltaX, deltaY);

Nadia   // Clearout lowestDelta after sometime to better
Nadia   // handle multiple device types that give different
Nadia   // a different lowestDelta
Nadia   // Ex: trackpad = 3 and mouse wheel = 120
Nadia   if (nullLowestDeltaTimeout) { clearTimeout(nullLowestDeltaTimeout); }
Nadia   nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);

Nadia   return ($.event.dispatch || $.event.handle).apply(this, args);
    }

    function nullLowestDelta() {
Nadia   lowestDelta = null;
    }

    function shouldAdjustOldDeltas(orgEvent, absDelta) {
Nadia   // If this is an older event and the delta is divisable by 120,
Nadia   // then we are assuming that the browser is treating this as an
Nadia   // older mouse wheel event and that we should divide the deltas
Nadia   // by 40 to try and get a more usable deltaFactor.
Nadia   // Side note, this actually impacts the reported scroll distance
Nadia   // in older browsers and can cause scrolling to be slower than native.
Nadia   // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
Nadia   return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
    }

}));

S2.define('jquery.select2',[
  'jquery',
  'jquery-mousewheel',

  './select2/core',
  './select2/defaults'
], function ($, _, Select2, Defaults) {
  if ($.fn.select2 == null) {
    // All methods that should return the element
    var thisMethods = ['open', 'close', 'destroy'];

    $.fn.select2 = function (options) {
Nadia options = options || {};

Nadia if (typeof options === 'object') {
Nadia   this.each(function () {
NadiaNadiavar instanceOptions = $.extend(true, {}, options);

NadiaNadiavar instance = new Select2($(this), instanceOptions);
Nadia   });

Nadia   return this;
Nadia } else if (typeof options === 'string') {
Nadia   var ret;
Nadia   var args = Array.prototype.slice.call(arguments, 1);

Nadia   this.each(function () {
NadiaNadiavar instance = $(this).data('select2');

NadiaNadiaif (instance == null && window.console && console.error) {
NadiaNadia  console.error(
NadiaNadia    'The select2(\'' + options + '\') method was called on an ' +
NadiaNadia    'element that is not using Select2.'
NadiaNadia  );
NadiaNadia}

NadiaNadiaret = instance[options].apply(instance, args);
Nadia   });

Nadia   // Check if we should be returning `this`
Nadia   if ($.inArray(options, thisMethods) > -1) {
NadiaNadiareturn this;
Nadia   }

Nadia   return ret;
Nadia } else {
Nadia   throw new Error('Invalid arguments for Select2: ' + options);
Nadia }
    };
  }

  if ($.fn.select2.defaults == null) {
    $.fn.select2.defaults = Defaults;
  }

  return Select2;
});

  // Return the AMD loader configuration so it can be used outside of this file
  return {
    define: S2.define,
    require: S2.require
  };
}());

  // Autoload the jQuery bindings
  // We know that all of the modules exist above this, so we're safe
  var select2 = S2.require('jquery.select2');

  // Hold the AMD module references on the jQuery function that was just loaded
  // This allows Select2 to use the internal loader outside of this file, such
  // as in the language files.
  jQuery.fn.select2.amd = S2;

  // Return the Select2 instance for anyone who is importing it.
  return select2;
}));
