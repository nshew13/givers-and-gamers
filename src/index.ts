/**
 * Since there is no JavaScript needed by the animation,
 * this file exists just to pull in the assets.
 */
import './main.scss';
// TODO: figure out why baseUrl imports aren't working
import { MyApi } from './api';

$((event) => {
    const outputJQO = $('pre#output');
    const myApi = new MyApi();

    // myApi.getPledges({
    //     dateBegin: '2020-07-07',
    // }).done((result) => {
    //     outputJQO.html(JSON.stringify(result, null, 2));
    // });

    myApi.getEvents({
    }).done((result) => {
        outputJQO.html(JSON.stringify(result, null, 2));
    });
});
