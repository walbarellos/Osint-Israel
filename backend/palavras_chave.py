# backend/palavras_chave.py

# ⚠️ Mantenha neste arquivo a lista "fonte" (com acentos mesmo).
# O filtros.py normaliza tudo na hora de compilar os padrões.

VIOLENTAS = [
    # Ofensas/ódio/violência
    "genocídio", "genocida", "massacre", "extermínio", "aniquilar",
    "banho de sangue", "assassino", "assassinato",
    "terrorista", "terrorismo", "criminoso de guerra",
    "satanás", "satan", "demônio", "capeta", "diabo", "inferno",
    "escória", "lixo", "nojento", "verme", "praga", "monstro",
    "matar", "morte", "sangue",

    # Grupos
    "hamas", "hezbollah", "talibã", "al qaeda", "isis", "daesh",
]

GENERICAS = [
    # Contexto/conflito
    "israel", "israelense",
    "palestina", "palestino",
    "guerra", "bombardeio", "ataque", "ocupação", "intifada",
    "sionismo", "sionista", "sinagoga",

    # Expressões comuns
    "free palestine", "palestina livre", "apartheid israelense",
    "fora israel", "morte a israel", "ódio aos judeus",
]
