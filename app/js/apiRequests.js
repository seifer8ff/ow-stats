var reqHeroes = new XMLHttpRequest();
var reqStats = new XMLHttpRequest();



// ============
// HERO INFO
// ============
// if we haven't fetched hero data, or it's expired, fetch and store in cookie
if (getCookie("herodataana") === undefined) {
	console.log("fetching hero data from api");
	getHeroData();
}

if (getCookie("userstatsana") === undefined && getCookie("userAPIURL") != undefined) {
	console.log("fetching user stats from api");
	getUserStats();
}

function getUserStats() {
	console.log("asking for user stats");
	reqStats.open("GET", getCookie("userAPIURL"), true);
	reqStats.send();

	reqStats.addEventListener("readystatechange", processUserRequest, false);
}

function processUserRequest(e) {
	if (reqStats.readyState === 4 && reqStats.status == 200) {
		console.log("received hero stats");
		var res = JSON.parse(reqStats.responseText);
		if (res.us) {
			res = res.us;
		} else if (res.eu) {
			res = res.eu;
		} else if (res.kr) {
			res = res.kr;
		} else if (res.any) {
			res = res.any;
		} else {
			alert("ran into a problem");
		}
		console.log("saving user stats to cookie");
		var userStats = {};

		// for each hero, save playtime and average stats
		for (var hero in res.heroes.playtime.quickplay) {
			// create empty object for each hero
			userStats[hero] = {};
			// if hero has quickplay data, store it
			if (res.heroes.stats.quickplay[hero]) {
				userStats[hero] = res.heroes.stats.quickplay[hero].average_stats;
			}
			userStats[hero].playtime =  res.heroes.playtime.quickplay[hero];
			userStats[hero].name = hero;

			// prepare object for storage and add to cookie
			var heroStatString = JSON.stringify(userStats[hero]);
			heroStatString = normalizeString(heroStatString);
			setCookie("userstats" + hero, heroStatString, 1);
		}
	}
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
			var cookieName = "heroData" + hero.name.toLowerCase();

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
    document.cookie = name + "=" + value + "; " + expires;
}

function getCookie(name) {
	var value = "; " + document.cookie;
	value = decodeURI(value);
	var parts = value.split("; " + name + "=");
	if (parts.length == 2) {
		return parts.pop().split(";").shift();
	} 
}

function getCookieArray(matchString) {
	var value = document.cookie;
	value = decodeURI(value);
	var cookies = value.split("; ");

	// if matchString has been provided, only return cookies that contain match string
	if (matchString != undefined) {
		var matchedCookies = [];
		cookies.forEach(function(cookie) {
			if (cookie.indexOf(matchString) !== -1) {
				matchedCookies.push(cookie);
			}
		});
		cookies = matchedCookies;
	}

	if (cookies.length == 2) {
		return cookies.pop().split(";").shift();
	} 
	return cookies;
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



