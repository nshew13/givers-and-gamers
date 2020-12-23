import { io, Socket } from 'socket.io-client';

import { ILocketData } from './locket.interface';

export class LocketMonitor {
    private _relaySocket: Socket = io('http://localhost:3000');
    private _delay: number;
    private _averageDelay: number;
    private _averageDelayCount = 0;

    // bind to all logging events upon instantiation
    public constructor() {
        console.log('binding monitor listeners');

        this._relaySocket.on('connect', () => {
            console.log('monitor connected to socket:', this._relaySocket.id);
        });


        /**
         * Create a "prependAnyOnce" listener to initialize this._observedDelay
         * the first time it sees client-emit. The listener will then replace
         * itself with a listener for subsequent emissions.
         */
        this._relaySocket.prependAny((eventName, locketData: ILocketData) => {
            if (locketData?.clientEmitMSec) {
                this._delay = new Date().valueOf() - locketData['clientEmitMSec'];

                this._averageDelayCount++;
                this._averageDelay = this._delay;

                // now, replace this listener
                this._relaySocket.offAny();

                this._relaySocket.prependAny((eventName, locketArgs: ILocketData) => {
                    if (locketArgs?.clientEmitMSec) {
                        this._delay = new Date().valueOf() - locketArgs['clientEmitMSec'];

                        this._averageDelayCount++;
                        this._averageDelay = this._averageDelay + (this._delay - this._averageDelay) / this._averageDelayCount;
                    }
                });
            }

        });

        this._relaySocket.on('log', (locketData: ILocketData, ...args: unknown[]) => {
            console.log('monitor logged (delay: ' + this._delay + 'ms, avg. ' + this._averageDelay + 'ms)', ...args);
        });
    }
}
