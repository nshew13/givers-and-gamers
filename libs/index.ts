export {}

document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            document.getElementsByTagName('header')[0].classList.add('shrink');
        } else {
            document.getElementsByTagName('header')[0].classList.remove('shrink');
        }
    });
});
