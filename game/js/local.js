var Local = function(socket) {
	// 游戏对象
	var game;
	// 时间间隔 250ms
	var INTERVAL = 250;
	// 定时器 100ms 触发一次
	var timer = null;
	// 计时器
	var timeCount = 0;
	// 时间
	var time = 0;
	// 绑定键盘事件
	var bindKeyEvent = function() {
		document.onkeydown = function(e) {
			if (e.keyCode == 38) { // up
				game.rotate();
				socket.emit('rotate');
			} else if (e.keyCode == 37) { // left
				game.left();
				socket.emit('left');
			} else if (e.keyCode == 40) { // down
				game.down();
				socket.emit('down');
			} else if (e.keyCode == 39) { // right
				game.right();
				socket.emit('right');
			} else if (e.keyCode == 32) { // space
				game.full();
				socket.emit('full');
			}
		}
	}
	// 移动
	var move = function() {
		if (!game.down()) {
			game.fixed();
			socket.emit('fixed');
			if (game.checkGameOver()) {
				stop();
				game.setResult(false);
				socket.emit('gameover');
			} else {
				var line = game.checkClearLine();
				if (line > 0) {
					socket.emit('clearLine');
					game.addScore(line);
					socket.emit('addScore', line);
					if (line >= 2) {
						var lines = ganerateBottomLine(1);
						socket.emit('addBottomLines', lines)
					}
				}
				var nextType = ganerateType();
				var nextDir = ganerateDir();
				game.performNext(nextType, nextDir);
				socket.emit('next', {type: nextType, dir: nextDir});
			}
		} else {
			socket.emit('down');
		}
		timeCount = timeCount + 1;
		if (timeCount == 4) {
			timeCount = 0;
			time = time + 1;
			game.setTime(time);
			socket.emit('time', time);
		}
	}
	// 生成下一个方块
	var ganerateType = function() {
		return Math.ceil(Math.random() * 7) - 1;
	}
	// 随机生成方块方向
	var ganerateDir = function() {
		return Math.ceil(Math.random() * 4) - 1;
	}
	// 随机生成干扰行
	var ganerateBottomLine = function(num) {
		var lines = [];
		for(var i = 0; i < num; i++) {
			var line = [];
			for(var j = 0; j < 10; j++) {
				line.push(Math.ceil(Math.random() * 2) - 1);
			}
			lines.push(line);
		}
		return lines;
	}
	// 开始
	var start = function() {
		var doms = {
			gameDiv: document.getElementById('local_game'),
			nextDiv: document.getElementById('local_next'),
			timeDiv: document.getElementById('local_time'),
			scoreDiv: document.getElementById('local_score'),
			resultDiv: document.getElementById('local_result')
		}
		game = new Game();
		reset();
		var initType = ganerateType();
		var initDir = ganerateDir();
		game.init(doms, initType, initDir);
		socket.emit('init', {type: initType, dir: initDir});
		var nextType = ganerateType();
		var nextDir = ganerateDir();
		game.performNext(nextType, nextDir);
		socket.emit('next', {type: nextType, dir: nextDir});
		bindKeyEvent();
		timer = setInterval(move, INTERVAL);

		var prepareBtn = document.getElementById('prepareBtn');
		prepareBtn.style.display = 'none';
	}
	// 结束
	var stop = function() {
		if (timer) {
			clearTimeout(timer)
			timer = null;
		}
		document.onkeydown = null;

		var prepareBtn = document.getElementById('prepareBtn');
		prepareBtn.style.display = 'block';
		prepareBtn.innerHTML = '再来一局';
	}
	// 重置数据
	var reset = function() {
		timeCount = 0;
		time = 0;
		document.getElementById('local_time').innerHTML = 0;
		document.getElementById('local_score').innerHTML = 0;
	}

	socket.on('start', function() {
		start();
		document.getElementById('waiting').innerHTML = " ";
	})
	socket.on('addBottomLines', function(lines) {
		game.setBottomLines(lines);
		socket.emit('addRemoteBottomLines', lines);
	})
	socket.on('gameover', function() {
		stop();
		game.setResult(true);
	})
	socket.on('leave', function() {
		stop();
		game.setResult(true);
	})
}