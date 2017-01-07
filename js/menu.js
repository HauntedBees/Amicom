var menu = {
	toggleFoodMenu: function() {
		$("#petInfo").hide();
		$("#secondaryMenu").empty();
		if($("#secondaryMenu").attr("data-id") == "food") { 
			$("#secondaryMenu").attr("data-id", "");
			return;
		}
		$("#secondaryMenu").attr("data-id", "food");
		var keys = Object.keys(pet.foods);
		var html = "";
		for(var i = 0; i < keys.length; i++) {
			var food = keys[i];
			if(pet.foods[food] == 0) { continue; }
			html += "<div><div class='sprite f_" + food + " menuFood' data-id='" + food + "'></div><span>" + pet.foods[food] + "</span></div>";
		}
		$("#secondaryMenu").html(html);
	},
	toggleHealthMenu: function() {
		$("#petInfo").hide();
		$("#secondaryMenu").empty();
		if($("#secondaryMenu").attr("data-id") == "health") { 
			$("#secondaryMenu").attr("data-id", "");
			return;
		}
		$("#secondaryMenu").attr("data-id", "health");
		var keys = ["pill", "bath", "toilet"];
		var html = "";
		for(var i = 0; i < keys.length; i++) {
			var elem = keys[i];
			html += "<div><div class='sprite h_" + elem + " menuHealth' data-id='" + elem + "'></div></div>";
		}
		$("#secondaryMenu").html(html);
	},
	toggleGameMenu: function() {
		$("#petInfo").hide();
		$("#secondaryMenu").empty();
		if($("#secondaryMenu").attr("data-id") == "games") { 
			$("#secondaryMenu").attr("data-id", "");
			return;
		}
		$("#secondaryMenu").attr("data-id", "games");
		var keys = ["sports", "cups", "watering", "cave"];
		var html = "";
		for(var i = 0; i < keys.length; i++) {
			var game = keys[i];
			html += "<div><div class='sprite g_" + game + " menuGame' data-id='" + game + "'></div></div>";
		}
		$("#secondaryMenu").html(html);
	}
};
var foodData = {
	burgar: {filling: 6,	fitness: -0.01,	mood: 1,		e: 0.25},
	carrot: {filling: 4,	fitness: 0.2,	mood: 0,		c: 0.25}, 
	cayundy: {filling: 1,	fitness: -0.2,	mood: 2.5,		o: 0.25,	c: -0.1}, 
	gwapes: {filling: 2,	fitness: 0.1,	mood: 0.25,		e: -0.25}, 
	malk: {filling: 3,		fitness: 0.015,	mood: 1.5,		n: 0.3,		e: -0.15}, 
	thoda: {filling: 2,		fitness: -0.2,	mood: 2.5,		a: -0.15,	c: -0.1}
};