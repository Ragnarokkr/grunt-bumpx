'use strict';

var grunt = require('grunt');

exports.bump = {
  default_options: function(test) {
    test.expect(1);

    var actual = grunt.file.readJSON( this.defOpts.fixtures );
    var expected = grunt.file.readJSON( this.defOpts.expected );
    test.equal( actual.version, expected.version, 'should set version to 0.1.0-1' );

    test.done();
  },
  custom_options: function(test) {
    test.expect(1);

    var actual = grunt.file.readJSON( this.custOpts.fixtures );
    var expected = grunt.file.readJSON( this.custOpts.expected );
    test.equal( actual.version, expected.version, 'should set version to 0.2.0' );

    test.done();
  },
};
