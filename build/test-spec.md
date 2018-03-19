# TOC
   - [The Engine Class](#the-engine-class)
     - [init method](#the-engine-class-init-method)
     - [constructor](#the-engine-class-constructor)
     - [Engine instance](#the-engine-class-engine-instance)
       - [GL getter method](#the-engine-class-engine-instance-gl-getter-method)
       - [baby getter method](#the-engine-class-engine-instance-baby-getter-method)
       - [canvas getter method](#the-engine-class-engine-instance-canvas-getter-method)
       - [provider getter method](#the-engine-class-engine-instance-provider-getter-method)
       - [ctrl getter method](#the-engine-class-engine-instance-ctrl-getter-method)
       - [logger getter method](#the-engine-class-engine-instance-logger-getter-method)
       - [terrain getter and setter methods](#the-engine-class-engine-instance-terrain-getter-and-setter-methods)
       - [mount method](#the-engine-class-engine-instance-mount-method)
       - [dismount method](#the-engine-class-engine-instance-dismount-method)
       - [run method](#the-engine-class-engine-instance-run-method)
       - [stop method](#the-engine-class-engine-instance-stop-method)
         - [when engine is running](#the-engine-class-engine-instance-stop-method-when-engine-is-running)
         - [when engine is not running](#the-engine-class-engine-instance-stop-method-when-engine-is-not-running)
       - [resize method](#the-engine-class-engine-instance-resize-method)
       - [toVector method](#the-engine-class-engine-instance-tovector-method)
       - [emitDebugEvent method](#the-engine-class-engine-instance-emitdebugevent-method)
       - [onDebugEvent method](#the-engine-class-engine-instance-ondebugevent-method)
       - [emitEvent method](#the-engine-class-engine-instance-emitevent-method)
       - [onEvent method](#the-engine-class-engine-instance-onevent-method)
       - [registerKeyAction method](#the-engine-class-engine-instance-registerkeyaction-method)
       - [registerMouseEventsForEntity method](#the-engine-class-engine-instance-registermouseeventsforentity-method)
       - [deregisterMouseEventsForEntity method](#the-engine-class-engine-instance-deregistermouseeventsforentity-method)
   - [The Entity Class](#the-entity-class)
     - [create method](#the-entity-class-create-method)
       - [Entity object](#the-entity-class-create-method-entity-object)
     - [updateComponent method](#the-entity-class-updatecomponent-method)
     - [updateComponents method](#the-entity-class-updatecomponents-method)
     - [dismountComponent method](#the-entity-class-dismountcomponent-method)
     - [update method](#the-entity-class-update-method)
     - [dismount method](#the-entity-class-dismount-method)
     - [tick method](#the-entity-class-tick-method)
   - [PlayerController Class](#playercontroller-class)
     - [round function](#playercontroller-class-round-function)
     - [getTime method](#playercontroller-class-gettime-method)
     - [constructor](#playercontroller-class-constructor)
     - [PlayerController instance](#playercontroller-class-playercontroller-instance)
       - [setup method](#playercontroller-class-playercontroller-instance-setup-method)
       - [registerKeyActions method](#playercontroller-class-playercontroller-instance-registerkeyactions-method)
       - [message method](#playercontroller-class-playercontroller-instance-message-method)
       - [mClick method](#playercontroller-class-playercontroller-instance-mclick-method)
       - [mAltClick method](#playercontroller-class-playercontroller-instance-maltclick-method)
       - [mWheel method](#playercontroller-class-playercontroller-instance-mwheel-method)
       - [mOver method](#playercontroller-class-playercontroller-instance-mover-method)
       - [mOut method](#playercontroller-class-playercontroller-instance-mout-method)
       - [entityOver method](#playercontroller-class-playercontroller-instance-entityover-method)
       - [entityOut method](#playercontroller-class-playercontroller-instance-entityout-method)
       - [entityClick method](#playercontroller-class-playercontroller-instance-entityclick-method)
       - [entityAltClick method](#playercontroller-class-playercontroller-instance-entityaltclick-method)
   - [The Scene Class](#the-scene-class)
     - [Constructor](#the-scene-class-constructor)
     - [scene instance](#the-scene-class-scene-instance)
       - [baby getter method](#the-scene-class-scene-instance-baby-getter-method)
       - [mount method](#the-scene-class-scene-instance-mount-method)
       - [dismount method](#the-scene-class-scene-instance-dismount-method)
       - [getEntity method](#the-scene-class-scene-instance-getentity-method)
       - [updateEntity method](#the-scene-class-scene-instance-updateentity-method)
       - [updateEntities method](#the-scene-class-scene-instance-updateentities-method)
       - [removeEntity method](#the-scene-class-scene-instance-removeentity-method)
       - [tick method](#the-scene-class-scene-instance-tick-method)
   - [StateEventProxy](#stateeventproxy)
     - [StateProxy exported function (integration tests)](#stateeventproxy-stateproxy-exported-function-integration-tests)
     - [StateEventProxy Class](#stateeventproxy-stateeventproxy-class)
       - [isMutateFn method](#stateeventproxy-stateeventproxy-class-ismutatefn-method)
       - [emit method](#stateeventproxy-stateeventproxy-class-emit-method)
       - [proxifyProperty method](#stateeventproxy-stateeventproxy-class-proxifyproperty-method)
       - [buildProxyObject method](#stateeventproxy-stateeventproxy-class-buildproxyobject-method)
       - [buildProxyArray method](#stateeventproxy-stateeventproxy-class-buildproxyarray-method)
   - [StateEventManager](#stateeventmanager)
<a name=""></a>
 
<a name="the-engine-class"></a>
# The Engine Class
should be a singleton class.

```js
var engine = new _Engine2.default();
expect(function () {
    return engine = new _Engine2.default();
}).to.throw(Error);
```

<a name="the-engine-class-init-method"></a>
## init method
should initialize a new Engine instance if none exist by calling the
        Engine constructor, and kicking off the resourceLoader.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

should return the engine instance if it has already been initialized.

```js
var engine = _Engine2.default.init(params.logger, params.resourceLoader, undefined, params.settings);
var ngn = void 0;
params.resourceLoader.reset();
_Engine2.default.constructorHelper.reset();
ngn = _Engine2.default.init();
expect(ngn).to.exist;
expect(ngn).to.equal(engine);
expect(params.resourceLoader.callCount).to.equal(0);
expect(_Engine2.default.constructorHelper.callCount).to.equal(0);
```

<a name="the-engine-class-constructor"></a>
## constructor
should create a new Engine instance with EventProxied properties
        (fps, loading) and standard enumerable properties (scene, running,
        settings).

```js
var engine = new _Engine2.default(params.logger, undefined, params.settings);
expect(engine).to.exist;
expect(_StateEventProxy2.default.create.callCount).to.equal(1);
expect(_StateEventProxy2.default.create.calledWithExactly(engine, 'engine', { fps: 0, loading: _Engine.LoadStates.BOOT }));
expect(engine).to.have.property('fps').that.equals(0);
expect(engine).to.have.property('loading').that.equals(_Engine.LoadStates.BOOT);
expect(engine).to.have.property('scene').that.equals(null);
expect(engine).to.have.property('running').that.equals(false);
expect(engine).to.have.property('settings').that.equals(params.settings);
var _getPrivateDataForTes2 = (0, _Engine.getPrivateDataForTest)(),
    logger = _getPrivateDataForTes2.logger,
    playerController = _getPrivateDataForTes2.playerController;
expect(logger).to.equal(params.logger);
expect(playerController).to.exist;
expect(playerController.constructor).to.have.been.calledWithExactly(engine);
```

<a name="the-engine-class-engine-instance"></a>
## Engine instance
<a name="the-engine-class-engine-instance-gl-getter-method"></a>
### GL getter method
should return the read-only GraphicsLibary once loaded.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

<a name="the-engine-class-engine-instance-baby-getter-method"></a>
### baby getter method
should return the read-only GraphicsLibary Engine instance once
            mounted.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

<a name="the-engine-class-engine-instance-canvas-getter-method"></a>
### canvas getter method
should return the read-only canvas element once mounted.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

<a name="the-engine-class-engine-instance-provider-getter-method"></a>
### provider getter method
should return the read-only ResourceProvider once loaded.

```js
var provider = engine.provider;
expect(engine.provider).to.not.equal(null);
expect(engine.provider).to.equal(params.provider);
```

<a name="the-engine-class-engine-instance-ctrl-getter-method"></a>
### ctrl getter method
should return the read-only PlayerController instance.

```js
var ctrl = engine.ctrl;
expect(ctrl).to.not.equal(null);
expect(ctrl.constructor).to.have.been.calledWithExactly(engine);
```

<a name="the-engine-class-engine-instance-logger-getter-method"></a>
### logger getter method
should return the read-only logger instance.

```js
var logger = engine.logger;
expect(logger).to.not.equal(null);
expect(logger).to.equal(params.logger);
```

<a name="the-engine-class-engine-instance-terrain-getter-and-setter-methods"></a>
### terrain getter and setter methods
should set and get the engine's terrain entity.

```js
var terrain = {};
var t = engine.terrain;
expect(t).to.equal(null);
engine.terrain = terrain;
t = engine.terrain;
expect(t).to.equal(terrain);
```

<a name="the-engine-class-engine-instance-mount-method"></a>
### mount method
should return a promise that mounts the engine to the provided
            canvas element after the ResourceProvider and GraphicsLibrary have
            been loaded (resolves to self).

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

<a name="the-engine-class-engine-instance-dismount-method"></a>
### dismount method
should return a promise that stops the engine render process when
            running, dismounts and deletes the scene, along with the GraphicsLibrary
            Engine instance and canvas element before resolving to self.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

should return a promise dismounts and deletes the scene, along
            with the GraphicsLibrary Engine instance and canvas element before
            resolving to self.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

<a name="the-engine-class-engine-instance-run-method"></a>
### run method
should return a promise that initializes the scene with the provided
            entities, attaches event listeners to the canvas element, and begins
            the main render/update loop before resolving to self.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

should return a promise that attaches event listeners to the canvas
            element and begins the main render/update loop without adding new
            entites, when none provided, before resolving to self.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

should return a promise that resolves to self with engine is already
            running.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

should return a promise that resolves to self with engine is not in
            the correct loading state.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

<a name="the-engine-class-engine-instance-stop-method"></a>
### stop method
<a name="the-engine-class-engine-instance-stop-method-when-engine-is-running"></a>
#### when engine is running
should stop the render/update loop if running.

```js
var e = void 0;
expect(engine.running).to.equal(true);
e = engine.stop();
expect(e).to.equal(engine);
expect(engine.running).to.equal(false);
expect(engine.loading).to.equal(_Engine.LoadStates.DATA);
expect(engine.baby.stopRenderLoop.callCount).to.equal(1);
```

<a name="the-engine-class-engine-instance-stop-method-when-engine-is-not-running"></a>
#### when engine is not running
should just return self when engine is not running.

```js
var e = void 0;
expect(engine.running).to.equal(false);
e = engine.stop();
expect(e).to.equal(engine);
expect(engine.loading).to.equal(_Engine.LoadStates.DATA);
expect(engine.baby.stopRenderLoop.callCount).to.equal(0);
```

<a name="the-engine-class-engine-instance-resize-method"></a>
### resize method
should call the resize method of the GraphicsLibrary engine
            instance.

```js
engine.resize();
expect(engine.baby.resize.callCount).to.equal(1);
```

<a name="the-engine-class-engine-instance-tovector-method"></a>
### toVector method
should convert a plain object with (x,y,z) properties into a 3D
            Vector object.

```js
var v = engine.toVector({ x: 1, y: 3.3, z: 4 });
expect(v).to.exist;
expect(BabylonJS.Vector3.callCount).to.equal(1);
expect(BabylonJS.Vector3.calledWithExactly(1, 3.3, 4)).to.equal(true);
```

should return a new zero vector by default.

```js
var v = engine.toVector();
expect(v).to.exist;
expect(BabylonJS.Vector3.callCount).to.equal(1);
expect(BabylonJS.Vector3.calledWithExactly(0, 0, 0)).to.equal(true);
```

<a name="the-engine-class-engine-instance-emitdebugevent-method"></a>
### emitDebugEvent method
should emit a state event if settings.debug = true.

```js
engine.emitDebugEvent('test', {});
expect(engine.emitEvent.callCount).to.equal(1);
expect(engine.emitEvent.calledWithExactly('test', {})).to.equal(true);
```

should not emit an event if settings.debug = false.

```js
params.settings.debug = false;
engine.emitDebugEvent('test', {});
expect(engine.emitEvent.callCount).to.equal(0);
```

<a name="the-engine-class-engine-instance-ondebugevent-method"></a>
### onDebugEvent method
should add an event listener if settings.debug = true.

```js
engine.onDebugEvent('test', _lodash2.default);
expect(engine.onEvent.callCount).to.equal(1);
expect(engine.onEvent.calledWithExactly('test', _lodash2.default)).to.equal(true);
```

should not add an event listener if settings.debug = false.

```js
params.settings.debug = false;
engine.onDebugEvent('test', _lodash2.default);
expect(engine.onEvent.callCount).to.equal(0);
```

<a name="the-engine-class-engine-instance-emitevent-method"></a>
### emitEvent method
should unconditionally emit a state event.

```js
engine.emitEvent('test', 40, {});
expect(_stateEvents2.default.emit.callCount).to.equal(1);
expect(_stateEvents2.default.emit.calledWithExactly('test', 40, {})).to.equal(true);
```

<a name="the-engine-class-engine-instance-onevent-method"></a>
### onEvent method
should unconditionally listen to a state event.

```js
engine.onEvent('test', _lodash2.default);
expect(_stateEvents2.default.on.callCount).to.equal(1);
expect(_stateEvents2.default.on.calledWithExactly('test', _lodash2.default)).to.equal(true);
```

<a name="the-engine-class-engine-instance-registerkeyaction-method"></a>
### registerKeyAction method
should register event listeners to fire the handler provided for
            the key event specified, onKeyUp or onKeyDown.

```js
engine.registerKeyAction('f', { handler: handler });
expect(engine.scene.baby.actionManager).to.exist;
expect(BabylonJS.ActionManager.callCount).to.equal(1);
expect(BabylonJS.ActionManager.calledWithExactly(engine.scene.baby)).to.equal(true);
expect(engine.scene.baby.actionManager.registerAction.callCount).to.equal(2);
expect(BabylonJS.ExecuteCodeAction.callCount).to.equal(2);
expect(BabylonJS.ExecuteCodeAction.calledWith({ trigger: 'down', parameter: 'f' })).to.equal(true);
expect(BabylonJS.ExecuteCodeAction.calledWith({ trigger: 'up', parameter: 'f' })).to.equal(true);
```

should register an event listener for the onKeyUp event for the
            provided key if the upHandler argument is set.

```js
engine.registerKeyAction('g', { upHandler: handler });
expect(engine.scene.baby.actionManager).to.exist;
expect(BabylonJS.ActionManager.callCount).to.equal(1);
expect(BabylonJS.ActionManager.calledWithExactly(engine.scene.baby)).to.equal(true);
expect(engine.scene.baby.actionManager.registerAction.callCount).to.equal(1);
expect(BabylonJS.ExecuteCodeAction.callCount).to.equal(1);
expect(BabylonJS.ExecuteCodeAction.calledWith({ trigger: 'up', parameter: 'g' })).to.equal(true);
```

should register an event listener for the onKeyDown event for the
            provided key if the downHandler argument is set.

```js
engine.registerKeyAction('h', { downHandler: handler });
expect(engine.scene.baby.actionManager).to.exist;
expect(BabylonJS.ActionManager.callCount).to.equal(1);
expect(BabylonJS.ActionManager.calledWithExactly(engine.scene.baby)).to.equal(true);
expect(engine.scene.baby.actionManager.registerAction.callCount).to.equal(1);
expect(BabylonJS.ExecuteCodeAction.callCount).to.equal(1);
expect(BabylonJS.ExecuteCodeAction.calledWith({ trigger: 'down', parameter: 'h' })).to.equal(true);
```

<a name="the-engine-class-engine-instance-registermouseeventsforentity-method"></a>
### registerMouseEventsForEntity method
should set the hover cursor for the entity's primary mesh if cursor
            arugment is provided.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

should set an entityClick event listener on the entity's primary
            mesh if click argument is provided.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

should set an entityAltClick event listener on the entity's primary
            mesh if the altClick argument is provided.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

should set an entityOver event listener on the entity's primary
            mesh if the over argument is provided.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

should set an entityOut event listener on the entity's primrary
            mesh if the out argument is provided.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

<a name="the-engine-class-engine-instance-deregistermouseeventsforentity-method"></a>
### deregisterMouseEventsForEntity method
should remove all click/altClick/over/out event listeners for the
            given entity's primary mesh, and reset the hover cursor style.

```js
expect(baby.actionManager.actions).to.have.length(4);
engine.deregisterMouseEventsForEntity(entity);
expect(baby.actionManager.actions).to.have.length(0);
expect(baby.actionManager.hoverCursor).to.equal('default');
```

<a name="the-entity-class"></a>
# The Entity Class
should be a static class.

```js
expect(function () {
    return new _Entity2.default();
}).to.throw(Error);
```

<a name="the-entity-class-create-method"></a>
## create method
should get the entity data for the provided entity ID, create a new
        entity object with that data, merged with any extra data provided, then
        return the updateComponents method with the new object and the aggregated
        component data (which is a promise that eventually resolves to entity).

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

<a name="the-entity-class-create-method-entity-object"></a>
### Entity object
should have id and uid properties.

```js
expect(entity).to.have.property('id').that.equals('test');
expect(entity).to.have.property('uid').that.equals('bar');
```

should have a mesh method that returns the component for the
            _primaryMesh key, if set.

```js
expect(entity).to.have.property('mesh');
expect(entity.mesh).to.not.exist;
entity.TestComponent = _comp;
expect(entity.mesh).to.exist;
expect(entity.mesh).to.equal(_comp);
```

should have a meshAsync property that is configurable until
            it's returned promise resolves to the entity mesh once available, then
            redefining the property to resolve directly to the mesh, and no longer
            reconfigurable.

```js
var count = 0;
entity.meshAsync.then(function (mesh) {
    expect(mesh).to.exist;
    expect(mesh).to.equal(_comp);
    count++;
}).catch(done);
entity.meshAsync.then(function (mesh) {
    expect(mesh).to.exist;
    expect(mesh).to.equal(_comp);
    count++;
}).catch(done);
wait(10).then(function () {
    return expect(count).to.equal(0);
}).then(function () {
    return entity.TestComponent = _comp;
}).then(function () {
    return wait(10);
}).then(function () {
    return entity.meshAsync;
}).then(function (mesh) {
    expect(count).to.equal(2);
    expect(mesh).to.exist;
    expect(mesh).to.equal(_comp);
    done();
}).catch(done);
```

should have a tick setter that will add a new tick method when the
            assignment is an object with both id and tick properties, or delete
            an existing tick when only an id property is in the assignment object.

```js
var cb = 0;
var fn = function fn() {
    return cb++;
};
entity.tick = { id: 'Test', tick: fn };
expect(cb).to.equal(0);
entity.tick();
expect(cb).to.equal(1);
entity.tick();
expect(cb).to.equal(2);
entity.tick = { id: 'Test' };
entity.tick();
expect(cb).to.equal(2);
```

should have a tick getter that returns a function that will fire
            each registered component tick method.

```js
var a = 0,
    b = 0,
    c = 0;
var fnA = function fnA() {
    return a++;
};
var fnB = function fnB() {
    return b++;
};
var fnC = function fnC() {
    return c++;
};
entity.tick = { id: 'A', tick: fnA };
entity.tick = { id: 'B', tick: fnB };
entity.tick = { id: 'C', tick: fnC };
entity.tick();
expect([a, b, c]).to.eql([1, 1, 1]);
entity.tick = { id: 'A' };
entity.tick = { id: 'B', tick: fnC };
entity.tick();
expect([a, b, c]).to.eql([1, 1, 3]);
entity.tick();
expect([a, b, c]).to.eql([1, 1, 5]);
```

<a name="the-entity-class-updatecomponent-method"></a>
## updateComponent method
should return a promise that calls the update class method for the
        given component, stores the updated result to the entity at the property
        name that matches the component ID, and  finally resolves to the newly-
        updated component.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

<a name="the-entity-class-updatecomponents-method"></a>
## updateComponents method
should return a promise that sequentially updates/creates each component
        from the provided data using the updateComponent method, then resolve
        to the updated entity.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

<a name="the-entity-class-dismountcomponent-method"></a>
## dismountComponent method
should dismount the specified component using it's class dismount
        method and assigning the result (null) to the component property of the
        entity.

```js
var ret = _Entity2.default.dismountComponent(engine, entity, 'TestComponent');
expect(ret).to.equal(null);
expect(entity.TestComponent).to.equal(null);
expect(engine.provider.getComponent.callCount).to.equal(1);
```

<a name="the-entity-class-update-method"></a>
## update method
should create a new entity if none provided.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

should call updateComponents for existing entity.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

<a name="the-entity-class-dismount-method"></a>
## dismount method
should dismount each component then return null.

```js
var ret = _Entity2.default.dismount(engine, entity);
expect(ret).to.equal(null);
expect(entity.id).to.equal('k');
expect(_Entity2.default.dismountComponent.callCount).to.equal(2);
```

<a name="the-entity-class-tick-method"></a>
## tick method
should call the tick method on the provided entity instance.

```js
_Entity2.default.tick(engine, entity, 100, 10);
expect(entity.tick.callCount).to.equal(1);
expect(entity.tick).to.have.been.calledWithExactly(engine, 100, 10);
```

<a name="playercontroller-class"></a>
# PlayerController Class
should be a singleton class.

```js
var pc = new _PlayerController2.default();
expect(function () {
    return pc = new _PlayerController2.default();
}).to.throw(Error);
```

<a name="playercontroller-class-round-function"></a>
## round function
should round a float to the second decimal place.

```js
expect((0, _PlayerController.round)(Math.PI)).to.equal(3.14);
expect((0, _PlayerController.round)(1923.2250199)).to.equal(1923.23);
expect((0, _PlayerController.round)(0.005)).to.equal(0.01);
expect((0, _PlayerController.round)(0.00499)).to.equal(0);
expect((0, _PlayerController.round)(2.3)).to.equal(2.3);
```

<a name="playercontroller-class-gettime-method"></a>
## getTime method
should return a 24hr timestamp of HH:mm:ss for a given date object,
        or the current time if no argument supplied..

```js
var date = new Date('December 17, 1995 03:24:01');
expect(_PlayerController2.default.getTime(date)).to.equal('03:24:01');
date = new Date('February 02, 2017 13:09:22');
expect(_PlayerController2.default.getTime(date)).to.equal('13:09:22');
```

<a name="playercontroller-class-constructor"></a>
## constructor
should create a new PlayerController instance with proxied properties
        for messages, player, and target, as well as an engine getter.

```js
var engine = {};
var ctrl = new _PlayerController2.default(engine);
expect(ctrl).to.exist;
expect(ctrl).to.have.property('messages').that.eqls([]);
expect(ctrl).to.have.property('player').that.equals(null);
expect(ctrl).to.have.property('target').that.equals(null);
expect(ctrl.engine).to.equal(engine);
expect(_StateEventProxy2.default.create.callCount).to.equal(1);
expect(_StateEventProxy2.default.create.calledWithExactly(ctrl, 'engine.ctrl', ['messages', 'player', 'target'])).to.equal(true);
```

<a name="playercontroller-class-playercontroller-instance"></a>
## PlayerController instance
<a name="playercontroller-class-playercontroller-instance-setup-method"></a>
### setup method
should call registerKeyActions for the settings.input.keys
            configuration.

```js
expect(function () {
    return ctrl.setup(settings);
}).to.not.throw(Error);
expect(ctrl.registerKeyActions.callCount).to.equal(1);
expect(ctrl.registerKeyActions.calledWithExactly(settings.input.keys));
```

<a name="playercontroller-class-playercontroller-instance-registerkeyactions-method"></a>
### registerKeyActions method
should call engine.registerKeyAction for each keyHandler passed
            in.

```js
expect(function () {
    return ctrl.registerKeyActions(handlers);
}).to.not.throw(Error);
expect(engine.registerKeyAction.callCount).to.equal(2);
expect(engine.registerKeyAction.calledWithExactly('f', handlers[0])).to.equal(true);
expect(engine.registerKeyAction.calledWithExactly('g', handlers[1])).to.equal(true);
```

<a name="playercontroller-class-playercontroller-instance-message-method"></a>
### message method
should functionally update this.messages by adding the new message
            from the provided data at the front of messages.

```js
var orig = ctrl.messages,
    origS = JSON.stringify(orig),
    msgs = ctrl.message('test', null, 'foobar');
expect(msgs).to.have.length(1);
expect(msgs[0]).to.have.property('type').that.equals('test');
expect(msgs[0]).to.have.property('sender').that.equals(null);
expect(msgs[0]).to.have.property('message').that.equals('foobar');
expect(msgs).to.not.equal(orig);
expect(orig).to.have.length(0);
expect(JSON.stringify(orig)).to.equal(origS);
msgs = ctrl.message('test', 'dude', 'barfoo');
expect(msgs).to.have.length(2);
expect(msgs[0]).to.have.property('sender').that.equals('dude');
expect(msgs[0]).to.have.property('message').that.equals('barfoo');
expect(msgs[1]).to.have.property('message').that.equals('foobar');
```

should trim messages to the provided max.

```js
var msgs = void 0;
ctrl.message('test', null, 'one', 5);
ctrl.message('test', null, 'two', 5);
ctrl.message('test', null, 'three', 5);
ctrl.message('test', null, 'four', 5);
ctrl.message('test', null, 'five', 5);
expect(ctrl.messages).to.have.length(5);
expect(ctrl.messages[0].message).to.equal('five');
expect(ctrl.messages[4].message).to.equal('one');
ctrl.message('test', null, 'six', 5);
expect(ctrl.messages).to.have.length(5);
expect(ctrl.messages[0].message).to.equal('six');
expect(ctrl.messages[4].message).to.equal('two');
ctrl.message('test', null, 'seven', 2);
expect(ctrl.messages).to.have.length(2);
expect(ctrl.messages[0].message).to.equal('seven');
expect(ctrl.messages[1].message).to.equal('six');
```

<a name="playercontroller-class-playercontroller-instance-mclick-method"></a>
### mClick method
should not throw an error when a proper event is passed.

```js
expect(function () {
    return ctrl.mClick(evt);
}).to.not.throw(Error);
```

should throw an error when an improper event is passed.

```js
expect(function () {
    return ctrl.mClick({ pageX: 3 });
}).to.throw(Error);
```

<a name="playercontroller-class-playercontroller-instance-maltclick-method"></a>
### mAltClick method
should not throw an error when a proper event is passed.

```js
expect(function () {
    return ctrl.mAltClick(evt);
}).to.not.throw(Error);
```

should throw an error when an improper event is passed.

```js
expect(function () {
    return ctrl.mAltClick({ pageX: 3 });
}).to.throw(Error);
```

<a name="playercontroller-class-playercontroller-instance-mwheel-method"></a>
### mWheel method
should not throw an error when a proper event is passed.

```js
expect(function () {
    return ctrl.mWheel(evt);
}).to.not.throw(Error);
```

should throw an error when an improper event is passed.

```js
expect(function () {
    return ctrl.mWheel({ pageX: 3, pageY: 4 });
}).to.throw(Error);
```

<a name="playercontroller-class-playercontroller-instance-mover-method"></a>
### mOver method
should not throw an error when a proper event is passed.

```js
expect(function () {
    return ctrl.mOver(evt);
}).to.not.throw(Error);
```

should throw an error when an improper event is passed.

```js
expect(function () {
    return ctrl.mOver({ pageX: 3 });
}).to.throw(Error);
```

<a name="playercontroller-class-playercontroller-instance-mout-method"></a>
### mOut method
should not throw an error when a proper event is passed.

```js
expect(function () {
    return ctrl.mOut(evt);
}).to.not.throw(Error);
```

should throw an error when an improper event is passed.

```js
expect(function () {
    return ctrl.mOut({ pageY: 3 });
}).to.throw(Error);
```

<a name="playercontroller-class-playercontroller-instance-entityover-method"></a>
### entityOver method
should set the controller's target to the provided entity.

```js
expect(ctrl.target).to.equal(null);
expect(function () {
    return ctrl.entityOver(entity, evt);
}).to.not.throw(Error);
expect(ctrl.target).to.equal(entity);
```

should throw an error when an invalid entity or event is provided.

```js
expect(function () {
    return ctrl.entityOver(null, evt);
}).to.throw(Error);
expect(function () {
    return ctrl.entityOver(entity, null);
}).to.throw(Error);
```

<a name="playercontroller-class-playercontroller-instance-entityout-method"></a>
### entityOut method
should remove the current target if the entity passed is the current
            target.

```js
ctrl.target = entity;
expect(function () {
    return ctrl.entityOut(entity, evt);
}).to.not.throw(Error);
expect(ctrl.target).to.equal(null);
```

should not remove the current target if the entity passed is not
            the current target.

```js
var entity2 = { uid: 'bar' };
expect(ctrl.target).to.equal(null);
expect(function () {
    return ctrl.entityOut(entity, evt);
}).to.not.throw(Error);
expect(ctrl.target).to.equal(null);
ctrl.target = entity2;
expect(function () {
    return ctrl.entityOut(entity, evt);
}).to.not.throw(Error);
expect(ctrl.target).to.equal(entity2);
```

should throw an error when an invalid entity or event is provided.

```js
expect(function () {
    return ctrl.entityOut(null, evt);
}).to.throw(Error);
expect(function () {
    return ctrl.entityOut(entity, null);
}).to.throw(Error);
```

<a name="playercontroller-class-playercontroller-instance-entityclick-method"></a>
### entityClick method
should not throw an error when a proper entity and event is passed.

```js
expect(function () {
    return ctrl.entityClick(entity, evt);
}).to.not.throw(Error);
```

should throw an error when an improper entity or event is passed.

```js
expect(function () {
    return ctrl.entityClick(null, evt);
}).to.throw(Error);
expect(function () {
    return ctrl.entityClick(entity, { pointerY: 3 });
}).to.throw(Error);
```

<a name="playercontroller-class-playercontroller-instance-entityaltclick-method"></a>
### entityAltClick method
should not throw an error when a proper entity and event is passed.

```js
expect(function () {
    return ctrl.entityAltClick(entity, evt);
}).to.not.throw(Error);
```

should throw an error when an improper entity or event is passed.

```js
expect(function () {
    return ctrl.entityAltClick(null, evt);
}).to.throw(Error);
expect(function () {
    return ctrl.entityAltClick(entity, { pointerY: 3 });
}).to.throw(Error);
```

<a name="the-scene-class"></a>
# The Scene Class
should be a singleton.

```js
var scene = new _Scene2.default();
expect(function () {
    return scene = new _Scene2.default();
}).to.throw(Error);
```

<a name="the-scene-class-constructor"></a>
## Constructor
should create a new object with an empty children map and a null
        activeCamera property, as well as a non-enumerable _baby property.

```js
var scene = new _Scene2.default();
expect(scene).to.exist;
expect(scene).to.have.all.keys(['children', 'activeCamera']);
expect(scene.children).to.eql({});
expect(scene.activeCamera).to.equal(null);
expect(scene._baby).to.equal(null);
```

<a name="the-scene-class-scene-instance"></a>
## scene instance
<a name="the-scene-class-scene-instance-baby-getter-method"></a>
### baby getter method
should get the scene._baby property.

```js
expect(scene.baby).to.equal(null);
scene._baby = 42;
expect(scene.baby).to.equal(42);
```

<a name="the-scene-class-scene-instance-mount-method"></a>
### mount method
should set the scene._baby property to a new BabylonJS Scene.

```js
scene.mount(engine);
expect(scene.baby.isBaby).to.equal(true);
```

<a name="the-scene-class-scene-instance-dismount-method"></a>
### dismount method
should dismount each child in scene.children then delete the _baby
            property before returning null.

```js
var ret = void 0;
scene.children = { foo: { uid: 'foo' }, bar: { uid: 'bar' } };
ret = scene.dismount(engine);
expect(ret).to.equal(null);
expect(scene.baby).to.equal(null);
expect(scene.children).to.eql({});
expect(_Entity2.default.dismount.callCount).to.equal(2);
expect(_Entity2.default.dismount).to.have.been.calledWithExactly(engine, { uid: 'foo' });
expect(_Entity2.default.dismount).to.have.been.calledWithExactly(engine, { uid: 'bar' });
```

<a name="the-scene-class-scene-instance-getentity-method"></a>
### getEntity method
should get a child entity by uid.

```js
var e = void 0;
scene.children = { bar: { uid: 'bar' } };
e = scene.getEntity('bar');
expect(e).to.eql({ uid: 'bar' });
e = scene.getEntity('foo');
expect(e).to.not.exist;
```

<a name="the-scene-class-scene-instance-updateentity-method"></a>
### updateEntity method
should return a promise that updates an entity by uid with
            Entity.update, then saves the updated entity back in children.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

<a name="the-scene-class-scene-instance-updateentities-method"></a>
### updateEntities method
should return a promise that sequentially updates/creates each entity
            from the provided data using the updateEntity method, then resolve
            to the updated scene.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

<a name="the-scene-class-scene-instance-removeentity-method"></a>
### removeEntity method
should call Entity.dismount for the entity at the provided uid,
            and replace the entity in scene.children with the result (null).

```js
scene.children = { foo: { uid: 'foo' }, bar: { uid: 'bar' } };
scene.removeEntity(engine, 'bar');
expect(scene.children.bar).to.equal(null);
expect(scene.children.foo.uid).to.equal('foo');
expect(_Entity2.default.dismount.callCount).to.equal(1);
expect(_Entity2.default.dismount).to.have.been.calledWithExactly(engine, { uid: 'bar' });
```

<a name="the-scene-class-scene-instance-tick-method"></a>
### tick method
should call Entity.tick for each entity in its children.

```js
var foo = { uid: 'foo' };
var bar = { uid: 'bar' };
scene.children = { foo: foo, bar: bar };
scene.tick(engine, 100, 10);
expect(_Entity2.default.tick.callCount).to.equal(2);
expect(_Entity2.default.tick).to.have.been.calledWithExactly(engine, foo, 100, 10);
expect(_Entity2.default.tick).to.have.been.calledWithExactly(engine, bar, 100, 10);
```

<a name="stateeventproxy"></a>
# StateEventProxy
<a name="stateeventproxy-stateproxy-exported-function-integration-tests"></a>
## StateProxy exported function (integration tests)
should assign proxy properties from a list of keys to the provided object
        and emit state events when a property is reassigned.

```js
var obj = { d: null };
_StateEventProxy2.default.create(obj, 'obj', ['a', 'b', 'c'], { def: 0 });
expect(obj).to.exist;
expect(obj).to.have.all.keys(['a', 'b', 'c', 'd']);
expect(obj).to.eql({ a: 0, b: 0, c: 0, d: null });
obj.d = 5;
expect(obj.d).to.equal(5);
obj.a = { foo: 'bar' };
expect(obj.a).to.eql({ foo: 'bar' });
obj.b = [1, obj.a, 'three'];
expect(obj.b).to.eql([1, { foo: 'bar' }, 'three']);
obj.b = null;
expect(obj).to.eql({
    a: { foo: 'bar' },
    b: null,
    c: 0,
    d: 5
});
setTimeout(function () {
    expect(_stateEvents2.default.emit.callCount).to.equal(3);
    expect(_stateEvents2.default.emit).to.have.been.calledWith('obj.a', { foo: 'bar' });
    expect(_stateEvents2.default.emit).to.have.been.calledWith('obj.b', [1, { foo: 'bar' }, 'three']);
    expect(_stateEvents2.default.emit).to.have.been.calledWith('obj.b', null);
    done();
});
```

should assign proxy properties from a map of keys and values to the provided
        object and emit state events when a property is reassigned.

```js
var obj = { d: 10 };
_StateEventProxy2.default.create(obj, 'obj', {
    a: null,
    b: { foo: 'bar' },
    c: ['foo', 'bar']
});
expect(obj).to.have.all.keys(['a', 'b', 'c', 'd']);
expect(obj).to.eql({ a: null, b: { foo: 'bar' }, c: ['foo', 'bar'], d: 10 });
obj.d = 42;
expect(obj.d).to.equal(42);
obj.a = [1, 2, 3];
expect(obj.a).to.eql([1, 2, 3]);
obj.b.foo = 'foo';
expect(obj.b).to.eql({ foo: 'foo' });
obj.b = 'foobar';
expect(obj.b).to.equal('foobar');
setTimeout(function () {
    expect(_stateEvents2.default.emit.callCount).to.equal(2);
    expect(_stateEvents2.default.emit).to.have.been.calledWith('obj.a', [1, 2, 3]);
    expect(_stateEvents2.default.emit).to.have.been.calledWith('obj.b', 'foobar');
    done();
});
```

<a name="stateeventproxy-stateeventproxy-class"></a>
## StateEventProxy Class
<a name="stateeventproxy-stateeventproxy-class-ismutatefn-method"></a>
### isMutateFn method
should return true if provided key is an Array member-function that mutates
            itself.

```js
expect(_StateEventProxy2.default.isMutateFn('copyWithin')).to.equal(true);
expect(_StateEventProxy2.default.isMutateFn('fill')).to.equal(true);
expect(_StateEventProxy2.default.isMutateFn('pop')).to.equal(true);
expect(_StateEventProxy2.default.isMutateFn('push')).to.equal(true);
expect(_StateEventProxy2.default.isMutateFn('reverse')).to.equal(true);
expect(_StateEventProxy2.default.isMutateFn('shift')).to.equal(true);
expect(_StateEventProxy2.default.isMutateFn('sort')).to.equal(true);
expect(_StateEventProxy2.default.isMutateFn('splice')).to.equal(true);
expect(_StateEventProxy2.default.isMutateFn('unshift')).to.equal(true);
```

should return false if provided key is not an Array member-function that
            mutates itself.

```js
expect(_StateEventProxy2.default.isMutateFn('concat')).to.equal(false);
expect(_StateEventProxy2.default.isMutateFn('forEach')).to.equal(false);
expect(_StateEventProxy2.default.isMutateFn('join')).to.equal(false);
expect(_StateEventProxy2.default.isMutateFn('slice')).to.equal(false);
expect(_StateEventProxy2.default.isMutateFn('toString')).to.equal(false);
expect(_StateEventProxy2.default.isMutateFn('length')).to.equal(false);
```

<a name="stateeventproxy-stateeventproxy-class-emit-method"></a>
### emit method
should call events.emit if the scope is not disabled.

```js
var v = 40;
var obj = {};
_StateEventProxy2.default.emit('test.scope', v, obj);
setTimeout(function () {
    expect(_stateEvents2.default.emit.callCount).to.equal(1);
    expect(_stateEvents2.default.emit).to.have.been.calledWithExactly('test.scope', v, obj);
    done();
});
```

should not call events.emit if the scope is disabled.

```js
_StateEventProxy.DISABLE['test.scope'] = true;
_StateEventProxy2.default.emit('test.scope', 30, {});
setTimeout(function () {
    expect(_stateEvents2.default.emit.callCount).to.equal(0);
    _StateEventProxy.DISABLE['test.scope'] = false;
    done();
});
```

<a name="stateeventproxy-stateeventproxy-class-proxifyproperty-method"></a>
### proxifyProperty method
should assign to the provided object a wrapped property that, when
            set, will emit a state event.

```js
var obj = {};
var prop = 'testProp';
var scope = 'test.obj.testProp';
_StateEventProxy2.default.proxifyProperty(scope, obj, prop);
expect(obj).to.exist;
expect(obj).to.have.property('testProp');
expect(obj).to.have.key('testProp');
expect(obj.testProp).to.not.exist;
expect(_StateEventProxy2.default.buildProxyObject.callCount).to.equal(0);
expect(_StateEventProxy2.default.buildProxyArray.callCount).to.equal(0);
obj.testProp = 'foobar';
expect(obj.testProp).to.equal('foobar');
setTimeout(function () {
    expect(_StateEventProxy2.default.emit.callCount).to.equal(1);
    expect(_StateEventProxy2.default.emit).to.have.been.calledWithExactly('test.obj.testProp', 'foobar', obj);
    done();
});
```

should assign to the provided object a deeply-proxied value when
            the value to be assigned is an array and deep=true.

```js
var obj = {};
var prop = 'test';
var scope = 'obj.test';
var v = [1, 2, 3];
var opts = { deep: true, enumerable: true };
_StateEventProxy2.default.proxifyProperty(scope, obj, prop, v, opts);
expect(obj).to.exist;
expect(obj).to.have.property('test').that.eqls([1, 2, 3]);
expect(_StateEventProxy2.default.buildProxyObject.callCount).to.equal(0);
expect(_StateEventProxy2.default.buildProxyArray.callCount).to.equal(1);
expect(_StateEventProxy2.default.buildProxyArray).to.have.been.calledWithExactly(scope, obj, v, opts);
obj.test = [3, 2];
expect(obj.test).to.eql([3, 2]);
expect(_StateEventProxy2.default.buildProxyArray.callCount).to.equal(2);
expect(_StateEventProxy2.default.buildProxyArray).to.have.been.calledWithExactly(scope, obj, [3, 2], opts);
setTimeout(function () {
    expect(_StateEventProxy2.default.emit.callCount).to.equal(1);
    expect(_StateEventProxy2.default.emit).to.have.been.calledWithExactly(scope, [3, 2], obj);
    done();
});
```

should assign to the provided object a deeply-proxied value when
            the value to be assigned is an object and deep=true.

```js
var obj = {};
var prop = 'test';
var scope = 'obj.test';
var v = { foo: 'bar' };
var opts = { deep: true, enumerable: true };
_StateEventProxy2.default.proxifyProperty(scope, obj, prop, v, opts);
expect(obj).to.exist;
expect(obj).to.have.property('test').that.eqls(v);
expect(_StateEventProxy2.default.buildProxyArray.callCount).to.equal(0);
expect(_StateEventProxy2.default.buildProxyObject.callCount).to.equal(1);
expect(_StateEventProxy2.default.buildProxyObject).to.have.been.calledWithExactly(scope, v, opts);
obj.test = { bar: 'foo' };
expect(obj.test).to.eql({ bar: 'foo' });
expect(_StateEventProxy2.default.buildProxyObject.callCount).to.equal(2);
expect(_StateEventProxy2.default.buildProxyObject).to.have.been.calledWithExactly(scope, { bar: 'foo' }, opts);
setTimeout(function () {
    expect(_StateEventProxy2.default.emit.callCount).to.equal(1);
    expect(_StateEventProxy2.default.emit).to.have.been.calledWithExactly(scope, { bar: 'foo' }, obj);
    done();
});
```

should assign to the provided object a wrapped property that is
            not enumerable when enumerable=false.

```js
var obj = {};
var prop = 'testProp';
var scope = 'test.obj.testProp';
_StateEventProxy2.default.proxifyProperty(scope, obj, prop, 42, {
    enumerable: false
});
expect(obj).to.exist;
expect(obj).to.have.property('testProp');
expect(obj).to.not.have.key('testProp');
expect(obj.testProp).to.equal(42);
expect(_StateEventProxy2.default.buildProxyObject.callCount).to.equal(0);
expect(_StateEventProxy2.default.buildProxyArray.callCount).to.equal(0);
obj.testProp = 'foobar';
expect(obj.testProp).to.equal('foobar');
setTimeout(function () {
    expect(_StateEventProxy2.default.emit.callCount).to.equal(1);
    expect(_StateEventProxy2.default.emit).to.have.been.calledWithExactly('test.obj.testProp', 'foobar', obj);
    done();
});
```

<a name="stateeventproxy-stateeventproxy-class-buildproxyobject-method"></a>
### buildProxyObject method
should return an object that has proxified properties forEach
            each property on the original object.

```js
var scope = 'test.obj.obj';
var obj = {
    foo: 'bar',
    bar: 'foo'
};
var opts = { deep: true };
var p = _StateEventProxy2.default.buildProxyObject(scope, obj, opts);
expect(p).to.exist;
expect(_StateEventProxy2.default.proxifyProperty.callCount).to.equal(2);
expect(_StateEventProxy2.default.proxifyProperty).to.have.been.calledWithExactly(scope + '.foo', p, 'foo', 'bar', opts);
expect(_StateEventProxy2.default.proxifyProperty).to.have.been.calledWithExactly(scope + '.bar', p, 'bar', 'foo', opts);
```

<a name="stateeventproxy-stateeventproxy-class-buildproxyarray-method"></a>
### buildProxyArray method
should create and return an Array Proxy that wraps sets to be
            deeply-watched for new values, and gets to be watched if a mutation
            method is requested.

```js
var p = void 0,
    scope = 'test.obj.arr',
    arr = [[1, 2, 3], 7, 42, { foo: 'bar' }],
    obj = { arr: arr },
    opts = { deep: true };
expect(function () {
    return p = _StateEventProxy2.default.buildProxyArray(scope, obj, arr, opts);
}).to.not.throw(Error);
expect(p).to.exist;
expect(p.length).to.equal(4);
expect(p[0].length).to.equal(3);
expect(p.sort()).to.eql(arr.sort());
expect(_StateEventProxy2.default.buildProxyObject.callCount).to.equal(1);
expect(_StateEventProxy2.default.buildProxyObject).to.have.been.calledWithExactly(scope + '[3]', { foo: 'bar' }, opts);
p[1] = 8;
delete p[0][1];
setTimeout(function () {
    expect(_StateEventProxy2.default.emit.callCount).to.equal(3);
    expect(_StateEventProxy2.default.emit).to.have.been.calledWithExactly(scope, p, obj);
    expect(_StateEventProxy2.default.emit).to.have.been.calledWithExactly(scope + '[1]', 8, p);
    expect(_StateEventProxy2.default.emit).to.have.been.calledWithExactly(scope + '[0][1]', undefined, p[0]);
    done();
});
```

<a name="stateeventmanager"></a>
# StateEventManager
should have emit and on methods for dispatching and subscribing to
    events.

```js
expect(_stateEvents2.default).to.exist;
expect(_stateEvents2.default).to.have.property('emit').that.is.a('function');
expect(_stateEvents2.default).to.have.property('on').that.is.a('function');
```

should dispatch an event with the emit method and callback the events
    listener for that event, registered with the on method.

```js
var test = 0;
_stateEvents2.default.on('test', function (data) {
    expect(data).to.equal('foobar');
    test++;
});
_stateEvents2.default.on('finish', function () {
    expect(test).to.equal(2);
    _stateEvents2.default.removeAllListeners('test');
    _stateEvents2.default.removeAllListeners('finish');
    _stateEvents2.default.removeAllListeners('foo');
    test++;
});
_stateEvents2.default.on('foo', function () {
    done('No foo event emitted, but handler called.');
});
_stateEvents2.default.emit('test', 'foobar');
_stateEvents2.default.emit('bar');
_stateEvents2.default.emit('test', 'foobar');
_stateEvents2.default.emit('finish');
setTimeout(function () {
    expect(test).to.equal(3);
    done();
});
```

