/*
 * grunt-bump
 * https://github.com/Ragnarokkr/grunt-bump
 *
 * Copyright (c) 2013 Marco Trulla
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function( grunt ) {

	var semver = require( 'semver' );

	// If the task is executed without argument, the value of `part` will
	// be set to `build` by default.
	grunt.registerMultiTask( 'bump', 'Bump package version.', function( part ){
		var options = this.options({
				part: 'build',
				tabSize: 4,
				hardTab: false,
				onBumped: function( /* data */ ){}
			}),
			rePart = /^(major|minor|patch|build)$/i,
			partToBump = part || options.part;

		if ( rePart.test( partToBump ) ) {
			this.filesSrc.forEach( function(filepath, i){
				grunt.log.write( 'Bumping "' + filepath + '" for ' + partToBump + '...' );
				try {
					// Read the target file
					var f = grunt.file.readJSON( filepath ),
						oldVer = f.version,
						newVer = semver.inc( oldVer, partToBump ),
						spacer = options.hardTab ? '\t' : options.tabSize;

					// If a valid SemVer value was found then is bumped
					if ( newVer ) {
						f.version = newVer;
						grunt.file.write( filepath, JSON.stringify( f, null, spacer ) );
						grunt.log.writeln( oldVer + ' -> ' + newVer );
						options.onBumped({
							grunt: grunt,
							task: this,
							index: i,
							version: newVer
						});
					} // if
				} catch (e) {
					grunt.log.writeln();
					grunt.verbose.error(e);
					grunt.fail.warn('Bump operation failed.');
				} // try..catch
			}, this);
		} else {
			grunt.log.writeln();
			grunt.fail.warn( this.name + ': specify which version part to bump: ' +
											'major, minor, patch, or build' );
		} // if..else
	});

};
