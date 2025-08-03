import { useState, useEffect } from 'react';

// Schnittstelle (Interface) für ein Spielfeld-Objekt
interface BoardField {
  id: number;
  name: string;
  type: string;
  description: string;
  question?: string;
  answer?: string;
  points?: number;
  damage?: number;
  effect?: number;
  reward?: number;
}

// Schnittstelle für den Spielerstatus
interface PlayerStatus {
  name: string;
  position: number;
  data_points: number;
}

// Mock-Daten für das Spielfeld
const mockBoardData: BoardField[] = [
  { "id": 0, "name": "Start", "type": "empty", "description": "Du startest deine Reise im Cyberspace." },
  { "id": 1, "name": "Malware", "type": "malware", "description": "Malware entdeckt, du verlierst 2 Datenpunkte.", "effect": -2 },
  { "id": 2, "name": "Frage", "type": "question", "description": "Was ist ein Hash?", "question": "Was ist ein Hash?", "answer": "eine Prüfsumme", "reward": 1 },
  { "id": 3, "name": "Sicherheitsupdate", "type": "empty", "description": "Du hast ein Sicherheitsupdate installiert." },
  { "id": 4, "name": "Ransomware", "type": "malware", "description": "Ransomware-Angriff, du verlierst 3 Datenpunkte.", "effect": -3 },
  { "id": 5, "name": "Frage", "type": "question", "description": "Was macht eine Firewall?", "question": "Was macht eine Firewall?", "answer": "filtert Netzwerkverkehr", "reward": 1 },
  { "id": 6, "name": "Unentdeckt", "type": "empty", "description": "Du bewegst dich unentdeckt durchs Netzwerk." },
  { "id": 7, "name": "Ruhiges System", "type": "empty", "description": "Alles ruhig im System." },
  { "id": 8, "name": "Keylogger", "type": "malware", "description": "Keylogger entdeckt, du verlierst 1 Datenpunkt.", "effect": -1 },
  { "id": 9, "name": "Frage", "type": "question", "description": "Was ist Phishing?", "question": "Was ist Phishing?", "answer": "Identitätsdiebstahl per gefälschter Nachricht", "reward": 1 },
  { "id": 10, "name": "Geheimer Zugang", "type": "empty", "description": "Du findest einen geheimen Zugang, keine Gefahr." },
  { "id": 11, "name": "Rätsel", "type": "riddle", "description": "Was ist schwerer zu knacken, ein kurzes oder ein langes Passwort?", "question": "Was ist schwerer zu knacken?", "answer": "ein langes Passwort", "reward": 1 },
  { "id": 12, "name": "Trojaner", "type": "malware", "description": "Ein Trojaner wurde eingeschleust, du verlierst 2 Datenpunkte.", "effect": -2 },
  { "id": 13, "name": "Frage", "type": "question", "description": "Was ist ein VPN?", "question": "Was ist ein VPN?", "answer": "ein verschlüsselter Tunnel ins Internet", "reward": 1 },
  { "id": 14, "name": "Sichere Zone", "type": "empty", "description": "Du durchquerst eine sichere Zone." },
  { "id": 15, "name": "Frage", "type": "question", "description": "Was ist 2FA?", "question": "Was ist 2FA?", "answer": "Zwei-Faktor-Authentifizierung", "reward": 1 },
  { "id": 16, "name": "Spyware", "type": "malware", "description": "Spyware entdeckt, du verlierst 2 Datenpunkte.", "effect": -2 },
  { "id": 17, "name": "Backup", "type": "empty", "description": "Du findest ein Backup deiner Daten, du fühlst dich sicherer." },
  { "id": 18, "name": "Frage", "type": "question", "description": "Was bedeutet HTTPS?", "question": "Was bedeutet HTTPS?", "answer": "sicheres Hypertext-Übertragungsprotokoll", "reward": 1 },
  { "id": 19, "name": "Rätsel", "type": "riddle", "description": "Ich bin keine Tür, aber ich blocke. Was bin ich?", "question": "Was blockt, ist aber keine Tür?", "answer": "Firewall", "reward": 1 },
  { "id": 20, "name": "DNS-Spoofing", "type": "malware", "description": "DNS-Spoofing entdeckt, du verlierst 1 Datenpunkt.", "effect": -1 },
  { "id": 21, "name": "Verschlüsselt", "type": "empty", "description": "Du bewegst dich durch verschlüsselten Datenverkehr." },
  { "id": 22, "name": "Frage", "type": "question", "description": "Was macht ein Antivirenprogramm?", "question": "Was macht ein Antivirenprogramm?", "answer": "erkennt und entfernt Schadsoftware", "reward": 1 },
  { "id": 23, "name": "Botnetz", "type": "malware", "description": "Botnetz-Aktivität erkannt, du verlierst 3 Datenpunkte.", "effect": -3 },
  { "id": 24, "name": "System geprüft", "type": "empty", "description": "System überprüft, keine Bedrohung gefunden." },
  { "id": 25, "name": "Frage", "type": "question", "description": "Was bedeutet Social Engineering?", "question": "Was bedeutet Social Engineering?", "answer": "Menschen manipulieren, um Zugang zu bekommen", "reward": 1 },
  { "id": 26, "name": "Rätsel", "type": "riddle", "description": "Je mehr du davon teilst, desto weniger hast du. Was ist es?", "question": "Was verliert man durchs Teilen?", "answer": "Geheimnis", "reward": 1 },
  { "id": 27, "name": "Rootkit", "type": "malware", "description": "Rootkit-Alarm, du verlierst 2 Datenpunkte.", "effect": -2 },
  { "id": 28, "name": "Mail gelöscht", "type": "empty", "description": "Du hast eine verdächtige Mail gelöscht, gute Entscheidung." },
  { "id": 29, "name": "Ziel", "type": "goal", "description": "Ziel erreicht, sicheres System betreten!" }
];

