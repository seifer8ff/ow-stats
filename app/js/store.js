var Store =  (function() {

	function isExpired(key) {
		var obj = JSON.parse(localStorage.getItem(key));
		var now = new Date().getTime();
		if (!obj || now >= obj.expires) {
			return true;
		} else {
			return false;
		}
	}

	function setLocal(key, data, timeToExpire) {
		var obj = {
			data: data,
			expires: new Date().getTime() + timeToExpire
		}
		localStorage.setItem(key, JSON.stringify(obj));
	}

	function getLocal(key) {
		let raw = localStorage.getItem(key);
		if (raw) {
			raw = JSON.parse(localStorage.getItem(key)).data;
		}
		let data = decodeURIComponent(raw);
		return JSON.parse(data);
	}

	function validateInput(str) {
		return str.trim().replace(/\s+/g,"+");
	}

	// remove semicolons, accent marks, etc
	function normalizeString(string, removeExtras) {
		var newString = unorm.nfd(string).replace(/[\u0300-\u036f]/g, "");

		if (removeExtras) {
			// remove all whitespace
			newString = newString.replace(/\s/g,'');
			newString = newString.replace(/:|\./g, "");
			newString = newString.toLowerCase();
		}
		return newString;
	}
	

	return {
		setLocal: setLocal,
		getLocal: getLocal,
		isExpired: isExpired,
		validate: validateInput,
		normalizeString: normalizeString
	}
}());




