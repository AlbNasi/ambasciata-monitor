import sqlite3
from datetime import datetime

from datetime import datetime

MESI = {
    "gennaio": 1, "febbraio": 2, "marzo": 3, "aprile": 4,
    "maggio": 5, "giugno": 6, "luglio": 7, "agosto": 8,
    "settembre": 9, "ottobre": 10, "novembre": 11, "dicembre": 12
}

def converti_data(data_str):
    """Converte '10 Febbraio 2026' in '2026-02-10' per ordinamento corretto."""
    try:
        parti = data_str.lower().strip().split()
        giorno = int(parti[0])
        mese = MESI.get(parti[1], 1)
        anno = int(parti[2])
        return f"{anno:04d}-{mese:02d}-{giorno:02d}"
    except:
        return "1900-01-01"

DB_PATH = "ambasciata.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS notizie (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            paese TEXT NOT NULL,
            titolo TEXT NOT NULL,
            data TEXT,
            data_iso TEXT,
            testo TEXT,
            link TEXT UNIQUE,
            salvato_il TEXT
        )
    """"")
    conn.commit()
    conn.close()
    print("Database inizializzato.")

def salva_notizie(notizie):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    nuove = 0

    for n in notizie:
        try:
            c.execute("""
                INSERT INTO notizie (paese, titolo, data, data_iso, testo, link, salvato_il)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                n["paese"],
                n["titolo"],
                n["data"],
                converti_data(n["data"]),
                n["testo"],
                n["link"],
                datetime.now().isoformat()
            ))
            nuove += 1
        except sqlite3.IntegrityError:
            pass

    conn.commit()
    conn.close()
    print(f"  → {nuove} nuove notizie salvate (duplicati ignorati)")

def salva_notizie_con_conteggio(notizie):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    nuove = 0
    for n in notizie:
        try:
            c.execute("""
                INSERT INTO notizie (paese, titolo, data, data_iso, testo, link, salvato_il)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                n["paese"], n["titolo"], n["data"],
                converti_data(n["data"]), n["testo"],
                n["link"], datetime.now().isoformat()
            ))
            nuove += 1
        except sqlite3.IntegrityError:
            pass
    conn.commit()
    conn.close()
    return nuove

def leggi_notizie(paese=None, dal=None, al=None):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()

    query = "SELECT * FROM notizie WHERE 1=1"
    params = []

    if paese:
        query += " AND paese = ?"
        params.append(paese)
    if dal:
        query += " AND data_iso >= ?"
        params.append(dal)
    if al:
        query += " AND data_iso <= ?"
        params.append(al)

    query += " ORDER BY data_iso DESC"
    c.execute(query, params)

    risultati = [dict(row) for row in c.fetchall()]
    conn.close()
    return risultati

if __name__ == "__main__":
    init_db()