var heroMultiple = (function() {
	
	var settings = {
		heroStatsURL: "https://owapi.net/api/v3/u/username/blob",
		user: Store.getLocal('user'),
		heroes: Store.getLocal('heroes'),
		maxStats: {}
	} 



	function initPage() {
		// sort heroes by role for display in hero select section
		let offense = [], defense = [], tank = [], support = [];
		for (hero in settings.heroes) {
			let thisHero = settings.heroes[hero];
			switch(thisHero.role) {
				case 'offense':
					offense.push(thisHero);
					break;
				case 'defense':
					defense.push(thisHero);
					break;
				case 'tank':
					tank.push(thisHero);
					break;
				case 'support':
					support.push(thisHero);
					break;
			}
		}
		var context = { 
			heroes: settings.heroes, 
			offense: offense, defense: defense, 
			tank: tank, 
			support: support 
		};
		var newSection = OW.templates.heroMultiple(context);

		document.body.insertAdjacentHTML("afterbegin", newSection);

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
	}

	function toggleHero(hero) {
		return new Promise(function(resolve) {
			console.log(hero);

			let heroToggle = document.querySelector("[data-hero=" + hero.normalizedName + "]");
			heroToggle.disabled = true;
			heroToggle.checked = !heroToggle.checked;
			heroToggle.parentNode.classList.toggle("active");

			hero.compare = !hero.compare;
			Store.setLocal("heroes", settings.heroes, 7 * 60 * 60 * 1000);

			if (hero.compare) {
				addHeroSection(hero);
			} else {
				removeHeroSection(hero);
			}
			// anytime the heroDisplay array is changed, we need to get max stats of chosen heroes
			// updateMaxStats(false);

			heroToggle.disabled = false;
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
			delete heroSection;

			// anytime the heroDisplay array is changed, we need to get max stats of chosen heroes
			// updateMaxStats(false);
		}, 550);
	}

	



	return {
		initPage: initPage
	}

}());







// window.onload=function() {

	
// }

// // =====================
// // INDEX PAGE FUNCTIONS 
// // =====================

// function initPage() {
// 	console.log("initializing stats page");

// 	var heroGrids = document.getElementsByClassName("hero-grid");
// 	for (var i = 0; i < heroGrids.length; i++) {
// 		heroGrids[i].classList.remove("hidden");
// 	}
// }



// // deletes the hero section from the dom for the given hero and updates hero display array
// function removeHeroSection(hero, callback) {
// 	var heroSection = document.getElementById(hero);

// 	// remove hero from display array and save updated object to local storage
// 	heroDisplay.splice(heroDisplay.indexOf(hero), 1);
// 	var heroDisplayString = JSON.stringify(heroDisplay);
// 	setLocalStorage("userHeroDisplay", heroDisplayString, 30);

// 	// update state of hero toggle
// 	var heroToggles = document.getElementsByClassName("hero-toggle");
// 	for (var i = 0; i < heroToggles.length; i++) {
// 		if (normalizeString(heroToggles[i].parentNode.textContent, true)  === hero) {
// 			if (heroToggles[i].checked) { heroToggles[i].checked = false; }
// 			heroToggles[i].parentNode.classList.remove("active");
// 		}
// 	}

// 	// fadeout hero section
// 	heroSection.classList.add("fade-out");

// 	// wait for css fadeout to end, then delete hero-section
// 	setTimeout(function() {
// 		heroSection.innerHTML = "";
// 		heroSection.parentNode.removeChild(heroSection);
// 		delete heroSection;

// 		// anytime the heroDisplay array is changed, we need to get max stats of chosen heroes
// 		updateMaxStats(false);

// 		if (callback && typeof callback === "function") {
// 			callback();
// 		}
// 	}, 550);
// }

// // adds the hero section to the dom for the given hero and updates hero display array
// function addHeroSection(hero, callback) {
// 	// add hero from display array and save updated object to local storage
// 	heroDisplay.push(hero);
// 	var heroDisplayString = JSON.stringify(heroDisplay);
// 	setLocalStorage("userHeroDisplay", heroDisplayString, 30);

// 	// build the new hero section 
// 	buildHeroSection(userStats[hero]);

