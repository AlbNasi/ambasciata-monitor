import React, { useState } from 'react';
import Bacheca from './Bacheca';
import Mappa from './Mappa';

function App() {
  const [paeseSelezionato, setPaeseSelezionato] = useState(null);

  return (
    <div>
      <h1 style={{ padding: '20px', borderBottom: '1px solid #ddd' }}>
        🇮🇹 Ambasciata Monitor
      </h1>
      <Mappa
        onPaeseSelezionato={setPaeseSelezionato}
        paeseAttivo={paeseSelezionato}
      />
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
      <Bacheca paese={paeseSelezionato} />
    </div>
  );
}

export default App;
