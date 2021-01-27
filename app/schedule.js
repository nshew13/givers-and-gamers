const spacetime = require('spacetime');


const toDate = require('date-fns/toDate');
const isFuture = require('date-fns/isFuture');

const diffMethod = {
    year:   require('date-fns/differenceInYears'),
    month:  require('date-fns/differenceInMonths'),
    day:    require('date-fns/differenceInDays'),
    hour:   require('date-fns/differenceInHours'),
    minute: require('date-fns/differenceInMinutes'),
    second: require('date-fns/differenceInSeconds'),
};
const subMethod = {
    year:   require('date-fns/subYears'),
    month:  require('date-fns/subMonths'),
    day:    require('date-fns/subDays'),
    hour:   require('date-fns/subHours'),
    minute: require('date-fns/subMinutes'),
    second: require('date-fns/subSeconds'),
};


const TZ_EVENT   = 'America/Kentucky/Louisville';

// https://stackoverflow.com/a/56162705/356016
// function humanizeFutureToNow (futureDate) {
//     let result = [];
//     let now = new Date();
//     let parts = ['year', 'month', 'day', 'hour', 'minute', 'second'];

//     parts.forEach((timeUnit, i) => {
//         // execute the appropriate differenceIn* method
//         let diffVal = diffMethod[timeUnit](futureDate, now);

//         if (diffVal) {
//             result.push(`${i===parts.length-1 ? 'and ' : ''}${diffVal} ${timeUnit}${diffVal===1 ? '' : 's'}`);
//             if (i < parts.length) {
//                 // subtract the diffVal from end date to set up next calculation
//                 futureDate = subMethod[timeUnit](futureDate, diffVal);
//             }
//         }
//     })

//     return result.join(' ');
// }

function counterDown (targetDate) {
    let result = [];
    let now = new Date();
    let parts = [/* 'year', 'month', */ 'day', 'hour', 'minute', 'second'];

    parts.forEach((timeUnit, i) => {
        // execute the appropriate differenceIn* method
        let diffVal = diffMethod[timeUnit](targetDate, now);

        // if (diffVal) {
            result.push(diffVal.toString().padStart(2, '0'));
            // if (i < parts.length) {
                targetDate = subMethod[timeUnit](targetDate, diffVal);
            // }
        // }
    })

    return result.join(':');
}


function removePastEvents () {
    const nowIdString = spacetime.now(TZ_EVENT).format('{year}{iso-month}{date-pad}{hour-24-pad}{minute-pad}');
    const eventEls = document.getElementsByClassName('event');

    for (let i = eventEls.length - 1; i >= 0; i--) {
        if (eventEls[i].id && eventEls[i].id < nowIdString) {
            const eventsNode = eventEls[i].parentNode;
            eventsNode.removeChild(eventEls[i]);

            // check if .events is now empty...
            if (eventsNode.children.length === 0) {
                const scheduleNode = eventsNode.parentNode;
                // ... remove it...
                scheduleNode.removeChild(eventsNode);

                // ... and remove the .schedule
                if (scheduleNode.children.length === 1) {
                    scheduleNode.parentNode.removeChild(scheduleNode);
                }
            }
        }
    }
}

const DATE_START = new Date(Date.UTC(2021, 1, 19, 24, 00, 00));
const DATE_END   = new Date(Date.UTC(2021, 1, 21, 23, 00, 00));
const FORMAT_ID  = 'yyyyMMddHHmm';
// const DATE_START = new spacetime('2021-02-19T19:00', TZ_EVENT);
// const DATE_START = new spacetime('2020-01-19T19:00', TZ_EVENT);
// const DATE_END   = new spacetime('2021-02-21T18:00', TZ_EVENT);

document.addEventListener('DOMContentLoaded', () => {
    const counter = document.getElementById('countdown');

    if (counter && isFuture(DATE_START)) {
        setInterval(() => {
            counter.textContent = counterDown(DATE_START);
        }, 1000);
    }

    removePastEvents();

    /**
     * Until the event is over, check each minute to see if an event
     * has ended, then remove it from the schedule.
     */
    if (spacetime.now(TZ_EVENT).isBetween(DATE_START, DATE_END, true)) {
        setInterval(() => {
            removePastEvents();
        }, 60*1000);
    }
});

