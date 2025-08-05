import React from 'react';
import './Dice.css';

const Dice = ({ value }) => {
  // Bedingung: Wenn der Wert null ist, zeige den "Würfeln" Text an
  if (value === null || value === 0) {
    return (
      <div className="dice-face dice-initial-state d-flex align-items-center justify-content-center">
        <span>Würfeln</span>
      </div>
    );
  }

  // Andernfalls, render die Würfelpunkte
  return (
    <div className={`dice-face dice-value-${value}`}>
      {Array.from({ length: 9 }).map((_, index) => (
        <div key={index} className="dice-dot">
          <i className="fas fa-circle"></i>
        </div>
      ))}
    </div>
  );
};

export default Dice;