### Usage Examples

#### Default Options
Running the task in this way, each source file's `patch` level of the `version` field will be automatically incremented, using an indentation of 2 spaces.

```javascript
grunt.initConfig({
  <%= meta.altName %>: {
    options: {},
    src: [ 'package.json', 'manifest.json' ]
  }
})
```

#### Custom level and indentation
The formatting of the target JSON file and the level to increment are easily customizable with:

```javascript
grunt.initConfig({
  <%= meta.altName %>: {
    options: {
      level: 'minor',
      tabSize: 3
    },
    src: [ 'package.json', 'manifest.json' ]
  }
})
```

In this way, the target files will have their `minor` level incremented, and the indentation will be of 3 spaces by soft-tab stop.

#### Custom modifier and event functions
When more fine-grained adjustements are required, it's possibile to deeply customize the plugin's behaviour:

```javascript
grunt.initConfig({
  <%= meta.altName %>: {
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
    src: [ 'package.json', 'manifest.json' ]
  }
})
```

In this example, the `level` option has been customized with a function which strips everything out but the main levels from the version number, and returns a new version by incrementing the `patch` level (using the passed reference to the semver library), concatenating a customized prerelease (`-rc.1`) and build (`Date.now()`) levels.
The custom function assigned to `onBumped`, will check if the processed file is `package.json` and, if so, update the `pkg` key into the Grunt configuration file by reloading the file.

The example is pretty useless on an daily use, but I hope you catch my point and understand the power of this solution.