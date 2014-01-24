### Command Line Options

It's also possible to change the default behaviour of the plugin by using the command line options:

Option | Description
---|---
`--level`|Specifies the level we want to increment. Allowed values for this option are the standard `major`, `minor`, `patch`, and `prerelease`. In addition to these values, a further value is supported: if for any reason you need to totally change the version number, just pass to this option the wanted version number which must be a valid SemVer version number. **This option will have precedence over the one defined into the configuration file**.