# grunt-bumpx [![Dependency Status](https://gemnasium.com/Ragnarokkr/grunt-bumpx.png)](https://gemnasium.com/Ragnarokkr/grunt-bumpx) 

> Extended bump version number



## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt][grunt] before, be sure to check out the [Getting Started][getting-started] guide, as it explains how to create a [Gruntfile][] as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-bumpx --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```javascript
grunt.loadNpmTasks('grunt-bumpx');
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

**bumpx** allows to bump the version number of the configuration files (package.json, manifest.json, etc.) in your project. Only JSON files are supported, and each file **must** have a `version` field compliant to [SemVer][] guidelines.

### Options

options.* | Type | Default | Description
---|:---:|:---:|---
part|`String`|`'build'`|the part of version number to bump. Allowed values are: `major`, `minor`, `patch`, and `build` (case insensitive).
persistBuild|`Boolean`|`false`|option to persist and increment the build number when bumping `major`, `minor` or `patch`.
tabSize|`Number`|`4`|number of spaces (soft tab) to be used to indent the targeted JSON file.
hardTab|`Boolean`|`false`|whether hard tabs (`\t`) have to be used instead of soft tabs. This option has priority over `options.tabSize`. (If both options are defined and `hardTab` is set to `true`, then hard tabs will be used.)
onBumped|`Function`|`function( data ){}`|callback function to be invoked after each bumped version (called for each target).

#### The callback function

The callback function will be invoked each time a traget file is bumped, with an object parameter containing:

Field | Type | Description
---|:---:|---
grunt|`Object`|the [`grunt`][grunt-object] object
task|`Object`|the [`task`][task] object
index|`Number`|the index of the currently processed file inside the files array
version|`String`|the new version

### Usage Examples

#### Default Options
Running the task in this way, the `version` field of each source file will be automatically bumped to the next build release, using an indentation of 4 spaces.

```javascript
grunt.initConfig({
    bump: {
        options: {},
        files: [ 'package.json', 'manifest.json' ]
    }
})
```

It's also possible to manually *force* the bumping of a specific part. Just define the wanted part as parameter of the task on the command line. **The command line parameter has the priority over default and custom options.**

```shell
$ grunt bump:foo:major
```

This will run the task with `foo` as target and `major` as part to bump.

```shell
$ grunt bump::patch
```

This will run the task for all the specified targets using `patch` as part to bump.

#### Custom Options
Running the task in this way, the `version` field of each traget file will be bumped to the next minor release
using an indentation of 2 spaces, then the callback function is invoked after each file has been bumped. Inside the callback function it's possibile to see how the passed data parameter is used to retrieve useful informations to take
decisions on what to do. (In this example, we presume a `pkg` and `manifest` which are updated in their `version` field, according to the processed index.)

```javascript
grunt.initConfig({
    bump: {
        options: {
            part: 'minor',
            tabSize: 2,
            onBumped: function( data ) {
                if ( data.index === 0 ) {
                    grunt.config( 'pkg.version', data.version );
                } else {
                    grunt.config( 'manifest.version', data.version );
                }
            }
        },
        files: [ 'package.json', 'manifest.json' ]
    }
})
```

## Contributing

Any contribution to improve the project and/or expand it is welcome.

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

## Release History
See the [CHANGELOG][] distributed with the project.

## License
See the [LICENSE][] distributed with the project.


[grunt]: http://gruntjs.com/
[Getting Started]: http://gruntjs.com/getting-started
[package.json]: https://npmjs.org/doc/json.html
[SemVer]: http://semver.org/
[grunt-object]: http://gruntjs.com/api/grunt#grunt.initconfig
[task]: http://gruntjs.com/inside-tasks
[Vandamme]: https://github.com/tech-angels/vandamme
[EditorConfig]: http://editorconfig.org/
[CHANGELOG]: CHANGELOG.md
[LICENSE]: LICENSE-MIT

