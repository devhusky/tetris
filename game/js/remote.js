var Remote = function(socket) {
	// 游戏对象
	var game;

	socket.on('init', function(data) {
		var doms = {
			gameDiv: document.getElementById('remote_game'),
			nextDiv: document.getElementById('remote_next'),
			timeDiv: document.getElementById('remote_time'),
			scoreDiv: document.getElementById('remote_score'),
			resultDiv: document.getElementById('remote_result')
		}
		reset();
		game = new Game();
		game.init(doms, data.type, data.dir);
	})
	// 重置数据
	var reset = function() {
		game = null;
		document.getElementById('remote_time').innerHTML = 0;
		document.getElementById('remote_score').innerHTML = 0;
	}


	socket.on('next', function(data) {
		game.performNext(data.type, data.dir);
	})
	socket.on('rotate', function() {
		game.rotate();
	})
	socket.on('left', function() {
		game.left();
	})
	socket.on('down', function() {
		game.down();
	})
	socket.on('right', function() {
		game.right();
	})
	socket.on('full', function() {
		game.full();
	})
	socket.on('fixed', function() {
		game.fixed();
	})
	socket.on('clearLine', function() {
		game.checkClearLine();
	})
	socket.on('time', function(time) {
		game.setTime(time);
	})
	socket.on('addScore', function(line) {
		game.addScore(line);
	})
	socket.on('addRemoteBottomLines', function(lines) {
		game.setBottomLines(lines);
	})
	socket.on('gameover', function() {
		game.setResult(true);
	})
}