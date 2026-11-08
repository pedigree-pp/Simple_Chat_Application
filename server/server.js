import express from 'express';
import {createServer} from 'http';
import {Server} from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer,{
    cors:{
        origin: '*',
        methods: ['GET','POST']
    }
});

// Listen for incoming socket connections from clients
io.on('connection',(socket)=>{
    console.log(`Clients connected: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

const PORT = 3000;

// blinds the server to TCP port and starts listening for incoming client req
httpServer.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
}); 