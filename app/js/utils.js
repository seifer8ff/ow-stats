var utils = (function() {
	
	var settings = {
	} 

	// find and save max value of each stat for currently selected heroes
	function updateMaxStats(user, heroes, allHeroes) {
		console.log("updating max stats");

		if (!user || !heroes) {
			return null;
		}

		// reset max values
		user.maxStats.elims.value = 0;
		user.maxStats.medals.value = 0;
		user.maxStats.heroDamage.value = 0;
		user.maxStats.healing.value = 0;
		user.maxStats.playtime.value = 0;

		// for each selected hero, check to see if their stat is higher than current max
		for (var hero in heroes) {
			let thisHero = heroes[hero];

			// only consider heroes toggled on for comparison unless allHeroes is true
			if (!thisHero.compare && !allHeroes) { 
				continue;
			}

			for (stat in user.maxStats) {
				let maxValue = user.maxStats[stat].value;
				let thisHeroValue = thisHero.stats[stat].value;

				if (thisHeroValue > maxValue) {
					user.maxStats[stat].value = thisHeroValue;
				}
			}
		}
		return user;
	}

	// updates bar sizes based on hero stat vs max value of stat
	function updateStatBars(user) {
		console.log("updating stat bars");
		let statBars = document.getElementsByClassName("stat-bar");

		for (let i = 0; i < statBars.length; i++) {
			let thisStat = statBars[i].dataset.stat;
			let thisStatValue = Number(statBars[i].textContent);
			let width = calcStatBarWidth(thisStatValue, user.maxStats[thisStat].value);

			statBars[i].style.width = width + "%"; 
		}
	}

	// calculates the new width of the stat bar, with a minimum value for readability
	function calcStatBarWidth(statValue, max) {
		var width = statValue / max * 100;
		if (width < 15) { width = 15 } 
			return width;
	}

	function sortHeroes(heroes) {
		let sortedHeroes = {
			offense: [],
			defense: [],
			tank: [],
			support: []
		}
		for (hero in heroes) {
			let thisHero = heroes[hero];
			switch(thisHero.role) {
				case 'offense':
				sortedHeroes.offense.push(thisHero);
					break;
				case 'defense':
				sortedHeroes.defense.push(thisHero);
					break;
				case 'tank':
				sortedHeroes.tank.push(thisHero);
					break;
				case 'support':
				sortedHeroes.support.push(thisHero);
					break;
			}
		}
		return sortedHeroes;
	}

	function showAlert (id) {
		// if id parameter is valid, hide all alerts, then show the given alert (to trigger fade in)
		if (id && typeof id === "string") {
			hideAlert();
			setTimeout(function() {
				document.getElementById(id).classList.remove("hidden");
			}, 200);
		}
	}
	
	function hideAlert(id) {
		// if id parameter is given and is valid, hide that alert
		if (id && typeof id === "string") {
			document.getElementById(id).classList.add("hidden");
		} else {
			// if no id is given, hide all alerts
			var alerts = document.getElementsByClassName("alert");
			for (var i = 0; i < alerts.length; i++) {
				alerts[i].classList.add("hidden");
			}
		}
	}

	function showLoader() {
		var context = { }

		var newLoader = Handlebars.partials.loader(context);
		document.body.insertAdjacentHTML("beforeend", newLoader);
	}

	function hideLoader() {
		let loaders = document.getElementsByClassName("loader");

		for (let i = 0; i < loaders.length; i++) {
			loaders[i].innerHTML = "";
			loaders[i].parentNode.removeChild(loaders[i]);
			delete loaders[i];
		}
	}

	



	return {
		updateMaxStats: updateMaxStats,
		updateStatBars: updateStatBars,
		sortHeroes: sortHeroes,
		showAlert: showAlert,
		hideAlert: hideAlert,
		showLoader: showLoader,
		hideLoader: hideLoader
	}

}());

