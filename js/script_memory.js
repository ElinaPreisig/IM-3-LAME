import { supa } from "../supabase.js";


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


const images = ["img/bild1.jpg", "img/bild2.jpg", "img/bild3.jpg", "img/bild4.jpg", "img/bild5.jpg", "img/bild6.jpg", "img/bild7.jpg", "img/bild8.jpg", "img/bild9.jpg", "img/bild10.jpg", "img/bild1.jpg", "img/bild2.jpg", "img/bild3.jpg", "img/bild4.jpg", "img/bild5.jpg", "img/bild6.jpg", "img/bild7.jpg", "img/bild8.jpg", "img/bild9.jpg", "img/bild10.jpg"];
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
    card.style.backgroundImage = `url(img/card-back.jpg)`;
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
        card1.style.backgroundImage = `url(img/card-back.jpg)`;
        card2.style.backgroundImage = `url(img/card-back.jpg)`;
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

    // Hier wird die Zeit und der Spielername in die Datenbank gespeichert
    saveGameData(messageText);
}

// Function to save game data (time and player name) to the database
function saveGameData(messageText) {
    const playerName = prompt("Bitte gib deinen Namen ein:");

    if (!playerName) {
        return; // Wenn kein Spielername eingegeben wurde, breche ab
    }

    // Hier wird die Zeit und der Spielername in die Datenbank gespeichert
    const supabase = supabase.createClient('https://tenojoxlyquvqackgeif.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlbm9qb3hseXF1dnFhY2tnZWlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYzMTY3NzAsImV4cCI6MjAxMTg5Mjc3MH0.4ZX9-F1GNCgWSmLleh5QLyDNkE1MljglPV54eemu-2w');

    supabase
        .from('users') // Stelle sicher, dass dies auf deine Users-Tabelle in der Datenbank verweist
        .upsert([
            {
                spieler_name: playerName,
                persönliche_bestzeit: messageText, // Hier speicherst du die erspielte Zeit
            }
        ])
        .then(() => {
            console.log('Spielzeit und Spielername erfolgreich gespeichert.');
        })
        .catch((error) => {
            console.error('Fehler beim Speichern der Spielzeit und des Spielername:', error);
        });
}

// Function to show a question in a pop-up
function showQuestion() {
    // Hier wird die Frage aus der Datenbank abgerufen und angezeigt
    fetchRandomQuestion()
        .then((questionData) => {
            const questionText = questionData.fragesatz;
            const correctAnswer = questionData.antwort;

            const userAnswer = prompt(questionText);

            if (userAnswer && userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
                // Richtige Antwort: Zeit abziehen (minus 5 Sekunden)
                seconds -= 5;
                if (seconds < 0) {
                    seconds = 0;
                }
            } else {
                // Falsche Antwort: Zeit hinzufügen (plus 20 Sekunden)
                seconds += 20;
            }

            // Aktualisierte Zeit anzeigen
            timer.textContent = `Zeit: ${seconds} Sekunden`;
        });
}

// Start the timer
timerInterval = setInterval(function () {
    seconds++;
    timer.textContent = `Zeit: ${seconds} Sekunden`;
}, 1000);

// Funktion, um eine zufällige Frage aus der Datenbank abzurufen
function fetchRandomQuestion() {
    return fetch('/get-random-question') // Hier sollte der Endpunkt für die Abfrage der Frage aus der Datenbank stehen
        .then((response) => response.json());
}
