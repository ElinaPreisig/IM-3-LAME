import { supa } from "../supabase.js";

let allefragen;
let momentaneFrage;
let momentaneFrageIndex=0;
let spielZeit;

document.addEventListener('DOMContentLoaded', (event) => {
    const jabutton = document.getElementById('jabutton');
    jabutton.addEventListener('click', checkanswerja);
    const neinbutton = document.getElementById('neinbutton');
    neinbutton.addEventListener('click', checkanswernein);
});


function checkanswerja(answer){

        checkanswer(true)
        console.log('checkanswerja')
}

function checkanswernein(answer){
    
    checkanswer(false)
    console.log('checkanswernein')
}


function checkanswer(answer) {
    // Div nach beantworten verschwinden
    var questionDiv = document.getElementById("question");
    questionDiv.style.display = "none";
    // if (userAnswer && userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
        if (answer==momentaneFrage.antwort) {
            // Richtige Antwort: Zeit abziehen (minus 5 Sekunden)
            seconds -= 5;
            if (seconds < 0) {
                seconds = 0;
            }
        } else {
            // Falsche Antwort: Zeit hinzufügen (plus 20 Sekunden)
            seconds += 20;
        }
        {
            // Aktualisierte Zeit anzeigen
            timer.textContent = `Zeit: ${seconds} Sekunden`;
        }
}





//this code gets the url parameter, which is the name of the quiz
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString)
const spielid = urlParams.get('spiel')
console.log(spielid);

//jetzt holen wir uns die Daten des Quizzes
//select
async function allefragenholen() {
    const { data, error } = await supa.from("Fragen").select().eq('quiz_id', `${spielid}`);
    return data;
  }
  
  console.log('allefragenholen', allefragenholen());

document.addEventListener("DOMContentLoaded", async function () {
    try {
        // Abrufen der Quiz-Daten aus Supabase
        const { data, error } = await supa
        .from('Quiz').select('*');

        if (error) {
            console.error('Fehler beim Abrufen von Quiz-Daten aus Supabase:', error);
        } else {
            const quizData = data[0]?.quizData || [];
            console.log('Quiz-Daten aus Supabase:', quizData);

            // Karten erstellen und anzeigen
        // const gameContainer = document.getElementById("game-container");
       // const cards = createCards();
       // cards.forEach(card => gameContainer.appendChild(card));
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
    card.style.backgroundImage = `url(img/LameMemory.jpeg)`;
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
       // pairsFound = 2; //Unbedingt SPàTER LÖSCHEN!èèèèè!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        if (pairsFound === 2) {
            // Nach zwei gefundenen Pärchen eine Frage anzeigen
            console.log('showQuestion')
            showQuestion();
            pairsFound = 0;
        }
        if (matchedPairs === images.length / 2) {
            clearInterval(timerInterval);
            showMessage(`Gratulation! Du hast es geschafft! Zeit: ${seconds} Sekunden`);
        }
    } else {
        card1.style.backgroundImage = `url(img/LameMemory.jpeg)`;
        card2.style.backgroundImage = `url(img/LameMemory.jpeg)`;
        card1.innerText = "";
        card2.innerText = "";
    }

    flippedCards = [];
    isCardFlipped = false;
}

// Definiton let spielZeit
// Funktion, um die Zeit aus dem Timer-Element abzurufen
function getTimerValue() {
    const timeText = timer.textContent;
    const secondsIndex = timeText.indexOf(':') + 2;
    return parseInt(timeText.substring(secondsIndex), 10);
}

// Hier wird die Zeit aus dem Timer abgerufen und in spielZeit gespeichert
spielZeit = getTimerValue();

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
    console.log('Vor saveGameData:', spielZeit);
    saveGameData(messageText);
}

// Function to save game data (time and player name) to the database
function saveGameData(messageText) {
    const playerName = prompt("Bitte gib deinen Namen ein:");

    if (!playerName) {
        return; // Wenn kein Spielername eingegeben wurde, breche ab
    }

console.log('In saveGameData:', spielZeit);
  
    // Hier wird die Zeit und der Spielername in die Datenbank gespeichert
    // const supa = supa.createClient('https://tenojoxlyquvqackgeif.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlbm9qb3hseXF1dnFhY2tnZWlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYzMTY3NzAsImV4cCI6MjAxMTg5Mjc3MH0.4ZX9-F1GNCgWSmLleh5QLyDNkE1MljglPV54eemu-2w');

    supa
        .from('Spielzeit') // Stelle sicher, dass dies auf deine Users-Tabelle in der Datenbank verweist
        .upsert([
            {
                name_user: playerName,
                name_game: messageText,// Hier speicherst du die erspielte Zeit
                spielzeit: spielZeit,
            }
        ])
        .then(() => {
            console.log('Spielzeit und Spielername erfolgreich gespeichert.');
        })
        .catch((error) => {
            console.error('Fehler beim Speichern der Spielzeit und des Spielername:', error);
        });
}

async function showQuestion() {
    // Erster Schritt Div zeigen
    var questionDiv = document.getElementById("question");
    questionDiv.style.display = "block";
    allefragen = await allefragenholen()
    console.log('alle fragen innerhalb von show questions', allefragen)
    const questionsatz = document.getElementById('satz')
    momentaneFrage = allefragen[momentaneFrageIndex]
    questionsatz.innerHTML = `${momentaneFrage.fragesatz}`
    momentaneFrageIndex++
}



// // Function to show a question in a pop-up
// function showQuestion() {
//     // Hier wird die Frage aus der Datenbank abgerufen und angezeigt
//     fetchRandomQuestion()
//         .then((questionData) => {
//             const questionText = questionData.fragesatz;
//             const correctAnswer = questionData.antwort;

//             const userAnswer = prompt(questionText);

//             if (userAnswer && userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
//                 // Richtige Antwort: Zeit abziehen (minus 5 Sekunden)
//                 seconds -= 5;
//                 if (seconds < 0) {
//                     seconds = 0;
//                 }
//             } else {
//                 // Falsche Antwort: Zeit hinzufügen (plus 20 Sekunden)
//                 seconds += 20;
//             }

//             // Aktualisierte Zeit anzeigen
//             timer.textContent = `Zeit: ${seconds} Sekunden`;
//         });
// }

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




