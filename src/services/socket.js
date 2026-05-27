import { io } from 'socket.io-client';

export const socket = io(import.meta.VITE_BACKEND_URL,
    {
        path: "/socket.io",
        transports: ["websocket"],
    }
);
