# OSINT Noahide Simplificado

Ferramenta de **coleta, armazenamento e análise de comentários públicos** em postagens do Facebook.  
Foi projetada para **uso de pesquisa e monitoramento** no contexto de OSINT (*Open Source Intelligence*).  

🚀 Backend em **FastAPI + SQLAlchemy**  
🎨 Frontend em **Next.js (React) + TailwindCSS**  
🤖 Coleta com **Selenium (Firefox/GeckoDriver)**  

---

## ✨ Funcionalidades

- 📥 Coletar comentários de posts públicos do Facebook
- 🖼️ Capturar foto de perfil dos autores (quando disponível)
- 🔎 Classificação automática de comentários (`violenta`, `genérica`, `neutra`)
- 🗂️ Exportação de dossiê em **PDF**
- 📊 Filtro por **categoria, texto, autor, palavras**
- 🧹 Gerenciamento de resultados (excluir 1 ou todos)
- 📌 Adicionar comentários ao dossiê manualmente
- 🌐 Interface web responsiva com **Next.js + Tailwind**

---

## ⚙️ Requisitos

### Sistema
- Python **3.11+**
- Node.js **18+**
- Firefox instalado
- GeckoDriver compatível no `PATH`

### Backend (Python)
```bash
pip install -r requirements.txt

