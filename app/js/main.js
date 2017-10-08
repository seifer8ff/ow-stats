(function() {
	
	var settings = {
		user: Store.getLocal("user"),
		heroes: Store.getLocal("heroes")
	} 
	

	init();

	
	function init() {
		// initEventListeners();

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
		}
	}


	// function initHeader() {
	// 	// show login or account links depending on if userAPIURL is saved to local storage
	// 	if (getLocalStorage("heroStatsURL") === null) {
	// 		document.getElementById("form-username").classList.remove("hidden");
	// 		document.getElementById("login").classList.add("hidden");
	// 	} else {
	// 		document.getElementById("username").childNodes[2].nodeValue = getLocalStorage("username");
	// 		document.getElementById("account-icon").src = getLocalStorage("userAvatar");
	// 		document.getElementById("account-dropdown").classList.remove("hidden");
	// 	}
	// }


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
		$("#logout").on("click", function(e) {
			console.log("logging out");
			clearLocalStorage(function() {
				window.location.reload(false); 
			});
		});
	}

}());
	
	
	