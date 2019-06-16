const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
    entry: {
        index: './src/index.ts',
        sw: './src/sw.ts'
    },
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: "[name]-bundle.js"
    },
    resolve: {
        extensions: ['.ts',  '.js'] //resolve all the modules other than index.ts
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /(node_modules)/
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html'
        }),
        new CopyWebpackPlugin([
            { from: './images', to: 'images' },
        ])
    ],
    optimization: {
        minimizer: [
            new UglifyJsPlugin(),
        ],
    },
    devServer: {
        contentBase: path.join(__dirname, './'),
        compress: false,
        host: '0.0.0.0',
        port: 8080,
    }
}