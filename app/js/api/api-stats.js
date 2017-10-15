var apiStats = (function() {
	
	var settings = {
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

	function getUserStats() {
		return new Promise(function(resolve, reject) {
			XHR.makeRequest("GET", settings.user.url)
			.then(res => JSON.parse(res))
			.then(rawStats => filterUserRegion(rawStats))
			.then(rawStats => processHeroStats(rawStats))
			.then(rawStats => processUserStats(rawStats, false))
			.then(() => {
				return resolve(settings.user);
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


	
	function processHeroStats(rawStats) {
		console.log("processing User/Hero stats");
		return new Promise(function(resolve, reject) {
			let qpStats = rawStats.heroes.stats.quickplay;
			console.log(rawStats);
	
			// for each hero, save playtime and average stats
			for (var hero in qpStats) {
				let thisHero = settings.heroes[hero];
				if (thisHero) {
					thisHero.stats.playtime.value = Math.ceil(rawStats.heroes.playtime.quickplay[hero] * 10) / 10;
					thisHero.stats.elims.value = Math.ceil(qpStats[hero].general_stats.eliminations_per_life);
					thisHero.stats.heroDamage.value = Math.ceil(qpStats[hero].rolling_average_stats.hero_damage_done);
					thisHero.stats.medals.value = Math.ceil(qpStats[hero].general_stats.medals);
					thisHero.stats.healing.value = Math.ceil(qpStats[hero].rolling_average_stats.healing_done);
					console.log(settings.heroes[hero]);
				}
			}
			Store.setLocal('heroes', settings.heroes, 7 * 60 * 60 * 1000);

			return resolve(rawStats);
		});
	}

	function processUserStats(rawStats) {
		console.log("processing User");
		return new Promise(function(resolve, reject) {
			settings.user.icon = rawStats.stats.quickplay.overall_stats.avatar;
			utils.updateMaxStats(settings.user, settings.heroes, true);
			Store.setLocal("user", settings.user, 60 * 60 * 60 * 1000);

			return resolve(settings.user);
		});
	}



	return {
		init: init,
		getUserStats: getUserStats
	}

}());
