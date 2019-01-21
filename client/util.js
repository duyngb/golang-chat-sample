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


module.exports = {
  resolve
};
