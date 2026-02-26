import React, { useState } from 'react';
import Bacheca from './Bacheca';

function App() {
  const [paeseSelezionato, setPaeseSelezionato] = useState(null);

  return (
    <div>
      <h1 style={{ padding: '20px', borderBottom: '1px solid #ddd' }}>
        🇮🇹 Ambasciata Monitor
      </h1>
      <Bacheca paese={paeseSelezionato} />
    </div>
  );
}

export default App;
