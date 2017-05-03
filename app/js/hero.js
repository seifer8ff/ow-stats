

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

	// get hero name from query string
	var heroName = window.location.search;
	heroName = heroName.replace("?name=", "");

	// find the hero object with matching name property
	selectedHero = heroData.find(function(hero) {
		return hero.name.toLowerCase() === heroName;
	});

	// create the page with the data from the hero
	buildHeroSection(selectedHero);
	setBackgroundImg(selectedHero);
}

function buildHeroSection(hero) {
	for (var attribute in hero) {
		$("h1").append("<p>" + hero[attribute] + "</p>");
	}
}

function setBackgroundImg(hero) {
	var bgImg = document.getElementById("hero-bg");
	bgImg.classList.add("ohi-" + hero.name.toLowerCase());
}