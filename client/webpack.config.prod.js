const merge = require( 'webpack-merge' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const OptimizeCSSAssetsPlugin = require( 'optimize-css-assets-webpack-plugin' );
const UglifyJSPlguin = require( 'uglifyjs-webpack-plugin' );

const common = require( './webpack.config.common' );

module.exports = merge( common, {
  mode: 'production',
  output: {
    filename: '[name].[contenthash:8].js'
  },
  optimization: {
    minimize: true,
    minimizer: [
      new UglifyJSPlguin( {
        parallel: true,
        cache: true,
        sourceMap: false,
        extractComments: false,
        uglifyOptions: {
          compress: true,
          ecma: 5,
          keep_classnames: false,
          keep_fnames: false,
        }
      } ),
      new OptimizeCSSAssetsPlugin()
    ],
    mergeDuplicateChunks: true,
    nodeEnv: 'production'
  },
  module: {
    rules: [ {
      test: /\.(sa|sc|c)ss$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'sass-loader',
      ],
    } ]
  },
  plugins: [
    new MiniCssExtractPlugin( {
      filename: '[name].css',
      chunkFilename: '[name].[contenthash].css'
    } )
  ]
} );
