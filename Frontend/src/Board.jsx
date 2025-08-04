import React from 'react';
import './Board.css';

const Board = ({ fields, playerPosition }) => {
  // Eine einfache Funktion, um die Farbe eines Feldes zu bestimmen
  const getFieldColor = (field) => {
    switch (field.type) {
      case 'empty': return 'bg-secondary'; // Grau
      case 'malware': return 'bg-danger'; // Rot
      case 'question': return 'bg-warning'; // Gelb
      case 'riddle': return 'bg-warning'; // Gelb (Rätsel sind auch Fragen)
      case 'goal': return 'bg-success'; // Grün
      default: return 'bg-secondary';
    }
  };

  // Hilfsfunktion, um die Felder als HTML-Elemente zu rendern
  const renderField = (field, index) => {
    // Überprüfen, ob der Spieler auf diesem Feld steht
    const isPlayerHere = playerPosition === index;

    return (
      <div
        key={index}
        className={`field ${getFieldColor(field)} text-white position-relative d-flex align-items-center justify-content-center flex-column p-1`}
        title={field.description || field.question || "Unbekanntes Feld"}
      >
        {/* Feld-Typ-Indikator */}
        {field.type === 'malware' && <i className="fas fa-bug text-dark"></i>}
        {(field.type === 'question' || field.type === 'riddle') && <i className="fas fa-question text-dark"></i>}
        {field.type === 'goal' && <i className="fas fa-flag-checkered text-dark"></i>}
        {field.type === 'empty' && <i className="fas fa-circle text-dark"></i>} {/* Kleiner Punkt für leere Felder */}

        {/* Spieler-Token */}
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
      {fields.map((field, index) => {
        return renderField(field, index);
      })}
      {/* Würfel-Feld in der Mitte (nicht Teil der Felder-Liste) */}
      <div className="dice-center-field d-flex align-items-center justify-content-center bg-light rounded-3 shadow-sm">
        <h3 className="text-dark">Würfeln</h3>
      </div>
    </div>
  );
};

export default Board;
