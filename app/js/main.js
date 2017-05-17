var userStats = {};
var heroInfo = {};
var heroDisplay = [
	"tracer",
	"soldier76",
	"dva",
	"mei",
	"lucio"
];



window.onload=function() {

	if (getCookie("userstatsana") === undefined && getCookie("userAPIURL") != undefined) {
		// username has been entered, but stats need to be refreshed
		console.log("fetching user stats from api");
		// attempt to request user stats from api
		makeRequest("GET", getCookie("userAPIURL"))
		.then(function(response) {
			return processUserStatRequest(response);
		})
		.then(function() {
			// setup index page now that we have data
			if (document.body.dataset.title === "index") {
				console.log("reload now");
				window.location.reload(false);
			}
		})
		.catch(function(err) {
			console.log("request error - status: " + err.status);
			// error response from api (either incorrect battletag or too many requests)
			deleteAllCookies("user", function() {
				// display battle tag not found alert
				showAlert("battletag-not-found");
				$("#modal-loading").modal("hide");
			});
		});
		$("#modal-loading").modal({
			backdrop: "static",
			keyboard: false
		});
	} else if (document.body.dataset.title === "index") {
		// stats have already been saved to cookie
		initIndexPage();
	}

	if (getCookie("herodataana") === undefined) {
		console.log("fetching hero data from api");
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
	} else if (document.body.dataset.title === "hero") {
		initHeroPage();
	}

	// show login or account links depending on if userAPIURL is saved to cookie
	if (getCookie("userAPIURL") === undefined) {
		if (document.body.dataset.title != "index") {
			document.getElementById("login").classList.remove("hidden");
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
		console.log("trying to logout");
		deleteAllCookies("", function() {
			window.location.reload(false); 
		});
	});
}




// ==============
// API REQUESTS
// ==============

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
			tempUserStats[hero].playtime =  res.heroes.playtime.quickplay[hero];
			tempUserStats[hero].name = hero;

			// save hero to cookie
			var heroStatString = JSON.stringify(tempUserStats[hero]);
			heroStatString = normalizeString(heroStatString);
			setCookie("userstats" + hero, heroStatString, 1);
		}
		// save the user's avatar for navbar account link
		setCookie("useravatar", res.stats.quickplay.overall_stats.avatar, 1);

		if (Object.keys(tempUserStats).length != 0 && tempUserStats.constructor === Object) {
			resolve(tempUserStats);
		} else {
			reject(tempUserStats);
		}
	});
}

