(function() {
  var findObjs = function(element, props, multiple) {
    var match = multiple ? [] : undefined;

    element.some(function(obj) {
      var all_match = true;
      for (var prop in props) {
        if (!(prop in obj) || obj[prop] !== props[prop]) {
          all_match = false;
        }
      }

      if (all_match) {
        if (multiple) {
          match.push(obj);
        } else {
          match = obj;
          return true;
        }
      }
    });

    return match;
  };

  var _ = function(element) {
    u = {
      first: function() {
        return element[0];
      },

      last: function() {
        return element[element.length - 1];
      },

      without: function() {
        var result = [],
            args = Array.prototype.slice.call(arguments);

        element.forEach(function(el) {
          if (args.indexOf(el) === -1) { result.push(el); }
        });

        return result;
      },

      lastIndexOf: function(value) {
        for (var i = element.length - 1; i >= 0; i--) {
          if (element[i] === value) { return i; }
        }

        return -1;
      },

      sample: function(num) {
        num = num || 1;
        if (num === 1) {
          return element[Math.floor(Math.random() * element.length)];
        }

        var result = [];
        for (var i = 0; i < num; i++) {
          random_element = element[Math.floor(Math.random() * element.length)];
          result.push(random_element);
        }

        return result;
      },

      findWhere: function(match_properties) {
        return findObjs(element, match_properties, false);
      },

      where: function(match_properties) {
        return findObjs(element, match_properties, true);
      },

      pluck: function(key) {
        var result = [];
        element.forEach(function(el) {
          if (key in el) { result.push(el[key]); }
        });
        return result;
      },

      keys: function() {
        var result = [];
        for (key in element) { result.push(key); }
        return result;
      },

      values: function() {
        var result = [];
        for (key in element) { result.push(element[key]); }
        return result;
      },

      pick: function() {
        var result = {},
            args = Array.prototype.slice.call(arguments);

        args.forEach(function(prop) {
          if (prop in element) {
            result[prop] = element[prop];
          }
        });

        return result;
      },

      omit: function() {
        var result = {},
            args = Array.prototype.slice.call(arguments);

        for (prop in element) {
          if (args.indexOf(prop) === -1) {
            result[prop] = element[prop];
          }
        }

        return result;
      },

      has: function(prop) {
        return {}.hasOwnProperty.call(element, prop);
      }
    };

    (["isElement", "isArray", "isObject", "isFunction", "isBoolean", "isString", "isNumber"]).forEach(function(method) {
      u[method] = function() { _[method].call(u, element); }
    });

    return u;
  };

  _.range = function(low, high) {
    var result = [];
    if (arguments.length <= 0) {
      return result;
    } else if (arguments.length == 1) {
      var start = 0,
          stop = low;
    } else {
      var start = low,
          stop = high;
    }

    for (var i = start; i < stop; i++) { result.push(i); }

    return result;
  };

  _.extend = function() {
    var args = Array.prototype.slice.call(arguments);
    for (var i = args.length - 1; i > 0; i--) {
      var obj = args[i],
          next = args[i - 1];

      for (var prop in obj) { next[prop] = obj[prop]; }
    }

    return args[0];
  };

  _.isElement = function(obj) {
    return obj && obj.nodeType === 1;
  };

  _.isArray = Array.isArray || function(obj) {
    return toString.call(obj) === "[object Array]";
  };

  _.isObject = function(obj) {
    var type = typeof obj;
    return type === "function" || type === "object" && !!obj;
  };

  _.isFunction = function(obj) {
    var type = typeof obj;

    return type === "function";
  };

  (["Boolean", "String", "Number"]).forEach(function(method) {
    _["is" + method] = function(obj) {
      return toString.call(obj) === "[object " + method + "]";
    };
  });

  window._ = _;
}) ();
