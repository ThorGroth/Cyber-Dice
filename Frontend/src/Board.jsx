import React from 'react';
import './Board.css';
import Dice from './Dice.jsx';

const Board = ({ fields, playerPosition, onRollDice, diceValue, isRolling, isStartField }) => {
  // Helferfunktion, um die Klasse für jedes Feld zu bestimmen
  const getFieldColor = (field, index) => {
    // Wenn es das Start-/Zielfeld ist (Index 0)
    if (index === 0) {
      return 'bg-success'; // Es ist IMMER grün
    }

    // Farben für andere Feldtypen
    switch (field.type) {
      case 'empty': return 'bg-secondary'; // Grau
      case 'malware': return 'bg-danger'; // Rot
      case 'question': return 'bg-warning'; // Gelb
      case 'riddle': return 'bg-warning'; // Gelb
      case 'goal': return 'bg-success'; // Grün (falls es nicht Index 0 ist, aber als Ziel definiert)
      default: return 'bg-secondary';
    }
  };

  const renderField = (field, index) => {
    const isPlayerHere = playerPosition === index;

    return (
      <div
        key={index}
        className={`field ${getFieldColor(field, index)} text-white position-relative d-flex align-items-center justify-content-center flex-column p-1`}
        title={field.description || field.question || "Unbekanntes Feld"}
      >
        {/* Icons basierend auf dem Feldtyp und ob es das Startfeld ist */}
        {index === 0 && isStartField && (
          <div className="start-icon-container d-flex flex-column align-items-center">
            <span className="start-text text-dark">START</span> {/* NEU: "START" Text */}
          </div>
        )}
        {index === 0 && !isStartField && <i className="fas fa-flag-checkered text-dark"></i>} {/* Ziel-Icon, wenn Spieler nicht mehr drauf ist */}

        {field.type === 'malware' && <i className="fas fa-bug text-dark"></i>}
        {(field.type === 'question' || field.type === 'riddle') && <i className="fas fa-question text-dark"></i>}
        {field.type === 'empty' && <i className="fas fa-circle text-dark"></i>}

        {/* Spieler-Token wird nur gerendert, wenn der Spieler auf diesem Feld ist */}
        {isPlayerHere && (
          <div className="player-token player-1 bg-info rounded-circle d-flex align-items-center justify-content-center shadow-sm">
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
      >
        <Dice value={diceValue} isRolling={isRolling} />
      </button>

      {/* Alle 30 Felder werden in einer Schleife gerendert. */}
      {fields.map((field, index) => renderField(field, index))}
    </div>
  );
};

export default Board;
