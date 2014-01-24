/*
 * grunt-bumpx
 * https://github.com/Ragnarokkr/grunt-bumpx
 *
 * Copyright (c) 2013-2014 Marco Trulla
 * Licensed under the ISC License.
 */

module.exports = function(grunt) { 'use strict';

  // Project configuration.
  grunt.initConfig({
    // Meta
    pkg: grunt.file.readJSON( 'package.json' ),

    // Tasks configuration
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Remove temporary test files and old documentation
    clean: {
      test: [ 'test/fixtures/fix_*.json' ],
      doc: [ './README.md', './CONTRIBUTORS.md', './LICENSE-MIT' ]
    },

    // Restore test files
    restore: {
      options: {
        baseDir: 'test/fixtures',
        baseFile: 'ref_package.json',
        fixtures: [ 'fix_default', 'fix_major', 'fix_minor', 'fix_patch',
          'fix_prerelease', 'fix_custom_level', 'fix_custom_level_array',
          'fix_tabsize', 'fix_custom_event' ]
      }
    },

    // Build the documentation
    sildoc: ( function () {
      if ( grunt.option( 'deploy' ) ) {
        return {
          doc: {
            options: {
              data: {
                name: '<%= pkg.name %>',
                altName: '<%= pkg.name.match( /-(.*).$/ )[1] %>',
                description: '<%= pkg.description %>',
                gruntVersion: '<%= pkg.devDependencies.grunt %>'
              },
              template: './src-doc/readme.tmpl.md'
            },
            src: [ './src-doc/_*.tmpl.md' ],
            dest: './README.md'
          },
          license: {
            options: {
              data: {
                author: '<%= pkg.author.name %> <<%= pkg.author.email %>>'
              }
            },
            src: './src-doc/license.tmpl.md',
            dest: './LICENSE-MIT'
          },
          contributors: {
            options: {
              data: {
                contributors: '<%= pkg.contributors %>'
              }
            },
            src: './src-doc/contributors.tmpl.md',
            dest: './CONTRIBUTORS.md'
          }
        };
      } else {
        return {};
      }
    }()),

    // Configuration to be run (and then tested).
    bump: {
      defaults: {
        options: {},
        src: 'test/fixtures/fix_default.json'
      },

      major: {
        options: {
          level: 'major'
        },
        src: 'test/fixtures/fix_major.json'
      },

      minor: {
        options: {
          level: 'minor'
        },
        src: 'test/fixtures/fix_minor.json'
      },

      patch: {
        options: {
          level: 'patch'
        },
        src: 'test/fixtures/fix_patch.json'
      },

      prerelease: {
        options: {
          level: 'prerelease'
        },
        src: 'test/fixtures/fix_prerelease.json'
      },

      customLevel: {
        options: {
          level: function ( data ) {
            return data.version + '-rc.1';
          }
        },
        src: 'test/fixtures/fix_custom_level.json'
      },

      customLevelArray: {
        options: {
          level: [
            function ( data ) {
              return data.version + '-rc.1';
            },
            function ( data ) {
              return data.version + '+build.1';
            }
          ]
        },
        src: 'test/fixtures/fix_custom_level_array.json'
      },

      customOptions: {
        options: {
          tabSize: 8
        },
        src: 'test/fixtures/fix_tabsize.json'
      },

      customEvent: {
        options: {
          onBumped: function ( data ) {
            grunt.log.writeln( 'version should be equal to 0.1.1' );
          }
        },
        src: 'test/fixtures/fix_custom_event.json'
      },

      deploy: (function(){
        if ( grunt.option( 'deploy' ) ) {
          return {
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

  // Load the plugins.
  Object
    .keys( grunt.config( 'pkg.devDependencies' ) )
    .filter( function ( dep ) {
      return ( /^grunt-/ ).test( dep );
    })
    .forEach( grunt.loadNpmTasks );

  // Load this plugin's task(s).
  grunt.loadTasks( 'tasks' );

  // Whenever the "test" task is run, first clean and restore the fixtures,
  // then run this plugin's task(s), then test the result.
  grunt.registerTask( 'test', [ 'jshint', 'clean:test', 'restore', 'bump', 'nodeunit' ] );

  // Build all the documentation (it requires the `--deploy` to be defined)
  grunt.registerTask( 'doc', [ 'clean:doc', 'sildoc' ] );

  // By default, lint and run all tests, then build documentation.
  grunt.registerTask( 'default', [ 'jshint', 'test', 'doc' ] );

  // Restore fixtures before to perform a new test
  grunt.registerTask( 'restore', 'Restore fixtures', function () {
    var path = require( 'path' ),
      options = this.options();

    options.fixtures.forEach( function ( fix ) {
      grunt.file.copy(
        path.join( options.baseDir, options.baseFile ),
        path.join( options.baseDir, fix + '.json' )
      );
    });
  });
};
