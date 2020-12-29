import { formatISO } from 'date-fns'
import { Subject, EMPTY, Observable, OperatorFunction, pipe, timer } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import {
    catchError,
    concatAll,
    filter,
    map,
    pluck,
    retry,
    switchMap,
    takeUntil,
    tap,
} from 'rxjs/operators';

import { Dict } from 'utilities/structures.interface';
import { StringUtilities } from 'utilities/string-utilities';

import SECRETS from './secrets.json';
import { Endpoint, STATES } from './qgiv-data';
import { IDonation, ITransaction } from './qgiv.interface';


export class Qgiv {
	// Unicode format for use with date-fns
	public static readonly DATE_FORMAT_UNICODE = 'MMMM dd, uuuu HH:mm:ss';

    private static readonly _API_URL = 'https://secure.qgiv.com/admin/api';
	private static readonly _API_FORMAT = '.json';

    /**
     * We're going to start from the beginning every time this process starts.
     * Hopefully, this will eliminate missed records should the process
     * have to restart.
     */
    private _lastTransactionID = '1';
    private _stopPolling = new Subject<boolean>();
    private _totalAmount = 0;
    public get totalAmount (): number {
        return this._totalAmount;
    }

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

    public constructor () {
        // do nothing
    }

    public stopPolling (): void {
        console.log('%cSTOPPING', 'background-color: red; color: white;');
        this._stopPolling.next(true);
        this._stopPolling.complete();
    }

    // public getTransactions (records = 200): Observable<IDonation[]> {
    //     return Qgiv._callApi(Endpoint.TRANSACTION_LIST, {}, { numRecords: records }).pipe(
    //         this._parseTransactionsIntoDonations(),
    //         // This endpoint returns transactions ordered newest first.
    //         map(donations => donations?.reverse()),
    //         first(),
    //         catchError((err) => {
    //             console.error('getTransactions encountered an error.', err);
    //             return EMPTY;
    //         }),
    //     );
    // }

    public watchTransactions (pollIntervalMSec = 10_000): Observable<IDonation> {
        return this._generateTimer(pollIntervalMSec).pipe(
            switchMap(() => {
                return this._getAfter();
            }),

            catchError((err) => {
                console.error('watchTransactions encountered an error.', err);
                return EMPTY;
            }),
        );
    }


    private _generateTimer (pollIntervalMSec: number): Observable<number> {
        return timer(0, pollIntervalMSec).pipe(
            takeUntil(this._stopPolling),
            // TODO: create log() operator that respects output level
            tap((tick) => { console.log('tick', tick); }),
        );
    }

    // TODO: share this between different polls (ReplaySubject?)
    private _getAfter (id = this._lastTransactionID): Observable<IDonation> {
        return Qgiv._callApi(
            Endpoint.TRANSACTION_AFTER,
            null,
            { 'transactionID': id },
        ).pipe(
            // share(),
            retry(1),

            this._parseTransactionsIntoDonations(),

            // stop here if there are no donation records
            filter(donations => Array.isArray(donations) && donations.length > 0),

            /**
             * Donations already have passed through
             * _parseTransactionsIntoDonations via _getAfter, so each donation's
             * amount is included in the total.
             *
             * Since they've been tallied in the total amount, we can skip
             * them if they are less than the ID in the _lastUpdate. To do
             * this, we'll have to explode the array with concatAll.
             *
             * Splitting will also make the thermometer animation smoother
             * and the badges less delayed.
             *
             * Thanks, Andrei. https://stackoverflow.com/a/65370882/356016
             */
            concatAll(),

            // update _lastUpdate with new record
            tap((donation: IDonation) => {
                this._lastTransactionID = donation.id;
            }),

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
