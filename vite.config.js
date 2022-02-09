import path from 'path';
import { defineConfig } from 'vite';

// TODO: set base using env dev/prod (https://stackoverflow.com/a/69041080/356016)

// vite.config.js
export default defineConfig({
    // base: '/static/gg/',
    // root: path.resolve(__dirname, 'src'),
    // publicDir: path.resolve(__dirname, 'public'),
    // https://stackoverflow.com/a/70523299/356016
    build: {
        rollupOptions: {
            input: {
                golf: path.resolve(__dirname, 'pages/golf/index.html'),
                placeholder: 'index.html',
            },
        },
    },
});
