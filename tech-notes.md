# Tech notes

- [The path less taken](#the-path-less-taken)
- [Templating](#templating)
- [Running together](#running-together)
- [Dev references](#dev-references)
- [To-do](#to-do)
## The path less taken
There are three main path references.
1. Eleventy and Nunjucks shortcode (e.g., `{% extends ... %}`) happen before
   Vite. Their import paths are relative to Eleventy's `dir.input`.
1. All "client code" URLs are based on Vite's `root`, with `base` appended.
   These include image assets (as `src` or `url()`) and page links.
1. TypeScript imports --FIX--

## Templating
Nunjucks, alone, gives us runtime templating (I guess). Incorporating Eleventy
into the build takes the Nunjucks templates and generates static markup.

We generate our build in two steps. First, Eleventy takes the Nunjucks files and
generates the HTML. These are output to the `src` directory. Additional HTML,
JavaScript, TypeScript and Sass files are brought along.

Vite takes over from there to import files and adjust URL paths. Output is to
`dist`.

## Running together
The `&` "run in parallel" token for npm scripts _does not_ work on Windows.

tools used to run Eleventy and Vite together
```
npm i -D npm-run-all del-cli delete-empty
```
see https://snugug.com/musings/eleventy-plus-vite/

A package version of `"2022"`, and even `"2.2"`, is incompatible with `npm-run-all`.

## Dev references
a.k.a., Today I Learned...
 * [Building The SSG I’ve Always Wanted: An 11ty, Vite And JAM Sandwich](https://www.smashingmagazine.com/2021/10/building-ssg-11ty-vite-jam-sandwich/)
 * [Vanilla JavaScript and HTML - No frameworks. No libraries. No problem.](https://johnpapa.net/render-html-2/)
 * [RxJS: Understanding the publish and share Operators](https://ncjamieson.com/understanding-publish-and-share/)
 * [Pausable Observables in RxJS](https://kddsky.medium.com/pauseable-observables-in-rxjs-58ce2b8c7dfd)
 * [How to mock an imported Typescript class with Jest](https://dev.to/codedivoire/how-to-mock-an-imported-typescript-class-with-jest-2g7j)
 * [Marble testing in React](https://medium.com/swlh/marble-testing-in-react-ba0639441afa) (account required)
 * a user must interact with a page to "authorize" autoplay audio [SO](https://stackoverflow.com/a/57632961/356016) [MDN](https://developer.mozilla.org/en-US/docs/Web/Media/Autoplay_guide)

## To-do

* Improve Vite config so that `elements` can serve as root and, therefore, not
    be necessary in the served URL.
* Set Vite's `base` using dev/prod environment configuration from files
    (see https://stackoverflow.com/a/69041080/356016 and https://vitejs.dev/guide/env-and-mode.html)
* Fix types in `libs/qgiv/qgiv.ts` and remove from tsconfig's `exclude`.
* Replace `spacetime` with something better documented.
* License "[Tin Pan Alley JNL](https://www.fontspring.com/fonts/jeff-levine/tin-pan-alley-jnl)" font or find suitable, free replacement
   * [Google options](https://fonts.google.com/share?selection.family=Bebas%20Neue%7CBungee%7CCairo:wght@400;700;900%7CCinzel:wght@800%7CDo%20Hyeon%7CLuckiest%20Guy%7COrbitron:wght@400;700;900%7CPress%20Start%202P%7CRighteous%7CRowdies:wght@300;400;700%7CStaatliches%7CTeko:wght@400;700)
* Add progress bar to home page.
