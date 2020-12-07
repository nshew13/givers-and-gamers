// import * as $ from 'jquery';
import { tap } from 'rxjs/operators';

import { QGiv } from 'qgiv/qgiv';
import { IDonation } from 'qgiv/qgiv.interface';
import { GGFeed } from 'mock/gg-feed-mock';

import './donators.scss';

const notificationEl = document.getElementById('div#donation');
const nameEl = document.getElementById('p#donor');
const locationEl = document.getElementById('p#loc');

function displayDonation (donation: IDonation) {

}

document.addEventListener('DOMContentLoaded', () => {
    const qgiv = new QGiv();

    // qgiv.getTransactions().subscribe((result) => {
    //     output1JQO.html(JSON.stringify(result, null, 2));
    // });

    // TEMP: donation simulator
    GGFeed.simulateFeed().subscribe((donation: IDonation) => {
        displayDonation(donation);
    });

    // qgiv.watchTransactions().pipe(
    //     tap((result) => {
    //         // output2JQO.prepend('total: ' + qgiv.totalAmount + "\n" + result.length + " records:\n" + JSON.stringify(result, null, 2) + "\n\n");
    //         myChart.data.datasets[0].data[0] = qgiv.totalAmount;
    //         myChart.update();
    //     }),
    // ).subscribe();
});
