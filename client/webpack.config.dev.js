const merge = require( 'webpack-merge' );

const common = require( './webpack.config.common' );
const resolve = require( './util' ).resolve;

module.exports = merge( common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: resolve( 'dist' )
  },
  output: {
    filename: '[name].js',
  }
} );
