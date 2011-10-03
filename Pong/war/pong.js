//Canvas Variables
var canvas;
var ctx;

// Game Variables
var x = 10;
var y = 10;
var leftPaddleSpeed = 5;
var paddleWidth = 5;
var paddleHeight = 60;
var leftPaddleVelocity = 0;
var WIDTH = 600;
var HEIGHT = 400;
var ballRadius = 6;
var ballX = 300;
var ballY = 200;
var ballXDirection = 1;
var ballSpeed = 1;
var ballAngle = 0.45;
var aiPaddleX = WIDTH - 10 - paddleWidth;
var aiPaddleY = HEIGHT / 2;
var aiPaddleSpeed = 0.5;
var aiDestinationY;
var keyDown = false;
var gameStarted = false;
var showGameInstructions = true;
var gameHalted = false;
var gameOver = false;

var leftScore = 0;
var rightScore = 0;
var winScore = 7;

// Sounds
var sndHit = new Audio("sounds/hit.wav");
var sndScore = new Audio("sounds/scores.wav");
var sndScoredOn = new Audio("sounds/scoredOn.wav");
var sndWin = new Audio("sounds/win.wav");
var sndLose = new Audio("sounds/lose.wav");

// turn logging on/off
var logging = false;

// Icons
var isMuted = false;
var iconSound = new Image();
var iconSoundMute = new Image();
var iconSoundX = 560;
var iconSoundY = 10;

function processScore() {

	gameStarted = false;
	gameHalted = false;
	ballX = 300;
	ballY = 200;
	ballXDirection = 1;
	ballSpeed = 1;
	ballAngle = 0.45
	aiPaddleX = WIDTH - 10 - paddleWidth;
	aiPaddleY = HEIGHT / 2;
	aiDestinationY = 300;
}

function resetGame() {
	gameOver = false;
	leftScore = 0;
	rightScore = 0;
}

// Functions for Drawing Shapes
function drawBall(x, y, r) {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, Math.PI * 2, true);
	ctx.fill();
}

function rect(x, y, w, h) {
	ctx.beginPath();
	ctx.rect(x, y, w, h);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
}

