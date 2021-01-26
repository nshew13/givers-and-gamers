// distance between bottom of header and top of content
const _RESIZE_THRESHOLD_HEADER = 250;
// const _RESIZE_THRESHOLD_SCHED_HEAD = 125;

document.addEventListener('DOMContentLoaded', () => {
    const scopeClassList = document.getElementById("scope-header").classList;
    // const schedHeadClassList = document.getElementById("schedule-header").classList;
    window.onscroll = () => resizeHeader();

    function resizeHeader () {
        const val = document.documentElement.scrollTop || document.body.scrollTop;

        console.log('scroll', val);
        if (val > _RESIZE_THRESHOLD_HEADER) {
            scopeClassList.add("pinned");

            // if (val > _RESIZE_THRESHOLD_SCHED_HEAD) {
            //     schedHeadClassList.add("pinned");
            // } else {
            //     schedHeadClassList.remove("pinned");
            // }
        } else {
            scopeClassList.remove("pinned");
            // schedHeadClassList.remove("pinned");
        }
    }
});


// TODO: countdown timer, then...
// TODO: auto-scroll to current time
