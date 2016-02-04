var webpack = require('webpack');
var path = require('path');
//plugins
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var HtmlwebpackPlugin = require('html-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
var devFlagPlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
});
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
//my PATH
var PATH = {
  src: path.resolve(__dirname, 'src'),
  dist: path.resolve(__dirname, 'dist'), 
}

module.exports = {
  devtool: 'eval-source-map',
  entry: [
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:8080',
    path.resolve(PATH.src, 'main.ts') 
  ],
  output: {
    path: path.resolve(PATH.dist),
    filename: 'bundle.js',
    publicPath: ''
  },
  resolve: {
    extensions: ['', '.ts', '.js']
  },
  // devServer: {
  //   proxy: {
  //     '/proxy/*': {
  //         target: 'http://localhost:3000',
  //         secure: false
  //     }
  //   }
  // },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // new uglifyJsPlugin({compress: {warnings: false}}),
    new HtmlwebpackPlugin({
      title: 'MyAchievements',
      template:  path.resolve(PATH.src, 'index.html'),
      inject: 'body',
    }),
    new OpenBrowserPlugin({url: 'http://localhost:8080'}),
    new CommonsChunkPlugin('init.js'),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    devFlagPlugin,
  ],
  module: {
    loaders: [
      {
           test: /\.ts/,
           loader: 'ts-loader',
           include: path.join(PATH.src),
           exclude: [ /\.(spec|e2e|async)\.ts$/ ] 
      }, { test: /\.scss$/,
           // loader: 'style-loader!css-loader?moudle!sass-loader',
           loader: 'raw-loader!sass-loader',
           include: path.join(PATH.src)
      }, { test: /\.css$/,
           loader: 'style-loader!css-loader',
           include: path.join(PATH.src)
      }, { test: /\.(png|jpg)$/,
           loader: 'url-loader?limit=8192',
           include: path.join(PATH.src)
      }, { test   : /\.(ttf|eot|svg|woff(2))(\?[a-z0-9]+)?$/,
           loader : 'file-loader'
      }, { test: /\.html$/,
           loader: 'raw-loader'
      }, { test: /\.jade$/,
           loader: 'raw-loader!jade-html-loader',
           include: path.join(PATH.src)
      }
    ]
  }
};
