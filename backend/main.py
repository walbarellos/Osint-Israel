from datetime import datetime
from typing import List, Optional

from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from .db import init_db, get_session, Comentario
from .filtros import detectar_categoria
from . import dossie
from .coletar_router import router as coletar_router

app = FastAPI(
    title="OSINT Noahide Simplificado",
    version="0.7.4",
    description="API para coleta, armazenamento e exposição de comentários públicos",
)

init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dossie.router)
app.include_router(coletar_router)

# ---------------- Pydantic ----------------
class ResultadoCreate(BaseModel):
    autor: str
    comentario: str
    foto_url: Optional[str] = None
    url_post: Optional[str] = None
    url_comentario: Optional[str] = None
    categoria: Optional[str] = None


class ResultadoOut(BaseModel):
    id: int
    autor: str
    comentario: str
    foto_url: Optional[str] = None
    url_post: Optional[str] = None
    url_comentario: Optional[str] = None
    categoria: Optional[str] = None
    palavras: Optional[str] = None
    data_detectada: datetime

    class Config:
        from_attributes = True


@app.get("/resultados/", response_model=List[ResultadoOut])
def listar_resultados(db: Session = Depends(get_session)):
    return db.query(Comentario).all()


@app.post("/resultados/", response_model=ResultadoOut)
def add_resultado(data: ResultadoCreate, db: Session = Depends(get_session)):
    """
    Insere ou atualiza um comentário no banco,
    aplicando classificação automática.
    """
    categoria, matches = detectar_categoria(data.comentario)

    existente = (
        db.query(Comentario)
        .filter(
            Comentario.autor == data.autor,
            Comentario.comentario == data.comentario,
            Comentario.url_post == data.url_post,
        )
        .first()
    )

    if existente:
        # Atualiza foto_url se o novo dado for válido
        if data.foto_url:
            existente.foto_url = data.foto_url
        # Atualiza categoria e palavras também
        existente.categoria = categoria or "neutra"
        existente.palavras = ", ".join(matches) if matches else None
        db.commit()
        db.refresh(existente)
        return existente

    novo = Comentario(
        autor=data.autor,
        comentario=data.comentario,
        foto_url=data.foto_url,
        url_post=data.url_post,
        url_comentario=data.url_comentario,
        categoria=categoria or "neutra",
        palavras=", ".join(matches) if matches else None,
        data_detectada=datetime.utcnow(),
    )

    db.add(novo)
    db.commit()
    db.refresh(novo)
    return novo


@app.delete("/resultados/{resultado_id}")
def delete_resultado(resultado_id: int, db: Session = Depends(get_session)):
    existente = db.query(Comentario).filter(Comentario.id == resultado_id).first()
    if not existente:
        raise HTTPException(status_code=404, detail="Comentário não encontrado")
    db.delete(existente)
    db.commit()
    return {"msg": "Comentário removido com sucesso"}


@app.delete("/resultados/todos")
def delete_todos_resultados(db: Session = Depends(get_session)):
    """
    Remove todos os comentários do banco.
    """
    try:
        count = db.query(Comentario).delete()
        db.commit()
        return {"msg": "Todos os comentários foram removidos", "removidos": count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao deletar todos: {e}")
