Handlebars.registerPartial("header", Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "					<li class=\"dropdown\" id=\"account-dropdown\">\n						<a class=\"dropdown-toggle\" id=\"username\" data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\">\n							<img id=\"account-icon\" alt=\"AccountIcon\" src=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.user : depth0)) != null ? stack1.icon : stack1), depth0))
    + "\">\n							"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.user : depth0)) != null ? stack1.username : stack1), depth0))
    + " \n							<span class=\"caret\"></span>\n						</a>\n						<ul class=\"dropdown-menu\">\n							<li><a id=\"logout\">Switch User</a></li>\n						</ul>\n					</li>\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "					<li><a id=\"login\" href=\"/login\">Get Stats</a></li>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<nav class=\"navbar navbar-inverse navbar-fixed-top\">\n	<div class=\"container-fluid\">\n		<!-- Brand and toggle get grouped for better mobile display -->\n		<div class=\"navbar-header\">\n			<button type=\"button\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#bs-example-navbar-collapse-1\" aria-expanded=\"false\">\n				<span class=\"sr-only\">Toggle navigation</span>\n				<span class=\"icon-bar\"></span>\n				<span class=\"icon-bar\"></span>\n				<span class=\"icon-bar\"></span>\n			</button>\n			<a class=\"navbar-brand\" href=\"/\">\n				<img alt=\"Brand\" src=\"../img/OW-banner.svg\">\n			</a>\n		</div>\n\n		<!-- Collect the nav links, forms, and other content for toggling -->\n		<div class=\"collapse navbar-collapse\" id=\"bs-example-navbar-collapse-1\">\n			<ul class=\"nav navbar-nav\">\n				<li class=\"dropdown\">\n					<a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\">Heroes <span class=\"caret\"></span></a>\n					<ul class=\"dropdown-menu\" id=\"hero-list\">\n						<li>\n							<ul class=\"dropdown-inline\">\n								<li class=\"dropdown-header section-label\">OFFENSE</li>\n								<li><a href=\"/hero?name=genji\">Genji</a></li>\n								<li><a href=\"/hero?name=mccree\">McCree</a></li>\n								<li><a href=\"/hero?name=pharah\">Pharah</a></li>\n								<li><a href=\"/hero?name=reaper\">Reaper</a></li>\n								<li><a href=\"/hero?name=soldier76\">Soldier: 76</a></li>\n								<li><a href=\"/hero?name=sombra\">Sombra</a></li>\n								<li><a href=\"/hero?name=tracer\">Tracer</a></li>\n							</ul>\n							<ul class=\"dropdown-inline divider\">\n								<li role=\"separator\" class=\"divider-vertical\"></li>\n							</ul>\n							<ul class=\"dropdown-inline\">\n								<li class=\"dropdown-header section-label\">DEFENSE</li>\n								<li><a href=\"/hero?name=bastion\">Bastion</a></li>\n								<li><a href=\"/hero?name=hanzo\">Hanzo</a></li>\n								<li><a href=\"/hero?name=junkrat\">Junkrat</a></li>\n								<li><a href=\"/hero?name=mei\">Mei</a></li>\n								<li><a href=\"/hero?name=torbjorn\">Torbjorn</a></li>\n								<li><a href=\"/hero?name=widowmaker\">Widowmaker</a></li>\n							</ul>\n							<ul class=\"dropdown-inline divider\">\n								<li role=\"separator\" class=\"divider-vertical\"></li>\n							</ul>\n							<ul class=\"dropdown-inline\">\n								<li class=\"dropdown-header section-label\">TANK</li>\n								<li><a href=\"/hero?name=dva\">D.VA</a></li>\n								<li><a href=\"/hero?name=orisa\">Orisa</a></li>\n								<li><a href=\"/hero?name=reinhardt\">Reinhardt</a></li>\n								<li><a href=\"/hero?name=roadhog\">Roadhog</a></li>\n								<li><a href=\"/hero?name=winston\">Winston</a></li>\n								<li><a href=\"/hero?name=zarya\">Zarya</a></li>\n							</ul>\n							<ul class=\"dropdown-inline divider\">\n								<li role=\"separator\" class=\"divider-vertical\"></li>\n							</ul>\n							<ul class=\"dropdown-inline\">\n								<li class=\"dropdown-header section-label\">SUPPORT</li>\n								<li><a href=\"/hero?name=ana\">Ana</a></li>\n								<li><a href=\"/hero?name=lucio\">Lucio</a></li>\n								<li><a href=\"/hero?name=mercy\">Mercy</a></li>\n								<li><a href=\"/hero?name=symmetra\">Symmetra</a></li>\n								<li><a href=\"/hero?name=zenyatta\">Zenyatta</a></li>\n							</ul>\n						</li>\n					</ul>	\n				</li>\n			</ul>\n			<ul class=\"nav navbar-nav navbar-right\">\n"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.user : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "			</ul>\n		</div><!-- /.navbar-collapse -->\n	</div><!-- /.container-fluid -->\n</nav>";
},"useData":true}));
this["OW"] = this["OW"] || {};
this["OW"]["templates"] = this["OW"]["templates"] || {};
this["OW"]["templates"]["heroMultiple"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.compare : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"2":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials.heroSummary,depth0,{"name":"heroSummary","hash":{"hero":depth0},"data":data,"indent":"\t\t\t\t\t","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<header>\n"
    + ((stack1 = container.invokePartial(partials.header,depth0,{"name":"header","data":data,"indent":"\t","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "</header>\n<main>\n	<div class=\"container\">\n"
    + ((stack1 = container.invokePartial(partials.heroSelect,depth0,{"name":"heroSelect","data":data,"indent":"\t\t","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "	</div>\n	<div class=\"container hero-container\">\n		<div class=\"row\" id=\"hero-multiple-parent\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.heroes : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "		</div>\n	</div>\n</main>";
},"usePartial":true,"useData":true});
Handlebars.registerPartial("heroSelect", Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "								<label class=\"btn btn-default "
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.compare : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n									<input type=\"checkbox\" class=\"hero-toggle\" data-hero=\""
    + alias2(alias1((depth0 != null ? depth0.normalizedName : depth0), depth0))
    + "\" checked="
    + alias2(alias1((depth0 != null ? depth0.compare : depth0), depth0))
    + ">"
    + alias2(alias1((depth0 != null ? depth0.name : depth0), depth0))
    + "\n								</label>\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "active";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<!-- DESKTOP HERO SELECT -->\n<div class=\"row hidden-sm hidden-xs\">\n	<div class=\"hero-grid\">\n		<div class=\"row\">\n			<div class=\"col-xs-12\">\n				<ul class=\"nav nav-tabs\" role=\"tablist\">\n					<li role=\"presentation\" class=\"active\"><a href=\"#hero-grid-offense\" aria-controls=\"hero-grid-offense\" role=\"tab\" data-toggle=\"tab\">OFFENSE</a></li>\n					<li role=\"presentation\"><a href=\"#hero-grid-defense\" aria-controls=\"hero-grid-defense\" role=\"tab\" data-toggle=\"tab\">DEFENSE</a></li>\n					<li role=\"presentation\"><a href=\"#hero-grid-tank\" aria-controls=\"hero-grid-tank\" role=\"tab\" data-toggle=\"tab\">TANK</a></li>\n					<li role=\"presentation\"><a href=\"#hero-grid-support\" aria-controls=\"hero-grid-support\" role=\"tab\" data-toggle=\"tab\">SUPPORT</a></li>\n				</ul>\n			</div>\n			<div class=\"col-xs-12\">\n				<div class=\"tab-content well\">\n					<div role=\"tabpanel\" class=\"tab-pane active\" id=\"hero-grid-offense\">\n						<div class=\"btn-group btn-group-justified\" role=\"group\" aria-label=\"heroes\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.offense : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "						</div>\n					</div>\n					<div role=\"tabpanel\" class=\"tab-pane\" id=\"hero-grid-defense\">\n						<div class=\"btn-group btn-group-justified\" role=\"group\" aria-label=\"heroes\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.defense : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "						</div>\n					</div>\n					<div role=\"tabpanel\" class=\"tab-pane\" id=\"hero-grid-tank\">\n						<div class=\"btn-group btn-group-justified\" role=\"group\" aria-label=\"heroes\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.tank : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "						</div>\n					</div>\n					<div role=\"tabpanel\" class=\"tab-pane\" id=\"hero-grid-support\">\n						<div class=\"btn-group btn-group-justified\" role=\"group\" aria-label=\"heroes\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.support : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "						</div>\n					</div>\n				</div>\n			</div>\n		</div>\n	</div>\n</div>\n\n<!-- MOBILE HERO SELECT -->\n";
},"useData":true}));
this["OW"]["templates"]["heroSingle"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "						<dt>Age</dt>\n						<dd>"
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.hero : depth0)) != null ? stack1.data : stack1)) != null ? stack1.age : stack1), depth0))
    + "</dd>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "						<dt>Prior Affiliation</dt>\n						<dd>"
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.hero : depth0)) != null ? stack1.data : stack1)) != null ? stack1.affiliation : stack1), depth0))
    + "</dd>\n";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "						<dt>Base of Operations</dt>\n						<dd>"
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.hero : depth0)) != null ? stack1.data : stack1)) != null ? stack1.base : stack1), depth0))
    + "</dd>\n";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "					<h4 id=\"hero-armor\">Armor: "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.hero : depth0)) != null ? stack1.data : stack1)) != null ? stack1.armor : stack1), depth0))
    + "</h4>\n";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "					<h4 id=\"hero-shield\">Shield: "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.hero : depth0)) != null ? stack1.data : stack1)) != null ? stack1.shield : stack1), depth0))
    + "</h4>\n";
},"11":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials.noStats,depth0,{"name":"noStats","data":data,"indent":"\t\t\t\t\t","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"13":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.hero : depth0)) != null ? stack1.stats : stack1)) != null ? stack1.playtime : stack1)) != null ? stack1.value : stack1),{"name":"if","hash":{},"fn":container.program(14, data, 0),"inverse":container.program(16, data, 0),"data":data})) != null ? stack1 : "");
},"14":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials.stats,depth0,{"name":"stats","hash":{"heroPage":true,"this":(depth0 != null ? depth0.hero : depth0)},"data":data,"indent":"\t\t\t\t\t\t","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"16":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials.noPlaytime,depth0,{"name":"noPlaytime","data":data,"indent":"\t\t\t\t\t\t","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {});

  return "<header>\n"
    + ((stack1 = container.invokePartial(partials.header,depth0,{"name":"header","data":data,"indent":"\t","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "</header>\n<main>\n	<span id=\"ow-bg\"></span>\n\n\n	<div class=\"container hero-container\">\n		<div class=\"row\">\n			<article class=\"col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-0 col-md-5 col-lg-4 panel panel-default hero-section fade-in\" id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.hero : depth0)) != null ? stack1.normalizedName : stack1), depth0))
    + "\">\n				<h1>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.hero : depth0)) != null ? stack1.name : stack1), depth0))
    + "</h1>\n				<hr class=\"visible-xs\">\n				<img class=\"visible-xs img-rounded img-responsive hero-img fade-in\" src=\"../img/ow-"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.hero : depth0)) != null ? stack1.normalizedName : stack1), depth0))
    + "-full.jpg\">\n				<hr>\n				<dl class=\"dl-horizontal\">\n					<dt>Real Name</dt>\n					<dd>"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.hero : depth0)) != null ? stack1.data : stack1)) != null ? stack1.realName : stack1), depth0))
    + "</dd>\n"
    + ((stack1 = helpers["if"].call(alias3,((stack1 = ((stack1 = (depth0 != null ? depth0.hero : depth0)) != null ? stack1.data : stack1)) != null ? stack1.age : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias3,((stack1 = ((stack1 = (depth0 != null ? depth0.hero : depth0)) != null ? stack1.data : stack1)) != null ? stack1.affiliation : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias3,((stack1 = ((stack1 = (depth0 != null ? depth0.hero : depth0)) != null ? stack1.data : stack1)) != null ? stack1.base : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "				</dl>\n				<hr>\n				<p>"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.hero : depth0)) != null ? stack1.data : stack1)) != null ? stack1.description : stack1), depth0))
    + "</p>\n				<hr>\n				<h4 id=\"hero-health\">Health: "
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.hero : depth0)) != null ? stack1.data : stack1)) != null ? stack1.health : stack1), depth0))
    + "</h4>\n"
    + ((stack1 = helpers["if"].call(alias3,((stack1 = ((stack1 = (depth0 != null ? depth0.hero : depth0)) != null ? stack1.data : stack1)) != null ? stack1.armor : stack1),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias3,((stack1 = ((stack1 = (depth0 != null ? depth0.hero : depth0)) != null ? stack1.data : stack1)) != null ? stack1.shield : stack1),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias3,(depth0 != null ? depth0.noUser : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.program(13, data, 0),"data":data})) != null ? stack1 : "")
    + "				<div class=\"hero-link\">\n					<hr>\n					<a href=\"/\">Back to Heroes</a>\n				</div>\n			</article>\n			<aside class=\"hidden-xs col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-0 col-md-6 col-md-offset-1 col-lg-7 col-lg-offset-1 hero-aside\">\n				<img class=\"img-rounded img-responsive hero-img fade-in\" src=\"../img/ow-"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.hero : depth0)) != null ? stack1.normalizedName : stack1), depth0))
    + "-full.jpg\">\n			</aside>\n		</div>\n	</div>\n</main>";
},"usePartial":true,"useData":true});
Handlebars.registerPartial("heroSummary", Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials.stats,depth0,{"name":"stats","data":data,"indent":"\t\t\t","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials.noPlaytime,depth0,{"name":"noPlaytime","data":data,"indent":"\t\t\t","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "<article class=\"col-xs-6 col-sm-3 hero-section fade-in\" id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.hero : depth0)) != null ? stack1.normalizedName : stack1), depth0))
    + "\">\n	<div class=\"panel panel-default\">\n		<span class=\"glyphicon glyphicon-remove-circle hero-remove\" aria-hidden=\"true\" data-hero=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.hero : depth0)) != null ? stack1.normalizedName : stack1), depth0))
    + "\"></span>\n		<div class=\"hidden-xs hero-icon ohi-"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.hero : depth0)) != null ? stack1.normalizedName : stack1), depth0))
    + "\"></div>\n		<h3 class=\"hero-name text-center\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.hero : depth0)) != null ? stack1.name : stack1), depth0))
    + "</h3>\n"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.hero : depth0)) != null ? stack1.stats : stack1)) != null ? stack1.playtime : stack1)) != null ? stack1.value : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "		<div class=\"hero-link\">\n			<hr>\n			<a href=\"/hero?name="
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.hero : depth0)) != null ? stack1.normalizedName : stack1), depth0))
    + "\">More Info</a>\n		</div>\n	</div>\n</article>";
},"usePartial":true,"useData":true}));
this["OW"]["templates"]["login"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<header>\n"
    + ((stack1 = container.invokePartial(partials.header,depth0,{"name":"header","data":data,"indent":"\t","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "</header>\n<main>\n	<!-- error messages -->\n	<div class=\"container\">\n		<div class=\"alert alert-danger hidden fade-in\" id=\"battletag-not-found\" role=\"alert\">There was an error requesting statistics for that BattleTag. Double check your BattleTag, and try again later.</div>\n		<div class=\"alert alert-danger hidden fade-in\" id=\"battletag-format\" role=\"alert\">Invalid BattleTag format. BattleTag format should match: example#1234</div>\n	</div>\n\n	<!-- login form -->\n	<div class=\"container\">\n		<section class=\"jumbotron\" id=\"form-username\">\n			<h1>Overwatch Hero Statistics</h1>\n			<hr>\n			<p class=\"text-center\">Enter your BattleTag to see statistics about the Heroes you use in Quick Play!</p>\n			<form class=\"form-inline\">\n				<label for=\"inputUsername\" class=\"control-label\">BattleTag</label>\n				<input type=\"text\" class=\"form-control\" id=\"inputUsername\" name=\"username\" placeholder=\"example#1234\" required>\n				<button type=\"submit\" class=\"btn btn-default\">Get Stats</button>\n			</form>\n		</section>\n	</div>\n</main>\n";
},"usePartial":true,"useData":true});
Handlebars.registerPartial("noPlaytime", Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<hr>\n<section class=\"hero-stat-section hero-message\">\n	<span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span>\n	<h4>No Playtime!</h4>\n	<hr>\n	<p>Play this hero more often in Quick Play to see statistics!</p>\n</section>";
},"useData":true}));
Handlebars.registerPartial("noStats", Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<hr>\n<section class=\"hero-stat-section hero-message\">\n	<span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span>\n	<h4>No Stats!</h4>\n	<hr>\n	<p>Connect a BattleTag to get statistics for this hero!</p>\n</section>";
},"useData":true}));
Handlebars.registerPartial("stats", Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "	<h6 class=\"section-label text-uppercase\">Hero VS All</h6>\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "	<h6 class=\"section-label text-uppercase\">Hero VS Selected</h6>\n";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.value : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"6":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.lambda, alias2=container.escapeExpression;

  return "		<section class=\"hero-stat-section\">\n			<h5>"
    + alias2(alias1((depth0 != null ? depth0.name : depth0), depth0))
    + "</h5>\n			<div class=\"stat-bar\" data-stat=\""
    + alias2(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"key","hash":{},"data":data}) : helper)))
    + "\">"
    + alias2(alias1((depth0 != null ? depth0.value : depth0), depth0))
    + "</div>\n		</section>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<hr>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.heroPage : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers.each.call(alias1,((stack1 = (depth0 != null ? depth0.hero : depth0)) != null ? stack1.stats : stack1),{"name":"each","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true}));