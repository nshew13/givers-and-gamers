import CONFIG from "^config/config.json";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone"; // dependent on utc plugin

dayjs.extend(utc);
dayjs.extend(timezone);

export type EventName = keyof typeof CONFIG.events;

export class EventWindow {
    private _eventName: EventName = 'StreamingWeekend';

    private readonly _DATE_START_DAYJS: Dayjs;
    public get DATE_START_DAYJS(): Dayjs {
        return this._DATE_START_DAYJS /* .clone() */;
    }

    private readonly _DATE_END_DAYJS: Dayjs;
    public get DATE_END_DAYJS(): Dayjs {
        return this._DATE_END_DAYJS /* .clone() */;
    }

    // @ts-ignore
    private _nowDayjs: Dayjs;
    public get nowDayjs(): Dayjs {
        this._checkTime();
        return this._nowDayjs /* .clone() */;
    }

    public get hasStarted(): boolean {
        this._checkTime();

        // consider it started on the day, not the hour
        return this._nowDayjs.isAfter(
            this._DATE_START_DAYJS.startOf("day")
        );
    }

    public get hasEnded(): boolean {
        this._checkTime();

        // consider it ended after the last day is over
        return this._nowDayjs.isAfter(
            this._DATE_END_DAYJS.endOf("day")
        );
    }

    public get timezone(): string {
        return CONFIG.events?.[this._eventName].timezone;
    }

    private _debugDay = Number.isInteger(CONFIG?._dev?.simulate_day)
        ? CONFIG._dev.simulate_day
        : 0;

    private _checkTime() {
        this._nowDayjs = dayjs().tz(CONFIG.events?.[this._eventName].timezone);

        // Allow debug mode to run as day X of the chosen event.
        if (this._debugDay) {
            this._nowDayjs = this._DATE_START_DAYJS
                .endOf("day")
                .add(this._debugDay - 1, "day");
        }
    }

    public get dayOfEvent(): number {
        this._checkTime();

        if (!this.hasStarted) {
            return -Infinity;
        }

        if (this.hasEnded) {
            return Infinity;
        }

        return (
            this._nowDayjs
                .startOf("day")
                .diff(this._DATE_START_DAYJS.startOf("day"), "day") + 1
        );
    }

    public currentlyStreaming(): boolean {
        // todo: add Twitch API
        return false;
    }

    public constructor(eventName: EventName) {
        this._eventName = eventName;

        this._DATE_START_DAYJS = dayjs(
            CONFIG.events?.[this._eventName].start
        ).tz(CONFIG.events?.[this._eventName].timezone);

        this._DATE_END_DAYJS = dayjs(
            CONFIG.events?.[this._eventName].end
        ).tz(CONFIG.events?.[this._eventName].timezone);
    }
}
