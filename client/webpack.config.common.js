// Base configuration for webpack build pipeline
const HTMLWebpackPlugin = require( 'html-webpack-plugin' );
const CleanWebpackPlugin = require( 'clean-webpack-plugin' );
const HashedModuleIdsPlugin = require( 'webpack' ).HashedModuleIdsPlugin;

const {
  resolve,
  getStyleLoaders
} = require( './util' );
// style files regexes
const cssRegex = /\.css$/;
const sassRegex = /\.(scss|sass)$/;

/** @type {import('webpack').Configuration} */
module.exports = {
  mode: 'development',
  stats: true,
  entry: {
    chatroom: resolve( 'src', 'chatroom.tsx' ),
    chatrooms: resolve( 'src', 'chatrooms.ts' ),
  },
  output: {
    filename: '[name].[contenthash].js',
    path: resolve( 'dist' )
  },

  optimization: {
    runtimeChunk: false,
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
    // Add current directory to resolve path, used to use absolute import
    // incase of our code base grow large
    // TODO: Aware about NODE_PATH env
    modules: [ 'node_modules', '.' ],
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
      },
      {
        test: cssRegex,
        use: getStyleLoaders( {
          importLoaders: 1,
        } )
      },
      {
        test: sassRegex,
        use: getStyleLoaders( {
          importLoaders: 2
        }, 'sass-loader' ),
      },
    ]
  },

  plugins: [
    new CleanWebpackPlugin( [ resolve( 'dist' ) ] ),
    new HTMLWebpackPlugin( {
      template: resolve( 'src', 'chatroom.html' ),
      filename: 'chatroom.html',
      chunks: [ 'runtime', 'vendors', 'chatroom' ]
    } ),
    new HTMLWebpackPlugin( {
      template: resolve( 'src', 'chatrooms.html' ),
      filename: 'chatrooms.html',
      chunks: [ 'runtime', 'vendors', 'chatrooms' ]
    } ),
    new HashedModuleIdsPlugin()
  ]
};
