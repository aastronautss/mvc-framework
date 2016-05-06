var Car = ModelConstructor(),
    bmw = new Car();

bmw.set("make", "BMW");
bmw.set("model", "328i");

$("#make").text(bmw.get("make"));
$("#model").text(bmw.get("model"));
