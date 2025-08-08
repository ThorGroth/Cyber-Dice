import random
from models import Player

# Globale Referenz auf das gesamte Event-Board
events_by_type = {
    "empty": [],
    "malware": [],
    "question": [],
    "riddle": [],
    "goal": []
}

def prepare_event_pool(board: list):
    """Teilt die geladenen Events nach Typ ein (einmalig beim Start)."""
    global events_by_type
    events_by_type = {
        "empty": [],
        "malware": [],
        "question": [],
        "riddle": [],
        "goal": []
    }
    for event in board:
        event_type = event.get("type")
        if event_type in events_by_type:
            events_by_type[event_type].append(event)

def get_random_field():
    """Wählt zufällig einen Feldtyp aus (ohne goal) und gibt ein zufälliges Event zurück."""
    possible_types = [key for key in events_by_type if key != "goal"]
    field_type = random.choice(possible_types)
    return random.choice(events_by_type[field_type])

def get_goal_field():
    """Gibt ein beliebiges Goal-Event zurück (es sollte genau eines geben)."""
    if events_by_type["goal"]:
        return events_by_type["goal"][0]
    return {"type": "goal", "description": "Ziel erreicht!"}

def get_current_field(position: int, board_size: int):
    """Gibt das aktuelle Feldereignis zurück, abhängig von Position."""
    if position >= board_size - 1:
        return get_goal_field()
    return get_random_field()

def apply_event(player: Player, field: dict):
    """Wendet das Ereignis eines Feldes auf den Spieler an."""

    field_type = field.get("type")

    if field_type == "malware":
        effect = field.get("effect", -1)
        player.data_points += effect

    elif field_type in ["question", "riddle"]:
        # Frage wird nicht mehr im Backend verarbeitet
        # Frontend soll Feld anzeigen und Antwort via /answer prüfen
        pass

    elif field_type == "empty":
        # Keine Änderung notwendig
        pass

    elif field_type == "goal":
        # Spielende erreicht
        pass
