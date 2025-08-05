import React from 'react';
import './Board.css';
import Dice from './Dice.jsx';

const Board = ({ fields, playerPosition, onRollDice, diceValue, isRolling }) => {
  const getFieldColor = (field) => {
    switch (field.type) {
      case 'empty': return 'bg-secondary'; // Grau
      case 'malware': return 'bg-danger'; // Rot
      case 'question': return 'bg-warning'; // Gelb
      case 'riddle': return 'bg-warning'; // Gelb 
      case 'goal': return 'bg-success'; // Grün
      default: return 'bg-secondary';
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
        {field.type === 'malware' && <i className="fas fa-bug text-dark"></i>}
        {(field.type === 'question' || field.type === 'riddle') && <i className="fas fa-question text-dark"></i>}
        {field.type === 'goal' && <i className="fas fa-flag-checkered text-dark"></i>}
        {field.type === 'empty' && <i className="fas fa-circle text-dark"></i>}

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