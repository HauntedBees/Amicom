var pet = {
	name: "", stage: 0, age: 0, birthday: new Date(),
	hunger: 5, mood: 6, health: 8, fitness: 5, cleanliness: 3, sick: false, 
	cleanCount: 0, sickCount: 0, // milkCount: 0, carrotCount: 0, 
	personality: { o: 5, c: 5, e: 5, a: 5, n: 5 }, 
	foods: { burgar: 5, carrot: 5, cayundy: 5, gwapes: 5, malk: 5, thoda: 5 },
	type: "biped", 
	shat: false, timeShat: new Date(), 
	animIdx: 0, iter: false, blinking: false, 
	intros: { watering: true, sports: true, cups: true, cave: true }
};
var petTypes = {
	biped: {
		small: true, states: "biped1 biped2", evolveAge: 2, 
		eyes: "eyeA1 eyeA2", eyePos: [[30, 19], [30, 20]], 
		mouths: "mouthA1 mouthA2", mouthPos: [[30, 11], [30, 12]],
		sadMouth: "mouthSadA",
		evolutions: {
			fitness_high: {priority: 2, next: "bipedA"},
			mood_high: {priority: 3, next: "bipedB"}, 
			health_low: {priority: 4, next: "bipedC"},
			sick_often: {priority: 1, next: "bipedC"}
		}
	},
	bipedA: {
		states: "bipedA1 bipedA2", evolveAge: 10, 
		eyes: "eyeB1 eyeB2", bigEyes: true, eyePos: [[80, 100], [83, 105]], 
		mouths: "mouthB1 mouthB2", mouthPos: [[100, 100], [102, 105]], 
		sadMouth: "mouthSadA",
		evolutions: {
			n_low: {priority: 1, next: "bipedAA"},
			fitness_high: {priority: 3, next: "bipedAB"}, 
			hunger_high: {priority: 5, next: "bipedAC"},
			a_low: {priority: 4, next: "bipedAD"},
			e_high: {priority: 2, next: "bipedAE"}
		}
	},
	bipedB: {
		states: "bipedB1 bipedB2", evolveAge: 11,
		eyes: "eyeC1 eyeC2", bigEyes: true, eyePos: [[90, 125], [90, 127]], 
		mouths: "mouthC1 mouthC2", bigMouth: true, mouthPos: [[90, 123], [90, 129]], 
		sadMouth: "mouthSadB",
		evolutions: {
			n_high: {priority: 1, next: "bipedBA"},
			a_high: {priority: 3, next: "bipedBB"}, 
			c_low: {priority: 2, next: "bipedBC"},
			mood_high: {priority: 4, next: "bipedBD"}
		}
	},
	bipedC: {
		states: "bipedC1 bipedC2", evolveAge: 12,
		eyes: "eyeD1 eyeD2", bigEyes: true, eyePos: [[90, 110], [91, 112]], 
		mouths: "mouthB1 mouthB2", mouthPos: [[110, 100], [111, 102]], 
		sadMouth: "mouthSadA",
		evolutions: {
			e_low: {priority: 2, next: "bipedCA"},
			sick_often: {priority: 1, next: "bipedCB"},
			health_low: {priority: 3, next: "bipedCB"}
		}
	},
	bipedAA: {
		states: "bipedAA1 bipedAA2",
		eyes: "eyeE1 eyeE2", biggerEyes: true, eyePos: [[65, 80], [63, 82]], 
		mouths: "mouthC1 mouthC2", bigMouth: true, mouthPos: [[90, 85], [88, 87]], 
		sadMouth: "mouthSadB"
	},
	bipedAB: {
		states: "bipedAB1 bipedAB2",
		eyes: "eyeA1 eyeA2", eyePos: [[100, 40], [105, 43]], 
		mouths: "mouthA1 mouthA2", mouthPos: [[100, 30], [105, 33]], 
		sadMouth: "mouthSadA"
	},
	bipedAC: {
		states: "bipedAC1 bipedAC2",
		eyes: "eyeC1 eyeC2", bigEyes: true, eyePos: [[80, 70], [83, 70]], 
		mouths: "mouthE1 mouthE2", bigMouth: true, mouthPos: [[80, 70], [83, 70]], 
		sadMouth: "mouthSadD"
	},
	bipedAD: {
		states: "bipedAD1 bipedAD2",
		eyes: "eyeF1 eyeF2", biggerEyes: true, eyePos: [[58, 80], [62, 80]], 
		mouths: "mouthF1 mouthF2", biggerMouth: true, mouthPos: [[65, 75], [69, 75]], 
		sadMouth: "mouthSadE"
	},
	bipedAE: {
		states: "bipedAE1 bipedAE2",
		eyes: "eyeG1 eyeG2", biggerEyes: true, eyePos: [[60, 60], [59, 64]], 
		mouths: "mouthG1 mouthG2", bigMouth: true, mouthPos: [[78, 65], [77, 69]], 
		sadMouth: "mouthSadC"
	},
	bipedBA: {
		states: "bipedBA1 bipedBA2",
		eyes: "eyeI1 eyeI2", biggerEyes: true, eyePos: [[70, 120], [70, 124]], 
		mouths: "mouthC1 mouthC2", bigMouth: true, mouthPos: [[88, 115], [87, 119]], 
		sadMouth: "mouthSadC"
	},
	bipedBB: {
		states: "bipedBB1 bipedBB2",
		eyes: "eyeH1 eyeH2", biggerEyes: true, eyePos: [[80, 90], [80, 88]], 
		mouths: "mouthC1 mouthC2", bigMouth: true, mouthPos: [[93, 95], [93, 92]], 
		sadMouth: "mouthSadC"
	},
	bipedBC: {
		states: "bipedBC1 bipedBC2",
		eyes: "eyeJ1 eyeJ2", bigEyes: true, eyePos: [[80, 120], [80, 118]], 
		mouths: "mouthH1 mouthH2", mouthPos: [[103, 115], [103, 112]], 
		sadMouth: "mouthSadF"
	},
	bipedBD: {
		states: "bipedBD1 bipedBD2",
		eyes: "eyeK1 eyeK2", biggerEyes: true, eyePos: [[65, 93], [65, 91]], 
		mouths: "mouthC1 mouthC2", bigMouth: true, mouthPos: [[83, 105], [83, 102]], 
		sadMouth: "mouthSadC"
	},
	bipedCA: {
		states: "bipedCA1 bipedCA2",
		eyes: "eyeL1 eyeL2", bigEyes: true, eyePos: [[72, 90], [76, 89]], 
		noMouth: true
	},
	bipedCB: {
		states: "bipedCB1 bipedCB2",
		eyes: "eyeM1 eyeM2", bigEyes: true, eyePos: [[77, 90], [78, 95]], 
		mouths: "mouthI1 mouthI2", mouthPos: [[92, 108], [92, 110]], 
		sadMouth: "mouthSadG"
	},
	water: {
		small: true, states: "water1 water2", evolveAge: 2, 
		eyes: "eyeA1 eyeA2", eyePos: [[12, 30], [13, 35]], 
		noMouth: true,
		evolutions: {
			any: {priority: 3, next: "waterA"},
			clean_high: {priority: 2, next: "waterB"}, // TODO: add any and clean_high
			fitness_high: {priority: 1, next: "waterC"}
		}
	},
	waterA: {
		states: "waterA1 waterA2", evolveAge: 10, 
		eyes: "eyeC1 eyeC2", bigEyes: true, eyePos: [[70, 100], [73, 105]], 
		mouths: "mouthJ1 mouthJ2", biggerMouth: true, mouthPos: [[50, 100], [52, 105]], 
		sadMouth: "mouthSadH"/*,
		evolutions: {
			c_high: {priority: 3, next: "waterAA"},
			fitness_low: {priority: 1, next: "waterAB"}, 
			health_high: {priority: 4, next: "waterAC"},
			o_high: {priority: 2, next: "waterAD"}
		}*/
	},
	waterB: {
		states: "waterB1 waterB2", evolveAge: 10, 
		eyes: "eyeN1 eyeN2", smallEyes: true, eyePos: [[70, 110], [68, 104]], 
		mouths: "mouthK1 mouthK2", smallMouth: true, mouthPos: [[40, 110], [42, 106]], 
		sadMouth: "mouthSadI"/*,
		evolutions: {
			hunger_low: {priority: 2, next: "waterBA"},
			clean_high: {priority: 3, next: "waterBB"}, 
			mood_low: {priority: 1, next: "waterBC"}
		}*/
	},
	waterC: {
		small: true, states: "waterC1 waterC2", evolveAge: 10, 
		eyes: "eyeO1 eyeO2", eyePos: [[32, 25], [27, 23]], 
		mouths: "mouthL1 mouthL2", mouthPos: [[30, 12], [26, 10]], 
		sadMouth: "mouthSadJ"/*,
		evolutions: {
			hunger_low: {priority: 2, next: "waterBA"},
			clean_high: {priority: 3, next: "waterBB"}, 
			mood_low: {priority: 1, next: "waterBC"}
		}*/
	}
};
game.isPetUpset = function() { return pet.sick || pet.mood < 3 || pet.hunger < 3 || pet.health < 3; }
game.handleAilmentDisplay = function() {
	if(pet.sick) {
		$("#ailment").removeClass("hungy").addClass("sick").show();
	} else if(pet.hunger < 3) {
		$("#ailment").removeClass("sick").addClass("hungy").show();
	} else {
		$("#ailment").hide();
	}
}
game.shit = function() {
	if(pet.shat) { return; }
	pet.shat = true;
	pet.timeShat = new Date();
	$("#shit").show();
};
game.cleanUpShit = function() {
	if(game.isInInterval) { return; }
	if(pet.shat) {
		pet.shat = false;
		$("#shit").hide();
	} else {
		game.petDecline();
		return false;
	}
};
game.addHunger = function(dH) { pet.hunger = clamp(pet.hunger + dH, 0, 15); };
game.petDecline = function() {
	game.intervalState = 0;
	game.isInInterval = true;
	game.intervalId = setInterval(function() {
		game.intervalState++;
		$("#monster").toggleClass("flip");
		if(game.intervalState > 5) {
			$("#food").hide();
			$("#monster").removeClass("flip");
			game.clearInterval();
		}
	}, 500);
};
game.takeABath = function() {
	if(game.isInInterval) { return; }
	if(pet.cleanliness >= 5) {
		game.petDecline();
		return;
	}
	$("#bathtub,#bathtoy").show().attr("class", "s1");
	$("#bathtoy").addClass(["duck", "sub", "boat", "whale"][Math.floor(Math.random() * 4)]);
	if(pet.mood < 8) { game.addMood(0.4); }
	pet.cleanliness += 3;
	game.addPersonality(0.15, "n");
	pet.cleanCount++;
	game.intervalState = 0;
	game.isInInterval = true;
	game.intervalId = setTimeout(function() {
		$("#bathtub,#bathtoy").hide();
		game.clearInterval();
	}, 4500);
};
game.addFitness = function(dF) { pet.fitness = clamp(pet.fitness + dF, 0, 10) };
game.addMood = function(dM) { pet.mood = clamp(pet.mood + dM, 0, 10) };
game.addPersonality = function(dP, p) { 
	console.log(pet.personality[p]);
	pet.personality[p] = clamp(pet.personality[p] + dP, 0, 10);
	console.log(pet.personality[p]);
};
game.needsMedicine = function() { return pet.sick; }
game.giveMedicine = function() { pet.sick = false; pet.health = Math.min(pet.health + 3, 10); }
game.giveFood = function(id) {
	if(id == "pill") {
		game.giveMedicine();
		return;
	}
	var food = foodData[id];
	game.addHunger(food.filling);
	game.addFitness(food.fitness);
	game.addMood(food.mood);
	if(food.o !== undefined) { game.addPersonality(food.o, "o"); }
	if(food.c !== undefined) { game.addPersonality(food.c, "c"); }
	if(food.e !== undefined) { game.addPersonality(food.e, "e"); }
	if(food.a !== undefined) { game.addPersonality(food.a, "a"); }
	if(food.n !== undefined) { game.addPersonality(food.n, "n"); }
};
game.doAging = function() {
	var today = new Date(), birthday = new Date(pet.birthday);
	pet.age = Math.floor((today - birthday)/86400000);
}
game.getEvolution = function() {
	if(petTypes[pet.type].evolveAge === undefined || petTypes[pet.type].evolveAge > pet.age) { return false; }
	var options = [];
	if((pet.sickCount / pet.age) > 0.5) { options.push("sick_often"); }
	if((pet.cleanCount / pet.age) >= 1) { options.push("clean_often"); }
	if(pet.fitness >= 8) { options.push("fitness_high"); } else if(pet.fitness < 3) { options.push("fitness_low"); }
	if(pet.mood >= 8) { options.push("mood_high"); } else if(pet.mood < 3) { options.push("mood_low"); }
	if(pet.health >= 8) { options.push("health_high"); } else if(pet.health < 3) { options.push("health_low"); }
	if(pet.hunger >= 8) { options.push("hunger_high"); } else if(pet.hunger < 3) { options.push("hunger_low"); }
	if(pet.personality.o >= 8) { options.push("o_high"); } else if(pet.personality.o < 3) { options.push("o_low"); }
	if(pet.personality.c >= 8) { options.push("c_high"); } else if(pet.personality.c < 3) { options.push("c_low"); }
	if(pet.personality.e >= 8) { options.push("e_high"); } else if(pet.personality.e < 3) { options.push("e_low"); }
	if(pet.personality.a >= 8) { options.push("a_high"); } else if(pet.personality.a < 3) { options.push("a_low"); }
	if(pet.personality.n >= 8) { options.push("n_high"); } else if(pet.personality.n < 3) { options.push("n_low"); }
	var available = petTypes[pet.type].evolutions;
	var matching = [];
	for(var i = 0; i < options.length; i++) {
		if(available[options[i]] === undefined) { continue; }
		matching.push(available[options[i]]);
	}
	if(matching.length == 0) { return false; }
	if(matching.length >= 1) { matching.sort(function(a, b) { return a.priority - b.priority; }); }
	return matching[0].next;
};
game.evolvePet = function() {
	var evolution = game.getEvolution();
	if(!evolution) { return; }
	pet.stage++;
	pet.type = evolution;
	game.setUpPet();
	game.save();
};
function clamp(num, min, max) { return num <= min ? min : num >= max ? max : num; }