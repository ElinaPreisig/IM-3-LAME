import { supa } from "../supabase.js";

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} Minuten ${remainingSeconds} Sekunden`;
}

async function showTimes() {
    try {
        const { data, error } = await supa
        .from('Spielzeit')
        .select('name_user, spielzeit')
        .order('spielzeit', { ascending: true }) // Sortiere aufsteigend nach Spielzeit
        .range(0, 4); // Wähle die ersten 5 Einträge



        if (error) {
            console.error('Fehler beim Abrufen der Daten:', error.message);
            return;
        }

        console.log(data);

      //  data.sort((a, b) => parseInt(a.spielzeit) - parseInt(b.spielzeit));


        const bestenlisteTable = document.getElementById('bestenliste-table');
        const tbody = bestenlisteTable.querySelector('tbody');

        tbody.innerHTML = '';

        data.forEach((eintrag, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${eintrag.name_user}</td>
                <td>${formatTime(parseInt(eintrag.spielzeit))}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error.message);
    }
}

showTimes();


function playSoundEffect() {
    var audio = document.getElementById('soundEffect');
    audio.play();
}