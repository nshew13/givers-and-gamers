import { io, Socket } from 'socket.io-client';

// the logging socket
export class LocketClient {
    private _relaySocket: Socket = io('http://localhost:3000');

    public constructor () {
        this._relaySocket.on('connect', () => {
            console.log('client connected to socket:', this._relaySocket.id);
        });
    }

    public log (...args: any[]) {
        const locketData = {
            'clientEmitMSec': new Date().valueOf()
        };
        this._relaySocket.emit('log', locketData, ...args);
    }
}
