import { QGiv } from './qgiv';

document.addEventListener('DOMContentLoaded', () => {
    const qgiv = new QGiv();

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
