let textures = {};
var canvas;
var map;

var picker;

var player = {
	x: 0,
	y: 0,
	texture: "Snowy"
};

function preload() {
	textures["Grass"] = loadImage('assets/Grass.png');
	textures["Grass3"] = loadImage('assets/Grass3.png');
	textures["Stone"] = loadImage('assets/Stone.png');
	textures["Wool"] = loadImage('assets/Wool_Base.png');
	textures["Dirt"] = loadImage('assets/Dirt.png');
	textures["G2M"] = loadImage('assets/G2M.png');
	textures["SmallStone"] = loadImage('assets/SmallStone.png');		
	textures["Snowy"] = loadImage('assets/wew.png');
}

p5.disableFriendlyErrors = true; 
var currentSlot = 0;
var slots;
let cameraLocation;
var socket;
var users = {};
var id = "";
function setup() {
	socket = io('http://localhost:8454', { forceNew: true });
	slots = ["Grass", "Dirt", "Stone", "Wool", "SmallStone"];
	const canvasElt = createCanvas(windowWidth, windowHeight).elt;
	canvasElt.style.width = '100%', canvasElt.style.height = '100%';
	cameraLocation = createVector(0, 0, (height/2.0) / tan(PI*30.0 / 180.0));	
	frameRate(60);
	map = new Tilemap(70, 70, 70);	

	picker = new IsometricPicker({x: 32, y: 32});	

	for (var i = 0; i < 70; i++) {
		for (var k = 0; k < 70; k++) {
			map.setTile(i, k, 0, { texture: "Grass", width: 32, height: 32});
			map.setTile(i, k, 1, { texture: null, width: 32, height: 32});
			//map.setTile(i, 1, k, { texture:textures["Grass"], width: 32, height: 32 });
		}
	}
	socket.emit("defaults", map.points)
	socket.emit("join", {
		nick: generate(),
		color: randomColor()
	})
	
	socket.on('userConnected', (res) => {
		id = res;
		console.log("ID: "+res)
	})

	socket.on('userJoin', (res) => {
		users = res;
		console.log(res)
	})

	socket.on('updateMap', (res) => {
		var data = JSON.parse(res);
		map.points[data.id] = data.block;
	})

	socket.on('updateCursor', (m) => {
		users[m.id] = m.u;
	})

	socket.on('loadMap', (m) => {
		map.points = m;
	})
}
var baseX;
var baseY;
function draw() {
	clear();
	background(100, 149, 237);
	noSmooth();			

	baseX = (windowWidth/2)-player.x;
	baseY = (windowHeight/4)-player.y;

	//camera(cameraLocation.x, cameraLocation.y, cameraLocation.z, 0, 0, 0, 0, 1, 0);
	
	//camera.position.x = player.x;
	//camera.position.y = player.y;	
	camera.on();
	//camera(player.x, player.y, (height / 2) / tan(PI / 6), 0, 0, 0, 0, 1, 0);				

	var mX = (mouseX - 16) - baseX
	var mY = (mouseY - 8) - baseY

	var xC = Math.round(((mX / (32 / 2) + mY / (32 / 4)) / 2));
	var yC = Math.round(((mY / (32 / 4) - (mX / (32 / 2))) / 2));

	//text("X: "+xC, mouseX+20, mouseY+10, 12);
	//text("Y: "+yC, mouseX+60, mouseY+10, 12);	

	var a = this.map.points.find(a => a.x == xC && a.y == yC && a.z == 1);	

	var gX = Math.round(((xC - yC) * (32 / 2)))
	var gY = Math.round(((xC + yC) * (32 / 4)))

	strokeWeight(1);

	map.points.forEach((a, i) => {		
		if(a.d && a.tile.texture && a.z == 0){					
			var texture = textures[a.tile.texture];
			//var baseX = 0;			
			//var baseY = 0;		
			//var x = baseX + ((a.x - a.z) * (32 / 2)) - (32 / 2);
			//var y = baseY + (((a.x + a.z) * (32 / 4)) - ((32 / 2) * (a.y))) - (32/ 2);
			var x = baseX + Math.round(((a.x - a.y) * (texture.width / 2)))
			var y = baseY + Math.round((((a.x + a.y) * (texture.height / 4))) - ((32 / 2) * (a.z)))
			if(x > - 32 && x < windowWidth && y < windowHeight && y > -32){
				image(texture, x, y, 32, 32)
			}			
			//textAlign(CENTER);
			//textSize(8);			
			//text(i, x+16, y, 12);
		}
	})

	push()
	stroke(0,0,0, 50)
	translate(baseX+16, baseY)
	for(var x = 0; x <= this.map.mapX; x++){
		line(-x*16, x*8, ((this.map.mapX/2)*32)-(x*16), ((this.map.mapY/2)*16)+(x*8));
	}
	for(var x = 0; x <= this.map.mapY; x++){
		line(x*16, x*8, (-((this.map.mapX)/2)*32)+(x*16), (((this.map.mapY)/2)*16)+(x*8));
	}	
	pop()

	if(xC >= 0 && xC < map.mapX && yC >= 0 && yC < map.mapY){
		push()	
		translate(baseX + gX, (baseY + gY)+9)
		line(16, -8, 0, 0);
		line(16, 8, 0, 0);
		line(32, 0, 16, -8);
		line(32, 0, 16, 8);
						
		line(0, -16, 0, 0)
		line(32, -16, 32, 0)
		line(16, -8, 16, 8)
		line(16, -24, 16, -8)						

		pop()
	}

	map.points.forEach((a, i) => {
		if(a.d && a.tile.texture != null && a.z > 0){
			var texture = textures[a.tile.texture]
			//var baseX = 0;			
			//var baseY = 0;		
			//var x = baseX + ((a.x - a.z) * (32 / 2)) - (32 / 2);
			//var y = baseY + (((a.x + a.z) * (32 / 4)) - ((32 / 2) * (a.y))) - (32/ 2);
			var x = baseX + Math.round(((a.x - a.y) * (texture.width / 2)))
			var y = baseY + Math.round((((a.x + a.y) * (texture.height / 4))) - ((32 / 2) * (a.z)))
			if(x > - 32 && x < windowWidth && y < windowHeight && y > -32){
				image(texture, x, y, 32, 32)
			}			
			//textAlign(CENTER);
			//textSize(8);			
			//text(i, x+16, y, 12);
		}
	})	

	Object.keys(users).forEach(user => {
		var u = users[user]		
		if(user != id){
			var gX = u.x
			var gY = u.y
			push()
			stroke(u.c.r, u.c.g, u.c.b)
			translate(baseX + gX, (baseY + gY)+8)
			line(16, -8, 0, 0);
			line(16, 8, 0, 0);
			line(32, 0, 16, -8);
			line(32, 0, 16, 8);
			pop()
		}
	})

	if(xC >= 0 && xC < map.mapX && yC >= 0 && yC < map.mapY){
		push()	
		translate(baseX + gX, (baseY + gY)+8)
			
		translate(0, -16)
		line(16, -8, 0, 0);
		line(16, 8, 0, 0);
		line(32, 0, 16, -8);
		line(32, 0, 16, 8);
		
		pop()

		socket.emit("updateCursor", {
			id: id,
			x: gX,
			y: gY
		})
	}
	
	var ba = [0, 1, 2, 3, 4, 5, 6]
	

	function tmp(){
		var arr = [];
		map.points.forEach(item => {
			if(!arr.includes(item['x']))
				arr.push(item['x']);
		})
		return arr;
	}	
	//console.log((-((this.map.mapX)/2)*32)+(16))
		
	//rect(-mouseX/2, mouseY, 100, 100);

	//image(textures[player.texture], player.x, player.y)	

	camera.off();
	//line(0, mouseY, windowWidth, mouseY);
	//line(mouseX, 0, mouseX, windowHeight);			

	if (keyIsDown(87)) {
		player.y -= 0.2 * deltaTime;
	}
	if (keyIsDown(83)) {
		player.y += 0.2 * deltaTime;
	}
	if (keyIsDown(65)) {
		player.x -= 0.2 * deltaTime;
	}
	if (keyIsDown(68)) {
		player.x += 0.2 * deltaTime;
	}

	let fps = frameRate();	
	text("FPS: " + fps.toFixed(2), 20, 20);
	text("- Controls -", 20, 38);
	text("[ WASD ] - Camera Movement", 20, 55);
	text("[ Left Click ] - Break Block", 20, 70);
	text("[ Right Click ] - Place Block", 20, 85);
	text("Users", 20, 105);
	Object.values(users).map((u, i) => {
		text("- "+u.nick, 20, 105 + ((i+1) * 20));
	})

	//var xC = (camera.mouseX / 16 + camera.mouseX / 16) / 2;
	//var yC = ((camera.mouseY*8) / 32 - (camera.mouseX / 8)) /2;

	//var x = (camera.mouseX/16);
	//var y = (camera.mouseY/16)
	//var y = (((a.x + a.z) * (32 / 4)) - ((32 / 2) * (camera.mouseY))) - (32/ 2);	

	//text("X: "+Math.round((map.mapX+x)/2), mouseX+20, mouseY+10, 12);
	//text("Y: "+Math.round((map.mapZ+y)/24), mouseX+60, mouseY+10, 12);
	
	if(a, mouseIsPressed){
		if (mouseButton === LEFT && a.tile.texture) {
			a.tile.texture = null;						
			socket.emit("updateMap", JSON.stringify({id: this.map.points.indexOf(a), block: a}));
		}
		if (mouseButton === RIGHT && !a.tile.texture) {
			a.tile.texture = slots[currentSlot]
			socket.emit("updateMap", JSON.stringify({id: this.map.points.indexOf(a), block: a}));
		}
	}

	drawGui()
}

