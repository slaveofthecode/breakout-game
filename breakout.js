let gameFinished = false;
const rowBricks = 5;
const colBricks = 7;

const $btnPlay = document.querySelector("#btnPlay");
const $timePlayed = document.querySelector("#timePlayed");
const $scoreValue = document.querySelector("#scoreValue");

$btnPlay.setAttribute("disabled", true);
$timePlayed.textContent = "00:00";
$scoreValue.textContent = rowBricks * colBricks;

setInterval(() => {
	if (gameFinished) return;

	const time = $timePlayed.textContent.split(":");
	const minutes = parseInt(time[0]);
	const seconds = parseInt(time[1]);

	if (seconds < 59) {
		$timePlayed.textContent = `${minutes < 10 ? "0" + minutes : minutes}:${
			seconds + 1 < 10 ? "0" + (seconds + 1) : seconds + 1
		}`;
	} else {
		$timePlayed.textContent = `${
			minutes + 1 < 10 ? "0" + (minutes + 1) : minutes + 1
		}:00`;
	}
}, 1000);

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const velocity = 4;
const mov = {
	x: velocity,
	y: -velocity,
};
const ball = {
	radius: 5,
	color: "#0008",
};
const paddle = {
	height: 10,
	width: 75,
	color: "black",
};

const brick = {
	height: 16,
	width: 48,
	color: "red",
	offsetTop: 16 * 2,
	offsetLeft: canvas.width / 2 - (48 * colBricks) / 2 - 8 * 3,
	padding: 8,
};
const brickColors = ["red", "yellow", "green", "blue", "gray", "orange"];

const bricks = [];

for (let r = 0; r < rowBricks; r++) {
	bricks[r] = [];
	for (let c = 0; c < colBricks; c++) {
		const posX = c * (brick.width + brick.padding) + brick.offsetLeft;
		const posY = r * (brick.height + brick.padding) + brick.offsetTop;
		const indexColor = Math.round(Math.random() * 5);
		bricks[r][c] = {
			posX,
			posY,
			status: 1,
			color: brickColors[indexColor],
		};
	}
}

const position = {
	ball: {
		x: canvas.width / 2,
		y: canvas.height - ball.radius - paddle.height - 2,
	},
	paddle: {
		x: canvas.width / 2 - paddle.width / 5,
		y: canvas.height - paddle.height,
	},
};

let keyRightPressed = false;
let keyLeftPressed = false;

function drawBall() {
	ctx.beginPath();
	ctx.arc(position.ball.x, position.ball.y, ball.radius, 0, Math.PI * 2);
	ctx.fillStyle = ball.color;
	ctx.fill();
	ctx.closePath();
}

function drawPaddle() {
	ctx.beginPath();
	ctx.rect(position.paddle.x, position.paddle.y, paddle.width, paddle.height);
	ctx.fillStyle = paddle.color;
	ctx.fill();
	ctx.closePath();
}

function moveBall() {
	const isRightWall = position.ball.x + ball.radius > canvas.width;
	const isTopWall = position.ball.y - ball.radius < 0;
	const isLeftWall = position.ball.x - ball.radius < 0;
	const isBottomWall = position.ball.y > canvas.height;
	const isPaddle =
		position.ball.y + ball.radius > position.paddle.y &&
		position.ball.x > position.paddle.x + ball.radius &&
		position.ball.x < position.paddle.x + paddle.width;
	const allBricksDestroyed = bricks.every((row) =>
		row.every((brick) => brick.status === 0)
	);

	if (isRightWall) {
		mov.x = -velocity;
	} else if (isTopWall) {
		mov.y = velocity;
	} else if (isLeftWall) {
		mov.x = velocity;
	} else if (isPaddle) {
		mov.y = -velocity;
	} else if (isBottomWall) {
		console.log("Game Over");
		gameFinished = true;
		$btnPlay.removeAttribute("disabled");
	} else if (allBricksDestroyed) {
		console.log("You win");
		gameFinished = true;
		$btnPlay.removeAttribute("disabled");
		// stop time
	}

	if (!gameFinished) {
		for (let r = 0; r < rowBricks; r++) {
			for (let c = 0; c < colBricks; c++) {
				const currentBrick = bricks[r][c];
				if (currentBrick.status === 1) {
					if (
						position.ball.x > currentBrick.posX &&
						position.ball.x < currentBrick.posX + brick.width &&
						position.ball.y > currentBrick.posY &&
						position.ball.y < currentBrick.posY + brick.height
					) {
						mov.y = -mov.y;
						currentBrick.status = 0;
						$scoreValue.textContent =
							parseInt($scoreValue.textContent) - 1;
					}
				}
			}
		}
	}

	position.ball.x += mov.x;
	position.ball.y += mov.y;
}

