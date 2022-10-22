# Tech notes

- [This Frankenstein monster](#this-frankenstein-monster)
  - [Eleventy and Nunjucks](#eleventy-and-nunjucks)
  - [Vite](#vite)
    - [Dev server](#dev-server)
    - [See also](#see-also)
    - [TypeScript `import`s](#typescript-imports)
- [Templating](#templating)
  - [What's the difference?](#whats-the-difference)
- [Running Eleventy with Vite](#running-eleventy-with-vite)
  - [Package version](#package-version)
- [Dev references](#dev-references)
- [To-do](#to-do)

## This Frankenstein monster
I'm using two sets of not-quite-compatible technologies in a two-step build process.

### Eleventy and Nunjucks
[Eleventy](https://www.11ty.dev/docs/) (or 11ty) is a static site generator,
which uses one or more independent template engines. For this, I chose
[Nunjucks](https://mozilla.github.io/nunjucks/templating.html). Together, these
allow me to, for example, reuse a common header or common block of imports
across multiple, otherwise-static "HTML" files.

Eleventy processes the Nunjucks templates (`.njk` files) from `templates/` and outputs
the resulting HTML to `src/`. Nunjuck `include` and `extend` paths are relative
to `templates/_includes`. As specified in the [config file](./.eleventy.js),
`css`, `html`, `js`, `scss` and `ts` files are copied along.

That's where Vite takes over.
### Vite
Vite allows me to smartly serve pages from `src` on a local development server,
with static assets from `public` made available at the server root (`/`). When
it's time to build the pages for production use, it rewrites paths and
URLs to be server-ready.

The `src/` path ***is necessary*** in both the local server and the built output.

All "client code" URLs are based on Vite's `root`, with `base` appended, if
specified. These include image assets (as `src` or `url()`), script `src` and
page links. Vite rewrites these, as necessary, in the output for `dist`.
*By default `/public` becomes `/`, and Vite prefers you use the shorter notation.*

By default, Vite restricts the site's root `index.html` to be located in the
directory configured as `root`. There is a [workaround](https://github.com/vitejs/vite/issues/3354#issuecomment-842331283)
using a custom plugin.

#### Dev server
URLs will be of the form `http://localhost:3000/src/`. When specifying only
the directory (and implying `index.html`), you *must* include the trailing
slash.
#### See also
  * [What is the difference between "vite" and "vite preview"?](https://stackoverflow.com/q/71703933)

#### TypeScript `import`s
TypeScript `import`s work, but VS Code complains about `ts(2307)`. The imports
ultimately work and `tsc` gives no errors.

**TODO:** I have configured VSC to use the project's `tsc`. I may need a type
definition file. Otherwise, I'll have to do more digging to fix this annoyance.

## Templating
We generate our build in two steps. First, Eleventy takes the Nunjucks files and
generates the HTML. These are output to the `src` directory. Additional HTML,
JavaScript, TypeScript and Sass files are brought along.

Vite takes over from there to import files and adjust URL paths. Output is to
`dist`.

### What's the difference?
My best guess is that Nunjucks, alone, gives us runtime templating. Incorporating
Eleventy into the build takes the Nunjucks templates and generates static markup.

## Running Eleventy with Vite
The `&` "run in parallel" operator for npm scripts _does not work_ on Windows.
`npm-run-all` provides a cross-platform solution in its shorthand runners
for running in sequence (`run-s`) and parallel (`run-p`).

Using these tools (as well as `del-cli` and `delete-empty`), we can easily
script running Eleventy and Vite together. The solution is based on
[this article](https://snugug.com/musings/eleventy-plus-vite/) by Sam Richard,
a.k.a., Snugug.

### Package version
When adding these tools, my package version of `"2022"` started throwing
```
ERROR: Invalid version: "2022"
```
Even `"2.2"` didn't work. I just removed `version` from the package definition.

**TODO:** Figure out how to get this to work.

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
* Convert to ESModules consistently by adding `"type": "module"` to `package.json`. Currently, this is hindered by Eleventy, which uses CommonJS modules internally and doesn't recognize the `.cjs` extension for its config file. The fix seems bound for Eleventy v2.
* Improve Vite config so that `src` can serve as root and, therefore, not
    be necessary in the served URL.
    * Maybe https://www.11ty.dev/docs/server-vite/
    * See also https://www.11ty.dev/docs/data-template-dir/
    * Alternative: [Astro](https://astro.build/)
    * The problem is that I need the root to be `root` so I can do things
      like `/libs` or `/(public)`. I either need better mapping of inputs to
      outputs or something that will allow me to move files _cross-platform_
      from `dist/src/*` to `dist`.
    * This limitation also currently means that the root index.html can't
      take advantage of Eleventy (and Nunjucks), because it ends up under `src` and,
      consequently, `dist/src`.
* Set Vite's `base` using dev/prod environment configuration from files
    (see https://stackoverflow.com/a/69041080/356016 and https://vitejs.dev/guide/env-and-mode.html)
* Replace `spacetime` with something better documented.
* Add progress bar to home page.
* convert config file to TOML when there's a good parser

# Tools Used

[softr.io](https://www.softr.io/tools/svg-wave-generator) used to generate the `clip-path` for the main background.