function processHeroRequest(response) {
	console.log("processing Hero info");
	return new Promise(function(resolve, reject) {
		var res = JSON.parse(response).data;
		console.log(res);
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

	// pull heroes that are toggled on from cookie
	if (getCookie("userHeroDisplay") != undefined) {
		heroDisplay = JSON.parse(getCookie("userHeroDisplay"));
	}

	// if userStats have been saved to cookie, retrieve them for processing
	if (getCookie("userstatsana") != undefined) {
		userStats = getUserStats();

		if (getCookie("herodataana") != undefined) {
			heroInfo = getHeroInfo();
		}
		document.getElementById("hero-grid").classList.remove("hidden");
		// build the page using the userStats object
		buildAllHeroSections(function() {
			updateMaxStats(false);
		});
	}

	// if userAPIURL hasn't been set, show battletag input
	if (getCookie("userAPIURL") === undefined) {
		document.getElementById("form-username").classList.remove("hidden");
	} else {
		document.getElementById("login").classList.add("hidden");
		document.getElementById("username").childNodes[2].nodeValue = getCookie("username");
		document.getElementById("account-icon").src = getCookie("useravatar");
		document.getElementById("account-dropdown").classList.remove("hidden");
	}

	// manually trigger open and close of hero toggle dropdowns
	$("#hero-grid .dropdown-toggle").on("click", function(e) {
		$(this).parent().toggleClass('open');
	});

	// close hero toggles when clicking outside of dropdown
	$("body").on("click", function (e) {
		if (!$("#hero-grid .hero-toggle").is(e.target) && 
		!$("#hero-grid label.btn").is(e.target)  && 
		!$("#hero-grid span.caret").is(e.target) &&
		!$("#hero-grid .dropdown-toggle").is(e.target)) {
			$("#hero-grid .dropdown-menu").parent().removeClass("open");
		}
	});

	// remove hero click handler
	$(".hero-container").on("click", ".hero-remove", function() {
		removeHeroSection(this.parentNode.parentNode.id, function() {
				updateMaxStats();
			});
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
			thisToggle = this;
			thisToggle.disabled = true;

			var toggledHero = normalizeString($(this).parent().text(), true);
			console.log("toggled: " + toggledHero);

			if (this.checked) {
				// update toggle state and saved toggle states
				heroDisplay.push(toggledHero);
				$(this).parent().addClass("active");

				// save toggle states to cookie
				var heroDisplayString = JSON.stringify(heroDisplay);
				setCookie("userHeroDisplay", heroDisplayString, 30);

				// build the toggle hero section 
				buildHeroSection(userStats[toggledHero], function() {
					updateMaxStats(false);
					thisToggle.disabled = false;
				});
			} else {
				// remove section and update button state
				removeHeroSection(toggledHero, function() {
					updateMaxStats(false);
					thisToggle.disabled = false;
				});
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

		// format for API call
		username = username.replace("#", "-");

		// set cookie if username is valid format
		setCookie("username", username, 30);
		var userAPIURL = "https://owapi.net/api/v3/u/" + username + "/blob";
		setCookie("userAPIURL", userAPIURL, 30);

		// attempt to request user stats from api
		makeRequest("GET", getCookie("userAPIURL"))
		.then(function(response) {
			return processUserStatRequest(response);
		})
		.then(function() {
			// setup index page now that we have data
			if (document.body.dataset.title === "index") {
				console.log("reload now");
				window.location.reload(false);
			}
		})
		.catch(function(err) {
			console.log("request error - status: " + err.status);
			// error response from api (either incorrect battletag or too many requests)
			deleteAllCookies("user", function() {
				// display battle tag not found alert
				showAlert("battletag-not-found");
				$("#modal-loading").modal("hide");
			});
		});
		$("#modal-loading").modal({
			backdrop: "static",
			keyboard: false
		});
	}
}

// for each hero in userStats (that's toggled on), build a hero section
function buildAllHeroSections(callback) {
	console.log("building all hero sections");
	heroDisplay.forEach(function(hero) {
		// pass the hero object through
		buildHeroSection(userStats[hero]);
	});

	if (callback && typeof callback === "function") {
		callback();
	}
}

// build the hero section for a given hero
function buildHeroSection(hero, callback) {
	// build new section from handlebars template
	var newSection = OW.templates.hero(hero);

	document.getElementById("hero-section-parent").insertAdjacentHTML("beforeend", newSection);

	if (callback && typeof callback === "function") {
		callback();
	}
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
		// the original section is hidden, so ignore it
		if (heroSections[i].id === "hero-section-original") { continue; }
		var hero = heroSections[i].id;

		if (userStats[hero].playtime) {
			var playtimeBar = heroSections[i].getElementsByClassName("hero-playtime")[0].childNodes[3];
			var elimsBar = heroSections[i].getElementsByClassName("hero-elims")[0].childNodes[3];
			var deathsBar = heroSections[i].getElementsByClassName("hero-deaths")[0].childNodes[3];
			var damageBar = heroSections[i].getElementsByClassName("hero-damage")[0].childNodes[3];

			var width = calcStatBarWidth(userStats[hero].playtime, userStats.maxPlaytime);
			playtimeBar.style.width = width + "%"; 

			var width = calcStatBarWidth(userStats[hero].eliminations_average, userStats.maxElims);
			elimsBar.style.width = width + "%"; 

			var width = calcStatBarWidth(userStats[hero].deaths_average, userStats.maxDeaths);
			deathsBar.style.width = width + "%"; 

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

// deletes the hero section from the dom for the given hero and updated hero display toggles
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

	// wait for one fadeout to end, then delete hero-section
	setTimeout(function() {
		heroSection.innerHTML = "";
		heroSection.parentNode.removeChild(heroSection);
		delete heroSection;

		if (callback && typeof callback === "function") {
			callback();
		}
	}, 550);
}


// =====================
// HERO PAGE FUNCTIONS
// =====================

function initHeroPage() {
	// for hero page, build the hero section
	heroInfo = getHeroInfo();
	var thisHero = getHeroFromURL();

	// if there's a valid hero in query string, set background and build hero info section. Else display error page
	if (thisHero) {
		setHeroBackground(normalizeString(thisHero.name, true).toLowerCase());

		if (getCookie("userstatsana") != undefined) {
			userStats = getUserStats();
			updateMaxStats(true);
		}
		// pass in both hero info and user stats for hero
		var context = {heroInfo: thisHero, userStats: userStats[normalizeString(thisHero.name, true).toLowerCase()]};

		// build hero info section and add to DOM
		var newSection = OW.templates.heroInfo(context);
		document.getElementById("hero-section-parent").insertAdjacentHTML("beforeend", newSection);
		updateStatBars();
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
	if (matchString != undefined && matchString != "") {
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
	if (matchString != undefined && typeof matchString != "function") {
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

// removed semicolons, accent marks, etc
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

function getUserStats() {
	console.log("getting user stats");

	var tempUserStats = {};
	// get all cookies involving userstats + the user avatar
	var statCookies = getCookieArray("userstats");

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

function getHeroInfo() {
	console.log("getting hero info");

	var tempHeroInfo = {};
	// get all cookies involving userstats
	var heroCookies = getCookieArray("herodata");
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
	return new Promise(function(resolve, reject) {
		var xhr = new XMLHttpRequest();
		xhr.open(method, url);
		console.log(url);
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4) {
				if (xhr.status == 200) {
					console.log("got response");
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


