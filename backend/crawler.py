# backend/crawler.py
"""
Coletor real: integra o fb_parser.coletar_comentarios para extrair comentários
de um post público do Facebook e salvar no banco de dados.
"""

from datetime import datetime
from typing import List, Dict

from fastapi import HTTPException
from sqlalchemy.orm import Session

from .fb_parser import coletar_comentarios as _scrape_fb
from .db import Comentario
from .filtros import detectar_categoria


def coletar_comentarios(link: str, max_scrolls: int = 5) -> List[Dict]:
    """
    Coleta comentários reais de um post do Facebook.

    Args:
        link: URL completa do post público do Facebook.
        max_scrolls: número de rolagens para carregar mais comentários.

    Retorna:
        Lista de dicts no formato:
        {
            "autor": str,
            "comentario": str,
            "foto_url": str | None,
            "url_post": str,
            "url_comentario": str | None
        }
    """
    if not link or "facebook.com" not in link:
        raise ValueError("Forneça a URL completa do post público do Facebook em 'link'.")

    # Delegamos ao parser real (Selenium)
    return _scrape_fb(url=link, max_scrolls=max_scrolls)


def coletar_resultados(link: str, db: Session) -> dict:
    """
    Coleta comentários de um post do Facebook e grava no banco.

    Retorna:
        {
            "novos": int,
            "comentarios": [
                {"id": int, "autor": str, "comentario": str, "data_detectada": str}, ...
            ]
        }
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
