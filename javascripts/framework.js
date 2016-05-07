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

var CollectionConstructor = function(options) {
  var Collection = function(model) {
    var self = this;

    self.model = model;
    self.models = [];
  };

  Collection.prototype = {
    reset: function() { this.models = []; },

    add: function(new_model) {
      var old_model = _(this.models).findWhere({ id: new_model.id });
      if (old_model) { return old_model; }

      var output = new this.model(new_model);
      this.models.push(output);
      return output;
    },

    remove: function(model) {
      var model = _.isNumber(model) ? { id: model } : model;

      found_model = _(this.models).findWhere(model);
      if (found_model) { this.models = _(this.models).without(found_model); }
    },

    set: function(models) {
      var models = _.isArray(models) ? models : [models],
          self = this;

      self.reset();
      models.forEach(function(model) {
        self.add(model);
      });
    },

    get: function(id) {
      return _(this.models).findWhere({ id: id });
    }
  };

  _.extend(Collection.prototype, options);

  return Collection;
};
