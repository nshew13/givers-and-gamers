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
                backgroundColor: [ 'rgb(218, 41, 28)' ], // RMHC red
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
                        suggestedMax: 10000,
                        fontSize: 14,
                        fontColor: 'white',
                        fontStyle: 'bold',
                        callback: (value: number) => '$' + (value/1000) + 'k',
                        padding: 5,
                    },
                    gridLines: {
                        z: 1,
                        lineWidth: 4,
                        color: 'rgba(255, 255, 255, 0.5)',
                        drawTicks: false,
                    },
                }],
            },
            tooltips: {
                enabled: false,
            },
            aspectRatio: 5,
        },
    });

    // toggle for demo mode
    // TEMP: donation simulator
    // setInterval(() => {
    //     myChart.data.datasets[0].data[0] = myChart.data.datasets[0].data[0] as number + Math.random()*500;
    //     myChart.update();
    // }, 500);

    const thermometerConsoleStyle = 'color:red;';

    console.log('%cthermometer begins polling', thermometerConsoleStyle);
    qgiv.watchTransactions(60_000, thermometerConsoleStyle).pipe(
        tap((x) => { console.log('%cthermometer received marble', thermometerConsoleStyle, x.id); }),
        tap(() => {
            myChart.data.datasets[0].data[0] = Qgiv.totalAmount;
            myChart.update();
        }),
    ).subscribe(
        () => { /* thumbs up */ },
        error => { console.log('%csubscribe error', thermometerConsoleStyle, error); },
        () => { console.log('%cthermometer done', thermometerConsoleStyle); }
    );
});
