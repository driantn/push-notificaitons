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
        filename: "[name].bundle.js"
    },
    resolve: {
        extensions: ['.ts', '.js'] //resolve all the modules other than index.ts
    },
    module: {
        rules: [
            {
                use: 'ts-loader',
                test: /\.ts?$/
            }
        ]
    },
}