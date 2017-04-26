
require('aurelia-polyfills');
require('aurelia-pal-browser').initialize();
//require('babel-polyfill');
Error.stackTraceLimit = Infinity;

const srcContext = require.context(
  // directory:
  '../src',
  // recursive:
  true,
  // src file regex:
  /\.js$/i
);

const testContext = require.context(
  // directory:
  './karma-unit',
  // recursive:
  true,
  // test file regex:
  /\.spec\.js$/i
);

function requireAllInContext(requireContext) {
  return requireContext.keys().map(requireContext);
}

requireAllInContext(srcContext);
requireAllInContext(testContext);
