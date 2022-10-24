const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone'); // dependent on utc plugin

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * custom date filter for Nunjucks
 *
 * based on https://eszter.space/11ty-njk-filters/
 *
 * N.B. Changes to these functions (e.g., to add logging) only appear
 *      in console output after restarting Eleventy.
 */
module.exports = {
    dateFilter: (date, format = 'YYYY-MM-DD') => {
        const dateObj = dayjs.tz(date, 'America/Kentucky/Louisville');
        return dateObj.format(format);
    }
}
