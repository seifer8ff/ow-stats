var User = function(options) {
	this.username = options.username;
	this.url = '';
	this.icon = '';
	this.maxStats = {
		elims: {
			name: 'Max Eliminations',
			value: 0
		},
		medals: {
			name: 'Max Medals',
			value: 0
		},
		heroDamage: {
			name: 'Max Hero Damage',
			value: 0
		},
		healing: {
			name: 'Max Healing',
			value: 0
		},
		playtime: {
			name: 'Max Playtime',
			value: 0
		}
	};
	this.selectedHeroes = {
		soldier76: true,
		junkrat: true,
		dva: true,
		mercy: true
	};
}
	
	
	