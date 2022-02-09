import { io, Socket } from 'socket.io-client';
import { Dict } from 'utilities/structures.interface';
import { ILocketData, ELogLevels, ECommands } from './locket.interface';

// the logging socket
export class LocketClient {
    public static readonly WRAPPED_METHODS = [ 'debug', 'log', 'info', 'warning', 'error' ];
    public static readonly EVENT_EMIT_LOG = 'emitDownLog';
    public static readonly EVENT_EMIT_CMD = 'emitUpCmd';

    private _relaySocket: Socket = io('http://localhost:3000');
    public get socket (): Socket {
        return this._relaySocket;
    }

    public constructor () {
        this._relaySocket.on('connect', () => {
            console.log('client connected to socket:', this._relaySocket.id);
        });
    }

    public command (commandName: ECommands, args: Dict = {}): void {
        this._relaySocket.emit(LocketClient.EVENT_EMIT_CMD, args);
    }


    // LOGGING METHODS

    public debug (msg: string, ...args: unknown[]): void {
        console.debug('%c' + msg, 'color: cyan;', ...args);
        this._emitMsg(ELogLevels.DEBUG, msg, args);
    }

    public log (msg: string, ...args: unknown[]): void {
        console.log('%c' + msg, 'color: cyan;', ...args);
        this._emitMsg(ELogLevels.LOG, msg, args);
    }

    public info (msg: string, ...args: unknown[]): void {
        console.info(msg, ...args);
        this._emitMsg(ELogLevels.INFO, msg, args);
    }

    public warn (msg: string, ...args: unknown[]): void {
        console.warn(msg, ...args);
        this._emitMsg(ELogLevels.WARN, msg, args);
    }

    public error (msg: string, ...args: unknown[]): void {
        console.error(msg, ...args);
        this._emitMsg(ELogLevels.ERROR, msg, args);
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
