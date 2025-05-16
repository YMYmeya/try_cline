const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{x: 10, y: 10}];
let food = {x: 5, y: 5};
let direction = {x: 0, y: 0};
let nextDirection = {x: 0, y: 0};
let score = 0;
let gameSpeed = 150;
let gameRunning = false;
let gamePaused = false;
let gameLoop;

function drawTile(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
    ctx.strokeStyle = '#fff';
    ctx.strokeRect(x * gridSize, y * gridSize, gridSize, gridSize);
}

function drawSnake() {
    snake.forEach(segment => drawTile(segment.x, segment.y, '#4CAF50'));
}

function drawFood() {
    drawTile(food.x, food.y, '#f44336');
}

function moveSnake() {
    const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};
    
    // 检查是否撞墙
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }
    
    // 检查是否撞到自己
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }
    
    snake.unshift(head);
    
    // 检查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        generateFood();
        // 每得50分加速
        if (score % 50 === 0) {
            gameSpeed = Math.max(gameSpeed - 15, 70);
        }
    } else {
        snake.pop();
    }
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    
    // 确保食物不会出现在蛇身上
    while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
    }
}

function gameOver() {
    clearInterval(gameLoop);
    gameRunning = false;
    alert(`游戏结束! 你的得分是: ${score}`);
    resetGame();
}

function resetGame() {
    snake = [{x: 10, y: 10}];
    direction = {x: 0, y: 0};
    nextDirection = {x: 0, y: 0};
    score = 0;
    scoreElement.textContent = score;
    gameSpeed = 150;
    generateFood();
}

function gameUpdate() {
    if (gamePaused) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    moveSnake();
    drawSnake();
    drawFood();
    
    // 更新方向
    direction = {...nextDirection};
}

function startGame() {
    if (gameRunning) return;
    gameRunning = true;
    gamePaused = false;
    resetGame();
    // 设置初始方向向右
    direction = {x: 1, y: 0};
    nextDirection = {x: 1, y: 0};
    gameLoop = setInterval(gameUpdate, gameSpeed);
}

function togglePause() {
    if (!gameRunning) return;
    gamePaused = !gamePaused;
    pauseBtn.textContent = gamePaused ? '继续' : '暂停';
}

// 键盘控制
document.addEventListener('keydown', e => {
    if (!gameRunning || gamePaused) return;
    
    switch(e.key) {
        case 'ArrowUp':
            if (direction.y === 0) nextDirection = {x: 0, y: -1};
            break;
        case 'ArrowDown':
            if (direction.y === 0) nextDirection = {x: 0, y: 1};
            break;
        case 'ArrowLeft':
            if (direction.x === 0) nextDirection = {x: -1, y: 0};
            break;
        case 'ArrowRight':
            if (direction.x === 0) nextDirection = {x: 1, y: 0};
            break;
    }
});

// 按钮控制
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);

// 初始化游戏
generateFood();

//在终端输入：（PS D:\PycharmProjects\try_cline>） start 2_snack/index.html
// （PS D:\PycharmProjects\try_cline>） start d:/PycharmProjects/try_cline/2_snack/index.html