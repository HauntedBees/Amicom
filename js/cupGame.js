var cupGame = {
	cupAnimIdx: 0, cupAnimState: 0, cupIdx: 0, prize: "", readyToClick: false, won: false, 
	fullAnimState: 0, cupSpeed: 10, numShuffles: 5, consecutiveWins: 0, 
	animIdx: 0, iter: false, blinking: false, 
	start: function() {
		cupGame.setUpPet();
		$("#mainGame,#menuBtn,.gameOverTap").hide();
		$("#cupsGame,#pauseBtn").show();
		$("#cup0,#item0").css("margin-left", "-200px");
		$("#cup1,#item1").css("margin-left", "0");
		$("#cup2,#item2").css("margin-left", "200px");
		cupGame.consecutiveWins = 0;
		if(pet.intros.cups) {
			$("#cupsInstructions").show();
			game.paused = true;
		}
		$("#cupStart").off("click").on("click", cupGame.beginGame);
	},
	beginGame: function() {
		$("#bottomCups > .cup").each(function() { $(this).attr("class", "sprite cup g_cups"); });
		var p = game.getPetAnimData();
		$("#cupMouth").removeClass(p.mouths + " " + p.sadMouth).addClass(p.mouths.split(" ")[0]);
		$("#cupActions").hide();
		cupGame.cupIdx = Math.floor(Math.random() * 2);
		cupGame.prize = ["f_cayundy", "f_thoda", "coin", "frog"][Math.floor(Math.random() * 4)];
		$("#item" + cupGame.cupIdx).attr("class", "sprite cup " + cupGame.prize);
		cupGame.cupDOM = $("#cup" + cupGame.cupIdx);
		cupGame.cupAnimState = 0;
		cupGame.fullAnimState = 0;
		cupGame.numShuffles = Math.min(4 + cupGame.consecutiveWins, 20)
		cupGame.cupSpeed = Math.min(10 + cupGame.consecutiveWins * 1.25, 60);
		cupGame.shuffleFrames = Math.max(1.5, 10 - cupGame.consecutiveWins * 0.6);
		cupGame.cupAnimIdx = setInterval(cupGame.liftCup, 50);
	},
	setReadyToClick: function() {
		cupGame.readyToClick = true;
		$("#bottomCups").show();
		var positions = [-200, 0, 200];
		$("#item0").css("margin-left", $("#cup0").css("margin-left"));
		$("#item1").css("margin-left", $("#cup1").css("margin-left"));
		$("#item2").css("margin-left", $("#cup2").css("margin-left"));
		$("#topCups > .cup").off("click").on("click", function() {
			cupGame.cupAnimState = 0;
			cupGame.fullAnimState = 0;
			cupGame.clickedCup = $(this);
			$("#topCups > .cup").off("click");
			if($(this).attr("id") == cupGame.cupDOM.attr("id")) {
				cupGame.won = true;
			} else {
				var garbages = ["g_sports", "c_pumpkin_3", "shit s1", "boot", "sheb"];
				$("#" + $(this).attr("id").replace("cup", "item")).attr("class", "sprite cup " + garbages[Math.floor(Math.random() * garbages.length)]);
				cupGame.won = false;
			}
			cupGame.cupAnimIdx = setInterval(cupGame.liftClickedCup, 50);
		});
	},
	liftClickedCup: function() {
		if(cupGame.fullAnimState == 0) {
			cupGame.cupAnimState = Math.min(160, cupGame.cupAnimState + cupGame.cupSpeed);
			cupGame.clickedCup.css("margin-bottom", cupGame.cupAnimState + "px");
			if(cupGame.cupAnimState >= 160) {
				cupGame.cupAnimState = 0;
				cupGame.fullAnimState = 1;
				var p = game.getPetAnimData();
				if(cupGame.won) {
					cupGame.consecutiveWins++;
					game.addMood(0.02);
					game.addPersonality(0.0015 * cupGame.consecutiveWins, "c");
					game.addPersonality(0.001 * cupGame.consecutiveWins, "a");
					game.addPersonality(-0.001, "n");
					if(cupGame.prize == "f_cayundy") {
						pet.foods.cayundy++;
					} else if(cupGame.prize == "f_thoda") {
						pet.foods.thoda++;
					}
					$("#cupMouth").removeClass(p.mouths + " " + p.sadMouth).addClass(p.mouths.split(" ")[1]);
				} else {
					cupGame.consecutiveWins = 0;
					$("#cupMouth").removeClass(p.mouths + " " + p.sadMouth).addClass(p.sadMouth);
				}
				$("#cupsScore").text(cupGame.consecutiveWins);
			}
		} else if(cupGame.fullAnimState == 1) {
			cupGame.cupAnimState += 1;
			if(cupGame.cupAnimState > 40) {
				cupGame.cupAnimState = 160;
				cupGame.fullAnimState = 2;
			}
		} else if(cupGame.fullAnimState == 2) {
			cupGame.cupAnimState = Math.max(0, cupGame.cupAnimState - cupGame.cupSpeed);
			cupGame.clickedCup.css("margin-bottom", cupGame.cupAnimState + "px");
			if(cupGame.cupAnimState <= 0) {
				clearInterval(cupGame.cupAnimIdx);
				$("#cupActions").show();
			}
		}
	},
	liftCup: function() {
		if(cupGame.fullAnimState == 0) {
			cupGame.cupAnimState = Math.min(160, cupGame.cupAnimState + cupGame.cupSpeed);
			cupGame.cupDOM.css("margin-bottom", cupGame.cupAnimState + "px");
			if(cupGame.cupAnimState >= 160) {
				cupGame.cupAnimState = 0;
				cupGame.fullAnimState = 1;
			}
		} else if(cupGame.fullAnimState == 1) {
			cupGame.cupAnimState += 1;
			if(cupGame.cupAnimState > 10) {
				cupGame.cupAnimState = 160;
				cupGame.fullAnimState = 2;
			}
		} else if(cupGame.fullAnimState == 2) {
			cupGame.cupAnimState = Math.max(0, cupGame.cupAnimState - cupGame.cupSpeed);
			cupGame.cupDOM.css("margin-bottom", cupGame.cupAnimState + "px");
			if(cupGame.cupAnimState <= 0) {
				clearInterval(cupGame.cupAnimIdx);
				cupGame.setUpCupShuffle();
			}
		}
	},
	setUpCupShuffle: function() {
		$("#bottomCups").hide();
		cupGame.readyToClick = false;
		var positions = [-200, 0, 200];
		$("#topCups > .cup").each(function() {
			var curPos = parseInt($(this).css("margin-left").replace("px",""));
			var idx = Math.floor(Math.random() * positions.length);
			if(curPos == positions[idx]) { idx = Math.floor(Math.random() * positions.length); }
			var nextPos = positions.splice(idx, 1);
			var yDir = Math.floor(Math.random() * 3) - 1;
			$(this).attr({
				"data-current": curPos,
				"data-next": nextPos, 
				"data-y": yDir
			});
		});
		cupGame.cupAnimState = 0;
		cupGame.cupAnimIdx = setInterval(cupGame.shuffleCups, 50);
	},
	shuffleCups: function() {
		var numFrames = cupGame.shuffleFrames;
		cupGame.cupAnimState++;
		$("#topCups > .cup").each(function() {
			var curPos = parseInt($(this).attr("data-current"));
			var nextPos = parseInt($(this).attr("data-next"));
			var yDir = parseInt($(this).attr("data-y"));
			var newX = curPos + cupGame.cupAnimState * ((nextPos - curPos) / numFrames);
			var inside = (16 * (cupGame.cupAnimState / numFrames)) - 8;
			var newY =  (-(inside * inside) + 64) * yDir;
			$(this).css({
				"margin-left": newX + "px",
				"margin-bottom": newY + "px"
			});
		});
		if(cupGame.cupAnimState >= numFrames) {
			$("#topCups > .cup").each(function() {
				$(this).css({
					"margin-left": $(this).attr("data-next") + "px",
					"margin-bottom": "0px"
				});
			});
			clearInterval(cupGame.cupAnimIdx);
			if(cupGame.numShuffles-- > 0) {
				cupGame.setUpCupShuffle();
			} else {
				cupGame.setReadyToClick();
			}
		}
	},
	setUpPet: function() {
		var $m = $("#cupMonster"), $e = $("#cupEyes"), $mo = $("#cupMouth");
		var p = game.getPetAnimData();
		if(p.small) { $m.addClass("small"); } else { $m.removeClass("small"); }
		if(p.bigEyes) { $e.addClass("wide"); } else { $e.removeClass("wide"); }
		if(p.bigMouth) { $mo.addClass("wide"); } else  { $mo.removeClass("wide"); }
		cupGame.iter = false;
		cupGame.blinking = false;
		$m.removeClass(p.states).addClass(p.states.split(" ")[0]);
		$e.removeClass(p.eyes).addClass(p.eyes.split(" ")[0]).css({left: p.eyePos[0][0], top: p.eyePos[0][1]});
		$mo.removeClass(p.mouths).removeClass(p.sadMouth).addClass(p.mouths.split(" ")[0]).css({left: p.mouthPos[0][0], top: p.mouthPos[0][1]});
		if(game.isPetUpset()) { $("#mouth").removeClass(p.mouths).addClass(p.sadMouth); }
		clearInterval(cupGame.animIdx);
		cupGame.animIdx = setInterval(cupGame.animatePet, 1000);
	},
	animatePet: function() { 
		var p = game.getPetAnimData();
		$("#cupMonster").toggleClass(p.states);
		cupGame.iter = !pet.iter;
		var idx = cupGame.iter ? 1 : 0;
		$("#cupEyes").css({left: p.eyePos[idx][0], top: p.eyePos[idx][1]});
		$("#mouth").css({left: p.mouthPos[idx][0], top: p.mouthPos[idx][1]});
		if(cupGame.blinking) {
			$("#cupEyes").toggleClass(p.eyes);
			cupGame.blinking = false;
		} else if(Math.random() < 0.05) {
			$("#cupEyes").toggleClass(p.eyes);
			cupGame.blinking = true;
		}
	}
};