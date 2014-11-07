/*
These files are used for qunit tests to run.
By running browserify before the test is performed;
the vendors are bundled and used in the HTML.

perform

	grunt browserify

resulting in a `./vendor-bundle.js` to be used in test.html
 */
var qunit = require('qunitjs')
	, jsface = require('jsface')
	, Application = require('../components/Application.js')
	;
