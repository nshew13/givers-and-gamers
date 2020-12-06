import * as Chart from 'chart.js';

import { QGiv } from 'qgiv/qgiv';
import './thermometer.scss';

// TODO: resume at last amount if page refreshed
// TODO: output to single HTML, separately for thermometer and donators
// TODO: https://github.com/nagix/chartjs-plugin-rough
// TODO: https://github.com/nagix/chartjs-plugin-streaming

document.addEventListener('DOMContentLoaded', () => {
    const qgiv = new QGiv();

    const context: CanvasRenderingContext2D = (document.getElementById('gauge') as HTMLCanvasElement).getContext('2d');
    const myChart = new Chart(context, {
        type: 'horizontalBar',
        data: {
            datasets: [{
                // label: 'donations',
                data: [ 0 ],
                backgroundColor: [ 'red' ],
            }]
        },
        options: {
            legend: {
                display: false,
            },
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero: true,
                        suggestedMax: 7000,
                        fontSize: 16,
                        fontColor: 'black',
                        fontStyle: 'bold',
                        callback: (value: number) => '$' + (value/1000) + 'k'
                    },
                    gridLines: {
                        z: 1,
                        lineWidth: 3,
                    },
                }],
            },
            tooltips: {
                enabled: false,
            },
        }
    });

    // TEMP: donation simulator
    setInterval(() => {
        myChart.data.datasets[0].data[0] = myChart.data.datasets[0].data[0] as number + Math.random()*500;
        myChart.update();
    }, 500);

    // qgiv.watchTransactions().pipe(
    //     tap((result) => {
    //         // output2JQO.prepend('total: ' + qgiv.totalAmount + "\n" + result.length + " records:\n" + JSON.stringify(result, null, 2) + "\n\n");
    //         myChart.data.datasets[0].data[0] = qgiv.totalAmount;
    //         myChart.update();
    //     }),
    // ).subscribe();
});
