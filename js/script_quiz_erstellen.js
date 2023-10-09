const supabaseUrl = 'https://tenojoxlyquvqackgeif.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlbm9qb3hseXF1dnFhY2tnZWlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYzMTY3NzAsImV4cCI6MjAxMTg5Mjc3MH0.4ZX9-F1GNCgWSmLleh5QLyDNkE1MljglPV54eemu-2w'
const supabase = createClient(supabaseUrl, supabaseKey);

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

    confirmButton.addEventListener('click', async function () {
        // Annahme: Alle Fragen sind in HTML-Elementen mit der Klasse "question" enthalten
        const questions = document.querySelectorAll('.question input');
        const quizData = [];

        questions.forEach(question => {
            const questionText = question.value;
            const answerCheckbox = question.closest('.question').querySelector('input[type="checkbox"]');
            const answer = answerCheckbox.checked ? "Ja" : "Nein";

            quizData.push({ question: questionText, answer: answer });
        });

        if (error) {
            console.error('Fehler beim Speichern in Supabase:', error);
        } else {
            console.log('Quiz erfolgreich in Supabase gespeichert:', data);
            // Nachdem das Quiz erfolgreich gespeichert wurde, leite zum Memory-Spiel weiter
            window.location.href = 'memory.html';
        }
    });

    playButton.addEventListener('click', function () {
        modal.style.display = 'none';
    });
});