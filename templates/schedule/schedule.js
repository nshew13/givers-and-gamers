import spacetime from 'spacetime';

const TZ_EVENT = 'America/Kentucky/Louisville';

const DATE_START_ST = spacetime('2022-02-18 18:30', TZ_EVENT);
const DATE_END_ST = spacetime('2022-02-20 17:00', TZ_EVENT);

const COUNTER_PARTS = ['day', 'hour', 'minute', 'second'];


function counterDown (targetDate) {
    const result = [];
    let targetST = spacetime(targetDate, TZ_EVENT);
    const nowST = spacetime.now(TZ_EVENT);


    COUNTER_PARTS.forEach((timeUnit) => {
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
    const nowId = parseInt(
        spacetime.now(TZ_EVENT).format('{year}{iso-month}{date-pad}{hour-24-pad}{minute-pad}'),
        10
    );

    const eventEls = document.getElementsByClassName('event');

    for (let i = 0; i < eventEls.length; i++) {
        if (parseInt(eventEls[i].id, 10) <= nowId) {
            console.log('scrolling', eventEls[i], 'into view');

            document.getElementById(eventEls[i].id).scrollIntoView();
            // } else {
            //     break;
        }
    }

}

document.addEventListener('DOMContentLoaded', () => {
    const counter = document.getElementById('countdown');
    const nowST = spacetime.now(TZ_EVENT);

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

