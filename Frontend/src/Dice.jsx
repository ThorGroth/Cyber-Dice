import React from 'react';
import './Dice.css';

const Dice = ({ value, isRolling }) => {
  return (
    <div className={`dice-face ${isRolling ? 'rolling' : ''}`}>
      {value === null || value === 0 ? (
        <span>Würfeln</span>
      ) : (
        <span className="dice-number">{value}</span>
      )}
    </div>
  );
};

export default Dice;
