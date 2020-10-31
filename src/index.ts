/**
 * Since there is no JavaScript needed by the animation,
 * this file exists just to pull in the assets.
 */
import './main.scss';
import * as $ from 'jquery';

// TODO: figure out why baseUrl imports aren't working (https://www.google.com/search?hl=en&q=typescript%20webpack%20import%20%22resolve%20as%20module%22%20baseUrl)
import { GGApi, IDonation } from './gg-api';
import { Endpoint } from './gg-data';
import { Tent } from './tent';
import { ITransaction } from 'gg.interface.secret';

$((event) => {
    const outputJQO = $('pre#output');
    const myApi = new GGApi();

    // const myTent = new Tent();
    // myTent.poll(Endpoint.EVENT_LIST, 500).subscribe();

    // myApi.callApi(Endpoint.PLEDGE_LIST, {
    //     dateBegin: '2020-07-07',
    // }).done((result) => {
    //     outputJQO.html(JSON.stringify(result, null, 2));
    // });
    //
    // myApi.callApi(Endpoint.EVENT_LIST, {
    // }).done((result) => {
    //     outputJQO.html(JSON.stringify(result, null, 2));
    // });

    // myApi.listTransactions().done((result) => {
    //     outputJQO.html(JSON.stringify(result, null, 2));
    // });

    myApi.getTransactions().subscribe(
        (result) => {
            outputJQO.html(result.length + " records:\n" + JSON.stringify(result, null, 2));
        }
    );

    let runningTotal = 0;
    myApi.readTransactionsFromFeed().subscribe(
        (record: IDonation) => {
            runningTotal += record.amount;
            outputJQO.html('new total: ' + runningTotal + "\n" + JSON.stringify(record, null, 2));
        }
    );
});
