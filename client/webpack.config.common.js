// Base configuration for webpack build pipeline
const HTMLWebpackPlugin = require( 'html-webpack-plugin' );
const HashedModuleIdsPlugin = require( 'webpack' ).HashedModuleIdsPlugin;
const ScriptExtHtmlWebpackPlugin = require( 'script-ext-html-webpack-plugin' );
const InlineChunkHTMLPlugin = require( './util' ).InlineChunkHTMLPlugin;

const resolve = require( './util' ).resolve;

/** @type {import('html-minifier').Options} */
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
    chatroom: resolve( 'src', 'chatroom.ts' ),
    chatrooms: resolve( 'src', 'chatrooms.ts' ),
  },
  output: {
    filename: '[name].[contenthash].js',
    path: resolve( 'dist' )
  },

  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      minSize: 0,
      cacheGroups: {
        redux: {
          test: /[\\/]node_modules[\\/]react-redux[\\/]/,
          name: 'redux',
          chunks: 'all',
          priority: 3,
        },
        react: {
          test: /[\\/]node_modules[\\/](react|react-.*)[\\/]/,
          name: 'react',
          chunks: 'all',
          priority: 2,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 1,
          enforce: true,
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
    new HTMLWebpackPlugin( {
      inject: true,
      template: resolve( 'src', 'chatroom.html' ),
      filename: 'chatroom.html',
      chunks: [ 'vendors', 'chatroom' ],
      minify,
    } ),
    new ScriptExtHtmlWebpackPlugin( {
      defaultAttribute: 'defer'
    } ),
    new HTMLWebpackPlugin( {
      inject: true,
      template: resolve( 'src', 'chatrooms.html' ),
      filename: 'chatrooms.html',
      chunks: [],
      minify,
    } ),
    new InlineChunkHTMLPlugin( HTMLWebpackPlugin, [ /runtime/ ] ),
    new HashedModuleIdsPlugin()
  ],

  performance: {
    hints: false
  }
};
