var path = require('path');

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
    devServer: {
        contentBase: path.join(__dirname, './'),
        compress: false,
        port: 8080,
    }
}