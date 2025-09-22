from fastapi import HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from .crawler import coletar_comentarios
from .db import Comentario
from .filtros import detectar_categoria


def coletar_resultados(link: str, db: Session) -> dict:
    """
    Coleta comentários de um post do Facebook e grava no banco.
    """
    try:
        itens = coletar_comentarios(link)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Falha na coleta: {e}")

    novos = 0
    comentarios = []

    for item in itens:
        existe = (
            db.query(Comentario)
            .filter(
                Comentario.autor == item["autor"],
                Comentario.comentario == item["comentario"],
                Comentario.url_post == item["url_post"],
            )
            .first()
        )
        if existe:
            continue

        categoria, matches = detectar_categoria(item["comentario"])
        novo = Comentario(
            autor=item["autor"],
            comentario=item["comentario"],
            foto_url=item.get("foto_url"),
            url_post=item.get("url_post"),
            url_comentario=item.get("url_comentario"),
            categoria=categoria or "neutra",
            palavras=", ".join(matches) if matches else None,
            data_detectada=datetime.utcnow(),
        )
        db.add(novo)
        db.commit()
        db.refresh(novo)

        novos += 1
        comentarios.append(
            {
                "id": novo.id,
                "autor": novo.autor,
                "comentario": novo.comentario,
                "data_detectada": novo.data_detectada.isoformat(),
            }
        )

    return {"novos": novos, "comentarios": comentarios}
