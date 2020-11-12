import * as $ from 'jquery';
import jqXHR = JQuery.jqXHR;
import { formatISO } from 'date-fns'

import { Observable, from } from 'rxjs';
import { filter, map, pluck, take, tap } from 'rxjs/operators';

import { API_KEY, API_SUFFIX, API_URL } from '../api-key.secret';
import { Endpoint, EndpointMethods } from './gg-data';
import { GGFeed } from './gg-feed-mock';
import { ITransaction, ITransactionsResponse } from 'gg.interface.secret';


export interface IDonation {
    id:        string;
    name?:     string;
    fname?:    string;
    lname?:    string;
    anonymous: boolean;
    memo:      string;
    location:  string;
    amount:    number;
    timestamp: string;
}


export class GGApi {
    public listTransactions (params?: object): jqXHR {
        return this.callApi(Endpoint.TRANSACTION_LIST, {
            filterValue: 'Winson'
        });
    }


    public getTransactions (): Observable<IDonation[]> {
        return from(
            this.callApi(Endpoint.TRANSACTION_LIST)
        ).pipe(
            pluck('forms', '0', 'transactions'),
            map((transactions: ITransaction[]) => {
                const rv: IDonation[] = [];
                transactions.filter((record: ITransaction) => {
                    return record.transStatus === 'Accepted';
                }).forEach((record: ITransaction) => {
                    rv.push(GGApi._formatDonation(record));
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
                let donation = Object.assign({}, GGApi._formatDonation(transaction));

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

    public callApi (endpoint: Endpoint, params?: object): jqXHR {
        const data = Object.assign({ token: API_KEY }, params);

        return $.ajax({
            method: EndpointMethods[endpoint],
            url: API_URL + endpoint + API_SUFFIX,
            data: data,
            dataType: 'json'
        });
    }

    // TODO: Can I get only the newest records, or do I have to get all every time?

    private static _formatDonation (record: ITransaction): IDonation {
        const obj: IDonation = {
            id:        record.id,
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
