let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 300;
let timer;

const questionContainer = document.getElementById('question-container');
const timerElement = document.getElementById('timer');
const scoreElement = document.getElementById('score');
const nextButton = document.getElementById('next-btn');
const restartButton = document.getElementById('restart-btn');
const dropdownContainer = document.getElementById('dropdown-container');
const startButton = document.getElementById('start-btn');
const categorySelect = document.getElementById('category-select');

// Fisher-Yates shuffle function
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

async function fetchQuestions(category) {
    const response = await fetch(category);
    questions = await response.json();
    shuffleArray(questions); // Randomize questions
    startGame();
}

function startGame() {
    currentQuestionIndex = 0;
    score = 0;
    timeLeft = 300;
    scoreElement.textContent = `Score: ${score}`;
    dropdownContainer.style.display = 'none';
    questionContainer.style.display = 'block';
    scoreElement.style.display = 'block';
    timerElement.style.display = 'block';
    restartButton.style.display = 'block';
    startTimer();
    setNextQuestion();
}

function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `Time: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}

function setNextQuestion() {
    resetState();
    showQuestion(questions[currentQuestionIndex]);
}

function showQuestion(question) {
    const shuffledOptions = [...question.options];
    shuffleArray(shuffledOptions); // Randomize options
    const questionElement = document.createElement('div');
    questionElement.classList.add('question');
    questionElement.innerText = question.question;
    questionContainer.appendChild(questionElement);

    shuffledOptions.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option;
        button.classList.add('option');
        button.addEventListener('click', selectAnswer);
        questionContainer.appendChild(button);
    });

    nextButton.style.display = 'none'; // Hide next button initially
}

function resetState() {
    while (questionContainer.firstChild) {
        questionContainer.removeChild(questionContainer.firstChild);
    }
}

function selectAnswer(e) {
    const selectedOption = e.target;
    const correct = questions[currentQuestionIndex].answer;
    if (selectedOption.innerText === correct) {
        score++;
    }
    scoreElement.textContent = `Score: ${score}`;

    // Disable all options after an answer is selected
    const optionButtons = document.querySelectorAll('.option');
    optionButtons.forEach(button => {
        button.disabled = true;
    });

    nextButton.style.display = 'block'; // Show next button after selecting an answer
}

function endGame() {
    questionContainer.innerHTML = `<h2>Game Over!</h2><p>Your score is: ${score}</p>`;
    clearInterval(timer);
}

nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        setNextQuestion();
    } else {
        endGame();
    }
});

restartButton.addEventListener('click', () => {
    dropdownContainer.style.display = 'block';
    questionContainer.style.display = 'none';
    scoreElement.style.display = 'none';
    timerElement.style.display = 'none';
    nextButton.style.display = 'none';
    restartButton.style.display = 'none';
    score = 0;
    scoreElement.textContent = `Score: ${score}`;
    clearInterval(timer);
});

startButton.addEventListener('click', () => {
    const selectedCategory = categorySelect.value;
    if (selectedCategory) {
        fetchQuestions(selectedCategory);
    }
});

// Initial state
questionContainer.style.display = 'none';
scoreElement.style.display = 'none';
timerElement.style.display = 'none';
nextButton.style.display = 'none';
restartButton.style.display = 'none';
