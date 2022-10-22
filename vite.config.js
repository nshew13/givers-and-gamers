import glob from 'glob';
import path from 'path';
import { fileURLToPath } from 'url';
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vite';

// TODO: set base using env dev/prod (https://stackoverflow.com/a/69041080/356016)

// TODO: find a way to share this value
const DIR_INTERMEDIATE = 'src';

// based on https://rollupjs.org/guide/en/#input
const allHtmlEntires = glob.sync(`${DIR_INTERMEDIATE}/**/*.html`).map(file =>
    fileURLToPath(new URL(file, import.meta.url))
);
allHtmlEntires.push(path.resolve(__dirname, 'index.html'));


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
            input: allHtmlEntires,
        },
    },
});
