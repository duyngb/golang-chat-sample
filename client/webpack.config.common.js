// Base configuration for webpack build pipeline
const HTMLWebpackPlugin = require( 'html-webpack-plugin' );
const CleanWebpackPlugin = require( 'clean-webpack-plugin' );
const HashedModuleIdsPlugin = require( 'webpack' ).HashedModuleIdsPlugin;

const resolve = require( './util' ).resolve;

module.exports = {
  mode: 'development',
  stats: true,
  entry: {
    chatroom: resolve( 'src', 'chatroom.tsx' )
  },
  output: {
    filename: '[name].[contenthash].js',
    path: resolve( 'dist' )
  },

  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },

  resolve: {
    extensions: [ '.ts', '.tsx', '.js', '.json' ]
  },

  module: {
    rules: [ {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin( [ resolve( 'dist' ) ] ),
    new HTMLWebpackPlugin( {
      template: resolve( 'src', 'chatroom.html' ),
      filename: 'chatroom.html',
      chunks: [ 'runtime', 'vendors', 'chatroom' ]
    } ),
    new HashedModuleIdsPlugin()
  ]
};
