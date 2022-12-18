import type { ScheduleEvent } from "^types/index";

export const sortCompareDateTime = (a: ScheduleEvent, b: ScheduleEvent) => {
    if (a.datetime_start < b.datetime_start) {
        return -1;
    } else if (a.datetime_start > b.datetime_start) {
        return 1;
    }
    return 0;
};
