import json
import time
import requests
from typing import Dict, List

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.options import Options

# Rota correta no backend (já ajustada para /resultados/)
BACKEND_URL = "http://127.0.0.1:8000/resultados/"


def _limpar(s: str) -> str:
    return (s or "").replace("\n", " ").strip()


def _extrair_nome(bloco) -> str:
    """Extrai o nome do autor do comentário."""
    try:
        return _limpar(bloco.find_element(By.XPATH, ".//a[@role='link']//span").text)
    except Exception:
        pass
    try:
        aria = bloco.get_attribute("aria-label") or ""
        if "comentário de" in aria.lower():
            return _limpar(aria.split("comentário de", 1)[1].split("há")[0])
    except Exception:
        pass
    try:
        href = bloco.find_element(By.XPATH, ".//a[@role='link']").get_attribute("href")
        if "facebook.com/" in href:
            slug = href.split("facebook.com/")[1].split("/")[0]
            if slug and not slug.startswith("profile.php"):
                return slug.replace(".", " ").title()
    except Exception:
        pass
    return "Desconhecido"


def _extrair_comentario(bloco) -> str:
    """Pega o maior texto encontrado no comentário."""
    textos = [el.text for el in bloco.find_elements(By.CSS_SELECTOR, "div[dir='auto']")]
    textos = [_limpar(t) for t in textos if _limpar(t)]
    return max(textos, key=len) if textos else ""


def _extrair_foto(bloco) -> str | None:
    """Tenta várias abordagens para capturar a foto de perfil."""
    candidatos = []

    # 1) <image> em mask/svg
    for el in bloco.find_elements(By.CSS_SELECTOR, "mask image, svg image"):
        href = el.get_attribute("xlink:href") or el.get_attribute("href")
        if href:
            candidatos.append(href)

    # 2) <img> dentro do link do autor
    for el in bloco.find_elements(By.CSS_SELECTOR, "a[role='link'] img"):
        src = el.get_attribute("src")
        if src:
            candidatos.append(src)

    # 3) fallback: qualquer <img>
    for el in bloco.find_elements(By.CSS_SELECTOR, "img"):
        src = el.get_attribute("src")
        if src:
            candidatos.append(src)

    return candidatos[0] if candidatos else None


def coletar_comentarios(url: str, max_scrolls: int = 5) -> List[Dict]:
    """Coleta comentários de um post do Facebook e envia para o backend."""
    opts = Options()
    opts.headless = True
    driver = webdriver.Firefox(options=opts)

    print(f"[DEBUG] Abrindo URL: {url}")
    driver.get(url)
    time.sleep(5)

    for i in range(max_scrolls):
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(3)
        print(f"[DEBUG] Scroll {i+1}/{max_scrolls}")

    blocos = driver.find_elements(By.CSS_SELECTOR, "div[role='article']")
    print(f"[DEBUG] Encontrados {len(blocos)} blocos")

    resultados: List[Dict] = []

    for b in blocos:
        try:
            autor = _extrair_nome(b)
            comentario = _extrair_comentario(b)
            foto_url = _extrair_foto(b)

            if not comentario:
                continue

            item = {
                "autor": autor,
                "comentario": comentario,
                "foto_url": foto_url,
                "url_post": url,
                "url_comentario": url,
            }
            resultados.append(item)

            print(f"[DEBUG] {autor} → {comentario[:50]}... | Foto: {bool(foto_url)}")

            # Envia direto para o backend
            try:
                resp = requests.post(BACKEND_URL, json=item)
                if resp.status_code in (200, 201):
                    print(f"[API] Inserido no backend: {autor}")
                else:
                    print(f"[API] Erro {resp.status_code}: {resp.text}")
            except Exception as e:
                print(f"[API] Falha ao enviar: {e}")

        except Exception as e:
            print(f"[WARN] Falha ao processar bloco: {e}")

    driver.quit()

    with open("comentarios.json", "w", encoding="utf-8") as f:
        json.dump(resultados, f, ensure_ascii=False, indent=2)

    print(f"[DEBUG] Resultado final salvo em comentarios.json")
    return resultados


if __name__ == "__main__":
    url = "https://www.facebook.com/jovempannews/posts/1254212190073150/"
    coletar_comentarios(url)
