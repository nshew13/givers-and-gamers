import * as $ from 'jquery';
import jqXHR = JQuery.jqXHR;
import { formatISO } from 'date-fns'
import { EMPTY, from, Observable, BehaviorSubject, timer } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import {
    catchError,
    concatMap,
    filter,
    map,
    mergeMap,
    pluck,
    retry,
    take,
    tap,
} from 'rxjs/operators';

import { GGFeed } from 'mock/gg-feed-mock';

import { API_KEY } from './api-key.secret';
import { Endpoint, EndpointMethods, Method } from './qgiv-data';
import { ITransaction } from './qgiv.interface';

export interface IDonation {
    id:        string;
    status:    string; // TODO?: enum
    name?:     string;
    fname?:    string;
    lname?:    string;
    anonymous: boolean;
    memo:      string;
    location:  string;
    amount:    number;
    timestamp: string;
}


export class QGiv {
    private static readonly _API_URL = 'https://secure.qgiv.com/admin/api';
    private static readonly _API_FORMAT = '.json';

    private _lastTransactionID: BehaviorSubject<string> = new BehaviorSubject('9836284');

    // see https://blog.strongbrew.io/rxjs-polling/
    private _pollingTrigger$: Observable<number> = timer(0, 5000);


    public listTransactions (params?: object): jqXHR {
        return this._callApi(Endpoint.TRANSACTION_LIST, {
            filterValue: 'Winson'
        });
    }

    public getTransactions (): Observable<IDonation[]> {
        return from(
            this._callApi(Endpoint.TRANSACTION_LIST)
        ).pipe(
            pluck('forms', '0', 'transactions'),
            map((transactions: ITransaction[]) => {
                const rv: IDonation[] = [];
                transactions.filter((record: ITransaction) => {
                    return record.transStatus === 'Accepted';
                }).forEach((record: ITransaction) => {
                    rv.push(QGiv._formatDonation(record));
                });

                return rv;
            }),
            take(1),
        );
    }

    public readTransactionsFromFeed (speed: number = 1, maxData?: number): Observable<IDonation> {
        return GGFeed.simulateFeed(speed, maxData).pipe(
            filter((transaction: ITransaction) => transaction.transStatus === 'Accepted'),
            // TODO: debounce(?) to slow pace, regardless of input
            map((transaction: ITransaction) => {
                let donation = Object.assign({}, QGiv._formatDonation(transaction));

                // adjust for anonymity
                if (!donation.anonymous) {
                    // TODO: proper case
                    donation.name = donation.fname + ' ' + donation.lname.substr(0, 1) + '.';
                }
                delete donation.fname;
                delete donation.lname;

                return donation;
            }),
        );
    }

    public watchForLatestTransactions (): Observable<any> {
        /**
         * Set up an observable that requests transactions/after when the
         * _lastTransactionID is updated.
         *
         * TODO: probably need a debounce or something since it updates immediately but may not have new data for a while (polling)
         */
        const request$ = this._lastTransactionID.pipe(
            mergeMap((id) => this._getLatest(id)),
            map((donations: IDonation[]) => {
                // only update if new records received (otherwise, we lose our place)
                if (donations.length && donations[donations.length-1].id) {
                    // TODO: does this cascade into a leak?
                    this._lastTransactionID.next(donations[donations.length-1].id);
                }
                return donations;
            }),
        );

        return this._pollingTrigger$.pipe(
            concatMap(_ => request$), // ignore polling output
            retry(1),
            // repeat(),
            catchError(() => EMPTY)
        );
    }

    private _getLatest (fromID: string): Observable<any> {
        // return from(
        //     this._callApi(Endpoint.TRANSACTION_AFTER, null, { transactionID: this._lastTransactionID })

        return ajax({
            url: QGiv._API_URL + '/reporting/transactions/after/' + encodeURIComponent(fromID) + QGiv._API_FORMAT,
            method: 'POST',
            responseType: 'json',
            body: { 'token': API_KEY },
        }).pipe(
            pluck('response'), // from AjaxObservable
            pluck('forms', '0', 'transactions'), // from API
            map((transactions: ITransaction[]) => transactions.slice(0, 10)), // reduce size to allow repeat TODO:REMOVE
            map((transactions: ITransaction[]) => {
                const rv: IDonation[] = [];
                transactions.forEach((record) => {
                    rv.push(QGiv._formatDonation(record));
                });

                return rv;
            }),
        );
    }

    // TODO: convert to fetch API and/or rxjs/ajax
    private _callApi (endpoint: Endpoint, params?: object, pathParams?: { [key: string]: string }): jqXHR {
        const data = Object.assign({ token: API_KEY }, params);

        let url: string = endpoint;
        if (pathParams) {
            Object.keys(pathParams).forEach((param) => {
                url = url.replace(new RegExp('\\{' + param + '\\}'), pathParams[param]);
            });
        }
        url = QGiv._API_URL + url + QGiv._API_FORMAT;

        return $.ajax({
            // method: EndpointMethods[endpoint],
            method: 'POST',
            url: url,
            data: data,
            dataType: 'json'
        });
    }

    private static _formatDonation (record: ITransaction): IDonation {
        const obj: IDonation = {
            id:        record.id,
            status:    record.transStatus,
            fname:     record.firstName,
            lname:     record.lastName,
            anonymous: record.transactionWasAnonymous === 'y',
            memo:      record.transactionMemo || null,
            location:  `${record.billingCity}, ${record.billingState}`,
            amount:    parseFloat(record.value),
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

        return obj;
    }
}