function GamePage() {
  const [board, setBoard] = useState<BoardField[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playerStatus, setPlayerStatus] = useState<PlayerStatus>({ name: "Spieler", position: 0, data_points: 5 });

  useEffect(() => {
    const simulateFetch = () => {
      setLoading(true);
      setTimeout(() => {
        setBoard(mockBoardData);
        setLoading(false);
        setError(null);
        setPlayerStatus(prev => ({ ...prev, position: 0 })); 
      }, 500);
    };

    simulateFetch();
  }, []);

  // Funktion zum Bestimmen der Kartenfarbe (jetzt immer bg-secondary für Grau)
  const getCardBgClass = () => { // 'type' Parameter entfernt
    return 'bg-secondary text-white'; // Alle Felder sind standardmäßig grau
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center text-info">
        <p className="lead">Spielfeld wird geladen...</p>
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Lädt...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 text-center text-danger">
        <p className="lead">Fehler beim Laden des Spielfelds: {error}</p>
        <p>Bitte stelle sicher, dass das Backend läuft (uvicorn main:app --reload).</p>
      </div>
    );
  }

  return (
    <div className="container mt-5 text-center">
      <h2 className="display-5 text-info mb-4">Dein Cyber Dice Spielfeld</h2>
      <p className="lead text-custom-paragraph-color">
        Bewege dich durch den Cyberspace, beantworte Fragen und weiche Gefahren aus!
      </p>

      {/* Spielerstatus-Anzeige */}
      <div className="card bg-dark text-white p-3 mb-4 mx-auto" style={{ maxWidth: '400px' }}>
        <h4 className="text-info">Spieler: {playerStatus.name}</h4>
        <p className="mb-1">Position: {playerStatus.position}</p>
        <p className="mb-0">Datenpunkte: {playerStatus.data_points}</p>
      </div>

      {/* Spielfeld-Raster - Angepasst für das Aussehen des Screenshots */}
      <div className="d-flex flex-wrap justify-content-center align-items-center gap-3" style={{ maxWidth: '800px', margin: '0 auto' }}>
        {board.map((field) => (
          <div 
            key={field.id} 
            className={`card text-center p-2 shadow-sm rounded ${getCardBgClass()} ${ // getCardBgClass ohne Parameter aufrufen
              playerStatus.position === field.id ? 'border border-primary border-4' : '' // Spielerposition hervorheben
            }`}
            style={{ width: '80px', height: '80px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} // Feste Größe für die Felder
          >
            <h5 className="card-title mb-0 fs-4">{field.id}</h5> {/* Feldnummer prominent */}
            {playerStatus.position === field.id && (
              <div className="position-absolute top-0 start-50 translate-middle badge bg-primary rounded-pill p-1">
                <i className="bi bi-person-fill fs-6"></i>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Würfelbereich */}
      <div className="card p-4 mt-5 bg-dark text-white shadow-lg rounded mx-auto" style={{ maxWidth: '400px' }}>
        <h3>Würfelbereich</h3>
        <button type="button" className="btn btn-primary mt-3">Würfeln!</button>
      </div>
    </div>
  );
}

export default GamePage;

