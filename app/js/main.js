(function() {
	
	var settings = {
		user: Store.getLocal("user"),
		heroes: Store.getLocal("heroes")
	} 
	

	init();

	
	function init() {
		// initEventListeners();

		if (!settings.user && !window.location.href.includes('login')) {
			window.location.href = "/login";
		}

		if (!settings.heroes || Store.isExpired("heroes")) {
			apiHero.getHeroData()
			.then(heroes => {
				settings.heroes = heroes;
				return heroes;
			})
			.then(heroes => apiStats.init(heroes))
			.then(() => apiStats.getUserStats())
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
		} else if (document.body.dataset.title === "hero-multiple") {
			heroMultiple.initPage();
		} else if (document.body.dataset.title === "login") {
			login.initPage();
		}
	}

	function processURL() {

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
	
	
	