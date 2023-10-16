import { supa } from "/supabase.js";

async function suche() {
    let suchtext = document.getElementById("suchfeld").value;
    console.log(suchtext);

    // Führen Sie die Abfrage in der "Quiz"-Tabelle durch
    const { data, error } = await supa
        .from('Quiz')
        .select()
        .like('name', `%${suchtext}%`)
        .limit(5); // Suche nach ähnlichen Namen

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

                suchergebnisDiv.innerHTML = `${item.name}`;
                
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

console.log("suchergebnis1:", data);

// Hier wird das Suchergebnis auf der Webseite angezeigt
const suchergebnis1 = document.getElementById("suchergebnis1");
suchergebnis1.innerHTML = ""; // Löschen Sie vorherige Suchergebnisse

if (data) {
    // Durch die Suchergebnisse iterieren und für jedes Ergebnis ein <div> erstellen    
    data.forEach((item) => {
            const suchergebnis1Div = document.createElement("div");

            suchergebnis1Div.innerHTML = `${item.passwort}`;
            
            suchergebnis1.appendChild(suchergebnis1Div);
        });

} 