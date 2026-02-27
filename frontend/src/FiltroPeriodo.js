import React, { useState } from 'react';

const PERIODI_PREDEFINITI = [
  { label: 'Ultima settimana', giorni: 7 },
  { label: 'Ultimo mese', giorni: 30 },
  { label: 'Ultimi 3 mesi', giorni: 90 },
  { label: 'Ultimo anno', giorni: 365 },
];

function FiltroPeriodo({ onFiltra }) {
  const [attivo, setAttivo] = useState(null);
  const [dal, setDal] = useState('');
  const [al, setAl] = useState('');

  const applicaPredefinito = (periodo) => {
    const oggi = new Date();
    const da = new Date();
    da.setDate(oggi.getDate() - periodo.giorni);
    setAttivo(periodo.label);
    setDal('');
    setAl('');
    onFiltra({
      dal: da.toISOString().split('T')[0],
      al: oggi.toISOString().split('T')[0],
    });
  };

  const applicaPersonalizzato = () => {
    if (dal && al) {
      setAttivo('personalizzato');
      onFiltra({ dal, al });
    }
  };

  const resetta = () => {
    setAttivo(null);
    setDal('');
    setAl('');
    onFiltra({ dal: null, al: null });
  };

  const stileBottone = (isAttivo) => ({
    padding: '6px 12px',
    cursor: 'pointer',
    backgroundColor: 'white',
    color: isAttivo ? '#2e9e6b' : '#555',
    border: `1px solid ${isAttivo ? '#2e9e6b' : '#ccc'}`,
    borderRadius: '4px',
    fontSize: '0.85em',
    fontWeight: isAttivo ? 'bold' : 'normal',
  });

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flexWrap: 'wrap',
    }}>

      {PERIODI_PREDEFINITI.map((p) => (
        <button
          key={p.giorni}
          onClick={() => applicaPredefinito(p)}
          style={stileBottone(attivo === p.label)}
        >
          {p.label}
        </button>
      ))}

      <span style={{ color: '#ccc' }}>|</span>

      <input
        type="date"
        value={dal}
        onChange={(e) => setDal(e.target.value)}
        style={{ padding: '5px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.85em' }}
      />
      <span style={{ color: '#999', fontSize: '0.85em' }}>→</span>
      <input
        type="date"
        value={al}
        onChange={(e) => setAl(e.target.value)}
        style={{ padding: '5px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.85em' }}
      />
      <button
        onClick={applicaPersonalizzato}
        style={stileBottone(attivo === 'personalizzato')}
      >
        Applica
      </button>

      <button onClick={resetta} style={stileBottone(false)}>
        ✕ Reset
      </button>
    </div>
  );
}

export default FiltroPeriodo;