# givers-and-gamers-golf-invitational

- [Prerequisites](#prerequisites)
- [Attribution](#attribution)
- [Use](#use)
  - [Install dependencies](#install-dependencies)
  - [Run local dev server](#run-local-dev-server)
- [Under the hood](#under-the-hood)

## Prerequisites
* [Node](https://nodejs.org/en/download/) v16 LTS or later


## Attribution
<a href="https://www.flaticon.com/free-icons/golf" title="golf icons">Golf icons created by Talha Dogar - Flaticon</a>

## Use
All commands are expected to be run from the project root directory
(this directory), unless otherwise noted.

### Install dependencies
```shell
npm i
```

### Run local dev server
```shell
npm start
```
Browse to http://localhost:3000/ to see the app.

## Under the hood

*Vite* used as a builder because of
[an issue](https://github.com/parcel-bundler/parcel/issues/7574) in Parcel
2.2.1.

File viewing requires a local server, because static file opening creates
XSRF issues with `script type="module"` (regardless of builder).