var Hero = function(options) {
	this.name = options.name;
	this.normalizedName = normalizeString(options.name, true);
	this.icon = '';
	this.role = '';
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
		elims: {
			value: options.elims || null,
			name: 'Eliminations'
		},
		medals: {
			value: options.medals || null,
			name: 'Medals'
		},
		heroDamage: {
			value: options.heroDamage || null,
			name: 'Hero Damage'
		},
		healing: {
			value: options.healing || null,
			name: 'Healing'
		},
		playtime: {
			value: options.playtime || null,
			name: 'Playtime'
		},
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
	
	
	