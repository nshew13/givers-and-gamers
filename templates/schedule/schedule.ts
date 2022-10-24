import spacetime from 'spacetime';
import type { TimeUnit } from 'spacetime';
// @ts-ignore
import CONFIG from '/libs/config.toml';


const DATE_START_ST = spacetime(CONFIG.countdown.event_start, CONFIG.countdown.event_timezone);
const DATE_END_ST = spacetime(CONFIG.countdown.event_end, CONFIG.countdown.event_timezone);

const COUNTER_PARTS: Array<TimeUnit> = ['day', 'hour', 'minute', 'second'];


function counterDown (targetDate) {
    const result: Array<string> = [];
    let targetST = spacetime(targetDate, CONFIG.countdown.event_timezone);
    const nowST = spacetime.now(CONFIG.countdown.event_timezone);


    COUNTER_PARTS.forEach((timeUnit: TimeUnit) => {
        /**
         * Determine the difference in the given unit. Start
         * with the largest unit.
         */
        const diffVal = nowST.diff(targetST, timeUnit);
        result.push(diffVal.toString() + timeUnit.substring(0, 1));

        /**
         * Now reduce the target by the unit used. Otherwise,
         * it will be included in the smaller units. For example,
         * subtract 2 days so hours is 3 not 51.
         */
        targetST = targetST.subtract(diffVal, timeUnit);
    })

    return result.join(' ');
}

function scrollToEvent () {
    if (CONFIG.schedule.scroll_to_now) {
        const nowId = parseInt(
            spacetime.now(CONFIG.countdown.event_timezone).format('{year}{iso-month}{date-pad}{hour-24-pad}{minute-pad}'),
            10
        );

        const eventEls = document.getElementsByClassName('event');

        for (let i = 0; i < eventEls.length; i++) {
            if (parseInt(eventEls[i].id, 10) <= nowId) {
                console.log('scrolling', eventEls[i], 'into view');

                (document.getElementById(eventEls[i].id) as HTMLDivElement).scrollIntoView();
                // } else {
                //     break;
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const counter = document.getElementById('countdown');
    const nowST = spacetime.now(CONFIG.countdown.event_timezone);

    if (counter) {
        /**
         * Before the event starts, show a countdown at the top.
         */
        if (nowST.isBefore(DATE_START_ST)) {
            setInterval(() => {
                counter.textContent = counterDown(DATE_START_ST);
            }, 1000);
        } else {
            counter.textContent = '';

            /**
             * After it starts, scroll to the first event and...
             */
            scrollToEvent();

            /**
             * ...tell the page to check every minute for a new
             * event and to scroll to one, if found.
             */
            if (nowST.isBetween(DATE_START_ST, DATE_END_ST, true)) {
                setInterval(() => {
                    scrollToEvent();
                }, 60 * 1000);
            }
        }
    }
});
