import { useEffect, useRef, useState } from "react";
import { Client } from '@stomp/stompjs'

const BROKER_URL = 'ws://localhost:8080/ws'

export function useGameWebSocket() {
    const [connected, setConnected] = useState<boolean>(false);
    const stompClient = useRef<Client | null>(null);

    useEffect(() => {
        const client = new Client({
            brokerURL: BROKER_URL,
            reconnectDelay: 5000,
            onConnect: () => {
                console.log("Connected to websocket");
                setConnected(true);
            },
            onStompError: (frame) => {
                console.error("Broker error: " + frame.headers['message']);
            }
        });

        client.activate();
        stompClient.current = client;

        return () => {
            client.deactivate();
        };
    }, []);
    const createRoom = (nickname: string) => {
        if (!stompClient.current?.connected) return;

        stompClient.current.subscribe("/user/queue/reply", (message) => {
            const roomData = JSON.parse(message.body);
            console.log("Room Created:" + roomData);
        });

        stompClient.current.publish({
            destination: "/app/create",
            body: JSON.stringify({ nickname })
        });
    };

    const joinRoom = (roomCode: string, nickname: string) => {
        if (!stompClient.current?.connected) return;

        stompClient.current.subscribe(`/topic/game/${roomCode}`, (message) => {
            const roomData = JSON.parse(message.body);
            console.log("Update received:" + roomData);
        });

        stompClient.current.publish({
            destination: "/app/join",
            body: JSON.stringify({ roomCode, nickname })
        });
    };

    return {
        connected,
        createRoom,
        joinRoom,
    };
}