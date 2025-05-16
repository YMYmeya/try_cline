// 游戏状态
const gameState = {
    currentScreen: 'main-menu',
    operation: null,
    questionCount: 0,
    currentQuestion: 1,
    correctAnswers: 0,
    startTime: null,
    endTime: null,
    questions: []
};

// DOM元素
const elements = {
    mainMenu: document.getElementById('main-menu'),
    countSelection: document.getElementById('count-selection'),
    quizScreen: document.getElementById('quiz-screen'),
    resultScreen: document.getElementById('result-screen'),
    questionElement: document.getElementById('question'),
    optionsContainer: document.getElementById('options'),
    timerElement: document.getElementById('timer'),
    progressElement: document.getElementById('progress'),
    timeResult: document.getElementById('time-result'),
    totalQuestions: document.getElementById('total-questions'),
    correctAnswers: document.getElementById('correct-answers'),
    accuracy: document.getElementById('accuracy')
};

// 初始化游戏
function initGame() {
    // 操作选择按钮
    document.querySelectorAll('.operation-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            gameState.operation = e.target.dataset.operation;
            showScreen('count-selection');
        });
    });

    // 题目数量选择按钮
    document.querySelectorAll('.count-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            gameState.questionCount = parseInt(e.target.dataset.count);
            startQuiz();
        });
    });

    // 再来一局按钮
    document.getElementById('play-again').addEventListener('click', () => {
        startQuiz();
    });

    // 结束游戏按钮
    document.getElementById('end-game').addEventListener('click', () => {
        showScreen('main-menu');
    });
}

// 显示指定界面
function showScreen(screenId) {
    elements.mainMenu.classList.add('hidden');
    elements.countSelection.classList.add('hidden');
    elements.quizScreen.classList.add('hidden');
    elements.resultScreen.classList.add('hidden');

    gameState.currentScreen = screenId;
    document.getElementById(screenId).classList.remove('hidden');
}

// 开始答题
function startQuiz() {
    gameState.currentQuestion = 1;
    gameState.correctAnswers = 0;
    gameState.questions = generateQuestions();
    gameState.startTime = new Date();
    
    showScreen('quiz-screen');
    updateTimer();
    showQuestion();
}

// 生成题目
function generateQuestions() {
    const questions = [];
    for (let i = 0; i < gameState.questionCount; i++) {
        let a = Math.floor(Math.random() * 9) + 1;
        let b = Math.floor(Math.random() * 9) + 1;
        let answer;

        switch (gameState.operation) {
            case 'add':
                answer = a + b;
                questions.push({ a, b, operation: '+', answer });
                break;
            case 'subtract':
                // 确保减法结果为正数
                if (a < b) [a, b] = [b, a];
                answer = a - b;
                questions.push({ a, b, operation: '-', answer });
                break;
            case 'multiply':
                answer = a * b;
                questions.push({ a, b, operation: '×', answer });
                break;
        }
    }
    return questions;
}

// 显示当前题目
function showQuestion() {
    const question = gameState.questions[gameState.currentQuestion - 1];
    elements.questionElement.textContent = `${question.a} ${question.operation} ${question.b} = ?`;
    elements.progressElement.textContent = `题目: ${gameState.currentQuestion}/${gameState.questionCount}`;

    // 生成选项
    elements.optionsContainer.innerHTML = '';
    const options = generateOptions(question.answer);
    options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.addEventListener('click', () => checkAnswer(option, question.answer));
        elements.optionsContainer.appendChild(button);
    });
}

// 生成选项（包含正确答案和3个随机错误答案）
function generateOptions(correctAnswer) {
    const options = [correctAnswer];
    while (options.length < 4) {
        const randomAnswer = Math.floor(Math.random() * 19) + 1; // 1-19之间的随机数
        if (!options.includes(randomAnswer)) {
            options.push(randomAnswer);
        }
    }
    return shuffleArray(options);
}

// 检查答案
function checkAnswer(selectedAnswer, correctAnswer) {
    const buttons = elements.optionsContainer.querySelectorAll('button');
    let isCorrect = selectedAnswer === correctAnswer;

    if (isCorrect) {
        gameState.correctAnswers++;
    }

    // 标记答案对错
    buttons.forEach(button => {
        button.disabled = true;
        const optionValue = parseInt(button.textContent);
        const mark = document.createElement('span');
        mark.style.marginLeft = '10px';
        
        if (optionValue === correctAnswer) {
            button.classList.add('correct');
            mark.textContent = '✓';
        } else if (optionValue === selectedAnswer && !isCorrect) {
            button.classList.add('incorrect');
            mark.textContent = '✗';
        }
        
        if (mark.textContent) {
            button.appendChild(mark);
        }
    });

    // 延迟后进入下一题或显示结果
    setTimeout(() => {
        if (gameState.currentQuestion < gameState.questionCount) {
            gameState.currentQuestion++;
            showQuestion();
        } else {
            showResults();
        }
    }, 1000);
}

// 显示结果
function showResults() {
    gameState.endTime = new Date();
    const timeSpent = Math.floor((gameState.endTime - gameState.startTime) / 1000);
    const accuracy = Math.round((gameState.correctAnswers / gameState.questionCount) * 100);

    elements.timeResult.textContent = `答题时长: ${timeSpent}秒`;
    elements.totalQuestions.textContent = `题目总数: ${gameState.questionCount}`;
    elements.correctAnswers.textContent = `答对数量: ${gameState.correctAnswers}`;
    elements.accuracy.textContent = `正确率: ${accuracy}%`;

    showScreen('result-screen');
}

// 更新计时器
function updateTimer() {
    if (gameState.currentScreen !== 'quiz-screen') return;

    const currentTime = new Date();
    const seconds = Math.floor((currentTime - gameState.startTime) / 1000);
    elements.timerElement.textContent = `时间: ${seconds}秒`;

    setTimeout(updateTimer, 1000);
}

// 数组洗牌
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 启动游戏
document.addEventListener('DOMContentLoaded', initGame);
// PS D:\PycharmProjects\try_cline> start 5_math/index.html