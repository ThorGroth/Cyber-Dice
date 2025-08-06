import React, { useState, useEffect } from 'react';
import Board from './Board.jsx';
import SaveGameButton from './SaveGameButton.jsx';
import Leaderboard from './Leaderboard.jsx';

const API_BASE_URL = 'http://localhost:8000';

function App() {
  const [playerName, setPlayerName] = useState('');
  const [playerData, setPlayerData] = useState(null);
  const [gameBoard, setGameBoard] = useState([]);
  const [gameMessage, setGameMessage] = useState('');
  const [currentRoll, setCurrentRoll] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Board aus public/board.json laden
  useEffect(() => {
    fetch('/board.json')
      .then(res => {
        if (!res.ok) throw new Error('Board konnte nicht geladen werden');
        return res.json();
      })
      .then(data => setGameBoard(data))
      .catch(err => setGameMessage('Fehler beim Laden des Spielbretts: ' + err.message));
  }, []);

  // Spieler starten
  const startGame = () => {
    if (!playerName.trim()) {
      setGameMessage('Bitte gib deinen Spielernamen ein.');
      return;
    }
    fetch(`${API_BASE_URL}/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: playerName }),
    })
      .then(res => res.json())
      .then(data => {
        setPlayerData(data);
        setGameMessage('Spiel gestartet. Würfle!');
        setIsGameOver(false);
        setShowLeaderboard(false);
        setCurrentRoll(null);
      })
      .catch(() => setGameMessage('Fehler beim Spielstart'));
  };

  // Würfeln
  const rollDice = () => {
    if (!playerData) {
      setGameMessage('Bitte starte zuerst das Spiel.');
      return;
    }
    fetch(`${API_BASE_URL}/roll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player_id: playerData.id }),
    })
      .then(res => res.json())
      .then(data => {
        setPlayerData(data.player);
        setCurrentRoll(data.roll);
        setGameMessage(data.message);

        if (data.game_over) {
          setIsGameOver(true);
          setShowLeaderboard(true);
        }
      })
      .catch(() => setGameMessage('Fehler beim Würfeln'));
  };

  // Spielstand speichern via SaveGameButton
  const handleSaveGame = () => {
    if (!playerData) {
      setGameMessage('Kein Spiel zum Speichern.');
      return;
    }
    fetch(`${API_BASE_URL}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(playerData),
    })
      .then(res => {
        if (res.ok) {
          setGameMessage('Spielstand erfolgreich gespeichert.');
        } else {
          setGameMessage('Fehler beim Speichern des Spielstands.');
        }
      })
      .catch(() => setGameMessage('Fehler beim Speichern des Spielstands.'));
  };

  return (
    <div className="app-container">
      <h1>Cyber Dice Game</h1>

      {!playerData && (
        <div className="start-area">
          <input
            type="text"
            placeholder="Spielername eingeben"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <button onClick={startGame}>Spiel starten</button>
        </div>
      )}

      {playerData && (
        <div className="game-area">
          <p>Name: {playerData.name}</p>
          <p>Position: {playerData.position}</p>
          <p>Datenpunkte: {playerData.data_points}</p>

          <button onClick={rollDice} disabled={isGameOver}>
            Würfeln
          </button>

          {currentRoll !== null && <p>Gewürfelt: {currentRoll}</p>}

          <p>{gameMessage}</p>

          <Board
            board={gameBoard}
            playerPosition={playerData.position}
          />

          <SaveGameButton onSave={handleSaveGame} disabled={isGameOver || !playerData} />
        </div>
      )}

      {showLeaderboard && <Leaderboard />}
    </div>
  );
}

export default App;
