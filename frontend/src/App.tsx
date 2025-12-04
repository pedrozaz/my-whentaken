import {BrowserRouter, Routes, Route, useNavigate, useLocation} from 'react-router-dom';
import Home from './pages/Home';
import Lobby from "./pages/Lobby.tsx";
import {GameProvider} from './context/GameContext';
import GameRoom from "./pages/GameRoom.tsx";
import RoundResults from "./pages/RoundResults.tsx";
import Podium from "./pages/Podium.tsx";
import {useEffect} from "react";

function NavigationHandler() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handlePopState = () => {
            if (location.pathname !== '/') {
                console.log("Redirected to Home");
                navigate("/");
            }
        };
        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, [location, navigate]);

    return null;
}

function App() {
    return (
        <GameProvider>
            <BrowserRouter>
                <NavigationHandler />
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