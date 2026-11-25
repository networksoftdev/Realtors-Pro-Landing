const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    liveReload: false,
    hot: false,
    /*open: true,*/
    allowedHosts: "all",
    static: ['./'],
  },
});
