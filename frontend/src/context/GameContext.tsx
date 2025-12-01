import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import type {GameRoom} from '../types';

const BROKER_URL = 'ws://localhost:8080/ws';

interface GameContextType {
    connected: boolean;
    currentRoom: GameRoom | null;
    createRoom: (nickname: string) => void;
    joinRoom: (roomCode: string, nickname: string) => void;
}

const GameContext = createContext<GameContextType>({} as GameContextType);

export function GameProvider({ children }: { children: React.ReactNode }) {
    const [connected, setConnected] = useState(false);
    const [currentRoom, setCurrentRoom] = useState<GameRoom | null>(null);
    const stompClient = useRef<Client | null>(null);

    useEffect(() => {
        const client = new Client({
            brokerURL: BROKER_URL,
            reconnectDelay: 5000,
            debug: (str) => console.log('STOMP Debug:', str),
            onConnect: () => {
                console.log('✅ Global WebSocket Connected');
                setConnected(true);

                client.subscribe('/user/queue/reply', (message) => {
                    console.log('📩 Message received /user/queue/reply');
                    const room: GameRoom = JSON.parse(message.body);
                    handleRoomUpdate(room);

                    subscribeToRoomTopic(client, room.roomCode);
                });

                client.subscribe('/user/queue/errors', (message) => {
                    console.error('🔥 Server error:', message.body);
                    alert('Erro: ' + message.body);
                });
            },
            onStompError: (frame) => {
                console.error('❌ Broker error: ' + frame.headers['message']);
            }
        });

        client.activate();
        stompClient.current = client;

        return () => {
            client.deactivate();
        };
    }, []);

    const subscribeToRoomTopic = (client: Client, roomCode: string) => {
        console.log(`🎧 Listening: /topic/game/${roomCode}`);
        client.subscribe(`/topic/game/${roomCode}`, (message) => {
            const room: GameRoom = JSON.parse(message.body);
            handleRoomUpdate(room);
        });
    };

    const handleRoomUpdate = (roomData: GameRoom) => {
        console.log('📦 Room Update State:', roomData);
        setCurrentRoom(roomData);
    };

    const createRoom = (nickname: string) => {
        if (!stompClient.current?.connected) {
            console.warn('Not connected');
            return;
        }

        console.log('📤 CREATE /app/create');
        stompClient.current.publish({
            destination: '/app/create',
            body: JSON.stringify({ nickname })
        });
    };

    const joinRoom = (roomCode: string, nickname: string) => {
        if (!stompClient.current?.connected) return;

        console.log(`📤 JOIN ${roomCode}`);

        if (stompClient.current) {
            subscribeToRoomTopic(stompClient.current, roomCode);
        }

        stompClient.current.publish({
            destination: '/app/join',
            body: JSON.stringify({ roomCode, nickname })
        });
    };

    return (
        <GameContext.Provider value={{ connected, currentRoom, createRoom, joinRoom }}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    return useContext(GameContext);
}