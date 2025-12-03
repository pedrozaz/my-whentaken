import {useEffect, useState} from "react";
import {Clock} from "lucide-react";

export default function GameTimer({ initialTime = 60, onTimeUp }: { initialTime?: number, onTimeUp?: () => void }) {
    const [timeLeft, setTimeLeft] = useState(initialTime);

    useEffect(() => {
        if (timeLeft <= 0) {
            onTimeUp?.();
            return;
        }

        const timerId = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft, onTimeUp]);

    return (
        <div className={"flex items-center gap-2"}>
            <Clock className={`w-4 h-4 ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`} />
            <span className={`font-mono ${timeLeft < 10 ? 'text-red-500' : 'text-white'}`}>
                00:{timeLeft.toString().padStart(2, '0')}
            </span>
        </div>
    );
}