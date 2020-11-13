import * as $ from 'jquery';
import jqXHR = JQuery.jqXHR;
import { formatISO } from 'date-fns'
import { EMPTY, from, Observable, timer } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import {
    catchError,
    concatMap,
    filter,
    map,
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

    private _lastTransactionID: string = '9836284';

    // see https://blog.strongbrew.io/rxjs-polling/
    private _pollingTrigger$: Observable<number> = timer(0, 10000);


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

    public watchForLatestTransactions (): Observable<IDonation[]> {
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

    private _getLatest (): Observable<IDonation[]> {
        return ajax({
            url: QGiv._API_URL + '/reporting/transactions/after/' + encodeURIComponent(this._lastTransactionID) + QGiv._API_FORMAT,
            method: 'POST',
            responseType: 'json',
            body: { 'token': API_KEY },
        }).pipe(
            pluck('response'), // from AjaxObservable
            pluck('forms', '0', 'transactions'), // from API

            // map((transactions: ITransaction[]) => transactions.slice(0, 10)), // reduce size to allow repeat TODO:REMOVE

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
