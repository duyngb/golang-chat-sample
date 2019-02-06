/**
 * @module Utility contains utility functions used in webpack configs pipeline
 */

'use strict';

const path = require( 'path' );

/**
 * Resolve absolute path to segments, starting from client root.
 *
 * @param  {...string} segments Path segments.
 */
function resolve( ...segments ) {
  return path.resolve( __dirname, ...segments );
}

function getStyleLoaders( cssLoaderOptions, preProcessor ) {
  let loaders = [
    require.resolve( 'style-loader' ),
    {
      loader: require.resolve( 'css-loader' ),
      options: cssLoaderOptions,
    }
  ];
  if ( preProcessor ) {
    loaders.push( require.resolve( preProcessor ) );
  }
  return loaders;
}




/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


class InlineChunkHTMLPlugin {
  /**
   * @param {import('html-webpack-plugin')} htmlWebpackPlugin
   * @param {ReadonlyArray<RegExp>} tests
   */
  constructor( htmlWebpackPlugin, tests ) {
    this.htmlWebpackPlugin = htmlWebpackPlugin;
    this.tests = tests;
  }

  getInlinedTag( publicPath, assets, tag ) {
    if ( tag.tagName !== 'script' || !( tag.attributes && tag.attributes.src ) ) {
      return tag;
    }
    const scriptName = tag.attributes.src.replace( publicPath, '' );
    if ( !this.tests.some( test => scriptName.match( test ) ) ) {
      return tag;
    }
    const asset = assets[ scriptName ];
    if ( asset == null ) {
      return tag;
    }
    return {
      tagName: 'script',
      innerHTML: asset.source(),
      closeTag: true
    };
  }

  apply( /** @type {import('webpack').Compiler} */ compiler ) {
    let publicPath = compiler.options.output.publicPath;
    if ( publicPath && !publicPath.endsWith( '/' ) ) {
      publicPath += '/';
    }

    compiler.hooks.compilation.tap( 'InlineChunkHtmlPlugin', compilation => {
      const tagFunction = tag =>
        this.getInlinedTag( publicPath, compilation.assets, tag );

      const hooks = this.htmlWebpackPlugin.getHooks( compilation );
      hooks.alterAssetTagGroups.tap( 'InlineChunkHtmlPlugin', assets => {
        assets.headTags = assets.headTags.map( tagFunction );
        assets.bodyTags = assets.bodyTags.map( tagFunction );
      } );
    } );
  }
}


module.exports = {
  resolve,
  getStyleLoaders,
  InlineChunkHTMLPlugin
};
