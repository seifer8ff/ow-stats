var req = new XMLHttpRequest();
var userData = {};
var username;
var apiURL;

// only consume API if user has entered their battlenet id
if (window.location.search) {
	username = window.location.search;
	username = username.replace("?username=", "");
	username = username.replace("%23", "-");
	apiURL = "https://owapi.net/api/v3/u/" + username + "/blob";

	// GET request to api
	req.open("GET", apiURL, true);
	req.send();
}




req.addEventListener("readystatechange", processRequest, false);



function processRequest(e) {
	if (req.readyState === 4 && req.status == 200) {
		console.log("processed api");
		var res = JSON.parse(req.responseText);
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