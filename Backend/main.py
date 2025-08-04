# FastAPI-App mit Endpunkten
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from contextlib import asynccontextmanager
import random
import os

from models import Player
from services.board_loader import load_board
from services.game_logic import (
    get_current_field,
    apply_event,
    prepare_event_pool
)

# === Pydantic Request-Modelle ===
class StartRequest(BaseModel):
    name: str

# === Globale Spielvariablen ===
player = None
board = []

# === Lebenszyklus der App ===
@asynccontextmanager
async def lifespan(app: FastAPI):
    global board
    board = load_board()
    prepare_event_pool(board)
    print("Spielfeld geladen.")
    yield
    print("Server wird heruntergefahren.")

# === App-Instanz ===
app = FastAPI(title="Cyber Dice API", lifespan=lifespan)

# === CORS-Konfiguration ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React Dev-Server Standard-Port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === API-Endpunkte ===
@app.post("/start")
def start_game(request: StartRequest):
    global player
    player = Player(name=request.name)
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
        return {
            "message": "Du hast alle Datenpunkte verloren, Game Over!",
            "game_over": True
        }

    roll = random.randint(1, 6)
    player.position += roll

    field = get_current_field(player.position, len(board))
    apply_event(player, field)

    return {
        "roll": roll,
        "new_position": player.position,
        "field": field,
        "data_points": player.data_points,
        "game_over": player.data_points <= 0
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

@app.get("/rules")
def get_rules():
    path = os.path.join(os.path.dirname(__file__), "data", "rules.txt")
    try:
        with open(path, "r", encoding="utf-8") as file:
            rules = file.read()
        return {"rules": rules}
    except FileNotFoundError:
        return {"error": "Regelbuch nicht gefunden."}
