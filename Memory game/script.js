const cards = ["🍇", "🍍", "🥑", "🍐", "🍎", "🍒"];


const doubleCards = [...cards, ...cards].sort(() => 0.5 - Math.random());

const gameBord = document.getElementById('gameBord');
const scoreDisplay = document.getElementById('score');
const winMessage = document.getElementById('winMessage')
const restartBtn = document.querySelector(".restart");
const moves = document.querySelector(".move");

let score = 0;
let firstCard = null;
let lockBord = 0;
let matchesFound = 0;
let move = 0;
const totalPairs = cards.length;
let timer;

doubleCards.forEach(cards => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.cards = cards;
    card.textContent = '❓';
    card.onclick = () => flipCard(card);
    gameBord.appendChild(card);
});

function flipCard(card) {
    if (lockBord || card.classList.contains
        ('flipCard') || card.classList.contains('matched'))
        return;


    card.classList.add('flipCard');
    card.textContent = card.dataset.cards;

    if (!firstCard) {
        firstCard = card;
    } else {
        lockBord = true;
        move++;
        moves.innerText = `Moves: ${move}`
        if (firstCard.dataset.cards === card.dataset.cards) {
            firstCard.classList.add('matched');
            card.classList.add('matched');
            score++;
            matchesFound++;
            // firstCard.style.display = "none"
            // card.style.display = "none"
            scoreDisplay.textContent = score;

            if (matchesFound === totalPairs) {
                winMessage.style.display = 'block';
                clearInterval(timer);

            }
            resetTurn();

        } else {
            setTimeout(() => {
                firstCard.classList.remove('flipCard');
                card.classList.remove('flipCard');
                firstCard.textContent = '❓';
                card.textContent = '❓';
                resetTurn();
            }, 800);
        }
    }
}

function resetTurn() {
    [firstCard, lockBord] = [null, false]

}

// re started 
restartBtn.addEventListener("click", () => {
    move = 0;
    moves.textContent = move;
    location.reload();
});



document.addEventListener('DOMContentLoaded', function () {
    const progressBar = document.getElementById('progressBar');
    const timerDisplay = document.getElementById('timerDisplay');
    const totalTime = 60;
    let timeRemaining = totalTime;

    timer = setInterval(() => {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        const progressPercentage = (timeRemaining / totalTime) * 100;
        progressBar.style.width = `${progressPercentage}%`;

        if (timeRemaining < 0) {
            clearInterval(timer);
            timerDisplay.textContent = alert("Time's Up!");
            progressBar.style.width = '0%';

            document.querySelectorAll(".card").forEach(card => {
                card.style.pointerEvents = "none";
            });
        } else {
            timeRemaining--;
        }
    }, 700);

});
