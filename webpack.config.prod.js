const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      // index.html already includes <script src="js/app.js">; injecting it again loads the app twice
      inject: false,
    }),
    new CopyPlugin({
      patterns: [
        { from: 'img', to: 'img' },
        { from: 'css', to: 'css' },
        { from: 'js/vendor', to: 'js/vendor' },
        { from: 'icon.svg', to: 'icon.svg' },
        { from: 'favicon.ico', to: 'favicon.ico' },
        { from: 'robots.txt', to: 'robots.txt' },
        { from: 'icon.png', to: 'icon.png' },
        { from: 'pwa-icon.svg', to: 'pwa-icon.svg' },
        { from: 'service-worker.js', to: 'service-worker.js' },
        { from: '404.html', to: '404.html' },
        { from: 'site.webmanifest', to: 'site.webmanifest' },
        { from: 'js/property-cards.js', to: 'js/property-cards.js' },
        { from: 'js/property-detail.js', to: 'js/property-detail.js' },
        { from: 'property', to: 'property' },
        { from: 'buying', to: 'buying' },
        { from: 'renting', to: 'renting' },
        { from: 'selling', to: 'selling' },
        { from: 'business', to: 'business' },
        { from: 'about', to: 'about' },
        { from: 'university', to: 'university' },
        { from: 'apps', to: 'apps' },
      ],
    }),
  ],
});
