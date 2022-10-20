import { Circle, Path } from 'progressbar.js';
import { reduceEachLeadingCommentRange } from 'typescript';



document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    circleAroundLogo();
    heartAroundLogo();
  }, 1000);
});

const COLOR_RED = '#da1a00';
const COLOR_GOLD = '#ffc829';

function circleAroundLogo () {
  const container = document.getElementById('container1');

  // progressbar.js@1.0.0 version is used
  // Docs: http://progressbarjs.readthedocs.org/en/1.0.0/

  var bar = new Circle(container, {
    color: COLOR_RED, // line and text, unless overridden
    strokeWidth: 10,
    trailWidth: .75,
    duration: 5000,
    svgStyle: null,

    // from: { color: COLOR_RED/* , width: 1 */ },
    // to: { color: COLOR_GOLD/* , width: 4 */ },
    // Set default step function for all animate calls
    step: function (state, circle) {
      // circle.path.setAttribute('stroke', state.color);
      // circle.path.setAttribute('stroke-width', 4);

      // TODO: add flash at major intervals

      var value = Math.round(circle.value() * 100);
      if (value === 0) {
        circle.setText('');
      } else {
        circle.setText(`${value}%`);
      }

    }
  });

  // specify individual properties so as to not cancel defaults
  bar.text.style.color = '#333';

  bar.animate(1.0);  // Number from 0.0 to 1.0
}

function heartAroundLogo () {
  const path = document.getElementById('heart-path');
  var bar = new Path(path, {
    // easing: 'easeInOut',
    duration: 3000,

  });

  bar.set(0);
  bar.animate(1.0);  // Number from 0.0 to 1.0
}
