from database import leggi_notizie

notizie = leggi_notizie()
print(f"Totale notizie nel database: {len(notizie)}")
print()

# Mostra le prime 2 per ogni paese
for paese in ["USA", "Francia", "UK", "Cina"]:
    notizie_paese = leggi_notizie(paese)
    print(f"[{paese}] — {len(notizie_paese)} notizie")
    for n in notizie_paese[:2]:
        print(f"  • {n['data']} — {n['titolo'][:60]}...")
    print()