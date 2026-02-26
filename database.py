import sqlite3
from datetime import datetime

DB_PATH = "ambasciata.db"

def init_db():
    """Crea il database e la tabella se non esistono."""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS notizie (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            paese TEXT NOT NULL,
            titolo TEXT NOT NULL,
            data TEXT,
            testo TEXT,
            link TEXT UNIQUE,
            salvato_il TEXT
        )
    """)
    conn.commit()
    conn.close()
    print("Database inizializzato.")

def salva_notizie(notizie):
    """Salva una lista di notizie nel database, evitando duplicati."""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    nuove = 0

    for n in notizie:
        try:
            c.execute("""
                INSERT INTO notizie (paese, titolo, data, testo, link, salvato_il)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (
                n["paese"],
                n["titolo"],
                n["data"],
                n["testo"],
                n["link"],
                datetime.now().isoformat()
            ))
            nuove += 1
        except sqlite3.IntegrityError:
            # Link già presente, skip
            pass

    conn.commit()
    conn.close()
    print(f"  → {nuove} nuove notizie salvate (duplicati ignorati)")

def leggi_notizie(paese=None):
    """Restituisce le notizie dal database, opzionalmente filtrate per paese."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()

    if paese:
        c.execute("SELECT * FROM notizie WHERE paese = ? ORDER BY id DESC", (paese,))
    else:
        c.execute("SELECT * FROM notizie ORDER BY id DESC")

    risultati = [dict(row) for row in c.fetchall()]
    conn.close()
    return risultati

if __name__ == "__main__":
    init_db()