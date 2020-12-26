import { EMPTY, Observable, of, OperatorFunction } from 'rxjs';
import { catchError, concatMap, delay, mergeMap, tap } from 'rxjs/operators';

import { IDonation } from 'qgiv/qgiv.interface';

import { DonorBadge } from './donor-badge';

// There is no console in Streamlabs, so
// TODO: add logging to know if we're getting too far behind
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
export function pace<T> (intervalMSec = 5000, queueTolerance = 15): OperatorFunction<T, T> {
    let queueSize = 0;

    // inner function automatically receives source observable
    return (source: Observable<T>) => {
        return source.pipe(
            tap(() => {
                queueSize++;
                if (queueTolerance !== 0 && queueSize > queueTolerance)  {
                    // TODO: throttling needs debounce. Don't want to double for just a record or two.
                    console.warn(`queueSize (${queueSize}) exceeds tolerance`);
                }
            }),
            // now add delay to each marble before it takes any further action
            concatMap((item: T) => of(item).pipe(
                tap(() => {
                    queueSize--;
                }),
                // FIXME: delay happens before pace completes, meaning before the badge is created
                delay(intervalMSec),
            )),
            catchError((err) => {
                console.error('pace caught', err);
                return EMPTY;
            }),
        );
    };
}

/**
 * toggles classes on badge element to trigger animation
 *
 * @param hideDelay
 * @param badge
 */
export function donorShowBadge (hideDelay = 5000): OperatorFunction<IDonation, IDonation> {
    // inner function automatically receives source observable
    return (source: Observable<IDonation>) => {
        return source.pipe(
            mergeMap((donation: IDonation) => {
                // wrap in a closure to keep badge within isolated scope
                // Thanks again, Andrei. https://stackoverflow.com/a/65370377/356016
                let badge: DonorBadge;

                return of(donation).pipe(
                    tap(() => {
                        badge = new DonorBadge(donation);
                        // console.log('created badge ' + badge.id);
                        badge.show();
                    }),
                    delay(hideDelay),
                    tap(() => {
                        badge.hide(true);
                        // console.log('destroying badge ' + badge.id);
                        badge = null;
                        // console.log('destroyed badge ', badge);
                    }),
                    catchError((err) => {
                        console.error('donorShowBadge caught', err);
                        return EMPTY;
                    }),
                )
            }),
        )
    };
}
