# Givers & Gamers Technomancy

- [Prerequisites](#prerequisites)
- [Use](#use)
  - [Serve for local development](#serve-for-local-development)
  - [Generate markup for use with Streamlabs](#generate-markup-for-use-with-streamlabs)
- [Tools used](#tools-used)
  - [Client code](#client-code)
  - [Log server (work in progress)](#log-server-work-in-progress)
  - [Database](#database)
  - [Testing (TO DO)](#testing-to-do)
- [Dev references](#dev-references)

## Prerequisites
* [Node](https://nodejs.org/en/download/) v12 LTS or later

## Use
All commands are expected to be run from the project root directory
(`givers-and-gamers/`), unless otherwise noted.

Install dependencies
```shell
npm i
```

Prompt for the Qgiv API token then initialize the code to use it.
```shell
npm run ./src/init
```

### Serve for local development
To launch an auto-reloading local server hosting a page that contains both the
donor badges and goal thermometer, run
```shell
npm start
```

### Generate markup for use with Streamlabs
When you are ready to produce static pages for use, run
```shell
npm run build
```

Output is available in `dist`.
 * [`dist/donors.html`](./dist/donors.html)
 * [`dist/thermometer.html`](./dist/thermometer.html)


## Tools used
### Client code
Code is written in TypeScript and transpiled using tsc via Webpack.

### Log server (work in progress)
Because the client widgets are intended to run in Streamlabs's own "browser",
we won't have access to a `console` for monitoring and logging.

To maintain watch on the long-lived widgets, we have servers using
[Socket.IO](https://www.npmjs.com/package/socket.io) for Node.js, kept alive
by [nodemon](https://github.com/remy/nodemon#nodemon)*. The socket
solution *should* allow us to push messages to the socket-server middle-man,
which, in turn, pushes them to an observation application.

*`nodemon` clears the `dist` folder when executing.

### Database
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
 * [How to mock an imported Typescript class with Jest](https://dev.to/codedivoire/how-to-mock-an-imported-typescript-class-with-jest-2g7j)
 * [Marble testing in React](https://medium.com/swlh/marble-testing-in-react-ba0639441afa) (account required)
