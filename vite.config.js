import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vite';
const { eleventyPlugin } = require('vite-plugin-eleventy');

// TODO: set base using env dev/prod (https://stackoverflow.com/a/69041080/356016)

const PATH_ELEVENTY_OUTPUT = path.resolve(__dirname, '_site');

// vite.config.js
export default defineConfig({
    plugins: [
        eleventyPlugin(),
        tsconfigPaths(),
    ],
    // base: '/static/gg/',
    // root: path.resolve(__dirname),
    // publicDir: path.resolve(__dirname, 'public'),
    // https://stackoverflow.com/a/70523299/356016
    // The build inputs only affect the build target, not the local server.
    build: {
        rollupOptions: {
            input: {
                golf: path.resolve(PATH_ELEVENTY_OUTPUT, 'golf/index.html'),
                schedule: path.resolve(PATH_ELEVENTY_OUTPUT, 'schedule/index.njk'),
                leaderboard: path.resolve(PATH_ELEVENTY_OUTPUT, 'leaderboard/index.html'),
                progress: path.resolve(PATH_ELEVENTY_OUTPUT, 'progress/index.html'),
                placeholder: path.resolve(__dirname, 'index.html'),
            },
        },
    },
});
