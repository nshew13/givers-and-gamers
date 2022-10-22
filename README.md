# Givers & Gamers

- [Prerequisites](#prerequisites)
- [Use](#use)
  - [Install dependencies](#install-dependencies)
  - [Setup API token](#setup-api-token)
  - [Run local dev server](#run-local-dev-server)
    - [LFMF](#lfmf)
  - [Generate production code](#generate-production-code)
- [Caveats](#caveats)
  - [Autoplay](#autoplay)
  - [Clear OBS browser localStorage](#clear-obs-browser-localstorage)
- [Attribution](#attribution)
  - [Air horn](#air-horn)

## Prerequisites
* [Node](https://nodejs.org/en/download/) v16 LTS or later

## Use
All commands are expected to be run from the project root directory
(this directory), unless otherwise noted.

### Install dependencies
```shell
npm i
```

### Setup API token
Prompt for the API token then initialize the code to use it.
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
npm run build
```

Output is available in `dist`.

## Caveats
### Autoplay
You must interact with the page before it will allow audio to play. This
can be as simple as clicking anywhere within the document.

### Clear OBS browser localStorage
If you must clear `localStorage` when using the generated HTML in
OBS/Streamlabs's built-in browser, you'll have to do so manually. The
`localStorage` for Streamlabs is located at
```
%AppData%\Roaming\slobs-client\plugin_config\obs-browser\Local Storage\leveldb\000003.log # or similar text file
```
Close Streamlabs and delete the file.

## Attribution

### Air horn
air horn mp3 from [orangefreesounds.com](https://orangefreesounds.com/dj-air-horn-sound-effect/)
