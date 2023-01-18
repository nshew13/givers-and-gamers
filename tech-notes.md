- [Tech notes](#tech-notes)
  - [Dev server](#dev-server)
- [Dev references](#dev-references)
- [To-do](#to-do)
- [Tools Used](#tools-used)
- [Things that didn't work](#things-that-didnt-work)
  - [Animating the SVG drips with keyframes](#animating-the-svg-drips-with-keyframes)

# Tech notes
Originally, this project used Eleventy and Nunjucks in combination with Vite.

[Eleventy](https://www.11ty.dev/docs/) (or 11ty) is a static site generator,
which uses one or more independent template engines. For this, I chose
[Nunjucks](https://mozilla.github.io/nunjucks/templating.html). Together, these
allow me to, for example, reuse a common header or common block of imports
across multiple, otherwise-static "HTML" files. [Vite](https://vitejs.dev/) is
front-end tooling with some very smart URL and path rewriting.

While I really enjoyed all three, they didn't fit together well. I
couldn't find a reliable, automated way to make the two-step process into one.
In practical terms, I had a stubborn `src` directory (the temporary location for
the Eleventy output to be picked up by Vite) in my output that I hated.

After several attempts, I abandoned these three for [Astro](https://astro.build/),
which, so far, has covered all of my use cases. As bonuses, it feels more
cohesive and the syntax is more React- and JSX-like. The true magic is that it
has worked with ***ZERO*** configuration on my part. Just compare this
document before and after I merged in the port to Astro.

## Dev server
URLs will be of the form `http://localhost:3000/`.

# Dev references
a.k.a., Today I Learned...
 * [Building The SSG I’ve Always Wanted: An 11ty, Vite And JAM Sandwich](https://www.smashingmagazine.com/2021/10/building-ssg-11ty-vite-jam-sandwich/)
 * [Vanilla JavaScript and HTML - No frameworks. No libraries. No problem.](https://johnpapa.net/render-html-2/)
 * [RxJS: Understanding the publish and share Operators](https://ncjamieson.com/understanding-publish-and-share/)
 * [Pausable Observables in RxJS](https://kddsky.medium.com/pauseable-observables-in-rxjs-58ce2b8c7dfd)
 * [How to mock an imported Typescript class with Jest](https://dev.to/codedivoire/   how-to-mock-an-imported-typescript-class-with-jest-2g7j)
 * [Marble testing in React](https://medium.com/swlh/marble-testing-in-react-ba0639441afa) (account required)
 * a user must interact with a page to "authorize" autoplay audio [SO](https://stackoverflow.com/a/57632961/356016) [MDN](https://developer.mozilla.org/en-US/docs/Web/Media/Autoplay_guide)
 * [Eleventy Walk Through](https://rphunt.github.io/eleventy-walkthrough/)
 * [custom date filter for Nunjucks](https://eszter.space/11ty-njk-filters/)
 * [Eleventy Plus Vite](https://matthiasott.com/notes/eleventy-plus-vite) by Matthias Ott, 10 July 2022

# To-do
* Define a loose Prettier config
* Exclude config.json file from bundling for easier swapping
* Why does `about.<hash>.css` get included in other pages? And is it "about" because it's alphabetically first?

# Tools Used

[softr.io](https://www.softr.io/tools/svg-wave-generator) used to generate the `clip-path` for the main background.

# Things that didn't work

## Animating the SVG drips with keyframes
I attempted to control how the drips receded, but browser support was non-existent.
```
.shrink {
    .drips {
        transition: inherit;
        animation: 15s dripsShrink reverse;
        height: 0;
    }
}

@keyframes dripsShrink {
    25% {
        clip-path: path("M0,0l18.5,-1.56c18.4,-1.56 55.5,-4.69 92.5,-1.56c36.7,3.12 74,12.5 111,4.69c36.5,-7.81 73,-32.81 110,-37.5c37.2,-4.69 74,10.94 111,12.5c37,1.56 74,-10.94 111,-15.62c36.8,-4.69 74,-1.56 111,6.25c36.5,7.81 73,20.31 110,18.75c37.3,-1.56 74,-17.19 111,-12.5c37.1,4.69 74,29.69 111,32.81c36.8,3.12 74,-15.62 111,-25c36.6,-9.37 74,-9.37 110,-10.94c37.4,-1.56 74,-4.69 111,1.56c37.2,6.25 74,21.87 111,20.31c36.9,-1.56 74,-20.31 111,-23.44c36.7,-3.12 74,9.37 111,14.06c36.5,4.69 73,1.56 110,-4.69c37.2,-6.25 74,-15.62 111,-20.31c37,-4.69 74,-4.69 111,3.12c36.8,7.81 74,23.44 111,31.25c36.5,7.81 73,7.81 110,6.25c37.3,-1.56 74,-4.69 111,-14.06c37.1,-9.37 74,-25 111,-26.56c36.8,-1.56 74,10.94 111,21.87c36.6,10.94 74,20.31 92,25l18.5,4.69l0,-75l-18.5,0c-18.5,0 -55,0 -92,0c-37.2,0 -74,0 -111,0c-37,0 -74,0 -111,0c-36.8,0 -74,0 -111,0c-36.5,0 -73,0 -110,0c-37.3,0 -74,0 -111,0c-37.1,0 -74,0 -111,0c-36.8,0 -74,0 -111,0c-36.6,0 -74,0 -110,0c-37.4,0 -74,0 -111,0c-37.2,0 -74,0 -111,0c-36.9,0 -74,0 -111,0c-36.7,0 -74,0 -111,0c-36.5,0 -73,0 -110,0c-37.2,0 -74,0 -111,0c-37,0 -74,0 -111,0c-36.8,0 -74,0 -111,0c-36.5,0 -73,0 -110,0c-37.3,0 -74,0 -111,0c-37.1,0 -74,0 -111,0c-36.8,0 -74,0 -111,0c-36.6,0 -74,0 -110,0c-37.4,0 -74,0 -111,0c-37.2,0 -74,0 -93,0l-18,0l0,65.62z");
    }

    50% {
        clip-path: path("M0,0l18.5,-0.52c18.4,-0.52 55.5,-1.56 92.5,-0.52c36.7,1.04 74,4.17 111,1.56c36.5,-2.6 73,-10.94 110,-12.5c37.2,-1.56 74,3.65 111,4.17c37,0.52 74,-3.65 111,-5.21c36.8,-1.56 74,-0.52 111,2.08c36.5,2.6 73,6.77 110,6.25c37.3,-0.52 74,-5.73 111,-4.17c37.1,1.56 74,9.9 111,10.94c36.8,1.04 74,-5.21 111,-8.33c36.6,-3.12 74,-3.12 110,-3.65c37.4,-0.52 74,-1.56 111,0.52c37.2,2.08 74,7.29 111,6.77c36.9,-0.52 74,-6.77 111,-7.81c36.7,-1.04 74,3.12 111,4.69c36.5,1.56 73,0.52 110,-1.56c37.2,-2.08 74,-5.21 111,-6.77c37,-1.56 74,-1.56 111,1.04c36.8,2.6 74,7.81 111,10.42c36.5,2.6 73,2.6 110,2.08c37.3,-0.52 74,-1.56 111,-4.69c37.1,-3.12 74,-8.33 111,-8.85c36.8,-0.52 74,3.65 111,7.29c36.6,3.65 74,6.77 92,8.33l18.5,1.56l0,-25l-18.5,0c-18.5,0 -55,0 -92,0c-37.2,0 -74,0 -111,0c-37,0 -74,0 -111,0c-36.8,0 -74,0 -111,0c-36.5,0 -73,0 -110,0c-37.3,0 -74,0 -111,0c-37.1,0 -74,0 -111,0c-36.8,0 -74,0 -111,0c-36.6,0 -74,0 -110,0c-37.4,0 -74,0 -111,0c-37.2,0 -74,0 -111,0c-36.9,0 -74,0 -111,0c-36.7,0 -74,0 -111,0c-36.5,0 -73,0 -110,0c-37.2,0 -74,0 -111,0c-37,0 -74,0 -111,0c-36.8,0 -74,0 -111,0c-36.5,0 -73,0 -110,0c-37.3,0 -74,0 -111,0c-37.1,0 -74,0 -111,0c-36.8,0 -74,0 -111,0c-36.6,0 -74,0 -110,0c-37.4,0 -74,0 -111,0c-37.2,0 -74,0 -93,0l-18,0l0,21.87z");
    }

    75% {
        clip-path: path("M0,0l18.5,-1.04c18.4,-1.04 55.5,-3.12 92.5,-1.04c36.7,2.08 74,8.33 111,3.12c36.5,-5.21 73,-21.87 110,-25c37.2,-3.12 74,7.29 111,8.33c37,1.04 74,-7.29 111,-10.42c36.8,-3.12 74,-1.04 111,4.17c36.5,5.21 73,13.54 110,12.5c37.3,-1.04 74,-11.46 111,-8.33c37.1,3.12 74,19.79 111,21.87c36.8,2.08 74,-10.42 111,-16.67c36.6,-6.25 74,-6.25 110,-7.29c37.4,-1.04 74,-3.12 111,1.04c37.2,4.17 74,14.58 111,13.54c36.9,-1.04 74,-13.54 111,-15.62c36.7,-2.08 74,6.25 111,9.37c36.5,3.12 73,1.04 110,-3.12c37.2,-4.17 74,-10.42 111,-13.54c37,-3.12 74,-3.12 111,2.08c36.8,5.21 74,15.62 111,20.83c36.5,5.21 73,5.21 110,4.17c37.3,-1.04 74,-3.12 111,-9.37c37.1,-6.25 74,-16.67 111,-17.71c36.8,-1.04 74,7.29 111,14.58c36.6,7.29 74,13.54 92,16.67l18.5,3.12l0,-50l-18.5,0c-18.5,0 -55,0 -92,0c-37.2,0 -74,0 -111,0c-37,0 -74,0 -111,0c-36.8,0 -74,0 -111,0c-36.5,0 -73,0 -110,0c-37.3,0 -74,0 -111,0c-37.1,0 -74,0 -111,0c-36.8,0 -74,0 -111,0c-36.6,0 -74,0 -110,0c-37.4,0 -74,0 -111,0c-37.2,0 -74,0 -111,0c-36.9,0 -74,0 -111,0c-36.7,0 -74,0 -111,0c-36.5,0 -73,0 -110,0c-37.2,0 -74,0 -111,0c-37,0 -74,0 -111,0c-36.8,0 -74,0 -111,0c-36.5,0 -73,0 -110,0c-37.3,0 -74,0 -111,0c-37.1,0 -74,0 -111,0c-36.8,0 -74,0 -111,0c-36.6,0 -74,0 -110,0c-37.4,0 -74,0 -111,0c-37.2,0 -74,0 -93,0l-18,0l0,43.75z");
    }

    100% {
        clip-path: path("M0,0l18.5,-2.08c18.4,-2.08 55.5,-6.25 92.5,-2.08c36.7,4.17 74,16.67 111,6.25c36.5,-10.42 73,-43.75 110,-50c37.2,-6.25 74,14.58 111,16.67c37,2.08 74,-14.58 111,-20.83c36.8,-6.25 74,-2.08 111,8.33c36.5,10.42 73,27.08 110,25c37.3,-2.08 74,-22.92 111,-16.67c37.1,6.25 74,39.58 111,43.75c36.8,4.17 74,-20.83 111,-33.33c36.6,-12.5 74,-12.5 110,-14.58c37.4,-2.08 74,-6.25 111,2.08c37.2,8.33 74,29.17 111,27.08c36.9,-2.08 74,-27.08 111,-31.25c36.7,-4.17 74,12.5 111,18.75c36.5,6.25 73,2.08 110,-6.25c37.2,-8.33 74,-20.83 111,-27.08c37,-6.25 74,-6.25 111,4.17c36.8,10.42 74,31.25 111,41.67c36.5,10.42 73,10.42 110,8.33c37.3,-2.08 74,-6.25 111,-18.75c37.1,-12.5 74,-33.33 111,-35.42c36.8,-2.08 74,14.58 111,29.17c36.6,14.58 74,27.08 92,33.33l18.5,6.25l0,-100l-18.5,0c-18.5,0 -55,0 -92,0c-37.2,0 -74,0 -111,0c-37,0 -74,0 -111,0c-36.8,0 -74,0 -111,0c-36.5,0 -73,0 -110,0c-37.3,0 -74,0 -111,0c-37.1,0 -74,0 -111,0c-36.8,0 -74,0 -111,0c-36.6,0 -74,0 -110,0c-37.4,0 -74,0 -111,0c-37.2,0 -74,0 -111,0c-36.9,0 -74,0 -111,0c-36.7,0 -74,0 -111,0c-36.5,0 -73,0 -110,0c-37.2,0 -74,0 -111,0c-37,0 -74,0 -111,0c-36.8,0 -74,0 -111,0c-36.5,0 -73,0 -110,0c-37.3,0 -74,0 -111,0c-37.1,0 -74,0 -111,0c-36.8,0 -74,0 -111,0c-36.6,0 -74,0 -110,0c-37.4,0 -74,0 -111,0c-37.2,0 -74,0 -93,0l-18,0l0,87.5z");
    }
}
```
