import { Server, Socket } from 'socket.io';

import { LocketClient } from './locket-client';
import { ILocketData } from './locket.interface';

// TODO: Let's Encrypt

const io = new Server({
    cors: {
        // TODO: restrict origins
        origin: true,
        // methods: ['GET', 'POST']
    }
});

io.on('connection', (socket: Socket) => {
    console.log('listener added:', socket.id);

    socket.on(LocketClient.EVENT_EMIT_LOG, (locketData: ILocketData) => {
        // no need to emit back to original, so use socket.broadcast
        locketData.serverEmitMSec = new Date().valueOf();
        socket.broadcast.emit(LocketClient.EVENT_EMIT_LOG, locketData);
    });
});

io.listen(3000);
console.log('listening on port 3000...');
