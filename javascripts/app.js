var edit_form = Handlebars.compile($("#edit").html()),
    Car = new ModelConstructor(),
    Cars = new CollectionConstructor(),
    CarView = new ViewConstructor({
      tag_name: "li",
      template: Handlebars.compile($("#cars").html()),
      events: {
        "dblclick": function() {
          this.$el.append(edit_form(this.model.attributes));
        },
        "click form a": function(e) {
          e.preventDefault();
          this.$el.find("form").remove();
        },
        "submit": function(e) {
          e.preventDefault();
          var vals = $(e.target).serializeArray();
          this.model.set("make", vals[0].value);
          this.model.set("model", vals[1].value);
          this.$el.find("form").remove();
        }
      }
    }),
    $cars = $("ul"),
    inventory = new Cars(Car);

inventory.set([{
  make: "BMW",
  model: "328i"
}, {
  make: "Mini",
  model: "Cooper"
}, {
  make: "Lotus",
  model: "Elise"
}]);

inventory.models.forEach(function(model) {
  var view = new CarView(model);
  $cars.append(view.$el);
});

$("form a").on("click", function(e) {
  e.preventDefault();

  inventory.reset();
  $cars.empty();
});

$("form").on("submit", function(e) {
  e.preventDefault();
  var $form = $(this),
      properties = {
        make: $form.find("[name=make]").val(),
        model: $form.find("[name=model]").val()
      },
      model;

  model = inventory.add(properties);
  $cars.append((new CarView(model)).$el);
  this.reset();
});

$cars.on("click", "a", function(e) {
  e.preventDefault();
  var $e = $(e.target),
      model = inventory.get(+$e.attr("data-id"));

  model.view.remove();
  inventory.remove(model);
});
