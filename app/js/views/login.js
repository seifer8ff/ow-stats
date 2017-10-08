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
		document.body.insertAdjacentHTML("afterbegin", newSection);

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
		console.log(newUser.url);

		settings.user = newUser;
		Store.setLocal("user", newUser, 60 * 60 * 60 * 1000);

		apiHero.getHeroData()
		.then(heroes => apiStats.init(heroes, settings.user))
		.then(() => apiStats.getUserStats())
		.then(() => redirect())
		.catch(err => {
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
	
	
	