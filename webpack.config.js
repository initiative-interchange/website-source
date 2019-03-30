const path = require('path');

const assetFolder = path.resolve(__dirname, 'assets')

module.exports = {
  entry: {
    landing_page: './_js/landing_page.js'
  },
  output: {
    path: path.join(assetFolder, 'js')
  },
  mode: 'development'
};