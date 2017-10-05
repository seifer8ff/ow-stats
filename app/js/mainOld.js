var userStats = {};
var heroInfo = {};
var heroDisplay = [];



window.onload=function() {
	userStats = JSON.parse(getLocalStorage("userStats"));
	heroInfo = JSON.parse(getLocalStorage("heroInfo"));
	heroDisplay = JSON.parse(getLocalStorage("userHeroDisplay"));


	// set heroDisplay to default value if it doesn't exist in local storage or has no values
	if (heroDisplay === null || heroDisplay.length === 0) {
		heroDisplay = [
		"tracer",
		"dva",
		"mei",
		"mercy"
		];
		var heroDisplayString = JSON.stringify(heroDisplay);
		setLocalStorage("userHeroDisplay", heroDisplayString, 30);
	}

	// if we don't have user stats, but have the required URL, request from the stats api
	if (userStats === null && getLocalStorage("userAPIURL") !== null) {
		requestUserStats();
	} else if (document.body.dataset.title === "index") {
		initIndexPage();
	}

	// if we don't have hero info, request from the hero api
	if (heroInfo === null) {
		requestHeroInfo();
	} else if (document.body.dataset.title === "hero") {
		initHeroPage();
	}

	// show login or account links depending on if userAPIURL is saved to local storage
	if (getLocalStorage("userAPIURL") === null) {
		if (document.body.dataset.title != "index") {
			document.getElementById("login").classList.remove("hidden");
		} else {
			document.getElementById("form-username").classList.remove("hidden");
			document.getElementById("login").classList.add("hidden");
		}
	} else {
		document.getElementById("username").childNodes[2].nodeValue = getLocalStorage("username");
		document.getElementById("account-icon").src = getLocalStorage("userAvatar");
		document.getElementById("account-dropdown").classList.remove("hidden");
	}


	// click handlers
	// ===============

	// logout button click
	$("#logout").on("click", function(e) {
		console.log("logging out");
		clearLocalStorage(function() {
			window.location.reload(false); 
		});
	});
}




// ==============
// API REQUESTS
// ==============

function requestUserStats() {
	makeRequest("GET", getLocalStorage("userAPIURL"))
	.then(function(response) {
		// process stats and save them to local storage
		return processUserStatRequest(response);
	})
	.then(function() {
		// setup index page now that we have data
		if (document.body.dataset.title === "index") {
			window.location.reload(false);
		}
	})
	.catch(function(err) {
		// error response from api (either incorrect battletag or too many requests)
		console.log("request error - status: " + err.status);
		
		// remove user data from local storage to prevent repeat requests
		removeLocalStorage("userAPIURL", function() {
			removeLocalStorage("username", function() {
				removeLocalStorage("userStats");

				// display battle tag not found alert
				showAlert("battletag-not-found");
				$("#modal-loading").modal("hide");
			});
		});
	});

	// while making api request, display loading modal
	$("#modal-loading").modal({
		backdrop: "static",
		keyboard: false
	});
}

function processUserStatRequest(response) {
	return new Promise(function(resolve, reject) {
		var res = JSON.parse(response);
		if (res.us) {
			res = res.us;
		} else if (res.eu) {
			res = res.eu;
		} else if (res.kr) {
			res = res.kr;
		} else if (res.any) {
			res = res.any;
		} else {
			console.log("No stats for user");
		}
		console.log("processing stat response");
		var tempUserStats = {};

		// for each hero, save playtime and average stats
		for (var hero in res.heroes.playtime.quickplay) {
			// create empty object for each hero
			tempUserStats[hero] = {};
			// if hero has quickplay data, store hero
			if (res.heroes.stats.quickplay[hero]) {
				tempUserStats[hero] = res.heroes.stats.quickplay[hero].general_stats;

				// round stats to next highest int
				for (var stat in tempUserStats[hero]) {
					tempUserStats[hero][stat] = Math.ceil(tempUserStats[hero][stat]);
				}
			}
			tempUserStats[hero].playtime =  Math.ceil(res.heroes.playtime.quickplay[hero] * 10 ) / 10;
			tempUserStats[hero].name = hero;
		}

		// save user stats to local storage
		var heroStatString = JSON.stringify(tempUserStats);
		heroStatString = normalizeString(heroStatString);
		setLocalStorage("userStats", heroStatString, 1);


		// save the user's avatar for navbar account link
		setLocalStorage("userAvatar", res.stats.quickplay.overall_stats.avatar, 1);

		// resolve if tempUserStats is not empty
		if (Object.keys(tempUserStats).length != 0 && tempUserStats.constructor === Object) {
			resolve(tempUserStats);
		} else {
			reject(tempUserStats);
		}
	});
}

