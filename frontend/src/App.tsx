import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { GameProvider } from './context/GameContext';

function App() {
    return (
        <GameProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
            </BrowserRouter>
        </GameProvider>
    );
}

export default App;