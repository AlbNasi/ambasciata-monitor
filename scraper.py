import requests
from bs4 import BeautifulSoup
import time

AMBASCIATE = {
    "USA": "https://ambwashingtondc.esteri.it/it/news/",
    "Francia": "https://ambparigi.esteri.it/it/news/",
    "UK": "https://amblondra.esteri.it/it/news/",
    "Cina": "https://ambpechino.esteri.it/it/news/",
    "Germania": "https://ambberlino.esteri.it/it/news/",
    "Brasile": "https://ambbrasilia.esteri.it/it/news/",
    "India": "https://ambnewdelhi.esteri.it/it/news/",
    "Giappone": "https://ambtokyo.esteri.it/it/news/",
    "Australia": "https://ambcanberra.esteri.it/it/news/",
    "Arabia Saudita": "https://ambriad.esteri.it/it/news/",
    "Egitto": "https://ambilcairo.esteri.it/it/news/",
    "Sudafrica": "https://ambpretoria.esteri.it/it/news/",
}

def get_num_pagine(url):
    """Trova il numero totale di pagine disponibili."""
    try:
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.text, "html.parser")
        pagine = soup.select("a.page-numbers")
        numeri = []
        for p in pagine:
            try:
                numeri.append(int(p.get_text(strip=True)))
            except ValueError:
                pass
        return max(numeri) if numeri else 1
    except:
        return 1

def scrape_pagina(url):
    """Scrapa una singola pagina e restituisce gli articoli."""
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")
        cards = soup.select("div.card-body")
        risultati = []
        for card in cards:
            titolo_tag = card.select_one("h5.card-title a")
            data_tag = card.select_one("div.category-top span")
            testo_tag = card.select_one("p.card-text")
            if not titolo_tag:
                continue
            risultati.append({
                "titolo": titolo_tag.get_text(strip=True),
                "link": titolo_tag.get("href", ""),
                "data": data_tag.get_text(strip=True) if data_tag else "N/D",
                "testo": testo_tag.get_text(strip=True) if testo_tag else "",
            })
        return risultati
    except Exception as e:
        print(f"    ✗ Errore pagina {url}: {e}")
        return []

def scrape_ambasciata(paese, url_base):
    """Scrapa tutte le pagine di un'ambasciata."""
    print(f"Scraping {paese}...")
    num_pagine = get_num_pagine(url_base)
    print(f"  → {num_pagine} pagine trovate")

    tutti = []
    for i in range(1, num_pagine + 1):
        url = url_base if i == 1 else f"{url_base}?pag={i}"
        articoli = scrape_pagina(url)
        for a in articoli:
            a["paese"] = paese
        tutti.extend(articoli)
        time.sleep(0.5)  # pausa per non sovraccaricare il server

    print(f"  → {len(tutti)} articoli totali")
    return tutti

def scrape_tutte():
    tutti = []
    for paese, url in AMBASCIATE.items():
        risultati = scrape_ambasciata(paese, url)
        tutti.extend(risultati)
    return tutti

if __name__ == "__main__":
    from database import init_db, salva_notizie
    init_db()
    notizie = scrape_tutte()
    salva_notizie(notizie)
    print(f"\nTotale articoli raccolti: {len(notizie)}")