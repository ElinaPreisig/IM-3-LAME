import { supa } from "../supabase.js";

let allefragen;
let momentaneFrage;
let momentaneFrageIndex = 0;
let spielZeit;
let playerName;
let lastSavedId; // Neue Variable, um die zuletzt gespeicherte ID zu speichern

var lastquestion = document.getElementById('last-question');
lastquestion.style.display = 'none';

document.addEventListener('DOMContentLoaded', (event) => {
    const jabutton = document.getElementById('jabutton');
    jabutton.addEventListener('click', checkanswerja);
    const neinbutton = document.getElementById('neinbutton');
    neinbutton.addEventListener('click', checkanswernein);
    console.log('DOMContentLoaded');
});

function checkanswerja(answer) {
    checkanswer(true);
    console.log('checkanswerja');
    if (matchedPairs === 10) {
        showCongratulations();
        console.log('showCongratulations');
    }
}

function checkanswernein(answer) {
    checkanswer(false);
    console.log('checkanswernein');
    if (matchedPairs === 10) {
        showCongratulations();
        console.log('showCongratulations');
    }
}

function checkanswer(answer) {
    var questionDiv = document.getElementById("question");
    questionDiv.style.display = "none";

    if (answer == momentaneFrage.antwort) {
        seconds -= 5;
        if (seconds < 0) {
            seconds = 0;
        }
    } else {
        seconds += 20;
    }

    timer.textContent = `Zeit: ${seconds} Sekunden`;
    console.log('checkanswer');
}

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const spielid = urlParams.get('spiel');
console.log(spielid);

async function allefragenholen() {
    const { data, error } = await supa.from("Fragen").select().eq('quiz_id', `${spielid}`);
    return data;
}

document.addEventListener("DOMContentLoaded", async function () {
    try {
        const { data, error } = await supa.from('Quiz').select('*');

        if (error) {
            console.error('Fehler beim Abrufen von Quiz-Daten aus Supabase:', error);
        } else {
            const quizData = data[0]?.quizData || [];
            console.log('Quiz-Daten aus Supabase:', quizData);
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

images.sort(() => Math.random() - 0.5);

for (let i = 0; i < images.length; i++) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.image = images[i];
    card.dataset.index = i;

    card.style.backgroundImage = `url(img/LameMemory.jpeg)`;
    card.innerText = "";

    card.addEventListener("click", flipCard);
    gameContainer.appendChild(card);
    cards.push(card);
}

async function flipCard() {
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

async function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.image === card2.dataset.image) {
        card1.removeEventListener("click", flipCard);
        card2.removeEventListener("click", flipCard);
        matchedPairs++;
        pairsFound++;
        console.log("Matched Pairs:", matchedPairs);

        if (pairsFound === 2) {
            console.log('showQuestion');
            showQuestion();
            pairsFound = 0;
        }

        if (matchedPairs === images.length / 2) {
            clearInterval(timerInterval);
            matchedPairs = 10;
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

async function showQuestion() {
    var questionDiv = document.getElementById("question");
    questionDiv.style.display = "block";
    allefragen = await allefragenholen();
    console.log('alle fragen innerhalb von show questions', allefragen);
    const questionsatz = document.getElementById('satz');
    momentaneFrage = allefragen[momentaneFrageIndex];
    questionsatz.innerHTML = `${momentaneFrage.fragesatz}`;
    console.log("Frage angezeigt")
    momentaneFrageIndex++;
}

timerInterval = setInterval(function () {
    seconds++;
    timer.textContent = `Zeit: ${seconds} Sekunden`;
}, 1000);

spielZeit = getTimerValue();

async function showCongratulations() {
    showMessage(`Gratulation! Du hast es geschafft! Zeit: ${seconds} Sekunden`);
}

async function getTimerValue() {
    const timeText = timer.textContent;
    const secondsIndex = timeText.indexOf(':') + 2;
    return parseInt(timeText.substring(secondsIndex), 10);
}

async function showMessage(messageText) {
    const messageBox = document.createElement("div");
    messageBox.classList.add("message-box");
    const messageContent = document.createElement("div");
    messageContent.classList.add("message-content");
    messageContent.textContent = messageText;

    const weiterButton = document.createElement("button");
    weiterButton.textContent = "Weiter";
    weiterButton.addEventListener("click", async function () {
        messageBox.style.display = "none";
        playerName = prompt("Bitte gib deinen Namen ein:");

        if (!playerName) {
            return;
        }

        console.log('In saveGameData:', playerName);

        spielZeit = await getTimerValue();

        console.log('In saveGameData:', spielZeit);

        supa
            .from('Spielzeit')
            .upsert([
                {
                    spielzeit: spielZeit.toString(),
                    name_user: playerName,
                }
            ])
            .then(() => {
                console.log('Spielzeit und Spielername erfolgreich gespeichert.', spielZeit, playerName);
            })
            .catch((error) => {
                console.error('Fehler beim Speichern der Spielzeit und des Spielername:', error);
            });

        lastFrage();
    });

    messageBox.appendChild(messageContent);
    messageBox.appendChild(weiterButton);
    document.body.appendChild(messageBox);
}

async function lastFrage() {
    var lastquestionDiv = document.getElementById("last-question");
    lastquestionDiv.style.display = "block";

    const frage = document.getElementById('satz');
    frage.innerHTML = "Willst du deine Daten speichern?";

    const { data, error } = await supa
        .from('Spielzeit')
        .select('id')
        .match({'name_user': playerName, 'spielzeit': spielZeit})
        .order('id', { ascending: false })
        .limit(1);

    if (error) {
        console.error('Error fetching data:', error);
    } else {
        // Speichere die zuletzt gespeicherte ID
        lastSavedId = data[0]?.id;

        // Neue Event-Listener für die "Ja" und "Nein" Buttons in der letzten Frage
        const jaButtonLastQuestion = document.getElementById('jaButtonLastQuestion');
        jaButtonLastQuestion.addEventListener('click', function () {
            window.location.href = "index.html";
        });

        const neinButtonLastQuestion = document.getElementById('neinButtonLastQuestion');
        neinButtonLastQuestion.addEventListener('click', async function () {
            checkanswer(false);
            lastquestionDiv.style.display = "none";

            // Hier wird die Funktion zum Löschen der Daten aufgerufen
            await deleterow(lastSavedId);
        });
    }
}

async function deleterow(savedId) {
    if (!savedId) {
        console.error('Invalid id for deletion:', savedId);
        return;
    }

    const { data, error } = await supa
        .from('Spielzeit')
        .delete()
        .eq('id', savedId);

    if (error) {
        console.error('Error deleting row:', error);
    } else {
        console.log('Row deleted successfully:', savedId);
    }
}
