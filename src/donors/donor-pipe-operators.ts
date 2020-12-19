import { EMPTY, from, Observable, of, OperatorFunction } from 'rxjs';
import { catchError, concatMap, delay, tap } from 'rxjs/operators';

import { IDonation } from 'qgiv/qgiv.interface';

import { DonorBadge } from './donor-badge';

// TODO: Will I have access to console in Streamlabs/will a browser with console work in Streamlabs?

// TODO: add (console) logging to know if we're getting too far behind
// TODO: ... or automatically adjust speed (!)
// TODO: ... or display two badges at once

/**
 * splits array elements into individual marbles with a delay in between
 *
 * The use of concatMap means that all individual marbles will eventually
 * make their ways through the pipe, at an interval no for frequent than
 * the specified delay.
 *
 * @param intervalMSec
 * @param queueTolerance the max number of records in singles queue before doubling output (0 to disable)
 */
export function pace<T> (intervalMSec: number = 5000, queueTolerance = 15): OperatorFunction<T[], T> {
    let queueSize = 0;
    console.log('pace initialized with interval of ' + intervalMSec + 'ms');

    // inner function automatically receives source observable
    return (source: Observable<T[]>) => {
        return source.pipe(
            tap((items: T[]) => {
                queueSize += items.length;
                console.log('added ' + items.length + ' to queue (= ' + queueSize + ')');
                if (queueTolerance !== 0 && queueSize > queueTolerance)  {
                    // TODO: needs debounce. Don't want to double for just a record or two.
                    console.warn(`queueSize (${queueSize}) exceeds tolerance`);
                }
            }),
            // explode array to handle one marble at a time
            concatMap((items: T[]) => from(items).pipe(
// tap(() => { console.log('concatMap/from'); }),
                // now add delay to each marble before it takes any further action
                concatMap((item: T) => of(item).pipe(
// tap(() => { console.log('concatMap/of'); }),
                    // FIXME: delay happens before pace completes, meaning before the badge is created
                    tap((item: T) => {
                        // console.log(`queueSize: ${queueSize} - 1 = ${queueSize -= 1}`);
                        queueSize -= 1;
                    }),
                    delay(intervalMSec),
// tap(() => { console.log('after delay'); }),
                )),
            )),
            catchError((err, caught) => {
                console.error('pace caught', err);
                return EMPTY;
            }),
        );
    };
}

/**
 * THIS DOESN'T WORK
 * see https://stackoverflow.com/q/65366435/356016
 *
 *
 * toggles classes on badge element to trigger animation
 *
 * badge doesn't need to be passed in. By declaring it as an optional argument,
 * each donation observable coming through this pipe will have its own instance.
 *
 * Previously, a variable was put in the inner observable's closure. However,
 * this always pointed to the last donation to come through, meaning that
 * in a rush of donations, only the last would auto-close.
 *
 * @param hideDelay
 * @param badge
 */
export function donorShowBadge (hideDelay: number = 5000/* , badge?: DonorBadge */): OperatorFunction<IDonation, IDonation> {
    // inner function automatically receives source observable
    return (source: Observable<IDonation>) => {
        let badge: DonorBadge;
        // wrap in a closure to keep badge within scope
        // return ((/* badge?: DonorBadge */) => {
            // let badge: DonorBadge;

            return source.pipe(
                tap((donation) => {
                    // create the element
                    badge = new DonorBadge(donation);
                    console.log('created badge ' + badge.id);
                    badge.show();
                }),
                catchError((err, caught) => {
                    console.error('donorShowBadge[1] caught', err);
                    return EMPTY;
                }),
                delay(hideDelay),
                tap((donation) => {
                    badge.hide(true);
                    console.log('destroying badge ' + badge.id);
                    // badge = null;
                    console.log('destroyed badge ', badge);
                }),
                catchError((err, caught) => {
                    console.error('donorShowBadge[2] caught', err);
                    return EMPTY;
                }),
            );
        // })();
    };
}
