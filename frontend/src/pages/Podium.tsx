import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useGame} from "../context/GameContext.tsx";
import {Trophy, Home, Medal} from "lucide-react";

export default function Podium() {
    const { currentRoom } = useGame();
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentRoom || currentRoom.currentState !== 'GAME_ENDED') {
            navigate("/");
        }
    }, [currentRoom, navigate]);

    if (!currentRoom) return null;

    const players = Object.values(currentRoom.players).sort((a, b) => b.totalScore - a.totalScore);
    const [winner, second, third, ...rest] = players;

    return (
        <div className="min-h-screen bg-black-900 text-white flex flex-col items-center justify-center p-4 overflow-hidden relative">

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-red-50/10 blur-[100px] pointer-events-none" />

            <div className="z-10 text-center mb-10 animate-in fade-in slide-in-from-top-10 duration-700">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-2">GAME RESULTS</h1>
                <p className="text-slate-400 font-bold tracking-widest uppercase">Final Leaderboard</p>
            </div>

            <div className="flex items-end justify-center gap-4 mb-12 w-full max-w-4xl z-10">

                {second && (
                    <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-10 delay-200 duration-700">
                        <div className="mb-2 text-center">
                            <p className="font-bold text-slate-300">{second.nickname}</p>
                            <p className="text-sm text-white-500 font-mono">{second.totalScore} pts</p>
                        </div>
                        <div className="w-24 md:w-32 h-40 bg-dark-800 border-t-4 border-slate-400 rounded-t-lg flex flex-col items-center justify-start pt-4 shadow-2xl relative">
                            <Medal className="w-8 h-8 text-slate-400 mb-2" />
                            <span className="text-4xl font-black text-slate-400">2</span>
                        </div>
                    </div>
                )}

                {winner && (
                    <div className="flex flex-col items-center -mx-2 z-20 animate-in fade-in slide-in-from-bottom-10 duration-700">
                        <div className="mb-4 text-center">
                            <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-2 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
                            <p className="font-black text-2xl text-yellow-500">{winner.nickname}</p>
                            <p className="text-lg text-white font-mono bg-dark-800/50 px-3 py-1 rounded-full border border-yellow-500/30">
                                {winner.totalScore} pts
                            </p>
                        </div>
                        <div className="w-32 md:w-40 h-56 bg-gradient-to-b from-dark-800 to-dark-900 border-t-4 border-yellow-500 rounded-t-lg flex flex-col items-center justify-start pt-6 shadow-[0_0_50px_rgba(234,179,8,0.2)] relative">
                            <span className="text-6xl font-black text-yellow-300">1</span>
                        </div>
                    </div>
                )}

                {third && (
                    <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-10 delay-300 duration-700">
                        <div className="mb-2 text-center">
                            <p className="font-bold text-amber-700">{third.nickname}</p>
                            <p className="text-sm text-white-500 font-mono">{third.totalScore} pts</p>
                        </div>
                        <div className="w-24 md:w-32 h-32 bg-dark-800 border-t-4 border-amber-700 rounded-t-lg flex flex-col items-center justify-start pt-4 shadow-2xl relative">
                            <Medal className="w-8 h-8 text-amber-700 mb-2" />
                            <span className="text-4xl font-black text-amber-800">3</span>
                        </div>
                    </div>
                )}
            </div>

            {rest.length > 0 && (
                <div className="w-full max-w-md bg-dark-800/50 backdrop-blur rounded-2xl p-4 border border-white/5 z-10 animate-in fade-in slide-in-from-bottom-5 delay-500">
                    {rest.map((p, i) => (
                        <div key={p.sessionId} className="flex justify-between items-center p-3 border-b border-white/5 last:border-0">
                            <div className="flex items-center gap-3">
                                <span className="text-slate-500 font-mono w-4">#{i + 4}</span>
                                <span className="font-bold">{p.nickname}</span>
                            </div>
                            <span className="text-shadow-white-500 font-mono">{p.totalScore} pts</span>
                        </div>
                    ))}
                </div>
            )}

            <button
                onClick={() => { window.location.href = '/' }}
                className="mt-12 flex items-center gap-2 text-slate-400 hover:text-white transition-colors z-10 hover:bg-white/10 px-6 py-3 rounded-full"
            >
                <Home className="w-5 h-5" /> Back to Home
            </button>

        </div>
    );
}