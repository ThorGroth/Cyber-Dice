#  Spielregeln und Ereignisse
from models import Player

def get_current_field(board, position: int):
    if position >= len(board):
        return {"type": "goal", "description": "🎉 Ziel erreicht!"}
    return board[position]

def apply_event(player: Player, field: dict):
    """Wendet das Ereignis eines Feldes auf den Spieler an."""
    if field["type"] == "malware":
        player.data_points += field.get("effect", -1)
    elif field["type"] == "question":
        # Später mit Eingabe prüfen – aktuell kein Einfluss
        pass
    elif field["type"] == "goal":
        pass