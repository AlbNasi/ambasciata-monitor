import React, { useState } from 'react';
import Bacheca from './Bacheca';
import Mappa from './Mappa';
import FiltroPeriodo from './FiltroPeriodo';
import axios from 'axios';

function App() {
  const [paeseSelezionato, setPaeseSelezionato] = useState(null);
  const [aggiornamento, setAggiornamento] = useState(null);
  const [caricamento, setCaricamento] = useState(false);
  const [periodo, setPeriodo] = useState({ dal: null, al: null });

  const aggiorna = () => {
    setCaricamento(true);
    setAggiornamento(null);
    axios.post('http://127.0.0.1:8000/scrape')
      .then(res => {
        const nuove = res.data.articoli_nuovi;
        setAggiornamento(nuove > 0 ? `✅ ${nuove} nuovi articoli` : '✅ Nessuna novità');
        setCaricamento(false);
      })
      .catch(() => {
        setAggiornamento('❌ Errore');
        setCaricamento(false);
      });
  };

  return (
    <div>
      {/* Header */}
      <div style={{
        padding: '15px 20px',
        borderBottom: '1px solid #ddd',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <h1 style={{ margin: 0 }}>🇮🇹 Ambasciata Monitor</h1>
        <button
          onClick={aggiorna}
          disabled={caricamento}
          style={{
            padding: '8px 16px',
            cursor: caricamento ? 'not-allowed' : 'pointer',
            backgroundColor: 'white',
            color: caricamento ? '#999' : '#2e9e6b',
            border: `2px solid ${caricamento ? '#ccc' : '#2e9e6b'}`,
            borderRadius: '4px',
            fontSize: '0.95em'
          }}
        >
          {caricamento ? '⏳ Aggiornamento...' : aggiornamento ? aggiornamento : '🔄 Aggiorna notizie'}
        </button>
      </div>

      {/* Filtro periodo */}
      <div style={{
        padding: '12px 20px',
        borderBottom: '1px solid #eee',
        backgroundColor: '#fafafa'
      }}>
        <FiltroPeriodo onFiltra={setPeriodo} />
      </div>

      {/* Mappa */}
      <Mappa
        onPaeseSelezionato={setPaeseSelezionato}
        paeseAttivo={paeseSelezionato}
      />

      {/* Bottone reset paese */}
      {paeseSelezionato && (
        <button
          onClick={() => setPaeseSelezionato(null)}
          style={{
            margin: '10px 20px',
            padding: '8px 16px',
            cursor: 'pointer',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          ← Tutte le notizie
        </button>
      )}

      {/* Bacheca */}
      <Bacheca
        paese={paeseSelezionato}
        aggiornato={aggiornamento}
        dal={periodo.dal}
        al={periodo.al}
      />
    </div>
  );
}

export default App;
