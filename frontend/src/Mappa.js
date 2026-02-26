import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix per i marker di Leaflet con React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const PAESI = [
  { nome: 'USA', lat: 38.9, lng: -77.0, emoji: '🇺🇸' },
  { nome: 'Francia', lat: 48.8, lng: 2.3, emoji: '🇫🇷' },
  { nome: 'UK', lat: 51.5, lng: -0.1, emoji: '🇬🇧' },
  { nome: 'Cina', lat: 39.9, lng: 116.4, emoji: '🇨🇳' },
];

function Mappa({ onPaeseSelezionato, paeseAttivo }) {
  return (
    <MapContainer
      center={[30, 10]}
      zoom={2}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© OpenStreetMap contributors'
      />
      {PAESI.map((p) => (
        <Marker key={p.nome} position={[p.lat, p.lng]}>
          <Popup>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2em' }}>{p.emoji}</div>
              <strong>{p.nome}</strong>
              <br />
              <button
                onClick={() => onPaeseSelezionato(
                  paeseAttivo === p.nome ? null : p.nome
                )}
                style={{
                  marginTop: '8px',
                  padding: '5px 10px',
                  cursor: 'pointer',
                  backgroundColor: paeseAttivo === p.nome ? '#dc3545' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px'
                }}
              >
                {paeseAttivo === p.nome ? 'Deseleziona' : 'Filtra notizie'}
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default Mappa;