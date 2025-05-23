// DOM Elements
const menuScreen = document.getElementById('menu-screen');
const countScreen = document.getElementById('count-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const feedbackEl = document.getElementById('feedback');
const statsEl = document.getElementById('stats');
const restartBtn = document.getElementById('restart-btn');
const exitBtn = document.getElementById('exit-btn');

// Game state
let currentOperation = '';
let questionCount = 0;
let currentQuestion = 0;
let correctAnswers = 0;
let startTime = 0;
let timerInterval = null;
let questions = [];

// Initialize game
function init() {
    // Menu screen buttons
    document.querySelectorAll('.operation-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentOperation = btn.dataset.operation;
            menuScreen.classList.add('hidden');
            countScreen.classList.remove('hidden');
        });
    });

    // Count selection buttons
    document.querySelectorAll('.count-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            questionCount = parseInt(btn.dataset.count);
            startGame();
        });
    });

    // Restart and exit buttons
    restartBtn.addEventListener('click', restartGame);
    exitBtn.addEventListener('click', exitGame);
}

// Start game with selected operation and count
function startGame() {
    countScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    
    // Generate questions
    questions = generateQuestions(currentOperation, questionCount);
    currentQuestion = 0;
    correctAnswers = 0;
    startTime = Date.now();
    
    // Start timer
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
    
    showQuestion();
}

// Generate questions based on operation
function generateQuestions(operation, count) {
    const questions = [];
    for (let i = 0; i < count; i++) {
        let question;
        switch (operation) {
            case 'add':
                question = generateAdditionQuestion();
                break;
            case 'subtract':
                question = generateSubtractionQuestion();
                break;
            case 'multiply':
                question = generateMultiplicationQuestion();
                break;
            case 'divide':
                question = generateDivisionQuestion();
                break;
        }
        questions.push(question);
    }
    return questions;
}

// Question generators
function generateAdditionQuestion() {
    const a = Math.floor(Math.random() * 90) + 10; // 10-99
    const b = Math.floor(Math.random() * 90) + 10; // 10-99
    const answer = a + b;
    const options = generateOptions(answer);
    return {
        text: `${a} + ${b} = ?`,
        answer: answer,
        options: options
    };
}

function generateSubtractionQuestion() {
    const a = Math.floor(Math.random() * 90) + 10; // 10-99
    const b = Math.floor(Math.random() * 90) + 10; // 10-99
    // Ensure result is positive
    const [num1, num2] = a > b ? [a, b] : [b, a];
    const answer = num1 - num2;
    const options = generateOptions(answer);
    return {
        text: `${num1} - ${num2} = ?`,
        answer: answer,
        options: options
    };
}

function generateMultiplicationQuestion() {
    const a = Math.floor(Math.random() * 90) + 10; // 10-99
    const b = Math.floor(Math.random() * 9) + 1; // 1-9
    const answer = a * b;
    const options = generateOptions(answer);
    return {
        text: `${a} × ${b} = ?`,
        answer: answer,
        options: options
    };
}

function generateDivisionQuestion() {
    const b = Math.floor(Math.random() * 9) + 1; // 1-9
    const answer = Math.floor(Math.random() * 10) + 1; // 1-10
    const a = answer * b;
    const options = generateOptions(answer);
    return {
        text: `${a} ÷ ${b} = ?`,
        answer: answer,
        options: options
    };
}

// Generate multiple choice options
function generateOptions(correctAnswer) {
    const options = [correctAnswer];
    while (options.length < 4) {
        const randomOption = correctAnswer + Math.floor(Math.random() * 10) - 5;
        if (randomOption !== correctAnswer && !options.includes(randomOption)) {
            options.push(randomOption);
        }
    }
    return shuffleArray(options);
}

// Shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Show current question
function showQuestion() {
    const question = questions[currentQuestion];
    questionEl.textContent = question.text;
    optionsEl.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.textContent = option;
        btn.addEventListener('click', () => checkAnswer(option, question.answer));
        optionsEl.appendChild(btn);
    });
    
    feedbackEl.textContent = '';
}

// Check answer
function checkAnswer(selected, correct) {
    if (selected === correct) {
        feedbackEl.textContent = '✓';
        feedbackEl.className = 'correct';
        correctAnswers++;
    } else {
        feedbackEl.textContent = '✗';
        feedbackEl.className = 'incorrect';
    }
    
    // Highlight correct answer
    Array.from(optionsEl.children).forEach(btn => {
        if (parseInt(btn.textContent) === correct) {
            btn.classList.add('correct');
        }
    });
    
    // Move to next question or show results
    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < questions.length) {
            showQuestion();
        } else {
            showResults();
        }
    }, 1000);
}

// Update timer
function updateTimer() {
    // Timer is displayed in results
}

// Show results
function showResults() {
    clearInterval(timerInterval);
    gameScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    
    const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
    const accuracy = Math.round((correctAnswers / questionCount) * 100);
    
    statsEl.innerHTML = `
        <div>答题时长: ${timeElapsed}秒</div>
        <div>题目总数: ${questionCount}</div>
        <div>答对数量: ${correctAnswers}</div>
        <div>正确率: ${accuracy}%</div>
    `;
}

// Restart game with same settings
function restartGame() {
    resultScreen.classList.add('hidden');
    startGame();
}

// Exit to menu
function exitGame() {
    resultScreen.classList.add('hidden');
    menuScreen.classList.remove('hidden');
}

// Start the game
init();
