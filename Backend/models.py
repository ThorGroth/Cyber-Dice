from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Player(Base):
    __tablename__ = "players"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    position = Column(Integer, default=0)
    data_points = Column(Integer, default=5)

    def __repr__(self):
        return f"<Player(name={self.name}, position={self.position}, data_points={self.data_points})>"
