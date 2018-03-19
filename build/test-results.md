# Test Results
**Ran 103 Tests (72 Suites) in 696ms.**
 - Run Date/Time: 2018-03-19T01:24:03.073Z
 - 103 tests passed
 - 0 tests failed
 - 0 tests skipped

#### The Engine Class 
   - should be a singleton class(4ms) ... OK

#### The Engine Class init method 
   - should initialize a new Engine instance if none exist by calling the Engine constructor, and kicking off the resourceLoader(3ms) ... OK
   - should return the engine instance if it has already been initialized(0ms) ... OK

#### The Engine Class constructor 
   - should create a new Engine instance with EventProxied properties (fps, loading) and standard enumerable properties (scene, running, settings)(2ms) ... OK

#### The Engine Class Engine instance GL getter method 
   - should return the read-only GraphicsLibary once loaded(1ms) ... OK

#### The Engine Class Engine instance baby getter method 
   - should return the read-only GraphicsLibary Engine instance once mounted(1ms) ... OK

#### The Engine Class Engine instance canvas getter method 
   - should return the read-only canvas element once mounted(0ms) ... OK

#### The Engine Class Engine instance provider getter method 
   - should return the read-only ResourceProvider once loaded(0ms) ... OK

#### The Engine Class Engine instance ctrl getter method 
   - should return the read-only PlayerController instance(0ms) ... OK

#### The Engine Class Engine instance logger getter method 
   - should return the read-only logger instance(0ms) ... OK

#### The Engine Class Engine instance terrain getter and setter methods 
   - should set and get the engine's terrain entity(1ms) ... OK

#### The Engine Class Engine instance mount method 
   - should return a promise that mounts the engine to the provided canvas element after the ResourceProvider and GraphicsLibrary have been loaded (resolves to self)(1ms) ... OK

#### The Engine Class Engine instance dismount method 
   - should return a promise that stops the engine render process when running, dismounts and deletes the scene, along with the GraphicsLibrary Engine instance and canvas element before resolving to self(0ms) ... OK
   - should return a promise dismounts and deletes the scene, along with the GraphicsLibrary Engine instance and canvas element before resolving to self(0ms) ... OK

#### The Engine Class Engine instance run method 
   - should return a promise that initializes the scene with the provided entities, attaches event listeners to the canvas element, and begins the main render/update loop before resolving to self(**103**ms) ... OK
   - should return a promise that attaches event listeners to the canvas element and begins the main render/update loop without adding new entites, when none provided, before resolving to self(1ms) ... OK
   - should return a promise that resolves to self with engine is already running(0ms) ... OK
   - should return a promise that resolves to self with engine is not in the correct loading state(0ms) ... OK

#### The Engine Class Engine instance stop method when engine is running 
   - should stop the render/update loop if running(0ms) ... OK

#### The Engine Class Engine instance stop method when engine is not running 
   - should just return self when engine is not running(0ms) ... OK

#### The Engine Class Engine instance resize method 
   - should call the resize method of the GraphicsLibrary engine instance(0ms) ... OK

#### The Engine Class Engine instance toVector method 
   - should convert a plain object with (x,y,z) properties into a 3D Vector object(0ms) ... OK
   - should return a new zero vector by default(0ms) ... OK

#### The Engine Class Engine instance emitDebugEvent method 
   - should emit a state event if settings.debug = true(0ms) ... OK
   - should not emit an event if settings.debug = false(0ms) ... OK

#### The Engine Class Engine instance onDebugEvent method 
   - should add an event listener if settings.debug = true(0ms) ... OK
   - should not add an event listener if settings.debug = false(0ms) ... OK

#### The Engine Class Engine instance emitEvent method 
   - should unconditionally emit a state event(0ms) ... OK

#### The Engine Class Engine instance onEvent method 
   - should unconditionally listen to a state event(0ms) ... OK

#### The Engine Class Engine instance registerKeyAction method 
   - should register event listeners to fire the handler provided for the key event specified, onKeyUp or onKeyDown(1ms) ... OK
   - should register an event listener for the onKeyUp event for the provided key if the upHandler argument is set(0ms) ... OK
   - should register an event listener for the onKeyDown event for the provided key if the downHandler argument is set(1ms) ... OK

