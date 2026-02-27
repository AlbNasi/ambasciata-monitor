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
def get_news(paese: str = None, dal: str = None, al: str = None):
    """Restituisce le notizie filtrate per paese e/o periodo."""
    notizie = leggi_notizie(paese=paese, dal=dal, al=al)
    return {"totale": len(notizie), "notizie": notizie}

@app.post("/scrape")
def scrape():
    from database import salva_notizie_con_conteggio
    notizie = scrape_tutte()
    nuove = salva_notizie_con_conteggio(notizie)
    return {"messaggio": "Scraping completato", "articoli_nuovi": nuove}