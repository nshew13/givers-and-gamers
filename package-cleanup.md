# packages to sort to sub-repos

## schedule
```
"dependencies": {
  "date-fns": "^2.16.1",
  "spacetime": "^6.12.2"
},
```

## qgiv
```
 "scripts": {
        "build": "webpack --config webpack.config.js",
        "init": "node ./src/init.js",
        "lint": "eslint src --ext .ts",
        "locket": "nodemon ./src/locket/locket-server.ts",
        "start": "webpack-dev-server --open",
        "test": "jest",
        "test:watch": "jest --watch",
        "watch": "webpack --config webpack.config.js --watch"
    },
    "dependencies": {
        "socket.io": "^3.0.4"
    },
    "devDependencies": {
        "@testdeck/jest": "^0.1.2",
        "@types/chart.js": "^2.9.28",
        "@types/jest": "^26.0.19",
        "@typescript-eslint/eslint-plugin": "^4.11.0",
        "@typescript-eslint/parser": "^4.11.0",
        // upgrade to 3
        "chart.js": "^2.9.4", 
        "clean-webpack-plugin": "^4.0.0",
        "css-loader": "^6.5.1",
        "date-fns": "^2.16.1",
        "eslint": "^7.16.0",
        "file-loader": "^6.2.0",
        "html-loader": "^3.1.0",
        "html-webpack-plugin": "^5.5.0",
        "jest": "^26.6.3",
        "node-sass": "^7.0.1",
        "nodemon": "^2.0.6",
        "rxjs": "^6.6.7",
        "sass": "^1.49.0",
        "sass-loader": "^12.4.0",
        "socket.io-client": "^3.0.4",
        "style-loader": "^3.3.1",
        "ts-jest": "^26.4.4",
        "ts-loader": "^9.2.6",
        "ts-node": "^9.1.1",
        "typescript": "^4.5.4",
        "webpack": "^5.66.0",
        "webpack-cli": "^4.9.1",
        "webpack-dev-server": "^4.7.3"
    }
```