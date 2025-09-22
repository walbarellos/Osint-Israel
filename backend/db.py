# backend/db.py
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text
from sqlalchemy.orm import sessionmaker, declarative_base
from datetime import datetime

DATABASE_URL = "sqlite:///./osint.db"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()


class Comentario(Base):
    __tablename__ = "comentarios"

    id = Column(Integer, primary_key=True, index=True)
    autor = Column(String, index=True)
    comentario = Column(Text)  # pode ser longo
    foto_url = Column(String, nullable=True)
    url_post = Column(String, nullable=True)
    url_comentario = Column(String, nullable=True)
    categoria = Column(String, nullable=True)       # ✅ violenta / generica / neutra
    palavras = Column(String, nullable=True)        # ✅ lista de termos encontrados
    data_detectada = Column(DateTime, default=datetime.utcnow)


def init_db():
    Base.metadata.create_all(bind=engine)


def get_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
