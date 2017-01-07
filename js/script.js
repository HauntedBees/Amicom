$.fn.extend({
	disableSelection: function() {
		this.each(function() {
			this.onselectstart = function() { return false; };
			this.unselectable = "on";
			$(this).css("-moz-user-select", "none");
			$(this).css("-webkit-user-select", "none");
		});
		return this;
	}
});
function percentToText(percent) {
	if(percent >= 0.9) { return "Very Good"; }
	if(percent >= 0.75) { return "Good"; }
	if(percent >= 0.45) { return "Okay"; }
	if(percent >= 0.2) { return "Bad"; }
	if(percent > 0) { return "Very Bad"; }
	return "Terrible";
}

function SetUpEventHandlers() {
	$("#speechBubble").text(game.dialogs[game.dialogIdx].text);
	$("#side_wipe").on("click", function() {
		if(!confirm("Are you sure you want to reset everything?")) { return; }
		game.lockSaving = true;
		localStorage.clear();
		location.reload();
	});
	$("#pauseBtn").on("click", function() { $("#pauseMenu").show(); game.paused = true; });
	$("#pauseMenu").on("click", function() { $("#pauseMenu").hide(); game.paused = false; });
	$(".startGame").on("click", function() { $(".instructions").hide(); game.paused = false; });
	$(".quitGame").on("click", function() { $(".instructions,.scene,#pauseBtn").hide(); $("#mainGame,#menuBtn").show(); });
	$(".gameOverTap").on("click", function() { $(".scene,#pauseBtn").hide(); $("#mainGame,#menuBtn").show(); });
	$(document).on("click", ".menuGame", function() {
		var elem = $(this).attr("data-id");
		$("#secondaryMenu").empty();
		if(elem == "watering") { wateringGame.start(); }
		else if(elem == "sports") { footTennis.start(); }
		else if(elem == "cups") { cupGame.start(); }
		else if(elem == "cave") { caveGame.start(); }
	});
	
	$(document).on("click", ".menuHealth", function() {
		var elem = $(this).attr("data-id");
		$("#secondaryMenu").empty();
		if(elem == "toilet") { game.cleanUpShit(); }
		else if(elem == "bath") { game.takeABath(); }
		else if(elem == "pill") {
			$("#food").attr("class", "item sprite h_pill");
			game.feed("pill");
		}
	});
	
	$("#menuBtn").on("click", function() { $("#sideMenu").show(); });
	
	$("#side_settings").on("click", function() {
		$("#sideMenu").hide();
		$("#sideMenuSettings").show();
		$("#optionLeft").text(settings.leftHanded ? "On" : "Off");
	});
	$(".side_close").on("click", function() { $(".side").hide(); });
	
	$("#optionLeft").on("click", function() {
		settings.leftHanded = !settings.leftHanded;
		$(this).text(settings.leftHanded ? "On" : "Off");
		sFuncs.save();
		sFuncs.handleHandedness();
	});
	
	$("#speechBubble").on("click", function() { if(game.inDialog && !$("#additionalBubbles > *").length) {game.advanceDialog() } });
	$(document).on("click", ".reply", function() { if(game.inDialog) { game.selectDialog(parseInt($(this).attr("data-id"))) } });
	
	$("#monster").on("click", function() { 
		if(game.inDialog) {
			if(!$("#additionalBubbles").length) { return; }
			game.advanceDialog();
		} else {
			game.startDialog();
		}
	});
	
	$("#petInfo").on("click", function() { $("#petInfo").hide(); });
	
	$("#btnStat").on("click", function() {
		$("#secondaryMenu").empty();
		var $m = $("#monsterDisplayInfo"), $e = $("#eyesInfo"), $mo = $("#mouthInfo");
		
		var p = game.getPetAnimData();
		if(p.small) { $m.addClass("small"); } else { $m.removeClass("small"); }
		if(p.bigEyes) { $e.addClass("wide"); } else { $e.removeClass("wide"); }
		if(p.biggerEyes) { $e.addClass("x-wide"); } else  { $e.removeClass("x-wide"); }
		if(p.noMouth) {
			$mo.hide();
		} else {
			if(p.bigMouth) { $mo.addClass("wide"); } else  { $mo.removeClass("wide"); }
			if(p.biggerMouth) { $mo.addClass("x-wide"); } else  { $mo.removeClass("x-wide"); }
			$mo.removeClass(p.mouths).removeClass(p.sadMouth).addClass(p.mouths.split(" ")[0]).css({left: p.mouthPos[0][0], top: p.mouthPos[0][1]});
		}
		
		$m.removeClass(p.states).addClass(p.states.split(" ")[0]);
		$e.removeClass(p.eyes).addClass(p.eyes.split(" ")[0]).css({left: p.eyePos[0][0], top: p.eyePos[0][1]});
		if(game.isPetUpset()) { $("#mouth").removeClass(p.mouths).addClass(p.sadMouth); }
		
		$("#petInfoName").text(pet.name);
		$("#info_age").text(pet.age);
		$("#info_health").text(percentToText(pet.health / 10) + " (" + pet.health.toPrecision(2) + ")");
		$("#info_hunger").text(percentToText(pet.hunger / 10) + " (" + pet.hunger.toPrecision(2) + ")");
		$("#info_mood").text(percentToText(pet.mood / 10) + " (" + pet.mood.toPrecision(2) + ")");
		$("#info_fitness").text(percentToText(pet.fitness / 10) + " (" + pet.fitness.toPrecision(2) + ")");
		$("#info_cleanliness").text(percentToText(pet.cleanliness / 5) + " (" + pet.cleanliness.toPrecision(2) + ")");
		
		var c2 = document.getElementById("oceanPentagon").getContext("2d");
		var offset = 25;
		c2.fillStyle = "#FFFFFF";
		c2.beginPath();
		c2.moveTo(75 + offset, 4 + offset); c2.lineTo(0 + offset, 59 + offset);
		c2.lineTo(29 + offset, 147 + offset); c2.lineTo(121 + offset, 147 + offset);
		c2.lineTo(150 + offset, 54 + offset); c2.lineTo(75 + offset, 4 + offset);
		c2.closePath();
		c2.fill();

		c2.strokeStyle = "#BBBBBB"; c2.lineWidth = 1;
		c2.beginPath(); c2.moveTo(75 + offset, 4 + offset); c2.lineTo(75 + offset, 75 + offset); c2.closePath(); c2.stroke();
		c2.beginPath(); c2.moveTo(0 + offset, 59 + offset); c2.lineTo(75 + offset, 75 + offset); c2.stroke(); c2.closePath();
		c2.beginPath(); c2.moveTo(29 + offset, 147 + offset); c2.lineTo(75 + offset, 75 + offset); c2.stroke(); c2.closePath();
		c2.beginPath(); c2.moveTo(121 + offset, 147 + offset); c2.lineTo(75 + offset, 75 + offset); c2.stroke(); c2.closePath();
		c2.beginPath(); c2.moveTo(150 + offset, 54 + offset); c2.lineTo(75 + offset, 75 + offset); c2.stroke(); c2.closePath();

		var o = pet.personality.o / 10, c = pet.personality.c / 10, e = pet.personality.e / 10, a = pet.personality.a / 10, n = pet.personality.n / 10;
		c2.fillStyle = "#00FF00CC";
		c2.strokeStyle = "#00000099"; c2.lineWidth = 1;
		c2.beginPath();
		var ox = 75 + offset, oy = 4 + (71 * (1 - o)) + offset;
		var cx = (1 - c) * 75 + c * 150 + offset, cy = c * 54 + (1 - c) * 75 + offset;
		var ex = (1 - e) * 75 + e * 121 + offset, ey = e * 147 + (1 - e) * 75 + offset;
		var ax = a * 29 + (1 - a) * 75 + offset, ay = a * 147 + (1 - a) * 75 + offset;
		var nx = (1 - n) * 75 + offset, ny = n * 59 + (1 - n) * 75 + offset;
		c2.moveTo(ox, oy); c2.lineTo(nx, ny);
		c2.lineTo(ax, ay); c2.lineTo(ex, ey);
		c2.lineTo(cx, cy); c2.lineTo(ox, oy);
		c2.closePath();
		c2.fill();
		c2.stroke();
		
		c2.strokeStyle = "#000000"; c2.lineWidth = 2;
		c2.beginPath();
		c2.moveTo(75 + offset, 4 + offset); c2.lineTo(0 + offset, 59 + offset);
		c2.lineTo(29 + offset, 147 + offset); c2.lineTo(121 + offset, 147 + offset);
		c2.lineTo(150 + offset, 54 + offset); c2.lineTo(75 + offset, 4 + offset);
		c2.closePath();
		c2.stroke();
		
		c2.fillStyle = "#FFFFFF"; c2.font = "24px verdana"; c2.strokeStyle = "#000000"; c2.lineWidth = 1;
		c2.fillText("O", 90, 22); c2.strokeText("O", 90, 22);
		c2.fillText("C", 178, 84); c2.strokeText("C", 178, 84);
		c2.fillText("E", 148, 193); c2.strokeText("E", 148, 193);
		c2.fillText("A", 36, 193); c2.strokeText("A", 36, 193);
		c2.fillText("N", 4, 84); c2.strokeText("N", 4, 84);
		
		$("#petInfo").toggle();
	});
	$("#btnFood").on("click", function() { menu.toggleFoodMenu(); });
	$("#btnBath").on("click", function() { menu.toggleHealthMenu(); });
	$("#btnGame").on("click", function() { menu.toggleGameMenu(); });
	$(document).on("click", ".menuFood", function() {
		var food = $(this).attr("data-id");
		$("#secondaryMenu").empty();
		$("#food").attr("class", "item sprite f_" + food);
		var fed = game.feed(food);
		if(fed) { pet.foods[food]--; }
	});
}
function StartGame(firstTime) {
	setInterval(function() { game.step(1) }, consts.stepLength);
	if(!firstTime) {
		var personalities = game.getPersonalities();
		var dialogType = "";
		var dLoad = game.timeSinceLastLoad / 1000;
		if(dLoad < 14400) { // less than 4 hours
			dialogType = "_shortReturn";
		} else if(dLoad < 172800) { // less than 2 days
			dialogType = "_midReturn";
		} else {
			dialogType = "_longReturn";
		}
		var starter = personalities[Math.floor(Math.random() * personalities.length)] + dialogType;
		var keys = game.starters[starter] || [3];
		var idx = keys[Math.floor(Math.random() * keys.length)];		
		game.dialogIdx = idx;
	}
	$("#nameSpot").text(pet.name);
	$("#nowLording").hide();
	$("#mainGame").show();
}
$(document).ready(function() {
	game.load();
	$("div").disableSelection();
	var firstTime = (pet.name == "");
	if(firstTime) {
		$("#eggSelect").show();
		$("#nowLording").hide();
		game.dialogIdx = 0;
		$(".egg").on("click", function() {
			if($(this).hasClass("disabled")) {
				alert("This egg is not ready yet.");
				return;
			}
			pet.name = pet.name || prompt("What will you name your pet?").trim() || "Chungo";
			pet.type = $(this).attr("data-type");
			$("#eggSelect").hide();
			$("#nowLording").show();
			game.setUpPet();
			StartGame(true);
		});
	} else {
		sFuncs.load();
		StartGame(false);
	}
	sFuncs.handleHandedness();
	SetUpEventHandlers();
});