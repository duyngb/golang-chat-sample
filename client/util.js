/**
 * @module Utility contains utility functions used in webpack configs pipeline
 */

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

module.exports = {
  resolve,
  getStyleLoaders
};
