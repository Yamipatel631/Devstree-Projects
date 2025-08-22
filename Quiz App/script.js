const allQuestions = [
    {
        question: "What is the capital of France?",
        answers: ["Berlin", "Madrid", "Paris", "Rome"],
        correct: 2
    },
    {
        question: "Which language runs in a web browser?",
        answers: ["Java", "C", "Python", "JavaScript"],
        correct: 3
    },
    {
        question: "What does CSS stand for?",
        answers: ["Central Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Creative Style Sheets"],
        correct: 1
    },
    {
        question: "Which HTML tag is used to define an internal style sheet?",
        answers: ["<style>", "<script>", "<css>", "<link>"],
        correct: 0
    },
    {
        question: "Inside which HTML element do we put the JavaScript?",
        answers: ["<js>", "<javascript>", "<script>", "<scripting>"],
        correct: 2
    },
    {
        question: "What does HTML stand for?",
        answers: ["Hyper Tool Markup Language", "Hyper Text Markup Language", "Hyperlinks Text Mark Language", "Home Tool Markup Language"],
        correct: 1
    },
    {
        question: "How do you write 'Hello World' in an alert box?",
        answers: ["msgBox('Hello World');", "alertBox('Hello World');", "msg('Hello World');", "alert('Hello World');"],
        correct: 3
    },
    {
        question: "Which property is used to change the background color?",
        answers: ["color", "bgcolor", "background-color", "background"],
        correct: 2
    },
    {
        question: "Which is the correct CSS syntax?",
        answers: ["{body:color=black;}", "body {color: black;}", "body:color=black;", "{body;color:black;}"],
        correct: 1
    },
    {
        question: "How do you create a function in JavaScript?",
        answers: ["function:myFunction()", "function = myFunction()", "function myFunction()", "def myFunction()"],
        correct: 2
    }
];

const startBtn = document.querySelector(".start");
const submitBtn = document.querySelector(".submit");
const nextBtn = document.querySelector(".next");
const restartBtn = document.querySelector(".restart");

const questionEl = document.querySelector(".question");
const answerWrapper = document.querySelector(".answer-wrapper");
const currentEl = document.querySelector(".current");
const totalEl = document.querySelector(".total");
const finalScoreEl = document.querySelector(".final-score");
const totalScoreEl = document.querySelector(".total-score");
const timerBar = document.querySelector(".progress-bar");
const timerText = document.querySelector(".progress-text");

const startScreen = document.querySelector(".start-screen");
const quizScreen = document.querySelector(".Quiz");
const endScreen = document.querySelector(".end-screen");

const questionCountSelect = document.getElementById("num0questions");
const timePerQuestionSelect = document.getElementById("time");

let questions = [];
let currentIndex = 0;
let score = 0;
let selectedAnswer = null;
let totalQuestions = 10;
let timePerQuestion = 10;
let timerInterval;
let timerValue;

startBtn.addEventListener("click", () => {
    totalQuestions = parseInt(questionCountSelect.value);
    timePerQuestion = parseInt(timePerQuestionSelect.value);
    questions = shuffleArray([...allQuestions]).slice(0, totalQuestions);
    startScreen.style.display = "none";
    quizScreen.style.display = "block";
    totalEl.textContent = `/${totalQuestions}`;
    loadQuestion();
});

submitBtn.addEventListener("click", () => {
    const answers = document.querySelectorAll(".answer");
    answers.forEach((el, index) => {
        el.classList.remove("selected");
        if (index === questions[currentIndex].correct) {
            el.classList.add("correct");
        } else {
            el.classList.add("wrong");
        }
    });

    if (selectedAnswer === questions[currentIndex].correct) {
        score++;
    }

    clearInterval(timerInterval);
    nextBtn.style.display = "block";
    submitBtn.style.display = "none";
});

nextBtn.addEventListener("click", () => {
    currentIndex++;
    if (currentIndex >= totalQuestions) {
        showEndScreen();
    } else {
        loadQuestion();
    }
});

restartBtn.addEventListener("click", () => {
    location.reload();
});



answerWrapper.addEventListener("click", (e) => {
    const target = e.target.closest(".answer");
    if (!target || nextBtn.style.display === "block") return;

    // Remove 'selected' from all answers
    const answers = document.querySelectorAll(".answer");
    answers.forEach(a => a.classList.remove("selected"));

    // Add 'selected' to clicked one
    target.classList.add("selected");

    // Remember selected answer index
    selectedAnswer = [...answers].indexOf(target);
});

function loadQuestion() {
    resetState();
    const questionData = questions[currentIndex];
    questionEl.textContent = questionData.question;
    currentEl.textContent = currentIndex + 1;

    questionData.answers.forEach((answer) => {
        const div = document.createElement("div");
        div.classList.add("answer");

        const textSpan = document.createElement("span");
        textSpan.classList.add("text");
        textSpan.textContent = answer;

        const checkboxSpan = document.createElement("span");
        checkboxSpan.classList.add("checkbox");
        checkboxSpan.innerHTML = `<span class="icon">✓</span>`;

        div.appendChild(textSpan);
        div.appendChild(checkboxSpan);
        answerWrapper.appendChild(div);
    });

    startTimer();
}

function resetState() {
    clearInterval(timerInterval);
    selectedAnswer = null;
    nextBtn.style.display = "none";
    submitBtn.style.display = "block";
    answerWrapper.innerHTML = "";
}

function showEndScreen() {
    quizScreen.style.display = "none";
    endScreen.style.display = "block";
    finalScoreEl.textContent = score;
    totalScoreEl.textContent = `/${totalQuestions}`;
}

function startTimer() {
    timerValue = timePerQuestion;
    timerText.textContent = timerValue;
    timerBar.style.width = "100%";
    const step = 100 / timePerQuestion;
    let width = 100;

    timerInterval = setInterval(() => {
        timerValue--;
        width -= step;
        timerText.textContent = timerValue;
        timerBar.style.width = `${width}%`;

        if (timerValue <= 0) {
            clearInterval(timerInterval);
            submitBtn.click();
        }
    }, 1000);
}

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}
