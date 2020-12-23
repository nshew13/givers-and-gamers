import { Chart } from 'chart.js';
import { tap } from 'rxjs/operators';

import { Qgiv } from 'qgiv/qgiv';
import './thermometer.scss';

// TODO: https://github.com/nagix/chartjs-plugin-rough
// TODO: https://github.com/nagix/chartjs-plugin-streaming

document.addEventListener('DOMContentLoaded', () => {
    const qgiv = new Qgiv();

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
    // setInterval(() => {
    //     myChart.data.datasets[0].data[0] = myChart.data.datasets[0].data[0] as number + Math.random()*500;
    //     myChart.update();
    // }, 500);

    qgiv.watchTransactions().pipe(
        tap((donations) => {
            myChart.data.datasets[0].data[0] = qgiv.totalAmount;
            myChart.update();
        }),
    ).subscribe();
});
