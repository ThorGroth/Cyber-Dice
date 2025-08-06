import React from 'react';

const EventModal = ({ isOpen, onClose, field, input, onInputChange, onAnswerSubmit, modalMessage }) => {
  if (!isOpen) return null;

  const modalTypeClass = field.type === 'malware' ? 'modal-malware' : (field.type === 'question' || field.type === 'riddle' ? 'modal-question' : '');

  return (
    <div className="modal-overlay">
      <div className={`modal-content ${modalTypeClass}`}>
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        <div className="modal-header">
          {field.type === 'malware' && <h2>Malware-Angriff!</h2>}
          {(field.type === 'question' || field.type === 'riddle') && <h2>Frage/Rätsel!</h2>}
        </div>
        <div className="modal-body">
          <p>{field.description}</p>
          {field.type === 'malware' && (
            <p>Du verlierst {Math.abs(field.effect)} Datenpunkt(e).</p>
          )}
          {(field.type === 'question' || field.type === 'riddle') && (
            <>
              <p className="question-text">{field.question}</p>
              <input
                type="text"
                className="modal-input"
                value={input}
                onChange={(e) => onInputChange(e.target.value)}
                placeholder="Deine Antwort hier..."
              />
              <button className="modal-button primary" onClick={onAnswerSubmit}>Antworten</button>
              {modalMessage && (
                <p className={`modal-feedback ${modalMessage.includes("Richtig") ? 'success' : 'error'}`}>
                  {modalMessage}
                </p>
              )}
            </>
          )}
          {field.type === 'malware' && (
            <button className="modal-button danger" onClick={onClose}>OK</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventModal;
