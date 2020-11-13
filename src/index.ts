import 'main.scss';
import * as $ from 'jquery';
import { delay, repeat, tap } from 'rxjs/operators';

import { QGiv, IDonation } from 'qgiv/qgiv';
// import { Endpoint } from 'qgiv-data';
// import { Drawing } from 'drawing';
// import { Tent } from 'tent';
// import { ITransaction } from 'qgiv.interface';

$((event) => {
    const outputJQO = $('pre#output');
    const myApi = new QGiv();

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

    // display all transactions
    // myApi.getTransactions().subscribe(
    myApi.watchForLatestTransactions().pipe(
        tap((result: IDonation[]) => {
            outputJQO.prepend(result.length + " records:\n" + JSON.stringify(result, null, 2) + "\n\n");
        }),
    ).subscribe();

    // // create CSV timeline
    // myApi.getTransactions().subscribe(
    //     (result) => {
    //         let csvData = '<pre>';
    //         result.forEach((value) => {
    //             csvData += '"' + value.timestamp + '",' + value.amount + '\n';
    //         });
    //         csvData += '</pre>';
    //
    //         outputJQO.html(csvData);
    //     }
    // );

    // // create JSON timeline
    // myApi.getTransactions().subscribe(
    //     (result) => {
    //         const data: object[] = [];
    //         result.forEach((value) => {
    //             data.push({
    //                 'ts': value.timestamp,
    //                 'amt': value.amount,
    //             });
    //         });
    //
    //         outputJQO.html(JSON.stringify(data, null, 2));
    //     }
    // );

    // // fill gauge
    // myApi.readTransactionsFromFeed(1, 10).subscribe(
    //     (result) => {
    //         const gaugeJQO = $('div#gauge');
    //         gaugeJQO.width((index, width) => width + result.amount);
    //         console.log('width set to', gaugeJQO.width());
    //     }
    // );

    // let runningTotal = 0;
    // let drawing = new Drawing();
    // myApi.readTransactionsFromFeed(5, 5).subscribe(
    //     (record: IDonation) => {
    //         runningTotal += record.amount;
    //         outputJQO.html('new total: ' + runningTotal + "\n" + JSON.stringify(record, null, 2));
    //         // outputJQO.html('new total: ' + runningTotal);
    //         // notify(record.name + ' from ' + record.location);
    //     }
    // );


    // TODO: auto-adjust goal if met
    // const drawing = new Drawing();
});



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
