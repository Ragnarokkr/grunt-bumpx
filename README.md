# grunt-bumpx [![GitHub version][badge-github-version-image] ][badge-github-version-url] [![Built with Grunt][badge-grunt-image] ][badge-grunt-url]
> Extended bump version number

## Status
[![NPM][badge-npm-image]][badge-npm-url]

[![Dependency Status][badge-gemnasium-image]][badge-gemnasium-url] [![Dependencies Status][badge-dependencies-image]][badge-dependencies-url] [![devDependencies Status][badge-dev-dependencies-image]][badge-dev-dependencies-url]

[![Bitdeli Badge][badge-bitdeli-image]][badge-bitdeli-url] [![xrefs][badge-sourcegraph-image]][badge-sourcegraph-url] [![Stories in Ready][badge-waffle-image]][badge-waffle-url] [![endorse][badge-endorse-image]][badge-endorse-url]

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt][grunt] before, be sure to check out the [Getting Started][getting-started] guide, as it explains how to create a [Gruntfile][] as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-bumpx --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```javascript
grunt.loadNpmTasks( 'grunt-bumpx' );
```

## The "bump" task

### Overview
In your project's Gruntfile, add a section named `bump` to the data object passed into `grunt.initConfig()`.

```javascript
grunt.initConfig({
  bump: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    }
  }
})
```

This plugin allows you to bump the version number of all the configuration/manifest files (package.json, manifest.json, etc.) in your project. Only JSON files are supported, and each file **must** have a `version` field compliant to [SemVer][] guidelines.

### Compatibility Issues

**As of v0.2.0+, this plugin is no longer backwards compatible with older versions (0.1.x). If you decide to update your version to the latest, be sure to update your configuration files or Grunt will spit on you for sure.**

### Options

options.* | Type | Default | Description
---|:-:|:-:|---
level|`String`|`'patch'`|The version level to increase. Allowed values are: `major`, `minor`, `patch`, and `prerelease` (case insensitive). **Required**.
level|`Function`|`function( data ){}`|This can be used in place of the `String` variant. In this case, the function will be called and its return value assigned to the new version number.
level|`Array[Function]`|`[]`|This can be used in place of the `String` variant. In this case, each function into the array will be called and the result of the last function defined into the array, assigned to the new version number.
tabSize|`Number`|`2`|Number of spaces (soft tab) to be used for indenting the targeted JSON file.
hardTab|`Boolean`|`false`|Whether hard tabs (`\t`) have to be used in place of soft tabs. This option has priority over `options.tabSize`. (If both options are defined and `hardTab` is set to `true`, then hard tabs will be used.)
onBumped|`Array[Function]`|`[]`|Functions to call once the version number has been incremented. (Called for each target).
onBumped|`Function`|`function( data ){}`|This can be used in place of the `Array[Function]` variant. In this case, only a function is called once the version number is incremented. (Called for each target).

#### The "level" (array of) modifier functions

The `level` option accepts the 4 standard levels (major, minor, patch, and prerelease) supported by SemVer. This is usually enough for most projects, but in some cases this could not be enough.

The SemVer standard requires only the main levels of the version number to be positive integers, and it handles them correctly when increments the required level. The problem is that this is not true when referenced to prerelease and build levels.

The `prerelease` level is handled only incrementing the last integer value found, and there's not a valid way to force the incrementing of different parts of this level. The same is true for the build level (which is ignored and stripped out by SemVer).

Because of that, I've added the support of custom functions for the `level` option. It's possibile to define a single function or an array of functions. Every function will be called passing the following object as parameter:

Key | Type | Description
---|:-:|---
semver|`Object`|A reference to the [semver][node-semver] library, which is used by this plugin and can be used internally to the function for whatever we want to do
task|`Object`|A reference to the [`task`][task] object
index|`Number`|The index of currently processed file inside the source files array
version|`String`|The (temporary) version number to update

If a single function is assigned to `level`, the value of `version` will correspond to the old version to be updated. If an array of functions is assigned, the first function into the array will have `version` equal to the old version, then each subsequently function will receive the partial processed value returned by the functions preceeding the called one. The returned value from the last function in array will be then saved as the final new version number.

#### The "onBumped" functions

Usually the bumping step is the last one performed before to deploy the project. However, sometimes further steps are required to be done after the version has been updated. The event-like `onBumped` option can be used just right for this kind of needs.

The defined function(s) will be invoked each time a target file is bumped, with an object parameter containing:

Key | Type | Description
---|:-:|---
task|`Object`|A reference to the [`task`][task] object
index|`Number`|The index of currently processed file inside the source files array
version|`String`|The updated version number

### Command Line Options

It's also possible to change the default behaviour of the plugin by using the command line options:

Option | Description
---|---
`--level`|Specifies the level we want to increment. Allowed values for this option are the standard `major`, `minor`, `patch`, and `prerelease`. In addition to these values, a further value is supported: if for any reason you need to totally change the version number, just pass to this option the wanted version number which must be a valid SemVer version number. **This option will have precedence over the one defined into the configuration file**.

### Usage Examples

#### Default Options
Running the task in this way, each source file's `patch` level of the `version` field will be automatically incremented, using an indentation of 2 spaces.

```javascript
grunt.initConfig({
  bump: {
    options: {},
    files: [ 'package.json', 'manifest.json' ]
  }
})
```

#### Custom level and indentation
The formatting of the target JSON file and the level to increment are easily customizable with:

```javascript
grunt.initConfig({
  bump: {
    options: {
      level: 'minor',
      tabSize: 3
    },
    files: [ 'package.json', 'manifest.json' ]
  }
})
```

