var reqHeroes = new XMLHttpRequest();



// ============
// HERO INFO
// ============
// if we haven't fetched hero data, or it's expired, fetch and store in cookie
if (getCookie("ana") === undefined) {
	console.log("fetching hero data from api");
	getHeroData();
}



function getHeroData() {
	// GET request to api
	reqHeroes.open("GET", "https://overwatch-api.net/api/v1/hero/", true);
	reqHeroes.send();

	reqHeroes.addEventListener("readystatechange", processHeroRequest, false);
}

function processHeroRequest(e) {
	if (reqHeroes.readyState === 4 && reqHeroes.status == 200) {
		var res = JSON.parse(reqHeroes.responseText);
		// for each hero in the response, create cookie with their data
		res.data.forEach(function(hero) {
			var heroDataString = JSON.stringify(hero);
			var cookieName = hero.name.toLowerCase();

			// remove semicolons, accents, etc
			cookieName = normalizeString(cookieName, true);
			heroDataString = normalizeString(heroDataString);

			setCookie(cookieName, heroDataString, 7);
		});
	}
}


function setCookie(name, value, expireDays) {
    var d = new Date();
    d.setTime(d.getTime() + (expireDays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    value = encodeURI(value);
    console.log("encode seems to work");
    document.cookie = name + "=" + value + "; " + expires;
}

function getCookie(name) {
	var value = "; " + document.cookie;
	value = decodeURI(value);
	var parts = value.split("; " + name + "=");
	console.log("decode seems to work");
	if (parts.length == 2) {
		return parts.pop().split(";").shift();
	} 
}

function getCookieArray() {
	var value = document.cookie;
	value = decodeURI(value);
	var parts = value.split("; ");
	console.log("decode seems to work");
	if (parts.length == 2) {
		return parts.pop().split(";").shift();
	} 
	return parts;
}

// removed semicolons, accent marks, etc
function normalizeString(string, removeExtras) {
	var newString = string.replace(";", ".");
	newString = newString.normalize('NFD').replace(/[\u0300-\u036f]/g, "");

	if (removeExtras) {
		// remove all whitespace
		newString = newString.replace(/\s/g,'');
		// remove ".", ":"
		newString = newString.replace(/:|\./g, "");
		newString = newString.toLowerCase();
	}
	return newString;
}



