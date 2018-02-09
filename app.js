var url = require('url');
var server = require('http').createServer();
var io = require('socket.io')(server);

var PORT = process.env.PORT || 4399;
var socketMap = {};
var roomMap = {};

var bindListener = function(socket, event) {
	socket.on(event, function(data) {
		emitAnotherClient(socket, event, data);
	})
}

var emitAnotherClient = function(socket, event, data) {
	var curSocket = socketMap[socket.token];

	var room = roomMap[curSocket.roomName];
	if (room) {
		room.clients.forEach(function(client) {
			if (client.token != socket.token) {
				client.emit(event, data);
			}
		})
	}
}

var clientLeave = function(socket) {
	emitAnotherClient(socket, 'leave');

	var curSocket = socketMap[socket.token];
	var room = roomMap[curSocket.roomName];
	if (room) {
		var index = room.clients.indexOf(socket);
		if (index != -1) {
			room.clients.splice(index, 1);
		}
	}
	socketMap[socket.token] = null;

}

// middleware 获取token
io.use((socket, next) => {
	const token = socket.handshake.query.token;
	socket.token = token;
	next();
})

io.on('connection', function(socket) {
	socketMap[socket.token] = socket;

	bindListener(socket, 'init');
	bindListener(socket, 'next');
	bindListener(socket, 'rotate');
	bindListener(socket, 'left');
	bindListener(socket, 'down');
	bindListener(socket, 'right');
	bindListener(socket, 'full');
	bindListener(socket, 'fixed');
	bindListener(socket, 'time');
	bindListener(socket, 'clearLine');
	bindListener(socket, 'addScore');
	bindListener(socket, 'gameover');
	bindListener(socket, 'addBottomLines');
	bindListener(socket, 'addRemoteBottomLines');

	socket.on('disconnect', function() {
		
		clientLeave(socket);
	})
})

// 创建房间 & 进入房间 处理
server.on('request', function(req, res) {
	if (req.method.toLowerCase() === 'post') {
		bodyParse(req, function(body) {
			console.log(body);
			var roomName = body.roomName;
			var pathname = url.parse(req.url).pathname;

			var result = {};
			if (pathname === '/createRoom') { // 创建房间

				result = createRoom(body, roomName);
			} else if (pathname === '/joinRoom') { // 进入房间
				
				result = joinRoom(body, roomName);
			} else if (pathname === '/prepare') { // 准备

				result = prepare(body);
			}
			// 设置允许跨域访问
			// res.setHeader('Access-Control-Allow-Origin', "*");
			res.writeHead(200, 'OK', {'Access-Control-Allow-Origin': '*'});
			res.end(JSON.stringify(result));
		})
	}
})

var createRoom = function(body, roomName) {
	if (roomMap[roomName]) {

		return  {status: 1, msg: '该房号已存在'};
	} else {
		if (roomName) {
			var socket = socketMap[body.token];
			if (socket) {
				socket.roomName = roomName;
				socketMap[body.token] = socket;
			}
			
			var clients = [];
			clients.push(socket);
			roomMap[roomName] = {clients: clients};

			return {status: 0, msg: '创建房间成功'};
		} else {
			return {status: 1, msg: '房间号为空'};
		}
	}
}

var joinRoom = function(body, roomName) {
	if (roomMap[roomName]) { 
		var socket = socketMap[body.token];
		if (socket) {
			socket.roomName = roomName;
			socketMap[body.token] = socket;
		}

		var room = roomMap[roomName];

		if (room.clients.length == 2) {

			return {status: 1, msg: '房间人数已满'};
		} else {
			if (room.clients.indexOf(socket) == -1) { // 不存在
				room.clients.push(socket);
			}
			if (room.clients.length == 2) {

				room.clients.forEach(function(socket) {
					socket.emit('waiting', '>>>等待对方准备');
				})
				return {status: 0, msg: '等待对方准备'};
			} else {
				room.clients.forEach(function(socket) {
					socket.emit('waiting', '>>>等待对方进入');
				})
				return {status: 0, msg: '等待对方进入'};
			}
		}
	} else {
		return {status: 1, msg: '该房号不存在'};
	}
}

var prepare = function(body) {
	var socket = socketMap[body.token];
	socket.prepare = 1;
	socketMap[body.token] = socket;

	var roomName = socket.roomName;
	var room = roomMap[roomName];
	if (room) {
		if (room.clients.length == 2) {
			var canStart = true;
			room.clients.forEach(function(socket) {
				if (socket.prepare != 1) {
					canStart = false;
				}
			})
			if (canStart) {
				room.clients.forEach(function(socket) {
					console.log(socket.token);
					socket.emit('start');
				});
				return {status: 0, msg: '开始'};
			}
			return {status: 0, msg: '等待对方准备'};
		}
	}
}

// 解析表单数据
var bodyParse = function(req, cb) {
	var bodyData = ''
	req.on('data', function(data) {

		bodyData += data
	})

	req.on('end', function() {
		const params = bodyData.split('&')
		var body = {}
		params.forEach(function(item) {
			const kv = item.split('=')
			if (kv[0] && kv[1]) {
				body[kv[0]] = kv[1]  
			}

		})
		cb(body)
	})
}

server.listen(PORT);
console.log('wsServer start on port: ' + PORT);