'use strict';
var path = require('path');
var program = require('commander');

var Generator = module.exports = function () {
	var cb = this.async();
	var url = 'https://github.com/h5bp/server-configs/archive/master.tar.gz';
	var nodeConfigUrl = 'https://github.com/h5bp/node-server-config/archive/master.tar.gz';
	var choices = ['Node.js', 'Apache', 'nginx', 'lighttpd', 'Google App Engine', 'IIS'];
	var configs = ['node', 'apache', 'nginx', 'lighttpd', 'gae', 'iis'];

	console.log('Which server config do you want?');

	program.choose(choices, function (i) {
		var chosenConfig = configs[i];

		if (chosenConfig === 'node') {
			this.tarball(nodeConfigUrl, path.join(this.sourceRoot(), 'node'), function () {
				this.directory('node', '.');
				cb();
				process.exit();
			}.bind(this));
			return;
		}

		this.tarball(url, this.sourceRoot(), function () {
			this.directory(chosenConfig, '.');
			cb();
			process.exit();
		}.bind(this));
	}.bind(this));
};

Generator.name = 'H5BP Server Configs';
