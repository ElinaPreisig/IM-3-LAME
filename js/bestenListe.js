import { supa } from "../supabase.js";

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} Minuten ${remainingSeconds} Sekunden`;
}

async function showTimes(){
    const { data, error } = await supa
        .from('Spielzeit')
        .select('name_game, name_user, spielzeit')
        .order('spielzeit', { ascending: true })
        .limit(5);
    console.log(data);
    const bestenlisteTable = document.getElementById('bestenliste-table');
    const tbody = bestenlisteTable.querySelector('tbody');

    data.forEach((eintrag, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${eintrag.name_game}</td>
            <td>${eintrag.name_user}</td>
            <td>${formatTime(eintrag.spielzeit)}</td>
        `;
        tbody.appendChild(row);
    });





    if (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
        return;
    }}
showTimes();

    // Daten in die Tabelle einfügen



function playSoundEffect() {
    var audio = document.getElementById('soundEffect');
    audio.play();
}