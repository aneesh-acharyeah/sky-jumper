(() => {
  const player = document.getElementById('player');
  const obstacle = document.getElementById('obstacle');
  const star = document.getElementById('star');
  const scoreDisplay = document.getElementById('score');
  const template = document.getElementById('game-over-template');

  let playerX = 170;
  let score = 0;
  let speed = 3;
  let isGameOver = false;

  document.addEventListener('keydown', (e) => {
    if (isGameOver) return;

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      playerX = Math.max(10, playerX - 20);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      playerX = Math.min(330, playerX + 20);
    }

    player.style.left = `${playerX}px`;
  });

  document.addEventListener('touchstart', (e) => {
    if (isGameOver) return;
    e.preventDefault();
    const rect = player.parentElement.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left;

    playerX = touchX < rect.width / 2 ? 100 : 240;
    player.style.left = `${playerX}px`;
  }, { passive: false });

  function moveObstacle() {
    const top = parseInt(obstacle.style.top || '-100');
    const newTop = top + speed;

    if (newTop > 600) {
      obstacle.style.top = '-100px';
      obstacle.style.left = `${Math.floor(Math.random() * 330)}px`;
    } else {
      obstacle.style.top = `${newTop}px`;
    }
  }

  function moveStar() {
    const top = parseInt(star.style.top || '-50');
    const newTop = top + speed;

    if (newTop > 600) {
      // Reset star
      star.style.top = '-50px';
      star.style.left = `${Math.floor(Math.random() * 350)}px`;
    } else {
      star.style.top = `${newTop}px`;
    }
  }

  function checkCollision(a, b) {
    const rect1 = a.getBoundingClientRect();
    const rect2 = b.getBoundingClientRect();

    return !(
      rect1.bottom < rect2.top ||
      rect1.top > rect2.bottom ||
      rect1.right < rect2.left ||
      rect1.left > rect2.right
    );
  }

  function updateScore() {
    const obstacleTop = parseInt(obstacle.style.top || '0');
    if (obstacleTop > 600 && !obstacle.passed) {
      score++;
      scoreDisplay.textContent = `Score: ${score}`;
      obstacle.passed = true;
    }

    const starTop = parseInt(star.style.top || '0');
    if (checkCollision(player, star)) {
      score += 5;
      scoreDisplay.textContent = `Score: ${score}`;
      star.style.top = '650px'; 
      setTimeout(() => {
        star.style.top = '-50px';
        star.style.left = `${Math.floor(Math.random() * 350)}px`;
      }, 100);
    }
  }

  function endGame() {
    isGameOver = true;

    const frag = document.importNode(template.content, true);
    frag.getElementById('final-score').textContent = score;
    frag.getElementById('restart-button').onclick = () => {
      document.body.removeChild(modal);
      restartGame();
    };
    const modal = frag.querySelector('.overlay');
    document.body.appendChild(modal);
  }

  function gameLoop() {
    if (isGameOver) return;

    moveObstacle();
    moveStar();

    if (checkCollision(player, obstacle)) {
      endGame();
      return;
    }

    updateScore();

    if (score > 0 && score % 50 === 0) {
      speed += 0.2;
      if (speed > 8) speed = 8;
    }

    requestAnimationFrame(gameLoop);
  }

  function restartGame() {
    score = 0;
    speed = 3;
    isGameOver = false;
    playerX = 170;
    player.style.left = '170px';
    scoreDisplay.textContent = 'Score: 0';

    // Reset objects
    obstacle.style.top = '-100px';
    obstacle.style.left = '150px';
    obstacle.passed = false;

    star.style.top = '-50px';
    star.style.left = '200px';

    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);
})();
