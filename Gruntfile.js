/*
 * grunt-bump
 * https://github.com/Ragnarokkr/grunt-bump
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
			],
			options: {
				jshintrc: '.jshintrc',
			},
		},

		clean: {
			files: [ 'test/fixtures/*_options.json' ]
		},

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
			}
		},

		// Markdown compiler
		markdown: {
			all: {
				options: {
					gfm: true,
					highlight: 'manual'
				},
				files: ['./*.md'],
				dest: './md',
				template: 'template.jst'
			}
		},

		// Unit tests.
		nodeunit: {
			tests: ['test/*_test.js'],
		}

	});

	// Actually load this plugin's task(s).
	grunt.loadTasks('tasks');

	// These plugins provide necessary tasks.
	Object.keys( grunt.config('pkg').devDependencies ).forEach( function(dep){
		if (/^grunt\-/i.test(dep)) {
			grunt.loadNpmTasks( dep );
		} // if
	});

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
