type ScheduleDateTime = string;

export type ScheduleEvent = {
    datetime: ScheduleDateTime;
    title: string;
    desc: string;
    howto?: string;
    all_weekend?: boolean;
    highlight?: boolean;
    Twitch?: boolean;
};
