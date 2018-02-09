var Square = function() {
	// 方块数据
	this.data = [
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
	];
	// 原点
	this.origin = {
		x: 0,
		y: 0
	}
	// 旋转方向索引
	this.dir = 0
}

Square.prototype.canDown = function(isValid) {
	var test = {};
	test.x = this.origin.x + 1;
	test.y = this.origin.y;
	return isValid(test, this.data);
}
Square.prototype.down = function() {
	this.origin.x = this.origin.x + 1;
}
Square.prototype.canLeft = function(isValid) {
	var test = {};
	test.x = this.origin.x;
	test.y = this.origin.y - 1;
	return isValid(test, this.data);
}
Square.prototype.left = function() {
	this.origin.y = this.origin.y - 1;
}
Square.prototype.canRight = function(isValid) {
	var test = {};
	test.x = this.origin.x;
	test.y = this.origin.y + 1;
	return isValid(test, this.data);
}
Square.prototype.right = function() {
	this.origin.y = this.origin.y + 1;
}
Square.prototype.canRotate = function(isValid) {
	var testDir = (this.dir + 1) % 4;
	var test = this.rotates[testDir];
	console.log('test:');
	console.log(test);
	return isValid(this.origin, test);
}
Square.prototype.rotate = function(num) {
	this.dir = (this.dir + num) % 4;
	this.data = this.rotates[this.dir];
}