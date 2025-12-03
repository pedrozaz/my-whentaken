import {useCallback, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useGame} from "../context/GameContext.tsx";
import {MapPin} from "lucide-react";
import GameTimer from "../components/GameTimer.tsx";
import GuessMap from "../components/GuessMap.tsx";
import YearSlider from "../components/YearSlider.tsx";

export default function GameRoom() {
    const { currentRoom, submitGuess, connected } = useGame();
    const navigate = useNavigate();

    const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number} | null>(null);
    const [selectedYear, setSelectedYear] = useState<number>(2000);
    const [hasGuessed, setHasGuessed] = useState(false);

    useEffect(() => {
        if (!currentRoom || !currentRoom.currentRoundData) {
            navigate('/');
        }
    }, [currentRoom, navigate]);

    useEffect(() => {
        setHasGuessed(false);
    }, [currentRoom?.currentRoundNumber]);

    useEffect(() => {
        if (currentRoom?.currentState === 'ROUND_RESULTS') {
            navigate(`/results/${currentRoom.roomCode}`);
        }
    }, [currentRoom, navigate]);

    useEffect(() => {
        setHasGuessed(false);
        setSelectedLocation(null);
        setSelectedYear(2000);
    }, [currentRoom?.currentRoundNumber]);

    const handleTimeUp = useCallback(() => {
        if (hasGuessed) return;

        console.log("Tempo esgotado! Enviando seleção atual...");

        const lat = selectedLocation?.lat || 0;
        const lng = selectedLocation?.lng || 0;

        if (currentRoom?.roomCode) {
            submitGuess(currentRoom.roomCode, lat, lng, selectedYear);
            setHasGuessed(true);
        }
    }, [hasGuessed, selectedLocation, selectedYear, currentRoom, submitGuess]);

    const handleConfirmGuess = () => {
        console.log("Sending guess");
        console.log("Status connection:", connected);
        console.log("Status guessed:", hasGuessed);

        if (hasGuessed) return;

        if (!connected) {
            alert("Error: Disconnected");
            return;
        }

        if (!selectedLocation) {
            alert("Select location on map!");
            return;
        }

        if (currentRoom?.roomCode) {
            submitGuess(currentRoom.roomCode, selectedLocation.lat, selectedLocation.lng, selectedYear);

            setHasGuessed(true);
            console.log("hasGuessed TRUE");
        }
    };

    if (!currentRoom?.currentRoundData) return <div className="text-white p-10">Loading Round...</div>;
    const { imageUrl } = currentRoom.currentRoundData;

    return (
        <div className="h-screen flex flex-col md:flex-row bg-dark-900 text-white overflow-hidden">

            <div className="flex-1 relative bg-black flex items-center justify-center">
                <img
                    src={imageUrl}
                    alt="Guess location"
                    className="max-h-full max-w-full object-contain shadow-2xl"
                    onError={(e) => { e.currentTarget.src = "https://placehold.co/600x400/1e293b/FFF?text=Image+Error"; }}
                />

                <div className="absolute top-4 left-4 bg-dark-900/80 backdrop-blur px-4 py-2 rounded-full flex items-center gap-2 border border-white/10 shadow-lg z-[1000]">
                    <span className="font-bold text-brand-500">ROUND {currentRoom.currentRoundNumber}/{currentRoom.totalRounds}</span>
                    <div className="h-4 w-px bg-white/20"></div>
                    <GameTimer initialTime={60} onTimeUp={handleTimeUp} />
                </div>
            </div>

            <div className="h-1/3 md:h-full md:w-1/3 bg-dark-800 border-l border-white/5 p-4 flex flex-col relative z-10">
                <h2 className="text-xl font-black mb-4 flex items-center gap-2">
                    <MapPin className="text-brand-500" /> TAKE A GUESS
                </h2>

                <div className="flex-1 bg-slate-700 rounded-xl mb-4 border-2 border-slate-600 overflow-hidden relative isolate">
                    <GuessMap onLocationSelect={(lat, lng) => !hasGuessed && setSelectedLocation({ lat, lng })} />
                </div>

                <div className={`bg-dark-900 p-4 rounded-xl border border-white/5 mb-4 ${hasGuessed ? 'opacity-50 pointer-events-none' : ''}`}>
                    <YearSlider selectedYear={selectedYear} onChange={setSelectedYear} />
                </div>

                <button
                    onClick={handleConfirmGuess}
                    disabled={hasGuessed}
                    className={`w-full font-bold py-3 rounded-xl shadow-lg transition-transform active:scale-95 
                ${hasGuessed
                        ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                        : 'bg-brand-500 hover:bg-brand-600 text-white'}`}
                >
                    {hasGuessed ? 'GUESS SUBMITTED' : 'CONFIRM GUESS'}
                </button>
            </div>
        </div>
    );
}