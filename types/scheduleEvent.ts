type ScheduleDateTime = string;

export type ScheduleEvent = {
    datetime_start: ScheduleDateTime;
    datetime_end?: ScheduleDateTime;
    title: string;
    desc: string;
    howto?: string;
    all_weekend?: boolean;
    highlight?: boolean;
    Twitch?: boolean;
};
