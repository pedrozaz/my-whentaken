import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Lobby from "./pages/Lobby.tsx";
import { GameProvider } from './context/GameContext';
import GameRoom from "./pages/GameRoom.tsx";
import RoundResults from "./pages/RoundResults.tsx";
import Podium from "./pages/Podium.tsx";

function App() {
    return (
        <GameProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/lobby/:roomCode" element={<Lobby />} />
                    <Route path="/game/:roomCode" element={<GameRoom />} />
                    <Route path="/results/:roomCode" element={<RoundResults />} />
                    <Route path="/podium/:roomCode" element={<Podium />} />
                </Routes>
            </BrowserRouter>
        </GameProvider>
    );
}

export default App;