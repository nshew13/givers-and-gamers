import { EMPTY } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { QgivFeedMock } from 'qgiv/qgiv-feed.mock';
import { Qgiv } from 'qgiv/qgiv';
import { Utilities } from 'utilities';

import { DonorBadge } from './donor-badge';
import { pace, donorShowBadge } from './donor-pipe-operators';
import './donors.scss';
import { IDonation } from 'qgiv/qgiv.interface';

document.addEventListener('DOMContentLoaded', () => {
    const qgiv = new Qgiv(120);
    DonorBadge.init();

    console.log('begin polling');
    QgivFeedMock.simulatePolling(5).pipe(
    // qgiv.watchTransactions().pipe(
        // take(2), // remember: this includes empty sets
        pace(DonorBadge.ANIMATION_DURATION_MSEC * 2 + DonorBadge.SHOW_DURATION_MSEC),
        tap((donation: IDonation) => {
            donation.displayName = Utilities.toProperCase(donation.displayName);

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
