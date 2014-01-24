/*
 * grunt-bumpx
 * https://github.com/ragnarokkr/grunt-bumpx
 *
 * Copyright (c) 2013-2014 Marco Trulla
 * Licensed under the MIT license.
 */

'use strict';

var grunt = require( 'grunt' );

exports[ 'Test bumping' ] = {
  setUp: function ( cb ) {
    var fixtures = [
      'default', 'major', 'minor', 'patch', 'prerelease', 'custom_level',
      'custom_level_array', 'tabsize'
    ];

    fixtures.forEach( function ( fix ) {
      var name = fix
        .split('_')
        .map( function ( str, i ) {
          if ( i > 0 ) {
            return str.substr( 0, 1 ).toUpperCase() + str.substr( 1 );
          } else {
            return str.toLowerCase();
          }
        })
        .join( '' );

      this[ name + 'Test' ] = {
        fixtures: 'test/fixtures/fix_' + fix + '.json',
        expected: 'test/expected/exp_' + fix + '.json'
      };
    }, this );

    cb();
  },

  'with defaults': function ( test ) {
    var tested, expected;

    test.expect( 1 );

    tested = grunt.file.readJSON( this.defaultTest.fixtures );
    expected = grunt.file.readJSON( this.defaultTest.expected );

    test.equal( tested.version, expected.version, 'should set version to 0.1.1' );
    test.done();
  },

  'major level': function ( test ) {
    var tested, expected;

    test.expect( 1 );

    tested = grunt.file.readJSON( this.majorTest.fixtures );
    expected = grunt.file.readJSON( this.majorTest.expected );

    test.equal( tested.version, expected.version, 'should set version to 1.0.0' );
    test.done();
  },

  'minor level': function ( test ) {
    var tested, expected;

    test.expect( 1 );

    tested = grunt.file.readJSON( this.minorTest.fixtures );
    expected = grunt.file.readJSON( this.minorTest.expected );

    test.equal( tested.version, expected.version, 'should set version to 0.2.0' );
    test.done();
  },

  'patch level': function ( test ) {
    var tested, expected;

    test.expect( 1 );

    tested = grunt.file.readJSON( this.patchTest.fixtures );
    expected = grunt.file.readJSON( this.patchTest.expected );

    test.equal( tested.version, expected.version, 'should set version to 0.1.1' );
    test.done();
  },

  'pre-release level': function ( test ) {
    var tested, expected;

    test.expect( 1 );

    tested = grunt.file.readJSON( this.prereleaseTest.fixtures );
    expected = grunt.file.readJSON( this.prereleaseTest.expected );

    test.equal( tested.version, expected.version, 'should set version to 0.1.0-0' );
    test.done();
  },

  'with custom level modifier (single function)': function ( test ) {
    var tested, expected;

    test.expect( 1 );

    tested = grunt.file.readJSON( this.customLevelTest.fixtures );
    expected = grunt.file.readJSON( this.customLevelTest.expected );

    test.equal( tested.version, expected.version, 'should set version to 0.1.0-rc.1' );
    test.done();
  },

  'with custom level modifiers (array)': function ( test ) {
    var tested, expected;

    test.expect( 1 );

    tested = grunt.file.readJSON( this.customLevelArrayTest.fixtures );
    expected = grunt.file.readJSON( this.customLevelArrayTest.expected );

    test.equal( tested.version, expected.version, 'should set version to 0.1.0-rc.1+build.1' );
    test.done();
  },

  'with custom formatting (tab size: 8)': function ( test ) {
    var tested, expected;

    test.expect( 1 );

    tested = grunt.file.read( this.customLevelArrayTest.fixtures );
    expected = grunt.file.read( this.customLevelArrayTest.expected );

    test.equal( tested.version, expected.version, 'should set version to 0.1.1 and use 8-spaces indenting' );
    test.done();
  },
};
