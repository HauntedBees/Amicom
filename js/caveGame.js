var caveGame = {
	start: function() {
		$("#mainGame,#menuBtn,.gameOverTap").hide();
		$("#caveGame,#pauseBtn").show();
		if(pet.intros.cave) {
			$("#caveInstructions").show();
			game.paused = true;
		}
		caveGame.lost = false;
		caveGame.floor = 1;
		caveGame.health = 3;
		caveGame.recreateMap();
		$("#dpad button").off("click").on("click", function() {
			var dx = parseInt($(this).attr("data-x")) || 0, dy = parseInt($(this).attr("data-y")) || 0;
			caveGame.movePlayer(dx, dy);
		});
		$(document).off("keydown").on("keydown", function(e) {
			switch(e.which) {
				case 37: caveGame.movePlayer(-1, 0); break;
				case 38: caveGame.movePlayer(0, -1); break;
				case 39: caveGame.movePlayer(1, 0); break;
				case 40: caveGame.movePlayer(0, 1); break;
			}
		});
	},
	gameOver: function() {
		caveGame.lost = true;
		$("#caveMessage").hide();
		$(".gameOverTap").show();
	}, 
	movePlayer: function(dx, dy) {
		if(caveGame.lost) { return; }
		var newx = clamp(caveGame.x + dx, 0, 4);
		var newy = clamp(caveGame.y + dy, 0, 6);
		var $cell = $("#cave" + newx + "_" + newy);
		if(caveGame.health <= 0) {
			caveGame.gameOver();
			return;
		}
		$(".caveSpooker").each(function() {
			var $cell = $(this).parent();
			var myX = parseInt($cell.attr("data-x"));
			var myY = parseInt($cell.attr("data-y"));
			var dx = newx - myX, dy = newy - myY;
			if(dx == 0 && dy == 0) { return; }
			if(dx == 0) {
				if(dy > 0) {
					myY++;
				} else {
					myY--;
				}
			} else if(dy == 0) {
				if(dx > 0) {
					myX++;
				} else {
					myX--;
				}
			} else if(Math.random() < 0.5) {
				if(dx > 0) {
					myX++;
				} else {
					myX--;
				}
			} else {
				if(dy > 0) {
					myY++;
				} else {
					myY--;
				}
			}
			var $myNewCell = $("#cave" + myX + "_" + myY);
			if(!$(".caveWall", $myNewCell).length) {
				$(this).detach().appendTo($myNewCell);
			}
		});
		var successfulMove = !$(".caveWall", $cell).length || caveGame.flying;
		var hideMessage = true;
		if(successfulMove) {
			if($(".caveStairs", $cell).length) {
				caveGame.floor++;
				game.addPersonality(caveGame.floor / 1500, "e");
				game.addPersonality(-caveGame.floor / 1550, "n");
				game.addPersonality(-0.001, "n");
				game.addMood(0.0165);
				game.addFitness(0.005);
				caveGame.recreateMap();
				return;
			}
			if($(".caveTreasure", $cell).length) {
				successfulMove = false;
				$(".caveTreasure", $cell).toggleClass("caveTreasure caveTreasureOpen");
				var message = "You found ";
				var val = Math.random();
				if(val < 0.1) {
					pet.foods.burgar++;
					message += "a hamburgar!";
				} else if(val < 0.2) {
					pet.foods.malk++;
					message += "a carton of malk!";
				} else if(val < 0.28) {
					$(".caveCell").removeClass("b0 b1 b2").addClass("b2").attr("data-brightness", 2);
					message += "a light switch!";
					if(caveGame.health < 3) { caveGame.health++; }
				} else if(val < 0.32) {
					caveGame.flying = true;
					message += "the power of flight! You can walk over walls on this floor now!";
				} else {
					message += caveGame.wackyTreasures[Math.floor(Math.random() * caveGame.wackyTreasures.length)] + "!";
				}
				caveGame.showMessage(message);
			} else if($(".caveTreasureF", $cell).length) {
				successfulMove = false;
				$(".caveTreasureF", $cell).toggleClass("caveTreasureF caveTreasureFOpen");
				caveGame.showMessage("You opened the treasure chest, but it was a trick! Yikes!");
				game.addPersonality(-0.08, "o");
				caveGame.health--;
				$("#caveHealth").text(caveGame.health + "/3");
			} else if($(".caveFriend", $cell).length) {
				var $friend = $(".caveFriend", $cell);
				if(!$friend.attr("data-spoken")) {
					$friend.attr("data-spoken", true);
					var friendMessages = null;
					if($friend.hasClass("caveFriendR")) {
						friendMessages = caveGame.friendRMessages;
					} else if($friend.hasClass("caveFriendG")) {
						friendMessages = caveGame.friendGMessages;
					} else {
						friendMessages = caveGame.friendBMessages;
					}
					caveGame.showMessage("\"" + friendMessages[Math.floor(Math.random() * friendMessages.length)] + "\"");
					hideMessage = false;
				}
			} else if($(".caveSpooker", $cell).length) {
				caveGame.showMessage("You were spooked by a monster! Eek!");
				caveGame.health--;
				$("#caveHealth").text(caveGame.health + "/3");
				$(".caveSpooker", $cell).remove();
				hideMessage = false;
			}
		}
		if(successfulMove) {
			if(hideMessage) { $("#caveMessage").hide(); }
			caveGame.x = newx;
			caveGame.y = newy;
		}
		caveGame.drawPlayer();
	},
	friendRMessages: ["I am red! Like fire!", "Do you like the color red? Ha ha!"],
	friendGMessages: ["I am green! Like grass!", "Did you know four leaf clovers are green? Regular clovers are, too, though, so, like, whatever."],
	friendBMessages: ["I am blue! Like the sky!", "I'm feeling pretty blue today..."],
	wackyTreasures: ["the meaning of friendship", "a cracked egg", "a spoon", "a half-eaten crepe", "toothpaste", "yourself", "a perfectly intact human rib cage", "a dusty hockey puck", "an empty treasure chest", 
					 "a copy of the classic puzzle game Blockara", "left-handed scissors", "moldy boxing gloves", "a frog with a protractor", "a kazoo. BWEEEEEEEEEET", "a cigar. BWEEEEEEEEEET! No, wait, it's a kazoo. Oops",
					 "a bee! A BEEEEE!!", "a duclimer", "a friendly ghost! Boo! Ha ha, just kidding", "an empty can of cat food", "a handful of barley", "a square peg", "a round hole", "a Taco Ring menu", "enlightenment", 
					 "a grapefruit rind", "a tube of MobileGurt, the Carry-whilst-Moving Yogurt", "a stepladder", "a ska mixtape", "French toast sticks", "a funny meme. LOL", "popcorn chicken and cupcakes", "your own dead body"],
	showMessage: function(m) { $("#caveMessage").text(m).show(); },
	wallStructures: [
		[ [1,1], [2,1], [3,1], [3,2], [1,4], [1,5], [2,5], [3,5] ],
		[ [2,2], [1,3], [2,3], [3,3], [2,4] ],
		[ [2,0], [0,3], [2,3], [2,4], [4,4], [6,3] ],
		[ [2,0], [2,1], [1,2], [3,4], [2,5], [2,6] ],
		[ [1,2], [2,2], [3,2], [1,4], [2,4], [3,4] ],
		[ [1,1], [3,1], [1,3], [3,3], [1,5], [3,5] ],
		[ [1,0], [3,0], [0,2], [4,2], [2,3], [0,4], [4,4], [1,5], [3,5] ],
		[  ],
		[ [2,1], [2,2], [1,4], [2,4], [3,4] ],
		[ [3,2], [3,3], [2,3], [1,3], [1,4] ],
		[ [2,1], [2,2], [2,3], [2,4], [2,5] ]
	],
	getWallStructure: function() { return caveGame.wallStructures[Math.floor(Math.random() * caveGame.wallStructures.length)]; },
	recreateMap: function() {
		caveGame.elements = [];
		caveGame.flying = false;
		$("#caveFloor").text(caveGame.floor + "F");
		$(".caveCell").empty().removeClass("b1 b2").addClass("b0").attr("data-brightness", 0);
		var inUseCoords = caveGame.getWallStructure();
		for(var i = 0; i < inUseCoords.length; i++) {
			var x = inUseCoords[i][0], y = inUseCoords[i][1];
			$("#cave" + x + "_" + y).append("<div class='sprite caveWall data-type='wall'></div>");
		};
		var playerCoords = caveGame.getRandomCoords(1);
		caveGame.x = playerCoords.x;
		caveGame.y = playerCoords.y;
		caveGame.drawPlayer();
		
		caveGame.createObject("Stairs");
		var numTreasures = Math.min(4, Math.floor(Math.random() * caveGame.floor));
		var numFakeTreasures = Math.floor(Math.random() * numTreasures);
		var numFriends = Math.min(2, Math.floor(Math.random() * Math.floor(caveGame.floor / 3)));
		var numEnemies = Math.min(4, Math.floor(Math.random() * Math.floor(caveGame.floor / 4)));
		for(var i = 0; i < numTreasures; i++) {
			caveGame.createObject("Treasure");
		}
		for(var i = 0; i < numFakeTreasures; i++) {
			caveGame.createObject("TreasureF");
		}
		for(var i = 0; i < numFriends; i++) {
			var type = Math.random();
			if(type < 0.33) {
				caveGame.createObject("FriendR caveFriend");
			} else if(type < 0.67) {
				caveGame.createObject("FriendG caveFriend");
			} else {
				caveGame.createObject("FriendB caveFriend");
			}
		}
		for(var i = 0; i < numEnemies; i++) {
			var type = Math.random();
			if(type < 0.5) {
				caveGame.createObject("Goast caveSpooker");
			} else {
				caveGame.createObject("Skell caveSpooker");
			}
		}
	},
	createObject: function(type) {
		var coords = caveGame.getRandomCoords(1);
		console.log(type + ": " + coords.x + "," + coords.y);
		var obj = {
			x: coords.x, y: coords.y,
			type: type
		};
		caveGame.elements.push(obj);
		$("#cave" + obj.x + "_" + obj.y).append("<div class='sprite cave" + type + "' data-type='" + type + "'></div>");
	},
	getRandomCoords: function(depth) {
		if(depth >= 4) {
			console.log("FAILED 4 TIMES, FUCK IT");
			for(var x = 0; x < 5; x++) {
				for(var y = 0; y < 7; y++) {
					if(!$("#cave" + x + "_" + y).children().length) {
						return {x: x, y: y};
					}
				}
			}
		}
		var c = {
			x: Math.floor(Math.random() * 5),
			y: Math.floor(Math.random() * 7)
		};
		if($("#cave" + c.x + "_" + c.y).children().length) {
			return caveGame.getRandomCoords(depth + 1);
		}
		return c;
	},
	drawPlayer: function() {
		$("#cavePlayer").remove();
		var cell = $("#cave" + caveGame.x + "_" + caveGame.y);
		cell.append("<div id='cavePlayer' class='sprite cave_" + pet.type + "'></div>");
		cell.removeClass("b0 b1 b2").addClass("b2").attr("data-brightness", 2);
		caveGame.brighten(caveGame.x - 1, caveGame.y);
		caveGame.brighten(caveGame.x + 1, caveGame.y);
		caveGame.brighten(caveGame.x, caveGame.y + 1);
		caveGame.brighten(caveGame.x, caveGame.y - 1);
	},
	brighten: function(x, y) {
		var cell = $("#cave" + x + "_" + y);
		if(!cell.length) { return; }
		var brightness = parseInt(cell.attr("data-brightness"));
		if(brightness == 2) { return; }
		brightness++;
		cell.removeClass("b0 b1").addClass("b" + brightness).attr("data-brightness", brightness);
	}
};