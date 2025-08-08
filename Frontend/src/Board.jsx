import React from 'react';
import './Board.css';
import Dice from './Dice.jsx';

const Board = ({ fields, playerPosition, onRollDice, diceValue, isRolling, isStartField }) => {
  // Helferfunktion, um die Klasse für jedes Feld zu bestimmen
  const getFieldColor = (field) => { 
    // Wenn das Feld aufgedeckt ist, verwende seine spezifische Farbe
    if (field.isRevealed) {
      switch (field.type) {
        case 'empty': return 'bg-secondary'; 
        case 'malware': return 'bg-danger'; 
        case 'question': return 'bg-warning'; 
        case 'riddle': return 'bg-warning'; 
        case 'goal': return 'bg-success'; 
        default: return 'bg-secondary';
      }
    } else {
      // Wenn das Feld nicht aufgedeckt ist, ist es immer grau
      return 'bg-secondary';
    }
  };

  const renderField = (field, index) => {
    const isPlayerHere = playerPosition === index;

    return (
      <div
        key={index}
        className={`field ${getFieldColor(field)} text-white position-relative d-flex align-items-center justify-content-center flex-column p-1`}
        title={field.description || field.question || "Unbekanntes Feld"}
      >
        {/* Logik für das Start-/Zielfeld (Index 0) */}
        {index === 0 && isStartField && (
          <div className="start-icon-container d-flex flex-column align-items-center">
            <i className="fas fa-play text-dark"></i>
            <span className="start-text text-dark">START</span>
          </div>
        )}
        {index === 0 && !isStartField && (
          <div className="goal-icon-container d-flex flex-column align-items-center">
            <i className="fas fa-flag-checkered text-dark"></i>
            <span className="goal-text text-dark">ZIEL</span> 
          </div>
        )}
        
        {/* Logik für andere Felder, nur wenn sie aufgedeckt sind und nicht das Start-/Zielfeld sind */}
        {index !== 0 && field.isRevealed && field.type === 'malware' && <i className="fas fa-bug text-dark"></i>}
        {index !== 0 && field.isRevealed && (field.type === 'question' || field.type === 'riddle') && <i className="fas fa-question text-dark"></i>}
        {index !== 0 && field.isRevealed && field.type === 'empty' && <i className="fas fa-circle text-dark"></i>}

        {/* Generisches Icon für nicht aufgedeckte Felder (außer Startfeld) */}
        {index !== 0 && !field.isRevealed && <i className="fas fa-circle text-dark"></i>}

        {/* Spieler-Token wird nur gerendert, wenn der Spieler auf diesem Feld ist */}
        {isPlayerHere && (
          <div
            className="player-token player-1 bg-info rounded-circle d-flex align-items-center justify-content-center shadow-sm"
            style={{
              position: 'absolute',
              bottom: '4px',
              right: '4px',
              width: '30px',
              height: '30px',
              fontWeight: 'bold',
              fontSize: '0.8rem',
              zIndex: 10
            }}
          >
            P1
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="board-grid-container">
      {/* Das Würfelfeld ist ein Klick-Element in der Mitte */}
      <button
        className="dice-center-field"
        onClick={onRollDice}
        disabled={isRolling}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 20,
          background: 'transparent',
          border: 'none'
        }}
      >
        <Dice value={diceValue} isRolling={isRolling} />
      </button>

      {fields.map((field, index) => renderField(field, index))}
    </div>
  );
};

export default Board;

