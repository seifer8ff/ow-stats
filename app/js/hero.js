

getHero();


function getHero() {
	var heroData = getCookieArray("herodata");
	for (var i = 0; i < heroData.length; i++) {
		// we only care about the actual data, not the name of the cookie
		heroData[i] = heroData[i].split("=")[1];
		heroData[i] = JSON.parse(heroData[i]);
	}

	// get hero name from query string
	var heroName = window.location.search;
	heroName = heroName.replace("?name=", "");
	// find the hero object with matching name property
	var selectedHero = heroData.find(function(hero) {
		return normalizeString(hero.name, true).toLowerCase() === heroName;
	});

	// create the page with the data from the hero
	buildHeroSection(selectedHero);
	setBackground(normalizeString(selectedHero.name, true).toLowerCase());
}

function buildHeroSection(hero) {
	// var container = document.getElementsByClassName("hero-container")[0];
	// var heroSidebar = document.getElementById("hero-sidebar");
	// var heroMain = document.getElementById("hero-main");
	var heroRealName = document.getElementById("hero-realName");
	var heroAge = document.getElementById("hero-age");
	var heroAffil = document.getElementById("hero-affiliation");
	var heroBase = document.getElementById("hero-base");
	var heroName = document.getElementById("hero-name");
	var heroImg = document.getElementById("hero-img");
	var heroDesc = document.getElementById("hero-desc");
	var heroHealth = document.getElementById("hero-health");
	var heroArmor = document.getElementById("hero-armor");
	var heroShield = document.getElementById("hero-shield");

	heroRealName.textContent = hero.real_name;
	heroAge.textContent = hero.age;
	heroAffil.textContent = hero.affiliation;
	heroBase.textContent = hero.base_of_operations;
	heroName.textContent = hero.name;
	heroDesc.textContent = hero.description;
	heroHealth.textContent = "Health: " + hero.health;
	heroArmor.textContent = "Armor: " + hero.armour;
	heroShield.textContent = "Shield: " + hero.shield;

	heroImg.src=("../img/ow-" + normalizeString(hero.name, true).toLowerCase() + "-full.jpg");
}

function setBackground(heroName) {
	document.body.classList.add("body-" + heroName);
}