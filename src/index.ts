/**
 * Since there is no JavaScript needed by the animation,
 * this file exists just to pull in the assets.
 */
import './main.scss';
import * as $ from 'jquery';

// TODO: figure out why baseUrl imports aren't working (https://www.google.com/search?hl=en&q=typescript%20webpack%20import%20%22resolve%20as%20module%22%20baseUrl)
import { GGApi } from './gg-api';
import { Endpoint } from './gg-data';

$((event) => {
    const outputJQO = $('pre#output');
    const myApi = new GGApi();

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

    myApi.listTransactions().done((result) => {
        outputJQO.html(JSON.stringify(result, null, 2));
    });
});
