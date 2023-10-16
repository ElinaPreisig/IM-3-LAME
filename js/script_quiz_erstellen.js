import { supa } from "../supabase.js";
console.log("Initialisierung abgeschlossen");


/Function für Quizname/
/* Passwortgenerator*/

async function generateRandomNumericPassword(length) {
    const charset = "0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}

async function insertQuizname() {
    const insertPromises = [];
    const name_quiz = document.querySelector('#name_quiz');

    const getCurrentDate = () => {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        return `${year}.${month}.${day}`;
    };

    const generatedPassword = await generateRandomNumericPassword(5);
    const { data, error } = await supa.from('Quiz').insert([
        {
            name: name_quiz.value,
            erstelldatum: getCurrentDate(),
            passwort: generatedPassword,
        }
    ]);
    insertPromises.push(data);
    console.log(generatedPassword);
    if (data) {
        console.log('Entry was created successfully', data);
    } else {
        console.log('Error occured', error)
    }
}

/*

funktionierender Code für eine Frage:
async function insertFrage1() {
  const frage1 = document.querySelector('#frage1');
  const { data } = await supa.from("Fragen").insert(
      [
          {
              fragesatz: frage1.value,
          }
      ]
  );
 
 if (data) {
    console.log('Entry was created successfully', data);
  } else {
    console.log('Error occured')
  }
}

*/
/* Function für Fragen*/
async function getID() {
    const quizId = await supa.from("Quiz").select("id").eq("name", document.querySelector('#name_quiz').value);
    console.log(quizId);
}

let fragen = ['#frage1', '#frage2', '#frage3', '#frage4', '#frage5'];
let antwort = ['#antwort1', '#antwort2', '#antwort3', '#antwort4', '#antwort5'];

async function insertFragen() {
    for (let i = 0; i < 5; i++) {

        const frageI = document.querySelector(fragen[i]);
        if (!frageI) {
            console.error('Element frage' + (i + 1) + ' wurde nicht gefunden.');
            continue;
        }

        const antwortI = document.querySelector(antwort[i])

        let antwortcheckbox;

        if (antwortI.checked) {
            antwortcheckbox = true;
        } else {
            antwortcheckbox = false;
        }

            const { data, error } = await supa.from('Fragen').insert(
                [
                    {
                        fragesatz: frageI.value,
                        antwort: antwortcheckbox,
                    }
                ]

            );

        if (data) {
            console.log('Entry was created successfully', data);
        } else {
            console.log('Error occured')
        }
    
}
}

/*for (let i = 0; i <= 5; i++) {

    const frage = document.querySelector(fragen[i]);

    
    const { data } = await supa.from("Fragen").insert([
        {
            fragesatz: frage.value,
        }
    ]);
}
*/
/*
    if (data) {
        console.log('Frage' + [i] + 'wurde erfolgreich eingefügt');
    } else {
        console.log('Fehler beim Einfügen von Frage');
    }
    */




document.addEventListener("DOMContentLoaded", function () {
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

    const confirmButton = document.querySelector('.confirm-button');
    const modal = document.querySelector('.modal');
    const playButton = document.querySelector('.play-button');
    confirmButton.addEventListener('click', insertQuizname);
    confirmButton.addEventListener('click', insertFragen);

    confirmButton.addEventListener('click', function () {
        modal.style.display = 'flex';
    });

    playButton.addEventListener('click', function () {
        modal.style.display = 'none';
    });
});
