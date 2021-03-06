var heroMultiple = (function() {
	
	var settings = {
		heroStatsURL: "https://owapi.net/api/v3/u/username/blob",
		user: Store.getLocal('user'),
		heroes: Store.getLocal('heroes'),
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
		console.log('initializing multiple hero page');

		// sort heroes by role for display in hero select section
		let sortedHeroes = utils.sortHeroes(settings.heroes);

		var context = { 
			user: settings.user,
			heroes: settings.heroes, 
			sortedHeroes: sortedHeroes
		};

		var newSection = OW.templates.heroMultiple(context);
		let placeholder = document.getElementById("placeholder");

		placeholder.insertAdjacentHTML("afterend", newSection);
		placeholder.parentNode.removeChild(placeholder);

		settings.user = utils.updateMaxStats(settings.user, settings.heroes, false);
		utils.updateStatBars(settings.user);

		initEventListeners();
	}


	function initEventListeners() {
		// remove hero click handler
		$(".hero-container").on("click", ".hero-remove", function() {
			let hero = settings.heroes[this.dataset.hero];
			toggleHero(hero);
		});

		// on toggle, update heroDisplay and build or remove hero section
		$(".hero-toggle").on("change", function(e) {
			if (!this.disabled) {
				let hero = settings.heroes[this.dataset.hero];
				toggleHero(hero);
			}
		});

		// add touch feedback to hero sections on mobile (triggers hover/focus/active state)
		$(".hero-container").on("touchstart", ".hero.panel", function() {
			console.log('touched');
		});
	}

	function toggleHero(hero) {
		return new Promise(function(resolve) {
			console.log(hero);

			let heroToggles = document.querySelectorAll("[data-hero=" + hero.normalizedName + "]");
			for (let i = 0; i < heroToggles.length; i++) {
				heroToggles[i].disabled = true;
				heroToggles[i].checked = !heroToggles[i].checked;
				heroToggles[i].parentNode.classList.toggle("active");
			}

			if (hero.normalizedName in settings.user.selectedHeroes) {
				delete settings.user.selectedHeroes[hero.normalizedName];
				removeHeroSection(hero);
			} else {
				settings.user.selectedHeroes[hero.normalizedName] = true;
				addHeroSection(hero);
				for (let i = 0; i < heroToggles.length; i++) {
					heroToggles[i].disabled = false;
				}
			}
			Store.setLocal("user", settings.user, 7 * 60 * 60 * 1000);
			// anytime the heroes displayed are changed we need to get max stats of chosen heroes
			settings.user = utils.updateMaxStats(settings.user, settings.heroes, false);
			utils.updateStatBars(settings.user);

			return resolve(hero);
		})
	}


	// adds the hero section to the dom for the given hero and updates hero display array
	function addHeroSection(hero) {
		var context = { hero: hero };
		var newSection = Handlebars.partials.heroSummary(context);

		document.getElementById("hero-multiple-parent").insertAdjacentHTML("beforeend", newSection);
	}

	// deletes the hero section from the dom for the given hero and updates hero display array
	function removeHeroSection(hero) {
		var heroSection = document.getElementById(hero.normalizedName);

		// fadeout hero section
		heroSection.classList.add("fade-out");

		// wait for css fadeout to end, then delete hero-section
		setTimeout(function() {
			heroSection.innerHTML = "";
			heroSection.parentNode.removeChild(heroSection);
			let heroToggles = document.querySelectorAll("[data-hero=" + hero.normalizedName + "]");
			for (let i = 0; i < heroToggles.length; i++) {
				heroToggles[i].disabled = false;
			}
		}, 550);
	}

	



	return {
		init: init,
		initPage: initPage
	}

}());

