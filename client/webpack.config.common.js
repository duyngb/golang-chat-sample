// Base configuration for webpack build pipeline
const HTMLWebpackPlugin = require( 'html-webpack-plugin' );
const CleanWebpackPlugin = require( 'clean-webpack-plugin' );
const HashedModuleIdsPlugin = require( 'webpack' ).HashedModuleIdsPlugin;

const resolve = require( './util' ).resolve;

const minify = {
  removeComments: true,
  collapseWhitespace: true,
  removeRedundantAttributes: true,
  useShortDoctype: true,
  removeEmptyAttributes: true,
  removeStyleLinkTypeAttributes: true,
  keepClosingSlash: true,
  minifyJS: true,
  minifyCSS: true,
  minifyURLs: true,
};

/** @type {import('webpack').Configuration} */
module.exports = {
  mode: 'development',
  stats: true,
  entry: {
    chatroom: resolve( 'src', 'chatroom.tsx' ),
    chatrooms: resolve( 'src', 'chatrooms.ts' ),
    react: [ 'react', 'react-dom', 'react-redux' ]
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
        test: /\.(sa|sc|c)ss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin( [ resolve( 'dist' ) ] ),
    new HTMLWebpackPlugin( {
      inject: true,
      template: resolve( 'src', 'chatroom.html' ),
      filename: 'chatroom.html',
      chunks: [ 'runtime', 'react', 'vendors', 'chatroom' ],
      minify
    } ),
    new HTMLWebpackPlugin( {
      inject: true,
      template: resolve( 'src', 'chatrooms.html' ),
      filename: 'chatrooms.html',
      chunks: [ 'runtime', 'vendors', 'chatrooms' ],
      minify
    } ),
    new HashedModuleIdsPlugin()
  ],

  performance: {
    hints: false
  }
};
