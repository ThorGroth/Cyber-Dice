from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Beispiel Zugangsdaten zum anpassen!
DATABASE_URL = "mysql+pymysql://user:password@localhost:5173/cyberdice"

engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
