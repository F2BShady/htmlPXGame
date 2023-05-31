// Oyun alanı boyutları
const width = 20;
const height = 20;

// Oyun alanı oluşturma
const gameContainer = document.getElementById('game-container');

for (let i = 0; i < height; i++) {
  for (let j = 0; j < width; j++) {
    const pixel = document.createElement('div');
    pixel.className = 'pixel';
    pixel.style.left = j * 20 + 'px';
    pixel.style.top = i * 20 + 'px';
    gameContainer.appendChild(pixel);
  }
}

// Oyuncu pozisyonu
let playerX = 0;
let playerY = 0;

// Düşman pozisyonları
let enemyPositions = [
  { x: 5, y: 5, health: 1 },
  { x: 10, y: 15, health: 2 },
  { x: 17, y: 8, health: 3 }
];

// Mermi pozisyonları
let bullets = [];

// Puanlama ve seviye
let score = 0;
let level = 1;
const scoreDisplay = document.createElement('div');
scoreDisplay.className = 'score';
scoreDisplay.innerText = 'Score: 0';
document.body.appendChild(scoreDisplay);

const levelDisplay = document.createElement('div');
levelDisplay.className = 'level';
levelDisplay.innerText = 'Level: 1';
document.body.appendChild(levelDisplay);

// Oyuncu hareketleri
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowUp' && playerY > 0) {
    playerY--;
  } else if (event.key === 'ArrowDown' && playerY < height - 1) {
    playerY++;
  } else if (event.key === 'ArrowLeft' && playerX > 0) {
    playerX--;
  } else if (event.key === 'ArrowRight' && playerX < width - 1) {
    playerX++;
  } else if (event.key === 'k') {
    checkAndDestroyEnemy();
  }

  updateGame();
});

// Oyunu güncelleme
function updateGame() {
  // Oyuncu pozisyonunu güncelleme
  const pixels = document.getElementsByClassName('pixel');
  for (let i = 0; i < pixels.length; i++) {
    pixels[i].style.backgroundColor = '#FFF';
  }
  const playerIndex = playerY * width + playerX;
  pixels[playerIndex].style.backgroundColor = '#FF0000';

  // Düşmanları kontrol etme
  for (let i = 0; i < enemyPositions.length; i++) {
    const enemy = enemyPositions[i];
    const enemyIndex = enemy.y * width + enemy.x;
    if (enemy.health > 0) {
      pixels[enemyIndex].style.backgroundColor = '#00FF00';
    }
  }

  // Mermileri güncelleme
  for (let i = 0; i < bullets.length; i++) {
    const bullet = bullets[i];
    bullet.y--;
    const bulletIndex = bullet.y * width + bullet.x;
    if (bullet.y >= 0) {
      pixels[bulletIndex].innerHTML = `<div class="bullet" style="left: ${bullet.x * 20}px; top: ${bullet.y * 20}px;"></div>`;
    } else {
      bullets.splice(i, 1);
      i--;
    }
  }

  requestAnimationFrame(updateGame);
}

// Mermi ateşleme
function fireBullet() {
  bullets.push({ x: playerX, y: playerY - 1 });
}

// Düşman kontrolü ve yok etme
function checkAndDestroyEnemy() {
  for (let i = 0; i < enemyPositions.length; i++) {
    const enemy = enemyPositions[i];
    if (Math.abs(enemy.x - playerX) <= 1 && Math.abs(enemy.y - playerY) <= 1 && enemy.health > 0) {
      enemy.health--;
      if (enemy.health === 0) {
        score += 10; // Puan kazanma
        scoreDisplay.innerText = 'Score: ' + score;

        // Tüm düşmanlar yok edildiyse bir sonraki seviyeye geç
        if (checkAllEnemiesDestroyed()) {
          level++;
          levelDisplay.innerText = 'Level: ' + level;
          createEnemies(level);
        }
      }
      break;
    }
  }
}

// Tüm düşmanların yok edilip edilmediğini kontrol etme
function checkAllEnemiesDestroyed() {
  for (let i = 0; i < enemyPositions.length; i++) {
    if (enemyPositions[i].health > 0) {
      return false;
    }
  }
  return true;
}

// Yeni düşmanlar oluşturma
function createEnemies(level) {
  enemyPositions = [];
  for (let i = 0; i < level + 2; i++) {
    const enemy = {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height),
      health: level
    };
    enemyPositions.push(enemy);
  }
}

// Oyunu başlatma
createEnemies(level);
updateGame();
