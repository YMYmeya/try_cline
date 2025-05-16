// 游戏变量
let score = 0;
let timeLeft = 30;
let gameInterval;
let moleInterval;
let isPlaying = false;

// DOM元素
const gameBoard = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');

// 初始化游戏板
function initGameBoard() {
    for (let i = 0; i < 9; i++) {
        const hole = document.createElement('div');
        hole.className = 'hole';
        
        const mole = document.createElement('div');
        mole.className = 'mole';
        mole.addEventListener('click', hitMole);
        
        hole.appendChild(mole);
        gameBoard.appendChild(hole);
    }
}

// 随机显示地鼠
function showRandomMole() {
    const holes = document.querySelectorAll('.hole');
    const randomIndex = Math.floor(Math.random() * holes.length);
    const mole = holes[randomIndex].querySelector('.mole');
    
    mole.classList.add('up');
    
    setTimeout(() => {
        mole.classList.remove('up');
    }, 1000);
}

// 击中地鼠
function hitMole(e) {
    if (!e.target.classList.contains('up')) return;
    
    score++;
    scoreDisplay.textContent = `得分: ${score}`;
    e.target.classList.remove('up');
}

// 更新计时器
function updateTimer() {
    timeLeft--;
    timeDisplay.textContent = `时间: ${timeLeft}`;
    
    if (timeLeft <= 0) {
        endGame();
    }
}

// 开始游戏
function startGame() {
    if (isPlaying) return;
    
    isPlaying = true;
    score = 0;
    timeLeft = 30;
    scoreDisplay.textContent = `得分: ${score}`;
    timeDisplay.textContent = `时间: ${timeLeft}`;
    
    gameInterval = setInterval(updateTimer, 1000);
    moleInterval = setInterval(showRandomMole, 800);
}

// 结束游戏
function endGame() {
    clearInterval(gameInterval);
    clearInterval(moleInterval);
    isPlaying = false;
    
    const restartBtn = document.createElement('button');
    restartBtn.textContent = '重新开始';
    restartBtn.id = 'restart-btn';
    restartBtn.addEventListener('click', restartGame);
    
    const gameOverDiv = document.createElement('div');
    gameOverDiv.id = 'game-over';
    gameOverDiv.innerHTML = `<p>游戏结束! 你的得分是: ${score}</p>`;
    gameOverDiv.appendChild(restartBtn);
    
    document.body.appendChild(gameOverDiv);
}

// 重新开始游戏
function restartGame() {
    const gameOverDiv = document.getElementById('game-over');
    if (gameOverDiv) {
        document.body.removeChild(gameOverDiv);
    }
    
    // 清除所有地鼠
    document.querySelectorAll('.mole').forEach(mole => {
        mole.classList.remove('up');
    });
    
    startGame();
}

// 初始化游戏
initGameBoard();
startGame();
//PS D:\PycharmProjects\try_cline> start 3_dadishu/index.html