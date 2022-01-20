import { Chart } from 'chart.js';
import { bufferTime, filter, map, tap } from 'rxjs/operators';

import { Qgiv } from 'qgiv/qgiv';
// TODO: convert config file to TOML when there's a good parser
import { CONFIG } from './config.js';
import './thermometer.scss';

import audioAirHorn from '../../assets/dj-air-horn-sound-effect.mp3';


/**
 * It's easier to merge the confetti component into this one than try to
 * keep them in sync with separate polling. It also reduces the number of
 * calls to the Qgiv API.
 *
 * TODO: Update Qgiv to use events (Subjects) and/or a shared polling server (Socket.io)
 */
import { ConfettiShower, EAnimationState } from '../confetti/ConfettiShower';
import '../confetti/confetti.scss';


const _INTERVAL_MAJOR = 1000;   // dollars

/**
 * determine the makeup of gridLines
 *
 * If we have a hard max of CONFIG.GOAL, and we want primary gridlines at
 * every _INTERVAL_MAJOR, we'll alternate with secondary gridlines at
 * every other _INTERVAL_MAJOR/2 (also used for stepSize). To do so, we
 * have to manually build an array to account for all of the gridlines.
 */
const gridLineWidths = Array(Math.ceil(CONFIG.GOAL/_INTERVAL_MAJOR)).fill([2, 5]).flat();
const gridLineColors = Array(Math.ceil(CONFIG.GOAL/_INTERVAL_MAJOR)).fill(['rgba(255, 255, 255, 0.5)', 'rgba(255, 255, 255, 0.2)']).flat();
// gridline 0 should also be thin
gridLineWidths.unshift(gridLineWidths[0]);

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
    const confettiConsoleStyle = 'color:pink;';

    const context: CanvasRenderingContext2D = gaugeEl.getContext('2d');
    const myChart = new Chart(context, {
        type: 'horizontalBar',
        data: {
            datasets: [{
                data: [ 0 ],
                backgroundColor: [ 'rgb(218, 41, 28)' ], // RMHC red
                barPercentage: 0.95, // bar width within category
                categoryPercentage: 1.0, // category width within equal share (100% of 100%)
            }]
        },
        options: {
            layout: {
                padding: {
                    left: 10,
                    right: 10,
                    top: 0,
                    bottom: 0,
                }
            },
            legend: {
                display: false,
            },
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero: true,
                        max: CONFIG.GOAL,
                        // suggestedMax: CONFIG.GOAL,
                        fontSize: 18,
                        fontColor: 'white',
                        fontStyle: 'bold',
                        callback: (value: number) => {
                            // provide labels only for major gridlines
                            if (value % _INTERVAL_MAJOR === 0) {
                                return '$' + (value/1000) + 'k';
                            }
                            return '';
                        },
                        padding: 5,
                        stepSize: _INTERVAL_MAJOR/2,
                    },
                    gridLines: {
                        z: 1,
                        lineWidth: gridLineWidths,
                        color: gridLineColors,
                        zeroLineColor: gridLineColors[0],
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

    const airhorn = new Audio(audioAirHorn);

    let launchNum = 0;
    function launchConfetti (milestone: number): void {
        const launchStr = `confetti animation #${launchNum} at $${milestone}`;
        launchNum++;

        // add comma for $10k+
        milestoneEl.textContent = '$' + (milestone > 9999 ? milestone.toLocaleString() : milestone);

        confetti.startAnimation().pipe(
            tap((state) => {
                switch (state) {
                    case EAnimationState.STARTED:
                        console.log(`%c${launchStr} STARTED`, confettiConsoleStyle);

                        // N.B.: assumes CONFIG.INTERVAL_AIRHORN is a multiple of CONFIG.INTERVAL_CONFETTI (and thus milestone)
                        if (   milestone % CONFIG.INTERVAL_AIRHORN === 0
                            // If the goal/max is off-interval, fire when hitting it or just going over
                            || (milestone >= CONFIG.GOAL && milestone < CONFIG.GOAL + CONFIG.INTERVAL_AIRHORN)
                        ) {
                            airhorn.play().catch(() => { console.info('Unable to play audio until user interacts with page.') });
                        }

                        text.classList.add('show');
                        break;
                    case EAnimationState.ENDED:
                        console.log(`%c${launchStr} ENDED`, confettiConsoleStyle);
                        /*
                         * If the milestone is the goal/max, leave it displayed
                         * because it also receives continuous confetti.
                         *
                         * N.B.: The milestone may exceed CONFIG.GOAL, but
                         *       will not be displayed in the graphic.
                         */
                        if (milestone < CONFIG.GOAL) {
                            text.classList.remove('show');
                        }
                        break;
                }
            }),
        ).subscribe(
            () => { /* fires for every emitted state */ },
            error => { console.log(`%c${launchStr} error`, confettiConsoleStyle, error); },
            () => {
                console.log(`%c${launchStr} complete`, confettiConsoleStyle);
                if (CONFIG.CONTINUOUS_CONFETTI_AT_GOAL && milestone >= CONFIG.GOAL) {
                    text.classList.add('show'); // just in case
                    confettiLoop();
                }
            }
        );
    }

    function confettiLoop () {
        /*
         * The Confetti class allows only one animation to run
         * at a time.
         */
        confetti.startAnimation().subscribe(
            () => { /* fires for every emitted state */ },
            error => { console.log(`%cconfettiLoop error`, confettiConsoleStyle, error); },
            () => { confettiLoop(); }
        );
    }

    // window['updateGauge'] = (amount: number) => { updateGauge (amount); };

    // make confetti DIVs a little more than double the (dynamic) height of the thermometer
    function resizeConfetti () {
        const newDim = Math.floor(2 * gaugeEl.clientHeight + 50);

        confettiEls.forEach((val, i) => {
            (val as HTMLElement).style.height = newDim + 'px';
        });
        confetti.resize(newDim);
    }
    window.onresize = () => { resizeConfetti(); };
    resizeConfetti();

    /*
     * With lastThreshold set to 0 only at initialization, the gauge can
     * only increase. However, starting at 0 for each call will always
     * repeat the last threshold announcement.
     */
    let lastThreshold = 0;
    function updateGauge (amount: number) {
        myChart.data.datasets[0].data[0] = amount;
        myChart.update();

        const nearestDollarTotal = Math.floor(amount);
        if (nearestDollarTotal >= lastThreshold + CONFIG.INTERVAL_CONFETTI) {
            // reached a new threshold, determine highest threshold amount
            do {
                lastThreshold += CONFIG.INTERVAL_CONFETTI;
            } while (lastThreshold + CONFIG.INTERVAL_CONFETTI <= nearestDollarTotal);

            launchConfetti(lastThreshold);
        }
    }

    // thermometer won't update until first loop, after CONFIG.UPDATE_FREQUENCY
    /**
     * N.B.: This only works when something is driving polling. When
     *       everything is on the same page, this is the donors badge.
     *       In Streamlabs, however, the badges and gauge are in separate
     *       instances. Therefore, we have to fall back to polling, if
     *       just to get it going.
     */
    Qgiv.totalAmount.pipe(
        bufferTime(CONFIG.UPDATE_FREQUENCY * 1000),
        // skip empty buffers
        filter((amounts: number[]) => amounts.length > 0),
        // take last (most recent) element of buffer
        map((amounts: number[]) => amounts[amounts.length - 1]),
        tap((amount) => {
            updateGauge(amount);
        }),
    ).subscribe();

    // Qgiv pipe unnecessary if just periodically grabbing static value
    // let donationCount = 0;
    console.log('%cthermometer begins polling', thermometerConsoleStyle);
    qgiv.watchTransactions(60_000, thermometerConsoleStyle)./* pipe(
        tap((x) => { console.log('%cdonation ' + ++donationCount + ' received', thermometerConsoleStyle, x.id); }),
    ). */subscribe(
        () => { /**/ },
        error => { console.log('%cthermometer subscribe error', thermometerConsoleStyle, error); },
        () => { console.log('%cthermometer complete', thermometerConsoleStyle); }
    );

    document.querySelectorAll('.preload').forEach((el) => { el.classList.remove('preload'); });
});
