# givers-and-gamers

- [Prerequisites](#prerequisites)
- [Use](#use)
  - [Install dependencies](#install-dependencies)
  - [Run local dev server](#run-local-dev-server)
  - [Generate production code](#generate-production-code)
- [Under the hood](#under-the-hood)

## Prerequisites
* [Node](https://nodejs.org/en/download/) v16 LTS or later


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

**TODO:** Figure out how to launch servers for all workspaces.

### Generate production code
When you have your code ready to go live, run the following command
```shell
npm run build
```

This project is configured with the expectation that files will live under
`/static/gg/`. If that changes, the `base` setting in the Vite config
file must be updated.


## Under the hood

*Vite* used as a builder because of
[an issue](https://github.com/parcel-bundler/parcel/issues/7574) in Parcel
2.2.1.

File viewing requires a local server, because static file opening creates
XSRF issues with `script type="module"` (regardless of builder).