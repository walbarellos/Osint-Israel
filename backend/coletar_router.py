# backend/coletar_router.py
from fastapi import APIRouter, Depends, HTTPException, Query, Body
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List, Optional

from .db import get_session, Comentario
from .coletar_resultados import coletar_resultados

router = APIRouter(prefix="/coletar", tags=["coletar"])


class ComentarioOut(BaseModel):
    id: int
    autor: str
    comentario: str
    foto_url: str | None = None
    url_post: str | None = None
    url_comentario: str | None = None
    categoria: str | None = None
    palavras: str | None = None
    data_detectada: str

    class Config:
        from_attributes = True


class LinkRequest(BaseModel):
    link: str


@router.post("/", response_model=dict)
def coletar(
    link_query: Optional[str] = Query(None, description="URL do post (query string)"),
    req: Optional[LinkRequest] = Body(None),
    db: Session = Depends(get_session),
):
    """
    Coleta comentários de um post do Facebook.
    Aceita tanto query string (?link=...) quanto JSON body {"link": "..."}.
    """
    link = link_query or (req.link if req else None)
    if not link:
        raise HTTPException(status_code=400, detail="Link da publicação é obrigatório")

    try:
        resultado = coletar_resultados(link, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro durante coleta: {e}")

    total = db.query(Comentario).count()
    return {
        "msg": "Coleta concluída com sucesso",
        "novos": resultado["novos"],
        "total": total,
        "comentarios": resultado["comentarios"],
    }


@router.get("/novos", response_model=List[ComentarioOut])
def listar_novos(limit: int = 10, db: Session = Depends(get_session)):
    """
    Lista os últimos comentários inseridos, ordenados por data_detectada.
    """
    registros = (
        db.query(Comentario)
        .order_by(Comentario.data_detectada.desc())
        .limit(limit)
        .all()
    )
    return registros
