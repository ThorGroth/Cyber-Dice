import React, { useState, useEffect } from 'react';
import Board from './Board.jsx';
import './App.css';

// Hardgecodierte Board-Daten, da das Backend keinen Endpunkt dafür bereitstellt
// Dies ist für die visuelle Darstellung des statischen Boards.
// Die tatsächlichen Ereignisse werden vom Backend zufällig bestimmt.
const STATIC_GAME_BOARD = [
  { "type": "empty", "description": "Du startest deine Reise im Cyberspace." },
  { "type": "malware", "description": "Malware entdeckt, du verlierst 2 Datenpunkte.", "effect": -2 },
  { "type": "question", "description": "Was ist ein Hash?", "question": "Was ist ein Hash?", "answer": "eine Prüfsumme", "reward": 1 },
  { "type": "empty", "description": "Du hast ein Sicherheitsupdate installiert." },
  { "type": "malware", "description": "Ransomware-Angriff, du verlierst 3 Datenpunkte.", "effect": -3 },
  { "type": "question", "description": "Was macht eine Firewall?", "question": "Was macht eine Firewall?", "answer": "filtert Netzwerkverkehr", "reward": 1 },
  { "type": "empty", "description": "Du bewegst dich unentdeckt durchs Netzwerk." },
  { "type": "empty", "description": "Alles ruhig im System." },
  { "type": "malware", "description": "Keylogger entdeckt, du verlierst 1 Datenpunkt.", "effect": -1 },
  { "type": "question", "description": "Was ist Phishing?", "question": "Was ist Phishing?", "answer": "Identitätsdiebstahl per gefälschter Nachricht", "reward": 1 },

  { "type": "empty", "description": "Du findest einen geheimen Zugang, keine Gefahr." },
  { "type": "riddle", "description": "Was ist schwerer zu knacken, ein kurzes oder ein langes Passwort?", "question": "Was ist schwerer zu knacken?", "answer": "ein langes Passwort", "reward": 1 },
  { "type": "malware", "description": "Ein Trojaner wurde eingeschleust, du verlierst 2 Datenpunkte.", "effect": -2 },
  { "type": "question", "description": "Was ist ein VPN?", "question": "Was ist ein VPN?", "answer": "ein verschlüsselter Tunnel ins Internet", "reward": 1 },
  { "type": "empty", "description": "Du durchquerst eine sichere Zone." },
  { "type": "question", "description": "Was ist 2FA?", "question": "Was ist 2FA?", "answer": "Zwei-Faktor-Authentifizierung", "reward": 1 },
  { "type": "malware", "description": "Spyware entdeckt, du verlierst 2 Datenpunkte.", "effect": -2 },
  { "type": "empty", "description": "Du findest ein Backup deiner Daten, du fühlst dich sicherer." },
  { "type": "question", "description": "Was bedeutet HTTPS?", "question": "Was bedeutet HTTPS?", "answer": "sicheres Hypertext-Übertragungsprotokoll", "reward": 1 },
  { "type": "riddle", "description": "Ich bin keine Tür, aber ich blocke. Was bin ich?", "question": "Was blockt, ist aber keine Tür?", "answer": "Firewall", "reward": 1 },

  { "type": "malware", "description": "DNS-Spoofing entdeckt, du verlierst 1 Datenpunkt.", "effect": -1 },
  { "type": "empty", "description": "Du bewegst dich durch verschlüsselten Datenverkehr." },
  { "type": "question", "description": "Was macht ein Antivirenprogramm?", "question": "Was macht ein Antivirenprogramm?", "answer": "erkennt und entfernt Schadsoftware", "reward": 1 },
  { "type": "malware", "description": "Botnetz-Aktivität erkannt, du verlierst 3 Datenpunkte.", "effect": -3 },
  { "type": "empty", "description": "System überprüft, keine Bedrohung gefunden." },
  { "type": "question", "description": "Was bedeutet Social Engineering?", "question": "Was bedeutet Social Engineering?", "answer": "Menschen manipulieren, um Zugang zu bekommen", "reward": 1 },
  { "type": "riddle", "description": "Je mehr du davon teilst, desto weniger hast du. Was ist es?", "question": "Was verliert man durchs Teilen?", "answer": "Geheimnis", "reward": 1 },
  { "type": "malware", "description": "Rootkit-Alarm, du verlierst 2 Datenpunkte.", "effect": -2 },
  { "type": "empty", "description": "Du hast eine verdächtige Mail gelöscht, gute Entscheidung." },
  { "type": "goal", "description": "Ziel erreicht, sicheres System betreten!" }
];

const API_BASE_URL = 'http://localhost:8000';

function App() {
  // === Zustandsvariablen ===
  const [playerName, setPlayerName] = useState('');
  // playerData speichert direkt die relevanten Daten (name, position, data_points)
  const [playerData, setPlayerData] = useState(null);
  const [gameBoard, setGameBoard] = useState(STATIC_GAME_BOARD); // Board direkt initialisieren
  const [gameMessage, setGameMessage] = useState(''); // Nachrichten an den Spieler
  const [currentRoll, setCurrentRoll] = useState(null); // Letzter Würfelwurf
  const [isGameOver, setIsGameOver] = useState(false); // Spiel beendet?
  const [gamePhase, setGamePhase] = useState('start'); // 'start', 'playing', 'game_over'

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
      // playerData direkt aus der Antwort setzen
      setPlayerData({
        name: playerName, // Name kommt vom Frontend
        position: data.position,
        data_points: data.data_points
      });
      setGameMessage(data.message);
      setGamePhase('playing');
      setIsGameOver(false);
      setCurrentRoll(null);
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

      // Spielerdaten aus der Antwort aktualisieren
      setPlayerData(prevData => ({
        ...prevData,
        position: data.new_position,
        data_points: data.data_points
      }));
      setCurrentRoll(data.roll);

      // Nachricht basierend auf dem Feldtyp und der Backend-Logik
      let message = data.field.description || "Du hast ein unbekanntes Feld betreten.";
      if (data.field.type === 'question' || data.field.type === 'riddle') {
        message += ` Frage: "${data.field.question}". Bitte antworte in der Backend-Konsole!`;
      } else if (data.field.type === 'goal') {
        message = "Ziel erreicht – sicheres System betreten! Glückwunsch!";
        setIsGameOver(true);
        setGamePhase('game_over');
      } else if (data.game_over) { // Für den Fall, dass Datenpunkte 0 sind
        setIsGameOver(true);
        setGamePhase('game_over');
      }
      setGameMessage(message);

    } catch (error) {
      console.error("Fehler beim Würfeln:", error);
      setGameMessage("Fehler beim Würfeln.");
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
      {gamePhase === 'playing' && playerData && (
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
                <p>Fehler beim Laden des Spielbretts oder Board ist leer.</p>
              )}

              <button
                className="btn btn-warning btn-lg rounded-pill mt-4 shadow-sm"
                onClick={handleRollDice}
                disabled={isGameOver} // Deaktivieren, wenn Spiel vorbei
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
                setIsGameOver(false);
              }}
            >
              Neues Spiel starten
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;