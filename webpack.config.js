const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'development',
    context: path.resolve(__dirname, 'src'),
    entry: {
        index: 'index.ts',
        donors: 'donors/donors.ts',
        // transceiver: 'locket/transceiver.ts',
        thermometer: 'thermometer/thermometer.ts',
    },
    plugins: [
        new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
        // Produce multiple HTML outputs.
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            chunks: ['donors', /* 'confetti', */ 'thermometer', 'index'],
        }),
        new HtmlWebpackPlugin({
            filename: 'donors.html',
            template: 'donors/donors.html',
            chunks: ['donors']
        }),
        new HtmlWebpackPlugin({
            filename: 'thermometer.html',
            template: 'thermometer/thermometer.html',
            chunks: ['thermometer']
        }),
        // new HtmlWebpackPlugin({
        //     filename: 'transceiver.html',
        //     template: 'locket/transceiver.html',
        //     chunks: ['transceiver']
        // }),
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
        /**
         * With a browserlist that includes both browser and Node options,
         * Webpack will infer a target of ["web", "node"], resulting in a
         * Universal Chunk Loading error.
         *
         * Override the default behaviors for chunkLoading and wasmLoading
         * until Webpack's implementation is complete.
         *
         * https://github.com/webpack/webpack/issues/11660
         *
         * EXCEPT, it then breaks auto-reload. It's easier to remove
         * package.json's browserlist unless needed.
         */
        // chunkLoading: false, // breaks auto-reload
        // wasmLoading: false,
    },
    /*
     * The following setting is necessary to share common modules (e.g., Qgiv)
     * between bundles when loaded on the same page.
     *
     * see https://stackoverflow.com/q/51405103/356016
     */
    optimization: {
        runtimeChunk: 'single'
    },
    devtool: 'source-map',
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist'),
        },
        open: {
            target: 'index.html',
        },
    },
    resolve: {
        // for imports with no extension, resolve in this order
        extensions: ['.ts', '.js'],
        modules: [path.resolve(__dirname, 'src'), 'node_modules'],
        // // polyfill Node modules
        // // see https://sanchit3b.medium.com/how-to-polyfill-node-core-modules-in-webpack-5-905c1f5504a0
        // alias: {
        //     os: 'os-browserify/browser',
        // },
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true
                    }
                }
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [
                    'style-loader', // creates style nodes from JS strings
                    'css-loader',   // translates CSS into CommonJS
                    'sass-loader'   // compiles Sass to CSS, using Node Sass by default
                ]
            },
            {
                //
                // WARNING: Once the assets are loaded with a page into a
                //          browser, Webpack will be unable to remove it
                //          to rebuild. All instances must first be closed.
                //
                test: /\.(png|mp3)$/,
                exclude: /node_modules/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                },
            },
        ]
    },
    externals: {
        // exclude Moment.js from Chart.js bundling
        // https://www.chartjs.org/docs/latest/getting-started/integration.html#bundlers-webpack-rollup-etc
        moment: 'moment'
    }
};
