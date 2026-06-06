"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const url_1 = require("url");
const socket_io_1 = require("socket.io");
const dev = process.env.NODE_ENV !== 'production';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const next = require('next');
const app = next({ dev, webpack: true });
const handle = app.getRequestHandler();
const port = parseInt(process.env.PORT || '3000', 10);
const rooms = new Map();
app.prepare().then(() => {
    const httpServer = (0, http_1.createServer)((req, res) => {
        const parsedUrl = (0, url_1.parse)(req.url, true);
        handle(req, res, parsedUrl);
    });
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);
        let currentRoom = null;
        socket.on('join-room', (roomId) => {
            currentRoom = roomId;
            socket.join(roomId);
            if (!rooms.has(roomId)) {
                rooms.set(roomId, new Set());
            }
            const roomUsers = rooms.get(roomId);
            const existingUsers = Array.from(roomUsers);
            // Send existing users to the new user
            socket.emit('existing-users', existingUsers);
            // Add new user to room
            roomUsers.add(socket.id);
            // Notify existing users about the new user
            socket.to(roomId).emit('user-joined', socket.id);
            console.log(`User ${socket.id} joined room ${roomId}. Users in room: ${roomUsers.size}`);
        });
        socket.on('offer', (payload) => {
            io.to(payload.target).emit('offer', {
                sender: socket.id,
                sdp: payload.sdp,
            });
        });
        socket.on('answer', (payload) => {
            io.to(payload.target).emit('answer', {
                sender: socket.id,
                sdp: payload.sdp,
            });
        });
        socket.on('ice-candidate', (payload) => {
            io.to(payload.target).emit('ice-candidate', {
                sender: socket.id,
                candidate: payload.candidate,
            });
        });
        socket.on('chat-message', (payload) => {
            socket.to(payload.roomId).emit('chat-message', {
                message: payload.message,
                sender: payload.sender,
                senderId: socket.id,
                timestamp: Date.now(),
            });
        });
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
            if (currentRoom && rooms.has(currentRoom)) {
                const roomUsers = rooms.get(currentRoom);
                roomUsers.delete(socket.id);
                if (roomUsers.size === 0) {
                    rooms.delete(currentRoom);
                }
                socket.to(currentRoom).emit('user-left', socket.id);
            }
        });
    });
    httpServer.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
});
