const HtmlWebPackPlugin = require("html-webpack-plugin");
const WebpackPwaManifest = require('webpack-pwa-manifest');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');

const path = require('path');

const htmlPlugin = new HtmlWebPackPlugin({
  template: "./src/index.html",
  filename: "./index.html"
});

const swPlugin = new ServiceWorkerWebpackPlugin({
  entry: path.join(__dirname, 'src/sw.js'),
});

const manifestPlugin = new WebpackPwaManifest({
  name: 'My Progressive Web App',
  short_name: 'MyPWA',
  description: 'My awesome Progressive Web App!',
  background_color: '#ffffff',
  crossorigin: 'use-credentials',
  icons: [
    {
      src: path.resolve('src/assets/pwa.png'),
      sizes: [96, 128, 192, 256, 384, 512] // multiple sizes
    },
    {
      src: path.resolve('src/assets/pwa.png'),
      size: '1024x1024' // you can also use the specifications pattern
    }
  ]
});

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.join(__dirname, 'dist'),
    filename: "[hash].js"
  },
  plugins: [htmlPlugin, swPlugin, manifestPlugin],
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.s?css$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  devServer: {
    // Display only errors to reduce the amount of output.
    stats: "errors-only",
    host: process.env.HOST,
    port: process.env.PORT,
    open: true,
  },
};