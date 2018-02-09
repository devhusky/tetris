var timestamp = new Date().getTime();
var socket = io('ws://localhost:4399?token='+timestamp);

var local = new Local(socket);
var remove = new Remote(socket);

socket.on('connect', function() {

	socket.on('waiting', function(str) {
		document.getElementById('waiting').innerHTML = str;
	})
})

document.getElementById('prepareBtn').onclick = function() {
	if (document.getElementById('prepareBtn').innerHTML === '已准备') {
		return;
	}
	document.getElementById('prepareBtn').innerHTML = "已准备";

	$.ajax({
		type:'POST',
		url:'http://localhost:4399/prepare',
		data: {token: timestamp},
		dataType: 'json',
		success: function(result) {
			console.log(result);
		}
	});
}


document.getElementById('createRoomBtn').onclick = function() {
	var roomName = document.getElementById('createRoom').value;
	
	$.ajax({
		type:'POST',
		url:'http://localhost:4399/createRoom',
		data: {roomName: roomName, token: timestamp},
		dataType: 'json',
		success: function(result) {
			if (result.status != 0) {
				alert(result.msg);
			} else {
				var prepareBtn = document.getElementById('prepareBtn');
				prepareBtn.style.display = 'block';
			}
			console.log(result);
		}
	});
}

document.getElementById('joinRoomBtn').onclick = function() {
	var roomName = document.getElementById('joinRoom').value;
	
	$.ajax({
		type:'POST',
		url:'http://localhost:4399/joinRoom',
		data: {roomName: roomName, token: timestamp},
		dataType: 'json',
		success: function(result) {
			if (result.status != 0) {
				alert(result.msg);
			} else {
				var prepareBtn = document.getElementById('prepareBtn');
				prepareBtn.style.display = 'block';
			}
			console.log(result);
		}
	});
}