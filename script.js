// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255,255,255,0.98)';
        navbar.style.padding = '0.8rem 1rem';
    } else {
        navbar.style.background = 'rgba(255,255,255,0.95)';
        navbar.style.padding = '1rem';
    }
});

// Use SweetAlert to display a thank you message when the contact form is submitted
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    Swal.fire({
      title: 'Thank You!',
      text: 'Thank you for your message!',
      icon: 'success',
      confirmButtonText: 'Close'
    });
});

const canvas = document.getElementById("snakeCanvas");
const ctx = canvas.getContext("2d");

// Game configuration
const gridSize = 20;
const tileCount = canvas.width / gridSize;

// Snake state
let snake = [{ x: 10, y: 10 }];
let snakeDir = { x: 0, y: 0 };
let snakeLength = 5;

// Food state
let food = { x: 15, y: 15 };

// Timing control
let gameInterval = 100; // milliseconds per frame
let lastTime = 0;

// Listen for arrow key input
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      if (snakeDir.y !== 1) snakeDir = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      if (snakeDir.y !== -1) snakeDir = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      if (snakeDir.x !== 1) snakeDir = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      if (snakeDir.x !== -1) snakeDir = { x: 1, y: 0 };
      break;
  }
});

// Main game loop
function gameLoop(currentTime) {
  if (currentTime - lastTime < gameInterval) {
    requestAnimationFrame(gameLoop);
    return;
  }
  lastTime = currentTime;
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Update game state
function update() {
  // Calculate new head position
  let head = { x: snake[0].x + snakeDir.x, y: snake[0].y + snakeDir.y };

  // Wrap snake around edges
  if (head.x < 0) head.x = tileCount - 1;
  if (head.x >= tileCount) head.x = 0;
  if (head.y < 0) head.y = tileCount - 1;
  if (head.y >= tileCount) head.y = 0;

  // Check for collision with self
  for (let segment of snake) {
    if (head.x === segment.x && head.y === segment.y) {
      // Reset game on collision
      snake = [{ x: 10, y: 10 }];
      snakeDir = { x: 0, y: 0 };
      snakeLength = 5;
      return;
    }
  }

  // Add new head to the snake
  snake.unshift(head);
  if (snake.length > snakeLength) {
    snake.pop();
  }

  // Check for collision with food
  if (head.x === food.x && head.y === food.y) {
    snakeLength++;
    placeFood();
  }
}

// Place food in a random grid cell not occupied by the snake
function placeFood() {
  food.x = Math.floor(Math.random() * tileCount);
  food.y = Math.floor(Math.random() * tileCount);

  for (let segment of snake) {
    if (food.x === segment.x && food.y === segment.y) {
      placeFood();
      return;
    }
  }
}

// Render the game state to the canvas
function draw() {
  // Clear the canvas
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the snake
  ctx.fillStyle = "#0f0";
  snake.forEach(segment => {
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
  });

  // Draw the food
  ctx.fillStyle = "#f00";
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

requestAnimationFrame(gameLoop);
