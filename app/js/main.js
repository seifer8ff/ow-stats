var reqHeroes = new XMLHttpRequest();
var reqStats = new XMLHttpRequest();
var userStats = {};
var heroInfo = {};
var heroDisplay = {
	sombra: 	false,
	mercy: 		true,
	lucio: 		false,
	dva: 		true,
	symmetra: 	false,
	widowmaker: false,
	reaper: 	false,
	tracer: 	true,
	ana: 		false,
	zenyatta: 	false,
	junkrat: 	false,
	roadhog: 	false,
	zarya: 		false,
	orisa: 		false,
	pharah: 	false,
	mccree: 	false,
	torbjorn: 	false,
	mei: 		true,
	reinhardt: 	false,
	hanzo: 		true,
	genji: 		false,
	winston: 	false,
	bastion: 	false,
	soldier76: 	true
};



window.onload=function() {

	if (getCookie("userstatsana") === undefined && getCookie("userAPIURL") != undefined) {
		// username has been entered, but stats need to be refreshed
		console.log("fetching user stats from api");
		requestUserStats();
	} else if (document.body.dataset.title === "index") {
		// stats have already been saved to cookie
		initIndexPage();
	}

	if (getCookie("herodataana") === undefined) {
		console.log("fetching hero data from api");
		requestHeroData();
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

function requestUserStats() {
	console.log("asking for user stats");
	reqStats.open("GET", getCookie("userAPIURL"), true);
	reqStats.send();

	reqStats.addEventListener("readystatechange", processUserStatRequest, false);
}

function processUserStatRequest(e) {
	if (reqStats.readyState === 4 && reqStats.status === 200) {
		console.log("received hero stats");

		// hide input box and show hero grid
		document.getElementById("form-username").classList.add("hidden");
		document.getElementById("hero-grid").classList.remove("hidden");

		var res = JSON.parse(reqStats.responseText);
		if (res.us) {
			res = res.us;
		} else if (res.eu) {
			res = res.eu;
		} else if (res.kr) {
			res = res.kr;
		} else if (res.any) {
			res = res.any;
		} else {
			alert("ran into a problem");
		}
		console.log("saving user stats to cookie");
		var userStats = {};

		// for each hero, save playtime and average stats
		for (var hero in res.heroes.playtime.quickplay) {
			// create empty object for each hero
			userStats[hero] = {};
			// if hero has quickplay data, store hero
			if (res.heroes.stats.quickplay[hero]) {
				userStats[hero] = res.heroes.stats.quickplay[hero].average_stats;
			}
			userStats[hero].playtime =  res.heroes.playtime.quickplay[hero];
			userStats[hero].name = hero;

			// prepare object for storage and add to cookie
			var heroStatString = JSON.stringify(userStats[hero]);
			heroStatString = normalizeString(heroStatString);
			setCookie("userstats" + hero, heroStatString, 1);
		}

		// save the user's avatar for navbar account link
		userStats.avatar = res.stats.quickplay.overall_stats.avatar;

		setCookie("useravatar", userStats.avatar, 1);

		// setup index page now that we have data
		if (document.body.dataset.title === "index") {
			window.location.reload(false);
		}
	} else if (reqStats.readyState === 4 && reqStats.status === 0) {
		// error response from api
		deleteAllCookies("user", function() {
			// display battle tag not found alert
			document.getElementById("battletag-format").classList.add("hidden");
			document.getElementById("battletag-not-found").classList.remove("hidden");
		});
	}
}

function requestHeroData() {
	// GET request to api
	reqHeroes.open("GET", "https://overwatch-api.net/api/v1/hero/", true);
	reqHeroes.send();

	reqHeroes.addEventListener("readystatechange", processHeroRequest, false);
}

function processHeroRequest(e) {
	if (reqHeroes.readyState === 4 && reqHeroes.status == 200) {
		var res = JSON.parse(reqHeroes.responseText);
		// for each hero in the response, create cookie with their data
		res.data.forEach(function(hero) {
			var heroDataString = JSON.stringify(hero);
			var cookieName = "heroData" + hero.name.toLowerCase();

			// remove semicolons, accents, etc
			cookieName = normalizeString(cookieName, true);
			heroDataString = normalizeString(heroDataString);

			setCookie(cookieName, heroDataString, 7);
		});
		// fill out hero section with api data
		if (document.body.dataset.title === "hero") {
			initHeroPage();
		}
	}
}

// =====================
// INDEX PAGE FUNCTIONS 
// =====================

function initIndexPage() {
	console.log("initializing index page");

	// hide error messages on page load
	document.getElementById("battletag-not-found").classList.add("hidden");
	document.getElementById("battletag-format").classList.add("hidden");

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

	var toggles = $(".hero-toggle");
	// if toggled on previously, set hero display buttons to active and 'checked'
	toggles.each(function() {
		var toggleName = normalizeString($(this).parent().text(), true);
		if (heroDisplay[toggleName]) {
			this.checked = true;
			$(this).parent().addClass("active");
		}
	});

	// on toggle, update heroDisplay and build or remove hero section
	toggles.on("change", function(e) {
		var toggledHero = normalizeString($(this).parent().text(), true);
		console.log("toggled: " + toggledHero);

		if (this.checked) {
			// update toggle state and saved toggle states
			heroDisplay[toggledHero] = true;
			$(this).parent().addClass("active");

			// save toggle states to cookie
			var heroDisplayString = JSON.stringify(heroDisplay);
			setCookie("userHeroDisplay", heroDisplayString, 30);

			// build the toggle hero section 
			buildHeroSection(toggledHero, function() {
				updateMaxStats(false);
			});
		} else {
			// remove section and update button state
			removeHeroSection(toggledHero, function() {
				updateMaxStats(false);
			});
		}
	});

	// override form submit to add username + url to cookie
	document.getElementById("form-username").onsubmit=function(e) {
		e.preventDefault();
		// get username
		var username = document.getElementById("inputUsername").value;

		// test with regex before continuing
		if (!/\w+#\d+/.test(username)) {
			// remove old alerts, and alert if format is invalid
			document.getElementById("battletag-not-found").classList.add("hidden");
			document.getElementById("battletag-format").classList.remove("hidden");
			return false;
		}

		// format for API call
		username = username.replace("#", "-");

		// set cookie if username is valid format
		setCookie("username", username, 30);
		var userAPIURL = "https://owapi.net/api/v3/u/" + username + "/blob";
		setCookie("userAPIURL", userAPIURL, 30);

		// attempt to request user stats from api
		requestUserStats();
	}
}

// for each hero in userStats (that's toggled on), build a hero section
function buildAllHeroSections(callback) {
	console.log("building all hero sections");
	for (var hero in userStats) {
		// if the hero display is toggled on
		if (!heroDisplay[hero]) { continue; }

		buildHeroSection(hero);
	}

	if (callback && typeof callback === "function") {
		callback();
	}
}

// build the hero section for a given hero
function buildHeroSection(hero, callback) {
	// clone template section
	var newSection = newHeroSection(document.getElementById("hero-section-original"), hero);

	// basic setup of index page's hero section
	var heroName = newSection.getElementsByClassName("hero-name")[0];
	var heroIcon = newSection.getElementsByClassName("hero-icon")[0];
	var linkToHero = newSection.getElementsByClassName("hero-link")[0];

	heroIcon.classList.add("ohi-" + hero);
	linkToHero.href = "/hero.html?name=" + hero;
	heroName.textContent = heroInfo[hero].name;

	// update stat values of new section
	setHeroStatProps(newSection, hero, function() {
		// add new section to the DOM (could speed up by doing this one time)
		document.getElementById("hero-section-original").parentNode.appendChild(newSection);
		newSection.classList.add("fade-in");
	});

	if (callback && typeof callback === "function") {
		callback();
	}
}

// returns a cloned hero section, with id set to hero name
function newHeroSection(originalElem, hero) {
	var newSection = document.getElementById("hero-section-original").cloneNode(true);
	newSection.id = hero;

	return newSection;
}

// sets all stat values for hero section + misc other data like hero img and link
function setHeroStatProps(parentElem, hero, callback) {
	var playtime = parentElem.getElementsByClassName("hero-playtime")[0].childNodes[3];
	var elims = parentElem.getElementsByClassName("hero-elims")[0].childNodes[3];
	var deaths = parentElem.getElementsByClassName("hero-deaths")[0].childNodes[3];
	var damage = parentElem.getElementsByClassName("hero-damage")[0].childNodes[3];
	var healing = parentElem.getElementsByClassName("hero-healing")[0].childNodes[3];

	// check if we have any data for this hero
	if (userStats[hero]) {
		playtime.textContent = Math.ceil(userStats[hero].playtime);

		// If hero has any stat objects, then they have all stat objects
		if (userStats[hero].eliminations_average) {
			elims.textContent = Math.ceil(userStats[hero].eliminations_average);
			deaths.textContent = Math.ceil(userStats[hero].deaths_average);
			damage.textContent = Math.ceil(userStats[hero].damage_done_average);
			// only healers have healing data
			if (userStats[hero].healing_done_average) {
				healing.textContent = Math.ceil(userStats[hero].healing_done_average);
			} else {
				healing.parentNode.innerHTML = "";
			}
		} else {
			// if heroes don't have stat info available, remove the element and unhide the message
			parentElem.getElementsByClassName("hero-message")[0].classList.remove("hidden");
			playtime.parentNode.classList.add("hidden");
			elims.parentNode.innerHTML = "";
			deaths.parentNode.innerHTML = "";
			damage.parentNode.innerHTML = "";
			healing.parentNode.innerHTML = "";
		}
	} else {
		if (getCookie("userAPIURL") === undefined) {
			parentElem.getElementsByClassName("hero-message")[0].classList.remove("hidden");
			parentElem.getElementsByClassName("hero-message")[0].childNodes[3].textContent = "Not Logged In!";
			parentElem.getElementsByClassName("hero-message")[0].childNodes[7].textContent = "Log in to see this hero's statistics!";
			playtime.parentNode.classList.add("hidden");
			elims.parentNode.innerHTML = "";
			deaths.parentNode.innerHTML = "";
			damage.parentNode.innerHTML = "";
			healing.parentNode.innerHTML = "";
		}
	}
	
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
		// if the hero display is toggled on and we aren't getting max of all heroes
		if (!heroDisplay[hero] && !allHeroes) { continue; }

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
		var playtimeBar = heroSections[i].getElementsByClassName("hero-playtime")[0].childNodes[3];
		var elimsBar = heroSections[i].getElementsByClassName("hero-elims")[0].childNodes[3];
		var deathsBar = heroSections[i].getElementsByClassName("hero-deaths")[0].childNodes[3];
		var damageBar = heroSections[i].getElementsByClassName("hero-damage")[0].childNodes[3];
		var healingBar = heroSections[i].getElementsByClassName("hero-healing")[0].childNodes[3];

		if (playtimeBar) { 
			var width = calcStatBarWidth(userStats[hero].playtime, userStats.maxPlaytime);
			playtimeBar.style.width = width + "%"; 
		}
		if (elimsBar) { 
			var width = calcStatBarWidth(userStats[hero].eliminations_average, userStats.maxElims);
			elimsBar.style.width = width + "%"; 
		}
		if (deathsBar) { 
			var width = calcStatBarWidth(userStats[hero].deaths_average, userStats.maxDeaths);
			deathsBar.style.width = width + "%"; 
		}
		if (damageBar) { 
			var width = calcStatBarWidth(userStats[hero].damage_done_average, userStats.maxDamage);
			damageBar.style.width = width + "%"; 
		}
		if (healingBar) { 
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

// deletes the hero section from the dom for the given hero and updated hero display toggles
function removeHeroSection(hero, callback) {
	var heroSection = document.getElementById(hero);

	// update saved toggle states
	heroDisplay[hero] = false;
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
	}, 550);
	

	if (callback && typeof callback === "function") {
		callback();
	}
}


// =====================
// HERO PAGE FUNCTIONS
// =====================

function initHeroPage() {
	// for hero page, build the hero section
	heroInfo = getHeroInfo();
	var thisHero = getHeroFromURL();

	if (thisHero) {
		var heroSection = document.getElementById("hero");
		heroSection.id = normalizeString(thisHero.name, true).toLowerCase();

		setHeroBackground(normalizeString(thisHero.name, true).toLowerCase());

		// create the page with the data from the hero
		setHeroInfoProps(thisHero, function() {
			if (getCookie("userstatsana") != undefined) {
				userStats = getUserStats();
				updateMaxStats(true);
			} 
			setHeroStatProps(heroSection, normalizeString(thisHero.name, true));
			heroSection.classList.add("fade-in");
		});
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

function setHeroInfoProps(hero, callback) {
	var heroRealName = document.getElementById("hero-realName");
	var heroAge = document.getElementById("hero-age");
	var heroAffil = document.getElementById("hero-affiliation");
	var heroBase = document.getElementById("hero-base");
	var heroName = document.getElementById("hero-name");
	var heroImg = document.getElementById("hero-img");
	var heroDesc = document.getElementById("hero-desc");
	var heroHealth = document.getElementById("hero-health");
	var heroArmor = document.getElementById("hero-armor");
	var heroShield = document.getElementById("hero-shield");

	heroRealName.textContent = hero.real_name;
	heroAge.textContent = hero.age;
	heroAffil.textContent = hero.affiliation;
	heroBase.textContent = hero.base_of_operations;
	heroName.textContent = hero.name;
	heroDesc.textContent = hero.description;
	heroHealth.textContent = "Health: " + hero.health;

	if (hero.armour != 0) {
		heroArmor.textContent = "Armor: " + hero.armour;
	} else {
		heroArmor.innerHTML = "";
	}
	if (hero.shield != 0) {
		heroShield.textContent = "Shield: " + hero.shield;
	} else {
		heroShield.innerHTML = "";
	}

	heroImg.src=("../img/ow-" + normalizeString(hero.name, true).toLowerCase() + "-full.jpg");

	if (callback && typeof callback === "function") {
		callback();
	}
}

function setHeroBackground(heroName) {
	document.body.classList.add("body-" + heroName);
}



// ==================
// UTILITY FUNCTIONS
// ==================
function setCookie(name, value, expireDays) {
    var d = new Date();
    d.setTime(d.getTime() + (expireDays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    value = encodeURI(value);
    document.cookie = name + "=" + value + "; " + expires;
}

function getCookie(name) {
	var value = "; " + document.cookie;
	value = decodeURI(value);
	var parts = value.split("; " + name + "=");
	if (parts.length == 2) {
		return parts.pop().split(";").shift();
	} 
}

function getCookieArray(matchString) {
	var value = document.cookie;
	value = decodeURI(value);
	var cookies = value.split("; ");

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

	// if match string has been provided only get cookies containing it
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
	var newString = string.replace(";", ".");
	newString = newString.normalize('NFD').replace(/[\u0300-\u036f]/g, "");

	if (removeExtras) {
		// remove all whitespace
		newString = newString.replace(/\s/g,'');
		newString = newString.replace(/:|\./g, "");
		newString = newString.toLowerCase();
	}
	return newString;
}

function getUserStats() {
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


