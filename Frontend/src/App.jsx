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
  const [isRolling, setIsRolling] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [playerAnswer, setPlayerAnswer] = useState('');
  const [questionFieldIndex, setQuestionFieldIndex] = useState(null);

  useEffect(() => {
    fetch('/board.json')
      .then(res => {
        if (!res.ok) throw new Error('Board konnte nicht geladen werden');
        return res.json();
      })
      .then(data => setGameBoard(data))
      .catch(err => setGameMessage('Fehler beim Laden des Spielbretts: ' + err.message));
  }, []);

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
      .then(res => {
        if (!res.ok) throw new Error('Spielstart fehlgeschlagen');
        return res.json();
      })
      .then(data => {
        setPlayerData(data);
        setGameMessage('Spiel gestartet. Würfle!');
        setIsGameOver(false);
        setShowLeaderboard(false);
        setCurrentRoll(null);
        setShowQuestionModal(false);
        setCurrentQuestion('');
        setPlayerAnswer('');
        setQuestionFieldIndex(null);
      })
      .catch(() => setGameMessage('Fehler beim Spielstart'));
  };

  const loadGame = () => {
    if (!playerName.trim()) {
      setGameMessage('Bitte gib deinen Spielernamen ein.');
      return;
    }

    fetch(`${API_BASE_URL}/load?name=${encodeURIComponent(playerName)}`)
      .then(res => {
        if (!res.ok) throw new Error('Kein gespeicherter Spielstand gefunden.');
        return res.json();
      })
      .then(data => {
        setPlayerData(data);
        setGameMessage('Spielstand geladen. Willkommen zurück!');
        setIsGameOver(false);
        setShowLeaderboard(false);
        setCurrentRoll(null);
        setShowQuestionModal(false);
        setCurrentQuestion('');
        setPlayerAnswer('');
        setQuestionFieldIndex(null);
      })
      .catch(() => setGameMessage('Fehler beim Laden des Spielstands.'));
  };

  const rollDice = () => {
    if (!playerData || !playerData.id) {
      setGameMessage('Bitte starte zuerst das Spiel.');
      return;
    }

    setIsRolling(true);
    fetch(`${API_BASE_URL}/roll?player_id=${playerData.id}`, {
      method: 'POST',
    })
      .then(res => {
        if (!res.ok) throw new Error('Würfeln fehlgeschlagen');
        return res.json();
      })
      .then(data => {
        setCurrentRoll(data.roll || null);
        setPlayerData(prev => ({
          ...prev,
          position: data.new_position,
          data_points: data.data_points,
        }));

        if (data.message) setGameMessage(data.message);
        if (data.game_over) {
          setIsGameOver(true);
          setShowLeaderboard(true);
          setShowQuestionModal(false);
        }

        if (data.field && (data.field.type === 'question' || data.field.type === 'riddle')) {
          setCurrentQuestion(data.field.question || "Keine Frage verfügbar.");
          setShowQuestionModal(true);
          setQuestionFieldIndex(data.new_position);
          setPlayerAnswer('');
        } else {
          setShowQuestionModal(false);
          setCurrentQuestion('');
          setQuestionFieldIndex(null);
          setPlayerAnswer('');
        }
      })
      .catch(() => setGameMessage('Fehler beim Würfeln'))
      .finally(() => setTimeout(() => setIsRolling(false), 1000));
  };

  const handleAnswerSubmit = () => {
    if (!playerAnswer.trim() || !playerData?.id) return;

    fetch(`${API_BASE_URL}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        player_id: playerData.id,
        answer: playerAnswer,
        position: questionFieldIndex,
      }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Antwort konnte nicht verarbeitet werden');
        return res.json();
      })
      .then(data => {
        setGameMessage(data.message || 'Antwort verarbeitet.');
        setPlayerData(prev => ({
          ...prev,
          data_points: data.data_points ?? prev.data_points,
        }));

        if (data.data_points !== undefined && data.data_points <= 0) {
          setIsGameOver(true);
          setShowLeaderboard(true);
        }
      })
      .catch(() => setGameMessage('Fehler beim Senden der Antwort.'))
      .finally(() => {
        setShowQuestionModal(false);
        setPlayerAnswer('');
        setQuestionFieldIndex(null);
      });
  };

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
            disabled={isRolling}
          />
          <button onClick={startGame} disabled={isRolling}>Spiel starten</button>
          <button onClick={loadGame} disabled={isRolling}>Spielstand laden</button>
        </div>
      )}

      {playerData && (
        <div className="game-area">
          <p>Name: {playerData.name}</p>
          <p>Position: {playerData.position}</p>
          <p>Datenpunkte: {playerData.data_points}</p>

          <p>{gameMessage}</p>

          <Board
            fields={gameBoard}
            playerPosition={playerData.position}
            onRollDice={rollDice}
            diceValue={currentRoll}
            isRolling={isRolling}
          />

          <SaveGameButton onSave={handleSaveGame} disabled={isGameOver || !playerData} />
        </div>
      )}

      {showLeaderboard && <Leaderboard />}

      {showQuestionModal && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div className="modal-content" style={{
            backgroundColor: 'white', padding: '20px', borderRadius: '8px',
            maxWidth: '400px', width: '90%',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          }}>
            <h3>Frage</h3>
            <p>{currentQuestion}</p>
            <input
              type="text"
              placeholder="Deine Antwort"
              value={playerAnswer}
              onChange={(e) => setPlayerAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAnswerSubmit();
              }}
              autoFocus
            />
            <div className="modal-buttons" style={{ marginTop: '10px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary" onClick={handleAnswerSubmit}>Antwort senden</button>
              <button className="btn btn-secondary" onClick={() => setShowQuestionModal(false)}>Abbrechen</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
