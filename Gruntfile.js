/*
 * grunt-bumpx
 * https://github.com/Ragnarokkr/grunt-bumpx
 *
 * Copyright (c) 2013 Marco Trulla
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		// Meta
		pkg: grunt.file.readJSON('package.json'),

		// Tasks configuration
		jshint: {
			all: [
				'Gruntfile.js',
				'tasks/*.js',
				'<%= nodeunit.tests %>',
				'package.json'
			],
			options: {
				jshintrc: '.jshintrc'
			}
		},

		// Remove temporanoeous test files and old documentation
		clean: {
			test: [ 'test/fixtures/*_options.json' ],
			doc: [ './README.md' ]
		},

		// Restore test files
		restore: {
			default_options: {
				src: 'test/fixtures/ref_package.json',
				dest: 'test/fixtures/default_options.json'
			},
			custom_options: {
				src: 'test/fixtures/ref_package.json',
				dest: 'test/fixtures/custom_options.json'
			}
		},

		sildoc: {
			doc: (function(){
				if ( grunt.option('deploy') ) {
					return {
						options: {
							data: {
								name: '<%= pkg.name %>',
								altName: '<%= pkg.name.match(/^(.*).$/)[1] %>',
								description: '<%= pkg.description %>',
								gruntVersion: '<%= pkg.devDependencies.grunt %>',
								gemnasium: {
									userId: 'Ragnarokkr'
								}
							},
							template: './src-doc/readme.md.jst'
						},
						src: [ './src-doc/_*.md.jst' ],
						dest: './README.md'
					};
				} else {
					return {};
				}
			}())
		},

		// Configuration to be run (and then tested).
		bump: {
			default_options: {
				options: {},
				src: ['<%= restore.default_options.dest %>']
			},
			custom_options: {
				options: {
					part: 'minor',
					tabSize: 2,
					hardTab: true,
					onBumped: function( data ) {
						var file = data.task.filesSrc[data.index],
							json = grunt.file.readJSON( file );
						grunt.log.writeln( file + ': ' + json.version );
					}
				},
				src: ['<%= restore.custom_options.dest %>']
			},
			deploy: (function(){
				if ( grunt.option( 'deploy' ) ) {
					return {
						options: {
							part: 'patch',
							hardTab: true
						},
						src: [ 'package.json' ]
					};
				} else {
					return {};
				} // if..else
			}())
		},

		// Unit tests.
		nodeunit: {
			tests: ['test/*_test.js']
		}

	});

	// Actually load this plugin's task(s).
	grunt.loadTasks('tasks');

	// These plugins provide necessary tasks.
	require( 'matchdep' ).filterDev( 'grunt-*' ).forEach( grunt.loadNpmTasks );

	// Whenever the "test" task is run, first clean and restore the fixtures,
	// then run this plugin's task(s), then test the result.
	grunt.registerTask('test', ['clean', 'restore', 'bump', 'nodeunit']);

	// By default, lint and run all tests.
	grunt.registerTask('default', ['jshint', 'test']);

	grunt.registerMultiTask('restore', 'Restore fixtures', function(){
		this.files.forEach( function(f){
			grunt.file.copy( f.src, f.dest );
		});
	});
};
