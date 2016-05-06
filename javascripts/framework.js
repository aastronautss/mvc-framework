var ModelConstructor = function(options) {
  var current_id = 0;

  var Model = function() {
    current_id++;

    this.attributes = {};
    this.id = current_id;
    this.attributes.id = current_id;
  };

  Model.prototype = {
    set: function(prop, new_value) {
      this.attributes[prop] = new_value;
      if (this.change) { this.change(); }
    },

    get: function(prop) {
      return this.attributes[prop];
    }
  };

  _.extend(Model.prototype, options);

  return Model;
};