function requestHeroInfo() {
	makeRequest("GET", "https://overwatch-api.net/api/v1/hero/")
	.then(function(response) {
		return processHeroRequest(response);
	})
	.then(function() {
		// fill out hero section with api data
		if (document.body.dataset.title === "hero") {
			initHeroPage();
		}
	})
	.catch(function(err) {
		console.log("could not get hero info");
		console.log(err);
	});
}

function processHeroRequest(response) {
	console.log("processing Hero info");
	return new Promise(function(resolve) {
		var tempHeroInfo = {};
		var res = JSON.parse(response).data;

		// create a hero info object with objects name matching hero name
		res.forEach(function(hero) {
			var heroName = normalizeString(hero.name, true);
			tempHeroInfo[heroName] = hero;
		});

		// prepare hero info data and save to local storage
		var heroInfoString = JSON.stringify(tempHeroInfo);
		setLocalStorage("heroInfo", heroInfoString, 7);

		resolve(tempHeroInfo);
	});
}

// =====================
// INDEX PAGE FUNCTIONS 
// =====================

function initIndexPage() {
	console.log("initializing index page");

	// hide error messages on page load
	hideAlert();

	// if user stats have been retrieved, display the hero toggles and build hero sections
	if (userStats !== null) {
		var heroGrids = document.getElementsByClassName("hero-grid");
		for (var i = 0; i < heroGrids.length; i++) {
			heroGrids[i].classList.remove("hidden");
		}

		heroDisplay = JSON.parse(getLocalStorage("userHeroDisplay"));
		heroDisplay.forEach(function(hero) {
			// pass the hero object through
			buildHeroSection(userStats[hero]);
		});
		updateMaxStats(false);
	}

	// remove hero click handler
	$(".hero-container").on("click", ".hero-remove", function() {
		removeHeroSection(this.parentNode.parentNode.id);
	});

	// if toggled on previously, set hero display buttons to active and 'checked'
	$(".hero-toggle").each(function() {
		var toggleName = normalizeString($(this).parent().text(), true);
		if (heroDisplay.indexOf(toggleName) > -1) {
			this.checked = true;
			$(this).parent().addClass("active");
		}
	});

	// on toggle, update heroDisplay and build or remove hero section
	$(".hero-toggle").on("change", function(e) {
		if (!this.disabled) {
			// store toggle for callbacks, and disable toggle until finished
			this.disabled = true;

			var toggledHero = normalizeString($(this).parent().text(), true);
			console.log("toggled: " + toggledHero);

			if (this.checked) {
				$(this).parent().addClass("active");
				addHeroSection(toggledHero, function() {
					this.disabled = false;
				}.bind(this));
			} else {
				// remove section and update button state
				removeHeroSection(toggledHero, function() {
					this.disabled = false;
				}.bind(this));
			}
		}
	});

	// override form submit to add username + url to local storage
	document.getElementById("form-username").onsubmit=function(e) {
		console.log("form submitted");
		e.preventDefault();
		// get username
		var username = document.getElementById("inputUsername").value;

		// test with regex before continuing
		if (!/\w+#\d+/.test(username)) {
			// show format alert if format is invalid
			showAlert("battletag-format");
			return false;
		}

		// add valid username (original format) to local storage
		setLocalStorage("username", username, 30);

		// reformat username for API call
		username = username.replace("#", "-");

		// create api url with formatted username
		var userAPIURL = "https://owapi.net/api/v3/u/" + username + "/blob";
		setLocalStorage("userAPIURL", userAPIURL, 30);

		// request user stats from api
		requestUserStats();
	}
}

