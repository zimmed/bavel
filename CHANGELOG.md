# Changelog

##### Details
 - ...

##### 0.2 Todo
 ...

#### Roadmap
 - -0.2.x - Multiplayer networking support- *This will not be supported by the framework*
 - 0.2.x ... we'll see ...

## History

### 0.1.7 - Hotfix

Fixed bad references in src/index.

### 0.1.6 - Docstrings

Used ESDoc to generate API reference from inline docstrings. Can now view docs
using the [github page](https://zimmed.github.io/bavel).

##### Details
 - Added ESDoc to project
 - Added inline documentation to source code
 - Created build scripts to encorporate test results and changelog into docs

### 0.1.5 - Hotfix

Fixed bad poly-fill for require.ensure in engine.js.

##### Details
 - Fixed bad require.ensure polyfill
 - Added test reports
 - Removed accidental console.log

###  0.1.4 - Unit Test Coverage

Added missing unit test coverage for project.

##### Details
 - Added complete test coverage for Engine Class
 - Added complete test coverage for PlayerController Class
 - Added complete test coverage for StateEventProxy

###  0.1.3 - Hotfix

Fixed test+implementation for bad object-reconfiguration in Entity.meshAsync
getter method. (src/scene/entity/entity.js:33)

###  0.1.2 - Hotfix

Semver mismatch fix

###  0.1.1 - Hotfix

Fixed bad reference at src/engine.js:33

###  0.1.0 - Repository initialization

This is the first semver in the repository.

The majority of the work on the basic framework (Engine/Scene/Entity) have
been done. And all but Engine, PlayerController and StateEventProxy have
full test coverage.

API documentation will be released in the future.

##### Details
 - Added Engine class
 - Added Scene class + Tests
 - Added Entity class + Tests
 - Added PlayerController class
 - Added StateEventProxy utility + Partial Tests
 - Added StateEvents resource + Tests

