import { EMPTY, from, Observable, of, OperatorFunction } from 'rxjs';
import { catchError, concatMap, delay, tap } from 'rxjs/operators';

import { Utilities } from 'utilities';
import { IDonation } from 'qgiv/qgiv.interface';

import { DonorBadge } from './donor-badge';

// TODO: add (console) logging to know if we're getting too far behind
// TODO: ... or automatically adjust speed (!)

export function donorPace (intervalMSec: number = 5000 /* params to pipe */): OperatorFunction<IDonation[], IDonation> {
    const timeBase = new Date().valueOf();
    console.log('donorPace initialized with interval of ' + intervalMSec + 'ms');

    // inner function automatically receives source observable
    return (source: Observable<IDonation[]>) => {
        return source.pipe(

            // explode array to show one at a time
            concatMap((donations: IDonation[]) => from(donations).pipe(
                // now add delay after each element
                concatMap((donation: IDonation) => of(donation).pipe(
                    // TODO: write to localStorage so resume won't skip last shown to last retrieved
                    // TODO: delay affects first request
                    delay(intervalMSec),
                    catchError((err, caught) => {
                        console.error('donorPace caught', err);
                        return EMPTY;
                    }),
                )),
            )),
            tap((donation: IDonation) => {
                donation.displayName = Utilities.toProperCase(donation.displayName);

                // debugging marble test
                // donations.forEach(donation => {
                //     donation.status = '+' + (new Date().valueOf() - timeBase);
                //     console.debug('tick', donation);
                // });
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
