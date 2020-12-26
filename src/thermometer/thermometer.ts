import { Chart } from 'chart.js';
import { tap } from 'rxjs/operators';

import { Qgiv } from 'qgiv/qgiv';
import './thermometer.scss';

// TODO: https://github.com/nagix/chartjs-plugin-rough
// TODO: https://github.com/nagix/chartjs-plugin-streaming

document.addEventListener('DOMContentLoaded', () => {
    const qgiv = new Qgiv(60_000);

    const context: CanvasRenderingContext2D = (document.getElementById('gauge') as HTMLCanvasElement).getContext('2d');
    const myChart = new Chart(context, {
        type: 'horizontalBar',
        data: {
            datasets: [{
                // label: 'donations',
                data: [ 0 ],
                backgroundColor: [ 'rgb(218, 41, 28)' ],
                barPercentage: 1.0,
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
                        fontSize: 14,
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
            aspectRatio: 6,
        },
    });

    // TODO: toggle for demo mode
    // TEMP: donation simulator
    // setInterval(() => {
    //     myChart.data.datasets[0].data[0] = myChart.data.datasets[0].data[0] as number + Math.random()*500;
    //     myChart.update();
    // }, 500);

    console.log('thermometer begins polling');
    qgiv.watchTransactions().pipe(
        tap(() => {
            myChart.data.datasets[0].data[0] = qgiv.totalAmount;
            myChart.update();
        }),
    ).subscribe(
        () => { /* thumbs up */ },
        error => { console.log('subscribe error', error); },
        () => { console.log('thermometer done'); }
    );
});
