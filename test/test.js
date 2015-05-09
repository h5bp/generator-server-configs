'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;
var assert = require('yeoman-assert');

describe('H5BP Server Configs generator', function () {
	beforeEach(function (cb) {
		var deps = [
			'../../app'
		];

		helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
			if (err) {
				cb(err);
				return;
			}

			this.generator = helpers.createGenerator('server-configs:app', deps);
			cb();
		}.bind(this));
	});

	it('`apache` option generates expected files', function (cb) {
		var expected = [
			path.join('.htaccess')
		];

		this.generator.server = 'apache';
		this.generator.run(function () {
			assert.file(expected);
			cb();
		});
	});

	it('`gae` option generates expected files', function (cb) {
		var expected = [
			'app.yaml'
		];

		this.generator.server = 'gae';
		this.generator.run(function () {
			assert.file(expected);
			cb();
		});
	});

	it('`iis` option generates expected files', function (cb) {
		var expected = [
			'dotnet 3',
			'dotnet 4'
		];

		this.generator.server = 'iis';
		this.generator.run(function () {
			assert.file(expected);
			cb();
		});
	});

	it('`lighttpd` option generates expected files', function (cb) {
		var expected = [
			'lighttpd.conf'
		];

		this.generator.server = 'lighttpd';
		this.generator.run(function () {
			assert.file(expected);
			cb();
		});
	});

	it('`nginx` option generates expected files', function (cb) {
		var expected = [
			'h5bp',
			'mime.types',
			'nginx.conf',
			'sites-available',
			'sites-enabled'
		];

		this.generator.server = 'nginx';
		this.generator.run(function () {
			assert.file(expected);
			cb();
		});
	});

	it('`node` option generates expected files', function (cb) {
		var expected = [
			'lib',
			'package.json'
		];

		this.generator.server = 'node';
		this.generator.run(function () {
			assert.file(expected);
			cb();
		});
	});

	it('`destination` flag generates files in default location', function (cb) {
		var expected = [
			'node/lib',
			'node/package.json'
		];

		this.generator.server = 'node';
		this.generator.options.destination = true;
		this.generator.run(function () {
			assert.file(expected);
			cb();
		});
	});

	it('`destination` flag generates files in custom location', function (cb) {
		var expected = [
			'custom/lib',
			'custom/package.json'
		];

		this.generator.server = 'node';
		this.generator.options.destination = 'custom';
		this.generator.run(function () {
			assert.file(expected);
			cb();
		});
	});
});
