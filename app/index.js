'use strict';
var path = require('path');
var program = require('commander');

var Generator = module.exports = function (arg) {
	var cb = this.async();
	var url = 'https://github.com/h5bp/server-configs/archive/master.tar.gz';
	var nodeConfigUrl = 'https://github.com/h5bp/node-server-config/archive/master.tar.gz';
	var choices = ['Node.js', 'Apache', 'nginx', 'lighttpd', 'Google App Engine', 'IIS'];
	var configs = ['node', 'apache', 'nginx', 'lighttpd', 'gae', 'iis'];

	var fetch = function (chosenConfig) {
		if (chosenConfig === 'node') {
			this.tarball(nodeConfigUrl, path.join(this.sourceRoot(), 'node'), function () {
				this.directory('node', '.');
				cb();
			}.bind(this));
			return;
		}

		this.tarball(url, this.sourceRoot(), function () {
			this.directory(chosenConfig, '.');
			cb();
		}.bind(this));
	}.bind(this);

	if (configs.indexOf(arg) !== -1) {
		fetch(arg);
	} else {
		console.log('Which server config do you want?');

		program.choose(choices, function (i) {
			fetch(configs[i]);
		});
	}
};

Generator.name = 'H5BP Server Configs';
