# grunt-bumpx

> Bump version number (extended)

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

[grunt]: http://gruntjs.com/
[Getting Started]: https://github.com/gruntjs/grunt/blob/devel/docs/getting_started.md
[package.json]: https://npmjs.org/doc/json.html

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

This task allows to bump the version number into the configuration files
(package.json, manifest.json, etc.) of your project.

Only JSON files are supported, and each file **must** have a `version` field
conforming to the [SemVer][] guidelines.

[SemVer]: http://semver.org/

### Options

#### options.part
Type: `String`
Default value: `build`

It indicates which part of the version number to bump. Allowed values are:
`major`, `minor`, `patch`, and `build` (case insensitive).

### Usage Examples

#### Default Options
In this example the default options are used. Running the task in this way,
the `version` field of each source file will be automatically bumped to the
next build release.

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
`version` field of each source file will be bumped to the next minor release.

```js
grunt.initConfig({
  bump: {
    options: {
      part: 'minor'
    },
    files: [ 'package.json', 'manifest.json' ]
  }
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code
using [grunt][].

## Release History
See the file CHANGELOG.md distributed with the project.

## License
See the file LICENSE-MIT distributed with the project.
