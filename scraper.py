import requests
from bs4 import BeautifulSoup

AMBASCIATE = {
    "USA": "https://ambwashingtondc.esteri.it/it/news/",
    "Francia": "https://ambparigi.esteri.it/it/news/",
    "UK": "https://amblondra.esteri.it/it/news/",
    "Cina": "https://ambpechino.esteri.it/it/news/",
}

def scrape_ambasciata(paese, url):
    print(f"Scraping {paese}...")
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

            titolo = titolo_tag.get_text(strip=True)
            link = titolo_tag.get("href", "")
            data = data_tag.get_text(strip=True) if data_tag else "N/D"
            testo = testo_tag.get_text(strip=True) if testo_tag else ""

            risultati.append({
                "paese": paese,
                "titolo": titolo,
                "data": data,
                "testo": testo,
                "link": link,
            })

        print(f"  → {len(risultati)} articoli trovati")
        return risultati

    except Exception as e:
        print(f"  ✗ Errore per {paese}: {e}")
        return []

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