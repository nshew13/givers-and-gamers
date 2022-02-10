const spacetime = require('spacetime');

const toDate = require('date-fns/toDate');
const isFuture = require('date-fns/isFuture');

const TZ_EVENT = 'America/Kentucky/Louisville';

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

function scrollToEvent () {
    const nowIdString = spacetime.now(TZ_EVENT).format('{year}{iso-month}{date-pad}{hour-24-pad}{minute-pad}');
    const eventEls = document.getElementsByClassName('event');

    let scrollToId = '';
    for (let i = 0; i < eventEls.length; i++) {
        scrollToId = eventEls[i].id;
        if (scrollToId >= nowIdString) {
            break;
        }
    }

    document.getElementById(scrollToId).scrollIntoView();
}

const DATE_START = new Date(Date.UTC(2021, 1, 19, 24, 0, 0));
const DATE_END   = new Date(Date.UTC(2021, 1, 21, 23, 0, 0));

document.addEventListener('DOMContentLoaded', () => {
    const counter = document.getElementById('countdown');

    if (counter && isFuture(DATE_START)) {
        setInterval(() => {
            counter.textContent = counterDown(DATE_START);
        }, 1000);
    }

    if (!isFuture(DATE_START)) {
        scrollToEvent();

        if (spacetime.now(TZ_EVENT).isBetween(DATE_START, DATE_END, true)) {
            setInterval(() => {
                scrollToEvent();
            }, 60*1000);
        }
    }
});

