from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db, leggi_notizie
from scraper import scrape_tutte
from database import salva_notizie

app = FastAPI()

# Permette al frontend (che gira su un'altra porta) di chiamare l'API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    init_db()

@app.get("/news")
def get_news(paese: str = None):
    """Restituisce tutte le notizie, o solo quelle di un paese."""
    notizie = leggi_notizie(paese)
    return {"totale": len(notizie), "notizie": notizie}

@app.post("/scrape")
def scrape():
    """Lancia lo scraping e salva le nuove notizie."""
    notizie = scrape_tutte()
    salva_notizie(notizie)
    return {"messaggio": "Scraping completato", "articoli_trovati": len(notizie)}