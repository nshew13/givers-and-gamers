import CONFIG from "^config/config.json";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone"; // dependent on utc plugin

dayjs.extend(utc);
dayjs.extend(timezone);

export class EventWindow {
    private static readonly _DATE_START_DAYJS: Dayjs = dayjs(
        CONFIG.event.start
    ).tz(CONFIG.event.timezone);
    public static get DATE_START_DAYJS(): Dayjs {
        return EventWindow._DATE_START_DAYJS /* .clone() */;
    }

    private static readonly _DATE_END_DAYJS: Dayjs = dayjs(CONFIG.event.end).tz(
        CONFIG.event.timezone
    );
    public static get DATE_END_DAYJS(): Dayjs {
        return EventWindow._DATE_END_DAYJS /* .clone() */;
    }

    private static _nowDayjs: Dayjs;
    public static get nowDayjs(): Dayjs {
        EventWindow._checkTime();
        return EventWindow._nowDayjs /* .clone() */;
    }

    private static _hasStarted: boolean;
    public static get hasStarted(): boolean {
        EventWindow._checkTime();
        return EventWindow._hasStarted;
    }

    private static _hasEnded: boolean;
    public static get hasEnded(): boolean {
        EventWindow._checkTime();
        return EventWindow._hasEnded;
    }

    private static _debugDay = Number.isInteger(CONFIG?._dev?.simulate_day)
        ? CONFIG._dev.simulate_day
        : 0;

    private static _checkTime() {
        EventWindow._nowDayjs = dayjs().tz(CONFIG.event.timezone);
        if (EventWindow._debugDay) {
            EventWindow._nowDayjs = EventWindow._DATE_START_DAYJS
                .endOf("day")
                .add(EventWindow._debugDay - 1, "day");
        }

        // consider it started on the day, not the hour
        EventWindow._hasStarted = EventWindow._nowDayjs.isAfter(
            EventWindow._DATE_START_DAYJS.startOf("day")
        );

        // consider it ended after the last day is over
        EventWindow._hasEnded = EventWindow._nowDayjs.isAfter(
            EventWindow._DATE_END_DAYJS.endOf("day")
        );
    }

    public static get dayOfEvent(): number {
        EventWindow._checkTime();

        if (!EventWindow._hasStarted) {
            return -Infinity;
        }

        if (EventWindow._hasEnded) {
            return Infinity;
        }

        return (
            EventWindow._nowDayjs
                .startOf("day")
                .diff(EventWindow._DATE_START_DAYJS.startOf("day"), "day") + 1
        );
    }

    public static currentlyStreaming(): boolean {
        // todo: add Twitch API
        return false;
    }
}
