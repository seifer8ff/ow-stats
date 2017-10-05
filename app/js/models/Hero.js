var Hero = function(options) {
	this.name = options.name;
	this.normalizedName = normalizeString(options.name, true);
	this.icon = '';
	this.compare = false;
	this.data = {
		realName: options.realName || null,
		age: options.age || null,
		affiliation: options.affiliation || null,
		base: options.base || null,
		description: options.description || null,
		health: options.health || null,
		armor: options.armor || null,
		shield: options.shield || null
	}
	this.stats = {
		elims: options.elims || null,
		medals: options.medals || null,
		heroDamage: options.heroDamage || null,
		healing: options.healing || null,
		playtime: options.playtime || null
	}

	if (this.normalizedName === 'junkrat' || this.normalizedName === 'symmetra' || this.normalizedName === 'mercy') {
		this.compare = true;
	}

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
}
	
	
	