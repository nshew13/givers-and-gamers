import { createServer } from "http";
import { Server, Socket } from "socket.io";

// TODO: Let's Encrypt

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: true,
        // methods: ["GET", "POST"]
    }
});

console.log('listening...');
io.on("connection", (socket: Socket) => {
    console.log(socket.id);
});

httpServer.listen(3000);
