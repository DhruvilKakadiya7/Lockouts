import { io } from 'socket.io-client';

const socket = 
io('https://lockouts-server-production.up.railway.app/', {
    transports: ["websocket"],
    upgrade: false
});

export default socket;