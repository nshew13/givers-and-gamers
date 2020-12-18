import { from, Observable, of, OperatorFunction } from 'rxjs';
import { concatMap, delay, flatMap, mergeAll, mergeMap, tap } from 'rxjs/operators';

import { Utilities } from 'utilities';
import { IDonation } from 'qgiv/qgiv.interface';

import { DonorBadge } from './donor-badge';


export function donorPace (intervalMSec: number = 5000 /* params to pipe */): OperatorFunction<IDonation[], IDonation> {
    const timeBase = new Date().valueOf();
    console.log('donorPace started with interval of', intervalMSec);

    // inner function automatically receives source observable
    return (source: Observable<IDonation[]>) => {
        return source.pipe(
            // explode array to show one at a time
            concatMap((donations: IDonation[]) => from(donations).pipe(
                // now add delay after each element
                concatMap((donation: IDonation) => of(donation).pipe(
                    delay(intervalMSec),
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

export function donorShowBadge (/* params to pipe */): OperatorFunction<IDonation, IDonation> {
    // inner function automatically recieves source observable
    return (source: Observable<IDonation>) => {
        // TODO: this keeps only the latest
        let badge: DonorBadge;

        return source.pipe(
            tap((donation) => {
                // create the element
                badge = new DonorBadge(donation);
                badge.show();
            }),
            delay(DonorBadge.ANIMATION_DURATION_MSEC + DonorBadge.SHOW_DURATION_MSEC),
            tap((donation) => {
                badge.hide(true);
                badge = null;
            }),
        );
    };
}
