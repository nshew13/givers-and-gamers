const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'development',
    context: path.resolve(__dirname, 'src'),
    entry: {
        donors: 'donors/donors.ts',
        thermometer: 'thermometer/thermometer.ts',
    },
    plugins: [
        new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
        // Produce multiple HTML outputs.
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            chunks: [],
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
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
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
         */
        chunkLoading: false,
        wasmLoading: false,
    },
    devtool: 'source-map',
    devServer: {
        contentBase: './dist',
        publicPath: '/',
        open: true,
        /*
         * Only this page will autorefresh, so change as necessary.
         */
        openPage: 'donors.html'
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
