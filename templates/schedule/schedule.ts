// @ts-ignore
import CONFIG from '/libs/config.toml';

import dayjs from 'dayjs';
import type { ManipulateType } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone'; // dependent on utc plugin

dayjs.extend(utc);
dayjs.extend(timezone);


const DATE_START_DAYJS = dayjs(CONFIG.event.start).tz(CONFIG.event.timezone);
const HAS_STARTED = dayjs().isAfter(DATE_START_DAYJS, 'minute');
const NOW_DAYJS = dayjs().tz(CONFIG.event.timezone);

const COUNTER_PARTS: Array<ManipulateType> = ['day', 'hour', 'minute', 'second'];
const RE_DAY_NUMBER = /^.*(\d+)$/;


function countDown () {
    const result: Array<string> = [];
    let targetDayjs = DATE_START_DAYJS.clone();
    const nowDayjs = dayjs().tz(CONFIG.event.timezone);

    COUNTER_PARTS.forEach((timeUnit: ManipulateType ) => {
        /**
         * Determine the difference in the given unit. Start
         * with the largest unit.
         */
        const diffVal = targetDayjs.diff(nowDayjs, timeUnit);
        result.push(diffVal.toString() + timeUnit.substring(0, 1));

        /**
         * Now reduce the target by the unit used. Otherwise,
         * it will be included in the smaller units. For example,
         * subtract 2 days so hours is 3 not 51.
         */
        targetDayjs = targetDayjs.subtract(diffVal, timeUnit);
    })

    return result.join(' ');
}

function scrollToEvent () {
    // format is the same as event template's date filter
    const nowId = parseInt(dayjs().tz(CONFIG.event.timezone).format('YYYYMMDDHHmm'), 10);

    const eventEls = document.getElementsByClassName('event');

    for (let i = 0; i < eventEls.length; i++) {
        if (parseInt(eventEls[i].id, 10) <= nowId) {
            console.log('scrolling', eventEls[i], 'into view');

            (document.getElementById(eventEls[i].id) as HTMLDivElement).scrollIntoView();
        }
    }
}

function showDay (dayNumber: number) {
    const schedules = Array.from(document.getElementsByClassName('schedule'));
    schedules.forEach((schedule: Element) => {
        if (schedule?.id?.substring(0,3) === 'day' // skip unlabeled, like "Every Day"
            && schedule.id !== `day${dayNumber}`
        ) {
            schedule.classList.add('inactive');
        } else {
            schedule.classList.remove('inactive');
        }
    });
}

let accordion: HTMLElement | null;
let toggle: HTMLElement | null;
let toggleIsOpen = true;
function toggleEveryDay () {
    if (accordion && toggle) {
        if (toggleIsOpen) {
            accordion.style.height = '0';
            toggle.classList.replace('fa-solid', 'fa-regular');
            toggle.classList.add('fa-rotate-180');
            toggleIsOpen = false;
        } else {
            toggle.classList.replace('fa-regular', 'fa-solid');
            toggle.classList.remove('fa-rotate-180');
            accordion.style.height = '';
            toggleIsOpen = true;
        }
    }
}

function bindNavEvents () {
    const navs = Array.from(document.getElementsByClassName('nav'));

    navs.forEach((nav: Element) => {
        // skip if disabled
        if (nav.classList.contains('disabled')) {
            return;
        }

        // show when not on full schedule
        nav.classList.add('enabled');

        // get the associated day number from the element's ID
        const targetNumber = parseInt(nav.id.replace(RE_DAY_NUMBER, '$1'), 10);

        nav.addEventListener('click', (evt: Event) => {
            showDay(targetNumber);
        });
    });

    const toggle = document.getElementById('toggleEveryDay');
    if (toggle) {
        toggle.addEventListener('click', toggleEveryDay);
        toggle.parentElement?.classList.add('enabled');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    accordion = document.getElementById('accordionEveryDay');
    toggle = document.getElementById('toggleEveryDay');

    /**
     * Once the event has started...
     */
    if (HAS_STARTED) {
        // ... Remove the countdown.
        document.getElementById('countdown')?.remove();

        // ... Determine what day of the event this is and show only that schedule...
        const dayOfEvent = NOW_DAYJS.diff(DATE_START_DAYJS, 'day') + 1;
        showDay(dayOfEvent);
        bindNavEvents();

        if (CONFIG.schedule.scroll_to_now) {
            // ... and scroll to the next event
            scrollToEvent();

            /**
             * ... Tell the page to check every minute for a new
             * event and to scroll to one, if found.
             */
            setInterval(() => {
                scrollToEvent();
            }, 60 * 1000);
        }
    /**
     * Otherwise, show the countdown.
     */
    } else {
        const counter = document.getElementById('countdown');

        if (counter) {
            setInterval(() => {
                counter.textContent = countDown();
            }, 1000);
        }
    }
});
