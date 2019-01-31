const merge = require( 'webpack-merge' );
const HRM = require( 'webpack' ).HotModuleReplacementPlugin;

const common = require( './webpack.config.common' );
const resolve = require( './util' ).resolve;

module.exports = merge( common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: resolve( '..', 'public' ),
    port: 8080,
    hot: true,
    open: false,
    proxy: {
      '/chatroom/ws': {
        target: 'ws://localhost:8000',
        ws: true
      }
    }
  },
  output: {
    filename: '[name].js',
  },
  plugins: [
    new HRM()
  ]
} );
