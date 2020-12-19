import { Observable, from, of, interval, zip } from 'rxjs';
import { concatMap, delay, finalize, pluck, tap } from 'rxjs/operators';
import { formatISO } from 'date-fns';

import { IDonation } from '../qgiv/qgiv.interface';

const data = require('./sample-response.json');

export class GGFeed {
    public static donationId = 0;
    public static generateDonation (): IDonation {
        const donationId = GGFeed.donationId++;
        return {
            id:           donationId.toString(),
            status:       'test',
            displayName:  'Bob White ' + donationId,
            anonymous:    false,
            memo:         'memo',
            location:     'Anywhere, KY',
            amount:       50.50,
            // create a timestamp an increasing number of minutes in the future
            timestamp:    formatISO(new Date().valueOf() + donationId * 1000 * 60),
        };
    }

    public static readonly marbleValues: IDonation[][] = [
        [
            GGFeed.generateDonation(), // 0
            GGFeed.generateDonation(),
            GGFeed.generateDonation(),
            GGFeed.generateDonation(),
        ],
        [
            GGFeed.generateDonation(), // 4
            GGFeed.generateDonation(),
            GGFeed.generateDonation(),
            GGFeed.generateDonation(),
            GGFeed.generateDonation(),
            GGFeed.generateDonation(),
            GGFeed.generateDonation(),
            GGFeed.generateDonation(),
            GGFeed.generateDonation(),
            GGFeed.generateDonation(),
        ],
        [],
        [],
        [
            GGFeed.generateDonation(), // 14
            GGFeed.generateDonation(),
        ],
        [],
        [
            GGFeed.generateDonation(), // 16
            GGFeed.generateDonation(),
            GGFeed.generateDonation(),
            GGFeed.generateDonation(),
            GGFeed.generateDonation(),
            GGFeed.generateDonation(),
            GGFeed.generateDonation(),
        ],
        [
            GGFeed.generateDonation(), // 23
        ],
    ];

    public static simulateFeed (speed: number = 1, maxData?: number): Observable<object> {
        let localData: object[] = data.slice(0, maxData);

        return from(localData).pipe(
            concatMap(i => of(i).pipe(
                delay(Math.random() * 1000 * speed)),
                // delay(1000 * speed)),
            )
        );
    }

    public static simulatePolling (intervalSec: number = 5): Observable<IDonation[]> {
        console.log('simulatePolling initialized with interval of ' + intervalSec + 's');
        return zip(
            interval(intervalSec * 1000),
            from(GGFeed.marbleValues),
        ).pipe(
            tap(() => { console.log('poll'); }),
            pluck('1'), // reduce zipped array to marbles
            finalize(() => { console.log('polls closed'); }), // DELETE: only for debug
        );
    }
}
