# Givers & Gamers

- [Prerequisites](#prerequisites)
- [Use](#use)
  - [Install dependencies](#install-dependencies)
  - [Setup Qgiv](#setup-qgiv)
  - [Run local dev server](#run-local-dev-server)
    - [LFMF](#lfmf)
  - [Generate production code](#generate-production-code)
  - [Autoplay](#autoplay)
  - [With OBS/Streamlabs](#with-obsstreamlabs)
    - [Generate markup for "browser source"](#generate-markup-for-browser-source)
      - [Clear OBS browser localStorage](#clear-obs-browser-localstorage)
- [Under the hood](#under-the-hood)
  - [Dev references](#dev-references)
- [To-do](#to-do)

## Prerequisites
* [Node](https://nodejs.org/en/download/) v16 LTS or later


## Use
All commands are expected to be run from the project root directory
(this directory), unless otherwise noted.

### Install dependencies
```shell
npm i
```

### Setup Qgiv
Prompt for the Qgiv API token then initialize the code to use it.
```shell
npm run init
```

### Run local dev server
```shell
npm start
```
Browse to http://localhost:3000/ to see the app.

When browsing to different elements, use the same path as the project repo. For
example, http://localhost:3000/elements/golf/

#### LFMF

If not specifying a file, the URL must end in a slash or you'll just see
the root `index.html`.

### Generate production code
When you have your code ready to go live, run the following command
```shell
rm -rf dist && npm run build
```

This project is configured with the expectation that files will live under
`/static/gng-golf/`. If that changes, the `base` setting in the Vite config
file must be updated.

### Autoplay
You must interact with the page before it will allow audio to play. This
can be as simple as clicking anywhere within the document.

### With OBS/Streamlabs

#### Generate markup for "browser source"
When you are ready to produce static elements for use, run
```shell
npm run build
```

If the airhorn file has been loaded and played in a browser or Streamlabs,
npm/webpack likely won't be able to overwrite the file. Close the browser tab
or Streamlabs and try again.

Output is available in `dist`.

##### Clear OBS browser localStorage
If you must clear `localStorage` when using the generated HTML in
OBS/Streamlabs's built-in browser, you'll have to do so manually. The
`localStorage` for Streamlabs is located at
```
%AppData%\Roaming\slobs-client\plugin_config\obs-browser\Local Storage\leveldb\000003.log # or similar text file
```
Close Streamlabs and delete the file.

## Under the hood

This repository uses *Vite* as a builder because Webpack is old, Snowpack
isn't ready for primetime, and there's 
[an issue](https://github.com/parcel-bundler/parcel/issues/7574) in Parcel
2.2.1.

File viewing requires a local server, because static file opening creates
XSRF issues with `script type="module"` (regardless of builder).

### Dev references
a.k.a., Today I Learned...
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
