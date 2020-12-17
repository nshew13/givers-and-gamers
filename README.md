# Givers & Gamers DEV

## Prerequisites
* [Node](https://nodejs.org/en/download/) v10 LTS or later

## Use
Install dependencies
```shell
npm i
```

Prompt for the Qgiv API token then initialize the code to use it.
```shell
npm run init
```

### Serve for local development
```shell
npm start
```

### Generate markup for use with Streamlabs
```shell
npm run build
```

Output is available in `dist`.
 * [`dist/donors.html`](./dist/donors.html)
 * [`dist/thermometer.html`](./dist/thermometer.html)


## Tools used
### Testing
Testing uses jest, with testdeck and ts-jest providing support for TypeScript.
Where needed, tests use Rxjs's TestScheduler for reactive testing.

### Dev resources (TIL)
 * [Vanilla JavaScript and HTML - No frameworks. No libraries. No problem.](https://johnpapa.net/render-html-2/)
 * [How to mock an imported Typescript class with Jest](https://dev.to/codedivoire/how-to-mock-an-imported-typescript-class-with-jest-2g7j)
