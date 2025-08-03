import { useState } from 'react'; // useState für die Seitenverwaltung importieren

// Eine einfache Platzhalter-Komponente für die Spielseite
function GamePage() {
  return (
    <div className="container mt-5 text-center">
      <h2 className="display-5 text-success mb-4">Das Spielbrett</h2>
      <p className="lead">Hier wird später das interaktive Spielbrett angezeigt.</p>
      {/* Hier kommen später das Spielbrett, Würfel-Button, etc. */}
      <div className="card p-4 mt-4">
        <h3>Würfelbereich</h3>
        <button type="button" className="btn btn-primary mt-3">Würfeln!</button>
      </div>
    </div>
  );
}

function App() {
  // Zustand, um zu verfolgen, welche Seite angezeigt wird: 'home' oder 'game'
  const [currentPage, setCurrentPage] = useState('home');

  // Funktion zum Wechseln zur Spielseite
  const startGame = () => {
    setCurrentPage('game');
  };

  return (
    // Ein Flexbox-Container, der den gesamten Viewport einnimmt und seine Inhalte zentriert
    <div className="d-flex align-items-center justify-content-center min-vh-100">
      {currentPage === 'home' ? (
        // Startseite
        <div className="container text-center p-5 rounded">
          <h1 className="display-1 text-info mb-4 font-monospace glowing-text">
            Willkommen bei Cyber Dice!
          </h1>

          <p className="lead display-6 mb-4 font-monospace text-custom-paragraph-color">
            Dein interaktives Lernspiel-Erlebnis
          </p>
          <p className="lead display-6 mb-4 font-monospace text-custom-paragraph-color">
            Das Spiel, das dich vor knifflige Fragen und spannende Herausforderungen stellt!
          </p>
          <button
            type="button"
            className="btn btn-success btn-lg mt-3 btn-custom-extra-large"
            onClick={startGame} // Beim Klick auf diese Funktion wechseln
          >
            <i className="bi bi-dice-5 me-2"></i> Zum Spiel
          </button>
        </div>
      ) : (
        // Spielseite
        <GamePage />
      )}
    </div>
  );
}

export default App;
