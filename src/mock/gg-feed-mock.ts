import { Observable, from, of } from 'rxjs';
import { concatMap, delay } from 'rxjs/operators';

const data = require('./feed.secret.json');

export class GGFeed {
    public static simulateFeed (speed: number = 1, maxData?: number): Observable<object> {
        let localData = data.slice(0, maxData);

        return from(localData).pipe(
            concatMap(i => of(i).pipe(
                // delay(Math.random() * 1000 * speed)),
                delay(1000 * speed)),
            )
        );
    }
}
