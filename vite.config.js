import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vite';

// TODO: set base using env dev/prod (https://stackoverflow.com/a/69041080/356016)

// TODO: find a way to share this config
const DIR_INTERMEDIATE = path.resolve(__dirname, 'src');

// vite.config.js
export default defineConfig({
    plugins: [
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
                golf: path.resolve(DIR_INTERMEDIATE, 'golf/index.html'),
                schedule: path.resolve(DIR_INTERMEDIATE, 'schedule/index.html'),
                leaderboard: path.resolve(DIR_INTERMEDIATE, 'leaderboard/index.html'),
                progress: path.resolve(DIR_INTERMEDIATE, 'progress/index.html'),
                placeholder: path.resolve(__dirname, 'index.html'),
            },
        },
    },
});
