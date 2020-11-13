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

import { API_KEY } from './api-key.secret';
import { Endpoint } from './qgiv-data';
import { IDonation, ITransaction } from './qgiv.interface';


export class QGiv {
    private static readonly _API_URL = 'https://secure.qgiv.com/admin/api';
    private static readonly _API_FORMAT = '.json';

    // TODO: store/retrieve from localstorage
    private _lastTransactionID: string = '9836284';
    private _totalAmount: number = 0;
    public get totalAmount (): number {
        return this._totalAmount;
    }

    // see https://blog.strongbrew.io/rxjs-polling/
    private _pollingTrigger$: Observable<number>;


    public constructor (pollInterval: number = 10000) {
        this._pollingTrigger$ = timer(0, pollInterval);
    }


    public getTransactions (): Observable<IDonation[]> {
        return QGiv._callApi(Endpoint.TRANSACTION_LIST).pipe(
            this._parseTransactionsIntoDonations(),
            first(),
        );
    }

    public watchTransactions (): Observable<IDonation[]> {
        return this._pollingTrigger$.pipe(
            tap((tick) => { console.log('tick', tick); }),
            concatMap((tick) => this._getLatest()), // ignore tick
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


    private static _callApi (endpoint: Endpoint, params?: object, pathParams?: { [key: string]: string }): Observable<any> {
        const data = Object.assign({ token: API_KEY }, params);

        let url: string = endpoint;
        if (pathParams) {
            Object.keys(pathParams).forEach((param) => {
                url = url.replace(new RegExp('\\{' + param + '\\}'), pathParams[param]);
            });
        }
        url = QGiv._API_URL + url + QGiv._API_FORMAT;

        return ajax({
            url: url,
            method: 'POST',
            responseType: 'json',
            body: data,
        }).pipe(
            pluck('response'), // from AjaxObservable
        );
    }

    private _getLatest (): Observable<IDonation[]> {
        return QGiv._callApi(
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
                        fname:     record.firstName,
                        lname:     record.lastName,
                        anonymous: record.transactionWasAnonymous === 'y',
                        memo:      record.transactionMemo || null,
                        location:  `${record.billingCity}, ${record.billingState}`,
                        amount:    amt,
                        timestamp: formatISO(new Date(record.transactionDate)),

                        // firstName:      record.firstName,
                        // lastName:      record.lastName,
                        // transactionWasAnonymous: record.transactionWasAnonymous,
                        // transactionMemo:      record.transactionMemo,
                        // billingCity:  record.billingCity,
                        // billingState: record.billingState,
                        // value:    record.value,
                        // transactionDate: record.transactionDate,
                        // transStatus: record.transStatus,
                    };

                    rv.push(obj);
                });

                return rv;
            }),
        ) as UnaryFunction<Observable<{}>, Observable<IDonation[]>>;
    }
}
