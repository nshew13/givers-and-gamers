const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'development',
    context: path.resolve(__dirname, 'src'),
    entry: {
        demo: 'index.ts',
        donors: 'donors/donors.ts',
        monitor: 'locket/monitor.ts',
        thermometer: 'thermometer/thermometer.ts',
    },
    plugins: [
        new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
        // Produce multiple HTML outputs.
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            chunks: [ 'demo', 'donors', 'thermometer' ],
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
        new HtmlWebpackPlugin({
            filename: 'monitor.html',
            template: 'locket/monitor.html',
            chunks: ['monitor']
        }),
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
        contentBase: './dist',
        open: true,
        openPage: 'index.html'
    },
    resolve: {
        // for imports with no extension, resolve in this order
        extensions: ['.ts', '.js'],
        modules: [path.resolve(__dirname, 'src'), 'node_modules']
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
        ]
    },
    externals: {
        // exclude Moment.js from Chart.js bundling
        // https://www.chartjs.org/docs/latest/getting-started/integration.html#bundlers-webpack-rollup-etc
        moment: 'moment'
    }
};
