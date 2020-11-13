import 'main.scss';
import * as $ from 'jquery';
import { tap } from 'rxjs/operators';

import { QGiv } from 'qgiv/qgiv';
// import { Utilities } from 'utilities';

$((event) => {
    const output1JQO = $('pre#output1');
    const output2JQO = $('pre#output2');
    const qgiv = new QGiv();

    qgiv.getTransactions().subscribe((result) => {
        output1JQO.html(JSON.stringify(result, null, 2));
    });

    qgiv.watchTransactions().pipe(
        tap((result) => {
            output2JQO.prepend('total: ' + qgiv.totalAmount + "\n" + result.length + " records:\n" + JSON.stringify(result, null, 2) + "\n\n");
        }),
    ).subscribe();

    // // create CSV timeline
    // qgiv.getTransactions().subscribe(
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
    // qgiv.getTransactions().subscribe(
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
    // qgiv.readTransactionsFromFeed(1, 10).subscribe(
    //     (result) => {
    //         const gaugeJQO = $('div#gauge');
    //         gaugeJQO.width((index, width) => width + result.amount);
    //         console.log('width set to', gaugeJQO.width());
    //     }
    // );

    // let runningTotal = 0;
    // let drawing = new Drawing();
    // qgiv.readTransactionsFromFeed(5, 5).subscribe(
    //     (record) => {
    //         runningTotal += record.amount;
    //         output1JQO.html('new total: ' + runningTotal + "\n" + JSON.stringify(record, null, 2));
    //         // output1JQO.html('new total: ' + runningTotal);
    //         // Utilities.notify(record.name + ' from ' + record.location);
    //     }
    // );


    // TODO: auto-adjust goal if met
    // const drawing = new Drawing();
});
