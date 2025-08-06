# main.py

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from sqlalchemy.orm import Session
from pydantic import BaseModel
import random
import os

from models import Player  # SQLAlchemy-Modell
from db import Base, engine, get_db
from schemas import PlayerCreate, PlayerOut
from services.board_loader import load_board
from services.game_logic import (
    get_current_field,
    apply_event,
    prepare_event_pool
)

# === Datenbank initialisieren ===
Base.metadata.create_all(bind=engine)

# === Globale Variablen ===
board = []

# === App-Lebenszyklus ===
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
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === In-Memory-Spielerzustand (temporär) ===
current_player = None

# === Endpunkte ===
@app.post("/start", response_model=PlayerOut)
def start_game(player_data: PlayerCreate, db: Session = Depends(get_db)):
    global current_player
    player = Player(name=player_data.name)
    db.add(player)
    db.commit()
    db.refresh(player)
    current_player = player
    return player

@app.post("/roll")
def roll_dice(db: Session = Depends(get_db)):
    global current_player

    if current_player is None:
        return {"error": "Spiel nicht gestartet."}
    if current_player.data_points <= 0:
        return {
            "message": "Du hast alle Datenpunkte verloren, Game Over!",
            "game_over": True
        }

    roll = random.randint(1, 6)
    current_player.position += roll

    field = get_current_field(current_player.position, len(board))
    apply_event(current_player, field)

    db.merge(current_player)
    db.commit()

    return {
        "roll": roll,
        "new_position": current_player.position,
        "field": field,
        "data_points": current_player.data_points,
        "game_over": current_player.data_points <= 0
    }

@app.get("/player/status", response_model=PlayerOut)
def get_status():
    if current_player is None:
        return {"error": "Kein Spiel aktiv."}
    return current_player

@app.get("/rules")
def get_rules():
    path = os.path.join(os.path.dirname(__file__), "data", "rules.txt")
    try:
        with open(path, "r", encoding="utf-8") as file:
            rules = file.read()
        return {"rules": rules}
    except FileNotFoundError:
        return {"error": "Regelbuch nicht gefunden."}