// build the hero section for a given hero
function buildHeroSection(hero, callback) {
	// build new section from handlebars template
	var context = {userStats: hero};
	if (heroInfo !== null) {
		context.heroInfo = heroInfo[hero.name];
	}
	var newSection = OW.templates.hero(context);

	document.getElementById("hero-section-parent").insertAdjacentHTML("beforeend", newSection);

	if (callback && typeof callback === "function") {
		callback();
	}
}

// deletes the hero section from the dom for the given hero and updates hero display array
function removeHeroSection(hero, callback) {
	var heroSection = document.getElementById(hero);

	// remove hero from display array and save updated object to local storage
	heroDisplay.splice(heroDisplay.indexOf(hero), 1);
	var heroDisplayString = JSON.stringify(heroDisplay);
	setLocalStorage("userHeroDisplay", heroDisplayString, 30);

	// update state of hero toggle
	var heroToggles = document.getElementsByClassName("hero-toggle");
	for (var i = 0; i < heroToggles.length; i++) {
		if (normalizeString(heroToggles[i].parentNode.textContent, true)  === hero) {
			if (heroToggles[i].checked) { heroToggles[i].checked = false; }
			heroToggles[i].parentNode.classList.remove("active");
		}
	}

	// fadeout hero section
	heroSection.classList.add("fade-out");

	// wait for css fadeout to end, then delete hero-section
	setTimeout(function() {
		heroSection.innerHTML = "";
		heroSection.parentNode.removeChild(heroSection);
		delete heroSection;

		// anytime the heroDisplay array is changed, we need to get max stats of chosen heroes
		updateMaxStats(false);

		if (callback && typeof callback === "function") {
			callback();
		}
	}, 550);
}

// adds the hero section to the dom for the given hero and updates hero display array
function addHeroSection(hero, callback) {
	// add hero from display array and save updated object to local storage
	heroDisplay.push(hero);
	var heroDisplayString = JSON.stringify(heroDisplay);
	setLocalStorage("userHeroDisplay", heroDisplayString, 30);

	// build the new hero section 
	buildHeroSection(userStats[hero]);

	// anytime the heroDisplay array is changed, we need to get max stats of chosen heroes
	updateMaxStats(false);

	if (callback && typeof callback === "function") {
		callback();
	}
}


// =====================
// HERO PAGE FUNCTIONS
// =====================

function initHeroPage() {
	// hero Info may not exist due to logging out from the hero page
	if (!heroInfo) {
		heroInfo = JSON.parse(getLocalStorage("heroInfo"));
	}

	// for hero page, build the hero section
	var thisHero = getHeroFromURL();

	// if there's a valid hero in query string, set background and build hero info section. Else display error page
	if (thisHero) {
		setHeroBackground(normalizeString(thisHero.name, true).toLowerCase());

		// pass in both hero info and user stats (if available) to heroInfo template
		var context = {heroInfo: thisHero, name: normalizeString(thisHero.name, true).toLowerCase()};
		if (userStats !== null) {
			context.userStats = userStats[normalizeString(thisHero.name, true).toLowerCase()];
		} else {
			context.noStats = true;
		}

		// build hero info section and add to DOM
		var newSection = OW.templates.heroInfo(context);
		document.getElementById("hero-section-parent").insertAdjacentHTML("beforeend", newSection);

		if (userStats !== null) {
			updateMaxStats(true);
		}
	} else {
		document.getElementById("page-error").classList.remove("hidden");
	}
}

function getHeroFromURL() {
	// get hero name from query string
	var heroName = window.location.search;
	heroName = heroName.replace("?name=", "");

	return heroInfo[heroName];
}

function setHeroBackground(heroName) {
	document.body.classList.add("body-" + heroName);
}



// ==================
// UTILITY FUNCTIONS
// ==================

function setLocalStorage(name, value, daysTillExpire) {
    if (!daysTillExpire) { 
    	var daysTillExpire = 1; // default to one day
	}

    var secondsToExpire = daysTillExpire*24*60*60;

    var date = new Date();
    var expire = Math.round((date.setSeconds(date.getSeconds()+secondsToExpire))/1000);

    value = encodeURIComponent(value);

    localStorage.setItem(name, value);
    localStorage.setItem(name+'_time', expire);
}

