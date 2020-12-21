import { tap } from 'rxjs/operators';
import { io, Socket } from 'socket.io-client';

import { IDonation } from 'qgiv/qgiv.interface';
import { LocketClient } from 'locket/locket-client';
import { QgivFeedMock } from 'qgiv/qgiv-feed.mock';
import { Qgiv } from 'qgiv/qgiv';
import { StringUtilities } from 'utilities/string-utilities';

import { DonorBadge } from './donor-badge';
import { pace, donorShowBadge } from './donor-pipe-operators';
import './donors.scss';

// TODO: Need to write logs *somewhere*, since this will run as standalone HTML page in a non-browser
// TODO: ... create a middle-man Node server between FE and Qgiv?
const locket = new LocketClient();

document.addEventListener('DOMContentLoaded', () => {
    const qgiv = new Qgiv(120);
    DonorBadge.init();

    console.log('begin polling');
    QgivFeedMock.simulatePolling(5).pipe(
    // qgiv.watchTransactions().pipe(
        // take(2), // remember: this includes empty sets
        pace(DonorBadge.ANIMATION_DURATION_MSEC * 2 + DonorBadge.SHOW_DURATION_MSEC),
        tap((donation: IDonation) => {
            donation.displayName = StringUtilities.toProperCase(donation.displayName);
            console.log('broadcasting');
            locket.log('log this', [1,2,3], { foo: 'bar' });

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
