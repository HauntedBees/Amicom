var consts = {
	stepLength: 1000, // 1 second
	stepCounter: 600 // 10 minutes
};
var game = {
	paused: false,
	stepIdx: 0, lockSaving: false, timeSinceLastLoad: 0,
	intervalId: 0, intervalState: 0, isInInterval: false,
	dialogIdx: 0, inDialog: true,
	getPetAnimData: function() { return petTypes[pet.type]; },
	setUpPet: function() {
		var $m = $("#monster"), $e = $("#eyes"), $mo = $("#mouth");
		var p = game.getPetAnimData();
		if(p.small) { $m.addClass("small"); } else { $m.removeClass("small"); }
		if(p.smallEyes) { $e.addClass("narrow"); } else  { $e.removeClass("narrow"); }
		if(p.bigEyes) { $e.addClass("wide"); } else { $e.removeClass("wide"); }
		if(p.biggerEyes) { $e.addClass("x-wide"); } else  { $e.removeClass("x-wide"); }
		if(p.noMouth) {
			$mo.hide();
		} else {
			$mo.show();
			if(p.smallMouth) { $mo.addClass("narrow"); } else  { $mo.removeClass("narrow"); }
			if(p.bigMouth) { $mo.addClass("wide"); } else  { $mo.removeClass("wide"); }
			if(p.biggerMouth) { $mo.addClass("x-wide"); } else  { $mo.removeClass("x-wide"); }
			$mo.removeClass(p.mouths).removeClass(p.sadMouth).addClass(p.mouths.split(" ")[0]).css({left: p.mouthPos[0][0], top: p.mouthPos[0][1]});
			if(game.isPetUpset()) { $("#mouth").removeClass(p.mouths).addClass(p.sadMouth); }
		}
		pet.iter = false;
		pet.blinking = false;
		game.handleAilmentDisplay();
		if(pet.shat) { $("#shit").show(); } else { $("#shit").hide(); }
		game.doAging();
		$m.removeClass(p.states).addClass(p.states.split(" ")[0]);
		$e.removeClass(p.eyes).addClass(p.eyes.split(" ")[0]).css({left: p.eyePos[0][0], top: p.eyePos[0][1]});
		clearInterval(pet.animIdx);
		pet.animIdx = setInterval(game.animatePet, 1000);
	},
	animatePet: function() { 
		var p = game.getPetAnimData();
		$("#monster").toggleClass(p.states);
		$("#shit").toggleClass("shit1 shit2");
		$(".s1, .s2").toggleClass("s1 s2");
		pet.iter = !pet.iter;
		var idx = pet.iter ? 1 : 0;
		game.handleAilmentDisplay();
		$("#eyes").css({left: p.eyePos[idx][0], top: p.eyePos[idx][1]});
		if(!p.noMouth) {
			if(game.isPetUpset()) {
				$("#mouth").removeClass(p.mouths).addClass(p.sadMouth);
			} else if($("#mouth").hasClass(p.sadMouth)) {
				$("#mouth").removeClass(p.sadMouth).addClass(p.mouths.split(" ")[0]);
			}
			$("#mouth").css({left: p.mouthPos[idx][0], top: p.mouthPos[idx][1]});
		}
		if(pet.blinking) {
			$("#eyes").toggleClass(p.eyes);
			pet.blinking = false;
		} else if(Math.random() < 0.05) {
			$("#eyes").toggleClass(p.eyes);
			pet.blinking = true;
		}
	},
	getPersonalities: function() {
		var personalityIndexes = [""];
		/*if(pet.personality.o > 8) { personalityIndexes.push("oI"); }		// Inventive
		else if(pet.personality.o > 6) { personalityIndexes.push("oi"); }
		else if(pet.personality.o < 2) { personalityIndexes.push("oC"); }	// Cautious
		else if(pet.personality.o < 4) { personalityIndexes.push("oc"); }
		if(pet.personality.c > 8) { personalityIndexes.push("cO"); }		// Organized
		else if(pet.personality.c > 6) { personalityIndexes.push("co"); }
		else if(pet.personality.c < 2) { personalityIndexes.push("cC"); }	// Careless
		else if(pet.personality.c < 4) { personalityIndexes.push("cc"); }
		if(pet.personality.e > 8) { personalityIndexes.push("eO"); }		// Outgoing
		else if(pet.personality.e > 6) { personalityIndexes.push("eo"); }
		else if(pet.personality.e < 2) { personalityIndexes.push("eR"); }	// Reserved
		else if(pet.personality.e < 4) { personalityIndexes.push("er"); }
		if(pet.personality.a > 8) { personalityIndexes.push("aF"); }		// Friendly
		else if(pet.personality.a > 6) { personalityIndexes.push("af"); }
		else if(pet.personality.a < 2) { personalityIndexes.push("aD"); }	// Detached
		else if(pet.personality.a < 4) { personalityIndexes.push("ad"); }
		if(pet.personality.n > 8) { personalityIndexes.push("nS"); }		// Sensitive
		else if(pet.personality.n > 6) { personalityIndexes.push("ns"); }
		else if(pet.personality.n < 2) { personalityIndexes.push("nC"); }	// Confident
		else if(pet.personality.n < 4) { personalityIndexes.push("nc"); }*/
		return personalityIndexes;
	},
	startDialog: function() {
		var personalityIndexes = game.getPersonalities();
		var topicIndexes = ["", "", "", ""]; // default should be weighted
		var evolving = false;
		
		if(game.getEvolution()) {
			evolving = true;
		} else {
			game.addPersonality(0.025, "a");
			game.addMood(0.4);
			if(pet.hunger > 10) { topicIndexes.push("full"); }
			else if(pet.hunger == 0) { topicIndexes.push("starving"); }
			else if(pet.hunger <= 4) { topicIndexes.push("hungry"); }
			
			if(pet.health < 2) { topicIndexes.push("dying"); }
			else if(pet.health <= 5) { topicIndexes.push("unhealthy"); }
			
			if(pet.fitness >= 8) { topicIndexes.push("fit"); }
			else if(pet.fitness <= 2) { topicIndexes.push("unfit"); }
			
			if(pet.age == 0) { topicIndexes.push("newborn"); }
			else if(pet.age < 2) { topicIndexes.push("baby"); }
			else if(pet.age < 4) { topicIndexes.push("infant"); }
			else if(pet.age < 13) { topicIndexes.push("child"); }
			else if(pet.age < 20) { topicIndexes.push("teenager"); }
			else if(pet.age < 55) { topicIndexes.push("adult"); }
			else { topicIndexes.push("old"); }
			
			if(pet.mood > 8) { topicIndexes.push("ecstatic"); }
			else if(pet.mood > 6) { topicIndexes.push("happy"); }
			else if(pet.mood < 2) { topicIndexes.push("depressed"); }
			else if(pet.mood < 4) { topicIndexes.push("sad"); }
			else { topicIndexes.push("indifferent"); }
			
			var time = (new Date()).getHours();
			if(time < 4) { topicIndexes.push("lateNight"); }
			else if(time < 7) { topicIndexes.push("earlyMorning"); }
			else if(time < 12) { topicIndexes.push("morning"); }
			else if(time < 16) { topicIndexes.push("noon"); }
			else if(time < 19) { topicIndexes.push("evening"); }
			else { topicIndexes.push("night"); }	
		}
		
		var starter = "_";
		if(evolving) {
			starter = "evolving";
		} else {
			starter = personalityIndexes[Math.floor(Math.random() * personalityIndexes.length)];
			if(Math.random() < 0.4) { starter = starter.toLowerCase(); }
			starter += "_" + topicIndexes[Math.floor(Math.random() * topicIndexes.length)];
		}
		
		var keys = game.starters[starter];
		var idx = keys[Math.floor(Math.random() * keys.length)];
		
		
		game.inDialog = true;
		$("#speechBubble").show();
		game.dialogIdx = idx;
		var dialogVal = game.dialogs[game.dialogIdx];
		$("#speechBubble").text(dialogVal.text);
		if(dialogVal.options) {
			var html = "";
			for(var i = 0; i < dialogVal.options.length; i++) {
				var replyVal = dialogVal.options[i];
				html += "<div class='reply' data-id='" + replyVal.next + "'>" + replyVal.value + "</div>"
			}
			$("#additionalBubbles").html(html);
		}
		game.handleAnyDialogEffects();
	},
	handleAnyDialogEffects: function() {
		var dialogVal = game.dialogs[game.dialogIdx];
		if(dialogVal.filling !== undefined) { game.addHunger(dialogVal.filling); }
		if(dialogVal.fitness !== undefined) { game.addFitness(dialogVal.fitness); }
		if(dialogVal.mood !== undefined) { game.addMood(dialogVal.mood); }
		if(dialogVal.o !== undefined) { game.addPersonality(dialogVal.o, "o"); }
		if(dialogVal.c !== undefined) { game.addPersonality(dialogVal.c, "c"); }
		if(dialogVal.e !== undefined) { game.addPersonality(dialogVal.e, "e"); }
		if(dialogVal.a !== undefined) { game.addPersonality(dialogVal.a, "a"); }
		if(dialogVal.n !== undefined) { game.addPersonality(dialogVal.n, "n"); }
	},
	selectDialog: function(next) {
		game.dialogIdx = next;
		$("#additionalBubbles").html("");
		if(game.dialogIdx == undefined) {
			$("#speechBubble").hide();
			game.inDialog = false;
			return;
		}
		$("#speechBubble").text(game.dialogs[game.dialogIdx].text);
		game.handleAnyDialogEffects();
	},
	advanceDialog: function() {
		game.dialogIdx = game.dialogs[game.dialogIdx].next;
		$("#additionalBubbles").html("");
		if(game.dialogIdx == undefined) {
			$("#speechBubble").hide();
			game.inDialog = false;
			return;
		}
		$("#speechBubble").text(game.dialogs[game.dialogIdx].text);
		if(game.dialogs[game.dialogIdx].evolving) { game.evolvePet(); }
		game.handleAnyDialogEffects();
	},
	save: function() {
		if(game.lockSaving) { return; }
		localStorage.setItem("pet05", JSON.stringify(pet));
		localStorage.setItem("stepIdx", game.stepIdx);
		localStorage.setItem("lastRunTime", new Date());
	}, 
	load: function() {
		if(window.location.search!="?new" && localStorage.getItem("pet05") !== null) { pet = JSON.parse(localStorage.getItem("pet05")); };
		game.setUpPet();
		game.stepIdx = parseInt(localStorage.getItem("stepIdx")) || 0;
		game.addHunger(0);
		var lastTimeStr = localStorage.getItem("lastRunTime");
		if(lastTimeStr != undefined) {
			var lastTime = new Date(lastTimeStr);
			game.timeSinceLastLoad = new Date() - lastTime;
			var numSteps = game.timeSinceLastLoad / consts.stepLength;
			game.step(numSteps);
		}
		game.save();
	}, 
	step: function(numSteps) {
		numSteps = Math.round(numSteps);
		game.stepIdx += numSteps;
		var totalCycles = Math.floor(game.stepIdx / consts.stepCounter);
		if(totalCycles > 0) {
			game.fullStep(totalCycles);
			game.stepIdx -= consts.stepCounter * totalCycles;
		}
		game.save();
	},
	clearInterval: function() {
		clearInterval(game.intervalId);
		game.isInInterval = false;
		game.setUpPet();
	}, 
	fullStep: function(numSteps) {
		game.addHunger(-0.2 * numSteps);
		pet.cleanliness = Math.max(0, pet.cleanliness - 0.0075 * numSteps);
		pet.mood = Math.max(0, pet.mood - 0.01 * numSteps);
		pet.fitness = Math.max(0, pet.fitness - 0.001);
		game.addPersonality(-0.0005 * numSteps, "a");
		var shitStep = 1, sickStep = 1;
		if(Math.random() < (0.02 * numSteps)) {
			game.shit();
			shitStep = Math.ceil(Math.random() * numSteps);
		}
		if(!pet.sick && pet.health < 4 && Math.random() > (0.4 / numSteps)) {
			pet.sick = true;
			pet.sickCount++;
			sickStep = Math.ceil(Math.random() * numSteps);
		}
		if(pet.shat || pet.sick) {
			pet.health = Math.max(0, pet.health - 0.025 * Math.max(sickStep, shitStep));
			pet.mood = Math.max(0, pet.mood - 0.01 * sickStep);
			if(pet.shat) { 
				pet.cleanliness = Math.max(0, pet.cleanliness - 0.05 * shitStep);
				pet.mood = Math.max(0, pet.mood - 0.01 * shitStep);
				game.addPersonality(-0.001 * shitStep, "n");
			}
			if(pet.sick) {
				pet.fitness = Math.max(0, pet.fitness - 0.01 * sickStep);
				game.addPersonality(-0.001 * sickStep, "o");
			}
		}
		game.doAging();
		console.log("full step! " + numSteps);
		console.log(pet.hunger);
	},
	feed: function(foodId) {
		if(game.isInInterval) { return; }
		var $food = $("#food");
		$food.show().css("right", "440px");
		game.intervalState = 0;
		game.isInInterval = true;
		clearInterval(pet.animIdx);
		if((foodId != "pill" && pet.hunger >= 10) || (foodId == "pill" && !game.needsMedicine())) {
			game.petDecline();
			return false;
		} else {
			game.giveFood(foodId);
			var p = game.getPetAnimData();
			if(!p.noMouth) {
				$("#mouth").removeClass(p.sadMouth).addClass(p.mouths.split(" ")[0]);
			}
			game.intervalId = setInterval(function() {
				game.intervalState++;
				var p = game.getPetAnimData();
				var x = 440 - game.intervalState * 15;
				if(!p.noMouth) {
					$("#mouth").toggleClass(p.mouths);
				}
				$food.css("right", x + "px");
				if(game.intervalState > 10) {
					$food.hide();
					game.clearInterval();
				}
			}, 100);
			return true;
		}
	}
};