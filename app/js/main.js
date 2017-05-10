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
	document.getElementById("login").classList.remove("hidden");
} else {
	document.getElementById("account-dropdown").classList.remove("hidden");
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

// click handlers
window.onload=function() {
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
	$(".hero-display").on("click", ".hero-remove", function() {
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
				updateMaxStats();
			});
		} else {
			// remove section and update button state
			removeHeroSection(toggledHero, function() {
				updateMaxStats();
			});
		}
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

	// logout button click
	$("#logout").on("click", function(e) {
		deleteAllCookies(function() {
			window.location.reload(false); 
		});
	});
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
		newSection.classList.add("fade-in");
	});

	if (callback && typeof callback === "function") {
		callback();
	}
}

// returns a cloned hero section, with id set to hero name
function newHeroSection(originalElem, hero) {
	var newSection = document.getElementById("originalHeroSection").cloneNode(true);
	newSection.id = hero;

	return newSection;
}

// sets all stat values for hero section + misc other data like hero img and link
function setHeroSectionProps(parentElem, hero, callback) {
	var heroName = parentElem.getElementsByClassName("hero-name")[0];
	var heroIcon = parentElem.getElementsByClassName("hero-icon")[0];
	var playtime = parentElem.getElementsByClassName("hero-playtime")[0].childNodes[3];
	var elims = parentElem.getElementsByClassName("hero-elims")[0].childNodes[3];
	var deaths = parentElem.getElementsByClassName("hero-deaths")[0].childNodes[3];
	var damage = parentElem.getElementsByClassName("hero-damage")[0].childNodes[3];
	var healing = parentElem.getElementsByClassName("hero-healing")[0].childNodes[3];
	var linkToHero = parentElem.getElementsByClassName("hero-link")[0];

	heroIcon.classList.add("ohi-" + hero);
	linkToHero.href = "/hero.html?name=" + hero;
	heroName.textContent = hero;
	playtime.textContent = userStats[hero].playtime;

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

// find and save max value of each stat for currently selected heroes
function updateMaxStats() {
	// reset max values
	userStats.maxElims = 0;
	userStats.maxDeaths = 0;
	userStats.maxDamage = 0;
	userStats.maxHealing = 0;
	userStats.maxPlaytime = 0;

	// for each selected hero, check to see if their stat is higher than current max
	for (var hero in userStats) {
		// if the hero display is toggled on
		if (!heroDisplay[hero]) { continue; }

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
	for (var hero in userStats) {
		if (!heroDisplay[hero]) { continue; }

		updateStatBars(hero);
	}
}

// updates bar sizes based on hero stat vs max value of stat
function updateStatBars(hero) {
	var parentElem = document.getElementById(hero);
	var playtimeBar = parentElem.getElementsByClassName("hero-playtime")[0].childNodes[3];
	var elimsBar = parentElem.getElementsByClassName("hero-elims")[0].childNodes[3];
	var deathsBar = parentElem.getElementsByClassName("hero-deaths")[0].childNodes[3];
	var damageBar = parentElem.getElementsByClassName("hero-damage")[0].childNodes[3];
	var healingBar = parentElem.getElementsByClassName("hero-healing")[0].childNodes[3];

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
		heroSection.outerHTML = "";
		delete heroSection;
	}, 500);
	

	if (callback && typeof callback === "function") {
		callback();
	}
}



