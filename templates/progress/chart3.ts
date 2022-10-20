import Chart from 'chart.js/auto';
import { CONFIG } from './config';

const _INTERVAL_MAJOR = 1000; // dollars

/**
 * determine the makeup of grid-lines
 *
 * If we have a hard max of CONFIG.GOAL, and we want primary grid-lines at
 * every _INTERVAL_MAJOR, we'll alternate with secondary grid-lines at
 * every other _INTERVAL_MAJOR/2 (also used for stepSize). To do so, we
 * have to manually build an array to account for all of the grid-lines.
 */
const gridLineWidths = Array(Math.ceil(CONFIG.GOAL / _INTERVAL_MAJOR))
    .fill([2, 5])
    .flat();
const gridLineColors = Array(Math.ceil(CONFIG.GOAL / _INTERVAL_MAJOR))
    .fill(['rgba(255, 255, 255, 0.5)', 'rgba(255, 255, 255, 0.2)'])
    .flat();
// grid-line 0 should also be thin
gridLineWidths.unshift(gridLineWidths[0]);


document.addEventListener('DOMContentLoaded', () => {
    const gaugeEl = document.getElementById('gauge') as HTMLCanvasElement;

    // const confetti = new ConfettiShower('confetti');
    // const qgiv = new Qgiv();

    // const progressConsoleStyle = 'color:red;';
    // const confettiConsoleStyle = 'color:pink;';

    const context = gaugeEl.getContext('2d') as CanvasRenderingContext2D;
    const myChart = new Chart(context, {
        type: 'bar',
        data: {
            // We have only one bar and, therefore, only one dataset.
            datasets: [{
                data: [5432],
                backgroundColor: [CONFIG.BAR_COLOR],
                barPercentage: 0.95, // bar width within category
                categoryPercentage: 1.0, // category width within equal share (100% of 100%)
            }],
        },
        options: {
            indexAxis: 'y', // makes the bar horizontal
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                },
            },




            // layout: {
            //     padding: {
            //         left: 10,
            //         right: 10,
            //         top: 0,
            //         bottom: 0,
            //     },
            // },

            scales: {
                'x': {
                    beginAtZero: true,
            //                 // max: CONFIG.GOAL,
                    suggestedMax: CONFIG.GOAL,
            //                 fontSize: 18,
            //                 fontColor: 'white',
            //                 fontStyle: 'bold',
            //                 callback: (value: number) => {
            //                     // provide labels only for major grid-lines
            //                     if (value % _INTERVAL_MAJOR === 0) {
            //                         if (value === 0) {
            //                             return '$0';
            //                         }
                                    
            //                         return '$' + value / 1000 + 'k';
            //                     }
            //                     return '';
            //                 },
            //                 padding: 5,
            //                 stepSize: _INTERVAL_MAJOR / 2,
            //             },
            //             gridLines: {
            //                 z: 1,
            //                 lineWidth: gridLineWidths,
            //                 color: gridLineColors,
            //                 zeroLineColor: gridLineColors[0],
            //                 drawTicks: false,
            //             },
            //         },
                },
            },
            // tooltips: {
            //     enabled: false,
            // },
            aspectRatio: 5,

        },

    });


    /*
     * With lastThreshold set to 0 only at initialization, the gauge can
     * only increase. However, starting at 0 for each call will always
     * repeat the last threshold announcement.
     */
    let lastThreshold = 0;
    function updateGauge(amount: number) {
        myChart.data.datasets[0].data[0] = amount;
        myChart.update();

        const nearestDollarTotal = Math.floor(amount);
        if (nearestDollarTotal >= lastThreshold + CONFIG.INTERVAL_CONFETTI) {
            // reached a new threshold, determine highest threshold amount
            do {
                lastThreshold += CONFIG.INTERVAL_CONFETTI;
            } while (
                lastThreshold + CONFIG.INTERVAL_CONFETTI <=
                nearestDollarTotal
            );

            launchConfetti(lastThreshold);
        }
    }

    document.querySelectorAll('.preload').forEach((el) => {
        el.classList.remove('preload');
    });
});
