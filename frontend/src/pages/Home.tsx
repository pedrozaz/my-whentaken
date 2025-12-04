import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {ArrowRight, Clock, Hash, LogOut, MapPin, Play} from 'lucide-react';
import { useGame } from "../context/GameContext.tsx";

export default function Home() {
    const navigate = useNavigate();
    const [nickname, setNickname] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const [mode, setMode] = useState<'create' | 'join'>('create');

    const [isNavigating, setIsNavigating] = useState(false);

    const { connected, createRoom, joinRoom, currentRoom } = useGame();

    useEffect(() => {
        if (currentRoom && currentRoom.roomCode && isNavigating) {
            navigate(`/lobby/${currentRoom.roomCode}`);
        }
    }, [currentRoom, isNavigating, navigate]);

    const handleAction = () => {
        if (!nickname) return alert('Please enter a nickname');

        if (!connected) {
            return alert('Conectando ao servidor... aguarde.');
        }

        setIsNavigating(true);

        if (mode === 'create') {
            createRoom(nickname);
        } else {
            if (!roomCode) return alert('Please enter a room code');
            joinRoom(roomCode, nickname);
        }
    };

    const handleLeaveSession = () => {
        window.location.reload();
    };

    const handleRejoin = () => {
        if (currentRoom) {
            navigate(`/lobby/${currentRoom.roomCode}`);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-dark-900 to-[#1a0508]">

            <div className="text-center mb-12 space-y-4">
                <div className="flex justify-center items-center gap-3 text-brand-500 mb-2">
                    <MapPin className="w-8 h-8" />
                    <Clock className="w-8 h-8" />
                </div>
                <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white">
                    WHEN<span className="text-brand-500"> TAKEN</span>
                </h1>

                <div className="flex items-center justify-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></span>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">
                        {connected ? 'Server Online' : 'Connecting...'}
                    </p>
                </div>
            </div>

            {currentRoom && !isNavigating ? (
                <div className="w-full max-w-md bg-dark-800 rounded-2xl shadow-2xl border border-white/5 p-8 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4">
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-bold text-white mb-2">Game in Progress</h2>
                        <p className="text-slate-400">You're connected to the room <span className="text-brand-500 font-mono font-bold">{currentRoom.roomCode}</span></p>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={handleRejoin}
                            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
                        >
                            <Play className="w-5 h-5 fill-current" /> REJOIN
                        </button>

                        <button
                            onClick={handleLeaveSession}
                            className="w-full bg-dark-900 hover:bg-red-900/30 text-slate-300 hover:text-red-400 font-bold py-4 rounded-xl border border-white/5 flex items-center justify-center gap-2 transition-all"
                        >
                            <LogOut className="w-5 h-5" /> LEAVE
                        </button>
                    </div>
                </div>
            ) : (
                <div className="w-full max-w-md bg-dark-800 rounded-2xl shadow-2xl border border-white/5 p-8 backdrop-blur-sm">
                    <div className="flex bg-dark-900 p-1 rounded-xl mb-8">
                        <button
                            onClick={() => setMode('create')}
                            className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all duration-200 ${
                                mode === 'create'
                                    ? 'bg-brand-500 text-white shadow-lg'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            CREATE ROOM
                        </button>
                        <button
                            onClick={() => setMode('join')}
                            className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all duration-200 ${
                                mode === 'join'
                                    ? 'bg-brand-500 text-white shadow-lg'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            JOIN ROOM
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                                Nickname
                            </label>
                            <input
                                type="text"
                                placeholder="Ex: TimeTraveler"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                className="w-full bg-dark-900 border border-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium placeholder:text-slate-600"
                            />
                        </div>

                        {mode === 'join' && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                                    Room Code
                                </label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                                    <input
                                        type="text"
                                        maxLength={4}
                                        placeholder="ABCD"
                                        value={roomCode}
                                        onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                                        className="w-full bg-dark-900 border border-slate-700 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-mono font-bold tracking-widest uppercase placeholder:text-slate-600"
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleAction}
                            disabled={!connected}
                            className="w-full mt-6 bg-brand-500 hover:bg-brand-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 group"
                        >
                            {mode === 'create' ? 'START NEW GAME' : 'ENTER LOBBY'}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}