// 	// anytime the heroDisplay array is changed, we need to get max stats of chosen heroes
// 	updateMaxStats(false);

// 	if (callback && typeof callback === "function") {
// 		callback();
// 	}
// }



// // find and save max value of each stat for currently selected heroes
// function updateMaxStats(allHeroes) {
// 	console.log("updating max stats")
// 	// reset max values
// 	userStats.maxElims = 0;
// 	userStats.maxMedals = 0;
// 	userStats.maxDamage = 0;
// 	userStats.maxHealing = 0;
// 	userStats.maxPlaytime = 0;

// 	// for each selected hero, check to see if their stat is higher than current max
// 	for (var hero in userStats) {
// 		// if the hero display is not toggled on and we aren't getting max of all heroes
// 		if (heroDisplay.indexOf(hero) < 0 && !allHeroes) { continue; }

// 		// find the max value of each stat
// 		if (userStats[hero].playtime > userStats.maxPlaytime) {
// 			userStats.maxPlaytime = userStats[hero].playtime;
// 		}
// 		if (userStats[hero].eliminations_per_life > userStats.maxElims) {
// 			userStats.maxElims = userStats[hero].eliminations_per_life;
// 		}
// 		if (userStats[hero].medals > userStats.maxMedals) {
// 			userStats.maxMedals = userStats[hero].medals;
// 		}
// 		if (userStats[hero].all_damage_done_avg_per_10_min > userStats.maxDamage) {
// 			userStats.maxDamage = userStats[hero].all_damage_done_avg_per_10_min;
// 		}
// 		if (userStats[hero].healing_done_avg_per_10_min > userStats.maxHealing) {
// 			userStats.maxHealing = userStats[hero].healing_done_avg_per_10_min;
// 		}
// 	}
// 	// now that we have the max stats for selected heroes, update their stat bar visuals (stat %of max)
// 	updateStatBars();
// }

// // updates bar sizes based on hero stat vs max value of stat
// function updateStatBars() {
// 	console.log("updating stat bars");
// 	var heroSections = document.getElementsByClassName("hero-section");

// 	for (var i = 0; i < heroSections.length; i++) {
// 		var hero = heroSections[i].id;

// 		if (userStats[hero].playtime) {
// 			var playtimeBar = heroSections[i].getElementsByClassName("hero-playtime")[0].childNodes[3];
// 			var width = calcStatBarWidth(userStats[hero].playtime, userStats.maxPlaytime);
// 			playtimeBar.style.width = width + "%"; 
// 		}
// 		if (userStats[hero].eliminations_per_life) {
// 			var elimsBar = heroSections[i].getElementsByClassName("hero-elims")[0].childNodes[3];
// 			var width = calcStatBarWidth(userStats[hero].eliminations_per_life, userStats.maxElims);
// 			elimsBar.style.width = width + "%"; 
// 		}
// 		if (userStats[hero].medals) {
// 			var medalsBar = heroSections[i].getElementsByClassName("hero-medals")[0].childNodes[3];
// 			var width = calcStatBarWidth(userStats[hero].medals, userStats.maxMedals);
// 			medalsBar.style.width = width + "%"; 
// 		}
// 		if (userStats[hero].all_damage_done_avg_per_10_min) {
// 			var damageBar = heroSections[i].getElementsByClassName("hero-damage")[0].childNodes[3];
// 			var width = calcStatBarWidth(userStats[hero].all_damage_done_avg_per_10_min, userStats.maxDamage);
// 			damageBar.style.width = width + "%"; 
// 		}
// 		if (userStats[hero].healing_done_avg_per_10_min) {
// 			var healingBar = heroSections[i].getElementsByClassName("hero-healing")[0].childNodes[3];
// 			var width = calcStatBarWidth(userStats[hero].healing_done_avg_per_10_min, userStats.maxHealing);
// 			healingBar.style.width = width + "%"; 
// 		}
// 	}	
// }

// // calculates the new width of the stat bar, with a minimum value for readability
// function calcStatBarWidth(statValue, max) {
// 	var width = statValue / max * 100;
// 	if (width < 15) { width = 15 } 
// 		return width;
// }

