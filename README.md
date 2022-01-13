# Givers & Gamers Markup

- [Prerequisites](#prerequisites)
- [Use](#use)
  - [Build files while editing](#build-files-while-editing)
  - [Output completed files](#output-completed-files)

## Prerequisites
* [Node](https://nodejs.org/en/download/) v16 LTS or later

## Use
All commands are expected to be run from the project root directory
(`givers-and-gamers/`), unless otherwise noted.

Install dependencies
```shell
npm i
```

### Build files while editing
To build the output files and watch them for changes, run
```shell
npm start
```
Files are output to `public`, and can be loaded into your browser for viewing.

### Output completed files
To generate a clean build of all files, run
```shell
npm run build
```
Files are output to `public`.
