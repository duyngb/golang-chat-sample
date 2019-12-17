const merge = require( 'webpack-merge' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const OptimizeCSSAssetsPlugin = require( 'optimize-css-assets-webpack-plugin' );
const CleanWebpackPlugin = require( 'clean-webpack-plugin' );

const common = require( './webpack.config.common' );
const resolve = require( './util' ).resolve;

module.exports = merge( common, {
  mode: 'production',
  output: {
    filename: '[name].[contenthash:8].js'
  },
  optimization: {
    minimize: true,
    minimizer: [
      new OptimizeCSSAssetsPlugin()
    ],
    mergeDuplicateChunks: true,
    nodeEnv: 'production'
  },
  // module: {
  //   rules: [ {
  //     test: /\.(sa|sc|c)ss$/,
  //     use: [
  //       // MiniCssExtractPlugin.loader,
  //       'style-loader',
  //       'css-loader',
  //       'sass-loader',
  //     ],
  //   } ]
  // },
  plugins: [
    new CleanWebpackPlugin( [ resolve( 'dist' ) ] ),
    // new MiniCssExtractPlugin( {
    //   filename: '[name].css',
    //   chunkFilename: '[name].[contenthash].css'
    // } )
  ]
} );
