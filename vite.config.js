import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vite';

// TODO: set base using env dev/prod (https://stackoverflow.com/a/69041080/356016)

// TODO: find a way to share this config
const DIR_INTERMEDIATE = path.resolve(__dirname, 'src');

export default defineConfig({
    plugins: [
        tsconfigPaths(),
    ],
    // base: '/static/gg/', // when hosted on WordPress
    // root: path.resolve(__dirname),
    // publicDir: path.resolve(__dirname, 'public'),
    // https://stackoverflow.com/a/70523299/356016

    // N.B.: The build inputs below only affect the "build" target, NOT THE LOCAL SERVER ("start" target).
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