function mousePressed(e){
	var mX = (mouseX - 16) - baseX
	var mY = (mouseY - 8) - baseY

	var xC = Math.round(((mX / (32 / 2) + mY / (32 / 4)) / 2));
	var yC = Math.round(((mY / (32 / 4) - (mX / (32 / 2))) / 2));
	var a = this.map.points.find(a => a.x == xC && a.y == yC && a.z == 1);	
	
}

function drawGui(){
	
	push()	
	slots.forEach((s, i) => {
		var sc = currentSlot == i ? 110 : 90; 
		var fc = currentSlot == i ? 170 : 120;
		var x = ((windowWidth/2) - 125) + i * 50;
		var y = windowHeight - 80;
		stroke(sc, sc, sc, 200)
		fill(fc, fc, fc, 200)
		strokeWeight(4)		
		rect(x, y, 50, 50, 10)
		if(s){
			push()
			image(textures[s], x+5, y+5, 40, 40)
			pop()
		}
	})	
	pop()
}
function keyTyped() {	
	
	var reg = new RegExp('^[0-9]+$');

	if(reg.test(key) && slots.length+1 > key){
		currentSlot = key-1;
	}
}
function getMaxOfArray(numArray) {
	return Math.max.apply(null, numArray);
}

function mouseDragged(){
	//var xC = (camera.mouseX / 16 + camera.mouseX / 16) / 2;
	//var yC = (camera.mouseY / 16 - (camera.mouseX / 16)) / 2;	

	//var xC = (camera.mouseX/16);
	//var yC = Math.floor(camera.mouseY / 16);
	
	
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}