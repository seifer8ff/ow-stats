var reqUser = new XMLHttpRequest();
var userStats = {};
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


// ================
// USER STATS API
// ================

// if userAPIURL hasn't been set, show battletag input
if (getCookie("userAPIURL") === undefined) {
	document.getElementById("formUsername").classList.remove("hidden");
}

// pull heroes that are toggled on from cookie
if (getCookie("userHeroDisplay") != undefined) {
	heroDisplay = JSON.parse(getCookie("userHeroDisplay"));
}

// if userStats have been saved to cookie, retrieve them for processing
if (getCookie("userstatsana") != undefined) {
	// get all cookies involving userstats
	var statCookies = getCookieArray("userstats");
	// parse each cookie and add it to userStats object
	for (var i = 0; i < statCookies.length; i++) {
		// we only care about the actual data, not the name of the cookie
		statCookies[i] = statCookies[i].split("=")[1];

		// parse cookie into object, and add object to userStats
		var cookieObject = JSON.parse(statCookies[i]);
		userStats[cookieObject.name] = cookieObject;
	}
	document.getElementById("hero-grid").classList.remove("hidden");
	// build the page using the userStats object
	buildAllHeroSections(function() {
		updateMaxStats();
	});
}


window.onload=function() {
	var toggles = $(".hero-toggle");
	// if toggled on previously, set hero display buttons to active and 'checked'
	toggles.each(function() {
		var toggleName = normalizeString($(this).parent().text(), true);
		if (heroDisplay[toggleName]) {
			this.checked = true;
			$(this).parent().addClass("active");
		}
	});
	toggles.on("change", function() {
		// get text on button
		var toggledHero = normalizeString($(this).parent().text(), true);
		console.log("toggled: " + toggledHero);

		// toggle display of hero
		heroDisplay[toggledHero] = this.checked;
		if (this.checked) {
			// add section and update button state
			$(this).parent().addClass("active");
			buildHeroSection(toggledHero, function() {
				updateMaxStats();
			});
		} else {
			// remove section and update button state
			$(this).parent().removeClass("active");
			removeHeroSection(toggledHero, function() {
				updateMaxStats();
			});
		}
		// save toggle state to cookie
		var heroDisplayString = JSON.stringify(heroDisplay);
		setCookie("userHeroDisplay", heroDisplayString, 30);
	});
	// override form submit to add username + url to cookie
	document.getElementById("formUsername").onsubmit=function(e) {
		e.preventDefault();
		// get username
		var username = document.getElementById("inputUsername").value;

		// test with regex before continuing
		if (!/\w+#\d+/.test(username)) {
			alert("BATTLETAG format should match: Example#1234");
			return false;
		}

		// format for API call
		username = username.replace("#", "-");

		// set cookie if username is valid format
		setCookie("username", username, 30);
		var userAPIURL = "https://owapi.net/api/v3/u/" + username + "/blob";
		setCookie("userAPIURL", userAPIURL, 30);

		// hide input box
		this.classList.add("hidden");

		// get user stats
		document.getElementById("hero-grid").classList.remove("hidden");
		getUserStats();
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
	var newSection = newHeroSection(document.getElementById("originalHeroSection"), hero);
	// update stat values of new section
	setHeroSectionProps(newSection, hero, function() {
		// add new section to the DOM (could speed up by doing this one time)
		document.getElementById("originalHeroSection").parentNode.appendChild(newSection);
	});

	if (callback && typeof callback === "function") {
		callback();
	}
}

function removeHeroSection(hero, callback) {
	var heroSection = document.getElementById(hero);
	heroSection.outerHTML = "";
	delete heroSection;

	if (callback && typeof callback === "function") {
		callback();
	}
}

function updateMaxStats() {
	// reset max values
	userStats.maxElims = 0;
	userStats.maxDeaths = 0;
	userStats.maxDamage = 0;
	userStats.maxHealing = 0;

	// for each selected hero, check to see if their stat is higher than current max
	for (var hero in userStats) {
		// if the hero display is toggled on
		if (!heroDisplay[hero]) { continue; }

		// find the max value of each stat
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
	for (var hero in userStats) {
		if (!heroDisplay[hero]) { continue; }

		updateStatBars(hero);
	}
}

// returns a cloned hero section, with id set to hero name
function newHeroSection(originalElem, hero) {
	var newSection = document.getElementById("originalHeroSection").cloneNode(true);
	newSection.id = hero;
	newSection.classList.remove("hidden");

	return newSection;
}

// sets all stat values for hero section + misc other data like hero img and link
function setHeroSectionProps(parentElem, hero, callback) {
	var heroName = parentElem.getElementsByClassName("hero-name")[0];
	var heroIcon = parentElem.getElementsByClassName("hero-icon")[0];
	var playTime = parentElem.getElementsByClassName("hero-playTime")[0];
	var elims = parentElem.getElementsByClassName("hero-elims")[0].childNodes[3];
	var deaths = parentElem.getElementsByClassName("hero-deaths")[0].childNodes[3];
	var damage = parentElem.getElementsByClassName("hero-damage")[0].childNodes[3];
	var healing = parentElem.getElementsByClassName("hero-healing")[0].childNodes[3];
	var linkToHero = parentElem.getElementsByClassName("hero-link")[0];

	heroIcon.classList.add("ohi-" + hero);
	linkToHero.href = "/hero.html?name=" + hero;
	heroName.textContent = hero;
	playTime.innerHTML = "<span class='glyphicon glyphicon-time' aria-hidden='true'></span> - " + userStats[hero].playtime + " hrs";

	// If hero has any stat objects, then they have all stat objects
	if (userStats[hero].eliminations_average) {
		elims.textContent = Math.ceil(userStats[hero].eliminations_average);
		deaths.textContent = userStats[hero].deaths_average;
		damage.textContent = userStats[hero].damage_done_average;
		// only healers have healing data
		if (userStats[hero].healing_done_average) {
			healing.textContent = userStats[hero].healing_done_average;
		} else {
			healing.parentNode.innerHTML = "";
		}
	} else {
		// if heroes don't have stat info available, remove the element
		elims.parentNode.innerHTML = "";
		deaths.parentNode.innerHTML = "";
		damage.parentNode.innerHTML = "";
		healing.parentNode.innerHTML = "";
	}

	if (callback && typeof callback === "function") {
		callback();
	}
}

// updates bar sizes based on hero stat vs max value of stat
function updateStatBars(hero) {
	var parentElem = document.getElementById(hero);
	var elimsBar = parentElem.getElementsByClassName("hero-elims")[0].childNodes[3];
	var deathsBar = parentElem.getElementsByClassName("hero-deaths")[0].childNodes[3];
	var damageBar = parentElem.getElementsByClassName("hero-damage")[0].childNodes[3];
	var healingBar = parentElem.getElementsByClassName("hero-healing")[0].childNodes[3];

	if (elimsBar) { elimsBar.style.width = userStats[hero].eliminations_average / userStats.maxElims * 100 + "%"; }
	if (deathsBar) { deathsBar.style.width = userStats[hero].deaths_average / userStats.maxDeaths * 100 + "%"; }
	if (damageBar) { damageBar.style.width = userStats[hero].damage_done_average / userStats.maxDamage * 100 + "%"; }
	if (healingBar) { healingBar.style.width = userStats[hero].healing_done_average / userStats.maxHealing * 100 + "%"; }
}




