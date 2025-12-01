from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.luta import Base

# Para o Hackathon usar SQLite que é mais simples
SQLALCHEMY_DATABASE_URL = "sqlite:///./data/internacional.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def criar_tabelas():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()