function removeLocalStorage(name, callback) {
    localStorage.removeItem(name);
    localStorage.removeItem(name + "_time");

    if (callback && typeof callback === "function") {
		callback();
	}
}

function clearLocalStorage(callback) {
	localStorage.clear();

	if (callback && typeof callback === "function") {
		callback();
	}
}

function statusLocalStorage(name) {

    var date = new Date();
    var current = Math.round(+date/1000);

    // Get Schedule
    var storedTime = localStorage.getItem(name + "_time");
    if (!storedTime) { 
    	var storedTime = 0; 
    }

    // Expired
    if (storedTime < current) {

        // Remove
        removeLocalStorage(name);

        return false;

    } else {

        return true;
    }
}

function getLocalStorage(name) {
	if (statusLocalStorage(name)) {
		var value = localStorage.getItem(name);
		value = decodeURIComponent(value);
		return value;
	} else {
		return null;
	}
}

// remove semicolons, accent marks, etc
function normalizeString(string, removeExtras) {
	var newString = unorm.nfd(string).replace(/[\u0300-\u036f]/g, "");

	if (removeExtras) {
		// remove all whitespace
		newString = newString.replace(/\s/g,'');
		newString = newString.replace(/:|\./g, "");
		newString = newString.toLowerCase();
	}
	return newString;
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

// updates bar sizes based on hero stat vs max value of stat
function updateStatBars() {
	console.log("updating stat bars");
	var heroSections = document.getElementsByClassName("hero-section");

	for (var i = 0; i < heroSections.length; i++) {
		var hero = heroSections[i].id;

		if (userStats[hero].playtime) {
			var playtimeBar = heroSections[i].getElementsByClassName("hero-playtime")[0].childNodes[3];
			var width = calcStatBarWidth(userStats[hero].playtime, userStats.maxPlaytime);
			playtimeBar.style.width = width + "%"; 
		}
		if (userStats[hero].eliminations_per_life) {
			var elimsBar = heroSections[i].getElementsByClassName("hero-elims")[0].childNodes[3];
			var width = calcStatBarWidth(userStats[hero].eliminations_per_life, userStats.maxElims);
			elimsBar.style.width = width + "%"; 
		}
		if (userStats[hero].medals) {
			var medalsBar = heroSections[i].getElementsByClassName("hero-medals")[0].childNodes[3];
			var width = calcStatBarWidth(userStats[hero].medals, userStats.maxMedals);
			medalsBar.style.width = width + "%"; 
		}
		if (userStats[hero].all_damage_done_avg_per_10_min) {
			var damageBar = heroSections[i].getElementsByClassName("hero-damage")[0].childNodes[3];
			var width = calcStatBarWidth(userStats[hero].all_damage_done_avg_per_10_min, userStats.maxDamage);
			damageBar.style.width = width + "%"; 
		}
		if (userStats[hero].healing_done_avg_per_10_min) {
			var healingBar = heroSections[i].getElementsByClassName("hero-healing")[0].childNodes[3];
			var width = calcStatBarWidth(userStats[hero].healing_done_avg_per_10_min, userStats.maxHealing);
			healingBar.style.width = width + "%"; 
		}
	}	
}

// calculates the new width of the stat bar, with a minimum value for readability
function calcStatBarWidth(statValue, max) {
	var width = statValue / max * 100;
	if (width < 15) { width = 15 } 
		return width;
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

function makeRequest (method, url) {
	console.log("Making a " + method + " request to " + url);
	return new Promise(function(resolve, reject) {
		var xhr = new XMLHttpRequest();
		xhr.open(method, url);
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4) {
				if (xhr.status == 200) {
					resolve(xhr.response);
				} else {
					reject({
						status: this.status,
						statusText: xhr.statusText
					});
				}
			}
		}
		xhr.onerror = function() {
			reject({
				status: this.status,
				statusText: xhr.statusText
			});
		}
		xhr.send();
	});
}


