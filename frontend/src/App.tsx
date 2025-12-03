import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Lobby from "./pages/Lobby.tsx";
import { GameProvider } from './context/GameContext';

function App() {
    return (
        <GameProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/lobby/:roomCode" element={<Lobby />} />
                </Routes>
            </BrowserRouter>
        </GameProvider>
    );
}

export default App;