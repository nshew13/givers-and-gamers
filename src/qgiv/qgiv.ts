import { formatISO } from 'date-fns'
import { Subject, EMPTY, Observable, OperatorFunction, pipe, timer, zip, BehaviorSubject } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import {
    catchError,
    concatAll,
    filter,
    map,
    multicast,
    pluck,
    refCount,
    retry,
    scan,
    switchMap,
    takeUntil,
    tap,
} from 'rxjs/operators';

import { Dict } from 'utilities/structures.interface';
import { StringUtilities } from 'utilities/string-utilities';

import SECRETS from './secrets.json';
import { Endpoint, STATES } from './qgiv-data';
import { IDonation, ITransaction, ITransactionStatus } from './qgiv.interface';


export class Qgiv {
    // Unicode format for use with date-fns
    public static readonly DATE_FORMAT_UNICODE = 'MMMM dd, uuuu HH:mm:ss';
    private static readonly _COUNTED_TRANSACTION_TYPES: string[] = [
        ITransactionStatus.ACCEPTED,
        ITransactionStatus.OFFLINE,
    ];

    private static readonly _POLLING_INTERVAL_MSEC = 10_000;
    public static get POLLING_INTERVAL_MSEC (): number {
        return Qgiv._POLLING_INTERVAL_MSEC;
    }

    private static readonly _API_URL = 'https://secure.qgiv.com/admin/api';
    private static readonly _API_FORMAT = '.json';

    /**
     * We're going to start from the beginning every time this process starts.
     * Hopefully, this will eliminate missed records should the process
     * have to restart.
     */
    private _lastTransactionID = '1';
    private _stopPolling = new Subject<boolean>();

    private static _getAfterPoll: Observable<IDonation[]>;

    /**
     * Because _getAfterPoll is static, _totalAmount must also be. Otherwise,
     * only the instance creating _getAfterPoll will have a _totalAmount.
     *
     * We do NOT want to make everything in the _getAfterPoll call static,
     * because we want each instance to maintain its own _lastTransactionID.
     */
    private static _totalAmount: BehaviorSubject<number> = new BehaviorSubject(0).pipe(
        // reduce((acc: number, value: number) => acc + value),
        scan((acc: number, value: number) => {
            console.log(`%cscan() adding ${value} to total ${acc}`, 'color:green;');
            return acc + value;
        }),
    ) as BehaviorSubject<number>; // .pipe() converts it to Observable
    public static get totalAmount(): Observable<number> {
        return Qgiv._totalAmount.asObservable();
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


    public stopPolling (): void {
        console.log('%cSTOPPING', 'background-color: red; color: white;');
        this._stopPolling.next(true);
        this._stopPolling.complete();
    }

    public watchTransactions (pollIntervalMSec = 10_000, consoleStyle = ''): Observable<IDonation> {
        if (!Qgiv._getAfterPoll) {
            /**
             * Share one instance of an observable that multicasts the latest
             * batch of transaction records every _POLLING_INTERVAL_MSEC
             * milliseconds as long as there is at least one subscriber.
             */
            Qgiv._getAfterPoll = timer(0, Qgiv._POLLING_INTERVAL_MSEC).pipe(
                takeUntil(this._stopPolling), // TODO:FIXME: this doesn't work
                switchMap(() => this._getAfter()),
                multicast(new Subject<IDonation[]>()),
                refCount(),
            );
        }

        /**
         * Take the multicast batch and--for this Qgiv instance--return the
         * exploded batch every pollIntervalMSec milliseconds.
         *
         * Splitting the batch makes update granularity smaller, meaning the
         * thermometer animation is smoother and the badges are less delayed.
         *
         * https://stackoverflow.com/a/47104563/356016
         */
        return zip(
            Qgiv._getAfterPoll,
            this._generateTimer(pollIntervalMSec, consoleStyle),
        ).pipe(
            pluck('0'),
            concatAll(),
        );
    }


    private _generateTimer (pollIntervalMSec: number, consoleStyle = ''): Observable<number> {
        return timer(0, pollIntervalMSec).pipe(
            takeUntil(this._stopPolling),
            tap((tick) => { console.log(`%ctimer tick (once per ${pollIntervalMSec}ms)`, consoleStyle, tick); }),
        );
    }

    private _getAfter (id = this._lastTransactionID): Observable<IDonation[]> {
        return Qgiv._callApi(
            Endpoint.TRANSACTION_AFTER,
            null,
            { 'transactionID': id },
        ).pipe(
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
             * them if they are less than the ID in the _lastUpdate.
             */
            tap((donations: IDonation[]) => {
                // console.log('updating _lastTransactionID to', donation.id);
                this._lastTransactionID = donations[donations.length - 1].id;
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

                // console.log('processing ' + transactions.length + ' records');
                transactions?.flatMap((record) => {
                    // remove failed donations
                    if (!Qgiv._COUNTED_TRANSACTION_TYPES.includes(record.transStatus)) {
                        return [];
                    }

                    let amt = parseFloat(record.value);

                    // subtract all refunds
                    if ('refunds' in record && record.refunds.length > 0) {
                        record.refunds.forEach((refund) => {
                            amt -= parseFloat(refund.value);
                        });
                    }

                    // remove net 0 donations
                    if (amt === 0) {
                        // console.log(`%skipping refunded ${record.id}`, 'color:green;');
                        return [];
                    }

                    Qgiv._totalAmount.next(amt);

                    let state = '';
                    if (STATES[record?.billingState]) {
                        // TODO:? set case before comparison
                        state = ', ' + STATES[record.billingState];
                    }

                    const donation: IDonation = {
                        id:          record.id,
                        status:      record.transStatus,
                        displayName: '',
                        anonymous:   record.transactionWasAnonymous === 'y',
                        memo:        record.transactionMemo || null,
                        location:    StringUtilities.toProperCase(record.billingCity) + state,
                        amount:      amt,
                        timestamp:   formatISO(new Date(record.transactionDate)),
                    };

                    // determine display name
                    if (record.companyDonation === 'yes') {
                        // obj.displayName = StringUtilities.toProperCase(record.firstName);
                        donation.displayName = record.firstName;
                    } else {
                        if (!donation.anonymous) {
                            donation.displayName = StringUtilities.toProperCase(record.firstName + ' ' + record.lastName.substr(0, 1) + '.');
                        } else {
                            donation.displayName = 'Anonymous';
                        }
                    }

                    rv.push(donation);
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
