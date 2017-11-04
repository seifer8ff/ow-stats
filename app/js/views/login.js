var login = (function() {
	
	var settings = {
		heroStatsURL: "https://owapi.net/api/v3/u/username/blob",
		user: Store.getLocal('user'),
		heroes: Store.getLocal("heroes")
	} 


	function initPage() {
		console.log('building login page');
		var context = {
			user: settings.user
		 };

		// build login section and add to DOM
		var newSection = OW.templates.login(context);
		document.body.querySelector("main").insertAdjacentHTML("beforeend", newSection);

		initEventListeners();
	}


	function initEventListeners() {
		document.getElementById("form-username").addEventListener('submit', onSubmit);
	}



	function onSubmit(e) {
		console.log("form submitted");
		e.preventDefault();

		utils.hideAlert();

		let newUser = new User({
			username: document.getElementById("inputUsername").value
		});

		// test with regex before continuing
		if (!/\w+#\d+/.test(newUser.username)) {
			// show format alert if format is invalid
			utils.showAlert("battletag-format");
			return false;
		}

		newUser.url = settings.heroStatsURL.replace("username", newUser.username);
		newUser.url = newUser.url.replace("#", "-");

		settings.user = newUser;
		Store.setLocal("user", newUser, 7 * 24 * 60 * 60 * 1000);

		utils.showPlaceholder();
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
		.then(() => redirect())
		.catch(err => {
			localStorage.removeItem("user");
			utils.hidePlaceholder();
			utils.showAlert("battletag-not-found");
		})
	}

	function redirect() {
		window.location.href = "/";
	}


	return {
		initPage: initPage
	}
}());
	
	
	