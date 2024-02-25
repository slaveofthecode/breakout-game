const canvas = document.getElementById("breakout");
canvas.width = 420;
canvas.height = 260;
const ctx = canvas.getContext("2d");

// Canvas
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

let keyRightPressed = false;
let keyLeftPressed = false;

function cleanCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function initEventsListeners() {
	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);

	function keyDownHandler(e) {
		if (e.key === "Right" || e.key === "ArrowRight") {
			keyRightPressed = true;
		} else if (e.key === "Left" || e.key === "ArrowLeft") {
			keyLeftPressed = true;
		}
	}

	function keyUpHandler(e) {
		if (e.key === "Right" || e.key === "ArrowRight") {
			keyRightPressed = false;
		} else if (e.key === "Left" || e.key === "ArrowLeft") {
			keyLeftPressed = false;
		}
	}
}

// Ball
const ball = {
	x: canvas.width / 2,
	y: canvas.height - 30,
	dx: 2,
	dy: -2,
	radius: 7,
	color: "#FFF",
};
drawBall = () => {
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
	ctx.fillStyle = ball.color;
	ctx.fill();
	ctx.closePath();
};
ballMove = () => {
	const isRightWall = ball.x + ball.dx > canvas.width - ball.radius;
	const isLeftWall = ball.x + ball.dx < ball.radius;
	const isTopWall = ball.y + ball.dy < ball.radius;
	const isTouchingPaddle = ball.y + ball.dy > paddle.y;

	if (isRightWall || isLeftWall) {
		ball.dx = -ball.dx;
	}

	if (isTopWall) {
		ball.dy = -ball.dy;
	} else {
		console.log("GAME OVER");
		document.location.reload();
	}

	// } else if (isTouchingPaddle) {
	// 	ball.dy = -ball.dy;
	// const isBallSameXAsPaddle =
	// 	ball.x > paddle.x && ball.x < paddle.x + paddle.width;

	// if (isBallSameXAsPaddle && isBallTouchingPaddle) {
	// 	ball.dy = -ball.dy;
	// } else if (ball.y + ball.dy > canvas.height - ball.radius) {
	// 	console.log("GAME OVER");
	// 	document.location.reload();
	// }

	ball.x += ball.dx;
	ball.y += ball.dy;
};

// Paddle
const paddle = {
	width: 75,
	height: 10,
	x: (canvas.width - 75) / 2,
	y: canvas.height - 10,
	color: "#FFF5",
};
drawPaddle = () => {
	ctx.beginPath();
	ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
	// ctx.strokeStyle = "#FFF9";
	// ctx.lineWidth = 1;
	// ctx.stroke();
	ctx.fillStyle = paddle.color;
	ctx.fill();
	ctx.closePath();
};
paddleMove = () => {
	if (keyRightPressed && paddle.x < canvas.width - paddle.width) {
		paddle.x += 7;
	} else if (keyLeftPressed && paddle.x > 0) {
		paddle.x -= 7;
	}
};

// Bricks
const brick = {
	row: 6,
	column: 5,
	width: 75,
	height: 20,
	padding: 10,
	offsetTop: 50,
	offsetLeft: canvas.width / 2 - 200,
	color: "#FFF8",
};
const bricks = [];

for (let c = 0; c < brick.column; c++) {
	bricks[c] = [];
	for (let r = 0; r < brick.row; r++) {
		const brickX = c * (brick.width + brick.padding) + brick.offsetLeft;
		const brickY = r * (brick.height + brick.padding) + brick.offsetTop;

		bricks[c][r] = {
			x: brickX,
			y: brickY,
			status: 1,
		};
	}
}

drawBricks = () => {
	for (let c = 0; c < brick.column; c++) {
		for (let r = 0; r < brick.row; r++) {
			const currentBrick = bricks[c][r];
			if (currentBrick.status === 0) continue;

			ctx.beginPath();
			ctx.rect(brick.row, brick.column, brick.width, brick.height);
			ctx.fillStyle = brick.color;
			ctx.fill();
			ctx.closePath();
		}
	}
};

// Collitions
collitionDetection = () => {
	for (let c = 0; c < brick.column; c++) {
		for (let r = 0; r < brick.row; r++) {
			const currentBrick = bricks[c][r];

			if (currentBrick.status === 0) continue;

			const isBallSameXBrick =
				ball.x > currentBrick.x &&
				ball.x < currentBrick.x + brick.width;
			const isBallSameYBrick =
				ball.y > currentBrick.y &&
				ball.y < currentBrick.y + brick.height;

			if (isBallSameXBrick && isBallSameYBrick) {
				ball.dy = -ball.dy;
				currentBrick.status = 0;
			}
		}
	}
};

// FPS rendering
let msLast = window.performance.now();
let msFPSPrev = window.performance.now() + 1000;
const fps = 60;
const msPerFrame = 1000 / fps;
let frames = 0;
let framesPerSec = fps;

function drawUI() {
	ctx.fillText(`FPS: ${framesPerSec}`, 5, 10);
}
// ---

function play() {
	window.requestAnimationFrame(play);

	// // renderings
	// const msNow = window.performance.now();
	// const msDelta = msNow - msLast;

	// if (msDelta < msPerFrame) return;

	// const excessTime = msDelta % msPerFrame;
	// msLast = msNow - excessTime;

	// frames++;

	// if (msNow > msFPSPrev) {
	// 	msFPSPrev = msNow + 1000;
	// 	framesPerSec = frames;
	// 	frames = 0;
	// }
	// ----

	// cleanCanvas();

	drawBall();
	// ballMove();
	// drawPaddle();
	// paddleMove();
	// drawBricks();
	// drawUI();

	// collitionDetection();
}

play();
initEventsListeners();
