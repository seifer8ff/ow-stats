

getHero();


function getHero() {
	var heroData = getCookieArray();
	for (var i = 0; i < heroData.length; i++) {
		// ensure we're not processing non-hero cookies
		if (!heroData[i].includes("user")) {
			// we only care about the actual data, not the name of the cookie
			heroData[i] = heroData[i].split("=")[1];
			heroData[i] = JSON.parse(heroData[i]);
		}
	}

	// get hash value from url and only use the hero id
	var heroID = window.location.hash;
	heroID = heroID.replace("#", "");

	// create the page with the data from the hero
	buildHeroSection(heroData[heroID]);
}

function buildHeroSection(hero) {
	for (var attribute in hero) {
		$("h1").append("<p>" + hero[attribute] + "</p>");
	}
}