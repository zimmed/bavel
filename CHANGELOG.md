# Changelog
### 0.1.6 - Docstrings

...

##### Details
 - ...

##### 0.1 Todo
 - Add in-line documentation to code
 - Generate API documentation

#### Roadmap
 - 0.2.0 - Basic API documentation
 - 0.3.0 - Multiplayer networking support
 - 0.4.0 - Full API documentation
 -  ... we'll see ...

## History

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

