import { formatISO } from 'date-fns'
import { EMPTY, Observable, pipe, timer, UnaryFunction } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import {
    catchError,
    concatMap,
    first,
    map,
    pluck,
    retry,
    tap,
} from 'rxjs/operators';

import SECRETS from './secrets.json';
import { Endpoint } from './qgiv-data';
import { IDonation, ITransaction } from './qgiv.interface';
import { StringUtilities } from 'utilities/string-utilities';

// TODO: resume at last amount if page refreshed
// TODO: sync multiple subscribes using subject (etc.)


export class Qgiv {
	// Unicode format for use with date-fns
	public static readonly DATE_FORMAT_UNICODE = 'MMMM dd, uuuu HH:mm:ss';

    private static readonly _API_URL = 'https://secure.qgiv.com/admin/api';
	private static readonly _API_FORMAT = '.json';
	private static readonly _STORE_LAST_RESULT = 'qgiv-last-result';


    // TODO: store/retrieve from localstorage
    private _lastTransactionID: string = '9836284';
    private _totalAmount: number = 0;
    public get totalAmount (): number {
        return this._totalAmount;
    }

    // see https://blog.strongbrew.io/rxjs-polling/
    private _pollingTrigger$: Observable<number>;

    private static _callApi (endpoint: Endpoint, params?: object, pathParams?: { [key: string]: string }): Observable<any> {
        const data = Object.assign({ token: SECRETS.QGIV_API_KEY }, params);

        let url: string = endpoint;
        if (pathParams) {
            Object.keys(pathParams).forEach((param) => {
                url = url.replace(new RegExp('\\{' + param + '\\}'), pathParams[param]);
            });
        }
        url = Qgiv._API_URL + url + Qgiv._API_FORMAT;

        // TODO: convert to axios or Fetch API
        return ajax({
            url: url,
            method: 'POST',
            responseType: 'json',
            body: data,
        }).pipe(
            pluck('response'), // from AjaxObservable
        );
    }


    public constructor (pollInterval: number = 10000) {
        this._pollingTrigger$ = timer(0, pollInterval);
    }


    public getTransactions (): Observable<IDonation[]> {
        return Qgiv._callApi(Endpoint.TRANSACTION_LIST).pipe(
            this._parseTransactionsIntoDonations(),
            first(),
        );
    }

    public watchTransactions (): Observable<IDonation[]> {
        return this._pollingTrigger$.pipe(
            tap((tick) => { console.log('tick', tick); }),
            concatMap((tick) => this._getLatest()),
            retry(1),
            map((donations: IDonation[]) => {
                // only update if new records received (otherwise, we lose our place)
                if (donations.length && donations[donations.length-1].id) {
                    this._lastTransactionID = donations[donations.length-1].id;
                }
                return donations;
            }),
            catchError(() => EMPTY),
        );
    }

    private _getLatest (): Observable<IDonation[]> {
        return Qgiv._callApi(
            Endpoint.TRANSACTION_AFTER,
            null,
            { 'transactionID': this._lastTransactionID },
        ).pipe(
            this._parseTransactionsIntoDonations(),
            // map((transactions: ITransaction[]) => transactions.slice(0, 10)), // reduce size to allow repeat TODO:REMOVE
        );
    }

    private _parseTransactionsIntoDonations () {
        return pipe(
            pluck('forms', '0', 'transactions'), // from API
            map((transactions: ITransaction[]) => {
                const rv: IDonation[] = [];
                transactions.forEach((record) => {
                    const amt = parseFloat(record.value);
                    this._totalAmount += amt;

                    const obj: IDonation = {
                        id:        record.id,
                        status:    record.transStatus,
                        // fname:     record.firstName,
                        // lname:     record.lastName,
                        anonymous: record.transactionWasAnonymous === 'y',
                        memo:      record.transactionMemo || null,
                        location:  StringUtilities.toProperCase(record.billingCity) + ', ' + record.billingState.toUpperCase(),
                        amount:    amt,
                        timestamp: formatISO(new Date(record.transactionDate)),
                    };

                    if (!obj.anonymous) {
						obj.displayName = StringUtilities.toProperCase(record.firstName + ' ' + record.lastName.substr(0, 1) + '.');
                    } else {
                        obj.displayName = 'Anonymous';
                    }

                    rv.push(obj);
                });

                return rv;
            }),
        ) as UnaryFunction<Observable<{}>, Observable<IDonation[]>>;
    }
}
