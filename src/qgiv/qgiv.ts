import { formatISO } from 'date-fns'
import { Subject, EMPTY, interval, Observable, OperatorFunction, pipe } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import {
    catchError,
    concatMap,
    first,
    map,
    pluck,
    retry,
    takeUntil,
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
	public static readonly KEY_LAST_ID = 'ggQgivLastID';

    private static readonly _API_URL = 'https://secure.qgiv.com/admin/api';
	private static readonly _API_FORMAT = '.json';
	private static readonly _STORE_LAST_RESULT = 'qgiv-last-result';


    private _stopPolling = new Subject<any>();
    private _lastTransactionID: string = '';
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


    public constructor (pollIntervalMSec: number = 10_000) {
        // load last ID from LocalStorage
        const lastID = localStorage.getItem(Qgiv.KEY_LAST_ID);
        if (lastID !== null) {
            console.log('Found last transaction ID. Resuming at ' + lastID + '.');
            this._lastTransactionID = lastID;
        }

        console.log('Polling interval set to ' + pollIntervalMSec + 'ms.');

        this._pollingTrigger$ = interval(pollIntervalMSec).pipe(
            takeUntil(this._stopPolling),
            tap((tick) => { console.log('tick', tick); }),
            // take(5),
        );
    }

    public stopPolling (): void {
        this._stopPolling.next(true);
        this._stopPolling.complete();
    }

    public getTransactions (): Observable<IDonation[]> {
        return Qgiv._callApi(Endpoint.TRANSACTION_LIST).pipe(
            this._parseTransactionsIntoDonations(),
            // This endpoint returns transactions ordered newest first.
            map(donations => donations?.reverse()),
            first(),
            catchError((err, caught) => {
                console.error('getTransactions encountered an error.', err);
                return EMPTY;
            }),
        );
    }

    public watchTransactions (): Observable<IDonation[]> {
        console.log('watchTransactions begins polling.');

        // TODO: convert to zip-ish with concatAll
        return this._pollingTrigger$.pipe(
            concatMap((tick) => {
                if (this._lastTransactionID) {
                    return this._getLatest();
                } else {
                    // we have to prime the well
                    // TODO: make this a smarter pipe-streamy-thing
                    return this.getTransactions();
                }
            }),
            retry(1),
            map((donations: IDonation[]) => {
                // only update if new records received (otherwise, we lose our place)
                if (donations.length && donations[donations.length-1].id) {
                    this._lastTransactionID = donations[donations.length-1].id;

                    localStorage.setItem(Qgiv.KEY_LAST_ID, this._lastTransactionID);
                }
                return donations;
            }),
            catchError((err, caught) => {
                console.error('watchTransactions encountered an error.', err);
                return EMPTY;
            }),
        );
    }

    private _getLatest (): Observable<IDonation[]> {
        return Qgiv._callApi(
            Endpoint.TRANSACTION_AFTER,
            null,
            { 'transactionID': this._lastTransactionID },
        ).pipe(
            this._parseTransactionsIntoDonations(),
            catchError((err, caught) => {
                console.error('_getLatest encountered an error.', err);
                return EMPTY;
            }),
        );
    }

    private _parseTransactionsIntoDonations (): OperatorFunction<ITransaction[], IDonation[]> {
        return pipe(
            pluck('forms', '0', 'transactions'), // from API
            map((transactions: ITransaction[]) => {
                const rv: IDonation[] = [];
                transactions?.forEach((record) => {
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
            catchError((err, caught) => {
                console.error('_parseTransactionsIntoDonations encountered an error.', err);
                return EMPTY;
            }),
        );
    }
}
