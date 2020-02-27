/**
 * This is the entry point file which sets up esm and hands off to main.js
 */

// Set options as a parameter, environment variable, or rc file.
// eslint-disable-next-line no-global-assign
require = require('esm')(module/* , options */)
// module.exports = require('./main.js/index.js.js')
module.exports = require('./main.js')
