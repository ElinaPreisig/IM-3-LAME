import { supa } from "/supabase.js";

async function suche() {
    let suchtext = document.getElementById("suchfeld").value;
    console.log(suchtext);

    // Führen Sie die Abfrage in der "Quiz"-Tabelle durch
    const { data, error } = await supa
        .from('Quiz')
        .select()
        .like('name', `%${suchtext}%`); 

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

                const playLink = document.createElement("a");
                playLink.href = "memory.html";
                playLink.innerHTML = playEmoji;
        
                const editLink = document.createElement("a");
                editLink.href = "www.wikipedia.com";
                editLink.innerHTML = editEmoji;

                suchergebnisDiv.appendChild(document.createTextNode(`${item.name} `));
                suchergebnisDiv.appendChild(playLink);
                suchergebnisDiv.appendChild(document.createTextNode(" "));
                suchergebnisDiv.appendChild(editLink);

                editLink.addEventListener("click", async function(event) {
                    event.preventDefault();
                    const passwortEingabe = prompt("Bitte geben Sie das Passwort des Spiels ein:", "");
                    const { data: quizData, error: quizError } = await supa
                        .from('Quiz')
                        .select('name, passwort')
                        .eq('name', item.name);

                    if (quizError) {
                        console.error('Fehler bei der Datenbankabfrage:', quizError);
                    }

                    if (passwortEingabe === quizData[0].passwort) {
                        // Zeige Fragen an und führe die gewünschten Aktionen aus
                        console.log('Passwort korrekt eingegeben. Zeige Fragen an.');
                        // Fügen Sie hier die Logik zum Anzeigen der Fragen ein
                    } else {
                        alert("Falsches Passwort! Zugriff verweigert.");
                    }
                });

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

document.addEventListener('DOMContentLoaded', (event) => {
    const suchergebnis1 = document.getElementById('suchergebnis1');
    suchergebnis1.addEventListener('click', suche)
})
