import { SocketProvider } from './context/SocketContext';
import { MapComponent } from './components/Map/Map';

function App() {
  return (
    <SocketProvider>
      <div className="App" style={{ height: '100vh', width: '100vw', margin: 0, padding: 0 }}>
        <MapComponent />
      </div>
    </SocketProvider>
  );
}

export default App;
