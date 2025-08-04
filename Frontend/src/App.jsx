import React, { useState, useEffect } from 'react';
import Board from './Board.jsx';
import './App.css'; // Eigene App-spezifische CSS-Datei

const API_BASE_URL = 'http://localhost:8000/api/game'; // Basis-URL Ihres FastAPI-Backends

function App() {
  // === Zustandsvariablen ===
  const [playerName, setPlayerName] = useState('');
  const [playerData, setPlayerData] = useState(null); // Speichert Spielerdaten vom Backend
  const [gameBoard, setGameBoard] = useState([]); // Speichert die Board-Struktur vom Backend
  const [gameMessage, setGameMessage] = useState(''); // Nachrichten an den Spieler
  const [currentRoll, setCurrentRoll] = useState(null); // Letzter Würfelwurf
  const [showQuestionModal, setShowQuestionModal] = useState(false); // Modal für Fragen
  const [questionPrompt, setQuestionPrompt] = useState(null); // Aktuelle Frage
  const [answerInput, setAnswerInput] = useState(''); // Eingabe für die Antwort
  const [isGameOver, setIsGameOver] = useState(false); // Spiel beendet?
  const [gamePhase, setGamePhase] = useState('start'); // 'start', 'playing', 'answering_question', 'game_over'

  // === Effekte ===

  // Board-Daten beim Start laden
  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/board`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setGameBoard(data);
      } catch (error) {
        console.error("Fehler beim Laden des Boards:", error);
        setGameMessage("Fehler beim Laden des Spielbretts.");
      }
    };
    fetchBoard();
  }, []); // Leeres Array bedeutet, dass der Effekt nur einmal beim Mounten ausgeführt wird

  // === Event-Handler und API-Aufrufe ===

  const handleStartGame = async () => {
    if (!playerName.trim()) {
      setGameMessage("Bitte gib einen Spielernamen ein.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: playerName }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPlayerData(data.player);
      setGameMessage(data.message);
      setGamePhase('playing');
      setIsGameOver(false);
      setCurrentRoll(null); // Würfelwurf zurücksetzen
      setQuestionPrompt(null); // Fragen-Prompt zurücksetzen
    } catch (error) {
      console.error("Fehler beim Starten des Spiels:", error);
      setGameMessage("Fehler beim Starten des Spiels.");
    }
  };

  const handleRollDice = async () => {
    if (isGameOver) {
      setGameMessage("Das Spiel ist beendet. Starte ein neues Spiel.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/roll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPlayerData(data.player); // Spielerdaten aktualisieren
      setCurrentRoll(data.roll);
      setGameMessage(data.message);

      if (data.game_over) {
        setIsGameOver(true);
        setGamePhase('game_over');
      } else if (data.question_prompt) {
        setQuestionPrompt(data.question_prompt);
        setShowQuestionModal(true);
        setGamePhase('answering_question');
      }
      // Wenn es keine Frage gibt, bleibt die Phase 'playing'
    } catch (error) {
      console.error("Fehler beim Würfeln:", error);
      setGameMessage("Fehler beim Würfeln.");
    }
  };

  const handleAnswerQuestion = async () => {
    if (!answerInput.trim()) {
      setGameMessage("Bitte gib eine Antwort ein.");
      return;
    }
    if (!questionPrompt) {
      setGameMessage("Keine Frage zum Beantworten.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/answer_question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question_id: questionPrompt.question_id,
          answer: answerInput,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPlayerData(data.player); // Spielerdaten aktualisieren
      setGameMessage(data.message);
      setAnswerInput(''); // Antwortfeld leeren
      setShowQuestionModal(false); // Modal schließen
      setQuestionPrompt(null); // Frage zurücksetzen
      setGamePhase('playing'); // Zurück zur Spielphase
    } catch (error) {
      console.error("Fehler beim Beantworten der Frage:", error);
      setGameMessage("Fehler beim Beantworten der Frage.");
    }
  };

  // === Rendern der UI basierend auf der Spielphase ===

  return (
    <div className="container-fluid p-4 game-container">
      <header className="text-center mb-4">
        <h1 className="display-4 text-primary">CyberDice</h1>
        <p className="lead text-muted">Das IT-Quiz-Würfelspiel</p>
      </header>

      {/* Startbildschirm */}
      {gamePhase === 'start' && (
        <div className="start-screen d-flex flex-column align-items-center justify-content-center">
          <div className="card p-4 shadow-lg rounded-3">
            <h2 className="mb-4 text-center">Spiel starten</h2>
            <div className="mb-3">
              <label htmlFor="playerNameInput" className="form-label">Dein Name:</label>
              <input
                type="text"
                className="form-control rounded-pill"
                id="playerNameInput"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Spielername"
              />
            </div>
            <button
              className="btn btn-primary btn-lg rounded-pill w-100"
              onClick={handleStartGame}
            >
              Spiel starten
            </button>
            {gameMessage && <p className="text-danger mt-3 text-center">{gameMessage}</p>}
          </div>
        </div>
      )}

      {/* Spielbildschirm */}
      {(gamePhase === 'playing' || gamePhase === 'answering_question') && playerData && (
        <div className="row">
          {/* Linke Seitenleiste: Spielerstatus und Neues Spiel Button */}
          <div className="col-md-3 mb-4">
            <div className="card shadow-sm mb-3 rounded-3 player-card bg-primary text-white">
              <div className="card-body">
                <h5 className="card-title">{playerData.name}</h5>
                <p className="card-text">Punkte: <span className="fw-bold">{playerData.data_points}</span></p>
                <p className="card-text">Position: <span className="fw-bold">{playerData.position}</span></p>
              </div>
            </div>
            {currentRoll !== null && (
              <div className="card shadow-sm mb-3 rounded-3 dice-roll-card bg-info text-white">
                <div className="card-body text-center">
                  <h5 className="card-title">Würfelwurf:</h5>
                  <p className="display-4 fw-bold">{currentRoll}</p>
                </div>
              </div>
            )}
            <button
              className="btn btn-success btn-lg w-100 rounded-pill mt-3"
              onClick={() => {
                setGamePhase('start'); // Zurück zum Startbildschirm
                setPlayerData(null); // Spielerdaten zurücksetzen
                setGameMessage('');
                setPlayerName('');
                setCurrentRoll(null);
                setQuestionPrompt(null);
                setIsGameOver(false);
              }}
            >
              Neues Spiel
            </button>
          </div>

          {/* Hauptbereich: Spielbrett und Würfel-Button */}
          <div className="col-md-9">
            <div className="board-area d-flex flex-column align-items-center">
              {gameBoard.length > 0 ? (
                <Board fields={gameBoard} playerPosition={playerData.position} />
              ) : (
                <p>Lade Spielbrett...</p>
              )}

              <button
                className="btn btn-warning btn-lg rounded-pill mt-4 shadow-sm"
                onClick={handleRollDice}
                disabled={showQuestionModal || isGameOver} // Deaktivieren, wenn Frage offen oder Spiel vorbei
              >
                Würfeln
              </button>
              {gameMessage && (
                <p className={`mt-3 text-center fw-bold ${gameMessage.includes("richtig") ? 'text-success' : gameMessage.includes("falsch") || gameMessage.includes("Malware") ? 'text-danger' : 'text-primary'}`}>
                  {gameMessage}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Game Over Bildschirm */}
      {gamePhase === 'game_over' && (
        <div className="game-over-screen d-flex flex-column align-items-center justify-content-center">
          <div className="card p-5 shadow-lg rounded-3 text-center">
            <h2 className="mb-4 text-danger display-3">GAME OVER!</h2>
            <p className="lead">{gameMessage}</p>
            <p className="fs-4">Deine erreichten Datenpunkte: <span className="fw-bold">{playerData?.data_points || 0}</span></p>
            <button
              className="btn btn-success btn-lg rounded-pill mt-4 w-100"
              onClick={() => {
                setGamePhase('start');
                setPlayerData(null);
                setGameMessage('');
                setPlayerName('');
                setCurrentRoll(null);
                setQuestionPrompt(null);
                setIsGameOver(false);
              }}
            >
              Neues Spiel starten
            </button>
          </div>
        </div>
      )}

      {/* Fragen-Modal */}
      {showQuestionModal && questionPrompt && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-3 shadow-lg">
              <div className="modal-header bg-primary text-white rounded-top-3">
                <h5 className="modal-title">Frage: {questionPrompt.field_type === 'riddle' ? 'Rätsel' : 'Quizfrage'}</h5>
              </div>
              <div className="modal-body">
                <p className="lead">{questionPrompt.question}</p>
                <div className="mb-3">
                  <label htmlFor="answerInput" className="form-label visually-hidden">Deine Antwort:</label>
                  <input
                    type="text"
                    className="form-control rounded-pill"
                    id="answerInput"
                    value={answerInput}
                    onChange={(e) => setAnswerInput(e.target.value)}
                    placeholder="Deine Antwort hier eingeben..."
                    onKeyPress={(e) => { // Absenden bei Enter-Taste
                      if (e.key === 'Enter') {
                        handleAnswerQuestion();
                      }
                    }}
                  />
                </div>
                {gameMessage && <p className="text-danger mt-2">{gameMessage}</p>}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary rounded-pill"
                  onClick={handleAnswerQuestion}
                >
                  Antwort absenden
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;