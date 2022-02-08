import path from "path";

// vite.config.js
export default {
    base: '/static/gg/',
    publicDir: path.resolve(__dirname, 'public'),
    build: {
        /**
         * dist may not exist, so we can't include it in the
         * arguments to resolve().
         */
        outDir: path.resolve(__dirname) + path.sep + 'dist',
        /**
         * Because these run sequentially, we can't empty directory
         * or else we'll end up with only the last build.
         * Set false, explicitly, to disable the warning about
         * being outside root.
         */
        emptyOutDir: false,
    },
}
