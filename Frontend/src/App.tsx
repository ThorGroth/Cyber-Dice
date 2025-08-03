import { useState } from 'react'; // useState für die Seitenverwaltung importieren
import GamePage from './pages/GamePage'; // Wichtig: GamePage-Komponente importieren

// Die Definition der GamePage-Komponente ist NICHT HIER, sondern in './pages/GamePage.tsx'

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
        // Spielseite anzeigen
        <GamePage /> // Hier wird die importierte GamePage-Komponente verwendet
      )}
    </div>
  );
}

export default App;