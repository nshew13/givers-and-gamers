/**
 * Since there is no JavaScript needed by the animation,
 * this file exists just to pull in the assets.
 */
import './template.scss';
const TemplateSVG = require('./template.svg');

// add SVG object to body
const svgEl = document.createElement('object');
svgEl.setAttribute('type', 'image/svg+xml');
svgEl.innerHTML = TemplateSVG;
document.body.appendChild(svgEl);

// interface ICoords {
//     x: number;
//     y: number;
// }

// window.findArcCoords = function (cx: number, cy: number, r: number, degrees=30): ICoords {
//     const radians = degrees * Math.PI/180;

//     const x = cx + r * Math.cos(radians);
//     const y = cy - r * Math.sin(radians); // origin is upper-left, so subtract

//     return { x, y };
// };
