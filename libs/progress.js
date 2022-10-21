// @todo: get this fjle to work as TS
import { Circle } from 'progressbar.js';
import { ConfettiShower, EAnimationState } from '/libs/confetti/ConfettiShower';
import { Tiltify } from '/libs/tiltify/tiltify.ts';
import { CONFIG } from "/libs/config.js";
// import airHornFile from '/dj-air-horn-sound-effect.mp3';

const confetti = new ConfettiShower("confetti");

const RE_DIMENSION_NUMBER = /^\s*(\d+)\D*$/;


document.addEventListener('DOMContentLoaded', () => {
  // confettiLoop();
  initIndicator();
  fetchDonations();
});

const COLOR_RED = getComputedStyle(document.body).getPropertyValue('--color-gng-red');

const canvasSize = getComputedStyle(document.getElementById('indicator')).width.replace(RE_DIMENSION_NUMBER, '$1');
const canvasCenter = Math.round(canvasSize / 2);

/**
 * We want the confetti to disappear at the progressbar's "trail" line
 * (which is really a leading line, but ¯\_ (ツ)_/¯). Because the SVG is
 * added to the DOM after the canvas, it will appear above the confetti.
 * This means the wider, "completed" stroke will also obscure the confetti
 * as it moves around.
 *
 * We know progressbar's stroke width is a percentage of the canvas size.
 * Find the rendered width of the wider ring and subtract half of that (its
 * center) from the canvasCenter (radius) to get a radius for the trail ring.
 *
 * It's possible this could be off a little due to the trail ring's width,
 * but the trail ring should still appear above the confetti and obscure it.
 * 
 * todo: update these onresize
 */
const STROKE_WIDTH = 10;
const ringWidth = Math.round(canvasSize * (STROKE_WIDTH / 100));
const clipRadius = canvasCenter - ringWidth / 2;

// create a circular clip path for the confetti to disappear outside the ring
confetti.context.beginPath();
confetti.context.ellipse(canvasCenter, canvasCenter, clipRadius, clipRadius, 0, 0, 2 * Math.PI);
confetti.context.clip();
confetti.context.save();

function confettiLoop () {
  confetti.context.restore();

  confetti.startAnimation().subscribe(
    () => {
      /* fires for every emitted state */
    },
    (error) => {
      console.error(
        `confettiLoop error`,
        error
      );
    },
    () => {
      confettiLoop();
    }
  );
}

let indicator;
function initIndicator () {
  const container = document.getElementById('indicator');

  indicator = new Circle(container, {
    color: COLOR_RED, // line and text, unless overridden
    strokeWidth: 10,
    trailWidth: .75,
    duration: 500, // ms
    svgStyle: null,
  });

  indicator.setText('');

  // specify individual properties so as to not cancel defaults
  indicator.text.style.color = '#333';
}

function fetchDonations () {
  Tiltify.getCurrentDonationsTotal().then(
    (response) => {
      updateProgress(response);
    }
  );
}

let lastThreshold = 0;
function updateProgress ({ current, goal }) {
  const goalPercent = current / goal;
  indicator.animate(goalPercent);
  indicator.setText(Math.ceil(goalPercent * 100) + '%');

  if (current >= lastThreshold + CONFIG.INTERVAL_CONFETTI) {
    // reached a new threshold, determine highest threshold amount
    do {
      lastThreshold += CONFIG.INTERVAL_CONFETTI;
    } while (
      lastThreshold + CONFIG.INTERVAL_CONFETTI <= current
    );

    confetti.startAnimation();
  }

  // function launchConfetti (milestone: number): void {
  //   confetti
  //     .startAnimation()
  //     .pipe(
  //       tap((state) => {
  //         switch (state) {
  //           case EAnimationState.STARTED:
  //             // N.B.: assumes CONFIG.INTERVAL_AIR_HORN is a multiple of CONFIG.INTERVAL_CONFETTI (and thus milestone)
  //             if (
  //               milestone % CONFIG.INTERVAL_AIR_HORN === 0 ||
  //               // If the goal/max is off-interval, fire when hitting it or just going over
  //               (milestone >= CONFIG.GOAL &&
  //                 milestone <
  //                 CONFIG.GOAL + CONFIG.INTERVAL_AIR_HORN)
  //             ) {
  //               airHorn.play().catch(() => {
  //                 console.info(
  //                   "Unable to play audio until user interacts with page."
  //                 );
  //               });
  //             }

  //             text.classList.add("show");
  //             break;
  //           case EAnimationState.ENDED:
  //             /*
  //              * If the milestone is the goal/max, leave it displayed
  //              * because it also receives continuous confetti.
  //              *
  //              * N.B.: The milestone may exceed CONFIG.GOAL, but
  //              *       will not be displayed in the graphic.
  //              */
  //             if (milestone < CONFIG.GOAL) {
  //               text.classList.remove("show");
  //             }
  //             break;
  //         }
  //       })
  //     )
  //     .subscribe(
  //       () => {
  //         /* fires for every emitted state */
  //       },
  //       (error) => {
  //         console.error('error', error);
  //       },
  //       () => {
  //         if (
  //           CONFIG.CONTINUOUS_CONFETTI_AT_GOAL &&
  //           milestone >= CONFIG.GOAL
  //         ) {
  //           text.classList.add("show"); // just in case
  //           confettiLoop();
  //         }
  //       }
  //     );
  // }


  // if (
  //   current % CONFIG.INTERVAL_AIR_HORN === 0 ||
  //   // If the goal/max is off-interval, fire when hitting it or just going over
  //   (current >= CONFIG.GOAL && current < CONFIG.GOAL + CONFIG.INTERVAL_AIR_HORN)
  // ) {
  //   airHorn.play().catch(() => {
  //     console.info(
  //       "Unable to play audio until user interacts with page."
  //     );
  //   });
  // }
}
