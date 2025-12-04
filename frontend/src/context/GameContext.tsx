import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import type {GameRoom} from '../types';

const BROKER_URL = "https://my-whentaken.onrender.com/ws";

interface GameContextType {
    connected: boolean;
    currentRoom: GameRoom | null;
    createRoom: (nickname: string) => void;
    joinRoom: (roomCode: string, nickname: string) => void;
    startGame: (roomCode: string) => void;
    submitGuess: (roomCode: string, lat: number, lon: number, year: number) => void;
    nextRound: (roomCode: string) => void;
}

const GameContext = createContext<GameContextType>({} as GameContextType);

export function GameProvider({ children }: { children: React.ReactNode }) {
    const [connected, setConnected] = useState(false);
    const [currentRoom, setCurrentRoom] = useState<GameRoom | null>(null);
    const stompClient = useRef<Client | null>(null);

    useEffect(() => {
        const client = new Client({
            brokerURL: undefined,
            webSocketFactory: () => new SockJS(BROKER_URL),

            reconnectDelay: 5000,
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,

            debug: (msg) => console.log(msg),

            onConnect: () => {
                setConnected(true);

                client.subscribe('/user/queue/reply', (message) => {
                    const room: GameRoom = JSON.parse(message.body);
                    handleRoomUpdate(room);
                    subscribeToRoomTopic(client, room.roomCode);
                });

                client.subscribe('/user/queue/errors', (message) => {
                    alert('Erro: ' + message.body);
                });
            },

            onStompError: (frame) => {
                console.error('❌ STOMP Error:', frame.headers['message']);
            }
        });

        client.activate();
        stompClient.current = client;

        return () => {
            client.deactivate();
        };
    }, []);

    const subscribeToRoomTopic = (client: Client, roomCode: string) => {
        client.subscribe(`/topic/game/${roomCode}`, (message) => {
            const room: GameRoom = JSON.parse(message.body);
            handleRoomUpdate(room);
        });
    };

    const handleRoomUpdate = (roomData: GameRoom) => {
        setCurrentRoom(roomData);
    };

    const createRoom = (nickname: string) => {
        if (!stompClient.current?.connected) {
            console.warn('Not connected');
            return;
        }

        stompClient.current.publish({
            destination: '/app/create',
            body: JSON.stringify({ nickname })
        });
    };

    const joinRoom = (roomCode: string, nickname: string) => {
        if (!stompClient.current?.connected) return;

        if (stompClient.current) {
            subscribeToRoomTopic(stompClient.current, roomCode);
        }

        stompClient.current.publish({
            destination: '/app/join',
            body: JSON.stringify({ roomCode, nickname })
        });
    };

    const startGame = (roomCode: string) => {
        if (!stompClient.current?.connected) return;

        stompClient.current.publish({
            destination: '/app/start',
            body: roomCode,
        });
    };

    const submitGuess = (roomCode: string, lat: number, lon: number, year: number) => {
        if (!stompClient.current?.connected) return;
        stompClient.current.publish({
            destination: '/app/guess',
            body: JSON.stringify({ roomCode, lat, lon, year }),
        });
    };

    const nextRound = (roomCode: string) => {
        if (!stompClient.current?.connected) return;
        stompClient.current.publish({
            destination: '/app/next-round',
            body: roomCode,
        })
    }

    return (
        <GameContext.Provider value={{ connected, currentRoom, createRoom, joinRoom, startGame, submitGuess, nextRound }}>
            {children}
        </GameContext.Provider>
    );


}

export function useGame() {
    return useContext(GameContext);
}