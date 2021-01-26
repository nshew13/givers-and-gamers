const toDate = require('date-fns/toDate');

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

const TARGET_DATE = new Date('2021-02-19T19:00');

document.addEventListener('DOMContentLoaded', () => {
    const counter = document.getElementById('countdown');

    if (counter) {
        setInterval(() => {
            counter.textContent = counterDown(TARGET_DATE);
        }, 1000);
    }
});


