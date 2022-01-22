# Givers & Gamers Technomancy

- [Prerequisites](#prerequisites)
- [Use](#use)
  - [Serve for local development](#serve-for-local-development)
  - [Autoplay](#autoplay)
  - [With OBS/Streamlabs](#with-obsstreamlabs)
    - [Generate markup for "browser source"](#generate-markup-for-browser-source)
      - [Clear OBS browser localStorage](#clear-obs-browser-localstorage)
- [Tools used](#tools-used)
  - [Client code](#client-code)
  - [Log server (work in progress)](#log-server-work-in-progress)
  - [Central server (TO DO)](#central-server-to-do)
  - [Testing (TO DO)](#testing-to-do)
- [Dev references](#dev-references)

## Prerequisites
* [Node](https://nodejs.org/en/download/) v16 LTS or later

## Use
All commands are expected to be run from the project root directory
(`givers-and-gamers/`), unless otherwise noted.

Install dependencies
```shell
npm i
```

Prompt for the Qgiv API token then initialize the code to use it.
```shell
npm run init
```

### Serve for local development
To launch a local server hosting a page that contains both the
donor badges and goal thermometer, run
```shell
npm start
```

This page auto-reloads when the source files change. It also provides
some buttons to restart or stop the Qgiv data polling.

### Autoplay
You must interact with the page before it will allow audio to play. This
can be as simple as clicking anywhere within the document.

### With OBS/Streamlabs

#### Generate markup for "browser source"
When you are ready to produce static pages for use, run
```shell
npm run build
```

If the airhorn file has been loaded and played in a browser or Streamlabs,
npm/webpack likely won't be able to overwrite the file. Close the browser tab
or Streamlabs and try again.

Output is available in `dist`.
 * `dist/donors.html`
 * `dist/thermometer.html`

##### Clear OBS browser localStorage
If you must clear `localStorage` when using the generated HTML in
OBS/Streamlabs's built-in browser, you'll have to do so manually. The
`localStorage` for Streamlabs is located at
```
%AppData%\Roaming\slobs-client\plugin_config\obs-browser\Local Storage\leveldb\000003.log # or similar text file
```
Close Streamlabs and delete the file.

## Tools used

air horn mp3 from [orangefreesounds.com](https://orangefreesounds.com/dj-air-horn-sound-effect/)
### Client code
Code is written in TypeScript and transpiled using tsc via Webpack.

### Log server (work in progress)
Because the client widgets are intended to run in OBS/Streamlabs's own "browser",
we won't have access to a `console` for monitoring and logging.

To maintain watch on the long-lived widgets, we have a Node.js server using
[Socket.IO](https://www.npmjs.com/package/socket.io), kept alive
by [nodemon](https://github.com/remy/nodemon#nodemon)*. The socket
solution allows us to push messages to the server middle-man, which, in turn,
pushes them to observing applications. Socket.IO was chosen over native
sockets because of the out-of-the-box automatic reconnection functionality.

*`nodemon` clears the `dist` folder when executing.

### Central server (TO DO)
To minimize the requests hitting Qgiv, all browser sources will connect to a
central server. The server will poll Qgiv, and push updates to all listeners.

Node uses Express to make AJAX calls.

For the sake of time and simplicity, I decided not to implement a middle-man
server to be a single source of polling to Qgiv. I think the `Qgiv` library
can safely maintain records in a simple JavaScript object in memory. It is
coded to initialize with a full records pull, so that it will get up-to-date
immediately if it requires (or suffers) a restart.

I did explore options that would prevent me from having to reinvent a
persist-to-file system mechanism.
[LokiJS](https://github.com/techfort/LokiJS#lokijs) is the most out-of-the-box,
Node ecosystem solution. If it were to prove insufficient, there's
[Redis](https://redis.js.org/)[[1](https://stackoverflow.com/a/19489635)]
with a free [Redis Labs](https://redislabs.com/redis-enterprise-cloud/pricing/)
server. This would, among other things, allow us to monitor data from
different networks.

### Testing (TO DO)
Testing uses [jest](https://jestjs.io/docs/en/getting-started), with [testdeck](https://testdeck.org/pages/guide/basics) and ts-jest providing support for TypeScript.
Where needed, tests use Rxjs's [TestScheduler](https://rxjs-dev.firebaseapp.com/guide/testing/marble-testing) for reactive testing.

## Dev references
a.k.a., Today I Learned...
 * [Vanilla JavaScript and HTML - No frameworks. No libraries. No problem.](https://johnpapa.net/render-html-2/)
 * [RxJS: Understanding the publish and share Operators](https://ncjamieson.com/understanding-publish-and-share/)
 * [Pausable Observables in RxJS](https://kddsky.medium.com/pauseable-observables-in-rxjs-58ce2b8c7dfd)
 * [How to mock an imported Typescript class with Jest](https://dev.to/codedivoire/how-to-mock-an-imported-typescript-class-with-jest-2g7j)
 * [Marble testing in React](https://medium.com/swlh/marble-testing-in-react-ba0639441afa) (account required)
 * a user must interact with a page to "authorize" autoplay audio [SO](https://stackoverflow.com/a/57632961/356016) [MDN](https://developer.mozilla.org/en-US/docs/Web/Media/Autoplay_guide)
