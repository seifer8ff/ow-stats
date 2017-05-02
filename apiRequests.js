var reqHeroes = new XMLHttpRequest();


// ================
// USER STATS
// ================
// if we haven't stored the username in the cookie, get username, build url, and store in cookie
if (getCookie("userAPIURL") === undefined) {
	if (window.location.search) {
		var username = window.location.search;
		username = username.replace("?username=", "");
		username = username.replace("%23", "-");
		setCookie("username", username, 30);

		var userAPIURL = "https://owapi.net/api/v3/u/" + username + "/blob";
		setCookie("userAPIURL", userAPIURL, 30);
	}
}

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
			// remove errant semicolons for JSON purposes
			heroDataString = heroDataString.replace(";", ".");
			var cookieName = hero.name.toLowerCase();
			setCookie(cookieName, heroDataString, 7);
		});
	}
}


function setCookie(name, value, expireDays) {
    var d = new Date();
    d.setTime(d.getTime() + (expireDays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = name + "=" + value + "; " + expires;
}

function getCookie(name) {
	var value = "; " + document.cookie;
	var parts = value.split("; " + name + "=");
	if (parts.length == 2) {
		return parts.pop().split(";").shift();
	} 
}

function getCookieArray() {
	var value = document.cookie;
	var parts = value.split("; ");
	if (parts.length == 2) {
		return parts.pop().split(";").shift();
	} 
	return parts;
}



