import React from 'react';

function SaveGameButton({ onSave, disabled }) {
  return (
    <button
      onClick={onSave}
      disabled={disabled}
      className="p-2 bg-blue-600 text-white rounded disabled:opacity-50"
    >
      Spiel speichern
    </button>
  );
}

export default SaveGameButton;
