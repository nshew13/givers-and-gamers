export {}

const SHRINK_HEADER_AT_SCROLL_POS = 10;

document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('scroll', () => {
        if (window.scrollY > SHRINK_HEADER_AT_SCROLL_POS) {
            document.getElementsByTagName('header')[0].classList.add('shrink');
        } else {
            document.getElementsByTagName('header')[0].classList.remove('shrink');
        }
    });
});
