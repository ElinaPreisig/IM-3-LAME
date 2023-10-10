import { supa } from "../supabase.js";
console.log("Hallo Test");




/*const btn = document.querySelector(".confirm-button");
btn.addEventListener('click', insertQuizname);
btn.addEventListener('click', insertFragen);*/
/*btn.addEventListener('click', insertFrage1);

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
    const name_quiz = document.querySelector('#name_quiz');

    const getCurrentDate = () => {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const generatedPassword = await generateRandomNumericPassword(7);
    const { data } = await supa.from("Quiz").insert([
        {
            name: name_quiz.value,
            erstelldatum: getCurrentDate(),
            passwort: generatedPassword,
        }
    ]);

    if (data) {
        console.log('Entry was created successfully', data);
    } else {
        console.log('Error occured')
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
async function TEST() {
    const quizId = await supa.from("Quiz").select("id").eq("name", document.querySelector('#name_quiz').value);
    console.log(quizId);
}
async function insertFragen() {


    for (let i = 1; i <= 5; i++) {

        const frage = document.querySelector(`#frage${i}`);
        const antwortCheckbox = document.querySelector(`#antwort${i}`);
        const antwort = antwortCheckbox.checked;

        /* console.log(Frage ${i}: ${frage.value});*/
        const { data } = await supa.from("Fragen").insert([
            {
                fragesatz: frage.value,
                antwort: antwort,
                quiz_id: quizId,
            }
        ]);
    }


    if (data) {
        console.log('Frage ${i} wurde erfolgreich eingefügt');
    } else {
        console.log('Fehler beim Einfügen von Frage ${i}:');
    }
}


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
