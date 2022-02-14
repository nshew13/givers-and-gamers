import spacetime from 'spacetime';

const TZ_EVENT = 'America/Kentucky/Louisville';
const DATE_START_ST = spacetime('2022-02-18 00:01', TZ_EVENT);
const TODAY_ST = spacetime.now(TZ_EVENT);

document.addEventListener('DOMContentLoaded', () => {
    const wordleLinks = Array.from(document.getElementsByClassName('wordle'));

    if (wordleLinks) {
        wordleLinks.forEach((element, index) => {
            if (TODAY_ST.isAfter(DATE_START_ST.add(index, 'day'))) {
                element.style.display = 'inline';
            }
        });
    }
});

