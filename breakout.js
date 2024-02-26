let gameFinished = false;

const rowBricks = 5;
const colBricks = 7;

const $timeElapsed = document.querySelector("#timeElapsed");
const $scoreValue = document.querySelector("#scoreValue");
const $restartButton = document.querySelector("#restartButton");

const $gameover = document.querySelector(".gameover");
const $gameoverTitle = $gameover.querySelector(".gameover-container__title");
const $gameoverScore = $gameover.querySelector("#gameoverScore");
const $gameoverTime = $gameover.querySelector("#gameoverTime");

const $game = document.querySelector(".game");

$gameover.style.display = "none";
$restartButton.setAttribute("disabled", true);

$timeElapsed.textContent = "00:00";
$scoreValue.textContent = rowBricks * colBricks;

setInterval(() => {
	if (gameFinished) return;

	const time = $timeElapsed.textContent.split(":");
	const minutes = parseInt(time[0]);
	const seconds = parseInt(time[1]);

	if (seconds < 59) {
		$timeElapsed.textContent = `${minutes < 10 ? "0" + minutes : minutes}:${
			seconds + 1 < 10 ? "0" + (seconds + 1) : seconds + 1
		}`;
	} else {
		$timeElapsed.textContent = `${
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
		gameFinished = true;
		$restartButton.removeAttribute("disabled");
		$gameover.removeAttribute("style");
		$game.classList.add("-gameover");

		$gameoverTitle.classList.add("-lost");
		$gameoverTitle.textContent = "Game Over";

		$gameoverScore.querySelector("span").textContent = "Bricks pending";
		$gameoverScore.querySelector("strong").textContent =
			$scoreValue.textContent;

		$gameoverTime.querySelector("span").textContent = "Time";
		$gameoverTime.querySelector("strong").textContent =
			$timeElapsed.textContent;
	} else if (allBricksDestroyed) {
		gameFinished = true;
		$restartButton.removeAttribute("disabled");
		$gameover.removeAttribute("style");
		$game.classList.add("-gameover");

		$gameoverTitle.classList.add("-win");
		$gameoverTitle.textContent = "You Win!";

		$gameoverScore.style.display = "none";

		$gameoverTime.querySelector("span").textContent = "Time";
		$gameoverTime.querySelector("strong").textContent =
			$timeElapsed.textContent;
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
	$restartButton.addEventListener("click", handleClickPlay, false);

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

let touchIsLeft = false;
function initEventsListenersMobile() {
	document.addEventListener("touchstart", touchHandlerStart, {
		passive: true,
	});
	document.addEventListener("touchend", touchHandlerEnd, { passive: true });

	function touchHandlerStart(e) {
		if (e.touches) {
			const touchX = e.touches[0].clientX;
			const isLeft = touchX < document.body.clientWidth / 2;

			if (isLeft) {
				touchIsLeft = true;
				keyLeftPressed = true;
			} else {
				touchIsLeft = false;
				keyRightPressed = true;
			}
		}
	}

	function touchHandlerEnd(e) {
		if (touchIsLeft) keyLeftPressed = false;
		else keyRightPressed = false;
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
initEventsListenersMobile();
