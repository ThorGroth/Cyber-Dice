from models import Player

def get_current_field(board, position: int):
    """Gibt das aktuelle Feld basierend auf der Position zurück."""
    if position >= len(board):
        return {"type": "goal", "description": "Ziel erreicht – sicheres System betreten!"}
    return board[position]

def apply_event(player: Player, field: dict):
    """Wendet das Ereignis eines Feldes auf den Spieler an."""

    field_type = field.get("type")

    if field_type == "malware":
        effect = field.get("effect", -1)
        player.data_points += effect
        print(f"Malware-Ereignis: {field['description']}")

    elif field_type in ["question", "riddle"]:
        print(f"Frage: {field.get('question')}")
        user_input = input("Antwort: ").strip().lower()
        correct_answer = field.get("answer", "").strip().lower()

        if user_input == correct_answer:
            reward = field.get("reward", 1)
            player.data_points += reward
            print(f"Richtig! Du erhältst {reward} Datenpunkt(e).")
        else:
            print("Falsch beantwortet. Kein Bonus.")

    elif field_type == "empty":
        print(field.get("description", "Leeres Feld."))

    elif field_type == "goal":
        print("Ziel erreicht, Glückwunsch!")

    else:
        print("Unbekannter Feldtyp.")
