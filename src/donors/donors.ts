import { Observable, of } from 'rxjs';
import { concatMap, delay, first, tap } from 'rxjs/operators';
// import { differenceInMilliseconds, toDate, parse, parseJSON } from 'date-fns';

import { GGFeed } from 'mock/gg-feed-mock';
import { IDonation } from 'qgiv/qgiv.interface';
import { QGiv } from 'qgiv/qgiv';
import { Utilities } from 'utilities';

import { DonorBadge } from './donor-badge';
import './donors.scss';

document.addEventListener('DOMContentLoaded', () => {
    const qgiv = new QGiv(120);
    DonorBadge.init();

    // TEMP: donation simulator
    // GGFeed.simulateFeed(2).pipe(
	// 	DonorBadge.donorPipe,
    // ).subscribe();

    qgiv.watchTransactions().pipe(
		DonorBadge.donorPipe(),
	).subscribe();
});
