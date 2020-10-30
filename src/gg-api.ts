import * as $ from 'jquery';
import jqXHR = JQuery.jqXHR;
import { Observable, from } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';

import { API_KEY, API_SUFFIX, API_URL } from '../api-key.secret';
import { Endpoint, EndpointMethods } from './gg-data';


export class GGApi {
    public listTransactions (params?: object): jqXHR {
        return this.callApi(Endpoint.TRANSACTION_LIST, {
            filterValue: 'Winson'
        });
    }


    public getTransactions (): Observable<any> {
        return from(
            this.callApi(Endpoint.TRANSACTION_LIST)
        ).pipe(
            map((response) => response.forms[0].transactions),
            tap((_) => console.log('transactions', _) ),
            // filter((transaction) => transaction.transStatus === 'Accepted'),
            map((transactions) => {
                const rv: object[] = [];
                transactions.filter((record: object) => {
                    return record.transStatus === 'Accepted';
                }).forEach((record: object) => {
                    const obj = {
                        // TODO: create interfaces for gg responses
                        id:        record.id,
                        name:      `${record.firstName} ${record.lastName}`,
                        anonymous: record.transactionWasAnonymous === 'y',
                        memo:      record.transactionMemo || null,
                        location:  `${record.billingCity}, ${record.billingState}`,
                        amount:    parseFloat(record.value),
                        timestamp: new Date(record.transactionDate),
                    };

                    rv.push(obj);
                });

                return rv;
            }),
            take(1),
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
}
