import { of } from 'rxjs';
import { concatMap, delay, first, tap } from 'rxjs/operators';
// import { differenceInMilliseconds, toDate, parse, parseJSON } from 'date-fns';

import { QGiv } from 'qgiv/qgiv';
import { IDonation, ITransaction } from 'qgiv/qgiv.interface';
import { GGFeed } from 'mock/gg-feed-mock';
import { Utilities } from 'utilities';

import './donors.scss';


class DonorBadge {
    private _badgeEl: DocumentFragment;

    private static _HTML_BODY: HTMLBodyElement;
    private static _HTML_TEMPLATE: HTMLTemplateElement;

    public constructor (donation: IDonation) {
        console.log('constructor-ing');

        this._badgeEl = document.importNode(DonorBadge._HTML_TEMPLATE.content, true);
        this._badgeEl.querySelector('div.donor > p.name').textContent = donation.displayName;
        this._badgeEl.querySelector('div.donor > p.loc').textContent = donation.displayName;
        DonorBadge._HTML_BODY.appendChild(this._badgeEl);
    }

    public static init () {
        if (document.readyState === 'loading') {
            // wait for DOM to be ready
            document.addEventListener('DOMContentLoaded', DonorBadge._onReady);
        } else {
            DonorBadge._onReady();
        }
    }

    private static _onReady () {
        DonorBadge._HTML_BODY = document.getElementsByTagName('body')[0];
        DonorBadge._HTML_TEMPLATE = document.getElementById('donorBadgeTpl') as HTMLTemplateElement;
    }
}

// // TODO: convert to a class
// let donationJQO: JQuery;

// function generateDonationJQO (donation: IDonation) {
// 	donationJQO = $(TPL_DONATION);
// 	$('p#name', donationJQO).get(0).textContent = donation.displayName;
// 	$('p#loc', donationJQO).get(0).textContent = donation.location;
// }

// // assign animation event listeners
// function callbackAddReset (evt: AnimationEvent) {
// 	if ( evt.animationName !== 'widenForContent' ) { return; }
// 	const donationEl = donationJQO.get(0);
// 	donationEl.removeEventListener('animationend', callbackAddReset);
// 	donationEl.addEventListener('animationend', callbackResetAnimation, true);
// }

// function callbackResetAnimation (evt: AnimationEvent) {
// 	if ( evt.animationName !== 'fadeToReset' ) { return; }
// 	const donationEl = donationJQO.get(0);
// 	donationEl.removeEventListener('animationend', callbackResetAnimation);
// 	// remove any matches, just to be sure
// 	$('div.donation').remove();
// }


// TODO: fix Webpack server reload

const ANIMATION_DURATION_MSEC = 4000;

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded', document.readyState);
    const qgiv = new QGiv();
    DonorBadge.init();

    // qgiv.getTransactions().subscribe((result) => {
    //     output1JQO.html(JSON.stringify(result, null, 2));
    // });

    // TEMP: donation simulator
    GGFeed.simulateFeed(2).pipe(
		first(),
		// slow the feed to no faster than once/4s
		concatMap((donation: IDonation) => of(donation).pipe(delay(ANIMATION_DURATION_MSEC + 1000))),
		tap((donation: IDonation) => {
			donation.displayName = Utilities.toProperCase(donation.displayName);
		}),
		tap((donation) => {
            // create the element
            const badge = new DonorBadge(donation);
			// newDonationEl.addEventListener('animationend', callbackAddReset);
			// newDonationEl.classList.add('animate');
		}),
		delay(ANIMATION_DURATION_MSEC),
		// tap((donation) => {
		// 	donationJQO.get(0).classList.add('reverse');
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
