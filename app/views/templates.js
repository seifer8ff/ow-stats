Handlebars.registerPartial("noPlaytime", Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<section class=\"hero-stat-section hero-message\">\n	<span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span>\n	<h4>No Playtime!</h4>\n	<hr>\n	<p>You need to play this hero more often in Quickplay to see statistics!</p>\n</section>";
},"useData":true}));
this["OW"] = this["OW"] || {};
this["OW"]["templates"] = this["OW"]["templates"] || {};
this["OW"]["templates"]["hero"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials.stats,depth0,{"name":"stats","data":data,"indent":"\t\t\t","helpers":helpers,"partials":partials})) != null ? stack1 : "");
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials.noPlaytime,depth0,{"name":"noPlaytime","data":data,"indent":"\t\t\t","helpers":helpers,"partials":partials})) != null ? stack1 : "");
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=container.escapeExpression;

  return "<article class=\"col-xs-6 col-sm-3 hero-section fade-in\" id=\""
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "\">\n	<div class=\"panel panel-default\">\n		<span class=\"glyphicon glyphicon-remove-circle hero-remove\" aria-hidden=\"true\"></span>\n		<div class=\"hero-icon ohi-"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "\"></div>\n		<h3 class=\"hero-name text-center\">"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</h3>\n		<hr>\n"
    + ((stack1 = helpers["if"].call(depth0,(depth0 != null ? depth0.playtime : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "		<hr>\n		<a class=\"hero-link\" href=\"/hero.html?name="
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "\">More Info</a>\n	</div>\n</article>";
},"usePartial":true,"useData":true});
Handlebars.registerPartial("stats", Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "	<section class=\"hero-stat-section hero-healing\">\n		<h5>Healing</h5>\n		<div class=\"stat-bar\">"
    + container.escapeExpression(((helper = (helper = helpers.healing_done_average || (depth0 != null ? depth0.healing_done_average : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"healing_done_average","hash":{},"data":data}) : helper)))
    + "</div>\n	</section>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=container.escapeExpression;

  return "<section class=\"hero-stat-section hero-playtime\">\n	<h5>Playtime</h5>\n	<div class=\"stat-bar\">"
    + alias3(((helper = (helper = helpers.playtime || (depth0 != null ? depth0.playtime : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"playtime","hash":{},"data":data}) : helper)))
    + "</div>\n</section>\n<section class=\"hero-stat-section hero-elims\">\n	<h5>Eliminations</h5>\n	<div class=\"stat-bar\">"
    + alias3(((helper = (helper = helpers.eliminations_average || (depth0 != null ? depth0.eliminations_average : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"eliminations_average","hash":{},"data":data}) : helper)))
    + "</div>\n</section>\n<section class=\"hero-stat-section hero-deaths\">\n	<h5>Deaths</h5>\n	<div class=\"stat-bar\">"
    + alias3(((helper = (helper = helpers.deaths_average || (depth0 != null ? depth0.deaths_average : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"deaths_average","hash":{},"data":data}) : helper)))
    + "</div>\n</section>\n<section class=\"hero-stat-section hero-damage\">\n	<h5>Damage Done</h5>\n	<div class=\"stat-bar\">"
    + alias3(((helper = (helper = helpers.damage_done_average || (depth0 != null ? depth0.damage_done_average : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"damage_done_average","hash":{},"data":data}) : helper)))
    + "</div>\n</section>\n"
    + ((stack1 = helpers["if"].call(depth0,(depth0 != null ? depth0.healing_done_average : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true}));
this["OW"]["templates"]["heroInfo"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "		<h4 id=\"hero-armor\">Armor: "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.heroInfo : depth0)) != null ? stack1.armour : stack1), depth0))
    + "</h4>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "		<h4 id=\"hero-shield\">Shield: "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.heroInfo : depth0)) != null ? stack1.shield : stack1), depth0))
    + "</h4>\n";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0,((stack1 = (depth0 != null ? depth0.userStats : depth0)) != null ? stack1.playtime : stack1),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.program(8, data, 0),"data":data})) != null ? stack1 : "");
},"6":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials.stats,(depth0 != null ? depth0.userStats : depth0),{"name":"stats","data":data,"indent":"\t\t\t","helpers":helpers,"partials":partials})) != null ? stack1 : "");
},"8":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials.noPlaytime,depth0,{"name":"noPlaytime","data":data,"indent":"\t\t\t","helpers":helpers,"partials":partials})) != null ? stack1 : "");
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=container.escapeExpression, alias4=container.lambda;

  return "<div class=\"col-sm-4 panel panel-default hero-section fade-in\" id=\""
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "\">\n	<h1>"
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.heroInfo : depth0)) != null ? stack1.name : stack1), depth0))
    + "</h1>\n	<hr>\n	<dl class=\"dl-horizontal\">\n		<dt>Real Name</dt>\n		<dd>"
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.heroInfo : depth0)) != null ? stack1.real_name : stack1), depth0))
    + "</dd>\n		<dt>Age</dt>\n		<dd>"
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.heroInfo : depth0)) != null ? stack1.age : stack1), depth0))
    + "</dd>\n		<dt>Prior Affiliation</dt>\n		<dd>"
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.heroInfo : depth0)) != null ? stack1.affiliation : stack1), depth0))
    + "</dd>\n		<dt>Base of Operations</dt>\n		<dd>"
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.heroInfo : depth0)) != null ? stack1.base_of_operations : stack1), depth0))
    + "</dd>\n	</dl>\n	<hr>\n	<p>"
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.heroInfo : depth0)) != null ? stack1.description : stack1), depth0))
    + "</p>\n	<hr>\n	<h4 id=\"hero-health\">Health: "
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.heroInfo : depth0)) != null ? stack1.health : stack1), depth0))
    + "</h4>\n"
    + ((stack1 = helpers["if"].call(depth0,((stack1 = (depth0 != null ? depth0.heroInfo : depth0)) != null ? stack1.armour : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(depth0,((stack1 = (depth0 != null ? depth0.heroInfo : depth0)) != null ? stack1.shield : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "	<hr>\n"
    + ((stack1 = helpers["if"].call(depth0,(depth0 != null ? depth0.userStats : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n<div class=\"col-sm-7 col-sm-offset-1\" id=\"hero-main\">\n	<img class=\"img-rounded img-responsive fade-in\" id=\"hero-img\" src=\"../img/ow-"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "-full.jpg\">\n</div>";
},"usePartial":true,"useData":true});