var apiHero = (function() {
	
	var settings = {
		heroAPIURL: "https://overwatch-api.net/api/v1/hero/",
		heroes: Store.getLocal("heroes")
	} 

	function getHeroData() {
		return new Promise(function(resolve, reject) {
			XHR.makeRequest("GET", settings.heroAPIURL)
			.then(res => JSON.parse(res))
			.then(res => res.data)
			.then(rawHeroData => processHeroData(rawHeroData))
			.then(heroData => {
				saveHeroData(heroData);
				return resolve(heroData);
			})
			.catch(function(err) {
				console.log("could not get hero info");
				console.log(err);
				return reject(err);
			});
		})
	}

	function processHeroData(rawHeroData) {
		console.log("processing Hero info");
		return new Promise(function(resolve) {
			let heroes = {};

			rawHeroData.forEach(function(hero) {
				let newHero = new Hero({
					name: hero.name,
					realName: hero.real_name,
					age: hero.age,
					affiliation: hero.affiliation,
					base: hero.base_of_operations,
					description: hero.description,
					health: hero.health,
					armor: hero.armour,
					shield: hero.shield
				});
				assignHeroRole(newHero);
				heroes[newHero.normalizedName] = newHero;
			});
			return resolve(heroes);
		});
	}

	function assignHeroRole(hero) {
		switch(hero.normalizedName) {
			case 'genji':
			case 'mccree':
			case 'pharah':
			case 'reaper':
			case 'soldier76':
			case 'sombra':
			case 'tracer':
				hero.role = "offense";
				break;
			case 'bastion':
			case 'hanzo':
			case 'junkrat':
			case 'mei':
			case 'torbjorn':
			case 'widowmaker':
				hero.role = "defense";
				break;
			case 'dva':
			case 'orisa':
			case 'reinhardt':
			case 'roadhog':
			case 'winston':
			case 'zarya':
				hero.role = "tank";
				break;
			case 'ana':
			case 'lucio':
			case 'mercy':
			case 'symmetra':
			case 'zenyatta':
				hero.role = "support";
				break;
			default: 
				hero.role = "hide"
		}
	}

	function saveHeroData(heroes) {
		console.log('saving hero data');
		return new Promise(function(resolve) {
			// prepare hero info data and save to local storage
			var heroesString = JSON.stringify(heroes);
			Store.setLocal('heroes', heroesString, 7 * 60 * 60 * 1000);
			settings.heroes = heroes;
			console.log('resolving');
			return resolve(heroes);
		});
	}




	return {
		getHeroData: getHeroData
	}
}());
	
	
	