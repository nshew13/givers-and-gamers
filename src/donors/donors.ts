import { GGFeed } from 'mock/gg-feed-mock';
import { QGiv } from 'qgiv/qgiv';
import { donorPace, donorShowBadge } from './donor-pipe-operators';

import { DonorBadge } from './donor-badge';
import './donors.scss';
import { take } from 'rxjs/operators';

document.addEventListener('DOMContentLoaded', () => {
    const qgiv = new QGiv(120);
    DonorBadge.init();

    GGFeed.simulatePolling().pipe(
    // qgiv.watchTransactions().pipe(
        // take(2),
		donorPace(DonorBadge.ANIMATION_DURATION_MSEC * 2 + DonorBadge.SHOW_DURATION_MSEC),
		donorShowBadge(),
	).subscribe(
        () => {},
        () => {},
        () => { console.log('done'); }
    );
});
