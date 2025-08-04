# FastAPI-App mit Endpunkten
from fastapi import FastAPI
from pydantic import BaseModel
from contextlib import asynccontextmanager
import random

from models import Player
from services.board_loader import load_board
from services.game_logic import (
    get_current_field,
    apply_event,
    prepare_event_pool
)

# Globale Spielvariablen
player = None
board = []

@asynccontextmanager
async def lifespan(app: FastAPI):
    global board
    board = load_board()
    prepare_event_pool(board)  # ← Events nach Typen einsortieren
    print("Spielfeld geladen.")
    yield
    print("Server wird heruntergefahren.")

app = FastAPI(title="Cyber Dice API", lifespan=lifespan)

# === API ===

@app.post("/start")
def start_game(name: str):
    global player
    player = Player(name=name)
    return {
        "message": f"Spiel für {player.name} gestartet.",
        "position": player.position,
        "data_points": player.data_points
    }

@app.post("/roll")
def roll_dice():
    global player

    if player is None:
        return {"error": "Spiel nicht gestartet."}
    if player.data_points <= 0:
        return {"message": "Du hast alle Datenpunkte verloren, Game Over!"}

    roll = random.randint(1, 6)
    player.position += roll

    field = get_current_field(player.position, len(board))  # ← Neue Methode
    apply_event(player, field)

    return {
        "roll": roll,
        "new_position": player.position,
        "field": field,
        "data_points": player.data_points
    }

@app.get("/player/status")
def get_status():
    if player is None:
        return {"error": "Kein Spiel aktiv."}

    return {
        "name": player.name,
        "position": player.position,
        "data_points": player.data_points
    }
