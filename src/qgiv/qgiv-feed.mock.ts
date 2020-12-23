import { Observable, from, interval, zip } from 'rxjs';
import { finalize, pluck, tap } from 'rxjs/operators';
import { formatISO } from 'date-fns';

import { AlphaGenerator } from 'utilities/alpha-generator';
import { IDonation } from './qgiv.interface';

type MarbleMap = { [marbleLetter: string]: IDonation[] };

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

    // TODO: method to return as alphas for cold(), use AlphaIterator
    public static readonly MARBLE_VALUES: IDonation[][] = [
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

    public static getMarbleMapInput (): MarbleMap {
        const letters: string[] = AlphaGenerator.CHARS_LOWER.split('');
        const map: MarbleMap = {};

        const maxMarbles = Math.min(QgivFeedMock.MARBLE_VALUES.length, letters.length);

        for (let i = 0; i < maxMarbles; i++) {
            map[letters[i]] = QgivFeedMock.MARBLE_VALUES[i];
        }

        return map;
    }

    public static getMarbleMapOutput (): IDonation[] {
        return QgivFeedMock.MARBLE_VALUES.flat(2);
    }

    public static simulatePolling (intervalSec = 5): Observable<IDonation[]> {
        console.log('simulatePolling initialized with interval of ' + intervalSec + 's');
        return zip(
            interval(intervalSec * 1000),
            from(QgivFeedMock.MARBLE_VALUES),
        ).pipe(
            pluck('1'), // reduce zipped array to marbles
            tap((marbles) => { console.log(`poll received ${marbles.length} record` + (marbles.length > 1 ? 's' : '')); }),
            finalize(() => { console.log('polls closed'); }), // DELETE: only for debug
        );
    }
}
