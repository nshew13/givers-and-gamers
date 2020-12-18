import { Observable, of, OperatorFunction } from 'rxjs';
import { concatMap, delay, tap } from 'rxjs/operators';

import { Utilities } from 'utilities';
import { IDonation } from 'qgiv/qgiv.interface';

import { DonorBadge } from './donor-badge';


export function donorPace (/* params to pipe */): OperatorFunction<IDonation[], IDonation[]> {
    const timeBase = new Date().valueOf();
    // inner function automatically recieves source observable
    return (source: Observable<IDonation[]>) => {
        return source.pipe(
            // TODO: flatten array to show one at a time
            // tap((donation: IDonation[]) => {
            //     if (!Array.isArray(donation)) {
            //         return [ donation ];
            //     }
            //     return donation;
            // }),

            concatMap((donations: IDonation[]) => of(donations).pipe(delay(DonorBadge.ANIMATION_DURATION_MSEC * 2 + DonorBadge.SHOW_DURATION_MSEC))),
            tap((donations: IDonation[]) => {
                // donations[0].displayName = Utilities.toProperCase(donations[0].displayName);

                // debugging marble test
                donations.forEach(donation => {
                    donation.status = '+' + (new Date().valueOf() - timeBase);
                    console.debug('tick', donation);
                });
            }),
        );
    };
}

export function donorShowBadge (/* params to pipe */): OperatorFunction<IDonation[], IDonation[]> {
    // inner function automatically recieves source observable
    return (source: Observable<IDonation[]>) => {
        let badge: DonorBadge;

        return source.pipe(
            tap((donations) => {
                // create the element
                badge = new DonorBadge(donations[0]);
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
