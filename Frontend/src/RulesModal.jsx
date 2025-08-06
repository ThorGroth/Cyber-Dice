import React from 'react';

const RulesModal = ({ isOpen, onClose, rules }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content rules-modal-content"> 
                <button className="modal-close-button" onClick={onClose}>&times;</button>
                <div className="modal-header">
                    <h2>Spielregeln</h2>
                </div>
                <div className="modal-body rules-body">
                    <p style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>{rules}</p>
                </div>
                <button className="modal-button primary" onClick={onClose}>Schließen</button>
            </div>
        </div>
    );
};

export default RulesModal;