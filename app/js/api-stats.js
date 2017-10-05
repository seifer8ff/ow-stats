var apiStats = (function() {
	
	var settings = {
		heroStatsURL: "https://owapi.net/api/v3/u/seifer8ff-1184/blob",
		user: Store.getLocal('user'),
		heroes: Store.getLocal('heroes'),
	}


	function init(heroes) {
		settings.heroes = heroes;
	}

	function getUserStats() {
		return new Promise(function(resolve, reject) {
			XHR.makeRequest("GET", settings.heroStatsURL)
			.then(res => JSON.parse(res))
			.then(rawStats => filterUserRegion(rawStats))
			.then(rawStats => processUserStats(rawStats))
			.then(heroes => {
				saveHeroStats(heroes);
				return resolve(heroes);
			})
			.catch(err => {
				console.log("could not get user stats");
				console.log(err);
				return reject(err);
			});
		})
	}

	function filterUserRegion(rawStats) {
		return new Promise(function(resolve, reject) {
			if (rawStats.us) {
				return resolve(rawStats.us);
			} else if (rawStats.eu) {
				return resolve(rawStats.eu);
			} else if (rawStats.kr) {
				return resolve(rawStats.kr);
			} else if (rawStats.any) {
				return resolve(rawStats.any);
			} else {
				console.log("No stats for user");
				return reject(rawStats);
			}
		});
	}


	
	function processUserStats(rawStats) {
		console.log("processing User/Hero stats");
		return new Promise(function(resolve, reject) {
			let qpStats = rawStats.heroes.stats.quickplay;
			console.log(rawStats);
	
			// for each hero, save playtime and average stats
			for (var hero in qpStats) {
				let thisHero = settings.heroes[hero];
				if (thisHero) {
					thisHero.stats.playtime = Math.ceil(rawStats.heroes.playtime.quickplay[hero] * 10) / 10;
					thisHero.stats.elims = Math.ceil(qpStats[hero].general_stats.eliminations_per_life);
					thisHero.stats.heroDamage = Math.ceil(qpStats[hero].rolling_average_stats.hero_damage_done);
					thisHero.stats.medals = Math.ceil(qpStats[hero].general_stats.medals);
					thisHero.stats.healing = Math.ceil(qpStats[hero].rolling_average_stats.healing_done);
					console.log(settings.heroes[hero]);
				}
			}
			return resolve(settings.heroes);
		});
	}

	function processUser(rawStats) {
		console.log("processing User");
		return new Promise(function(resolve, reject) {
			settings.user.icon = rawStats.stats.quickplay.overall_stats.avatar;
			return resolve(settings.user);
		});
	}

	function saveHeroStats(heroes) {
		console.log('saving hero data');
		return new Promise(function(resolve) {
			// prepare hero info data and save to local storage
			var heroesString = JSON.stringify(heroes);
			Store.setLocal('heroes', heroesString, 7 * 60 * 60 * 1000);
			return resolve(heroes);
		});
	}

	// find and save max value of each stat for currently selected heroes
	function updateMaxStats(allHeroes) {
		console.log("updating max stats")
		// reset max values
		userStats.maxElims = 0;
		userStats.maxMedals = 0;
		userStats.maxDamage = 0;
		userStats.maxHealing = 0;
		userStats.maxPlaytime = 0;

		// for each selected hero, check to see if their stat is higher than current max
		for (var hero in userStats) {
			// if the hero display is not toggled on and we aren't getting max of all heroes
			if (heroDisplay.indexOf(hero) < 0 && !allHeroes) { continue; }

			// find the max value of each stat
			if (userStats[hero].playtime > userStats.maxPlaytime) {
				userStats.maxPlaytime = userStats[hero].playtime;
			}
			if (userStats[hero].eliminations_per_life > userStats.maxElims) {
				userStats.maxElims = userStats[hero].eliminations_per_life;
			}
			if (userStats[hero].medals > userStats.maxMedals) {
				userStats.maxMedals = userStats[hero].medals;
			}
			if (userStats[hero].all_damage_done_avg_per_10_min > userStats.maxDamage) {
				userStats.maxDamage = userStats[hero].all_damage_done_avg_per_10_min;
			}
			if (userStats[hero].healing_done_avg_per_10_min > userStats.maxHealing) {
				userStats.maxHealing = userStats[hero].healing_done_avg_per_10_min;
			}
		}
		// now that we have the max stats for selected heroes, update their stat bar visuals (stat %of max)
		updateStatBars();
	}



	return {
		init: init,
		getUserStats: getUserStats
	}

}());
