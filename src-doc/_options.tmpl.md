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