import { of } from 'rxjs';
import { concatMap, delay, tap } from 'rxjs/operators';

import { QGiv } from 'qgiv/qgiv';
import { IDonation } from 'qgiv/qgiv.interface';
import { GGFeed } from 'mock/gg-feed-mock';
import { Utilities } from 'utilities';

import './donators.scss';

let nameEl: HTMLElement;
let locationEl: HTMLElement;

function displayDonation (donation: IDonation) {
	nameEl.textContent = donation.displayName;
	locationEl.textContent = donation.location;
}

document.addEventListener('DOMContentLoaded', () => {
	nameEl = document.getElementById('name');
	locationEl = document.getElementById('loc');

	const qgiv = new QGiv();

    // qgiv.getTransactions().subscribe((result) => {
    //     output1JQO.html(JSON.stringify(result, null, 2));
    // });

    // TEMP: donation simulator
    GGFeed.simulateFeed().pipe(
		// slow the feed to no faster than once/2s
		concatMap((donation: IDonation) => of(donation).pipe(delay(2000))),
		tap((value) => {
			value.displayName = Utilities.toProperCase(value.displayName);
			value.location = Utilities.toProperCase(value.location);
			return value;
		}),
		tap((value) => {
			console.log('incoming!', value);
			return value;
		}),
	).subscribe((donation: IDonation) => {
        displayDonation(donation);
    });

    // qgiv.watchTransactions().pipe(
    //     tap((result) => {
    //         // output2JQO.prepend('total: ' + qgiv.totalAmount + "\n" + result.length + " records:\n" + JSON.stringify(result, null, 2) + "\n\n");
    //         myChart.data.datasets[0].data[0] = qgiv.totalAmount;
    //         myChart.update();
    //     }),
    // ).subscribe();
});
