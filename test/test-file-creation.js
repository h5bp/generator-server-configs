/*global describe beforeEach it */
'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;

describe('H5BP Server Configs generator', function () {
	beforeEach(function (cb) {
		var deps = ['../../app'];

		helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
			if (err) {
				return cb(err);
			}

			this.generator = helpers.createGenerator('server-configs:app', deps);
			cb();
		}.bind(this));
	});

	it('`node` options generates expected files', function (cb) {
		var expected = ['package.json'];

		this.generator.run(['node'], function () {
			helpers.assertFiles(expected);
			cb();
		});
	});

	it('`apache` options generates expected files', function (cb) {
		var expected = ['.htaccess'];

		this.generator.run(['apache'], function () {
			helpers.assertFiles(expected);
			cb();
		});
	});
});
