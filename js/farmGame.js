var wateringGame = {
	mode: 2, 
	modeTimerIdx: 0, modeCounter: 0, 
	totalMultiplier: 1,
	timerIdx: 0,
	count: function() {
		var count = 0;
		for(var x = 0; x < 4; x++) {
			for(var y = 0; y < 6; y++) {
				if(wateringGame.board[y][x] != 0) {
					count++;
				}
			}
		}
		return count;
	}, 
	gameOver: function(t) {
		$(".gameOverTap").show();
		game.addMood(0.5);
		game.addPersonality(wateringGame.score / 250000, "o");
		game.addPersonality(-wateringGame.score / 250000, "n");
		if(wateringGame.score >= 100000) {
			game.addPersonality(-0.01, "n");
		} else if(wateringGame.score >= 10000) {
			game.addPersonality(-0.005, "n");
		}else if(wateringGame.score >= 5000) {
			game.addPersonality(-0.001, "n");
		}
		$("#cropGameOver").text(t);
	},
	advanceTimer: function() {
		if(game.paused) { return; }
		wateringGame.timer += (wateringGame.mode == 1) ? 1 : -1;
		wateringGame.updateTimeDisplay();
		if(wateringGame.timer == 0) {
			clearInterval(wateringGame.timerIdx);
			wateringGame.gameOver("Game Over - Time's Up!");
		}
	},
	updateTimeDisplay: function() {
		var minutes = Math.floor(wateringGame.timer / 60);
		var seconds = wateringGame.timer - (minutes * 60);
		$("#cropTimer").text(minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
	},
	handleMode1: function() {
		wateringGame.modeCounter += 5;
		if(wateringGame.modeCounter > wateringGame.gameSpeed && Math.random() > 0.6) {
			wateringGame.modeCounter = 0;
			if(wateringGame.addNewToField()) {
				wateringGame.settleBoard();
				wateringGame.drawBoard();
			} else {
				wateringGame.gameOver("Game Over - You Shouldn't See This One");
				clearInterval(wateringGame.modeTimerIdx);
				clearInterval(wateringGame.timerIdx);
			}
		}
	},
	start: function() {
		if(pet.intros.watering) {
			$("#waterInstructions").show();
			game.paused = true;
		}
		$("#mainGame,#menuBtn,.gameOverTap").hide();
		$("#cropGame,#pauseBtn").show();
		wateringGame.board = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
		wateringGame.gameSpeed = 250;
		wateringGame.locked = false;
		wateringGame.score = 0;
		$("#cropScore").text("0");
		if(wateringGame.mode == 1) {
			wateringGame.timer = 0;
			wateringGame.modeTimerIdx = setInterval(wateringGame.handleMode1, 50);
			$("#cropTimer").text("0:00");			
		} else {
			wateringGame.timer = 60;
			$("#cropTimer").text("1:00");
		}
		wateringGame.timerIdx = setInterval(wateringGame.advanceTimer, 1000);
		var randomRange = (wateringGame.mode == 1) ? 0.2 : 1;
		var minRequired = (wateringGame.mode == 1) ? 6 : 24;
		while(wateringGame.count() < minRequired) {
			randomRange += 0.1;
			for(var x = 0; x < 4; x++) {
				for(var y = 5; y >= 0; y--) {
					if(wateringGame.board[y][x] == 0 && Math.random() < randomRange) {
						wateringGame.board[y][x] = wateringGame.getCrop();
					}
				}
			}	
		}
		$(document).off("click", ".crop");
		$(document).on("click", ".crop", function() {
			if(wateringGame.locked) { return; }
			var $parent = $(this).parent();
			var x = parseInt($parent.attr("data-x"));
			var y = parseInt($parent.attr("data-y"));
			var tile = wateringGame.board[y][x];
			if(tile.stage == tile.finalStage && tile.type != "pumpkin") { return; }
			wateringGame.locked = true;
			var type = tile.type;
			wateringGame.grow(x, y, true, type);
			wateringGame.grow(x - 1, y, false, type);
			wateringGame.grow(x + 1, y, false, type);
			wateringGame.grow(x, y + 1, false, type);
			wateringGame.grow(x, y - 1, false, type, true);
			wateringGame.totalMultiplier = 1;
			setTimeout(wateringGame.attemptFinishTurn, wateringGame.gameSpeed);
		});
		wateringGame.settleBoard();
		wateringGame.drawBoard();
	},
	addNewToField: function() {
		var vals = [0, 1, 2, 3];
		while(vals.length > 0) {
			var idx = Math.floor(Math.random() * vals.length);
			var x = vals[idx];
			if(wateringGame.board[0][x] == 0) {
				wateringGame.board[0][x] = wateringGame.getCrop();
				return true;
			}
			vals.splice(idx, 1);
		}
		return false;
	},
	attemptFinishTurn: function() {
		var didChange = wateringGame.settleBoard();
		wateringGame.drawBoard();
		if(didChange) {
			setTimeout(wateringGame.findPairs, wateringGame.gameSpeed / 2);
		} else {
			wateringGame.findPairs();
		}
	},
	findPossibilities: function() {
		var pairPairs = [];
		for(var x = 0; x < 4; x++) {
			for(var y = 0; y < 6; y++) {
				var tile = wateringGame.board[y][x];
				if(tile.type == "pumpkin") { return; }
				var pairs = wateringGame.getNeighbors(tile.type, x, y, [], true);
				if(pairs.length >= 2) { pairPairs.push(pairs); }
			}
		}
		if(pairPairs.length == 0) {
			clearInterval(wateringGame.timerIdx);
			wateringGame.gameOver("Game Over - No More Options");
		}
	},
	findPairs: function() {
		var pairPairs = [];
		for(var x = 0; x < 4; x++) {
			for(var y = 0; y < 6; y++) {
				var tile = wateringGame.board[y][x];
				if(tile.stage != tile.finalStage) { continue; }
				var pairs = wateringGame.getNeighbors(tile.type, x, y, []);
				if(pairs.length >= 2) { pairPairs.push(pairs); }
			}
		}
		if(pairPairs.length == 0) {
			if(wateringGame.mode == 2) {
				var addMore = wateringGame.addNewToField();
				wateringGame.settleBoard();
				while(addMore) { 
					addMore = wateringGame.addNewToField();
					wateringGame.settleBoard();
				}
				wateringGame.drawBoard();
				wateringGame.findPossibilities();
			}
			wateringGame.locked = false;
			return;
		}
		var carrotPercentage = 0, strawberryPercentage = 0;
		for(var i = 0; i < pairPairs.length; i++) {
			var pair = pairPairs[i];
			var score = 0, multiplier = 1;
			for(var j = 0; j < pair.length; j++) {
				var val = pair[j];
				var x = Math.floor(val/10);
				var y = val - (x * 10);
				var tile = wateringGame.board[y][x];
				if(tile != 0) {
					if(tile.type == "carrot") { carrotPercentage += 0.22; }
					if(tile.type == "strawberry") { strawberryPercentage += 0.08; }
					if(tile.type == "pumpkin") { game.addPersonality(0.03, "c"); }
					if(score == 0) { 
						score = tile.score;
					} else {
						score *= multiplier;
						multiplier *= 2;
					}
					wateringGame.board[y][x] = 0;
				}
			}
			var finalScore = Math.floor(wateringGame.totalMultiplier * score);
			if(finalScore > 0) {
				wateringGame.score += finalScore;
				wateringGame.timer += Math.min(180, Math.floor(finalScore / 100));
			}
		}
		if(Math.random() < carrotPercentage) { pet.foods.carrot++; }
		if(Math.random() < strawberryPercentage) { pet.foods.gwapes++; }
		wateringGame.updateTimeDisplay();
		$("#cropScore").text(wateringGame.score);
		wateringGame.drawBoard();
		wateringGame.totalMultiplier += 0.25;
		setTimeout(wateringGame.attemptFinishTurn, wateringGame.gameSpeed);
	},
	getNeighbors: function(type, x, y, existing, ignoreStage) {
		existing = wateringGame.addMatch(type, x - 1, y, existing, ignoreStage);
		existing = wateringGame.addMatch(type, x + 1, y, existing, ignoreStage);
		existing = wateringGame.addMatch(type, x, y - 1, existing, ignoreStage);
		existing = wateringGame.addMatch(type, x, y + 1, existing, ignoreStage);
		return existing;
	},
	addMatch: function(type, x, y, existing, ignoreStage) {
		if(y >= 6 || y < 0 || x >= 4 || x < 0) { return existing; }
		var baby = wateringGame.board[y][x];
		if(baby == 0 || baby == null || baby == undefined) { return existing; }
		var val = x * 10 + y;
		var stageMatch = ignoreStage || baby.stage == baby.finalStage;
		if(baby.type == type && stageMatch && existing.indexOf(val) < 0) {
			existing.push(val);
			existing = wateringGame.getNeighbors(type, x, y, existing, ignoreStage);
		}
		return existing;
	},
	grow: function(x, y, toMax, type, noChild) {
		var $crop = $("#crop" + x + "_" + y);
		if(!$crop.length) { return; }
		var tile = wateringGame.board[y][x];
		if(tile == 0) {
			if(noChild) { return; }
			tile = {type: type, stage: 0, finalStage: wateringGame.getFinalStage(type), score: wateringGame.getPlantScore(type)};
		} else {
			if(tile.type == "pumpkin") {
				if(tile.stage == 2) {
					tile.stage = 3;
				} else if(tile.stage == 3) {
					if(toMax) { tile = 0; }
				} else {
					tile.stage = toMax ? tile.finalStage : Math.min(tile.finalStage, tile.stage + 1);
				}
			} else {
				tile.stage = toMax ? tile.finalStage : Math.min(tile.finalStage, tile.stage + 1);
			}
		}
		$crop.empty();
		wateringGame.board[y][x] = tile;
		wateringGame.addCrop($crop, tile);
	},
	addCrop: function($crop, tile) {
		var name = tile.type + "_" + tile.stage;
		$crop.append("<div data-type='" + tile.type + "' data-stage='" + tile.stage + "' class='crop sprite c_" + name + "'></div>");
	},
	getPlantScore: function(type) {
		if(type == "pumpkin") { return 2000; }
		if(type == "corn") { return 150; }
		if(type == "carrot") { return 75; }
		return 100;
	},
	getFinalStage: function(type) { 
		if(type == "corn") { return 3; }
		if(type == "carrot") { return 1; }
		return 2;
	},
	drawBoard: function() {
		for(var x = 0; x < 4; x++) {
			for(var y = 0; y < 6; y++) {
				var $crop = $("#crop" + x + "_" + y);
				$crop.empty();
				var tile = wateringGame.board[y][x];
				if(tile != 0) { wateringGame.addCrop($crop, tile); }
			}
		}
	},
	getCrop: function() {
		var r = Math.random();
		if(r <= 0.28) { return {type: "eggplant", stage: 0, finalStage: 2, score: 100}; }
		if(r <= 0.56) { return {type: "strawberry", stage: 0, finalStage: 2, score: 100}; }
		if(r <= 0.84) { return {type: "cucumber", stage: 0, finalStage: 2, score: 100}; }
		if(r <= 0.91) { return {type: "carrot", stage: 0, finalStage: 1, score: 75}; }
		if(r <= 0.97) { return {type: "corn", stage: 0, finalStage: 3, score: 150}; }
		return {type: "pumpkin", stage: 0, finalStage: 2, score: 2000};
	},
	settleBoard: function() {
		var numChanges = 0;
		for(var i = 0; i < 3; i++) { // why optimize when it's a loop this tiny? even if it is O(n^2) three times? DO IT LATER		
			for(var x = 0; x < 4; x++) {
				for(var y = 4; y >= 0; y--) {
					if(wateringGame.board[y + 1][x] == 0) {
						numChanges++;
						for(var dy = y; dy >= 0; dy--) {
							wateringGame.board[dy + 1][x] = wateringGame.board[dy][x];
						}
						wateringGame.board[0][x] = 0;
					}
				}
			}
		}
		return (numChanges > 0);
	}
};