/*
 * grunt-bumpx
 * https://github.com/Ragnarokkr/grunt-bumpx
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
				grunt.verbose.writeln( 'Bumping "' + filepath + '" for "' + partToBump + '"...' );
				try {
					// Read the target file
					var f = grunt.file.readJSON( filepath ),
					// Bump the version number
					oldVer = f.version,
					newVer = semver.inc( oldVer, partToBump ),
					// Figure out the indenting character to be used
					spacer = options.hardTab ? '\t' : options.tabSize;

					// If a valid SemVer value was found then is bumped
					if ( newVer ) {
						// Write the bumped version with target formatting
						f.version = newVer;
						grunt.file.write( filepath, JSON.stringify( f, null, spacer ) );
						grunt.log.writeln( 'File "' + filepath + '" bumped from "' + oldVer +
							'" to "' + newVer + '"' );
						// Invoke the callback function once the version is bumped
						options.onBumped({
							grunt: grunt,
							task: this,
							index: i,
							version: newVer
						});
					} // if
				} catch (e) {
					grunt.verbose.error();
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
