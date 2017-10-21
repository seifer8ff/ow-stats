(function() {
	
	var settings = {
		user: Store.getLocal("user"),
		heroes: Store.getLocal("heroes")
	} 
	

	init();

	
	function init() {
		// get hero data if not cached, if expired, or if user is logged in and user has expired
		if (!settings.heroes || Store.isExpired("heroes") || (settings.user && Store.isExpired("user"))) {
			apiHero.getHeroData()
			.then(heroes => {
				settings.heroes = heroes;
				return heroes;
			})
			.then(heroes => {
				// only get user stats if we have a user saved
				if (settings.user) {
					apiStats.init(heroes, settings.user);
					return apiStats.getUserStats().then(user => {
						console.log('setting user to this user');
						settings.user = user;
						return user;
					})
				}
			})
			.then(() => {
				initPage();
			})
		} else {
			initPage()
			initEventListeners();
		}
	}

	function initPage() {
		initHeader(settings.heroes, settings.user);
		if (document.body.dataset.title === "hero-single") {
			heroSingle.init(settings.heroes, settings.user);
			heroSingle.initPage();
		} else if (document.body.dataset.title === "hero-multiple" && settings.user) {
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
	}

}());
	
	
	