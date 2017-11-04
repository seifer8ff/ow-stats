(function() {
	
	var settings = {
		user: Store.getLocal("user"),
		heroes: Store.getLocal("heroes")
	} 
	

	init();

	
	function init() {
		// get hero data if not cached, if expired, or if user is logged in and user has expired
		if (settings.user && (Store.isExpired("user") || Store.isExpired("heroes") || !utils.hasStats(settings.heroes))) {
			utils.showPlaceholder();

			if (Store.isExpired("user")) {
				console.log('user is expired');
			}

			if (Store.isExpired("heroes")) {
				console.log('heroes are expired');
			}

			if (!utils.hasStats(settings.heroes)) {
				console.log('do not have stats');
				console.log(settings.heroes);
			}

			apiHero.getHeroData()
			// once we have hero info, get hero stats and then save combined heroes (and the user info)
			.then(heroes => apiStats.init(heroes, settings.user))
			.then(() => apiStats.getUserStats())
			.then(statObj => {
				console.log(statObj);
				settings.heroes = statObj.heroes;
				settings.user = statObj.user;
				Store.setLocal('heroes', settings.heroes, 7 * 24 * 60 * 60 * 1000);
				Store.setLocal('user', settings.user, 60 * 24 * 60 * 60 * 1000);
	
				return settings.heroes;
			})
			.catch(() => {
				// if getting hero stats fails, use expired hero data
				return settings.heroes;
			})
			.then(() => {
				utils.hidePlaceholder();
				initPage();
			})
		} else {
			initPage()
			initEventListeners();
		}
	}

	function initPage() {
		if (document.body.dataset.title === "hero-single" && settings.user) {
			initHeader(settings.heroes, settings.user);
			heroSingle.init(settings.heroes, settings.user);
			heroSingle.initPage();
		} else if (document.body.dataset.title === "hero-multiple" && settings.user) {
			initHeader(settings.heroes, settings.user);
			heroMultiple.init(settings.heroes, settings.user);
			heroMultiple.initPage();
		} else if (document.body.dataset.title === "login") {
			login.initPage();
		}
	}

	function initHeader(heroes, user) {
		let sortedHeroes = utils.sortHeroes(settings.heroes);

		var context = { 
			user: user,
			heroes: heroes,
			sortedHeroes: sortedHeroes
		};
		var newSection = Handlebars.partials.header(context);
		

		document.body.querySelector(".collapse.navbar-collapse").insertAdjacentHTML("beforeend", newSection);
	}



	function initEventListeners() {
		// logout button click
		let logout = document.getElementById("logout");
		if (logout) {
			logout.addEventListener("click", (e) => {
				console.log("logging out");
				localStorage.clear();
				window.location.reload(false); 
			});
		}

		// add touch feedback to navbar brand on mobile (triggers hover/focus/active state)
		$(".navbar-brand").on("touchstart", function() {
			console.log('listening for touch events on navbar brand');
		});
	}

}());
	
	
	