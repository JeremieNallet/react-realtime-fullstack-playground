import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

export const timeFromNow = (data) => {
    if (!data) {
        return;
    }
    dayjs.extend(relativeTime);
    return dayjs(data).fromNow();
};
