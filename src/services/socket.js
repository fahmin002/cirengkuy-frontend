import { io } from 'socket.io-client';

export const socket = io(
    "https://paso-remarkable-updating-queue.trycloudflare.com"
);