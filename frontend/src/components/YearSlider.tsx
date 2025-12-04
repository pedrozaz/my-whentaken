interface YearSliderProps {
    selectedYear: number;
    onChange: (year: number) => void;
}

export default function YearSlider({ selectedYear, onChange }: YearSliderProps) {
    return (
        <div className="w-full">
            <div className="flex justify-between items-end mb-2">
                <span className="text-xs text-slate-400 font-bold uppercase">Select Year</span>
                <span className="text-2xl font-black text-brand-500">{selectedYear}</span>
            </div>

            <input
                type="range"
                min="1900"
                max="2025"
                value={selectedYear}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500 hover:bg-slate-600 transition-colors"
            />

            <div className="flex justify-between text-xs text-slate-500 mt-1 font-mono">
                <span>1900</span>
                <span>2025</span>
            </div>
        </div>
    );
}