#### The Engine Class Engine instance registerMouseEventsForEntity method 
   - should set the hover cursor for the entity's primary mesh if cursor arugment is provided(1ms) ... OK
   - should set an entityClick event listener on the entity's primary mesh if click argument is provided(0ms) ... OK
   - should set an entityAltClick event listener on the entity's primary mesh if the altClick argument is provided(1ms) ... OK
   - should set an entityOver event listener on the entity's primary mesh if the over argument is provided(1ms) ... OK
   - should set an entityOut event listener on the entity's primrary mesh if the out argument is provided(0ms) ... OK

#### The Engine Class Engine instance deregisterMouseEventsForEntity method 
   - should remove all click/altClick/over/out event listeners for the given entity's primary mesh, and reset the hover cursor style(1ms) ... OK

#### The Entity Class 
   - should be a static class(0ms) ... OK

#### The Entity Class create method 
   - should get the entity data for the provided entity ID, create a new entity object with that data, merged with any extra data provided, then return the updateComponents method with the new object and the aggregated component data (which is a promise that eventually resolves to entity)(2ms) ... OK

#### The Entity Class create method Entity object 
   - should have id and uid properties(0ms) ... OK
   - should have a mesh method that returns the component for the _primaryMesh key, if set(0ms) ... OK
   - should have a meshAsync property that is configurable until it's returned promise resolves to the entity mesh once available, then redefining the property to resolve directly to the mesh, and no longer reconfigurable(78ms) ... OK
   - should have a tick setter that will add a new tick method when the assignment is an object with both id and tick properties, or delete an existing tick when only an id property is in the assignment object(0ms) ... OK
   - should have a tick getter that returns a function that will fire each registered component tick method(1ms) ... OK

#### The Entity Class updateComponent method 
   - should return a promise that calls the update class method for the given component, stores the updated result to the entity at the property name that matches the component ID, and finally resolves to the newly- updated component(1ms) ... OK

#### The Entity Class updateComponents method 
   - should return a promise that sequentially updates/creates each component from the provided data using the updateComponent method, then resolve to the updated entity(1ms) ... OK

#### The Entity Class dismountComponent method 
   - should dismount the specified component using it's class dismount method and assigning the result (null) to the component property of the entity(0ms) ... OK

#### The Entity Class update method 
   - should create a new entity if none provided(1ms) ... OK
   - should call updateComponents for existing entity(0ms) ... OK

#### The Entity Class dismount method 
   - should dismount each component then return null(0ms) ... OK

#### The Entity Class tick method 
   - should call the tick method on the provided entity instance(0ms) ... OK

#### PlayerController Class 
   - should be a singleton class(0ms) ... OK

#### PlayerController Class round function 
   - should round a float to the second decimal place(0ms) ... OK

#### PlayerController Class getTime method 
   - should return a 24hr timestamp of HH:mm:ss for a given date object, or the current time if no argument supplied.(3ms) ... OK

#### PlayerController Class constructor 
   - should create a new PlayerController instance with proxied properties for messages, player, and target, as well as an engine getter(0ms) ... OK

#### PlayerController Class PlayerController instance setup method 
   - should call registerKeyActions for the settings.input.keys configuration(1ms) ... OK

#### PlayerController Class PlayerController instance registerKeyActions method 
   - should call engine.registerKeyAction for each keyHandler passed in(0ms) ... OK

#### PlayerController Class PlayerController instance message method 
   - should functionally update this.messages by adding the new message from the provided data at the front of messages(2ms) ... OK
   - should trim messages to the provided max(1ms) ... OK

#### PlayerController Class PlayerController instance mClick method 
   - should not throw an error when a proper event is passed(0ms) ... OK
   - should throw an error when an improper event is passed(0ms) ... OK

#### PlayerController Class PlayerController instance mAltClick method 
   - should not throw an error when a proper event is passed(0ms) ... OK
   - should throw an error when an improper event is passed(0ms) ... OK

#### PlayerController Class PlayerController instance mWheel method 
   - should not throw an error when a proper event is passed(0ms) ... OK
   - should throw an error when an improper event is passed(0ms) ... OK

#### PlayerController Class PlayerController instance mOver method 
   - should not throw an error when a proper event is passed(0ms) ... OK
   - should throw an error when an improper event is passed(0ms) ... OK

