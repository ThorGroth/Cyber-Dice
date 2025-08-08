from pydantic import BaseModel

class PlayerCreate(BaseModel):
    name: str

class PlayerOut(BaseModel):
    id: int
    name: str
    position: int
    data_points: int

    model_config = {
        "from_attributes": True
    }
