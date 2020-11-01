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



    function notify (msg: string) {
        let notifier: Notification;

        const options = {
            body: msg,
            tag: 'tag string',
            // icon: 'https://i.kym-cdn.com/entries/icons/original/000/020/077/dndnextlogo.jpg',
            icon: 'https://scontent.flex2-1.fna.fbcdn.net/v/t1.0-9/117400558_191895378951018_6498288682219824371_n.png?_nc_cat=107&ccb=2&_nc_sid=09cbfe&_nc_ohc=XoMbje2n5akAX-8uoC1&_nc_ht=scontent.flex2-1.fna&oh=baafbabcff51b02b23510f6a634a543e&oe=5FC50540',
            silent: true,
        };

        if (!('Notification' in window)) {
            console.warn('This browser does not support desktop notification');
            this.notify = () => false;
        } else if (Notification.permission === 'granted') {
            notifier = new Notification('Givers & Gamers', options);
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    notifier = new Notification('Givers & Gamers', options);
                }
            });
        }
    }


    // TODO: auto-adjust goal if met
    let runningTotal = 0;
    myApi.readTransactionsFromFeed(5, 5).subscribe(
        (record: IDonation) => {
            runningTotal += record.amount;
            // outputJQO.html('new total: ' + runningTotal + "\n" + JSON.stringify(record, null, 2));
            outputJQO.html('new total: ' + runningTotal);
            notify(record.name + ' from ' + record.location);
        }
    );
});
