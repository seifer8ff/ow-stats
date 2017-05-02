var reqUser = new XMLHttpRequest();
var userData = {};


// ================
// USER STATS API
// ================

// if userAPIURL exists, get user stats and build page with userdata
if (getCookie("userAPIURL") != undefined) {
	console.log(getCookie("userAPIURL"));
		getUserStats();
}






function getUserStats() {
	reqUser.open("GET", getCookie("userAPIURL"), true);
	reqUser.send();

	reqUser.addEventListener("readystatechange", processUserRequest, false);
}


function processUserRequest(e) {
	if (reqUser.readyState === 4 && reqUser.status == 200) {
		console.log("processed api");
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
	console.log("in build function")
	for (var hero in userData.heroes.playtime.quickplay) {
		console.log(hero);
		var originalHeroSection = document.getElementById("originalHeroSection");
		var newSection = originalHeroSection.cloneNode(true);
		console.log(newSection);

		newSection.id = hero;

		originalHeroSection.parentNode.appendChild(newSection);
	}
}



