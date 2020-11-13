import 'main.scss';
import * as $ from 'jquery';
import { tap } from 'rxjs/operators';

import { QGiv, IDonation } from 'qgiv/qgiv';
// import { Utilities } from 'utilities';

$((event) => {
    const output1JQO = $('pre#output1');
    const output2JQO = $('pre#output2');
    const myApi = new QGiv();

    myApi.getTransactions().subscribe((result) => {
        output1JQO.html(JSON.stringify(result, null, 2));
    });

    myApi.watchTransactions().pipe(
        tap((result: IDonation[]) => {
            output2JQO.prepend(result.length + " records:\n" + JSON.stringify(result, null, 2) + "\n\n");
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
    //         output1JQO.html(csvData);
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
    //         output1JQO.html(JSON.stringify(data, null, 2));
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
    //         output1JQO.html('new total: ' + runningTotal + "\n" + JSON.stringify(record, null, 2));
    //         // output1JQO.html('new total: ' + runningTotal);
    //         // Utilities.notify(record.name + ' from ' + record.location);
    //     }
    // );


    // TODO: auto-adjust goal if met
    // const drawing = new Drawing();
});
