- [Tech notes](#tech-notes)
  - [Dev server](#dev-server)
- [Dev references](#dev-references)
- [To-do](#to-do)
- [Tools Used](#tools-used)

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
* Configure a loose Prettier config
* Exclude config file from bundling (easier swapping)

# Tools Used

[softr.io](https://www.softr.io/tools/svg-wave-generator) used to generate the `clip-path` for the main background.
