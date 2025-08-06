import React, { useEffect, useState } from 'react';

function Leaderboard() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const response = await fetch("http://localhost:8000/players");
        const data = await response.json();
        setPlayers(data);
      } catch (error) {
        console.error("Fehler beim Laden:", error);
      }
    };

    loadPlayers();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Spielstände</h2>
      <ul>
        {players.map((p) => (
          <li key={p.id}>
            {p.name} – Pos: {p.position}, Punkte: {p.data_points}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Leaderboard;
