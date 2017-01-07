var settings = {
	leftHanded: false
};

var sFuncs = {
	save: function() { localStorage.setItem("settings", JSON.stringify(settings)) },
	load: function() { if(localStorage.getItem("settings") !== null) { settings = JSON.parse(localStorage.getItem("settings")) } },
	handleHandedness: function() { $(".handed").removeClass("left right").addClass(settings.leftHanded ? "left" : "right") }
};