const webpack = require('webpack');
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackMerge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');

const modeConfig = env => require(`./build-utils/webpack.${env.mode}.js`)(env);
const loadPresets = require('./build-utils/loadPresets');

const webcomponentsjs = './node_modules/@webcomponents/webcomponentsjs';

const polyfills = [
  {
    from: resolve(`${webcomponentsjs}/webcomponents-*.{js,map}`),
    to: 'vendor',
    flatten: true
  },
  {
    from: resolve(`${webcomponentsjs}/bundles/*.{js,map}`),
    to: 'vendor/bundles',
    flatten: true
  },
  {
    from: resolve(`${webcomponentsjs}/custom-elements-es5-adapter.js`),
    to: 'vendor',
    flatten: true
  }
];

const assets = [
  {
    from: 'src/libs',
    to: 'libs/'
  },
  {
    from: 'src/img',
    to: 'img/'
  },
  {
    from: 'src/images',
    to: 'images/'
  },
  {
    from: 'src/agents',
    to: 'agents/'
  },
  {
    from: 'src/css',
    to: 'css/'
  },
  {
    from: 'src/dist-popup',
    to: 'dist-popup/'
  },
  'src/manifest.json'
];

const plugins = [
  new CleanWebpackPlugin(['dist']),
  new webpack.ProgressPlugin(),
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: './src/index.html',
    minify: {
      collapseWhitespace: true,
      //  minifyCSS: true,
      minifyJS: true
    }
  }),
  new CopyWebpackPlugin([...polyfills, ...assets], {
    ignore: ['.DS_Store']
  })
];

module.exports = ({ mode, presets }) => {
  return webpackMerge(
    {
      mode,
      externals: {
        '@solid/query-ldflex': {
          root: ['solid', 'data'],
          commonjs: '@solid/query-ldflex', // not used, but needed for config
          commonjs2: '@solid/query-ldflex',  // not used, but needed for config
        },
      },
      entry: {
        "main": './src/index.js',
  "nav-element": './src/views/nav-element.js',



        "store-element": './src/views/store-element.js',
        "info-element": './src/views/info-element.js',
        "login-element": './src/views/login-element.js',
        /*"post-element": './src/views/post-element.js',
        "fab-element": './src/views/fab-element.js',*/
        "profile-cartouche-element": './src/views/profile-cartouche-element.js',
      },
      /*  entry: {
      "app-view": './src/views/app-view.js',
      "login-element": './src/views/login-element.js',
      "store-element": './src/views/store-element.js',
      "info-element": './src/views/info-element.js',
      "post-element": './src/views/post-element.js',
      "flux-element": './src/views/flux-element.js',
      "friends-view": './src/views/friends-view.js',
      "friend-view": './src/views/friend-view.js',
      "notification-line-element": './src/views/notification-line-element.js',
      "activity-element": './src/views/activity-element.js',
      "object-element": './src/views/object-element.js',
      "profile-cartouche-element": './src/views/profile-cartouche-element.js',
      "fab-element": './src/views/fab-element.js',
    },*/
    output: {
      //filename: '[name].[hash:8].js'
      filename: 'views/[name].js',
    },
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      port: 9000,
      historyApiFallback: true,
      inline: true,
      open: true,
      hot: true
    },
    devtool: "eval-source-map",
    performance: {
      hints: false
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            plugins: ['@babel/plugin-syntax-dynamic-import'],
            presets: [
              [
                '@babel/preset-env',
                {
                  useBuiltIns: 'usage',
                  targets: '>1%, not dead, not ie 11'
                }
              ]
            ]
          }
        }
      ]
    },
    plugins
  },
  modeConfig({ mode, presets }),
  loadPresets({ mode, presets })
);
};
