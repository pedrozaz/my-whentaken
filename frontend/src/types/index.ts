export interface Player {
    sessionId: string;
    nickname: string;
    totalScore: number;
    lastRoundScore?: number;
}

export interface RoundData {
    imageUrl: string;
    lat: number;
    lon: number;
    year: number;
}

export interface GameRoom {
    roomCode: string;
    hostSessionId: string;
    currentState: 'WAITING' | 'PLAYING' | 'ROUND_RESULTS' | 'GAME_ENDED';
    players: Record<string, Player>
    currentRoundNumber: number;
    totalRounds: number;
    currentRoundData?: RoundData;
}