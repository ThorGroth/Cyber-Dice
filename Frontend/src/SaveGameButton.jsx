import React from 'react';

function SaveGameButton({ player }) {
  const handleSave = async () => {
    try {
      const response = await fetch("http://localhost:8000/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(player)
      });

      const data = await response.json();
      alert(data.message || "Spielstand gespeichert.");
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
      alert("Speichern fehlgeschlagen.");
    }
  };

  return (
    <button onClick={handleSave} className="p-2 bg-blue-600 text-white rounded">
      Spiel speichern
    </button>
  );
}

export default SaveGameButton;
