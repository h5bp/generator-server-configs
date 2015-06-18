'use strict';
var fs = require('fs');
var path = require('path');
var yeoman = require('yeoman-generator');
var globby = require('globby');

var choices = [{
	name: 'Apache',
	value: {
		server: 'apache',
		url: 'https://github.com/h5bp/server-configs-apache/archive/master.tar.gz'
	}
}, {
	name: 'Google App Engine (GAE)',
	value: {
		server: 'gae',
		url: 'https://github.com/h5bp/server-configs-gae/archive/master.tar.gz'
	}
}, {
	name: 'Internet Information Services (IIS)',
	value: {
		server: 'iis',
		url: 'https://github.com/h5bp/server-configs-iis/archive/master.tar.gz'
	}
}, {
	name: 'lighttpd',
	value: {
		server: 'lighttpd',
		url: 'https://github.com/h5bp/server-configs-lighttpd/archive/master.tar.gz'
	}
}, {
	name: 'Nginx',
	value: {
		server: 'nginx',
		url: 'https://github.com/h5bp/server-configs-nginx/archive/master.tar.gz'
	}
}, {
	name: 'Node.js',
	value: {
		server: 'node',
		url: 'https://github.com/h5bp/server-configs-node/archive/master.tar.gz'
	}
}];

var Generator = module.exports = yeoman.generators.Base.extend({
	constructor: function () {
		yeoman.generators.Base.apply(this, arguments);

		this.option('destination');
		this.argument('server', {
			desc: 'The server for which to generate a config',
			required: false,
			type: 'String'
		});
	},
	prompting: function () {
		var done = this.async();

		this.promptResults = {
			ignores: [
				'.editorconfig',
				'.git',
				'.gitattributes',
				'.gitignore',
				'.jshintrc',
				'.travis.yml',
				'CHANGELOG.md',
				'CONTRIBUTING.md',
				'LICENSE.md',
				'README.md',
				'bin',
				'bower.json',
				'doc',
				'src',
				'test'
			]
		};

		if (this.server !== undefined) {
			choices.some(function (elem) {
				if (this.server === elem.value.server) {
					this.promptResults.choice = elem.value;
					return true;
				}
			}.bind(this));

			if (this.promptResults.choice) {
				return done();
			}
		}

		this.prompt([{
			type: 'list',
			name: 'choice',
			message: 'Which server config do you want?',
			choices: choices
		}, {
			type: 'confirm',
			name: 'includeDocs',
			message: 'Would you like docs included?',
			default: false
		}], function (props) {
			// remove `doc` from `ignores`
			if (props.includeDocs === true) {
				this.promptResults.ignores.splice(this.promptResults.ignores.indexOf('doc'), 1);
			}

			this.promptResults.choice = props.choice;

			done();
		}.bind(this));
	},
	writing: function () {
		var done = this.async();
		//  extract props from prompting phase
		var ignores = this.promptResults.ignores;
		var configs = this.promptResults.choice;
		var configsPath = path.join(this.sourceRoot(), configs.server);
		var destPath = this.destinationRoot();

		// node server config is fetched via npm
		if (configs.server === 'node') {
			this.copy('_package.json', 'package.json');
			this.copy('index.js');

			if (!this.options['skip-install']) {
				this.installDependencies({bower: false});
			}

			done();

			return;
		}

		if (typeof this.options.destination === 'string') {
			destPath = path.join(destPath, this.options.destination);
		} else if (this.options.destination === true) {
			destPath = path.join(destPath, configs.server);
		}

		this.tarball(configs.url, configsPath, {strip: 1}, function () {
			if (configs.server === 'apache') {
				this.copy(path.join(configsPath, 'dist', '.htaccess'), (destPath) ?
					path.join(destPath, '.htaccess') : '.htaccess');
			} else {
				globby.sync('*', {
					cwd: configsPath,
					dot: true
				}).forEach(function (elem) {
					var tmplPath = path.join(configs.server, elem);

					if (ignores.indexOf(elem) === -1) {
						if (fs.lstatSync(path.join(configsPath, elem)).isDirectory() === true) {
							this.directory(tmplPath, path.join(destPath, elem));
						} else {
							this.copy(tmplPath, path.join(destPath, elem));
						}
					}
				}, this);
			}

			done();
		}.bind(this));
	}
});
