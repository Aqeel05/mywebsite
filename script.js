// script.js

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
      navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';
    } else {
      navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
    }
  });
  
  // Custom SweetAlert for the contact form submission
  document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    Swal.fire({
      title: 'Thank You!',
      text: 'Your message has been sent successfully.',
      icon: 'success',
      background: '#0A192F',
      color: '#CCD6F6',
      confirmButtonColor: '#64FFDA',
      confirmButtonText: 'Close'
    });
  });
  
  // WASD key activation helper functions
  function activateKey(key) {
    const el = document.getElementById(`key-${key}`);
    if (el) {
      el.classList.add('active');
    }
  }
  
  function deactivateKey(key) {
    const el = document.getElementById(`key-${key}`);
    if (el) {
      el.classList.remove('active');
    }
  }
  
  // Snake game demo
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
  
  // Listen for WASD key input
  window.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    switch (key) {
      case "w":
        if (snakeDir.y !== 1) snakeDir = { x: 0, y: -1 };
        activateKey("w");
        break;
      case "a":
        if (snakeDir.x !== 1) snakeDir = { x: -1, y: 0 };
        activateKey("a");
        break;
      case "s":
        if (snakeDir.y !== -1) snakeDir = { x: 0, y: 1 };
        activateKey("s");
        break;
      case "d":
        if (snakeDir.x !== -1) snakeDir = { x: 1, y: 0 };
        activateKey("d");
        break;
    }
  });
  
  // Remove active state on keyup
  window.addEventListener("keyup", (e) => {
    const key = e.key.toLowerCase();
    if(["w", "a", "s", "d"].includes(key)) {
      deactivateKey(key);
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
    let head = { x: snake[0].x + snakeDir.x, y: snake[0].y + snakeDir.y };
  
    // Wrap snake around edges
    if (head.x < 0) head.x = tileCount - 1;
    if (head.x >= tileCount) head.x = 0;
    if (head.y < 0) head.y = tileCount - 1;
    if (head.y >= tileCount) head.y = 0;
  
    // Check for collision with self
    for (let segment of snake) {
      if (head.x === segment.x && head.y === segment.y) {
        snake = [{ x: 10, y: 10 }];
        snakeDir = { x: 0, y: 0 };
        snakeLength = 5;
        return;
      }
    }
  
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
  
  // Place food in a random cell not occupied by the snake
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
    const darkColor = getComputedStyle(document.documentElement).getPropertyValue('--dark-color').trim();
    ctx.fillStyle = darkColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    ctx.fillStyle = "#64FFDA"; // Snake color from primary
    snake.forEach(segment => {
      ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });
  
    ctx.fillStyle = "#FF2C2C"; // Food color from secondary
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
  }
  
  requestAnimationFrame(gameLoop);
  