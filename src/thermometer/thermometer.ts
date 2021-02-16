import { Chart } from 'chart.js';
import { tap } from 'rxjs/operators';

import { Qgiv } from 'qgiv/qgiv';
import './thermometer.scss';


/**
 * It's easier to merge the confetti component into this one than try to
 * keep them in sync with separate polling. It also reduces the number of
 * calls to the Qgiv API.
 *
 * TODO: Update Qgiv to use events (Subjects) and/or a shared polling server (Socket.io)
 */
import { ConfettiShower, EAnimationState } from '../confetti/ConfettiShower';
import '../confetti/confetti.scss';


const _CONFETTI_THRESHOLD = 50;

// TODO: https://github.com/nagix/chartjs-plugin-rough
// TODO: https://github.com/nagix/chartjs-plugin-streaming

document.addEventListener('DOMContentLoaded', () => {
    const confettiEls: NodeList = document.querySelectorAll('.confetti-center');
    const milestoneEl = document.getElementById('milestone');
    const text = document.querySelector('.confetti-text');
    const gaugeEl = document.getElementById('gauge') as HTMLCanvasElement;

    const confetti = new ConfettiShower('confetti');
    const qgiv = new Qgiv();

    const thermometerConsoleStyle = 'color:red;';

    const context: CanvasRenderingContext2D = gaugeEl.getContext('2d');
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


    function launchConfetti (milestone: string) {
        milestoneEl.textContent = milestone;

        confetti.startAnimation().pipe(
            tap((state) => {
                switch (state) {
                    case EAnimationState.START:
                        text.classList.add('show');
                        break;
                    case EAnimationState.END:
                        text.classList.remove('show');
                        break;
                }
            }),
        ).subscribe(
            () => { /* thumbs up */ },
            error => { console.log('%c launchConfetti error', thermometerConsoleStyle, error); },
            () => { /* console.log('launchConfetti complete'); */ }
        );
    }

    // make confetti DIVs a little more than double the (dynamic) height of the thermometer
    function resizeConfetti () {
        const newDim = Math.floor(2 * gaugeEl.clientHeight + 50);

        confettiEls.forEach((val, i) => {
            (val as HTMLElement).style.minHeight = newDim + 'px';
        });
        confetti.resize(newDim);
    }
    window.onresize = () => { resizeConfetti(); };
    resizeConfetti();


    console.log('%cthermometer begins polling', thermometerConsoleStyle);
    qgiv.watchTransactions(60_000, thermometerConsoleStyle).pipe(
        tap((x) => { console.log('%cthermometer received marble', thermometerConsoleStyle, x.id); }),
        tap(() => {
            myChart.data.datasets[0].data[0] = Qgiv.totalAmount;
            myChart.update();

            // TODO: currently this only works when hitting the threshold exactly (not next time after going over)
            const nearestDollar = Math.floor(Qgiv.totalAmount);
            if (nearestDollar % _CONFETTI_THRESHOLD === 0) {
                launchConfetti('$' + nearestDollar);
            }
        }),
    ).subscribe(
        () => { console.log('%csubscribe success', thermometerConsoleStyle); },
        error => { console.log('%csubscribe error', thermometerConsoleStyle, error); },
        () => { console.log('%cthermometer done', thermometerConsoleStyle); }
    );

    document.querySelectorAll('.preload').forEach((el) => { el.classList.remove('preload'); });
});
