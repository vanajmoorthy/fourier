const USER = 0;
const FOURIER = 1;

let x = [];
let y = [];

let fourierX;
let fourierY;

let time = 0;
let path = [];

let drawing = [];
let state = -1;

function mousePressed() {
	state = USER;
	drawing = [];
	x = [];
	y = [];
	time = 0;
	path = [];
}

function mouseReleased() {
	state = FOURIER;
	const skip = 1;

	for (let i = 0; i < drawing.length; i += skip) {
		x.push(drawing[i].x);
		y.push(drawing[i].y);
	}

	fourierX = dft(x);
	fourierY = dft(y);

	fourierX.sort((a, b) => b.amp - a.amp);
	fourierY.sort((a, b) => b.amp - a.amp);
}

function setup() {
	createCanvas(800, 600);
	state = -1;
}

function epicycle(x, y, rotation, fourier) {
	for (let i = 0; i < fourier.length; i++) {
		let prevx = x;
		let prevy = y;

		let freq = fourier[i].freq;
		let radius = fourier[i].amp;
		let phase = fourier[i].phase;
		x += radius * cos(freq * time + phase + rotation);
		y += radius * sin(freq * time + phase + rotation);

		stroke(255, 100);
		noFill();
		ellipse(prevx, prevy, radius * 2, radius * 2);

		stroke(255);
		line(prevx, prevy, x, y);
	}
	return createVector(x, y);
}

function draw() {
	background(0);

	if (state == USER) {
		let point = createVector(mouseX - width / 2, mouseY - height / 2);
		drawing.push(point);
		stroke(255);
		noFill();
		beginShape();
		push();
		strokeWeight(2);

		for (let v of drawing) {
			vertex(v.x + width / 2, v.y + height / 2);
		}
		endShape();
		pop();
	} else if (state == FOURIER) {
		stroke(255);

		let vx = epicycle(width / 2, 120, 0, fourierX);
		let vy = epicycle(120, height / 2, HALF_PI, fourierY);

		let v = createVector(vx.x, vy.y);
		path.unshift(v);

		line(vx.x, vx.y, v.x, v.y);
		line(vy.x, vy.y, v.x, v.y);

		beginShape();
		noFill();
		push();
		strokeWeight(2);
		stroke(255);
		for (let i = 0; i < path.length; i++) {
			vertex(path[i].x, path[i].y);
		}
		endShape();
		pop();
		const dt = TWO_PI / fourierY.length;
		time += dt;

		if (time > TWO_PI) {
			time = 0;
			path = [];
		}
	}
	// if (wave.length > 600) {
	// 	wave.pop();
	// }
}
