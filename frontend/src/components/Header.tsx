import { Link } from 'react-router-dom';
import {MapPin} from "lucide-react";
import {useGame} from "../context/GameContext.tsx";

export default function Header() {
    const {connected} = useGame();

    return (
        <div className="w-full max-w-4xl flex justify-between items-center py-6 mb-4 px-4 md:px-0">
            <Link to="/" className="flex items-center gap-2 text-brand-500 hover:opacity-80 transition-opacity">
                <MapPin className="w-6 h-6" />
                <span className="font-black text-xl tracking-tighter text-white">
                    WHEN<span className="text-brand-500"> TAKEN</span>
                </span>
            </Link>

            <div className="flex items-center gap-2 text-slate-400 bg-dark-800 px-4 py-2 rounded-full border border-white/5">
                <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-xs font-bold uppercase tracking-wider">
                    {connected ? 'Live' : 'Offline'}
                </span>
            </div>
        </div>
    );
}