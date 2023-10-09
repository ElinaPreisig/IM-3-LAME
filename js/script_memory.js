const supabaseUrl = 'https://tenojoxlyquvqackgeif.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlbm9qb3hseXF1dnFhY2tnZWlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYzMTY3NzAsImV4cCI6MjAxMTg5Mjc3MH0.4ZX9-F1GNCgWSmLleh5QLyDNkE1MljglPV54eemu-2w'
const supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", async function () {
    try {
        // Abrufen der Quiz-Daten aus Supabase
        const { data, error } = await supabase.from('quizzes').select('*');

        if (error) {
            console.error('Fehler beim Abrufen von Quiz-Daten aus Supabase:', error);
        } else {
            const quizData = data[0]?.quizData || [];
            console.log('Quiz-Daten aus Supabase:', quizData);

            // Karten erstellen und anzeigen
            const gameContainer = document.getElementById("game-container");
            const cards = createCards();
            cards.forEach(card => gameContainer.appendChild(card));
        }
    } catch (error) {
        console.error('Ein unerwarteter Fehler ist aufgetreten:', error);
    }
});

function createCards() {
    const images = ["img/bild1.jpg", "img/bild2.jpg", "img/bild3.jpg", "img/bild4.jpg", "img/bild5.jpg", "img/bild6.jpg", "img/bild7.jpg", "img/bild8.jpg", "img/bild9.jpg", "img/bild10.jpg", "img/bild1.jpg", "img/bild2.jpg", "img/bild3.jpg", "img/bild4.jpg", "img/bild5.jpg", "img/bild6.jpg", "img/bild7.jpg", "img/bild8.jpg", "img/bild9.jpg", "img/bild10.jpg"];
    const cards = [];

    // Shuffle the images
    images.sort(() => Math.random() - 0.5);

    // Create card elements
    for (let i = 0; i < images.length; i++) {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.image = images[i];
        card.dataset.index = i;

        // Set the back image for all cards
        card.style.backgroundImage = 'url("card-back.jpg")'; // Passe dies entsprechend an deinem Dateipfad an
        card.innerText = "";

        card.addEventListener("click", flipCard);
        cards.push(card);
    }

    return cards;
}

let flippedCards = [];
let matchedPairs = 0;
let pairsFound = 0;
let isCardFlipped = false;
let timerInterval;
let seconds = 0;

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
        card1.style.backgroundImage = 'url("card-back.jpg")';
        card2.style.backgroundImage = 'url("card-back.jpg")';
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
async function showQuestion() {
    try {
        // Annahme: Die Quiz-Fragen sind in Supabase gespeichert
        const { data, error } = await supabase.from('quizzes').select('*');

        if (error) {
            console.error('Fehler beim Abrufen von Quiz-Daten aus Supabase:', error);
            return;
        }

        const quizData = data[0]?.quizData || [];
        const randomQuestion = quizData[Math.floor(Math.random() * quizData.length)];

        const questionContainer = document.getElementById("question-container");
        questionContainer.innerHTML = `
            <div class="message-box">
                <div class="message-content">
                    <p>${randomQuestion.question}</p>
                    <button id="answer-yes">Ja</button>
                    <button id="answer-no">Nein</button>
                </div>
            </div>
        `;

        const answerYesButton = document.getElementById("answer-yes");
        const answerNoButton = document.getElementById("answer-no");

        answerYesButton.addEventListener("click", function () {
            handleAnswer(randomQuestion, "Ja");
        });

        answerNoButton.addEventListener("click", function () {
            handleAnswer(randomQuestion, "Nein");
        });
    } catch (error) {
        console.error('Ein unerwarteter Fehler ist aufgetreten:', error);
    }
}

// Function to handle user's answer
function handleAnswer(question, userAnswer) {
    const correctAnswer = question.answer;

    if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
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

    // Fragen-Container leeren
    const questionContainer = document.getElementById("question-container");
    questionContainer.innerHTML = "";

    // Weitere Logik hier, wenn benötigt
}

// Start the timer
timerInterval = setInterval(function() {
    seconds++;
    timer.textContent = `Zeit: ${seconds} Sekunden`;
}, 1000);
