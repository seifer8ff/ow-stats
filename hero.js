var req = new XMLHttpRequest();
var heroData = [];

// GET request to api
req.open("GET", "https://overwatch-api.net/api/v1/hero/", true);
req.send();


req.addEventListener("readystatechange", processRequest, false);



function processRequest(e) {
	if (req.readyState === 4 && req.status == 200) {
		var res = JSON.parse(req.responseText);
		heroData = res.data;

		// get hash value from url and only use the hero id
		var heroID = window.location.hash;
		heroID = heroID.replace("#", "");

		// create the page with the data from the hero
		buildHeroSection(heroData[heroID]);
	}
}



function buildHeroSection(hero) {
	for (var attribute in hero) {
		$("h1").append("<p>" + hero[attribute] + "</p>");
	}
	
}