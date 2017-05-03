var reqUser = new XMLHttpRequest();
var userData = {};


// ================
// USER STATS API
// ================

// if userAPIURL exists, get user stats and build page with userdata
if (getCookie("userAPIURL") != undefined) {
	document.getElementById("idInput").classList.add("hidden");
	getUserStats();
}

// get all checkboxes, and add listener for toggling
var toggles = $(".hero-toggle");
toggles.on("change", function() {
	alert("changed");
});






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
		buildAllHeroSections(userData);
	}
}


function buildAllHeroSections(userData) {
	console.log("building hero sections");
	var originalHeroSection = document.getElementById("originalHeroSection");
	for (var hero in userData.heroes.playtime.quickplay) {
		// clone template section
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
}



