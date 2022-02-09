import path from 'path';
import { defineConfig } from 'vite';

// TODO: set base using env dev/prod (https://stackoverflow.com/a/69041080/356016)

// vite.config.js
export default defineConfig({
    // base: '/static/gg/',
    // root: path.resolve(__dirname, 'src'),
    // publicDir: path.resolve(__dirname, 'public'),
    // https://stackoverflow.com/a/70523299/356016
    // The build inputs only affect the build target, not the local server.
    build: {
        rollupOptions: {
            input: {
                golf: path.resolve(__dirname, 'elements/golf/index.html'),
                schedule: path.resolve(__dirname, 'elements/schedule/index.html'),
                leaderboard: path.resolve(__dirname, 'elements/leaderboard/index.html'),
                progress: path.resolve(__dirname, 'elements/progress/index.html'),
                placeholder: 'index.html',
            },
        },
    },
});
