var footTennis = {
	isMouseDown: false, mousePower: 0,
	mouseStartX: 0, mouseStartY: 0, 
	timerIdx: 0,
	start: function() {
		$(".targ").remove();
		if(pet.intros.sports) {
			$("#sportsInstructions").show();
			game.paused = true;
		}
		footTennis.numBalls = 20;
		footTennis.timer = 3000;
		footTennis.score = 0;
		$("#footBalls").text(footTennis.numBalls);
		$("#footScore").text(footTennis.score);
		footTennis.timerIdx = setInterval(footTennis.advanceTimer, 10);
		$("#mainGame,#menuBtn,.gameOverTap").hide();
		$("#footGame,#pauseBtn").show();
		$("#innerReticule").off("vmousedown").on("vmousedown", function(e) {
			footTennis.isMouseDown = true;
			footTennis.mousePower = 0;
			footTennis.mouseStartX = e.clientX;
			footTennis.mouseStartY = e.clientY;
		});
		$("#aimReticule, #innerReticule").off("vmousemove").on("vmousemove", function(e) {
			if(!footTennis.isMouseDown) { return false; }
			var dX = e.clientX - footTennis.mouseStartX;
			var dY = e.clientY - footTennis.mouseStartY;
			var d = Math.sqrt(dX * dX + dY * dY);
			if(d < 10) {
				$("#aimReticule").attr("class", "reticuleNormal");
				footTennis.mousePower = 0;
			} else {
				footTennis.mousePower = Math.min(Math.floor(d / 2), 100);
				if(dY >= -10) {
					if(dX < -10) {
						$("#aimReticule").attr("class", "reticuleLeft");
					} else if(dX > 10) {
						$("#aimReticule").attr("class", "reticuleRight");
					} else {
						$("#aimReticule").attr("class", "reticuleNormal");
					}
				} else {
					if(dX < -100) {
						$("#aimReticule").attr("class", "reticuleULeft");
					} else if(dX > 100) {
						$("#aimReticule").attr("class", "reticuleURight");
					} else {
						$("#aimReticule").attr("class", "reticuleCenter");
					}
				}
			}
			$("#innerFill").css("top", (100 - footTennis.mousePower) + "%");
			return false;
		});
		$("#aimReticule").off("vmouseup").on("vmouseup", function(e) {
			if(!footTennis.isMouseDown) { return; }
			$("#aimReticule").attr("class", "reticuleNormal");
			$("#innerFill").css("top", "100%");
			footTennis.isMouseDown = false;
			var dX = e.clientX - footTennis.mouseStartX;
			var dY = e.clientY - footTennis.mouseStartY;
			var angle = Math.atan2(-dY, -dX) - Math.PI/2;
			var d = Math.sqrt(dX * dX + dY * dY);
			if(footTennis.numBalls == 0 || $(".ball").length > 3) { return; }
			if(d < 10 || footTennis.mousePower == 0) { return; }
			footTennis.numBalls--;
			$("#footBalls").text(footTennis.numBalls);
			var ballHTML = "<div class='sprite ball' data-angle='" + angle + "' data-power='" + (footTennis.mousePower / 35) + "' data-y='10' data-x='50' style='left:50%; bottom:10%; transform:rotate(" + Math.floor(Math.random() * 360) + "deg)'></div>";
			$("#footGame").append(ballHTML);
		});
	},
	handleCollisions: function() {
		$(".ball").each(function() {
			var rect1a = this.getBoundingClientRect();
			var rect1 = {
				left: rect1a.left + 90, right: rect1a.right - 45,
				top: rect1a.top + 90, bottom: rect1a.bottom - 45
			}
			var me = $(this);
			$(".targ").each(function() {
				var rect2a = this.getBoundingClientRect();
				var rect2 = {
					left: rect2a.left + 90, right: rect2a.right - 45,
					top: rect2a.top + 90, bottom: rect2a.bottom - 45
				}
				var overlap = !(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom);
				if(!overlap) { return; }
				me.remove();
				var mult = parseFloat($(this).attr("data-mult"));
				var isGold = $(this).hasClass("Gtarget");
				var add = 0;
				if(isGold) {
					footTennis.numBalls += 3;
					$("#footBalls").text(footTennis.numBalls);
					add = Math.floor(mult * 50);
				} else {
					add = Math.floor(mult * 10);
				}
				footTennis.score += add;
				footTennis.timer += add;
				footTennis.updateTimeDisplay();
				$("#footScore").text(footTennis.score);
				$(this).remove();
			});
		});
	}, 
	advanceTimer: function() {
		if(game.paused) { return; }
		footTennis.timer--;
		footTennis.updateTimeDisplay();
		if(footTennis.numBalls == 0 && $(".ball").length == 0) {
			clearInterval(footTennis.timerIdx);
			footTennis.gameOver("Game Over - Out of Balls!");
		} else if(footTennis.timer == 0) {
			clearInterval(footTennis.timerIdx);
			footTennis.gameOver("Game Over - Time Up!");
		} else {
			if(Math.random() < 0.05 && $(".targ").length < 5) { footTennis.createNewTarget(); }
			$(".targ").each(function() {
				var pos = parseFloat($(this).attr("data-pos"));
				var dir = parseFloat($(this).attr("data-dir"));
				pos += dir;
				$(this).attr("data-pos", pos);
				$(this).css("left", pos + "%");
				if(pos < 0 || pos > 100) { $(this).remove(); }
			});
			$(".ball").each(function() {
				var x = parseFloat($(this).attr("data-x"));
				var y = parseFloat($(this).attr("data-y"));
				if(x < 0 || x > 100 || y < 0 || y > 100) {
					$(this).remove();
					return;
				}
				var angle = parseFloat($(this).attr("data-angle"));
				var power = parseFloat($(this).attr("data-power"));
				x += power * Math.sin(angle);
				y += power * Math.cos(angle);
				$(this).css("left", x + "%");
				$(this).css("bottom", y + "%");
				$(this).attr("data-x", x);
				$(this).attr("data-y", y);
			});
			footTennis.handleCollisions();
		}
	},
	gameOver: function(t) {
		$(".gameOverTap").show();
		game.addMood(0.5);
		game.addFitness(footTennis.score / 1500);
		game.addPersonality(footTennis.score / 10000, "e");
		game.addPersonality(footTennis.score / 15000, "a");
		if(footTennis.score >= 1200) {
			game.addPersonality(-0.005, "n");
		} else if(footTennis.score >= 800) {
			game.addPersonality(-0.001, "n");
		}
		$("#footGameOver").text(t);
	},
	createNewTarget: function() {
		var row = Math.floor(Math.random() * 4);
		var mult = (4 - row) / 1.5;
		var dir = (Math.random() - 0.5) / 2;
		if(dir == 0) { dir = 1; }
		var gold = row < 2 && Math.random() > 0.75;
		if(gold) { 
			if(dir < 0.01 && dir > -0.01) { dir *= 100; }
			dir *= 3 + Math.random();
		}
		var targetHtml = "<div class='sprite targ " + (gold ? "Gtarget" : "target") + "' data-mult='" + mult + "' data-pos='" + (dir > 0 ? "0" : "100") + "' data-dir='" + dir + "'></div>";
		$("#tr" + row).append(targetHtml);
	},
	updateTimeDisplay: function() {
		var adjustedTimer = Math.floor(footTennis.timer / 100);
		var minutes = Math.floor(adjustedTimer / 60);
		var seconds = adjustedTimer - (minutes * 60);
		$("#footTimer").text(minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
	}
};