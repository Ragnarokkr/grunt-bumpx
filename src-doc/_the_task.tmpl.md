## The "<%= meta.altName %>" task

### Overview
In your project's Gruntfile, add a section named `<%= meta.altName %>` to the data object passed into `grunt.initConfig()`.

```javascript
grunt.initConfig({
  <%= meta.altName %>: {
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