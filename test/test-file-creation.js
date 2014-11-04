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

	it('`apache` option generates expected files', function (cb) {
		var expected = [ path.join('.htaccess') ];

		this.generator.run(['apache'], function () {
			helpers.assertFiles(expected);
			cb();
		});
	});

	it('`gae` option generates expected files', function (cb) {
		var expected = [ 'app.yaml' ];

		this.generator.run(['gae'], function () {
			helpers.assertFiles(expected);
			cb();
		});
	});

	it('`iis` option generates expected files', function (cb) {
		var expected = [ 'dotnet 3', 'dotnet 4' ];

		this.generator.run(['iis'], function () {
			helpers.assertFiles(expected);
			cb();
		});
	});

	it('`lighttpd` option generates expected files', function (cb) {
		var expected = [ 'lighttpd.conf' ];

		this.generator.run(['lighttpd'], function () {
			helpers.assertFiles(expected);
			cb();
		});
	});

	it('`nginx` option generates expected files', function (cb) {
		var expected = [ 'h5bp', 'mime.types', 'nginx.conf', 'sites-available', 'sites-enabled' ];

		this.generator.run(['nginx'], function () {
			helpers.assertFiles(expected);
			cb();
		});
	});

	it('`node` option generates expected files', function (cb) {
		var expected = [ 'lib', 'package.json' ];

		this.generator.run(['node'], function () {
			helpers.assertFiles(expected);
			cb();
		});
	});

});
