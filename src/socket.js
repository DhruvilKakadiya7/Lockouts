import { io } from 'socket.io-client';

const socket = 
io('https://lockouts-server.onrender.com/', {
    transports: ["websocket"],
    upgrade: false
});

export default socket;
