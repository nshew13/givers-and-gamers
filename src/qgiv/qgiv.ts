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
    share,
    takeUntil,
    tap,
} from 'rxjs/operators';

import { Dict } from 'utilities/structures.interface';
import { StringUtilities } from 'utilities/string-utilities';

import SECRETS from './secrets.json';
import { Endpoint, STATES } from './qgiv-data';
import { IDonation, ILastUpdate, ITransaction } from './qgiv.interface';

// TODO: resume at last amount if page refreshed
// TODO: sync multiple subscribes using subject (etc.)

export class Qgiv {
	// Unicode format for use with date-fns
	public static readonly DATE_FORMAT_UNICODE = 'MMMM dd, uuuu HH:mm:ss';
	public static readonly KEY_LAST_UPDATE = 'ggQgivLastUpdate';

    private static readonly _API_URL = 'https://secure.qgiv.com/admin/api';
	private static readonly _API_FORMAT = '.json';

    private _lastUpdate: ILastUpdate;
    private _stopPolling = new Subject<boolean>();
    private _totalAmount = 0;
    public get totalAmount (): number {
        return this._totalAmount;
    }

    // see https://blog.strongbrew.io/rxjs-polling/
    private static _pollingTrigger$: Observable<number>;

    private static _callApi (endpoint: Endpoint, params?: Dict, pathParams?: Dict): Observable<unknown> {
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

    /**
     * TODO: assign to singleton triggers based on poll interval
     * otherwise, everything will poll according to the first to instantiate
     */
    public constructor (pollIntervalMSec = 10_000) {
        // init static properties
        if (Qgiv._pollingTrigger$ === undefined) {
            Qgiv._pollingTrigger$ = null;

            console.log('Polling interval set to ' + pollIntervalMSec + 'ms.');
            Qgiv._pollingTrigger$ = interval(pollIntervalMSec).pipe(
                share(),
                takeUntil(this._stopPolling),
                tap((tick) => { console.log('tick', tick); }), // TODO:FIXME: this is running once each
            );
        }

        // TODO: lastUpdate should be static
        // load last ID from LocalStorage
        const lastUpdate: string = localStorage.getItem(Qgiv.KEY_LAST_UPDATE);
        if (lastUpdate !== null) {
            this._lastUpdate = JSON.parse(lastUpdate);
            this._totalAmount = this._lastUpdate.runningTotal;
            console.log('Found last transaction ID. Resuming at ' + this._lastUpdate.transactionID + '.');
        }
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
            catchError((err) => {
                console.error('getTransactions encountered an error.', err);
                return EMPTY;
            }),
        );
    }

    public watchTransactions (): Observable<IDonation[]> {
        // TODO: convert to zip-ish with concatAll
        return Qgiv._pollingTrigger$.pipe(
            concatMap(() => {
                if (this._lastUpdate) {
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
                    this._lastUpdate = {
                        transactionID: donations[donations.length-1].id,
                        runningTotal:  this._totalAmount,
                        timestamp:     formatISO(new Date()),
                    }

                    localStorage.setItem(Qgiv.KEY_LAST_UPDATE, JSON.stringify(this._lastUpdate));
                }
                return donations;
            }),
            catchError((err) => {
                console.error('watchTransactions encountered an error.', err);
                return EMPTY;
            }),
        );
    }

    private _getLatest (): Observable<IDonation[]> {
        return Qgiv._callApi(
            Endpoint.TRANSACTION_AFTER,
            null,
            { 'transactionID': this._lastUpdate.transactionID },
        ).pipe(
            this._parseTransactionsIntoDonations(),
            catchError((err) => {
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

                    let state = '';
                    if (STATES[record?.billingState]) {
                        // TODO:? set case before comparison
                        state = ', ' + STATES[record.billingState];
                    }

                    const obj: IDonation = {
                        id:          record.id,
                        status:      record.transStatus,
                        displayName: '',
                        anonymous:   record.transactionWasAnonymous === 'y',
                        memo:        record.transactionMemo || null,
                        location:    StringUtilities.toProperCase(record.billingCity) + state,
                        amount:      amt,
                        timestamp:   formatISO(new Date(record.transactionDate)),
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
            catchError((err) => {
                console.error('_parseTransactionsIntoDonations encountered an error.', err);
                return EMPTY;
            }),
        );
    }
}
