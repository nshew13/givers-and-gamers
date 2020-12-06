const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode:    'development',
    context: path.resolve(__dirname, 'src'),
    entry: {
        thermometer: 'thermometer/thermometer.ts',
    },
    plugins: [
        new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
        // new HtmlWebpackPlugin({
        //     title: 'Givers & Gamers DEV',
        //     template: 'index.html',
        // }),
        // Produce multiple HTML outputs.
        new HtmlWebpackPlugin({
            filename: 'thermometer.html',
            template: 'thermometer/thermometer.html',
            chunks: [ 'thermometer' ]
          }),
        //   new HtmlWebpackPlugin({
        //     filename: 'example.html',
        //     template: 'src/example.html',
        //     chunks: ['exampleEntry']
        //   })
    ],
    output:  {
        path:     path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    devtool: 'source-map',
    devServer: {
        contentBase: './dist',
    },
    resolve: {
        // for imports with no extension, resolve in this order
        extensions: ['.ts', '.js'],
        modules: [ path.resolve(__dirname, 'src'), 'node_modules' ]
    },
    module:  {
        rules: [
            {
                test:    /\.ts$/,
                exclude: /node_modules/,
                use:     {
                    loader:  'ts-loader',
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
