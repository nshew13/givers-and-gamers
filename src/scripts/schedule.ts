import CONFIG from '^config/config.json';
import dayjs from 'dayjs';
import type { ManipulateType } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone'; // dependent on utc plugin
import { EventWindow } from './EventWindow';

dayjs.extend(utc);
dayjs.extend(timezone);

enum EToggleState {
  OPEN,
  CLOSED,
}

const TOGGLE_KEY = 'toggleEveryDay';

const COUNTER_PARTS: ManipulateType[] = [
  'day',
  'hour',
  'minute',
  'second',
];
const RE_DAY_NUMBER = /^.*(\d+)$/;

// TODO: make flexible for any Event
const eventStreamingWeekend = new EventWindow('StreamingWeekend');

function countDown (): string {
  const result: string[] = [];
  let targetDayjs = eventStreamingWeekend.DATE_START_DAYJS.clone();

  COUNTER_PARTS.forEach((timeUnit: ManipulateType) => {
    /**
     * Determine the difference in the given unit. Start
     * with the largest unit.
     */
    const diffVal = targetDayjs.diff(eventStreamingWeekend.nowDayjs, timeUnit);
    result.push(diffVal.toString() + timeUnit.substring(0, 1));

    /**
     * Now reduce the target by the unit used. Otherwise,
     * it will be included in the smaller units. For example,
     * subtract 2 days so hours is 3 not 51.
     */
    targetDayjs = targetDayjs.subtract(diffVal, timeUnit);
  });

  return result.join(' ');
}

function scrollToEvent (): void {
  // format is the same as event template's date filter
  const nowId = parseInt(
    dayjs().tz(eventStreamingWeekend.timezone).format('YYYYMMDDHHmm'),
    10,
  );

  const eventEls = document.getElementsByClassName('event');

  for (let i = 0; i < eventEls.length; i++) {
    if (parseInt(eventEls[i]?.id ?? '', 10) <= nowId) {
      console.log('scrolling', eventEls[i], 'into view');
      (document.getElementById(eventEls[i]?.id ?? '') as HTMLDivElement).scrollIntoView();
    }
  }
}

function showDay (dayNumber: number): void {
  const schedules = Array.from(document.getElementsByClassName('schedule'));
  schedules.forEach((schedule: Element) => {
    if (
      schedule?.id?.substring(0, 3) === 'day' && // skip unlabeled, like "Every Day"
      schedule.id !== `day${dayNumber}`
    ) {
      schedule.classList.add('inactive');
    } else {
      schedule.classList.remove('inactive');
    }
  });
}

let accordion: HTMLElement | null;
let toggle: HTMLElement | null;
let toggleIsOpen: boolean;
function setEveryDayToggle (
  toggleToState: EToggleState = toggleIsOpen ? EToggleState.CLOSED : EToggleState.OPEN,
): void {
  if ((accordion != null) && (toggle != null)) {
    switch (toggleToState) {
      case EToggleState.CLOSED:
        accordion.style.height = '0';
        toggle.classList.replace('fa-solid', 'fa-regular');
        toggle.classList.add('fa-rotate-180');
        toggleIsOpen = false;
        break;

      case EToggleState.OPEN:
        toggle.classList.replace('fa-regular', 'fa-solid');
        toggle.classList.remove('fa-rotate-180');
        accordion.style.height = '';
        toggleIsOpen = true;
        break;
    }

    window.localStorage.setItem(TOGGLE_KEY, toggleIsOpen.toString());
  }
}

function bindNavEvents (): void {
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

    nav.addEventListener('click', () => {
      showDay(targetNumber);
    });
  });

  const toggle = document.getElementById('toggleEveryDay');
  if (toggle != null) {
    toggle.addEventListener('click', () => {
      setEveryDayToggle();
    });
    toggle.parentElement?.classList.add('enabled');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  accordion = document.getElementById('accordionEveryDay');
  toggle = document.getElementById('toggleEveryDay');

  // initialize toggle from localStorage
  const storedToggle = window.localStorage.getItem(TOGGLE_KEY);
  toggleIsOpen = storedToggle !== null ? storedToggle === 'true' : true;
  setEveryDayToggle(toggleIsOpen ? EToggleState.OPEN : EToggleState.CLOSED);

  /**
   * Once the event has started...
   */
  if (eventStreamingWeekend.hasStarted && !eventStreamingWeekend.hasEnded) {
    // ... Remove the countdown.
    document.getElementById('countdown')?.remove();

    // ... Determine what day of the event this is and show only that schedule...
    const dayOfEvent = eventStreamingWeekend.nowDayjs
      .startOf('day')
      .diff(eventStreamingWeekend.DATE_START_DAYJS.startOf('day'), 'day') + 1;
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

    if (counter != null) {
      setInterval(() => {
        if (eventStreamingWeekend.hasStarted) {
          // todo: remove need to refresh
          window.location.reload();
        }

        counter.textContent = countDown();
      }, 1000);
    }
  }
});
