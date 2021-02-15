import { ConfettiShower } from './ConfettiShower';

import './confetti.scss';

console.log('loading confetti.ts');

document.addEventListener('DOMContentLoaded', () => {
    const confetti = new ConfettiShower('confetti');
    const text = document.querySelector('.confetti-text');


    text.classList.add('show');
    confetti.startAnimation();
    text.classList.remove('show');
});
