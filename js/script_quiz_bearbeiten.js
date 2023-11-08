import { supa } from "../supabase.js";
console.log("Initialisierung abgeschlossen");

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed");
    const toggleSwitches = document.querySelectorAll('input[type="checkbox"]');

    toggleSwitches.forEach(function (toggleSwitch) {
        toggleSwitch.addEventListener("change", function () {
            const parent = this.closest('.answer');
            if (this.checked) {
                parent.classList.add('active');
            } else {
                parent.classList.remove('active');
            }
        });
    });

    const confirmButton = document.querySelector('#bestaetigen');
    const modal = document.querySelector('.modal');
    const playButton = document.querySelector('.play-button');
    confirmButton.addEventListener('click', updateQuizname);
    confirmButton.innerText = 'Quiz aktualisieren';
    confirmButton.addEventListener('click', updateFragen);
    

    confirmButton.addEventListener('click', function () {
        modal.style.display = 'flex';
    });

    playButton.addEventListener('click', function () {
        modal.style.display = 'none';
    });
});


/Function für Quizname/


    //this code gets the url parameter, which is the name of the quiz
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString)
const spielid = urlParams.get('spiel')
console.log(spielid);

//Änderung des Links zum Spiel
const changeURL = document.querySelector('.game-id-url');
        changeURL.href = "memory.html" + `?spiel=${spielid}`;

console.log(changeURL);

async function updateQuizname() {
    console.log("updateQuizname gestartet");  
    const insertPromises = [];
    const name_quiz = document.querySelector('#name_quiz');

    const { data, error} = await supa.from('Quiz').update({ 'name': name_quiz.value }).eq('id',spielid);
    insertPromises.push(data);

    if (data) {
        console.log('Update was successful', data);
    } else {
        console.log('Error occured', error)
    }
}


//Function für Update Fragen und Antworten
async function updateFragen() {
    

    // Get the quiz_id from another table
    const { data , error } = await supa.from('Quiz').select('id').eq('name', document.querySelector('#name_quiz').value);

    if (error) {
        console.error('Error fetching quiz_id from other table', error);
        return;
    }

    const quizId = data[0].id; // Assuming quiz_id is in the first element

    for (let i = 0; i < 5; i++) {

        const fragenElement = document.querySelector(fragenIDs[i]);
        if (!fragenElement) {
            console.error('Element frage' + (i + 1) + ' wurde nicht gefunden.');
            continue;
        }

        const antwortenElement = document.querySelector(antwortenIDs[i]);

        let antwortcheckbox;

        if (antwortenElement.checked) {
            antwortcheckbox = true;
            console.log("Slider aktiv");
        } else {
            antwortcheckbox = false;
            console.log("Slider inaktiv");
        }

        const {data, error} = await supa.from('Fragen').update(
            [
                {
                    fragesatz: fragenElement.value,
                    antwort: antwortcheckbox,
                }
            ]
        ).eq('id', IDReihenfolgeAntworten[i]);

        if (data) {
            results.push(data);
            console.log('Entry was created successfully', data);
        } else {
            console.log('Error occured', error);
        }
    }

    return results; // Return results if needed for further processing
}
const { data: quizData, error: quizError } = await supa.from('Quiz').select().eq('id', spielid);

if (quizError) {
    console.error('Fehler beim Laden des Quiz-Inhalts:', quizError);
}

const {data: fragenData, error: fragenError} = await supa.from('Fragen').select('fragesatz').eq('quiz_id', spielid);

if (fragenError) {
    console.error('Fehler beim Laden der Fragen:', fragenError);
}

const {data: antwortData, error: antwortError} = await supa.from('Fragen').select('antwort').eq('quiz_id', spielid);

if (antwortError) {
    console.error('Fehler beim Laden der Fragen:', fragenError);
}

// Annahme: Es wird nur ein Quiz für die angegebene ID gefunden
const currentQuiz = quizData[0];
const currentFragen = fragenData;
//console.log(currentFragen);
const currentAntworten = antwortData;

// Anzeigen der Quiz-Daten auf der Seite
const name_quiz = document.querySelector('#name_quiz');
name_quiz.value = currentQuiz.name;

// Define the arrays outside of the loop
const fragenIDs = ['#frage1', '#frage2', '#frage3', '#frage4', '#frage5'];
const antwortenIDs = ['#antwort1', '#antwort2', '#antwort3', '#antwort4', '#antwort5'];
const IDReihenfolgeAntworten=[]
const {data: IDData, error: IDError} = await supa.from('Fragen').select('id').eq('quiz_id', spielid);

if (IDError) {
    console.error('Fehler beim Laden der Fragen:', IDError);
}

console.log(IDData);
IDReihenfolgeAntworten.push(IDData[0].id, IDData[1].id, IDData[2].id, IDData[3].id, IDData[4].id);

let results = [];

for (let i = 0; i < 5; i++) {

    const fragen_quiz = document.querySelector(fragenIDs[i]);
    fragen_quiz.value = currentFragen[i].fragesatz;
    //console.log(fragen_quiz.value);

    const antworten_quiz = document.querySelector(antwortenIDs[i]);
    antworten_quiz.value = currentAntworten[i].antwort;
    console.log(currentAntworten[i].antwort);

    if (currentAntworten[i].antwort == true) {
        antworten_quiz.checked=true;
        console.log("Slider aktiv");

    } else {
        antworten_quiz.checked=false;
       console.log("Slider inaktiv");
    }

}
