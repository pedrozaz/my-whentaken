import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useGame} from "../context/GameContext.tsx";
import {MapContainer, TileLayer, Marker, Popup, Polyline} from "react-leaflet";
import {Trophy, MapPin, ArrowRight, Calendar} from "lucide-react";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const TargetIcon = L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-green-500 drop-shadow-lg"><path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" /></svg>`,
    className: "bg-transparent",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
});

const createPlayerIcon = (initial: string) => L.divIcon({
    html: `<div class="w-8 h-8 rounded-full bg-brand-500 border-2 border-white flex items-center justify-center text-white font-bold shadow-lg">${initial}</div>`,
    className: "bg-transparent",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
});

export default function RoundResults() {
    const { currentRoom } = useGame();
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentRoom || currentRoom.currentState !== 'ROUND_RESULTS') {
            navigate('/');
        }
    }, [currentRoom, navigate]);

    if (!currentRoom?.currentRoundData) return null;

    const target = currentRoom.currentRoundData;
    const players = Object.values(currentRoom.players).sort((a, b) => (b.lastRoundScore || 0) - (a.lastRoundScore || 0));
    const winner = players[0];

    return (
        <div className="h-screen flex flex-col bg-dark-900 text-white overflow-hidden">

            <div className="bg-dark-800 p-4 border-b border-white/5 flex items-center justify-between z-20 shadow-lg">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-500 rounded-full flex items-center justify-center text-dark-900 shadow-lg shadow-red-950-500/20">
                        <Trophy className="w-6 h-6 fill-current" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase">Round Winner</p>
                        <h1 className="text-xl font-black text-white">{winner.nickname} <span className="text-brand-500">+{winner.lastRoundScore} pts</span></h1>
                    </div>
                </div>

                <div className="text-right hidden md:block">
                    <p className="text-xs text-slate-400 font-bold uppercase flex items-center justify-end gap-1">
                        Actual Location <MapPin className="w-3 h-3" />
                    </p>
                    <div className="flex items-center gap-4 text-sm font-mono">
                        <span>{target.lat.toFixed(2)}, {target.lon.toFixed(2)}</span>
                        <span className="text-brand-500 flex items-center gap-1"><Calendar className="w-3 h-3" /> {target.year}</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

                <div className="flex-1 relative bg-slate-800 z-10">
                    <MapContainer center={[target.lat, target.lon]} zoom={4} className="h-full w-full">
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        />

                        <Marker position={[target.lat, target.lon]} icon={TargetIcon}>
                            <Popup>Correct Location (Year: {target.year})</Popup>
                        </Marker>

                        {players.map(p => {
                            if (p.lastGuessLat == null || p.lastGuessLon == null) return null;
                            return (
                                <div key={p.sessionId}>
                                    <Marker
                                        position={[p.lastGuessLat, p.lastGuessLon]}
                                        icon={createPlayerIcon(p.nickname.charAt(0))}
                                    >
                                        <Popup>
                                            <b>{p.nickname}</b><br/>
                                            Year: {p.lastGuessYear}<br/>
                                            Points: {p.lastRoundScore}
                                        </Popup>
                                    </Marker>

                                    <Polyline
                                        positions={[[p.lastGuessLat, p.lastGuessLon], [target.lat, target.lon]]}
                                        pathOptions={{ color: 'black', weight: 2, dashArray: '5, 10', opacity: 0.6 }}
                                    />
                                </div>
                            );
                        })}
                    </MapContainer>
                </div>

                <div className="w-full md:w-80 bg-dark-900 border-l border-white/5 p-4 overflow-y-auto">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Round Ranking</h2>
                    <div className="space-y-3">
                        {players.map((p, index) => (
                            <div key={p.sessionId} className="bg-dark-800 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                                <div className="font-mono text-slate-500 w-4">#{index + 1}</div>
                                <div className="flex-1">
                                    <p className="font-bold text-white">{p.nickname}</p>
                                    <div className="flex gap-2 text-xs text-gray-100-200">
                                        <span>Guessed year: {p.lastGuessYear}</span>
                                    </div>
                                    <div className="flex gap-2 text-xs text-slate-400">
                                        <span>(Answer: {target.year})</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block font-black text-brand-500 text-lg">+{p.lastRoundScore}</span>
                                    <span className="text-[10px] text-slate-500">Total: {p.totalScore}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-6 bg-brand-500 hover:bg-brand-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 group">
                        NEXT ROUND <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

            </div>
        </div>
    );
}