In this way, the target files will have their `minor` level incremented, and the indentation will be of 3 spaces by soft-tab stop.

#### Custom modifier and event functions
When more fine-grained adjustements are required, it's possibile to deeply customize the plugin's behaviour:

```javascript
grunt.initConfig({
  bump: {
    options: {
      level: function ( data ) {
        var levels = data.version.match( /^(\d\.\d\.\d)/ ), 
          newVer = data.semver.inc( levels[1], 'patch' ) + '-rc.1+' + Date.now();
        return newVer;
      },
      onBumped: function ( data ) {
        var currentFile = data.task.filesSrc[ data.index ];
        if ( ( /package.json/ ).test( currentFile ) ) {
          grunt.config( 'pkg', grunt.file.readJSON( currentFile ) );
        }
      }
    },
    files: [ 'package.json', 'manifest.json' ]
  }
})
```

In this example, the `level` option has been customized with a function which strips everything out but the main levels from the version number, and returns a new version by incrementing the `patch` level (using the passed reference to the semver library), concatenating a customized prerelease (`-rc.1`) and build (`Date.now()`) levels.
The custom function assigned to `onBumped`, will check if the processed file is `package.json` and, if so, update the `pkg` key into the Grunt configuration file by reloading the file.

The example is pretty useless on an daily use, but I hope you catch my point and understand the power of this solution.

## Contributing

Any [contribution][contribution] to improve the project and/or expand it is welcome.

If you're interested in contributing to this project, take care to maintain the existing coding style.

The project follows these standard, so please you do it too:

* [SemVer][] for version numbers
* [Vandamme][] for changelog formatting
* [EditorConfig][] for cross-editor configuration

To contribute:

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

Add unit tests for any new or changed functionality. Lint and test your code using [Grunt][grunt].

## Donating
If you like this work, please consider to support its future development:

[![Gittip][badge-gittip-image]][badge-gittip-url] [![Flattr this][badge-flattr-image]][badge-flattr-url]

[![I Love Open Source][badge-open-source-image]][badge-open-source-url]

BTC: `19ZEWBKuTzNw1opsEN95pG6JuAxuDYq3Nq`

LTC: `LNoFqJJAM195B4GnNq45JtsWDNtkb8h8WR`


Thanks!


## Release History
See the [CHANGELOG][] distributed with the project.

## License
See the [LICENSE][] distributed with the project.

[badge-github-version-image]: https://badge.fury.io/gh/ragnarokkr%2Fgrunt-bumpx.png
[badge-github-version-url]: http://badge.fury.io/gh/ragnarokkr%2Fgrunt-bumpx
[badge-grunt-image]: https://cdn.gruntjs.com/builtwith.png
[badge-grunt-url]: http://gruntjs.com/
[badge-npm-image]: https://nodei.co/npm/grunt-bumpx.png?downloads=true
[badge-npm-url]: https://npmjs.org/package/grunt-bumpx
[badge-gemnasium-image]: https://gemnasium.com/Ragnarokkr/grunt-bumpx.png
[badge-gemnasium-url]: https://gemnasium.com/Ragnarokkr/grunt-bumpx
[badge-dependencies-image]: https://david-dm.org/ragnarokkr/grunt-bumpx.png
[badge-dependencies-url]: https://david-dm.org/ragnarokkr/grunt-bumpx
[badge-dev-dependencies-image]: https://david-dm.org/ragnarokkr/grunt-bumpx/dev-status.png
[badge-dev-dependencies-url]: https://david-dm.org/ragnarokkr/grunt-bumpx#info=devDependencies
[badge-bitdeli-image]: https://d2weczhvl823v0.cloudfront.net/ragnarokkr/grunt-bumpx/trend.png
[badge-bitdeli-url]: https://bitdeli.com/free
[badge-sourcegraph-image]: https://sourcegraph.com/api/repos/github.com/Ragnarokkr/grunt-bumpx/badges/xrefs.png
[badge-sourcegraph-url]: https://sourcegraph.com/github.com/Ragnarokkr/grunt-bumpx
[badge-waffle-image]: https://badge.waffle.io/ragnarokkr/grunt-bumpx.png?label=ready
[badge-waffle-url]: https://waffle.io/ragnarokkr/grunt-bumpx
[badge-gittip-image]: http://img.shields.io/gittip/ragnarokkr.png
[badge-gittip-url]: https://www.gittip.com/Ragnarokkr/
[badge-flattr-image]: https://api.flattr.com/button/flattr-badge-large.png
[badge-flattr-url]: https://flattr.com/submit/auto?user_id=marcotrulla&url=https%3A%2F%2Fgithub.com%2FRagnarokkr%2Fgrunt-bumpx
[badge-open-source-image]: http://www.iloveopensource.io/images/logo-lightbg.png
[badge-open-source-url]: http://www.iloveopensource.io/users/Ragnarokkr
[badge-endorse-image]: https://api.coderwall.com/ragnarokkr/endorsecount.png
[badge-endorse-url]: https://coderwall.com/ragnarokkr

[grunt]: http://gruntjs.com/
[getting-started]: http://gruntjs.com/getting-started
[Gruntfile]: http://gruntjs.com/sample-gruntfile
[package.json]: https://npmjs.org/doc/json.html
[SemVer]: http://semver.org/
[node-semver]: https://github.com/isaacs/node-semver
[grunt-object]: http://gruntjs.com/api/grunt#grunt.initconfig
[task]: http://gruntjs.com/inside-tasks
[contribution]: CONTRIBUTORS.md
[Vandamme]: https://github.com/tech-angels/vandamme
[EditorConfig]: http://editorconfig.org/
[CHANGELOG]: CHANGELOG.md
[LICENSE]: LICENSE-MIT
