from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Zugangsdaten für deine MySQL-Datenbank
DATABASE_URL = "mysql+pymysql://deinuser:deinpasswort@localhost:3306/cyberdice"

# Engine und Session einrichten
engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Datenbank-Session für FastAPI bereitstellen
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
