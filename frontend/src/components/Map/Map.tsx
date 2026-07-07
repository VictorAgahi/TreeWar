import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useSocket } from '../../hooks/useSocket';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface PlayerPosition {
  client: string;
  lat: number;
  lng: number;
}

const LocationMarker = ({ room }: { room: string }) => {
  const { socket, connected } = useSocket();
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const [otherPlayers, setOtherPlayers] = useState<PlayerPosition[]>([]);

  useEffect(() => {
    if (socket && connected) {
      socket.emit('join_room', { room });

      socket.on('player_moved', (data: PlayerPosition) => {
        setOtherPlayers(prev => {
          const filtered = prev.filter(p => p.client !== data.client);
          return [...filtered, data];
        });
      });
    }

    return () => {
      if (socket) {
        socket.off('player_moved');
      }
    };
  }, [socket, connected, room]);

  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
      if (socket && connected) {
        socket.emit('move', { room, lat: e.latlng.lat, lng: e.latlng.lng });
      }
    },
  });

  return (
    <>
      {position && (
        <Marker position={position}>
          <Popup>You are here</Popup>
        </Marker>
      )}
      {otherPlayers.map(player => (
        <Marker key={player.client} position={[player.lat, player.lng]}>
          <Popup>Player {player.client}</Popup>
        </Marker>
      ))}
    </>
  );
};

export const MapComponent: React.FC = () => {
  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer center={[48.8566, 2.3522]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker room="global" />
      </MapContainer>
    </div>
  );
};
