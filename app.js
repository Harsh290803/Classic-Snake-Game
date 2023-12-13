// HTML elements
const board = document.getElementById("game-board");
const gameLogo = document.getElementById("game-logo");
const instructions = document.getElementById("instructions");
const currScore = document.getElementById("current-score");
const highScore = document.getElementById("high-score");

// Game variables
const gridSize = 20;
let snakePos = [{ x: gridSize / 2, y: gridSize / 2 }];
let foodPos = generateRandPos();
let direction = "up";
let gameInterval;
let gameSpeedDelay = 200;
let running = false;
let hiScore = 0;

// Function to render the board
function drawBoard() {
  board.innerHTML = "";
  if (running) {
    drawSnake();
    drawFood();
  }
}

// Function to render snake's body
function drawSnake() {
  snakePos.forEach((segment) => {
    const snakeElement = createGameElement("div", "snake");
    setPosition(snakeElement, segment);
    board.appendChild(snakeElement);
  });
}

// Function to render food
function drawFood() {
  const foodElement = createGameElement("div", "food");
  setPosition(foodElement, foodPos);
  board.appendChild(foodElement);
}

// Function to create game elements
function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

// Function to set the position of game elements
function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

// Function to generate random position
function generateRandPos() {
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;
  return { x, y };
}

// Function to start the game
function startGame() {
  running = true;
  gameLogo.style.display = "none";
  instructions.style.display = "none";
  gameInterval = setInterval(() => {
    move();
    checkCollision();
    drawBoard();
  }, gameSpeedDelay);
}

// Function to move the snake
function move() {
  const headPos = { ...snakePos[0] };
  switch (direction) {
    case "up":
      headPos.y--;
      break;
    case "down":
      headPos.y++;
      break;
    case "left":
      headPos.x--;
      break;
    case "right":
      headPos.x++;
      break;
  }
  snakePos.unshift(headPos);
  // If the snake eats a food
  if (headPos.x === foodPos.x && headPos.y === foodPos.y) {
    increaseSpeed();
    foodPos = generateRandPos();
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      drawBoard();
    }, gameSpeedDelay);
    updateScore();
    return;
  }
  snakePos.pop();
}

// Game Controls
document.addEventListener("keydown", handleKeyPress);
function handleKeyPress(event) {
  if (!running && event.key === " ") {
    startGame();
    return;
  }
  switch (event.key) {
    case "ArrowUp":
      direction = "up";
      break;
    case "ArrowDown":
      direction = "down";
      break;
    case "ArrowLeft":
      direction = "left";
      break;
    case "ArrowRight":
      direction = "right";
      break;
  }
}

// Function to increase the speed of snake
function increaseSpeed() {
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2;
  } else if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1;
  }
}

// Function to check for collision
function checkCollision() {
  const headPos = snakePos[0];
  if (
    headPos.x < 1 ||
    headPos.x > gridSize ||
    headPos.y < 1 ||
    headPos.y > gridSize
  ) {
    resetGame();
  }
  for (let i = 1; i < snakePos.length; i++) {
    if (headPos.x === snakePos[i].x && headPos.y === snakePos[i].y) {
      resetGame();
      return;
    }
  }
}

// Function to reset the game
function resetGame() {
  updateHighScore();
  stopGame();
  snakePos = [{ x: gridSize / 2, y: gridSize / 2 }];
  foodPos = generateRandPos();
  direction = "up";
  gameSpeedDelay = 200;
  updateScore();
}

// Function to update the score
function updateScore() {
  const score = snakePos.length - 1;
  currScore.textContent = score.toString().padStart(3, "0");
}

// Function to update the high score
function updateHighScore() {
  const score = snakePos.length - 1;
  if (hiScore < score) {
    hiScore = score;
  }
  highScore.textContent = hiScore.toString().padStart(3, "0");
  highScore.style.display = "block";
}

// Function to stop the game and display the start screen
function stopGame() {
  clearInterval(gameInterval);
  running = false;
  instructions.textContent = instructions.textContent;
  instructions.style.display = "block";
  gameLogo.style.display = "block";
}
