import tempfile
import os
from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from io import BytesIO
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Image, PageBreak
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
import requests

from .db import get_session, Comentario

router = APIRouter(prefix="/dossie", tags=["dossie"])

@router.post("/adicionar/{comentario_id}")
def adicionar(comentario_id: int, db: Session = Depends(get_session)):
    c = db.query(Comentario).filter(Comentario.id == comentario_id).first()
    if not c:
        return {"erro": "Comentário não encontrado"}
    c.categoria = "dossie"
    db.commit()
    return {"msg": "Comentário adicionado ao dossiê"}

@router.get("/exportar")
def exportar(db: Session = Depends(get_session)):
    comentarios = db.query(Comentario).filter(Comentario.categoria == "dossie").all()

    # cria buffer
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    styles = getSampleStyleSheet()

    titulo = ParagraphStyle("Titulo", parent=styles["Title"], alignment=TA_CENTER, fontSize=16, spaceAfter=20)
    subtitulo = ParagraphStyle("Subtitulo", parent=styles["Normal"], alignment=TA_CENTER, fontSize=10, textColor="gray")
    comentario_style = ParagraphStyle("Comentario", parent=styles["Normal"], fontSize=11, italic=True, spaceAfter=6)

    story = []
    story.append(Paragraph("Dossiê de Comentários OSINT Noahide", titulo))
    story.append(Paragraph(f"Gerado em {datetime.utcnow().strftime('%d/%m/%Y %H:%M:%S')} UTC", subtitulo))
    story.append(Paragraph(f"Total de comentários: {len(comentarios)}", subtitulo))
    story.append(Spacer(1, 20))

    for c in comentarios:
        story.append(Paragraph(f"<b>Autor:</b> {c.autor}", styles["Normal"]))
        story.append(Paragraph(c.comentario, comentario_style))

        if c.url_post:
            story.append(Paragraph(f'<b>Publicação:</b> <a href="{c.url_post}">Ver publicação</a>', styles["Normal"]))
        if c.url_comentario:
            story.append(Paragraph(f'<b>Perfil:</b> <a href="{c.url_comentario}">Ver perfil</a>', styles["Normal"]))

        story.append(Paragraph(f"<b>Data:</b> {c.data_detectada}", styles["Normal"]))

        if c.foto_url:
            try:
                img_data = requests.get(c.foto_url, timeout=5).content
                img = Image(BytesIO(img_data), width=100, height=100)
                img.hAlign = "CENTER"
                story.append(img)
                story.append(Paragraph("Foto do perfil", subtitulo))
            except Exception:
                story.append(Paragraph("(Imagem não carregada)", styles["Normal"]))

        story.append(Spacer(1, 15))
        story.append(Paragraph("―" * 80, subtitulo))
        story.append(Spacer(1, 20))

    # apêndice legal
    story.append(PageBreak())
    story.append(Paragraph("📜 Apêndice Legal", titulo))
    dispositivos = [
        "📖 Constituição Federal, Art. 5º, XLII: A prática do racismo constitui crime inafiançável e imprescritível.",
        "📖 Código Penal, Art. 286: Incitar, publicamente, a prática de crime.",
        "📖 Código Penal, Art. 287: Fazer, publicamente, apologia de fato criminoso ou de autor de crime.",
        "📖 Lei 7.716/1989: Define crimes resultantes de preconceito de raça, cor, etnia, religião ou procedência nacional.",
        "📖 PIDCP (ONU), Art. 20: É proibida por lei qualquer apologia do ódio nacional, racial ou religioso que constitua incitação à discriminação, à hostilidade ou à violência.",
        "📖 Convenção Interamericana contra o Racismo (2013).",
    ]
    for d in dispositivos:
        story.append(Paragraph(d, styles["Normal"]))
        story.append(Spacer(1, 8))

    doc.build(story)
    buffer.seek(0)

    # grava em arquivo temporário
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    tmp.write(buffer.getvalue())
    tmp.close()

    filename = f"dossie_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.pdf"
    return FileResponse(tmp.name, media_type="application/pdf", filename=filename)
