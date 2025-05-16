// 游戏状态
const gameState = {
    maze: null,
    player: { x: 1, y: 1 },
    exit: null,
    timer: 0,
    timerInterval: null,
    canvas: null,
    ctx: null,
    cellSize: 30
};

// 初始化游戏
function initGame() {
    gameState.canvas = document.getElementById('maze-canvas');
    gameState.ctx = gameState.canvas.getContext('2d');
    // 根据迷宫尺寸设置canvas大小
    const mazeWidth = 15;
    const mazeHeight = 15;
    gameState.canvas.width = mazeWidth * gameState.cellSize;
    gameState.canvas.height = mazeHeight * gameState.cellSize;
    
    // 按钮事件监听
    document.getElementById('start-btn').addEventListener('click', startGame);
    document.getElementById('restart-btn').addEventListener('click', restartGame);
    document.getElementById('exit-btn').addEventListener('click', exitGame);
    
    // 键盘事件监听
    document.addEventListener('keydown', handleKeyPress);
}

// 生成随机迷宫
function generateMaze() {
    const width = 15;
    const height = 15;
    const maze = Array(height).fill().map(() => Array(width).fill(1));
    
    // 简单迷宫生成算法
    for (let y = 1; y < height - 1; y += 2) {
        for (let x = 1; x < width - 1; x += 2) {
            maze[y][x] = 0;
            if (x > 1 && Math.random() > 0.3) maze[y][x-1] = 0;
            if (y > 1 && Math.random() > 0.3) maze[y-1][x] = 0;
        }
    }
    
    // 设置出口
    maze[height-2][width-2] = 2;
    gameState.exit = { x: width-2, y: height-2 };
    
    return maze;
}

// 绘制迷宫
function drawMaze() {
    gameState.ctx.clearRect(0, 0, gameState.canvas.width, gameState.canvas.height);
    
    for (let y = 0; y < gameState.maze.length; y++) {
        for (let x = 0; x < gameState.maze[0].length; x++) {
            if (gameState.maze[y][x] === 1) {
                gameState.ctx.fillStyle = '#333';
                gameState.ctx.fillRect(x * gameState.cellSize, y * gameState.cellSize, 
                                      gameState.cellSize, gameState.cellSize);
            } else if (gameState.maze[y][x] === 2) {
                gameState.ctx.fillStyle = 'red';
                gameState.ctx.fillRect(x * gameState.cellSize, y * gameState.cellSize, 
                                      gameState.cellSize, gameState.cellSize);
            }
        }
    }
    
    // 绘制玩家(圆形)
    gameState.ctx.fillStyle = 'blue';
    gameState.ctx.beginPath();
    gameState.ctx.arc(
        (gameState.player.x + 0.5) * gameState.cellSize,
        (gameState.player.y + 0.5) * gameState.cellSize,
        gameState.cellSize * 0.4,
        0,
        Math.PI * 2
    );
    gameState.ctx.fill();
}

// 开始游戏
function startGame() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    
    gameState.maze = generateMaze();
    gameState.player = { x: 1, y: 1 };
    gameState.timer = 0;
    updateTimer();
    
    gameState.timerInterval = setInterval(() => {
        gameState.timer++;
        updateTimer();
    }, 1000);
    
    drawMaze();
}

// 重新开始游戏
function restartGame() {
    document.getElementById('end-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    
    gameState.maze = generateMaze();
    gameState.player = { x: 1, y: 1 };
    gameState.timer = 0;
    updateTimer();
    
    if (!gameState.timerInterval) {
        gameState.timerInterval = setInterval(() => {
            gameState.timer++;
            updateTimer();
        }, 1000);
    }
    
    drawMaze();
}

// 结束游戏
function exitGame() {
    clearInterval(gameState.timerInterval);
    gameState.timerInterval = null;
    
    document.getElementById('end-screen').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');
}

// 更新计时器显示
function updateTimer() {
    document.getElementById('timer').textContent = `时间: ${gameState.timer}秒`;
}

// 处理键盘输入
function handleKeyPress(e) {
    if (!gameState.maze) return;
    
    let newX = gameState.player.x;
    let newY = gameState.player.y;
    
    switch(e.key) {
        case 'ArrowUp': newY--; break;
        case 'ArrowDown': newY++; break;
        case 'ArrowLeft': newX--; break;
        case 'ArrowRight': newX++; break;
        default: return;
    }
    
    // 检查移动是否有效
    if (newX >= 0 && newX < gameState.maze[0].length && 
        newY >= 0 && newY < gameState.maze.length && 
        gameState.maze[newY][newX] !== 1) {
        
        gameState.player.x = newX;
        gameState.player.y = newY;
        drawMaze();
        
        // 检查是否到达出口
        if (newX === gameState.exit.x && newY === gameState.exit.y) {
            clearInterval(gameState.timerInterval);
            gameState.timerInterval = null;
            
            document.getElementById('game-screen').classList.add('hidden');
            document.getElementById('end-screen').classList.remove('hidden');
            document.getElementById('result-text').textContent = 
                `恭喜！你花费了${gameState.timer}秒走出迷宫`;
        }
    }
}

// 初始化游戏
window.onload = initGame;
// PS D:\PycharmProjects\try_cline> start 4_migong/index.html