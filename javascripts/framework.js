// ====----------------------====
// framework.js
// ====----------------------====
//
// A simple client-side MVC framework for single-page applications.
//
// Dependencies: jQuery, utilities.js, and prefers Handlebars for templating.

// ====----------------------====
// Model
// ====----------------------====

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

// ====----------------------====
// Collection
// ====----------------------====

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
      found_model.__remove();
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

// ====----------------------====
// View
// ====----------------------====

var ViewConstructor = function(options) {
  var View = function(model) {
    var self = this;

    self.model = model;
    self.model.addCallback(self.render.bind(self));
    self.model.__remove = self.remove.bind(self);
    self.model.view = self;

    this.attributes["data-id"] = this.model.id;
    self.$el = $("<" + self.tag_name + " />", this.attributes);

    self.render();
  };

  View.prototype = {
    tag_name: "div",
    attributes: {},
    events: {},

    template: function () {},

    render: function() {
      this.unbindEvents();
      this.$el.html(this.template(this.model.attributes));
      this.bindEvents();
      return this.$el;
    },

    bindEvents: function() {
      var $el = this.$el,
          event, selector, ary;

      for (var prop in this.events) {
        ary = prop.split(" ");
        selector = ary.length > 1 ? ary.slice(1).join(' ') : undefined
        event = ary[0];

        if (selector) {
          $el.on(event + ".view", selector, this.events[prop].bind(this));
        }
        else {
          $el.on(event + ".view", this.events[prop].bind(this));
        }
      }
    },

    unbindEvents: function() {
      this.$el.off(".view");
    },

    remove: function() {
      this.unbindEvents();
      this.$el.remove();
    }
  };

  _.extend(View.prototype, options);

  return View;
};
