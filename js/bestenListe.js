
function playSoundEffect() {
    var audio = document.getElementById('soundEffect');
    audio.play();
}

document.addEventListener('DOMContentLoaded', async function () {
    const supabaseUrl = 'https://tenojoxlyquvqackgeif.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlbm9qb3hseXF1dnFhY2tnZWlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYzMTY3NzAsImV4cCI6MjAxMTg5Mjc3MH0.4ZX9-F1GNCgWSmLleh5QLyDNkE1MljglPV54eemu-2w';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Daten von Supabase abrufen
    const { data, error } = await supabase
        .from('Spielzeit')
        .select('name_game, name_user, spielzeit')
        .order('spielzeit', { ascending: true })
        .limit(5);

    if (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
        return;
    }

    // Daten in die Tabelle einfügen
    const bestenlisteTable = document.getElementById('bestenliste-table');
    const tbody = bestenlisteTable.querySelector('tbody');

    data.forEach((eintrag, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${eintrag.name_game}</td>
            <td>${eintrag.name_user}</td>
            <td>${eintrag.spielzeit}</td>
        `;
        tbody.appendChild(row);
    });
});
