'use strict';

var path = require('path');
var fs = require('fs');

var Generator = module.exports = function (arg) {

	var cb = this.async(),
        choices = [
            {
                name: 'Apache',
                value: {
                    'server': 'apache',
                    'url': 'https://github.com/h5bp/server-configs-apache/archive/master.tar.gz'
                }
            },
            {
                name: 'Google App Engine (GAE)',
                value: {
                    'server': 'gae',
                    'url': 'https://github.com/h5bp/server-configs-gae/archive/master.tar.gz'
                }
            },
            {
                name: 'Internet Information Services (IIS)',
                value: {
                    'server': 'iis',
                    'url': 'https://github.com/h5bp/server-configs-iis/archive/master.tar.gz'
                }
            },
            {
                name: 'lighttpd',
                value: {
                    'server': 'lighttpd',
                    'url': 'https://github.com/h5bp/server-configs-lighttpd/archive/master.tar.gz'
                }
            },
            {
                name: 'Nginx',
                value: {
                    'server': 'nginx',
                    'url': 'https://github.com/h5bp/server-configs-nginx/archive/master.tar.gz'
                }
            },
            {
                name: 'Node.js',
                value: {
                    'server': 'node',
                    'url': 'https://github.com/h5bp/server-configs-node/archive/master.tar.gz'
                }
            }
        ],
        ignores = [
            '.git',
            '.gitattributes',
            '.gitignores',
            '.jshintrc',
            '.travis',
            'CHANGELOG.md',
            'CONTRIBUTING.md',
            'doc',
            'LICENSE.md',
            'test',
            'README.md'
        ];

    var fetch = function (configs) {

        var configsPath = path.join(this.sourceRoot(), configs.server);

        this.tarball(configs.url, configsPath, function () {

            this.expand('*', {
                cwd: configsPath,
                dot: true
            }).forEach(function (elem) {

                var tmplPath = path.join(configs.server, elem);

                if ( ignores.indexOf(elem) === -1 ) {
                    if ( fs.lstatSync(path.join(configsPath, elem)).isDirectory() === true ) {
                        this.directory(tmplPath, elem);
                    } else {
                        this.copy(tmplPath, elem);
                    }
                }

            }, this);

            cb();

        }.bind(this));

    }.bind(this);

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    if ( arg !== undefined ) {

        // There is no "pretty" built-in ability to break in `forEach, so
        // use `some`: http://ecma-international.org/ecma-262/5.1/#sec-15.4.4.17
        choices.some(function (elem) {
            if ( arg === elem.value.server ) {
                fetch(elem.value);
                return true;
            }
        });

    } else {

        this.prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'Which server config do you want?',
                choices: choices
            },
            {
                type: 'confirm',
                name: 'includeDocs',
                message: 'Would you like docs included?',
                default: false
            }
        ], function (props) {

            // remove `doc` from `ignores`
            if ( props.includeDocs === true ) {
                ignores.splice(ignores.indexOf('doc'), 1);

            }

            fetch(props.choice);
        });

    }

};

Generator.name = 'H5BP\'s Server Configs';
