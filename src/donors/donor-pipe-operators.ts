import { EMPTY, Observable, of, OperatorFunction, timer } from 'rxjs';
import { catchError, concatMap, delay, ignoreElements, mergeMap, startWith, tap } from 'rxjs/operators';

import { IDonation } from 'qgiv/qgiv.interface';

import { DonorBadge } from './donor-badge';

import { LocketClient } from 'locket/locket-client';
const locket = new LocketClient();

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
                    // TODO: if we're getting too far behind or automatically adjust speed (!) or display two badges at once
                    // TODO: throttling needs debounce. Don't want to double for just a record or two.
                    locket.warn(`queueSize (${queueSize}) exceeds tolerance`);
                }
            }),
            tap(_ => { locket.log('before concatMap', _); }),
            // now add delay to each marble before it takes any further action
            concatMap((item: T) => timer(intervalMSec).pipe(
                tap(_=> { locket.log('ignoring timer', _); }),
                ignoreElements(),
                tap(() => {
                    queueSize--;
                }),
                startWith(item),
            )),
            tap(_ => { locket.log('after concatMap', _); }),
            catchError((err) => {
                locket.error('pace caught', err);
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
                        // locket.log('created badge ' + badge.id);
                        badge.show();
                    }),
                    delay(hideDelay),
                    tap(() => {
                        badge.hide(true);
                        // locket.log('destroying badge ' + badge.id);
                        badge = null;
                        // locket.log('destroyed badge ', badge);
                    }),
                    catchError((err) => {
                        locket.error('donorShowBadge caught', err);
                        return EMPTY;
                    }),
                )
            }),
        )
    };
}
