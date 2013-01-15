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
          part: 'minor'
        },
        src: ['<%= restore.custom_options.dest %>']
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
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

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
