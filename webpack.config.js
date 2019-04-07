const path = require('path');

const sourceFolder = path.resolve(__dirname, '_js')
const assetFolder = path.resolve(__dirname, 'assets')

module.exports = {
  entry: {
    landing_page: path.join(sourceFolder, 'landing_page.js'),
    nav: path.join(sourceFolder, 'nav'),
    info_page: path.join(sourceFolder, 'info_page'),
    contact_us: path.join(sourceFolder, 'contact_us')
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