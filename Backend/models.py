# Player-Datenklasse
from pydantic import BaseModel

class Player(BaseModel):
    name: str
    position: int = 0
    data_points: int = 5