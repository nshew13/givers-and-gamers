import 'main.scss';
import * as $ from 'jquery';
import { tap } from 'rxjs/operators';
import * as Chart from 'chart.js';

import { QGiv } from 'qgiv/qgiv';
// import { Utilities } from 'utilities';

$((event) => {
    const output1JQO = $('pre#output1');
    const output2JQO = $('pre#output2');
    const qgiv = new QGiv();

    // qgiv.getTransactions().subscribe((result) => {
    //     output1JQO.html(JSON.stringify(result, null, 2));
    // });

    const context: CanvasRenderingContext2D = (document.getElementById('gauge') as HTMLCanvasElement).getContext('2d');


    var myChart = new Chart(context, {
        type: 'bar',
        data: {

                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });


    // qgiv.watchTransactions().pipe(
    //     tap((result) => {
    //         output2JQO.prepend('total: ' + qgiv.totalAmount + "\n" + result.length + " records:\n" + JSON.stringify(result, null, 2) + "\n\n");
    //         data = qgiv.totalAmount;
    //     }),
    // ).subscribe();

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
    //
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
    //
    // // fill gauge
    // qgiv.readTransactionsFromFeed(1, 10).subscribe(
    //     (result) => {
    //         const gaugeJQO = $('div#gauge');
    //         gaugeJQO.width((index, width) => width + result.amount);
    //         console.log('width set to', gaugeJQO.width());
    //     }
    // );
});
