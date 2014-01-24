/*
 * grunt-bumpx
 * https://github.com/ragnarokkr/grunt-bumpx
 *
 * Copyright (c) 2013-2014 Marco Trulla
 * Licensed under the MIT license.
 */

module.exports = function ( grunt ) { 'use strict';

  var
    // Import libraries
    semver = require( 'semver' ),

    // Messages dictionary
    messages = {
      INFO_BUMPED: 'File "<%= filepath %>" bumped from "<%= oldVer %>" to "<%= newVer %>"',
      VERBOSE_BUMPING: 'Bumping "<%= filepath %>" for "<%= levelToBump %>"...',
      DEBUG_MODIFIER: 'Modifier for "<%= category %>" at index <%= fnIndex %> is not a function... skipped',
      DEBUG_NORMALIZED: '<%= option %> has been normalized to an array',
      ERR_LEVEL: 'It was expected "<%= choices %>", a function, or array of functions but "<%= level %>" has been specified.',
      ERR_VERSION: 'In "<%= filepath %>" the version field is missing or not in a SemVer-compliant format',
      ERR_PROCESSED_VERSION: 'After being processed the version <%= version %> is no more SemVer-compliant.',
      ERR_EXCEPTION: 'Bumping "<%= filepath %>" aborted.'
    },

    // Supported levels
    supportedLevels = [ 'major', 'minor', 'patch', 'prerelease' ],

    // RegExp for validating the level
    reLevel = new RegExp( '^' + supportedLevels.join( '|' ) + '$', 'i' ),

    // Default options
    defaultOptions = {
      // Level to increment.
      // It can be 'major', 'minor', 'patch', 'prerelease', a function
      // or array of functions. By default is 'patch'.
      level: 'patch',

      // Size of the tabulation to use in formatting the JSON output.
      // By default is 2 characters (used only if `hardTab` is false).
      tabSize: 2,

      // If true, hard tabulation (`\t`) is used instead of spaces.
      // By default is set to false.
      hardTab: false,

      // Array of function to be called for final adjustments once
      // the version has been bumped.
      onBumped: [ /* function ( data ) {} */ ]
    },

    // Optional command line flags:
    // --level=param : `param` must be one of the supported levels or
    //                  a new version base always SemVer-compliant.
    flags = {
      level: grunt.option( 'level' )
    };


  /////////////
  // Helpers //
  /////////////

  function isFunction ( fn ) {
    return ( /.*Function\]$/ ).test( Object.prototype.toString.call( fn ) );
  }

  function isString ( str ) {
    return ( /.*String\]$/ ).test( Object.prototype.toString.call( str ) );
  }

  // To be valid, a `level` must be one of the values into `supportedLevels`,
  // a function, or an array of functions.
  function isValidLevel ( level ) {
    return reLevel.test( level ) || isFunction( level ) || Array.isArray( level );
  }

  function isValidVersion ( json ) {
    return json.hasOwnProperty( 'version' ) && !!semver.valid( json.version );
  }

  // Prints out a message according to the type of message ID.
  function printMsg ( msgId, data ) {
    var outputFn;

    if ( messages.hasOwnProperty( msgId) ) {
      switch ( msgId.match( /^[A-Z]+/ )[0] ) {
        case 'INFO':
          outputFn = grunt.log.writeln;
          break;

        case 'VERBOSE':
          outputFn = grunt.verbose.writeln;
          break;

        case 'DEBUG':
          outputFn = grunt.log.debug;
          break;

        default:
          outputFn = grunt.fail.warn;
      } // switch

      outputFn( grunt.template.process( messages[ msgId ], { data: data } ) );
    }
  }


  // Bumps a SemVer-compliant version number allowing customized
  // formatting and modifiers for pre-release and/or build versioning.

  grunt.registerMultiTask( 'bump', 'Bump package version', function () {

    var
      // Set default options
      options = this.options( defaultOptions ),
      // Filter the target files
      files = this.filesSrc.filter( function ( filepath ) {
        return grunt.file.exists( filepath );
      }),
      // Decide the filler character to use for indenting
      filler = options.hardTab ? '\t' : parseInt( 0 + options.tabSize );

    // If the parameter `--level` is passed on the command line, its
    // value will be used in place of default or the one specified into
    // the configuration file.
    if ( flags.level ) {
      options.level = flags.level;
    }

    // If a new version is passed to `--level`, all targets are
    // updated with no further steps, then terminate the task.
    if ( !! semver.valid( options.level ) ) {
      files.forEach( function ( filepath ) {
        var f;

        try {
          // Read the target file
          f = grunt.file.readJSON( filepath );

          printMsg( 'VERBOSE_BUMPING', {
            filepath: filepath,
            levelToBump: options.level
          });

          // Change the version number
          if ( f.hasOwnProperty( 'version' ) ) {
            // Write the bumped version into the formatted target
            f.version = options.level;
            grunt.file.write( filepath, JSON.stringify( f, null, filler ) );
          }

        } catch ( e ) {

          printMsg( 'ERR_EXCEPTION', { filepath: filepath } );

        } // try..catch
      });
      return true;
    } // if

    // Otherwise, continue the process only if a valid level has been defined
    if ( ! isValidLevel( options.level ) ) {
      grunt.log.writeln();
      printMsg( 'ERR_LEVEL', {
        pluginName: this.name,
        choices: supportedLevels.join('", "'),
        level: options.level
      });
    }

    // Process every target
    files.forEach( function ( filepath, i ) {
      var f, versions = {};

      printMsg( 'VERBOSE_BUMPING', {
        filepath: filepath,
        levelToBump: options.level
      });

      try {
        // Read the target file
        f = grunt.file.readJSON( filepath );

        // Continue the process only if a valid and SemVer-compliant
        // version is found
        if ( ! isValidVersion( f ) ) {
          printMsg( 'ERR_VERSION', { filepath: filepath } );
        }

        // Bump the version number
        versions.current = f.version;
        if ( isString( options.level ) ) {

          // Handle the supported levels
          versions.bumped = semver.inc( versions.current, options.level );

        } else {

          // Normalize the level to an array
          if ( isFunction( options.level ) ) {
            options.level = [ options.level ];
            printMsg( 'DEBUG_NORMALIZED', { option: 'level' } );
          }

          versions.bumped = versions.current;
          options.level
            .filter( function( fn, j ) {
              if ( isFunction( fn ) ) {
                return true;
              } else {
                printMsg( 'DEBUG_MODIFIER', {
                  category: 'level',
                  fnIndex: j
                });
                return false;
              }
            })
            .forEach( function ( fn ) {
              versions.bumped = fn({
                semver: semver,
                task: this,
                index: i,
                version: versions.bumped
              });
            }, this );

        } // if..else

        // Paranoia mode: check if after all the processing steps
        // the version is still SemVer-compliant
        if ( ! semver.valid( versions.bumped ) ) {
          printMsg( 'ERR_PROCESSED_VERSION', { filepath: filepath } );
        }

        // Write the bumped version into the formatted target
        f.version = versions.bumped;
        grunt.file.write( filepath, JSON.stringify( f, null, filler ) );

        printMsg( 'INFO_BUMPED', {
          filepath: filepath,
          oldVer: versions.current,
          newVer: versions.bumped
        });

        // Normalize onBumped just in case the user assigned a function to it
        if ( isFunction( options.onBumped ) ) {
          options.onBumped = [ options.onBumped ];
          printMsg( 'DEBUG_NORMALIZED', { option: 'onBumped' } );
        }

        // Execute all the valid callback functions attached to the
        // `onBumped` event.
        options.onBumped
          .filter( function ( fn, j ) {
            if ( isFunction( fn ) ) {
              return true;
            } else {
              printMsg( 'DEBUG_MODIFIER', { category: 'onBumped', fnIndex: j } );
              return false;
            }
          })
          .forEach( function ( fn ) {
            fn( { task: this, index: i, version: versions.bumped } );
          }, this );

      } catch (e) {

        grunt.log.error( e );
        printMsg( 'ERR_EXCEPTION', { filepath: filepath } );

      } // try..catch
    }, this );

  });

};
