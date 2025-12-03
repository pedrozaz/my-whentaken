import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Lobby from "./pages/Lobby.tsx";
import { GameProvider } from './context/GameContext';
import GameRoom from "./pages/GameRoom.tsx";

function App() {
    return (
        <GameProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/lobby/:roomCode" element={<Lobby />} />
                    <Route path="/game/:roomCode" element={<GameRoom />} />
                </Routes>
            </BrowserRouter>
        </GameProvider>
    );
}

export default App;