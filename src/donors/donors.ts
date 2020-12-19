import { EMPTY } from 'rxjs';
import { catchError, take } from 'rxjs/operators';

import { QgivFeedMock } from 'qgiv/qgiv-feed.mock';
import { Qgiv } from 'qgiv/qgiv';

import { DonorBadge } from './donor-badge';
import { donorPace, donorShowBadge } from './donor-pipe-operators';
import './donors.scss';

document.addEventListener('DOMContentLoaded', () => {
    const qgiv = new Qgiv(120);
    DonorBadge.init();

    console.log('begin polling');
    QgivFeedMock.simulatePolling(5).pipe(
    // qgiv.watchTransactions().pipe(
        // take(2), // remember: this includes empty sets
        donorPace(DonorBadge.ANIMATION_DURATION_MSEC * 2 + DonorBadge.SHOW_DURATION_MSEC),
        // donorShowBadge(DonorBadge.ANIMATION_DURATION_MSEC + DonorBadge.SHOW_DURATION_MSEC),
        catchError((err, caught) => {
            console.error('donorPace caught', err);
            return EMPTY;
        }),
    ).subscribe(
        (donation) => {
            let badge = new DonorBadge(donation);
            badge.show();
            setTimeout(_ => {
                badge.hide(true);
                badge = null;
            }, 4000);
        },
        (_) => { console.log('subscribe error', _); },
        () => { console.log('done'); }
    );
});
