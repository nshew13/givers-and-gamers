// tent polls HAHAHAHA

import { Endpoint } from './gg-data';
import { interval, Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';

export class Tent {
    public poll (endpoint: Endpoint, pollInt: number = 5000, params?: object): Observable<any> {
        return interval(pollInt).pipe(
            tap( (i) => {
                console.log('tick', i);
            }),
            take(10),
        );
    }


    // protected startPolling (endpoint: Endpoint, interval: number = 5000): Observable<string> {
    //     const url = category === 'cats' ? CATS_URL : MEATS_URL;
    //     const mapper = category === 'cats' ? mapCats : mapMeats;
    //
    //     return timer(0, interval)
    //         .pipe(
    //             switchMap(_ => requestData(url, mapper))
    //         );
    // }
}
