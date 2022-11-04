# Givers & Gamers

- [Givers & Gamers](#givers--gamers)
  - [Prerequisites](#prerequisites)
  - [Use](#use)
    - [Install dependencies](#install-dependencies)
    - [Setup API token](#setup-api-token)
    - [Run local dev server](#run-local-dev-server)
    - [Generate production code](#generate-production-code)
  - [Caveats](#caveats)
    - [Autoplay of audio](#autoplay-of-audio)
    - [Clear OBS browser localStorage](#clear-obs-browser-localstorage)
  - [Attribution](#attribution)
    - [Air horn](#air-horn)
    - [Golf icon](#golf-icon)
    - [Windmill animation](#windmill-animation)
    - [Clouds animation](#clouds-animation)

## Prerequisites
* [Node](https://nodejs.org/en/download/) v18 LTS or later

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
Browse to http://localhost:3000/ to see the app.

### Generate production code
When you have your code ready to go live, run the following command
```shell
npm run build
```

Output is available in `static`.

## Caveats
### Autoplay of audio
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

### Golf icon
<a href="https://www.flaticon.com/free-icons/golf" title="golf icons">Golf icons created by Talha Dogar - Flaticon</a>

### Windmill animation
Copyright (c) 2022 by Lewis Briffa (https://codepen.io/LewisBriffa/pen/QjWROG)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

### Clouds animation
Copyright (c) 2022 by Kevin Jannis (https://codepen.io/kevinjannis/pen/wyFga)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
