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
Browse to http://localhost:5173/ to see the app.

When browsing to different elements, use the same path as the project repo. For
example, http://localhost:5173/src/golf/

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
