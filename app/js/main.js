var reqUser = new XMLHttpRequest();
var userData = {};
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

// if userAPIURL exists, get user stats and build page with userdata
if (getCookie("userAPIURL") != undefined) {
	document.getElementById("hero-grid").classList.remove("hidden");
	getUserStats();
} else {
	// show the username form
	document.getElementById("formUsername").classList.remove("hidden");
}

// pull heroes that are toggled on from cookie
if (getCookie("userHeroDisplay") != undefined) {
	heroDisplay = JSON.parse(getCookie("userHeroDisplay"));
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
		// toggle button state
		!this.checked;
		// toggle display of hero
		heroDisplay[toggledHero] = this.checked;
		if (this.checked) {
			// add section
			buildHeroSection(toggledHero);
		} else {
			// remove section
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





function getUserStats() {
	console.log("asking for hero stats");
	reqUser.open("GET", getCookie("userAPIURL"), true);
	reqUser.send();

	reqUser.addEventListener("readystatechange", processUserRequest, false);
}


function processUserRequest(e) {
	if (reqUser.readyState === 4 && reqUser.status == 200) {
		console.log("received hero stats");
		var res = JSON.parse(reqUser.responseText);
		if (res.us) {
			userData = res.us;
		} else if (res.eu) {
			userData = res.eu;
		} else if (res.kr) {
			userData = res.kr;
		} else if (res.any) {
			userData = res.any;
		} else {
			alert("ran into a problem");
		}
		console.log("about to call build function");

		// create section for each checked hero
		buildAllHeroSections();
	}
}

// for each hero in userData (that's toggled on), build a hero section
function buildAllHeroSections() {
	console.log("building hero sections");
	for (var hero in userData.heroes.playtime.quickplay) {
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
	playTime.textContent = "Playtime: " + userData.heroes.playtime.quickplay[hero];

	// only heroes with > 0 playtime have stats info
	if (userData.heroes.stats.quickplay[hero]) {
		elims.textContent = "Eliminations: " + userData.heroes.stats.quickplay[hero].average_stats.eliminations_average;
		deaths.textContent = "Deaths: " + userData.heroes.stats.quickplay[hero].average_stats.deaths_average;
		damage.textContent = "Average Damage: " + userData.heroes.stats.quickplay[hero].average_stats.damage_done_average;
		// only healers have healing data
		if (userData.heroes.stats.quickplay[hero].average_stats.healing_done_average) {
			healing.textContent = "Healing: " + userData.heroes.stats.quickplay[hero].average_stats.healing_done_average;
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



