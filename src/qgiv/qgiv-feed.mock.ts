import { Observable, from, interval, zip } from 'rxjs';
import { finalize, pluck, tap } from 'rxjs/operators';
import { formatISO } from 'date-fns';

import { IDonation } from './qgiv.interface';

export class QgivFeedMock {
    public static donationId = 0;
    public static generateDonation (): IDonation {
        const donationId = QgivFeedMock.donationId++;
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
            QgivFeedMock.generateDonation(), // 0
            QgivFeedMock.generateDonation(),
            QgivFeedMock.generateDonation(),
            QgivFeedMock.generateDonation(),
        ],
        [
            QgivFeedMock.generateDonation(), // 4
            QgivFeedMock.generateDonation(),
            QgivFeedMock.generateDonation(),
            QgivFeedMock.generateDonation(),
            QgivFeedMock.generateDonation(),
            QgivFeedMock.generateDonation(),
            QgivFeedMock.generateDonation(),
            QgivFeedMock.generateDonation(),
            QgivFeedMock.generateDonation(),
            QgivFeedMock.generateDonation(),
        ],
        [],
        [],
        [
            QgivFeedMock.generateDonation(), // 14
            QgivFeedMock.generateDonation(),
        ],
        [],
        [
            QgivFeedMock.generateDonation(), // 16
            QgivFeedMock.generateDonation(),
            QgivFeedMock.generateDonation(),
            QgivFeedMock.generateDonation(),
            QgivFeedMock.generateDonation(),
            QgivFeedMock.generateDonation(),
            QgivFeedMock.generateDonation(),
        ],
        [
            QgivFeedMock.generateDonation(), // 23
        ],
    ];

    public static simulatePolling (intervalSec: number = 5): Observable<IDonation[]> {
        console.log('simulatePolling initialized with interval of ' + intervalSec + 's');
        return zip(
            interval(intervalSec * 1000),
            from(QgivFeedMock.marbleValues),
        ).pipe(
            tap(() => { console.log('poll'); }),
            pluck('1'), // reduce zipped array to marbles
            finalize(() => { console.log('polls closed'); }), // DELETE: only for debug
        );
    }
}
