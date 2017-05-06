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
	buildAllHeroSections();
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
		console.log("changed");
		// get text on button
		var toggledHero = normalizeString($(this).parent().text(), true);

		// toggle display of hero
		heroDisplay[toggledHero] = this.checked;
		if (this.checked) {
			// add section and update button state
			$(this).parent().addClass("active");
			buildHeroSection(toggledHero);
		} else {
			// remove section and update button state
			$(this).parent().removeClass("active");
			removeHeroSection(toggledHero);
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
function buildAllHeroSections() {
	console.log("building hero sections");
	for (var hero in userStats) {
		// if the hero display is toggled on
		if (!heroDisplay[hero]) { continue; }

		buildHeroSection(hero);
	}
}

// build the hero section for a given hero
function buildHeroSection(hero) {
	// clone template section
	var originalHeroSection = document.getElementById("originalHeroSection");
	var newSection = originalHeroSection.cloneNode(true);

	// get children elements
	var heroName = newSection.getElementsByClassName("hero-name")[0];
	var heroIcon = newSection.getElementsByClassName("hero-icon")[0];
	var playTime = newSection.getElementsByClassName("hero-playTime")[0];
	var elims = newSection.getElementsByClassName("hero-elims")[0];
	var deaths = newSection.getElementsByClassName("hero-deaths")[0];
	var damage = newSection.getElementsByClassName("hero-damage")[0];
	var healing = newSection.getElementsByClassName("hero-healing")[0];
	var linkToHero = newSection.getElementsByClassName("hero-link")[0];

	// set id, hero name, and playtime (all heroes have this data)
	newSection.id = hero;
	heroIcon.classList.add("ohi-" + hero);
	linkToHero.href = "/hero.html?name=" + hero;
	newSection.classList.remove("hidden");
	heroName.textContent = hero;
	playTime.textContent = "Playtime: " + userStats[hero].playtime;

	// only heroes with > 0 playtime have stats info
	if (userStats[hero].eliminations_average) {
		elims.textContent = "Eliminations: " + userStats[hero].eliminations_average;
		deaths.textContent = "Deaths: " + userStats[hero].deaths_average;
		damage.textContent = "Average Damage: " + userStats[hero].damage_done_average;
		// only healers have healing data
		if (userStats[hero].healing_done_average) {
			healing.textContent = "Healing: " + userStats[hero].healing_done_average;
		} else {
			healing.innerHTML = "";
		}
	} else {
		// if heroes don't have stat info available, remove the element
		elims.innerHTML = "";
		deaths.innerHTML = "";
		damage.innerHTML = "";
		healing.innerHTML = "";
	}

	// console.log(newSection);
	// add each section to the DOM (could speed up by doing this one time)
	originalHeroSection.parentNode.appendChild(newSection);
}

function removeHeroSection(hero) {
	var heroSection = document.getElementById(hero);
	heroSection.classList.add("hidden");
}



