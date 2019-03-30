const path = require('path');

const sourceFolder = path.resolve(__dirname, '_js')
const assetFolder = path.resolve(__dirname, 'assets')

module.exports = {
  entry: {
    landing_page: path.join(sourceFolder, 'landing_page.js'),
    nav: path.join(sourceFolder, 'nav')
  },
  output: {
    path: path.join(assetFolder, 'js')
  },
  mode: 'development',
  optimization: {
    usedExports: true,
    // TODO: chunk splitting
  }
}