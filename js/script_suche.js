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
            suchergebnisDiv.textContent = item.name; // Zeigen Sie den Namen an, Sie können weitere Informationen hinzufügen
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
