const path = require('path');
const webpack = require('webpack');

const sourceFolder = path.resolve(__dirname, '_js');
const assetFolder = path.resolve(__dirname, 'assets');

module.exports = {
  entry: {
    landing_page: path.join(sourceFolder, 'landing_page.js'),
    nav: path.join(sourceFolder, 'nav'),
    info_page: path.join(sourceFolder, 'info_page'),
    article_page: path.join(sourceFolder, 'article_page'),
    contact_us: path.join(sourceFolder, 'contact_us'),
    join_us: path.join(sourceFolder, 'join_us')
  },
  output: {
    path: path.join(assetFolder, 'js')
  },
  mode: 'production',
  optimization: {
    usedExports: true,
    splitChunks: {
      chunks: 'all'
    }
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
