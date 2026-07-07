import { useState } from 'react';
import { SocketProvider } from './context/SocketContext';
import { MapComponent } from './components/Map/Map';
import { LobbyPage } from './pages/LobbyPage/LobbyPage';

function App() {
  const [gameState, setGameState] = useState<'lobby' | 'playing'>('lobby');
  const [room, setRoom] = useState('');
  const [nickname, setNickname] = useState('');

  const handleJoinGame = (roomId: string, name: string) => {
    setRoom(roomId);
    setNickname(name);
    setGameState('playing');
  };

  return (
    <SocketProvider>
      <div className="App" style={{ height: '100vh', width: '100vw', margin: 0, padding: 0 }}>
        {gameState === 'lobby' ? (
          <LobbyPage onJoinGame={handleJoinGame} />
        ) : (
          <MapComponent room={room} nickname={nickname} />
        )}
      </div>
    </SocketProvider>
  );
}

export default App;
