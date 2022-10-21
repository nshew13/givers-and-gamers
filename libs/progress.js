import { Circle } from 'progressbar.js';
import { ConfettiShower, EAnimationState } from '/libs/confetti/ConfettiShower';
// import airHornFile from '/dj-air-horn-sound-effect.mp3';

const confetti = new ConfettiShower("confetti");

const RE_DIMENSION_NUMBER = /^\s*(\d+)\D*$/;


document.addEventListener('DOMContentLoaded', () => {
  confettiLoop();
  circleAroundLogo();
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
      console.log('restarting loop');
      confettiLoop();
    }
  );
}

function circleAroundLogo () {
  const container = document.getElementById('indicator');

  var circle = new Circle(container, {
    color: COLOR_RED, // line and text, unless overridden
    strokeWidth: 10,
    trailWidth: .75,
    duration: 2000,
    svgStyle: null,

    step: function (state, circle) {
      // TODO: add confetti at major intervals

      var value = Math.round(circle.value() * 100);
      if (value === 0) {
        circle.setText('');
      } else {
        circle.setText(`${value}%`);
      }

      /*
            if (value >= 100) {
              confettiLoop();
            }
            */

    }
  });

  // specify individual properties so as to not cancel defaults
  circle.text.style.color = '#333';

  circle.animate(.5);
}
