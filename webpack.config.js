const path = require('path');

module.exports = {
  entry: {
    landing_page: './_js/landing_page.js'
  },
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'assets/js')
  }
};