function clear() {
	ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

// Initialize the Playing Surface
function init() {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	loadImages();
	setAiDestinationY();
	return setInterval(draw, 1);
}

function loadImages() {
	iconSound.src = "icons/sound.png";
	iconSoundMute.src = "icons/sound_mute.png"
}

function toggleSound() {
	isMuted = !isMuted;
}

function setBallAngle(angle) {
	ballAngle = angle;
}

function setNewAngle() {
	var centerOfPaddle = Math.round(y + (paddleHeight / 2));

	if (ballAngle < 0) { // coming up from bottom
		if (ballY == centerOfPaddle) {
			setBallAngle(0);
		}
		// Hits the top eigth of the paddle
		else if (ballY > Math.round(y + (paddleHeight * 0.8))) {
			setBallAngle(0.60);
		}
		// Hits the top quarter of the paddle
		else if (ballY > Math.round(y + (paddleHeight * 0.5))) {
			setBallAngle(0.45);
		}
		// Hits the bottom quarters
		else if (ballY > Math.round(y + (paddleHeight * 0.2))) {
			setBallAngle(-0.45);
		} else {
			setBallAngle(-0.60);
		}
	} else {// coming from top
		if (ballY == centerOfPaddle) {
			setBallAngle(0);
		}
		// Hits the top eigth of the paddle
		else if (ballY < Math.round(y + (paddleHeight * 0.2))) {
			setBallAngle(-0.60);
		}
		// Hits the top quarter of the paddle
		else if (ballY < Math.round(y + (paddleHeight * 0.5))) {
			setBallAngle(-0.45);
		}
		// Hits the bottom quarter
		else if (ballY < Math.round(y + (paddleHeight * 0.8))) {
			setBallAngle(0.45);
		} else {
			setBallAngle(0.60);
		}
	}
}

function setNewBallSpeed() {
	ballSpeed = ballSpeed + 0.1;
	if (leftPaddleVelocity > 100) {
		ballSpeed = ballSpeed + 0.1;
	}
}

function collisionLeftPaddle() {
	if ((ballX >= x + paddleWidth - ballSpeed)
			&& (ballX <= x + paddleWidth + ballSpeed)) {
		if (ballY > y && ballY < y + paddleHeight) {
			if (!isMuted) {
				sndHit.play();
			}
			ballXDirection = 1;
			ballX = ballX + ballSpeed;
			setNewAngle();
			setNewBallSpeed();
			setAiDestinationY();
			return true;
		}
	}
	return false;
}

function collisionRightPaddle() {
	if (ballX > (aiPaddleX)) {
		if (ballY > aiPaddleY && ballY < aiPaddleY + paddleHeight) {
			if (!isMuted) {
				sndHit.play();
			}
			ballXDirection = -1;
			aiDestinationY = 200;
			ballSpeed = ballSpeed + 0.1;
			ballX = ballX - ballSpeed;
			return true;
		}
	}
	return false;
}

function alertMessage(msg, yCoord) {
	ctx.fillStyle = "lightyellow";
	ctx.textAlign = "center";
	ctx.font = "bold 20px courier";
	ctx.fillText(msg, 300, yCoord);
}

function checkGameOverScore() {
	if (leftScore == winScore) {
		if (!isMuted) {
			sndWin.play();
		}
		gameOver = true;
		alertMessage("You Win!", 300);
		showGameInstructions = true;
	} else if (rightScore == winScore) {
		if (!isMuted) {
			sndLose.play();
		}
		gameOver = true;
		alertMessage("You Lose!", 300);
		showGameInstructions = true;
	}
}

function updateBallPosition() {
	if (!collisionLeftPaddle() && !collisionRightPaddle()) {
		if (ballX > WIDTH) {
			// Left Score
			if (!isMuted) {
				sndScore.play();
			}
			gameHalted = true;
			leftScore++;
			checkGameOverScore();
			if (gameOver) {
				setTimeout("resetGame();", 3000);
			}
			alertMessage("Player Scores!", 150);
			setTimeout("processScore();", 3000);

		} else if (ballX < 0) {
			if (!isMuted) {
				sndScoredOn.play();
			}
			gameHalted = true;
			rightScore++;
			checkGameOverScore();
			if (gameOver) {
				setTimeout("resetGame();", 3000);
			}
			alertMessage("Computer Scores!", 150);
			setTimeout("processScore();", 3000);

		} else if (ballY > (HEIGHT - ballRadius)) {
			ballY = HEIGHT - ballRadius;// set back to Height
			setBallAngle(-ballAngle);
		} else if (ballY < (0 + ballRadius)) {
			ballY = 0 + ballRadius; // reset
			setBallAngle(-ballAngle);
		}
		if (ballXDirection == 1) {
			ballX = (ballX + ballSpeed);
			ballY = ballY + (ballSpeed * ballAngle);
		} else {
			ballX = ballX - ballSpeed;
			ballY = ballY + (ballSpeed * ballAngle);
		}
	}
}

function setAiDestinationY() {
	aiDestinationY = Math.round(ballY + (aiPaddleX * ballAngle));
	if (aiDestinationY > 400) {
		aiDestinationY = 400 - (aiDestinationY - 400);
	}
	if (aiDestinationY < 0) {
		aiDestinationY = 400 - (aiDestinationY + 400);
	}
}

function updateAIPaddleCoordinates() {
	if (aiPaddleY != aiDestinationY - (paddleHeight / 2)) {
		if (aiPaddleY < aiDestinationY - (paddleHeight / 2)) {
			aiPaddleY = aiPaddleY + aiPaddleSpeed;
		} else {
			aiPaddleY = aiPaddleY - aiPaddleSpeed;
		}
	}
}

function calculateLeftPaddleVelocity() {
	if (keyDown) {
		leftPaddleVelocity++;
	} else
		leftPaddleVelocity = 0;
}

function draw() {
	if (!gameHalted) {
		clear();
		ctx.fillStyle = "black";
		ctx.strokeStyle = "white";
		rect(0, 0, WIDTH, HEIGHT);
		ctx.fillStyle = "white";
		rect(x, y, paddleWidth, paddleHeight);

		rect(aiPaddleX, aiPaddleY, paddleWidth, paddleHeight);

		if (gameStarted) {
			updateBallPosition();
			updateAIPaddleCoordinates();
		} else {
			alertMessage("Press the Space Bar to Serve", 100);
			if (showGameInstructions) {
				alertMessage("Up/Down Arrows to Control Paddle", 125);
				alertMessage("\"S\" to Toggle Sound", 150);
			}
		}

		// draw static icons
		if (isMuted) {
			ctx.drawImage(iconSoundMute, iconSoundX, iconSoundY);
		} else {
			ctx.drawImage(iconSound, iconSoundX, iconSoundY);
		}

		// magic numbers for ball speed/color
		if (ballSpeed > 2.5) {
			ctx.fillStyle = "red";
		} else if (ballSpeed > 2) {
			ctx.fillStyle = "orange";
		} else if (ballSpeed > 1.5) {
			ctx.fillStyle = "yellow";
		} else {
			ctx.fillStyle = "white";
		}
		drawBall(ballX, ballY, ballRadius);
		calculateLeftPaddleVelocity();

		// Write the Score
		ctx.fillStyle = "grey"
		ctx.font = "bold 50px courier";
		ctx.fillText(leftScore, 260, 40);
		ctx.fillText(rightScore, 360, 40);

		// Update the Debugging
		var container = document.getElementById("coordinates");

		if (logging) {
			container.innerHTML = "X: " + ballX + " Y: " + ballY
					+ " ballAngle " + ballAngle;
			container = document.getElementById("aiDestination");
			container.innerHTML = "Destination: " + aiDestinationY;
			container = document.getElementById("aiY");
			container.innerHTML = "Ball Speed: " + ballSpeed;
		}
	}

}

// Copied this from the 'net
function KeyboardController(keys, repeat) {
	var timers = {};

	document.onkeydown = function(event) {
		var key = (event || window.event).keyCode;

		if (!(key in keys))
			return true;
		if (!(key in timers)) {
			timers[key] = null;
			keys[key]();
			keyDown = true;
			if (repeat !== 0)
				timers[key] = setInterval(keys[key], repeat);
			// This is a one hit, could be implemented much better
			if (key == 83) {
				clearInterval(timers[key]);
			}
		}

		return false;

	};

	document.onkeyup = function(event) {
		keyDown = false;
		var key = (event || window.event).keyCode;
		if (key in timers) {
			if (timers[key] !== null)
				clearInterval(timers[key]);
			delete timers[key];
		}
	};

	window.onblur = function() {
		for (key in timers)
			if (timers[key] !== null)
				clearInterval(timers[key]);
		timers = {};
	};
};

KeyboardController({
	32 : function() {
		if (!gameStarted) {
			gameStarted = true;
			showGameInstructions = false;
			updateBallPosition();
		}
	},
	38 : function() {
		// test upper boundary
		if (y > 0) {
			y--;
		}
	},
	40 : function() {
		if (y + paddleHeight < HEIGHT) {
			y++;
		}
	},
	// Sound (S)
	83 : function() {
		toggleSound();
	}
}, 1);
