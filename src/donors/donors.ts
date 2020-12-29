import { filter, take, tap } from 'rxjs/operators';

import { IDonation } from 'qgiv/qgiv.interface';
import { Qgiv } from 'qgiv/qgiv';
import { StringUtilities } from 'utilities/string-utilities';

import { DonorBadge } from './donor-badge';
import { pace, donorShowBadge } from './donor-pipe-operators';
import './donors.scss';


document.addEventListener('DOMContentLoaded', () => {
    const qgiv = new Qgiv();
    DonorBadge.init();

    let lastShown = localStorage.getItem(DonorBadge.KEY_LAST_SHOWN) || '';

    // QgivFeedMock.simulatePolling(5).pipe(
    console.log('donors begins polling');
    qgiv.watchTransactions(10_000).pipe(
        // TODO: add a Terminator
        // takeUntil(this._stopPolling),

        // display only those after the last shown
        filter(donation => !(lastShown && donation.id <= lastShown)),

        tap((donation: IDonation) => {
            donation.displayName = StringUtilities.toProperCase(donation.displayName);
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
