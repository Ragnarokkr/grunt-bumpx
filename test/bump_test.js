'use strict';

var grunt = require('grunt');

exports.bump = {
	setUp: function(cb){
		this.defOpts = {
			fixtures: 'test/fixtures/default_options.json',
			expected: 'test/expected/default_options.json'
		},
		this.custOpts = {
			fixtures: 'test/fixtures/custom_options.json',
			expected: 'test/expected/custom_options.json'
		};
		cb();
	},
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
