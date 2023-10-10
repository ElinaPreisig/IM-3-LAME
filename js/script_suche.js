import { supa } from "/supabase.js";

async function suche() {
    let suchtext = document.getElementById("suchfeld").value;
    console.log(suchtext);

    // Führen Sie die Abfrage in der "Quiz"-Tabelle durch
    const { data, error } = await supa
        .from('Quiz')
        .select()
        .like('name', `%${suchtext}%`); // Suche nach ähnlichen Namen

    if (error) {
        console.error('Fehler bei der Datenbankabfrage:', error);
    } 

    console.log("suchresultat:", data);

    // Hier wird das Suchergebnis auf der Webseite angezeigt
    const suchergebnisContainer = document.getElementById("suchergebnis-container");
    suchergebnisContainer.innerHTML = ""; // Löschen Sie vorherige Suchergebnisse

    if (data) {
        // Durch die Suchergebnisse iterieren und für jedes Ergebnis ein <div> erstellen    
        data.forEach((item) => {
                const suchergebnisDiv = document.createElement("div");
                
                
                const playEmoji = '▶️'; 
                const editEmoji = '🔄'; 
                
                
                suchergebnisDiv.innerHTML = `${item.name}      ${playEmoji}       ${editEmoji} `;
                
                suchergebnisContainer.appendChild(suchergebnisDiv);
            });
    
    } else {
        // Keine Suchergebnisse gefunden
        const keineErgebnisseDiv = document.createElement("div");
        keineErgebnisseDiv.textContent = "Keine Ergebnisse gefunden.";
        suchergebnisContainer.appendChild(keineErgebnisseDiv);
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    const suchbutton = document.getElementById('suchbutton');
    suchbutton.addEventListener('click', suche);
});


const playIcons = document.querySelectorAll('.play-icon');
playIcons.forEach((icon, index) => {
    icon.addEventListener('click', () => {
        openPopup(index + 1);
    });
});

// Funktion zum Öffnen des Popup-Fensters
function openPopup(quizId) {
    const popup = document.getElementById(`popup-quiz-${quizId}`);
    popup.style.display = 'block';
}

// Funktion zum Starten des Quiz
async function startQuiz(quizId) {
    const passwordInput = document.getElementById('password-input');
    const errorMessage = document.getElementById(`error-message-${quizId}`);
    errorMessage.style.display = 'none';

    const quiz = data[quizId - 1]; // Hier müssen Sie sicherstellen, dass Ihr data-Array korrekt indiziert ist
    const enteredPassword = passwordInput.value;

    if (quiz && quiz.passwort === enteredPassword) {
        // Passwort ist korrekt, Fragen anzeigen (ersetzen Sie dies durch Ihre Logik)
        console.log(`Starte Quiz ${quizId}`);
        // Hier können Sie die Logik zum Anzeigen der Fragen implementieren
    } else {
        // Passwort ist nicht korrekt, Fehlermeldung anzeigen
        errorMessage.style.display = 'block';
    }
}