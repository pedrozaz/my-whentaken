import { useEffect } from "react";
import {useNavigate, useParams} from "react-router-dom";
import { useGame } from "../context/GameContext.tsx";
import { Users, Copy, Play } from "lucide-react";
import Header from "../components/Header.tsx";

export default function Lobby() {
    const { roomCode } = useParams();
    const { currentRoom, startGame } = useGame();
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentRoom) navigate('/');
    }, [currentRoom, navigate]);

    useEffect(() => {
        if (currentRoom?.currentState === 'PLAYING') {
            navigate(`/game/${currentRoom.roomCode}`);
        }
    }, [currentRoom, navigate]);

    if (!currentRoom) return null;

    const players = Object.values(currentRoom.players);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(roomCode || '');
        alert('Copied!');
    };

    return (
        <div className="min-h-screen flex flex-col items-center p-4 bg-gradient-to-b from-dark-900 to-[#1a0508]">

            <Header />

            <main className="w-full max-w-2xl space-y-6">

                <div className="bg-dark-800 rounded-2xl p-8 text-center border border-white/5 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-500 to-purple-600" />

                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Room Code</p>
                    <div
                        onClick={copyToClipboard}
                        className="text-6xl md:text-8xl font-black text-white tracking-widest cursor-pointer hover:text-brand-500 transition-colors flex justify-center items-center gap-4"
                    >
                        {roomCode}
                        <Copy className="w-6 h-6 text-slate-600 group-hover:text-brand-500 opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                    <p className="text-slate-500 text-sm mt-2">Click to copy & invite friends</p>
                </div>

                <div className="bg-dark-800/50 rounded-2xl p-6 border border-white/5 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <Users className="w-5 h-5 text-brand-500" />
                        <h2 className="text-lg font-bold text-white">
                            PLAYERS <span className="text-slate-500 ml-2 text-sm">({players.length}/6)</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {players.map((player) => (
                            <div key={player.sessionId} className="bg-dark-900 p-4 rounded-xl border border-white/5 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                    {player.nickname.charAt(0).toUpperCase()}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-white font-bold truncate">{player.nickname}</p>
                                    <p className="text-xs text-slate-500 truncate">Ready</p>
                                </div>
                            </div>
                        ))}

                        {Array.from({ length: Math.max(0, 6 - players.length) }).map((_, i) => (
                            <div key={`empty-${i}`} className="bg-dark-900/30 p-4 rounded-xl border border-white/5 border-dashed flex items-center gap-3 opacity-50">
                                <div className="w-10 h-10 rounded-full bg-slate-800" />
                                <div className="h-4 w-20 bg-slate-800 rounded" />
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={() => startGame(roomCode || '')}
                    className="w-full bg-white hover:bg-slate-200 text-dark-900 font-black py-4 rounded-xl shadow-xl shadow-white/10 active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-wide text-lg"
                >
                    <Play className="w-6 h-6 fill-current" />
                    Start Game
                </button>

            </main>
        </div>
    );
}