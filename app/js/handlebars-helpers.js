Handlebars.registerHelper('heroSelected', function(heroName, user){
    return heroName in user.selectedHeroes;
});
	
	