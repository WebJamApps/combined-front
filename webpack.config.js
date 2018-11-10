const path = require('path');
const dotenv = require('dotenv');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { AureliaPlugin, ModuleDependenciesPlugin } = require('aurelia-webpack-plugin');
const { ProvidePlugin } = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const webpack = require('webpack');

// config helpers:
dotenv.config({ path: '.env' });
const ensureArray = config => config && (Array.isArray(config) ? config : [config]) || [];
const when = (condition, config, negativeConfig) => (condition ? ensureArray(config) : ensureArray(negativeConfig));

// primary config:
const title = 'Web Jam LLC';
const outDir = path.resolve(__dirname, 'dist');
const srcDir = path.resolve(__dirname, 'src');
const nodeModulesDir = path.resolve(__dirname, 'node_modules');
const baseUrl = '/';

const cssRules = [
  { loader: 'css-loader' }
];

module.exports = ({
  production, server, extractCss, coverage, analyze
} = {}) => ({
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [srcDir, 'node_modules'],
  },
  entry: {
    app: ['aurelia-bootstrapper'],
    vendor: ['bluebird', 'jquery', 'bootstrap', 'whatwg-fetch', 'isomorphic-fetch']
  },
  mode: production ? 'production' : 'development',
  output: {
    path: outDir,
    publicPath: baseUrl,
    filename: production ? '[name].[chunkhash].bundle.js' : '[name].[hash].bundle.js',
    sourceMapFilename: production ? '[name].[chunkhash].bundle.map' : '[name].[hash].bundle.map',
    chunkFilename: production ? '[name].[chunkhash].chunk.js' : '[name].[hash].chunk.js'
  },
  performance: { hints: false },
  devServer: {
    contentBase: outDir,
    // serve index.html for all 404 (required for push-state)
    historyApiFallback: true,
    port: parseInt(process.env.PORT, 10)
  },
  devtool: production ? 'nosources-source-map' : 'cheap-module-eval-source-map',
  module: {
    rules: [
      // CSS required in JS/TS files should use the style-loader that auto-injects it into the website
      // only when the issuer is a .js/.ts file, so the loaders are not applied inside html templates
      {
        test: /\.css$/i,
        issuer: [{ not: [{ test: /\.html$/i }] }],
        use: extractCss ? ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: cssRules
        }) : ['style-loader', ...cssRules],
      },
      {
        test: /\.css$/i,
        issuer: [{ test: /\.html$/i }],
        // CSS required in templates cannot be extracted safely
        // because Aurelia would try to require it again in runtime
        use: cssRules
      },
      { test: /\.html$/i, loader: 'html-loader' },
      {
        test: /\.jsx?$/i,
        loader: 'babel-loader',
        exclude: nodeModulesDir,
        options: coverage ? { sourceMap: 'inline', plugins: ['istanbul'] } : {},
      },
      { test: /[\/\\]node_modules[\/\\]bluebird[\/\\].+\.js$/, loader: 'expose-loader?Promise' },
      // embed small images and fonts as Data Urls and larger ones as files:
      { test: /\.(png|gif|jpg|cur)$/i, loader: 'url-loader', options: { limit: 8192 } },
      { test: /\.woff2(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: 'url-loader', options: { limit: 10000, mimetype: 'application/font-woff2' } },
      { test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: 'url-loader', options: { limit: 10000, mimetype: 'application/font-woff' } },
      // load these fonts normally, as files:
      { test: /\.(ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: 'file-loader' },
    ]
  },
  plugins: [
    new AureliaPlugin(),
    new ProvidePlugin({
      Promise: 'bluebird',
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Popper: ['popper.js', 'default']
    }),
    new ModuleDependenciesPlugin({
      'aurelia-testing': ['./compile-spy', './view-spy'],
      'aurelia-auth': ['./auth-filter'],
      'aurelia-config': ['./aurelia-config'],
      'au-table': ['./au-table', './au-table-select', './au-table-sort', './au-table-pagination'],
      'aurelia-validation': [
        './aurelia-validation',
        './controller-validate-result',
        './get-target-dom-element',
        './property-info',
        './validate-binding-behavior-base',
        './validate-binding-behavior',
        './validate-instruction',
        './validate-result',
        './validate-trigger',
        './validation-controller-factory',
        './validation-controller',
        './validation-errors-custom-attribute',
        './validation-renderer-custom-attribute',
        './validation-renderer',
        './validator'
      ]
    }),
    new HtmlWebpackPlugin({
      template: 'index.ejs',
      minify: production ? {
        removeComments: true,
        collapseWhitespace: true
      } : undefined,
      metadata: {
        // available in index.ejs //
        title, server, baseUrl
      }
    }),
    new CopyWebpackPlugin([
      { from: 'static/favicon.ico', to: 'favicon.ico' },
      { from: 'static/imgs', to: 'static/imgs' }]),
    new webpack.EnvironmentPlugin(['NODE_ENV', 'AuthProductionBaseURL', 'PORT', 'BackendUrl', 'GoogleClientId', 'userRoles']),
    new webpack.DefinePlugin({
      'process.env': Object.keys(process.env).reduce((o, k) => {
        o[k] = JSON.stringify(process.env[k]);
        return o;
      }, {})
    }),
    new CopyWebpackPlugin([
      { from: 'static/music/AT.mp3', to: 'AT.mp3' },
      { from: 'static/music/TTGA.mp3', to: 'TTGA.mp3' },
      { from: 'static/music/DITR.mp3', to: 'DITR.mp3' },
      { from: 'static/WebJamLLC_FactSheet.pdf', to: 'WebJamLLC_FactSheet.pdf' }
    ]),
    ...when(extractCss, new ExtractTextPlugin({
      filename: production ? '[md5:contenthash:hex:20].css' : '[id].css',
      allChunks: true
    })),
    ...when(production, new CopyWebpackPlugin([
      { from: 'static/favicon.ico', to: 'favicon.ico' }])),
    ...when(analyze, new BundleAnalyzerPlugin())
  ]
});
