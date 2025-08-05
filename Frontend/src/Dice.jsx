import React from 'react';
import './Dice.css';

const Dice = ({ value }) => {
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