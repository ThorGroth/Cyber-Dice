from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
import random
import os

from models import Player
from db import Base, engine, get_db
from schemas import PlayerCreate, PlayerOut
from services.board_loader import load_board
from services.game_logic import (
    get_current_field,
    apply_event,
    prepare_event_pool
)

Base.metadata.create_all(bind=engine)

board = []

question_answers = {
    5: {"question": "Was bedeutet TCP?", "answer": "TCP"},
    10: {"question": "Was macht eine Firewall?", "answer": "Firewall"},
    15: {"question": "Was ist Phishing?", "answer": "Phishing"},
    20: {"question": "Was bedeutet AES?", "answer": "AES"}
}

class AnswerInput(BaseModel):
    player_id: int
    position: int
    answer: str

class SaveInput(BaseModel):
    id: int
    name: str
    position: int
    data_points: int

@asynccontextmanager
async def lifespan(app: FastAPI):
    global board
    board = load_board()
    prepare_event_pool(board)
    print("Spielfeld geladen.")
    yield
    print("Server wird heruntergefahren.")

app = FastAPI(title="Cyber Dice API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/start", response_model=PlayerOut)
def start_game(player_data: PlayerCreate, db: Session = Depends(get_db)):
    player = Player(name=player_data.name, position=0, data_points=100)
    db.add(player)
    db.commit()
    db.refresh(player)
    return player

@app.post("/roll")
def roll_dice(player_id: int = Query(..., description="ID des Spielers"),
              db: Session = Depends(get_db)):
    player = db.query(Player).filter(Player.id == player_id).first()
    if not player:
        raise HTTPException(status_code=404, detail="Spieler nicht gefunden.")
    if player.data_points <= 0:
        return {
            "message": "Du hast alle Datenpunkte verloren, Game Over!",
            "game_over": True
        }

    roll = random.randint(1, 6)
    player.position += roll

    if player.position >= len(board):
        player.position = len(board) - 1

    field = board[player.position]

    # Nur direkt anwenden, wenn kein Fragefeld
    if field["type"] not in ["question", "riddle"]:
        apply_event(player, field)

    db.commit()
    db.refresh(player)

    return {
        "roll": roll,
        "new_position": player.position,
        "field": field,
        "data_points": player.data_points,
        "game_over": player.data_points <= 0
    }

@app.get("/question")
def get_question(position: int = Query(..., description="Position auf dem Spielfeld")):
    qa = question_answers.get(position)
    if not qa:
        raise HTTPException(status_code=404, detail="Keine Frage auf diesem Feld.")
    return {"position": position, "question": qa["question"]}

@app.post("/answer")
def answer_question(data: AnswerInput, db: Session = Depends(get_db)):
    player = db.query(Player).filter(Player.id == data.player_id).first()
    if not player:
        raise HTTPException(status_code=404, detail="Spieler nicht gefunden.")

    qa = question_answers.get(data.position)
    if not qa:
        raise HTTPException(status_code=400, detail="Keine Frage auf diesem Feld.")

    correct_answer = qa["answer"]

    if data.answer.strip().lower() == correct_answer.lower():
        player.data_points += 10
        db.commit()
        return {"correct": True, "message": "Richtig beantwortet!", "data_points": player.data_points}
    else:
        player.data_points -= 5
        db.commit()
        return {"correct": False, "message": "Falsch beantwortet.", "data_points": player.data_points}

@app.post("/save")
def save_game(save_data: SaveInput, db: Session = Depends(get_db)):
    player = db.query(Player).filter(Player.id == save_data.id).first()
    if not player:
        raise HTTPException(status_code=404, detail="Spieler nicht gefunden.")

    player.name = save_data.name
    player.position = save_data.position
    player.data_points = save_data.data_points

    db.commit()
    db.refresh(player)

    return {"message": "Spielstand gespeichert.", "player_id": player.id}

@app.get("/player/status", response_model=PlayerOut)
def get_status(player_id: int = Query(..., description="ID des Spielers"), 
               db: Session = Depends(get_db)):
    player = db.query(Player).filter(Player.id == player_id).first()
    if not player:
        raise HTTPException(status_code=404, detail="Spieler nicht gefunden.")
    return player

@app.get("/load")
def load_game(name: str = Query(..., description="Name des Spielers"), db: Session = Depends(get_db)):
    player = db.query(Player).filter(Player.name == name).first()
    if not player:
        raise HTTPException(status_code=404, detail="Spieler nicht gefunden")
    return {
        "id": player.id,
        "name": player.name,
        "position": player.position,
        "data_points": player.data_points
    }

# NEU: Alle Spieler abrufen (für /players Aufruf im Frontend)
@app.get("/players", response_model=List[PlayerOut])
def get_all_players(db: Session = Depends(get_db)):
    players = db.query(Player).all()
    return players

@app.get("/rules")
def get_rules():
    path = os.path.join(os.path.dirname(__file__), "data", "rules.txt")
    try:
        with open(path, "r", encoding="utf-8") as file:
            rules = file.read()
        return {"rules": rules}
    except FileNotFoundError:
        return {"error": "Regelbuch nicht gefunden."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
