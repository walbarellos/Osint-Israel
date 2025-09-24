---

# 📖 Shomer OSINT

Ferramenta de **coleta e análise de comentários públicos** voltada para estudos e monitoramento aberto (OSINT).

🔍 Permite:

* Coletar comentários de posts públicos.
* Classificar automaticamente por categoria (detecção de padrões/temas).
* Salvar em **SQLite** (modo local) ou **PostgreSQL** (produção).
* Gerar **dossiês em PDF** com os dados coletados.
* Navegar pelos resultados em uma interface moderna e responsiva.

⚡ **Em breve:** suporte a **YouTube, X (Twitter), Instagram** e outras redes.

---

## 🚀 Tecnologias

* **Backend:** FastAPI, SQLAlchemy, Pydantic, Selenium.
* **Banco de Dados:** SQLite (dev) / PostgreSQL (prod).
* **Frontend:** Next.js, React, TailwindCSS.
* **Exportação:** ReportLab (PDF).

---

## 📂 Estrutura do Projeto

```
osint-noahide/
├── backend/          # API FastAPI + Selenium
│   ├── main.py       # Ponto de entrada da API
│   ├── db.py         # Conexão com banco de dados
│   ├── modelos.py    # ORM (SQLAlchemy)
│   ├── dossie/       # Exportação de relatórios em PDF
│   └── ...
├── frontend/         # Interface Next.js/React
├── comentarios.json  # Exemplo de dados coletados
├── gerar.sh          # Script auxiliar
└── osint.db          # Banco SQLite (modo dev)
```

---

## ⚙️ Instalação e Uso

### 1. Clonar repositório

```bash
git clone git@github.com:walbarellos/Osint-Israel.git
cd osint-noahide
```

### 2. Backend (FastAPI + Selenium)

Criar ambiente virtual e instalar dependências:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Linux/Mac
.venv\Scripts\activate      # Windows

pip install -r requirements.txt
```

Rodar API:

```bash
uvicorn main:app --reload --port 8000
```

API disponível em: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### 3. Frontend (Next.js/React)

```bash
cd frontend
npm install
npm run dev
```

Interface disponível em: [http://localhost:3001](http://localhost:3001) (3000/3001)

---

## 📑 Exportando Dossiês

Após a coleta, é possível exportar relatórios em PDF:

```bash
curl -X POST http://localhost:8000/dossie/gerar/1 -o dossie.pdf
```

---

## 🛣️ Roadmap

* [x] Facebook (comentários públicos)
* [ ] YouTube (comentários de vídeos)
* [ ] X (Twitter)
* [ ] Instagram
* [ ] Dashboards analíticos com gráficos interativos
* [ ] Filtros avançados por palavra-chave, autor e data

---

## ⚠️ Aviso Legal

Este projeto é de uso **educacional e de pesquisa**.
Não se destina a monitoramento privado, perseguição ou coleta de dados pessoais sensíveis.
O usuário final é responsável pelo uso ético e legal da ferramenta.

---

## 📜 Licença

[MIT](LICENSE)

---
