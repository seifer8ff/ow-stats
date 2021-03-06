var heroSingle = (function() {
	
	var settings = {
		heroAPIURL: "https://overwatch-api.net/api/v1/hero/",
		user: Store.getLocal("user"),
		heroes: Store.getLocal("heroes")
	} 




	function init(heroes, user) {
		if (heroes) {
			settings.heroes = heroes;
		}
		if (user) {
			settings.user = user;
		}
	}

	function initPage() {
		console.log('building hero page');
		// for hero page, build the hero section
		let thisHero = getHeroFromURL();
	
		// if there's a valid hero in query string, build hero info section. else display error page
		if (thisHero) {
	
			// pass in both hero info and user stats (if available) to heroInfo template
			var context = { 
				user: settings.user,
				heroes: settings.heroes, 
				hero: thisHero 
			}
			if (!thisHero.stats.playtime) {
				context.noUser = true;
			}
	
			// build hero info section and add to DOM
			var newSection = OW.templates.heroSingle(context);
			let placeholder = document.getElementById("placeholder");

			placeholder.insertAdjacentHTML("afterend", newSection);
			placeholder.parentNode.removeChild(placeholder);
	
			if (thisHero.stats.playtime.value !== null) {
				settings.user = utils.updateMaxStats(settings.user, settings.heroes, true);
				utils.updateStatBars(settings.user);
			}
		} else {
			console.log('no hero');
			var context = { }
	
			// add error message to DOM
			var errorSection = OW.templates.error(context);
			document.body.querySelector("main").insertAdjacentHTML("beforeend", errorSection);
		}
	}

	function getHeroFromURL() {
		// get hero name from query string
		var heroName = window.location.search;
		heroName = heroName.replace("?name=", "");
	
		return settings.heroes[heroName];
	}



	return {
		init: init,
		initPage: initPage
	}
}());
	
	
	