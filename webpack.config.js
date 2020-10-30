const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const basePath = path.resolve(__dirname);

module.exports = {
    mode:    'development',
    entry: {
        app: basePath + '/src/index.ts',
    },
    plugins: [
        new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
        new HtmlWebpackPlugin({
            title: 'Givers & Gamers DEV',
            template: basePath + '/src/index.html',
        }),
    ],
    output:  {
        path:     basePath + '/dist',
        filename: '[name].bundle.js'
    },
    devtool: 'source-map',
    devServer: {
        contentBase: basePath + '/dist',
    },
    resolve: {
        // for imports with no extension, resolve in this order
        extensions: ['.ts', '.js']
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
//            {
//                test: /\.(png|jpg|gif)$/,
//                exclude: /node_modules/,
//                use: [
//                  'file-loader',
//                ],
//            },
//            // TODO: Get SVGs in the bundle
//            {
//                test: /\.svg$/,
//                exclude: /node_modules/,
//                use: [
//                  'svg-inline-loader',
//                ],
//            },
        ]
    }
};
