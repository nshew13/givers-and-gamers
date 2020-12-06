// import * as $ from 'jquery';
import { tap } from 'rxjs/operators';

import { QGiv } from 'qgiv/qgiv';

import './donators.scss';

// TODO: resume at last amount if page refreshed

document.addEventListener('DOMContentLoaded', () => {
    const output1JQO = $('pre#output1');
    const output2JQO = $('pre#output2');
    const qgiv = new QGiv();

    // qgiv.getTransactions().subscribe((result) => {
    //     output1JQO.html(JSON.stringify(result, null, 2));
    // });


    // TEMP: donation simulator
    setInterval(() => {
    }, 500);

    // qgiv.watchTransactions().pipe(
    //     tap((result) => {
    //         // output2JQO.prepend('total: ' + qgiv.totalAmount + "\n" + result.length + " records:\n" + JSON.stringify(result, null, 2) + "\n\n");
    //         myChart.data.datasets[0].data[0] = qgiv.totalAmount;
    //         myChart.update();
    //     }),
    // ).subscribe();
});
