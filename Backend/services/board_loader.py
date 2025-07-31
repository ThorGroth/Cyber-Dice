# JSON-Loader für Spielfeld
import json
import os

def load_board():
    """Lädt das Spielfeld aus einer JSON-Datei."""
    path = os.path.join(os.path.dirname(__file__), "..", "data", "board.json")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)
