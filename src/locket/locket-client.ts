import { io, Socket } from 'socket.io-client';
import { ILocketData, ELogLevels } from './locket.interface';

// the logging socket
export class LocketClient {
    public static readonly WRAPPED_METHODS = [ 'debug', 'log', 'info', 'warning', 'error' ];
    public static readonly EVENT_EMIT_LOG = 'logMsg';

    private _relaySocket: Socket = io('http://localhost:3000');

    public constructor () {
        this._relaySocket.on('connect', () => {
            console.log('client connected to socket:', this._relaySocket.id);
        });
    }

    public log (msg: string, ...args: unknown[]): void {
        this._emitMsg(ELogLevels.LOG, msg, args);
    }

    public warn (msg: string, ...args: unknown[]): void {
        this._emitMsg(ELogLevels.WARN, msg, args);
    }

    private _emitMsg (logLevel: ELogLevels, msg: string, args: unknown[]): void {
        const locketData: ILocketData = {
            'clientEmitMSec': new Date().valueOf(),
            'logLevel': logLevel,
            'msg': msg,
            'args': args,
        };
        this._relaySocket.emit(LocketClient.EVENT_EMIT_LOG, locketData);
    }
}
