import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useGame} from "../context/GameContext.tsx";
import {MapPin, Clock} from "lucide-react";

export default function GameRoom() {
    const {currentRoom} = useGame();
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState(60);

    useEffect(() => {
        if (!currentRoom || !currentRoom.currentRoundData) {
            navigate("/");
        }
    }, [currentRoom, navigate]);

    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    if (!currentRoom?.currentRoundData) return <div className="text-white p-10">Loading Round...</div>;

    const {imageUrl} = currentRoom.currentRoundData;

    console.log("Image url: ", imageUrl);

    return (
        <div className="h-screen flex flex-col md:flex-row bg-dark-900 text-white overflow-hidden">

            <div className="flex-1 relative bg-black flex items-center justify-center">
                <img
                    src={imageUrl}
                    alt="Guess location"
                    className="max-h-full max-w-full object-contain shadow-2xl"
                    onError={(e) => {
                        console.error("Failed to load image: ", imageUrl);
                        e.currentTarget.src = ("https://placehold.co/600x400/1e293b/FFF?text=Image+Error");
                    }}
                />

                <div className="absolute top-4 left-4 bg-dark-900/80 backdrop-blur px-4 py-2 rounded-full flex items-center gap-2 border border-white/10 shadow-lg">
                    <span className="font-bold text-brand-500">ROUND {currentRoom.currentRoundNumber}/{currentRoom.totalRounds}</span>
                    <div className="h-4 w-px bg-white/20"></div>

                    {/* Timer Visual */}
                    <Clock className={`w-4 h-4 ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`} />
                    <span className={`font-mono ${timeLeft < 10 ? 'text-red-500' : 'text-white'}`}>
                00:{timeLeft.toString().padStart(2, '0')}
            </span>
                </div>
            </div>

            <div className="h-1/3 md:h-full md:w-1/3 bg-dark-800 border-l border-white/5 p-4 flex flex-col relative z-10">
                <h2 className="text-xl font-black mb-4 flex items-center gap-2">
                    <MapPin className="text-brand-500" /> YOUR GUESS
                </h2>

                <div className="flex-1 bg-slate-700 rounded-xl mb-4 flex items-center justify-center border-2 border-dashed border-slate-500/50">
                    <p className="text-slate-400 font-bold">MAPA AQUI</p>
                </div>

                <div className="bg-dark-900 p-4 rounded-xl border border-white/5 mb-4">
                    <p className="text-xs text-slate-400 uppercase font-bold mb-2">Select Year</p>
                    <div className="h-8 bg-slate-700 rounded-lg animate-pulse"></div>
                </div>

                <button className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 rounded-xl shadow-lg transition-transform active:scale-95">
                    CONFIRM GUESS
                </button>
            </div>
        </div>
    );
}