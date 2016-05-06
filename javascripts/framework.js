var ModelConstructor = function(options) {
  var current_id = 0;

  var Model = function(options) {
    current_id++;
    var self = this;

    self.attributes = options || {};

    if (self.attributes.change && _.isFunction(self.attributes)) {
      self.__events.push(self.attributes.change);
    }

    self.id = current_id;
    self.attributes.id = current_id;
  };

  Model.prototype = {
    __events: [],

    triggerChange: function() {
      this.__events.forEach(function(event) {
        event();
      });
    },

    addCallback: function(callback) {
      if (_.isFunction(callback)) { this.__events.push(callback); }
    },

    set: function(prop, new_value) {
      this.attributes[prop] = new_value;
      this.triggerChange();
    },

    get: function(prop) {
      return this.attributes[prop];
    },

    remove: function(prop) {
      delete this.attributes[prop];
      this.triggerChange();
    }
  };

  _.extend(Model.prototype, options);

  return Model;
};
