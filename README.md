# grunt-bumpx - Extended bump version number
[![Dependency Status](https://gemnasium.com/Ragnarokkr/grunt-bump.png)](https://gemnasium.com/Ragnarokkr/grunt-bump)

## Getting Started
_If you haven't used [grunt][] before, be sure to check out the
[Getting Started][] guide._

From the same directory as your project's [Gruntfile][Getting Started] and
[package.json][], install this plugin with the following command:

```bash
npm install grunt-bumpx --save-dev
```

Once that's done, add this line to your project's Gruntfile:

```js
grunt.loadNpmTasks('grunt-bumpx');
```

If the plugin has been installed correctly, running `grunt --help` at the
command line should list the newly-installed plugin's task or tasks. In
addition, the plugin should be listed in package.json as a `devDependency`,
which ensures that it will be installed whenever the `npm install` command
is run.

## The "bump" task

### Overview
In your project's Gruntfile, add a section named `bump` to the data object
passed into `grunt.initConfig()`.

```js
grunt.initConfig({
    bump: {
        options: {
          // Task-specific options go here.
        },
        files: {
          // Target-specific file lists and/or options go here.
        }
    }
})

// or, by task-specific:

grunt.initConfig({
    bump: {
        foo: {
            options: {
                // Task-specific options go here.
            },
            src: [
                // Target-specific file lists.
            ]
        },
        bar: {
            options: {
                // Task-specific options go here.
            },
            src: [
                // Target-specific file lists.
            ]
        }
    }
})
```

This task allows to bump the version number of the configuration files
(package.json, manifest.json, etc.) in your project.

Only JSON files are supported, and each file **must** have a `version` field
compliant to [SemVer][] guidelines.

### Options

Option | Type | Default | Description
---|:---:|:---:|---
part | `String` | `build` | Indicates which part of the version number to bump. Allowed values are: `major`, `minor`, `patch`, and `build` (case insensitive).
tabSize | `Number` | `4` | Indicates how many spaces (soft tab) to be used to indent the targeted JSON file.
hardTab | `Boolean` | `false` | Indicates whether hard tabs (`\t`) have to be used instead of soft tabs. This option has priority over `options.tabSize`. (If both options are defined and `hardTab` is set to `true`, then hard tabs will be used.)
onBumped | `Function` | `function( data ){}` | Allows to define a callback function to be invoked after each version is bumped into a target file.

The callback will be invoked with an object parameter containing:

Arg | Type | Description
---|:---:|---
grunt | `Object` | the [`grunt`][grunt-object] object
task | `Object` | the [`task`][task] object
index | `Number` | the index of the currently processed file inside the files array
version | `String` | the new version.

### Usage Examples

#### Default Options
In this example the default options are used. Running the task in this way,
the `version` field of each source file will be automatically bumped to the
next build release, using an indentation of 4 spaces.

```js
grunt.initConfig({
    bump: {
        options: {},
        files: [ 'package.json', 'manifest.json' ]
    }
})
```

It's also possible to manually *force* the bumping of a specific part. Just
define the wanted part as parameter of the task on the command line. **The
command line parameter has the priority over default and custom options.**

```bash
grunt bump:foo:major
```

This will run the task with `foo` as target and `major` as part to bump.

```bash
grunt bump::patch
```

This will run the task for all the specified targets using `patch` as part to
bump.

#### Custom Options
In this example, custom options are used. Running the task in this way, the
`version` field of each source file will be bumped to the next minor release
using an indentation of 2 spaces, then the callback function is invoked after
each file has been bumped. Inside the callback function it's possibile to see
how the passed data parameter is used to retrieve useful informations to take
decisions on what to do. (In this example, we presume a `pkg` and `manifest`
which are updated in their `version` field, according to the processed index.)

```js
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

## Contributing (a.k.a. fork/clone/edit/pull request)
If you're interested in contributing to this project, take care to maintain the
existing coding style.

The project follows these standard, so please you do it too:

* [SemVer][] for version numbers
* [Vandamme][] for changelog formatting
* [EditorConfig][] for cross-editor configuration

Add unit tests for any new or changed functionality. Lint and test your code
using [grunt][].

## Release History
See the file [CHANGELOG.md][changelog] distributed with the project.

## License
See the file [LICENSE-MIT][license] distributed with the project.

[grunt]: http://gruntjs.com/
[Getting Started]: http://gruntjs.com/getting-started
[package.json]: https://npmjs.org/doc/json.html
[SemVer]: http://semver.org/
[grunt-object]: http://gruntjs.com/api/grunt#grunt.initconfig
[task]: http://gruntjs.com/inside-tasks
[Vandamme]: https://github.com/tech-angels/vandamme
[EditorConfig]: http://editorconfig.org/
[changelog]: CHANGELOG.md
[license]: LICENSE-MIT
