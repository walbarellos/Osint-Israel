# backend/check_db.py
import os
from backend.db import engine, Base, Comentario

DB_FILE = "osint.db"

print("[CHECK] Resetando tabela comentarios...")

# remove banco antigo se existir
if os.path.exists(DB_FILE):
    os.remove(DB_FILE)
    print(f" - Removido {DB_FILE}")

# recria
Base.metadata.create_all(bind=engine)
print("✅ Banco recriado com todas as colunas")

# conferindo colunas via SQLAlchemy
print("Colunas ORM:", [c.name for c in Comentario.__table__.columns])
