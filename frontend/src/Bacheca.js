import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Bacheca({ paese, aggiornato, dal, al }) {
  const [notizie, setNotizie] = useState([]);
  const [caricamento, setCaricamento] = useState(true);

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

  if (caricamento) return <p>Caricamento...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>{paese ? `Notizie — ${paese}` : 'Tutte le notizie'}</h2>
      <p>{notizie.length} articoli trovati</p>
      {notizie.map((n, i) => (
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
    </div>
  );
}

export default Bacheca;