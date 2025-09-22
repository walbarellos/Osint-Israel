# backend/fb_scrap_debug.py
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


def scrap_debug(url: str, max_scrolls: int = 3):
    opts = Options()
    opts.headless = False  # visível p/ debug
    driver = webdriver.Firefox(options=opts)
    wait = WebDriverWait(driver, 20)

    print(f"[DEBUG] Abrindo URL: {url}")
    driver.get(url)

    try:
        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "[role='main']")))
    except Exception:
        time.sleep(5)

    # Scrolls
    for i in range(max_scrolls):
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(2)
        print(f"[DEBUG] Scroll {i+1}/{max_scrolls}")

    # Heurística de blocos de comentário
    blocos = driver.find_elements(By.XPATH, "//div[contains(@aria-label, 'Comentário')]")
    if not blocos:
        blocos = driver.find_elements(By.XPATH, "//div[contains(@class, 'x1i10hfl')]")

    print(f"[DEBUG] Blocos candidatos: {len(blocos)}")

    for idx, b in enumerate(blocos[:10], start=1):
        print("=" * 80)
        print(f"[BLOCO {idx}]")

        # Nome simples
        try:
            nome = b.find_element(By.XPATH, ".//span").text
        except:
            nome = "??"
        print(f"Autor: {nome}")

        # SVG <image>
        for el in b.find_elements(By.XPATH, ".//svg//image"):
            hrefs = [el.get_attribute("xlink:href"), el.get_attribute("href")]
            hrefs = [h for h in hrefs if h and not h.startswith("data:image")]
            for h in hrefs:
                print("[IMG SVG]", h)
            if not hrefs:
                print("[IMG SVG] só data:image placeholder")

        # IMG direto
        for el in b.find_elements(By.XPATH, ".//img"):
            src = el.get_attribute("src")
            if src and not src.startswith("data:image"):
                print("[IMG]", src)

        # Dump HTML bruto para inspeção manual
        with open(f"bloco_{idx}.html", "w", encoding="utf-8") as f:
            f.write(b.get_attribute("outerHTML"))

    driver.quit()


if __name__ == "__main__":
    url = "https://www.facebook.com/jovempannews/posts/1254212190073150/"
    scrap_debug(url)