#### PlayerController Class PlayerController instance mOut method 
   - should not throw an error when a proper event is passed(0ms) ... OK
   - should throw an error when an improper event is passed(0ms) ... OK

#### PlayerController Class PlayerController instance entityOver method 
   - should set the controller's target to the provided entity(0ms) ... OK
   - should throw an error when an invalid entity or event is provided(0ms) ... OK

#### PlayerController Class PlayerController instance entityOut method 
   - should remove the current target if the entity passed is the current target(0ms) ... OK
   - should not remove the current target if the entity passed is not the current target(0ms) ... OK
   - should throw an error when an invalid entity or event is provided(1ms) ... OK

#### PlayerController Class PlayerController instance entityClick method 
   - should not throw an error when a proper entity and event is passed(0ms) ... OK
   - should throw an error when an improper entity or event is passed(1ms) ... OK

#### PlayerController Class PlayerController instance entityAltClick method 
   - should not throw an error when a proper entity and event is passed(0ms) ... OK
   - should throw an error when an improper entity or event is passed(0ms) ... OK

#### The Scene Class 
   - should be a singleton(0ms) ... OK

#### The Scene Class Constructor 
   - should create a new object with an empty children map and a null activeCamera property, as well as a non-enumerable _baby property(0ms) ... OK

#### The Scene Class scene instance baby getter method 
   - should get the scene._baby property(0ms) ... OK

#### The Scene Class scene instance mount method 
   - should set the scene._baby property to a new BabylonJS Scene(0ms) ... OK

#### The Scene Class scene instance dismount method 
   - should dismount each child in scene.children then delete the _baby property before returning null(1ms) ... OK

#### The Scene Class scene instance getEntity method 
   - should get a child entity by uid(0ms) ... OK

#### The Scene Class scene instance updateEntity method 
   - should return a promise that updates an entity by uid with Entity.update, then saves the updated entity back in children(1ms) ... OK

#### The Scene Class scene instance updateEntities method 
   - should return a promise that sequentially updates/creates each entity from the provided data using the updateEntity method, then resolve to the updated scene(1ms) ... OK

#### The Scene Class scene instance removeEntity method 
   - should call Entity.dismount for the entity at the provided uid, and replace the entity in scene.children with the result (null)(1ms) ... OK

#### The Scene Class scene instance tick method 
   - should call Entity.tick for each entity in its children(0ms) ... OK

#### StateEventProxy StateProxy exported function (integration tests) 
   - should assign proxy properties from a list of keys to the provided object and emit state events when a property is reassigned(3ms) ... OK
   - should assign proxy properties from a map of keys and values to the provided object and emit state events when a property is reassigned(3ms) ... OK

#### StateEventProxy StateEventProxy Class isMutateFn method 
   - should return true if provided key is an Array member-function that mutates itself(1ms) ... OK
   - should return false if provided key is not an Array member-function that mutates itself(0ms) ... OK

#### StateEventProxy StateEventProxy Class emit method 
   - should call events.emit if the scope is not disabled(2ms) ... OK
   - should not call events.emit if the scope is disabled(2ms) ... OK

#### StateEventProxy StateEventProxy Class proxifyProperty method 
   - should assign to the provided object a wrapped property that, when set, will emit a state event(2ms) ... OK
   - should assign to the provided object a deeply-proxied value when the value to be assigned is an array and deep=true(3ms) ... OK
   - should assign to the provided object a deeply-proxied value when the value to be assigned is an object and deep=true(3ms) ... OK
   - should assign to the provided object a wrapped property that is not enumerable when enumerable=false(2ms) ... OK

#### StateEventProxy StateEventProxy Class buildProxyObject method 
   - should return an object that has proxified properties forEach each property on the original object(1ms) ... OK

#### StateEventProxy StateEventProxy Class buildProxyArray method 
   - should create and return an Array Proxy that wraps sets to be deeply-watched for new values, and gets to be watched if a mutation method is requested(3ms) ... OK

#### StateEventManager 
   - should have emit and on methods for dispatching and subscribing to events(0ms) ... OK
   - should dispatch an event with the emit method and callback the events listener for that event, registered with the on method(1ms) ... OK
