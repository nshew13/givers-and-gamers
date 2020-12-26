import { filter, tap } from 'rxjs/operators';
// import { io, Socket } from 'socket.io-client';
// import * as winston from 'winston';

import { IDonation } from 'qgiv/qgiv.interface';
// import { LocketClient } from 'locket/locket-client';
// import { QgivFeedMock } from 'qgiv/qgiv-feed.mock';
import { Qgiv } from 'qgiv/qgiv';
import { StringUtilities } from 'utilities/string-utilities';

import { DonorBadge } from './donor-badge';
import { pace, donorShowBadge } from './donor-pipe-operators';
import './donors.scss';

// todo

// TODO: Need to write logs *somewhere*, since this will run as standalone HTML page in a non-browser
// TODO: ... create a middle-man Node server between FE and Qgiv?
// const locket = new LocketClient();

// const logger = winston.createLogger({
//     level: 'info',
//     format: winston.format.json(),
//     defaultMeta: {
//         service: 'user-service'
//     },
//     transports: [
//         //
//         // - Write to all logs with level `debug` and below to `all.log`
//         // - Write all logs error (and below) to `error.log`.
//         //
//         new winston.transports.File({
//             filename: 'logs/error.log',
//             level: 'error'
//         }),
//         new winston.transports.File({
//             filename: 'logs/all.log',
//             level: 'debug'
//         })
//     ]
// });

document.addEventListener('DOMContentLoaded', () => {
    // TODO: convert (back) to seconds
    const qgiv = new Qgiv(10_000);
    DonorBadge.init();

    let lastShown = localStorage.getItem(DonorBadge.KEY_LAST_SHOWN) || '';

    // QgivFeedMock.simulatePolling(5).pipe(
    console.log('donors begins polling');
    qgiv.watchTransactions().pipe(
        // take(2), // remember: this includes empty sets

        // display only those after the last shown
        filter(donation => !(lastShown && donation.id <= lastShown)),

        tap((donation: IDonation) => {
            donation.displayName = StringUtilities.toProperCase(donation.displayName);
            // locket.log('log this', [1,2,3], { foo: 'bar' });

            // TODO: write to localStorage so resume won't skip last shown to last retrieved

            // debugging marble test
            // donations.forEach(donation => {
            //     donation.status = '+' + (new Date().valueOf() - timeBase);
            //     console.debug('tick', donation);
            // });
        }),

        // space out badges to the given pace, then display
        pace(DonorBadge.ANIMATION_DURATION_MSEC * 2 + DonorBadge.SHOW_DURATION_MSEC),
        donorShowBadge(DonorBadge.ANIMATION_DURATION_MSEC + DonorBadge.SHOW_DURATION_MSEC),

        // update last shown with new record
        tap((donation: IDonation) => {
            console.log('updating last shown', donation.id);
            lastShown = donation.id;
            localStorage.setItem(DonorBadge.KEY_LAST_SHOWN, donation.id);
        }),
    ).subscribe(
        () => { /* thumbs up */ },
        error => { console.log('subscribe error', error); },
        () => { console.log('donors done'); }
    );
});
