# backend/filtros.py
import re
import unicodedata
from typing import List, Tuple
from .palavras_chave import VIOLENTAS, GENERICAS

def normalizar(s: str) -> str:
    # minúsculas + remove acentos
    return unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode("utf-8").lower()

def _frase_para_regex(frase: str) -> re.Pattern:
    """
    Constrói um regex tolerante a:
      - acentos (porque normalizamos antes)
      - plural/flexões simples (permitimos sufixo \w*)
      - espaços múltiplos entre palavras (\s+)
    Ex.: "criminoso de guerra" => r"\bcriminoso\w*\s+de\w*\s+guerra\w*\b"
    """
    partes = normalizar(frase).split()
    if not partes:
        # fallback para não explodir
        partes = [normalizar(frase)]
    pattern = r"\b" + r"\s+".join(fr"{re.escape(p)}\w*" for p in partes) + r"\b"
    return re.compile(pattern, flags=re.IGNORECASE)

# Compila padrões já normalizados
VIOLENTAS_PATTERNS = [(_t, _frase_para_regex(_t)) for _t in VIOLENTAS]
GENERICAS_PATTERNS = [(_t, _frase_para_regex(_t)) for _t in GENERICAS]

def _casar(texto_norm: str, patterns: List[Tuple[str, re.Pattern]]) -> List[str]:
    achados = []
    for original, pat in patterns:
        if pat.search(texto_norm):
            achados.append(original)
    return achados

def detectar_categoria(texto: str):
    """
    Retorna (categoria, lista_de_palavras)
      categoria ∈ {"violenta", "generica", "neutra"}
    """
    texto_norm = normalizar(texto)

    v = _casar(texto_norm, VIOLENTAS_PATTERNS)
    if v:
        return "violenta", v

    g = _casar(texto_norm, GENERICAS_PATTERNS)
    if g:
        return "generica", g

    return "neutra", []
