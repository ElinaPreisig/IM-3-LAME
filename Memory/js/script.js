const images = ["bild1.jpg", "bild2.jpg", "bild3.jpg", "bild4.jpg", "bild5.jpg", "bild6.jpg", "bild7.jpg", "bild8.jpg", "bild9.jpg", "bild10.jpg", "bild1.jpg", "bild2.jpg", "bild3.jpg", "bild4.jpg", "bild5.jpg", "bild6.jpg", "bild7.jpg", "bild8.jpg", "bild9.jpg", "bild10.jpg"];
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let pairsFound = 0;
let isCardFlipped = false;
let timerInterval;
let seconds = 0;

const gameContainer = document.getElementById("game-container");
const message = document.getElementById("message");
const timer = document.getElementById("timer");

// Shuffle the images
images.sort(() => Math.random() - 0.5);

// Create card elements
for (let i = 0; i < images.length; i++) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.image = images[i];
    card.dataset.index = i;

    // Set the back image for all cards
    card.style.backgroundImage = `url(card-back.jpg)`;
    card.innerText = "";

    card.addEventListener("click", flipCard);
    gameContainer.appendChild(card);
    cards.push(card);
}

// Function to flip a card
function flipCard() {
    if (isCardFlipped) return;

    const card = this;
    card.style.backgroundImage = `url(${card.dataset.image})`;
    card.innerText = "";

    flippedCards.push(card);

    if (flippedCards.length === 2) {
        isCardFlipped = true;
        setTimeout(checkMatch, 1000);
    }
}

// Function to check if two flipped cards match
function checkMatch() {
    const [card1, card2] = flippedCards;
    
    if (card1.dataset.image === card2.dataset.image) {
        card1.removeEventListener("click", flipCard);
        card2.removeEventListener("click", flipCard);
        matchedPairs++;
        pairsFound++;
        if (pairsFound === 2) {
            // Nach zwei gefundenen Pärchen eine Frage anzeigen
            showQuestion();
            pairsFound = 0;
        }
        if (matchedPairs === images.length / 2) {
            clearInterval(timerInterval);
            showMessage(`Gratulation! Du hast es geschafft! Zeit: ${seconds} Sekunden`);
        }
    } else {
        card1.style.backgroundImage = `url(card-back.jpg)`;
        card2.style.backgroundImage = `url(card-back.jpg)`;
        card1.innerText = "";
        card2.innerText = "";
    }

    flippedCards = [];
    isCardFlipped = false;
}

// Function to display a message in a pop-up
function showMessage(messageText) {
    const messageBox = document.createElement("div");
    messageBox.classList.add("message-box");
    const messageContent = document.createElement("div");
    messageContent.classList.add("message-content");
    messageContent.textContent = messageText;
    messageBox.appendChild(messageContent);
    document.body.appendChild(messageBox);
}

// Function to show a question in a pop-up
function showQuestion() {
    const questionText = "Gibt es den Studiengang Multimedia Production?";
    const correctAnswer = "Ja";

    const answer = prompt(questionText);

    if (answer && answer.toLowerCase() === correctAnswer.toLowerCase()) {
        // Richtige Antwort: Zeit abziehen (minus 15 Sekunden)
        seconds -= 15;
        if (seconds < 0) {
            seconds = 0;
        }
    } else {
        // Falsche Antwort: Zeit hinzufügen (plus 30 Sekunden)
        seconds += 30;
    }

    // Aktualisierte Zeit anzeigen
    timer.textContent = `Zeit: ${seconds} Sekunden`;
}

// Start the timer
timerInterval = setInterval(function() {
    seconds++;
    timer.textContent = `Zeit: ${seconds} Sekunden`;
}, 1000);
