# backend/reclassificar.py
from datetime import datetime
from .db import get_session, Comentario
from .filtros import detectar_categoria

def reclassificar_todos():
    with next(get_session()) as db:
        rows = db.query(Comentario).all()
        alterados = 0
        for r in rows:
            categoria, matches = detectar_categoria(r.comentario or "")
            nova_palavras = ", ".join(matches) if matches else None

            # só atualiza se mudou algo
            if r.categoria != categoria or (r.palavras or "") != (nova_palavras or ""):
                r.categoria = categoria
                r.palavras = nova_palavras
                # opcional: atualizar timestamp
                # r.data_detectada = datetime.utcnow()
                alterados += 1

        db.commit()
        return alterados

if __name__ == "__main__":
    n = reclassificar_todos()
    print(f"[OK] Reclassificados: {n}")

