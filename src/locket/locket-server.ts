import { Server, Socket } from 'socket.io';

// TODO: Let's Encrypt

const io = new Server({
    cors: {
        // TODO: restrict origins
        origin: true,
        // methods: ['GET', 'POST']
    }
});


console.log('listening...');
io.on('connection', (socket: Socket) => {
    console.log(socket.id);

    socket.on('log', (locketData, ...args: any[]) => {
        // no need to emit back to original, so use socket.broadcast
        locketData.serverEmitMSec = new Date().valueOf();
        socket.broadcast.emit('log', ...args);
    });
});

io.listen(3000);


