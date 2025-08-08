import React from 'react';
import './Board.css';
import Dice from './Dice.jsx';

const Board = ({ fields = [], playerPosition, onRollDice, diceValue, isRolling }) => {
  const getFieldColor = (field) => {
    switch (field.type) {
      case 'empty': return 'bg-secondary';
      case 'malware': return 'bg-danger';
      case 'question': return 'bg-warning';
      case 'riddle': return 'bg-warning';
      case 'goal': return 'bg-success';
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
    <div className="board-grid-container position-relative">
      {/* Würfel zentriert über dem Grid */}
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
