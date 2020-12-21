import { tap } from 'rxjs/operators';
import { io, Socket } from 'socket.io-client';

import { QgivFeedMock } from 'qgiv/qgiv-feed.mock';
import { Qgiv } from 'qgiv/qgiv';
import { IDonation } from 'qgiv/qgiv.interface';
import { StringUtilities } from 'utilities/string-utilities';

import { DonorBadge } from './donor-badge';
import { pace, donorShowBadge } from './donor-pipe-operators';
import './donors.scss';

document.addEventListener('DOMContentLoaded', () => {
    const qgiv = new Qgiv(120);
    DonorBadge.init();

    // TODO: Need to write logs *somewhere*, since this will run as standalone HTML page in a non-browser
    // TODO: ... create a middle-man Node server between FE and Qgiv?


    const locket = io('http://localhost:3000');
    locket.on("connect", () => {
        console.log('connected to socket');
    });

    console.log('begin polling');
    QgivFeedMock.simulatePolling(5).pipe(
    // qgiv.watchTransactions().pipe(
        // take(2), // remember: this includes empty sets
        pace(DonorBadge.ANIMATION_DURATION_MSEC * 2 + DonorBadge.SHOW_DURATION_MSEC),
        tap((donation: IDonation) => {
            donation.displayName = StringUtilities.toProperCase(donation.displayName);

            // TODO: write to localStorage so resume won't skip last shown to last retrieved

            // debugging marble test
            // donations.forEach(donation => {
            //     donation.status = '+' + (new Date().valueOf() - timeBase);
            //     console.debug('tick', donation);
            // });
        }),
        donorShowBadge(DonorBadge.ANIMATION_DURATION_MSEC + DonorBadge.SHOW_DURATION_MSEC),
    ).subscribe(
        () => {},
        error => { console.log('subscribe error', error); },
        () => { console.log('done'); }
    );
});
