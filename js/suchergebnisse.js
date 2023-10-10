
// Funktion zum Öffnen des Popups
    window.openPopup = function () {
        popup.style.display = 'block';
    };

    // Funktion zum Schließen des Popups
    window.closePopup = function () {
        popup.style.display = 'none';
    };

    // Funktion zum Ausführen der Bestätigungsaktion
    window.confirmAction = function () {
        const enteredPassword = passwordInput.value;

        // Hier kannst du die Logik für die Bestätigungsaktion implementieren
        // Zum Beispiel: Überprüfen des Passworts, bevor die Aktion durchgeführt wird.

        // Nach erfolgreicher Überprüfung kannst du das Popup schließen
        closePopup();
    };
