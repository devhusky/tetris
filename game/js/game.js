var Game = function() {
	// dom元素
	var gameDiv;
	var nextDiv;
	var timeDiv;
	var scoreDiv;
	var resultDiv;
	// 游戏矩阵
	var gameData = [
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	];
	// 当前方块
	var cur;
	// 下一个方块
	var next;
	// 分数
	var score = 0;

	// divs
	var nextDivs = [];
	var gameDivs = [];
	// 初始化div
	var initDiv = function(data, divs, container) {
		for (var i = 0; i < data.length; i++) {
			var div = [];
			for (var j = 0; j < data[i].length; j++) {
				var newNode = document.createElement('div')
				newNode.className = 'none';
				newNode.style.top = (i*20) + 'px';
				newNode.style.left = (j*20) + 'px';
				container.appendChild(newNode);
				div.push(newNode);
			}
			divs.push(div)
		}
	}
	// 刷新div
	var refreshDiv = function(data, divs) {
		for (var i = 0; i < data.length; i++) {
			for (var j = 0; j < data[i].length; j++) {
				if (data[i][j] == 0) {
					divs[i][j].className = 'none';
				} else if (data[i][j] == 1) {
					divs[i][j].className = 'done';
				} else if (data[i][j] == 2) {
					divs[i][j].className = 'current';
				} 
			}
		}
	}
	// 清除数据
	var clearData = function() {
		for (var i = 0; i < cur.data.length; i++) {
			for (var j = 0; j < cur.data[0].length; j++) {
				if (check(cur.origin, i, j)) {
					if (cur.data[i][j] != 0) {
						gameData[i + cur.origin.x][j + cur.origin.y] = 0;
					}
				}
			}
		}
	}
	// 设置数据
	var setData = function() {
		for (var i = 0; i < cur.data.length; i++) {
			for (var j = 0; j < cur.data[0].length; j++) {
				if (check(cur.origin, i, j)) {
					if (cur.data[i][j] != 0) {
						gameData[i + cur.origin.x][j + cur.origin.y] = cur.data[i][j];
					}
				}
			}
		}
	}
	// 校验
	var check = function(p, x, y) {
		if (p.x + x < 0) {
			return false;
		} else if (p.x + x >= gameData.length) {
			return false;
		} else if (p.y + y < 0) {
			return false;
		} else if (p.y + y >= gameData[0].length) {
			return false;
		} else if (gameData[p.x + x][p.y + y] == 1) {
			return false;
		} else {
			return true;
		}
	}
	// 检测方块数据是否合法
	var isValid = function(p, data) {
		for (var i = 0; i < data.length; i++) {
			for (var j = 0; j < data[i].length; j++) {
				if (data[i][j] != 0) {
					if (!check(p, i, j)) {
						return false;
					}
				}
			}
		}
		return true;
	}
	// 方向控制
	// 下移
	var down = function() {
		if (cur.canDown(isValid)) {
			clearData();
			cur.down();	
			setData();
			refreshDiv(gameData, gameDivs)
			return true;
		}
		return false;
	}
	// 左移
	var left = function() {
		if (cur.canLeft(isValid)) {
			clearData();
			cur.left();	
			setData();
			refreshDiv(gameData, gameDivs)
		}
	}
	// 右移
	var right = function() {
		if (cur.canRight(isValid)) {
			clearData();
			cur.right();	
			setData();
			refreshDiv(gameData, gameDivs)
		}
	}
	// 旋转
	var rotate = function() {
		if (cur.canRotate(isValid)) {
			clearData();
			cur.rotate(1);	
			setData();
			refreshDiv(gameData, gameDivs)
		}
	}
	// 坠落
	var full = function() {
		while(down()) {}
	}
	// 固定方块
	var fixed = function() {
		for (var i = 0; i < cur.data.length; i++) {
			for (var j = 0; j < cur.data[i].length; j++) {
				if (check(cur.origin, i, j)) {
					if (gameData[i + cur.origin.x][j + cur.origin.y] == 2) {
						gameData[i + cur.origin.x][j + cur.origin.y] = 1;
					}
				}
			}
		}
		refreshDiv(gameData, gameDivs)
	}
	// 生成下一个方块
	var performNext = function(type, dir) {
		cur = next;
		next = SquareFactory.prototype.make(type, dir);
		setData();
		refreshDiv(gameData, gameDivs)
		refreshDiv(next.data, nextDivs)
	}
	// 判断消除行
	var checkClearLine = function() {
		var line = 0;
		for (var i = gameData.length - 1; i > 0; i--) {
			var clear = true;
			for (var j = 0; j < gameData[i].length; j++) {
				if (gameData[i][j] == 0) {
					clear = false;
					break;
				}
			}
			if (clear) {
				line = line + 1;
				for (var m = i; m > 0; m--) {
					gameData[m] = gameData[m - 1];
					gameData[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
				}
				i++;
			}
		}
		return line;
	}
	// 游戏结束判断
	var checkGameOver = function() {
		var gameOver = false;
		for (var i = 0; i < gameData[0].length; i++) {
			if (gameData[0][i] != 0) {
				gameOver = true;
			}
		}
		return gameOver;
	}
	// 设置游戏时间
	var setTime = function(time) {
		timeDiv.innerHTML = time;
	}
	// 设置分数
	var addScore = function(line) {
		var s = 0;
		switch(line) {
		case 1:
			s = 10;
			break;
		case 2:
			s = 20;
			break;
		case 3:
			s = 40;
			break;
		case 4:
			s = 60;
			break;
		default:
			break;
		}
		score = score + s;
		scoreDiv.innerHTML = score;
	}
	// 设置结果
	var setResult = function(win) {
		if (win) {
			resultDiv.innerHTML = "你赢了";
		} else {
			resultDiv.innerHTML = "你输了";
		}
	}
	// 设置干扰行
	var setBottomLines = function(lines) {
		for (var i = 0; i < lines.length; i++) {
			for (var j = 0; j < gameData.length ; j++) {
				if (j == gameData.length - 1) {
					gameData[j] = lines[i];
				} else {
					gameData[j] = gameData[j + 1];
				}
			}
			cur.origin.x = cur.origin.x - 1;
			if (cur.origin.x == 0) {
				cur.origin.x = 0;
			}
		}
		refreshDiv(gameData, gameDivs);
	}
	// 初始化
	var init = function(doms, type, dir) {
		gameDiv = doms.gameDiv;
		nextDiv = doms.nextDiv;
		timeDiv = doms.timeDiv;
		scoreDiv = doms.scoreDiv;
		resultDiv = doms.resultDiv;
		next = SquareFactory.prototype.make(type, dir);
		initDiv(gameData, gameDivs, gameDiv);
		initDiv(next.data, nextDivs, nextDiv);
		// setData();
		// refreshDiv(gameData, gameDivs)
		refreshDiv(next.data, nextDivs)
	}
	// 导出api
	this.init = init;
	this.down = down;
	this.left = left;
	this.right = right;
	this.rotate = rotate;
	this.full = full;
	this.fixed = fixed;
	this.performNext = performNext;
	this.checkGameOver = checkGameOver;
	this.checkClearLine = checkClearLine;
	this.setTime = setTime;
	this.addScore = addScore;
	this.setResult = setResult;
	this.setBottomLines = setBottomLines;
}