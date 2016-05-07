var template = Handlebars.compile($("#cars").html());

var Car = new ModelConstructor(),
    Cars = new CollectionConstructor(),
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

$("a").on("click", function(e) {
  e.preventDefault();

  inventory.reset();
  render();
});

$("form").on("submit", function(e) {
  e.preventDefault();
  var $form = $(this),
      properties = {
        make: $form.find("[name=make]").val(),
        model: $form.find("[name=model]").val()
      };

  inventory.add(properties);
  render();
  this.reset();
});

$("ul").on("click", "a", function(e) {
  e.preventDefault();
  var $e = $(e.target);

  inventory.remove(+$e.attr("data-id"));
  $e.closest("li").remove();
});

render();

function render() {
  $("ul").html(template({ cars: inventory.models }));
}
