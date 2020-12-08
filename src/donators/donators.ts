import { of } from 'rxjs';
import { concatMap, delay, first, tap } from 'rxjs/operators';
// import { differenceInMilliseconds, toDate, parse, parseJSON } from 'date-fns';

import { QGiv } from 'qgiv/qgiv';
import { IDonation, ITransaction } from 'qgiv/qgiv.interface';
import { GGFeed } from 'mock/gg-feed-mock';
import { Utilities } from 'utilities';

import './donators.scss';

let donorEl: HTMLElement;
let nameEl: HTMLElement;
let locationEl: HTMLElement;

document.addEventListener('DOMContentLoaded', () => {
	donorEl = document.getElementById('donation');
	nameEl = document.getElementById('name');
	locationEl = document.getElementById('loc');

	const qgiv = new QGiv();

    // qgiv.getTransactions().subscribe((result) => {
    //     output1JQO.html(JSON.stringify(result, null, 2));
    // });

    // TEMP: donation simulator
    GGFeed.simulateFeed(2).pipe(
		first(),
		// slow the feed to no faster than once/4s
		// concatMap((donation: IDonation) => of(donation).pipe(delay(4000))),
		tap((donation: IDonation) => {
			donation.displayName = Utilities.toProperCase(donation.displayName);
		}),
		tap((donation) => {
			console.log('incoming!', donation);
			nameEl.textContent = donation.displayName;
			locationEl.textContent = donation.location;
			donorEl.classList.add('animate');
		}),
		// delay(2000),
		// tap((donation) => {
		// 	donorEl.classList.remove('animate');
		// 	nameEl.textContent = '';
		// 	locationEl.textContent = '';
		// }),
	).subscribe((donation: IDonation) => {});

    // qgiv.watchTransactions().pipe(
    //     tap((result) => {
    //         // output2JQO.prepend('total: ' + qgiv.totalAmount + "\n" + result.length + " records:\n" + JSON.stringify(result, null, 2) + "\n\n");
    //         myChart.data.datasets[0].data[0] = qgiv.totalAmount;
    //         myChart.update();
    //     }),
	// ).subscribe();

/*
 	// determine average time between donations
	const data: ITransaction[] = require('mock/feed.secret.json');
	const intervals: number[] = [];
	let intervalTotal = 0;

	for (let i=0; i<data.length-1; i++) {
		const diff = differenceInMilliseconds(
			parse(data[i].transactionDate, QGiv.DATE_FORMAT_UNICODE, new Date()),
			parse(data[i+1].transactionDate, QGiv.DATE_FORMAT_UNICODE, new Date()),
		);
		console.log('diff', diff);
		intervals.push(diff); // ms since epoch
		intervalTotal += diff;
	}

	// ~16h
	console.log('average interval (min)', intervalTotal/intervals.length/1000/60);
 */
});
