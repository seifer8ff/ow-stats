var userStats = {};
var heroInfo = {};
var heroDisplay = [];



window.onload=function() {
	userStats = getUserStats();
	heroInfo = getHeroInfo();
	heroDisplay = JSON.parse(getCookie("userHeroDisplay"));


	// set heroDisplay to default value if it doesn't exist in cookie or has no values
	if (heroDisplay === null || heroDisplay.length === 0) {
		heroDisplay = [
			"tracer",
			"dva",
			"mei",
			"mercy"
		];
		var heroDisplayString = JSON.stringify(heroDisplay);
		setCookie("userHeroDisplay", heroDisplayString, 30);
	}

	// if we don't have user stats, but have the required URL, request from the stats api
	if (userStats === null && getCookie("userAPIURL") !== null) {
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

	// show login or account links depending on if userAPIURL is saved to cookie
	if (getCookie("userAPIURL") === null) {
		if (document.body.dataset.title != "index") {
			document.getElementById("login").classList.remove("hidden");
		} else {
			document.getElementById("form-username").classList.remove("hidden");
			document.getElementById("login").classList.add("hidden");
		}
	} else {
		document.getElementById("username").childNodes[2].nodeValue = getCookie("username");
		document.getElementById("account-icon").src = getCookie("useravatar");
		document.getElementById("account-dropdown").classList.remove("hidden");
	}


	// click handlers
	// ===============

	// logout button click
	$("#logout").on("click", function(e) {
		console.log("logging out");
		deleteAllCookies("", function() {
			window.location.reload(false); 
		});
	});
}




// ==============
// API REQUESTS
// ==============

function requestUserStats() {
	makeRequest("GET", getCookie("userAPIURL"))
	.then(function(response) {
		// process stats and save them to cookie
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
		
		// remove all user stats related cookies to prevent repeat requests
		deleteAllCookies("user", function() {
			// display battle tag not found alert
			showAlert("battletag-not-found");
			$("#modal-loading").modal("hide");
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
				tempUserStats[hero] = res.heroes.stats.quickplay[hero].average_stats;

				// round stats to next highest int
				for (var stat in tempUserStats[hero]) {
					tempUserStats[hero][stat] = Math.ceil(tempUserStats[hero][stat]);
				}
			}
			tempUserStats[hero].playtime =  Math.ceil(res.heroes.playtime.quickplay[hero] * 10 ) / 10;
			tempUserStats[hero].name = hero;

			// save hero to cookie
			var heroStatString = JSON.stringify(tempUserStats[hero]);
			heroStatString = normalizeString(heroStatString);
			setCookie("userstats" + hero, heroStatString, 1);
		}
		// save the user's avatar for navbar account link
		setCookie("useravatar", res.stats.quickplay.overall_stats.avatar, 1);

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
	});
}

function processHeroRequest(response) {
	console.log("processing Hero info");
	return new Promise(function(resolve) {
		var res = JSON.parse(response).data;
		// for each hero in the response, create cookie with their data
		res.forEach(function(hero) {
			var heroDataString = JSON.stringify(hero);
			var cookieName = "heroData" + hero.name.toLowerCase();

			// remove semicolons, accents, etc
			cookieName = normalizeString(cookieName, true);
			heroDataString = normalizeString(heroDataString);

			setCookie(cookieName, heroDataString, 7);
		});
		resolve(res);
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

		heroDisplay = JSON.parse(getCookie("userHeroDisplay"));
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

	// override form submit to add username + url to cookie
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

		// add valid username (original format) to cookie
		setCookie("username", username, 30);

		// reformat username for API call
		username = username.replace("#", "-");

		// create api url with formatted username
		var userAPIURL = "https://owapi.net/api/v3/u/" + username + "/blob";
		setCookie("userAPIURL", userAPIURL, 30);

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

	// remove hero from display array and save to cookie
	heroDisplay.splice(heroDisplay.indexOf(hero), 1);
	var heroDisplayString = JSON.stringify(heroDisplay);
	setCookie("userHeroDisplay", heroDisplayString, 30);

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
	// add hero from display array and save to cookie
	heroDisplay.push(hero);
	var heroDisplayString = JSON.stringify(heroDisplay);
	setCookie("userHeroDisplay", heroDisplayString, 30);

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
	// for hero page, build the hero section
	var thisHero = getHeroFromURL();

	// if there's a valid hero in query string, set background and build hero info section. Else display error page
	if (thisHero) {
		setHeroBackground(normalizeString(thisHero.name, true).toLowerCase());

		// pass in both hero info and user stats (if available) to heroInfo template
		var context = {heroInfo: thisHero, name: normalizeString(thisHero.name, true).toLowerCase()};
		if (userStats !== null) {
			context.userStats = userStats[normalizeString(thisHero.name, true).toLowerCase()];
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
	var heroData = getCookieArray("herodata");
	for (var i = 0; i < heroData.length; i++) {
		// we only care about the actual data, not the name of the cookie
		heroData[i] = heroData[i].split("=")[1];
		heroData[i] = JSON.parse(heroData[i]);
	}

	// get hero name from query string
	var heroName = window.location.search;
	heroName = heroName.replace("?name=", "");
	// find the hero object with matching name property
	var selectedHero = heroData.find(function(hero) {
		return normalizeString(hero.name, true).toLowerCase() === heroName;
	});

	return selectedHero;
}

function setHeroBackground(heroName) {
	document.body.classList.add("body-" + heroName);
}



// ==================
// UTILITY FUNCTIONS
// ==================
function setCookie(name, value, days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+days*24*60*60*1000);
		var expires = "; expires=" + date.toGMTString();
	} else {
		var expires = "";
	}
	value = encodeURIComponent(value);
	document.cookie = name + "=" + value + expires;
}

function getCookie(name) {
	var value = "; " + document.cookie;
	value = decodeURIComponent(value);
	var parts = value.split("; " + name + "=");
	if (parts.length == 2) {
		return parts.pop().split(";").shift();
	} else {
		return null;
	}
}

function getCookieArray(matchString) {
	var value = document.cookie;
	// split by semicolon before we've decoded them back into the strings
	var cookies = value.split("; ");

	// now that the cookie is split up, decode them
	for (var i = 0; i < cookies.length; i++) {
		cookies[i] = decodeURIComponent(cookies[i]);
	}
	
	// if matchString has been provided, only return cookies that contain match string
	if (matchString !== undefined && matchString !== "") {
		var matchedCookies = [];
		cookies.forEach(function(cookie) {
			if (cookie.indexOf(matchString) !== -1) {
				matchedCookies.push(cookie);
			}
		});
		cookies = matchedCookies;
	}

	return cookies;
}

function deleteAllCookies(matchString, callback) {
	var cookies;

	// if match string has been provided, only get cookies containing it
	if (matchString !== undefined && typeof matchString !== "function") {
		cookies = getCookieArray(matchString);
	} else {
		cookies = getCookieArray();
	}

	// overwrite each cookie with 0 and a negative expiration date
	for (var i = 0; i < cookies.length; i++) {
		var cookieName = cookies[i].split("=")[0];

		setCookie(cookieName, 0, -1);
	}
	if (callback && typeof callback === "function") {
		callback();
	}
}

// remove semicolons, accent marks, etc
function normalizeString(string, removeExtras) {
	var newString = string.normalize('NFD').replace(/[\u0300-\u036f]/g, "");

	if (removeExtras) {
		// remove all whitespace
		newString = newString.replace(/\s/g,'');
		newString = newString.replace(/:|\./g, "");
		newString = newString.toLowerCase();
	}
	return newString;
}

// get user stats from cookie, or return null if there are no user stats in cookie
function getUserStats() {
	console.log("getting user stats");

	var tempUserStats = {};
	// get all cookies involving userstats + the user avatar
	var statCookies = getCookieArray("userstats");

	if (statCookies.length <= 0) {
		return null;
	}

	// parse each cookie and add it to userStats object
	for (var i = 0; i < statCookies.length; i++) {
		// we only care about the actual data, not the name of the cookie
		statCookies[i] = statCookies[i].split("=")[1];

		// parse cookie into object, and add object to userStats
		var cookieObject = JSON.parse(statCookies[i]);
		tempUserStats[cookieObject.name] = cookieObject;
	}
	return tempUserStats;
}

// get hero info from cookie, or return null if is no hero info in cookie
function getHeroInfo() {
	console.log("getting hero info");

	var tempHeroInfo = {};
	// get all cookies involving hero info
	var heroCookies = getCookieArray("herodata");

	if (heroCookies.length <= 0) {
		return null;
	}

	// parse each cookie and add it to userStats object
	for (var i = 0; i < heroCookies.length; i++) {
		// we only care about the actual data, not the name of the cookie
		heroCookies[i] = heroCookies[i].split("=")[1];

		// parse cookie into object, and add object to userStats
		var cookieObject = JSON.parse(heroCookies[i]);
		tempHeroInfo[normalizeString(cookieObject.name, true)] = cookieObject;
	}
	return tempHeroInfo;
}

// find and save max value of each stat for currently selected heroes
function updateMaxStats(allHeroes) {
	console.log("updating max stats")
	// reset max values
	userStats.maxElims = 0;
	userStats.maxDeaths = 0;
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
		if (userStats[hero].eliminations_average > userStats.maxElims) {
			userStats.maxElims = userStats[hero].eliminations_average;
		}
		if (userStats[hero].deaths_average > userStats.maxDeaths) {
			userStats.maxDeaths = userStats[hero].deaths_average;
		}
		if (userStats[hero].damage_done_average > userStats.maxDamage) {
			userStats.maxDamage = userStats[hero].damage_done_average;
		}
		if (userStats[hero].healing_done_average > userStats.maxHealing) {
			userStats.maxHealing = userStats[hero].healing_done_average;
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
		if (userStats[hero].eliminations_average) {
			var elimsBar = heroSections[i].getElementsByClassName("hero-elims")[0].childNodes[3];
			var width = calcStatBarWidth(userStats[hero].eliminations_average, userStats.maxElims);
			elimsBar.style.width = width + "%"; 
		}
		if (userStats[hero].deaths_average) {
			var deathsBar = heroSections[i].getElementsByClassName("hero-deaths")[0].childNodes[3];
			var width = calcStatBarWidth(userStats[hero].deaths_average, userStats.maxDeaths);
			deathsBar.style.width = width + "%"; 
		}
		if (userStats[hero].damage_done_average) {
			var damageBar = heroSections[i].getElementsByClassName("hero-damage")[0].childNodes[3];
			var width = calcStatBarWidth(userStats[hero].damage_done_average, userStats.maxDamage);
			damageBar.style.width = width + "%"; 
		}
		if (userStats[hero].healing_done_average) {
			var healingBar = heroSections[i].getElementsByClassName("hero-healing")[0].childNodes[3];
			var width = calcStatBarWidth(userStats[hero].healing_done_average, userStats.maxHealing);
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


