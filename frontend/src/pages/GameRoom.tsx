import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useGame} from "../context/GameContext.tsx";
import {MapPin} from "lucide-react";
import GameTimer from "../components/GameTimer.tsx";
import GuessMap from "../components/GuessMap.tsx";
import YearSlider from "../components/YearSlider.tsx";

export default function GameRoom() {
    const { currentRoom } = useGame();
    const navigate = useNavigate();

    const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number} | null>(null);
    const [selectedYear, setSelectedYear] = useState<number>(2000);

    useEffect(() => {
        if (!currentRoom || !currentRoom.currentRoundData) {
            navigate('/');
        }
    }, [currentRoom, navigate]);

    const handleConfirmGuess = () => {
        if (!selectedLocation) {
            alert("Select a location on map!");
            return;
        }

        console.log("Sending guess:", {
            lat: selectedLocation.lat,
            lng: selectedLocation.lng,
            year: selectedYear,
            roomCode: currentRoom?.roomCode
        });

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
                    onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/600x400/1e293b/FFF?text=Image+Error";
                    }}
                />

                <div className="absolute top-4 left-4 bg-dark-900/80 backdrop-blur px-4 py-2 rounded-full flex items-center gap-2 border border-white/10 shadow-lg z-[1000]">
                    <span className="font-bold text-brand-500">ROUND {currentRoom.currentRoundNumber}/{currentRoom.totalRounds}</span>
                    <div className="h-4 w-px bg-white/20"></div>
                    <GameTimer initialTime={60} onTimeUp={() => alert("Time's up!")} />
                </div>
            </div>

            <div className="h-1/3 md:h-full md:w-1/3 bg-dark-800 border-l border-white/5 p-4 flex flex-col relative z-10">
                <h2 className="text-xl font-black mb-4 flex items-center gap-2">
                    <MapPin className="text-brand-500" /> YOUR GUESS
                </h2>

                <div className="flex-1 bg-slate-700 rounded-xl mb-4 border-2 border-slate-600 overflow-hidden relative isolate">
                    <GuessMap onLocationSelect={(lat, lng) => setSelectedLocation({ lat, lng })} />
                </div>

                <div className="bg-dark-900 p-4 rounded-xl border border-white/5 mb-4">
                    <YearSlider selectedYear={selectedYear} onChange={setSelectedYear} />
                </div>

                <button
                    onClick={handleConfirmGuess}
                    className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 rounded-xl shadow-lg transition-transform active:scale-95"
                >
                    CONFIRM GUESS
                </button>
            </div>
        </div>
    );
}