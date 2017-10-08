(function() {
	
	var settings = {
		user: Store.getLocal("user"),
		heroes: Store.getLocal("heroes")
	} 
	

	init();

	
	function init() {
		if (!settings.heroes || Store.isExpired("heroes")) {
			apiHero.getHeroData()
			.then(heroes => {
				settings.heroes = heroes;
				return heroes;
			})
			.then(heroes => {
				// only get user stats if we have a user saved
				if (settings.user) {
					apiStats.init(heroes, settings.user)
					.then(() => apiStats.getUserStats())
				}
			})
			.then(() => initPage())
		} else {
			initPage()
			initEventListeners();
		}
	}

	function initPage() {
		if (document.body.dataset.title === "hero-single") {
			heroSingle.initPage();
		} else if (document.body.dataset.title === "hero-multiple" && settings.user) {
			heroMultiple.initPage();
		} else if (document.body.dataset.title === "login") {
			login.initPage();
		}
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
	
	
	