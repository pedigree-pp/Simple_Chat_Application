import express from 'express';
import {createServer} from 'http';
import {Server} from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer,{
    cors:{
        origin: '*',
        methods: ['GET','POST']
    }
});

// Serve static frontend files from the client folder
app.use(express.static(path.join(__dirname, '../client')));

// In-memory store: Map<socketId, username>
const users = new Map();

// Listen for incoming socket connections from clients
io.on('connection',(socket)=>{
    console.log(`Clients connected: ${socket.id}`);

    socket.on('register_username', (username,callback)=>{
        const trimmed = username?.trim();

        if(!trimmed){
            return callback({success: false, message: 'Username cannot be blank.'});
        }

        // Check if username already taken (case-insensitive)
        const isTaken = Array.from(users.values()).some(
            (u) => u.toLowerCase() === trimmed.toLowerCase()
        );

        if(isTaken){
            return callback({success: false, message: 'This username already existed'});
        }

        // Store user mapping
        users.set(socket.id,trimmed);

        // Acknowledge success to the registering client
        callback({success: true, message: 'Create new user successfully'});

        // Broadcast updated user list to ALL connected clients
        const userList = Array.from(users.values());
        io.emit('user_list_update', userList);
        console.log(`Registered: ${trimmed},Total Counts: ${users.size}`);
    })

    socket.on('disconnect', () => {
        if(users.has(socket.id)){
            const username = socket.username;
            users.delete(socket.id);

            // Tell ALL REMAINING clients that the user list has changed!
            const userList = Array.from(users.values());
            io.emit('user_list_update', userList);

            console.log(`User left ${username}|Remaining User: ${users.size}`);
        }
        
        console.log(`Client disconnected: ${socket.id}`);
    });
});

const PORT = 3000;

// blinds the server to TCP port and starts listening for incoming client req
httpServer.listen(PORT, ()=>{
    console.log(`Server listening on http://localhost:${PORT}`);
}); 