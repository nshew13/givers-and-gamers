const _RESIZE_THRESHOLD = 50;

document.addEventListener('DOMContentLoaded', () => {
    const scopeClassList = document.getElementById("scope-header").classList;
    window.onscroll = () => resizeHeader();

    function resizeHeader () {
        if (document.body.scrollTop > _RESIZE_THRESHOLD || document.documentElement.scrollTop > _RESIZE_THRESHOLD) {
            scopeClassList.add("small");
            // scopeClassList.remove("full");
        } else {
            // scopeClassList.add("full");
            scopeClassList.remove("small");
        }
    }
});