function movePaddle() {
	const isLeftWall = position.paddle.x < 0;
	const isRightWall = position.paddle.x + paddle.width > canvas.width;

	if (keyRightPressed && !isRightWall) {
		position.paddle.x += velocity * 2;
	} else if (keyLeftPressed && !isLeftWall) {
		position.paddle.x -= velocity * 2;
	}
}

function drawBricks() {
	for (let r = 0; r < rowBricks; r++) {
		for (let c = 0; c < colBricks; c++) {
			const currentBrinck = bricks[r][c];

			if (currentBrinck.status === 0) continue;

			ctx.beginPath();
			ctx.rect(
				currentBrinck.posX,
				currentBrinck.posY,
				brick.width,
				brick.height
			);
			ctx.fillStyle = currentBrinck.color;
			ctx.fill();
			ctx.strokeStyle = "#000";
			ctx.stroke();
			ctx.closePath();
		}
	}
}

function cleanCtx() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function initEventsListenersActions() {
	$btnPlay.addEventListener("click", handleClickPlay, false);

	function handleClickPlay() {
		document.location.reload();
	}
}

function initEventsListeners() {
	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);

	function keyDownHandler(e) {
		const isKeyRight = ["Right", "ArrowRight"].includes(e.key);
		const isKeyLeft = ["Left", "ArrowLeft"].includes(e.key);

		if (isKeyRight) keyRightPressed = true;
		else if (isKeyLeft) keyLeftPressed = true;
	}

	function keyUpHandler(e) {
		const isKeyRight = ["Right", "ArrowRight"].includes(e.key);
		const isKeyLeft = ["Left", "ArrowLeft"].includes(e.key);

		if (isKeyRight) keyRightPressed = false;
		else if (isKeyLeft) keyLeftPressed = false;
	}
}

let touchStartX = 0;
function initEventsListenersMobile() {
	document.addEventListener("touchstart", touchHandlerStart, false);
	document.addEventListener("touchend", touchHandlerEnd, false);

	function touchHandlerStart(e) {
		if (e.touches) {
			// const touchX = e.touches[0]?.clientX;
			// const isTouchedLeft = touchX < canvas.width / 2;
			// const isTouchedRight = touchX > canvas.width / 2;
			// if (isTouchedRight) keyRightPressed = true;
			// else if (isTouchedLeft) keyLeftPressed = true;

			// touchX = e.touches[0]?.clientX;

			if (e.touches && e.touches.length > 0) {
				touchStartX = e.touches[0].clientX;
			}
		}
	}

	function touchHandlerEnd(e) {
		if (e.touches) {
			// const touchX = e.touches[0]?.clientX;
			// const isTouchedLeft = touchX < canvas.width / 2;
			// const isTouchedRight = touchX > canvas.width / 2;
			// if (isTouchedRight) keyRightPressed = false;
			// else if (isTouchedLeft) keyLeftPressed = false;
			// e.preventDefault();

			// const touchEndX = e.changedTouches[0]?.clientX;
			// const isTouchedLeft = touchEndX < touchX;
			// const isTouchedRight = touchEndX > touchX;
			// if (isTouchedRight) keyRightPressed = true;
			// else if (isTouchedLeft) keyLeftPressed = true;

			// const endX = e.changedTouches[0]?.clientX;
			// const diffX = touchX - endX;
			// if (diffX > 0) keyLeftPressed = true;
			// else if (diffX < 0) keyRightPressed = true;
			console.log(e.changedTouches);

			if (e.changedTouches && e.changedTouches.length > 0) {
				const touchEndX = e.changedTouches[0].clientX;
				console.log(touchStartX, touchEndX);
				// const touchDifferenceX = touchEndX - touchStartX;
				// // const threshold = 50; // Ajusta este valor según sea necesario

				// if (touchDifferenceX > 0) {
				// 	keyRightPressed = true;
				// } else if (touchDifferenceX < 0) {
				// 	keyLeftPressed = true;
				// }
			}
		}
	}
}

function play() {
	cleanCtx();

	if (!gameFinished) window.requestAnimationFrame(play);

	drawBall();
	drawPaddle();
	moveBall();
	movePaddle();

	drawBricks();
}

play();

initEventsListenersActions();
initEventsListeners();
// initEventsListenersMobile();
