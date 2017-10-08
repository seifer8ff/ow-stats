var heroSingle = (function() {
	
	var settings = {
		heroAPIURL: "https://overwatch-api.net/api/v1/hero/",
		user: Store.getLocal("user"),
		heroes: Store.getLocal("heroes")
	} 

	function initPage() {
		console.log('building hero page');
		// for hero page, build the hero section
		let thisHero = getHeroFromURL();
		console.log(thisHero);
		let thisHeroName =  Store.normalizeString(thisHero.name, true).toLowerCase()
	
		// if there's a valid hero in query string, set background and build hero info section. Else display error page
		if (thisHero) {
			setHeroBackground(thisHeroName);
	
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
			document.body.insertAdjacentHTML("afterbegin", newSection);
	
			if (thisHero.stats.playtime.value !== null) {
				settings.user = utils.updateMaxStats(settings.user, settings.heroes, true);
				utils.updateStatBars(settings.user);
			}
		} else {
			document.getElementById("page-error").classList.remove("hidden");
		}
	}

	function getHeroFromURL() {
		// get hero name from query string
		var heroName = window.location.search;
		heroName = heroName.replace("?name=", "");
		console.log(settings.heroes);
	
		return settings.heroes[heroName];
		// return settings.heroes['junkrat'];
	}

	function setHeroBackground(heroName) {
		document.body.classList.add("body-" + heroName);
	}





	return {
		initPage: initPage
	}
}());
	
	
	