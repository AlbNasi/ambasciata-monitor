import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ARTICOLI_PER_PAGINA = 20;

function Bacheca({ paese, aggiornato, dal, al }) {
  const [notizie, setNotizie] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [paginaAttuale, setPaginaAttuale] = useState(1);

  // Reset alla pagina 1 quando cambiano i filtri
  useEffect(() => {
    setPaginaAttuale(1);
  }, [paese, aggiornato, dal, al]);

  useEffect(() => {
    setCaricamento(true);
    let url = `http://127.0.0.1:8000/news?`;
    if (paese) url += `paese=${paese}&`;
    if (dal) url += `dal=${dal}&`;
    if (al) url += `al=${al}&`;

    axios.get(url)
      .then(res => {
        setNotizie(res.data.notizie);
        setCaricamento(false);
      })
      .catch(err => {
        console.error(err);
        setCaricamento(false);
      });
  }, [paese, aggiornato, dal, al]);

  if (caricamento) return <p style={{ padding: '20px' }}>Caricamento...</p>;

  // Calcola le pagine
  const totalePagine = Math.ceil(notizie.length / ARTICOLI_PER_PAGINA);
  const inizio = (paginaAttuale - 1) * ARTICOLI_PER_PAGINA;
  const fine = inizio + ARTICOLI_PER_PAGINA;
  const notiziePagina = notizie.slice(inizio, fine);

  const stileBottonePagina = (attivo) => ({
    padding: '6px 12px',
    margin: '0 3px',
    cursor: 'pointer',
    backgroundColor: attivo ? '#2e9e6b' : 'white',
    color: attivo ? 'white' : '#555',
    border: `1px solid ${attivo ? '#2e9e6b' : '#ccc'}`,
    borderRadius: '4px',
    fontSize: '0.85em',
  });

  // Genera i numeri di pagina da mostrare
  const pagineDaMostrare = () => {
    const pagine = [];
    const delta = 2; // pagine intorno a quella attuale
    for (let i = 1; i <= totalePagine; i++) {
      if (
        i === 1 ||
        i === totalePagine ||
        (i >= paginaAttuale - delta && i <= paginaAttuale + delta)
      ) {
        pagine.push(i);
      }
    }
    // Aggiungi "..." dove ci sono salti
    const result = [];
    for (let i = 0; i < pagine.length; i++) {
      if (i > 0 && pagine[i] - pagine[i - 1] > 1) {
        result.push('...');
      }
      result.push(pagine[i]);
    }
    return result;
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>{paese ? `Notizie — ${paese}` : 'Tutte le notizie'}</h2>
      <p style={{ color: '#888', fontSize: '0.9em' }}>
        {notizie.length} articoli totali — pagina {paginaAttuale} di {totalePagine}
      </p>

      {/* Lista notizie */}
      {notiziePagina.map((n, i) => (
        <div key={i} style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '15px'
        }}>
          <small style={{ color: '#888' }}>{n.paese} — {n.data}</small>
          <h3 style={{ margin: '8px 0' }}>{n.titolo}</h3>
          <p style={{ color: '#555' }}>{n.testo?.slice(0, 150)}...</p>
          <a href={n.link} target="_blank" rel="noreferrer">Leggi di più →</a>
        </div>
      ))}

      {/* Paginazione */}
      {totalePagine > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px 0',
          gap: '4px'
        }}>
          {/* Freccia sinistra */}
          <button
            onClick={() => setPaginaAttuale(p => Math.max(1, p - 1))}
            disabled={paginaAttuale === 1}
            style={stileBottonePagina(false)}
          >
            ←
          </button>

          {/* Numeri pagina */}
          {pagineDaMostrare().map((p, i) => (
            p === '...'
              ? <span key={i} style={{ padding: '0 4px', color: '#999' }}>...</span>
              : <button
                  key={i}
                  onClick={() => setPaginaAttuale(p)}
                  style={stileBottonePagina(p === paginaAttuale)}
                >
                  {p}
                </button>
          ))}

          {/* Freccia destra */}
          <button
            onClick={() => setPaginaAttuale(p => Math.min(totalePagine, p + 1))}
            disabled={paginaAttuale === totalePagine}
            style={stileBottonePagina(false)}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}

export default Bacheca;