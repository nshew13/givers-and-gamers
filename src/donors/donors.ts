// import { GGFeed } from 'mock/gg-feed-mock';
import { QGiv } from 'qgiv/qgiv';
import { donorPace, donorShowBadge } from './donor-pipe-operators';

import { DonorBadge } from './donor-badge';
import './donors.scss';

document.addEventListener('DOMContentLoaded', () => {
    const qgiv = new QGiv(120);
    DonorBadge.init();

    // TEMP: donation simulator
    // GGFeed.simulateFeed(2).pipe(
	// 	donorPace(),
	// 	donorShowBadge(),
    // ).subscribe();

    qgiv.watchTransactions().pipe(
		donorPace(),
		donorShowBadge(),
	).subscribe();
});
