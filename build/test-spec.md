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
       - [create method](#stateeventproxy-stateeventproxy-class-create-method)
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
(0, _chai.expect)(Engine).to.be.a('function');
(0, _chai.expect)(Engine.__proto__.name).to.equal('Singleton');
```

<a name="the-engine-class-init-method"></a>
## init method
should initialize a new Engine instance if none exist by calling the
        Engine constructor, and kicking off the resourceLoader.

```js
var engine = void 0,
    load = void 0;
(0, _chai.expect)(Engine.instance).to.not.exist;
(0, _chai.expect)(function () {
    return engine = Engine.init(params.logger, params.resourceLoader, null, params.settings);
}).to.not.throw(Error);
(0, _chai.expect)(engine).to.exist;
(0, _chai.expect)(engine.loading).to.equal(LoadStates.RES);
(0, _chai.expect)(initialize.callCount).to.equal(1);
(0, _chai.expect)(initialize.calledWithExactly(engine, params.logger, null, params.settings)).to.equal(true);
(0, _chai.expect)(loader.callCount).to.equal(1);
load = getPrivateDataForTest().loader;
(0, _chai.expect)(load).to.exist;
(0, _chai.expect)(function () {
    return load.then(function () {
        var _getPrivateDataForTes = getPrivateDataForTest(),
            resourceProvider = _getPrivateDataForTes.resourceProvider;
        (0, _chai.expect)(resourceProvider).to.exist;
        (0, _chai.expect)(resourceProvider).to.equal(params.provider);
        (0, _chai.expect)(engine.loading).to.equal(LoadStates.INIT);
        (0, _chai.expect)(sceneSpy.callCount).to.equal(1);
        (0, _chai.expect)(engine.scene).to.exist;
        (0, _chai.expect)(engine.scene.stubs.constructor.calledWith).to.eql([engine]);
        done();
    }).catch(done);
}).to.not.throw(Error);
```

should return the engine instance if it has already been initialized.

```js
var ngn = void 0,
    engine = Engine.init(params.logger, params.resourceLoader, null, params.settings);
loader.reset();
initialize.reset();
(0, _chai.expect)(function () {
    return ngn = Engine.init();
}).to.not.throw(Error);
(0, _chai.expect)(ngn).to.exist;
(0, _chai.expect)(ngn).to.equal(engine);
(0, _chai.expect)(loader.callCount).to.equal(0);
(0, _chai.expect)(initialize.callCount).to.equal(0);
```

<a name="the-engine-class-constructor"></a>
## constructor
should create a new Engine instance with EventProxied properties
        (fps, loading) and standard enumerable properties (scene, running,
        settings).

```js
var engine = void 0;
(0, _chai.expect)(function () {
    return engine = new Engine(params.logger, null, params.settings);
}).to.not.throw(Error);
(0, _chai.expect)(engine).to.exist;
(0, _chai.expect)(EventProxyMock.callCount).to.equal(1);
(0, _chai.expect)(EventProxyMock.calledWithExactly(engine, 'engine', { fps: 0, loading: LoadStates.BOOT }));
(0, _chai.expect)(engine).to.have.property('fps').that.equals(0);
(0, _chai.expect)(engine).to.have.property('loading').that.equals(LoadStates.BOOT);
(0, _chai.expect)(engine).to.have.property('scene').that.equals(null);
(0, _chai.expect)(engine).to.have.property('running').that.equals(false);
(0, _chai.expect)(engine).to.have.property('settings').that.equals(params.settings);
var _getPrivateDataForTes2 = getPrivateDataForTest(),
    logger = _getPrivateDataForTes2.logger,
    playerController = _getPrivateDataForTes2.playerController;
(0, _chai.expect)(logger).to.exist;
(0, _chai.expect)(logger).to.equal(params.logger);
(0, _chai.expect)(playerController).to.exist;
(0, _chai.expect)(playerController.stubs.constructor.calledWith).to.eql([engine]);
```

<a name="the-engine-class-engine-instance"></a>
## Engine instance
<a name="the-engine-class-engine-instance-gl-getter-method"></a>
### GL getter method
should return the read-only GraphicsLibary once loaded.

```js
var gl = void 0;
(0, _chai.expect)(function () {
    return gl = engine.GL;
}).to.not.throw(Error);
(0, _chai.expect)(gl).to.equal(null);
engine.mount({}).then(function () {
    (0, _chai.expect)(function () {
        return gl = engine.GL;
    }).to.not.throw(Error);
    (0, _chai.expect)(gl).to.equal(BabylonJSMock);
    done();
}).catch(done);
```

<a name="the-engine-class-engine-instance-baby-getter-method"></a>
### baby getter method
should return the read-only GraphicsLibary Engine instance once
            mounted.

```js
var baby = void 0,
    canvas = {};
(0, _chai.expect)(function () {
    return baby = engine.baby;
}).to.not.throw(Error);
(0, _chai.expect)(baby).to.equal(null);
engine.mount(canvas).then(function () {
    (0, _chai.expect)(function () {
        return baby = engine.baby;
    }).to.not.throw(Error);
    (0, _chai.expect)(baby).to.not.equal(null);
    done();
}).catch(done);
```

<a name="the-engine-class-engine-instance-canvas-getter-method"></a>
### canvas getter method
should return the read-only canvas element once mounted.

```js
var c = void 0,
    canvas = {};
(0, _chai.expect)(function () {
    return c = engine.canvas;
}).to.not.throw(Error);
(0, _chai.expect)(c).to.equal(null);
engine.mount(canvas).then(function () {
    (0, _chai.expect)(function () {
        return c = engine.canvas;
    }).to.not.throw(Error);
    (0, _chai.expect)(c).to.not.equal(null);
    (0, _chai.expect)(c).to.equal(canvas);
    done();
}).catch(done);
```

<a name="the-engine-class-engine-instance-provider-getter-method"></a>
### provider getter method
should return the read-only ResourceProvider once loaded.

```js
var provider = void 0;
(0, _chai.expect)(function () {
    return provider = engine.provider;
}).to.not.throw(Error);
(0, _chai.expect)(engine.provider).to.not.equal(null);
(0, _chai.expect)(engine.provider).to.equal(params.provider);
```

<a name="the-engine-class-engine-instance-ctrl-getter-method"></a>
### ctrl getter method
should return the read-only PlayerController instance.

```js
var ctrl = void 0;
(0, _chai.expect)(function () {
    return ctrl = engine.ctrl;
}).to.not.throw(Error);
(0, _chai.expect)(ctrl).to.not.equal(null);
(0, _chai.expect)(ctrl.stubs.constructor.calledWith).to.eql([engine]);
```

<a name="the-engine-class-engine-instance-logger-getter-method"></a>
### logger getter method
should return the read-only logger instance.

```js
var logger = void 0;
(0, _chai.expect)(function () {
    return logger = engine.logger;
}).to.not.throw(Error);
(0, _chai.expect)(logger).to.not.equal(null);
(0, _chai.expect)(logger).to.equal(params.logger);
```

<a name="the-engine-class-engine-instance-terrain-getter-and-setter-methods"></a>
### terrain getter and setter methods
should set and get the engine's terrain entity.

```js
var terrain = {},
    t = void 0;
(0, _chai.expect)(function () {
    return t = engine.terrain;
}).to.not.throw(Error);
(0, _chai.expect)(t).to.equal(null);
(0, _chai.expect)(function () {
    return engine.terrain = terrain;
}).to.not.throw(Error);
(0, _chai.expect)(function () {
    return t = engine.terrain;
}).to.not.throw(Error);
(0, _chai.expect)(t).to.equal(terrain);
```

<a name="the-engine-class-engine-instance-mount-method"></a>
### mount method
should return a promise that mounts the engine to the provided
            canvas element after the ResourceProvider and GraphicsLibrary have
            been loaded (resolves to self).

```js
var canvas = {};
(0, _chai.expect)(function () {
    return engine.mount(canvas).then(function (e) {
        var _getPrivateDataForTes3 = getPrivateDataForTest(),
            GraphicsLibrary = _getPrivateDataForTes3.GraphicsLibrary,
            babylonEngine = _getPrivateDataForTes3.babylonEngine,
            canvasElement = _getPrivateDataForTes3.canvasElement;
        (0, _chai.expect)(e).to.equal(engine);
        (0, _chai.expect)(engine.loading).to.equal(LoadStates.DATA);
        (0, _chai.expect)(GraphicsLibrary).to.equal(BabylonJSMock);
        (0, _chai.expect)(babylonEngine.stubs.constructor.calledWith).to.eql([canvas, true]);
        (0, _chai.expect)(canvasElement).to.equal(canvas);
        (0, _chai.expect)(engine.scene.stubs.mount.callCount).to.equal(1);
        (0, _chai.expect)(engine.scene.stubs.mount.calledWithExactly(engine)).to.equal(true);
        done();
    }).catch(done);
}).to.not.throw(Error);
```

<a name="the-engine-class-engine-instance-dismount-method"></a>
### dismount method
should return a promise that stops the engine render process when
            running, dismounts and deletes the scene, along with the GraphicsLibrary
            Engine instance and canvas element before resolving to self.

```js
engine.running = true;
(0, _chai.expect)(function () {
    return engine.dismount().then(function (e) {
        var _getPrivateDataForTes4 = getPrivateDataForTest(),
            babylonEngine = _getPrivateDataForTes4.babylonEngine,
            canvasElement = _getPrivateDataForTes4.canvasElement;
        (0, _chai.expect)(e).to.equal(engine);
        (0, _chai.expect)(scene.stubs.dismount.callCount).to.equal(1);
        (0, _chai.expect)(scene.stubs.dismount.calledWithExactly(engine)).to.equal(true);
        (0, _chai.expect)(baby.stubs.dispose.callCount).to.equal(1);
        (0, _chai.expect)(babylonEngine).to.equal(null);
        (0, _chai.expect)(canvasElement).to.equal(null);
        (0, _chai.expect)(stop.callCount).to.equal(1);
        done();
    }).catch(done);
}).to.not.throw(Error);
```

should return a promise dismounts and deletes the scene, along
            with the GraphicsLibrary Engine instance and canvas element before
            resolving to self.

```js
(0, _chai.expect)(function () {
    return engine.dismount().then(function (e) {
        var _getPrivateDataForTes5 = getPrivateDataForTest(),
            babylonEngine = _getPrivateDataForTes5.babylonEngine,
            canvasElement = _getPrivateDataForTes5.canvasElement;
        (0, _chai.expect)(e).to.equal(engine);
        (0, _chai.expect)(scene.stubs.dismount.callCount).to.equal(1);
        (0, _chai.expect)(scene.stubs.dismount.calledWithExactly(engine)).to.equal(true);
        (0, _chai.expect)(baby.stubs.dispose.callCount).to.equal(1);
        (0, _chai.expect)(babylonEngine).to.equal(null);
        (0, _chai.expect)(canvasElement).to.equal(null);
        (0, _chai.expect)(stop.callCount).to.equal(0);
        done();
    }).catch(done);
}).to.not.throw(Error);
```

<a name="the-engine-class-engine-instance-run-method"></a>
### run method
should return a promise that initializes the scene with the provided
            entities, attaches event listeners to the canvas element, and begins
            the main render/update loop before resolving to self.

```js
var data = [{ id: 'foo', uid: 'foo' }, { id: 'bar', uid: 'bar' }];
(0, _chai.expect)(engine.running).to.equal(false);
(0, _chai.expect)(function () {
    return engine.run(data).then(function (e) {
        (0, _chai.expect)(e).to.equal(engine);
        (0, _chai.expect)(engine.ctrl.stubs.setup.callCount).to.equal(1);
        (0, _chai.expect)(engine.ctrl.stubs.setup.calledWithExactly(engine.settings)).to.equal(true);
        (0, _chai.expect)(engine.scene.stubs.updateEntities.callCount).to.equal(1);
        (0, _chai.expect)(engine.scene.stubs.updateEntities.calledWithExactly(engine, data));
        (0, _chai.expect)(addListener.callCount).to.equal(2);
        (0, _chai.expect)(addListener.calledWith('click')).to.equal(true);
        (0, _chai.expect)(addListener.calledWith('contextmenu')).to.equal(true);
        (0, _chai.expect)(engine.baby.stubs.runRenderLoop.callCount).to.equal(1);
        (0, _chai.expect)(engine.loading).to.equal(LoadStates.DONE);
        (0, _chai.expect)(engine.fps).to.equal(0);
        (0, _chai.expect)(engine.running).to.equal(true);
        setTimeout(function () {
            (0, _chai.expect)(engine.fps).to.equal(60);
            done();
        }, 501);
    }).catch(done);
}).to.not.throw(Error);
```

should return a promise that attaches event listeners to the canvas
            element and begins the main render/update loop without adding new
            entites, when none provided, before resolving to self.

```js
(0, _chai.expect)(engine.running).to.equal(false);
(0, _chai.expect)(function () {
    return engine.run().then(function (e) {
        (0, _chai.expect)(e).to.equal(engine);
        (0, _chai.expect)(engine.ctrl.stubs.setup.callCount).to.equal(1);
        (0, _chai.expect)(engine.ctrl.stubs.setup.calledWithExactly(engine.settings)).to.equal(true);
        (0, _chai.expect)(engine.scene.stubs.updateEntities.callCount).to.equal(0);
        (0, _chai.expect)(addListener.callCount).to.equal(2);
        (0, _chai.expect)(addListener.calledWith('click')).to.equal(true);
        (0, _chai.expect)(addListener.calledWith('contextmenu')).to.equal(true);
        (0, _chai.expect)(engine.baby.stubs.runRenderLoop.callCount).to.equal(1);
        (0, _chai.expect)(engine.loading).to.equal(LoadStates.DONE);
        (0, _chai.expect)(engine.fps).to.equal(0);
        (0, _chai.expect)(engine.running).to.equal(true);
        done();
    }).catch(done);
}).to.not.throw(Error);
```

should return a promise that resolves to self with engine is already
            running.

```js
engine.running = true;
(0, _chai.expect)(function () {
    return engine.run().then(function (e) {
        (0, _chai.expect)(e).to.equal(engine);
        (0, _chai.expect)(addListener.callCount).to.equal(0);
        (0, _chai.expect)(engine.scene.stubs.updateEntities.callCount).to.equal(0);
        (0, _chai.expect)(engine.ctrl.stubs.setup.callCount).to.equal(0);
        (0, _chai.expect)(engine.baby.stubs.runRenderLoop.callCount).to.equal(0);
        (0, _chai.expect)(engine.loading).to.equal(LoadStates.DATA);
        done();
    }).catch(done);
}).to.not.throw(Error);
```

should return a promise that resolves to self with engine is not in
            the correct loading state.

```js
engine.loading = LoadStates.RES;
(0, _chai.expect)(function () {
    return engine.run().then(function (e) {
        (0, _chai.expect)(e).to.equal(engine);
        (0, _chai.expect)(addListener.callCount).to.equal(0);
        (0, _chai.expect)(engine.scene.stubs.updateEntities.callCount).to.equal(0);
        (0, _chai.expect)(engine.ctrl.stubs.setup.callCount).to.equal(0);
        (0, _chai.expect)(engine.baby.stubs.runRenderLoop.callCount).to.equal(0);
        (0, _chai.expect)(engine.loading).to.equal(LoadStates.RES);
        (0, _chai.expect)(engine.running).to.equal(false);
        done();
    }).catch(done);
}).to.not.throw(Error);
```

<a name="the-engine-class-engine-instance-stop-method"></a>
### stop method
should stop the render/update loop if running.

```js
var e = void 0;
(0, _chai.expect)(engine.running).to.equal(true);
(0, _chai.expect)(function () {
    return e = engine.stop();
}).to.not.throw(Error);
(0, _chai.expect)(e).to.equal(engine);
(0, _chai.expect)(engine.running).to.equal(false);
(0, _chai.expect)(engine.loading).to.equal(LoadStates.DATA);
(0, _chai.expect)(engine.baby.stubs.stopRenderLoop.callCount).to.equal(1);
```

should just return self when engine is not running.

```js
var e = void 0;
engine.running = false;
(0, _chai.expect)(function () {
    return e = engine.stop();
}).to.not.throw(Error);
(0, _chai.expect)(e).to.equal(engine);
(0, _chai.expect)(engine.loading).to.equal(LoadStates.DONE);
(0, _chai.expect)(engine.baby.stubs.stopRenderLoop.callCount).to.equal(0);
```

<a name="the-engine-class-engine-instance-resize-method"></a>
### resize method
should call the resize method of the GraphicsLibrary engine
            instance.

```js
(0, _chai.expect)(function () {
    return engine.resize();
}).to.not.throw(Error);
(0, _chai.expect)(engine.baby.stubs.resize.callCount).to.equal(1);
```

<a name="the-engine-class-engine-instance-tovector-method"></a>
### toVector method
should convert a plain object with (x,y,z) properties into a 3D
            Vector object.

```js
var v = void 0;
(0, _chai.expect)(function () {
    return v = engine.toVector({ x: 1, y: 3.3, z: 4 });
}).to.not.throw(Error);
(0, _chai.expect)(v).to.exist;
(0, _chai.expect)(BabylonJSMock.Vector3.callCount).to.equal(1);
(0, _chai.expect)(BabylonJSMock.Vector3.calledWithExactly(1, 3.3, 4)).to.equal(true);
```

should return a new zero vector by default.

```js
var v = void 0;
(0, _chai.expect)(function () {
    return v = engine.toVector();
}).to.not.throw(Error);
(0, _chai.expect)(v).to.exist;
(0, _chai.expect)(BabylonJSMock.Vector3.callCount).to.equal(1);
(0, _chai.expect)(BabylonJSMock.Vector3.calledWithExactly(0, 0, 0)).to.equal(true);
```

<a name="the-engine-class-engine-instance-emitdebugevent-method"></a>
### emitDebugEvent method
should emit a state event if settings.debug = true.

```js
(0, _chai.expect)(function () {
    return engine.emitDebugEvent('test', {});
}).to.not.throw(Error);
(0, _chai.expect)(emit.callCount).to.equal(1);
(0, _chai.expect)(emit.calledWithExactly('test', {})).to.equal(true);
```

should not emit an event if settings.debug = false.

```js
params.settings.debug = false;
(0, _chai.expect)(function () {
    return engine.emitDebugEvent('test', {});
}).to.not.throw(Error);
(0, _chai.expect)(emit.callCount).to.equal(0);
```

<a name="the-engine-class-engine-instance-ondebugevent-method"></a>
### onDebugEvent method
should add an event listener if settings.debug = true.

```js
(0, _chai.expect)(function () {
    return engine.onDebugEvent('test', _utils._.noop);
}).to.not.throw(Error);
(0, _chai.expect)(on.callCount).to.equal(1);
(0, _chai.expect)(on.calledWithExactly('test', _utils._.noop)).to.equal(true);
```

should not add an event listener if settings.debug = false.

```js
params.settings.debug = false;
(0, _chai.expect)(function () {
    return engine.onDebugEvent('test', _utils._.noop);
}).to.not.throw(Error);
(0, _chai.expect)(on.callCount).to.equal(0);
```

<a name="the-engine-class-engine-instance-emitevent-method"></a>
### emitEvent method
should unconditionally emit a state event.

```js
(0, _chai.expect)(function () {
    return engine.emitEvent('test', 40, {});
}).to.not.throw(Error);
(0, _chai.expect)(eventsMock.Events.emit.callCount).to.equal(1);
(0, _chai.expect)(eventsMock.Events.emit.calledWithExactly('test', 40, {})).to.equal(true);
```

<a name="the-engine-class-engine-instance-onevent-method"></a>
### onEvent method
should unconditionally listen to a state event.

```js
(0, _chai.expect)(function () {
    return engine.onEvent('test', _utils._.noop);
}).to.not.throw(Error);
(0, _chai.expect)(eventsMock.Events.on.callCount).to.equal(1);
(0, _chai.expect)(eventsMock.Events.on.calledWithExactly('test', _utils._.noop)).to.equal(true);
```

<a name="the-engine-class-engine-instance-registerkeyaction-method"></a>
### registerKeyAction method
should register event listeners to fire the handler provided for
            the key event specified, onKeyUp or onKeyDown.

```js
(0, _chai.expect)(function () {
    return engine.registerKeyAction('f', { handler: handler });
}).to.not.throw(Error);
(0, _chai.expect)(engine.scene.baby.actionManager).to.exist;
(0, _chai.expect)(BabylonJSMock.ActionManager.callCount).to.equal(1);
(0, _chai.expect)(BabylonJSMock.ActionManager.calledWithExactly(engine.scene.baby)).to.equal(true);
(0, _chai.expect)(engine.scene.baby.actionManager.registerAction.callCount).to.equal(2);
(0, _chai.expect)(BabylonJSMock.ExecuteCodeAction.callCount).to.equal(2);
(0, _chai.expect)(BabylonJSMock.ExecuteCodeAction.calledWith({ trigger: 'down', parameter: 'f' })).to.equal(true);
(0, _chai.expect)(BabylonJSMock.ExecuteCodeAction.calledWith({ trigger: 'up', parameter: 'f' })).to.equal(true);
```

should register an event listener for the onKeyUp event for the
            provided key if the upHandler argument is set.

```js
(0, _chai.expect)(function () {
    return engine.registerKeyAction('g', { upHandler: handler });
}).to.not.throw(Error);
(0, _chai.expect)(engine.scene.baby.actionManager).to.exist;
(0, _chai.expect)(BabylonJSMock.ActionManager.callCount).to.equal(1);
(0, _chai.expect)(BabylonJSMock.ActionManager.calledWithExactly(engine.scene.baby)).to.equal(true);
(0, _chai.expect)(engine.scene.baby.actionManager.registerAction.callCount).to.equal(1);
(0, _chai.expect)(BabylonJSMock.ExecuteCodeAction.callCount).to.equal(1);
(0, _chai.expect)(BabylonJSMock.ExecuteCodeAction.calledWith({ trigger: 'up', parameter: 'g' })).to.equal(true);
```

should register an event listener for the onKeyDown event for the
            provided key if the downHandler argument is set.

```js
(0, _chai.expect)(function () {
    return engine.registerKeyAction('h', { downHandler: handler });
}).to.not.throw(Error);
(0, _chai.expect)(engine.scene.baby.actionManager).to.exist;
(0, _chai.expect)(BabylonJSMock.ActionManager.callCount).to.equal(1);
(0, _chai.expect)(BabylonJSMock.ActionManager.calledWithExactly(engine.scene.baby)).to.equal(true);
(0, _chai.expect)(engine.scene.baby.actionManager.registerAction.callCount).to.equal(1);
(0, _chai.expect)(BabylonJSMock.ExecuteCodeAction.callCount).to.equal(1);
(0, _chai.expect)(BabylonJSMock.ExecuteCodeAction.calledWith({ trigger: 'down', parameter: 'h' })).to.equal(true);
```

<a name="the-engine-class-engine-instance-registermouseeventsforentity-method"></a>
### registerMouseEventsForEntity method
should set the hover cursor for the entity's primary mesh if cursor
            arugment is provided.

```js
(0, _chai.expect)(function () {
    return engine.registerMouseEventsForEntity(entity, { cursor: 'pointer' }).then(function () {
        (0, _chai.expect)(BabylonJSMock.ActionManager.callCount).to.equal(1);
        (0, _chai.expect)(BabylonJSMock.ActionManager.calledWithExactly(engine.scene.baby)).to.equal(true);
        (0, _chai.expect)(baby.actionManager).to.exist;
        (0, _chai.expect)(baby.actionManager.hoverCursor).to.equal('pointer');
        (0, _chai.expect)(baby.actionManager.registerAction.callCount).to.equal(0);
        (0, _chai.expect)(BabylonJSMock.ExecuteCodeAction.callCount).to.equal(0);
        done();
    }).catch(done);
}).to.not.throw(Error);
```

should set an entityClick event listener on the entity's primary
            mesh if click argument is provided.

```js
(0, _chai.expect)(function () {
    return engine.registerMouseEventsForEntity(entity, { click: handler }).then(function () {
        (0, _chai.expect)(BabylonJSMock.ActionManager.callCount).to.equal(1);
        (0, _chai.expect)(BabylonJSMock.ActionManager.calledWithExactly(engine.scene.baby)).to.equal(true);
        (0, _chai.expect)(baby.actionManager).to.exist;
        (0, _chai.expect)(baby.actionManager.hoverCursor).to.not.exist;
        (0, _chai.expect)(baby.actionManager.registerAction.callCount).to.equal(1);
        (0, _chai.expect)(BabylonJSMock.ExecuteCodeAction.callCount).to.equal(1);
        (0, _chai.expect)(BabylonJSMock.ExecuteCodeAction.calledWith('left')).to.equal(true);
        done();
    }).catch(done);
}).to.not.throw(Error);
```

should set an entityAltClick event listener on the entity's primary
            mesh if the altClick argument is provided.

```js
(0, _chai.expect)(function () {
    return engine.registerMouseEventsForEntity(entity, { altClick: handler }).then(function () {
        (0, _chai.expect)(BabylonJSMock.ActionManager.callCount).to.equal(1);
        (0, _chai.expect)(BabylonJSMock.ActionManager.calledWithExactly(engine.scene.baby)).to.equal(true);
        (0, _chai.expect)(baby.actionManager).to.exist;
        (0, _chai.expect)(baby.actionManager.hoverCursor).to.not.exist;
        (0, _chai.expect)(baby.actionManager.registerAction.callCount).to.equal(1);
        (0, _chai.expect)(BabylonJSMock.ExecuteCodeAction.callCount).to.equal(1);
        (0, _chai.expect)(BabylonJSMock.ExecuteCodeAction.calledWith('right')).to.equal(true);
        done();
    }).catch(done);
}).to.not.throw(Error);
```

should set an entityOver event listener on the entity's primary
            mesh if the over argument is provided.

```js
(0, _chai.expect)(function () {
    return engine.registerMouseEventsForEntity(entity, { over: handler }).then(function () {
        (0, _chai.expect)(BabylonJSMock.ActionManager.callCount).to.equal(1);
        (0, _chai.expect)(BabylonJSMock.ActionManager.calledWithExactly(engine.scene.baby)).to.equal(true);
        (0, _chai.expect)(baby.actionManager).to.exist;
        (0, _chai.expect)(baby.actionManager.hoverCursor).to.not.exist;
        (0, _chai.expect)(baby.actionManager.registerAction.callCount).to.equal(1);
        (0, _chai.expect)(BabylonJSMock.ExecuteCodeAction.callCount).to.equal(1);
        (0, _chai.expect)(BabylonJSMock.ExecuteCodeAction.calledWith('over')).to.equal(true);
        done();
    }).catch(done);
}).to.not.throw(Error);
```

should set an entityOut event listener on the entity's primrary
            mesh if the out argument is provided.

```js
(0, _chai.expect)(function () {
    return engine.registerMouseEventsForEntity(entity, { out: handler }).then(function () {
        (0, _chai.expect)(BabylonJSMock.ActionManager.callCount).to.equal(1);
        (0, _chai.expect)(BabylonJSMock.ActionManager.calledWithExactly(engine.scene.baby)).to.equal(true);
        (0, _chai.expect)(baby.actionManager).to.exist;
        (0, _chai.expect)(baby.actionManager.hoverCursor).to.not.exist;
        (0, _chai.expect)(baby.actionManager.registerAction.callCount).to.equal(1);
        (0, _chai.expect)(BabylonJSMock.ExecuteCodeAction.callCount).to.equal(1);
        (0, _chai.expect)(BabylonJSMock.ExecuteCodeAction.calledWith('out')).to.equal(true);
        done();
    }).catch(done);
}).to.not.throw(Error);
```

<a name="the-engine-class-engine-instance-deregistermouseeventsforentity-method"></a>
### deregisterMouseEventsForEntity method
should remove all click/altClick/over/out event listeners for the
            given entity's primary mesh, and reset the hover cursor style.

```js
(0, _chai.expect)(baby.actionManager.actions).to.have.length(4);
(0, _chai.expect)(function () {
    return engine.deregisterMouseEventsForEntity(entity);
}).to.not.throw(Error);
(0, _chai.expect)(baby.actionManager.actions).to.have.length(0);
(0, _chai.expect)(baby.actionManager.hoverCursor).to.equal('default');
```

<a name="the-entity-class"></a>
# The Entity Class
should be a class that inherits from Static.

```js
(0, _chai.expect)(_entity3.default).to.exist;
(0, _chai.expect)(_entity3.default).to.be.a('function');
(0, _chai.expect)(_entity3.default.__proto__.name).to.equal('Static');
```

<a name="the-entity-class-create-method"></a>
## create method
should get the entity data for the provided entity ID, create a new
        entity object with that data, merged with any extra data provided, then
        return the updateComponents method with the new object and the aggregated
        component data (which is a promise that eventually resolves to entity).

```js
(0, _chai.expect)(function () {
    return _entity3.default.create(engine, { id: 'test', uid: 'foo' }).then(function (entity) {
        (0, _chai.expect)(entity).to.exist;
        (0, _chai.expect)(entity).to.have.all.keys(['id', 'uid']);
        (0, _chai.expect)(entity).to.have.property('mesh');
        (0, _chai.expect)(entity).to.have.property('tick');
        (0, _chai.expect)(entity).to.have.property('meshAsync');
        (0, _chai.expect)(getEntity.callCount).to.equal(1);
        (0, _chai.expect)(getEntity.calledWithExactly('test')).to.equal(true);
        (0, _chai.expect)(updateComponents.callCount).to.equal(1);
        (0, _chai.expect)(updateComponents.calledWithExactly(engine, entity, { TestComponent: { foo: 'bar' } })).to.equal(true);
        done();
    }).catch(done);
}).to.not.throw(Error);
```

<a name="the-entity-class-create-method-entity-object"></a>
### Entity object
should have id and uid properties.

```js
(0, _chai.expect)(entity).to.have.property('id').that.equals('test');
(0, _chai.expect)(entity).to.have.property('uid').that.equals('bar');
```

should have a mesh method that returns the component for the
            _primaryMesh key, if set.

```js
(0, _chai.expect)(entity).to.have.property('mesh');
(0, _chai.expect)(entity.mesh).to.not.exist;
entity.TestComponent = _comp;
(0, _chai.expect)(entity.mesh).to.exist;
(0, _chai.expect)(entity.mesh).to.equal(_comp);
```

should have a meshAsync property that is configurable until
            it's returned promise resolves to the entity mesh once available, then
            redefining the property to resolve directly to the mesh, and no longer
            reconfigurable.

```js
(0, _chai.expect)(function () {
    return entity.meshAsync.then(function (mesh) {
        (0, _chai.expect)(mesh).to.exist;
        (0, _chai.expect)(mesh).to.equal(_comp);
    }).catch(done);
}).to.not.throw(Error);
(0, _chai.expect)(function () {
    return entity.meshAsync.then(function (mesh) {
        (0, _chai.expect)(mesh).to.exist;
        (0, _chai.expect)(mesh).to.equal(_comp);
    }).catch(done);
}).to.not.throw(Error);
setTimeout(function () {
    entity.TestComponent = _comp;
    setTimeout(function () {
        (0, _chai.expect)(function () {
            return entity.meshAsync.then(function (mesh) {
                (0, _chai.expect)(mesh).to.exist;
                (0, _chai.expect)(mesh).to.equal(_comp);
                done();
            }).catch(done);
        }).to.not.throw(Error);
    }, 20);
}, 20);
```

should have a tick setter that will add a new tick method when the
            assignment is an object with both id and tick properties, or delete
            an existing tick when only an id property is in the assignment object.

```js
var cb = 0,
    fn = function fn() {
    return cb++;
};
(0, _chai.expect)(function () {
    return entity.tick = { id: 'Test', tick: fn };
}).to.not.throw(Error);
(0, _chai.expect)(cb).to.equal(0);
entity.tick();
(0, _chai.expect)(cb).to.equal(1);
entity.tick();
(0, _chai.expect)(cb).to.equal(2);
(0, _chai.expect)(function () {
    return entity.tick = { id: 'Test' };
}).to.not.throw(Error);
entity.tick();
(0, _chai.expect)(cb).to.equal(2);
```

should have a tick getter that returns a function that will fire
            each registered component tick method.

```js
var a = 0,
    b = 0,
    c = 0,
    fnA = function fnA() {
    return a++;
},
    fnB = function fnB() {
    return b++;
},
    fnC = function fnC() {
    return c++;
};
entity.tick = { id: 'A', tick: fnA };
entity.tick = { id: 'B', tick: fnB };
entity.tick = { id: 'C', tick: fnC };
entity.tick();
(0, _chai.expect)([a, b, c]).to.eql([1, 1, 1]);
entity.tick = { id: 'A' };
entity.tick = { id: 'B', tick: fnC };
entity.tick();
(0, _chai.expect)([a, b, c]).to.eql([1, 1, 3]);
entity.tick();
(0, _chai.expect)([a, b, c]).to.eql([1, 1, 5]);
```

<a name="the-entity-class-updatecomponent-method"></a>
## updateComponent method
should return a promise that calls the update class method for the
        given component, stores the updated result to the entity at the property
        name that matches the component ID, and  finally resolves to the newly-
        updated component.

```js
(0, _chai.expect)(entity.TestComponent).to.not.exist;
(0, _chai.expect)(function () {
    return _entity3.default.updateComponent(engine, entity, 'TestComponent').then(function (comp) {
        (0, _chai.expect)(comp).to.exist;
        (0, _chai.expect)(comp).to.equal(_comp);
        (0, _chai.expect)(entity.TestComponent).to.equal(comp);
        (0, _chai.expect)(getComponent.callCount).to.equal(1);
        (0, _chai.expect)(getComponent.calledWithExactly('TestComponent')).to.equal(true);
        done();
    }).catch(done);
}).to.not.throw(Error);
```

<a name="the-entity-class-updatecomponents-method"></a>
## updateComponents method
should return a promise that sequentially updates/creates each component
        from the provided data using the updateComponent method, then resolve
        to the updated entity.

```js
(0, _chai.expect)(function () {
    return _entity3.default.updateComponents(engine, entity, {
        TestComponent: { foo: 'bar' },
        AnotherComponent: { meaning: 42 }
    }).then(function (entity) {
        (0, _chai.expect)(entity).to.exist;
        (0, _chai.expect)(entity.TestComponent).to.eql({ foo: 'bar' });
        (0, _chai.expect)(entity.AnotherComponent).to.eql({ meaning: 42 });
        (0, _chai.expect)(updateComponent.callCount).to.equal(2);
        done();
    }).catch(done);
}).to.not.throw(Error);
```

<a name="the-entity-class-dismountcomponent-method"></a>
## dismountComponent method
should dismount the specified component using it's class dismount
        method and assigning the result (null) to the component property of the
        entity.

```js
var ret = void 0;
(0, _chai.expect)(function () {
    return ret = _entity3.default.dismountComponent(engine, entity, 'TestComponent');
}).to.not.throw(Error);
(0, _chai.expect)(ret).to.equal(null);
(0, _chai.expect)(entity.TestComponent).to.equal(null);
(0, _chai.expect)(getComponent.callCount).to.equal(1);
```

<a name="the-entity-class-update-method"></a>
## update method
should create a new entity if none provided.

```js
(0, _chai.expect)(function () {
    return _entity3.default.update(engine, null, { id: 'foo' }).then(function (entity) {
        (0, _chai.expect)(entity).to.exist;
        (0, _chai.expect)(create.callCount).to.equal(1);
        (0, _chai.expect)(updateComponents.callCount).to.equal(0);
        done();
    }).catch(done);
}).to.not.throw(Error);
```

should call updateComponents for existing entity.

```js
(0, _chai.expect)(function () {
    return _entity3.default.update(engine, entity, { id: 'foo' }).then(function (n) {
        (0, _chai.expect)(n).to.exist;
        (0, _chai.expect)(n).to.equal(entity);
        (0, _chai.expect)(create.callCount).to.equal(0);
        (0, _chai.expect)(updateComponents.callCount).to.equal(1);
        done();
    }).catch(done);
}).to.not.throw(Error);
```

<a name="the-entity-class-dismount-method"></a>
## dismount method
should dismount each component then return null.

```js
var ret = void 0;
(0, _chai.expect)(function () {
    return ret = _entity3.default.dismount(engine, entity);
}).to.not.throw(Error);
(0, _chai.expect)(ret).to.equal(null);
(0, _chai.expect)(entity.id).to.equal('k');
(0, _chai.expect)(dismountComponent.callCount).to.equal(2);
```

<a name="the-entity-class-tick-method"></a>
## tick method
should call the tick method on the provided entity instance.

```js
(0, _chai.expect)(function () {
    return _entity3.default.tick(engine, entity, 100, 10);
}).to.not.throw(Error);
(0, _chai.expect)(tick.callCount).to.equal(1);
(0, _chai.expect)(tick.calledWithExactly(engine, 100, 10)).to.equal(true);
```

<a name="playercontroller-class"></a>
# PlayerController Class
should be a singleton class.

```js
(0, _chai.expect)(PlayerController).to.be.a('function');
(0, _chai.expect)(PlayerController.__proto__.name).to.equal('Singleton');
```

<a name="playercontroller-class-round-function"></a>
## round function
should round a float to the second decimal place.

```js
(0, _chai.expect)(round(Math.PI)).to.equal(3.14);
(0, _chai.expect)(round(1923.2250199)).to.equal(1923.23);
(0, _chai.expect)(round(0.005)).to.equal(0.01);
(0, _chai.expect)(round(0.00499)).to.equal(0);
(0, _chai.expect)(round(2.3)).to.equal(2.3);
```

<a name="playercontroller-class-gettime-method"></a>
## getTime method
should return a 24hr timestamp of HH:mm:ss for a given date object,
        or the current time if no argument supplied..

```js
var date = new Date('December 17, 1995 03:24:01');
(0, _chai.expect)(PlayerController.getTime(date)).to.equal('03:24:01');
date = new Date('February 02, 2017 13:09:22');
(0, _chai.expect)(PlayerController.getTime(date)).to.equal('13:09:22');
```

<a name="playercontroller-class-constructor"></a>
## constructor
should create a new PlayerController instance with proxied properties
        for messages, player, and target, as well as an engine getter.

```js
var ctrl = void 0,
    engine = {};
(0, _chai.expect)(function () {
    return ctrl = new PlayerController(engine);
}).to.not.throw(Error);
(0, _chai.expect)(ctrl).to.exist;
(0, _chai.expect)(ctrl).to.have.property('messages').that.eqls([]);
(0, _chai.expect)(ctrl).to.have.property('player').that.equals(null);
(0, _chai.expect)(ctrl).to.have.property('target').that.equals(null);
(0, _chai.expect)(ctrl.engine).to.equal(engine);
(0, _chai.expect)(EventProxyMock.callCount).to.equal(1);
(0, _chai.expect)(EventProxyMock.calledWithExactly(ctrl, 'engine.ctrl', ['messages', 'player', 'target'])).to.equal(true);
```

<a name="playercontroller-class-playercontroller-instance"></a>
## PlayerController instance
<a name="playercontroller-class-playercontroller-instance-setup-method"></a>
### setup method
should call registerKeyActions for the settings.input.keys
            configuration.

```js
(0, _chai.expect)(function () {
    return ctrl.setup(settings);
}).to.not.throw(Error);
(0, _chai.expect)(register.callCount).to.equal(1);
(0, _chai.expect)(register.calledWithExactly(settings.input.keys));
```

<a name="playercontroller-class-playercontroller-instance-registerkeyactions-method"></a>
### registerKeyActions method
should call engine.registerKeyAction for each keyHandler passed
            in.

```js
(0, _chai.expect)(function () {
    return ctrl.registerKeyActions(handlers);
}).to.not.throw(Error);
(0, _chai.expect)(register.callCount).to.equal(2);
(0, _chai.expect)(register.calledWithExactly('f', handlers[0])).to.equal(true);
(0, _chai.expect)(register.calledWithExactly('g', handlers[1])).to.equal(true);
```

<a name="playercontroller-class-playercontroller-instance-message-method"></a>
### message method
should functionally update this.messages by adding the new message
            from the provided data at the front of messages.

```js
var orig = ctrl.messages,
    origS = JSON.stringify(orig),
    msgs = void 0;
(0, _chai.expect)(function () {
    return msgs = ctrl.message('test', null, 'foobar');
}).to.not.throw(Error);
(0, _chai.expect)(msgs).to.have.length(1);
(0, _chai.expect)(msgs[0]).to.have.property('type').that.equals('test');
(0, _chai.expect)(msgs[0]).to.have.property('sender').that.equals(null);
(0, _chai.expect)(msgs[0]).to.have.property('message').that.equals('foobar');
(0, _chai.expect)(msgs).to.not.equal(orig);
(0, _chai.expect)(orig).to.have.length(0);
(0, _chai.expect)(JSON.stringify(orig)).to.equal(origS);
(0, _chai.expect)(function () {
    return msgs = ctrl.message('test', 'dude', 'barfoo');
}).to.not.throw(Error);
(0, _chai.expect)(msgs).to.have.length(2);
(0, _chai.expect)(msgs[0]).to.have.property('sender').that.equals('dude');
(0, _chai.expect)(msgs[0]).to.have.property('message').that.equals('barfoo');
(0, _chai.expect)(msgs[1]).to.have.property('message').that.equals('foobar');
```

should trim messages to the provided max.

```js
var msgs = void 0;
ctrl.message('test', null, 'one', 5);
ctrl.message('test', null, 'two', 5);
ctrl.message('test', null, 'three', 5);
ctrl.message('test', null, 'four', 5);
ctrl.message('test', null, 'five', 5);
(0, _chai.expect)(ctrl.messages).to.have.length(5);
(0, _chai.expect)(ctrl.messages[0].message).to.equal('five');
(0, _chai.expect)(ctrl.messages[4].message).to.equal('one');
(0, _chai.expect)(function () {
    return ctrl.message('test', null, 'six', 5);
}).to.not.throw(Error);
(0, _chai.expect)(ctrl.messages).to.have.length(5);
(0, _chai.expect)(ctrl.messages[0].message).to.equal('six');
(0, _chai.expect)(ctrl.messages[4].message).to.equal('two');
(0, _chai.expect)(function () {
    return ctrl.message('test', null, 'seven', 2);
}).to.not.throw(Error);
(0, _chai.expect)(ctrl.messages).to.have.length(2);
(0, _chai.expect)(ctrl.messages[0].message).to.equal('seven');
(0, _chai.expect)(ctrl.messages[1].message).to.equal('six');
```

<a name="playercontroller-class-playercontroller-instance-mclick-method"></a>
### mClick method
should not throw an error when a proper event is passed.

```js
(0, _chai.expect)(function () {
    return ctrl.mClick(evt);
}).to.not.throw(Error);
```

should throw an error when an improper event is passed.

```js
(0, _chai.expect)(function () {
    return ctrl.mClick({ pageX: 3 });
}).to.throw(Error);
```

<a name="playercontroller-class-playercontroller-instance-maltclick-method"></a>
### mAltClick method
should not throw an error when a proper event is passed.

```js
(0, _chai.expect)(function () {
    return ctrl.mAltClick(evt);
}).to.not.throw(Error);
```

should throw an error when an improper event is passed.

```js
(0, _chai.expect)(function () {
    return ctrl.mAltClick({ pageX: 3 });
}).to.throw(Error);
```

<a name="playercontroller-class-playercontroller-instance-mwheel-method"></a>
### mWheel method
should not throw an error when a proper event is passed.

```js
(0, _chai.expect)(function () {
    return ctrl.mWheel(evt);
}).to.not.throw(Error);
```

should throw an error when an improper event is passed.

```js
(0, _chai.expect)(function () {
    return ctrl.mWheel({ pageX: 3, pageY: 4 });
}).to.throw(Error);
```

<a name="playercontroller-class-playercontroller-instance-mover-method"></a>
### mOver method
should not throw an error when a proper event is passed.

```js
(0, _chai.expect)(function () {
    return ctrl.mOver(evt);
}).to.not.throw(Error);
```

should throw an error when an improper event is passed.

```js
(0, _chai.expect)(function () {
    return ctrl.mOver({ pageX: 3 });
}).to.throw(Error);
```

<a name="playercontroller-class-playercontroller-instance-mout-method"></a>
### mOut method
should not throw an error when a proper event is passed.

```js
(0, _chai.expect)(function () {
    return ctrl.mOut(evt);
}).to.not.throw(Error);
```

should throw an error when an improper event is passed.

```js
(0, _chai.expect)(function () {
    return ctrl.mOut({ pageY: 3 });
}).to.throw(Error);
```

<a name="playercontroller-class-playercontroller-instance-entityover-method"></a>
### entityOver method
should set the controller's target to the provided entity.

```js
(0, _chai.expect)(ctrl.target).to.equal(null);
(0, _chai.expect)(function () {
    return ctrl.entityOver(entity, evt);
}).to.not.throw(Error);
(0, _chai.expect)(ctrl.target).to.equal(entity);
```

should throw an error when an invalid entity or event is provided.

```js
(0, _chai.expect)(function () {
    return ctrl.entityOver(null, evt);
}).to.throw(Error);
(0, _chai.expect)(function () {
    return ctrl.entityOver(entity, null);
}).to.throw(Error);
```

<a name="playercontroller-class-playercontroller-instance-entityout-method"></a>
### entityOut method
should remove the current target if the entity passed is the current
            target.

```js
ctrl.target = entity;
(0, _chai.expect)(function () {
    return ctrl.entityOut(entity, evt);
}).to.not.throw(Error);
(0, _chai.expect)(ctrl.target).to.equal(null);
```

should not remove the current target if the entity passed is not
            the current target.

```js
var entity2 = { uid: 'bar' };
(0, _chai.expect)(ctrl.target).to.equal(null);
(0, _chai.expect)(function () {
    return ctrl.entityOut(entity, evt);
}).to.not.throw(Error);
(0, _chai.expect)(ctrl.target).to.equal(null);
ctrl.target = entity2;
(0, _chai.expect)(function () {
    return ctrl.entityOut(entity, evt);
}).to.not.throw(Error);
(0, _chai.expect)(ctrl.target).to.equal(entity2);
```

should throw an error when an invalid entity or event is provided.

```js
(0, _chai.expect)(function () {
    return ctrl.entityOut(null, evt);
}).to.throw(Error);
(0, _chai.expect)(function () {
    return ctrl.entityOut(entity, null);
}).to.throw(Error);
```

<a name="playercontroller-class-playercontroller-instance-entityclick-method"></a>
### entityClick method
should not throw an error when a proper entity and event is passed.

```js
(0, _chai.expect)(function () {
    return ctrl.entityClick(entity, evt);
}).to.not.throw(Error);
```

should throw an error when an improper entity or event is passed.

```js
(0, _chai.expect)(function () {
    return ctrl.entityClick(null, evt);
}).to.throw(Error);
(0, _chai.expect)(function () {
    return ctrl.entityClick(entity, { pointerY: 3 });
}).to.throw(Error);
```

<a name="playercontroller-class-playercontroller-instance-entityaltclick-method"></a>
### entityAltClick method
should not throw an error when a proper entity and event is passed.

```js
(0, _chai.expect)(function () {
    return ctrl.entityAltClick(entity, evt);
}).to.not.throw(Error);
```

should throw an error when an improper entity or event is passed.

```js
(0, _chai.expect)(function () {
    return ctrl.entityAltClick(null, evt);
}).to.throw(Error);
(0, _chai.expect)(function () {
    return ctrl.entityAltClick(entity, { pointerY: 3 });
}).to.throw(Error);
```

<a name="the-scene-class"></a>
# The Scene Class
should be a singleton.

```js
(0, _chai.expect)(_scene2.default).to.be.a('function');
(0, _chai.expect)(_scene2.default.__proto__.name).to.equal('Singleton');
```

<a name="the-scene-class-constructor"></a>
## Constructor
should create a new object with an empty children map and a null
        activeCamera property, as well as a non-enumerable _baby property.

```js
var scene = void 0;
(0, _chai.expect)(function () {
    return scene = new _scene2.default();
}).to.not.throw(Error);
(0, _chai.expect)(scene).to.exist;
(0, _chai.expect)(scene).to.have.all.keys(['children', 'activeCamera']);
(0, _chai.expect)(scene.children).to.eql({});
(0, _chai.expect)(scene.activeCamera).to.equal(null);
(0, _chai.expect)(scene._baby).to.equal(null);
```

<a name="the-scene-class-scene-instance"></a>
## scene instance
<a name="the-scene-class-scene-instance-baby-getter-method"></a>
### baby getter method
should get the scene._baby property.

```js
(0, _chai.expect)(scene.baby).to.equal(null);
scene._baby = 42;
(0, _chai.expect)(scene.baby).to.equal(42);
```

<a name="the-scene-class-scene-instance-mount-method"></a>
### mount method
should set the scene._baby property to a new BabylonJS Scene.

```js
(0, _chai.expect)(function () {
    return scene.mount(engine);
}).to.not.throw(Error);
(0, _chai.expect)(scene.baby.isBaby).to.equal(true);
```

<a name="the-scene-class-scene-instance-dismount-method"></a>
### dismount method
should dismount each child in scene.children then delete the _baby
            property before returning null.

```js
var ret = void 0;
scene.children = { foo: { uid: 'foo' }, bar: { uid: 'bar' } };
(0, _chai.expect)(function () {
    return ret = scene.dismount(engine);
}).to.not.throw(Error);
(0, _chai.expect)(ret).to.equal(null);
(0, _chai.expect)(scene.baby).to.equal(null);
(0, _chai.expect)(scene.children).to.eql({});
(0, _chai.expect)(dismount.callCount).to.equal(2);
(0, _chai.expect)(dismount.calledWithExactly(engine, { uid: 'foo' })).to.equal(true);
(0, _chai.expect)(dismount.calledWithExactly(engine, { uid: 'bar' })).to.equal(true);
```

<a name="the-scene-class-scene-instance-getentity-method"></a>
### getEntity method
should get a child entity by uid.

```js
var e = void 0;
scene.children = { bar: { uid: 'bar' } };
(0, _chai.expect)(function () {
    return e = scene.getEntity('bar');
}).to.not.throw(Error);
(0, _chai.expect)(e).to.eql({ uid: 'bar' });
(0, _chai.expect)(function () {
    return e = scene.getEntity('foo');
}).to.not.throw(Error);
(0, _chai.expect)(e).to.not.exist;
```

<a name="the-scene-class-scene-instance-updateentity-method"></a>
### updateEntity method
should return a promise that updates an entity by uid with
            Entity.update, then saves the updated entity back in children.

```js
scene.children = { bar: { uid: 'bar', d: 0 } };
(0, _chai.expect)(function () {
    return scene.updateEntity(engine, { uid: 'bar' }).then(function (entity) {
        (0, _chai.expect)(entity).to.eql({ uid: 'bar', d: 0 });
        (0, _chai.expect)(update.callCount).to.equal(1);
        (0, _chai.expect)(update.calledWithExactly(engine, { uid: 'bar', d: 0 }, { uid: 'bar' })).to.equal(true);
        (0, _chai.expect)(scene.children.bar).to.eql({ uid: 'bar', d: 0 });
        done();
    }).catch(done);
}).to.not.throw(Error);
```

<a name="the-scene-class-scene-instance-updateentities-method"></a>
### updateEntities method
should return a promise that sequentially updates/creates each entity
            from the provided data using the updateEntity method, then resolve
            to the updated scene.

```js
(0, _chai.expect)(function () {
    return scene.updateEntities(engine, [{ uid: 'foo', data: 42 }, { data: 0, uid: 'bar' }]).then(function (scene) {
        (0, _chai.expect)(scene).to.exist;
        (0, _chai.expect)(scene.children).to.have.all.keys(['foo', 'bar']);
        (0, _chai.expect)(scene.children.foo.data).to.equal(42);
        (0, _chai.expect)(scene.children.bar.data).to.equal(0);
        (0, _chai.expect)(updateEntity.callCount).to.equal(2);
        done();
    }).catch(done);
}).to.not.throw(Error);
```

<a name="the-scene-class-scene-instance-removeentity-method"></a>
### removeEntity method
should call Entity.dismount for the entity at the provided uid,
            and replace the entity in scene.children with the result (null).

```js
scene.children = { foo: { uid: 'foo' }, bar: { uid: 'bar' } };
(0, _chai.expect)(function () {
    return scene.removeEntity(engine, 'bar');
}).to.not.throw(Error);
(0, _chai.expect)(scene.children.bar).to.equal(null);
(0, _chai.expect)(scene.children.foo.uid).to.equal('foo');
(0, _chai.expect)(dismount.callCount).to.equal(1);
(0, _chai.expect)(dismount.calledWithExactly(engine, { uid: 'bar' })).to.equal(true);
```

<a name="the-scene-class-scene-instance-tick-method"></a>
### tick method
should call Entity.tick for each entity in its children.

```js
var foo = { uid: 'foo' },
    bar = { uid: 'bar' };
scene.children = { foo: foo, bar: bar };
(0, _chai.expect)(function () {
    return scene.tick(engine, 100, 10);
}).to.not.throw(Error);
(0, _chai.expect)(tick.callCount).to.equal(2);
(0, _chai.expect)(tick.calledWithExactly(engine, foo, 100, 10)).to.equal(true);
(0, _chai.expect)(tick.calledWithExactly(engine, bar, 100, 10)).to.equal(true);
```

<a name="stateeventproxy"></a>
# StateEventProxy
<a name="stateeventproxy-stateproxy-exported-function-integration-tests"></a>
## StateProxy exported function (integration tests)
should assign proxy properties from a list of keys to the provided object
        and emit state events when a property is reassigned.

```js
var obj = { d: null };
(0, _chai.expect)(function () {
    return (0, _stateEventProxy2.default)(obj, 'obj', ['a', 'b', 'c'], { def: 0 });
}).to.not.throw(Error);
(0, _chai.expect)(obj).to.exist;
(0, _chai.expect)(obj).to.have.all.keys(['a', 'b', 'c', 'd']);
(0, _chai.expect)(obj).to.eql({ a: 0, b: 0, c: 0, d: null });
(0, _chai.expect)(function () {
    return obj.d = 5;
}).to.not.throw(Error);
(0, _chai.expect)(obj.d).to.equal(5);
(0, _chai.expect)(function () {
    return obj.a = { foo: 'bar' };
}).to.not.throw(Error);
(0, _chai.expect)(obj.a).to.eql({ foo: 'bar' });
(0, _chai.expect)(function () {
    return obj.b = [1, obj.a, 'three'];
}).to.not.throw(Error);
(0, _chai.expect)(obj.b).to.eql([1, { foo: 'bar' }, 'three']);
(0, _chai.expect)(function () {
    return obj.b = null;
}).to.not.throw(Error);
(0, _chai.expect)(obj).to.eql({
    a: { foo: 'bar' },
    b: null,
    c: 0,
    d: 5
});
setTimeout(function () {
    (0, _chai.expect)(emit.callCount).to.equal(3);
    (0, _chai.expect)(emit.calledWith('obj.a', { foo: 'bar' })).to.equal(true);
    (0, _chai.expect)(emit.calledWith('obj.b', [1, { foo: 'bar' }, 'three'])).to.equal(true);
    (0, _chai.expect)(emit.calledWith('obj.b', null)).to.equal(true);
    done();
}, 1);
```

should assign proxy properties from a map of keys and values to the provided
        object and emit state events when a property is reassigned.

```js
var obj = { d: 10 };
(0, _chai.expect)(function () {
    return (0, _stateEventProxy2.default)(obj, 'obj', {
        a: null,
        b: { foo: 'bar' },
        c: ['foo', 'bar']
    });
}).to.not.throw(Error);
(0, _chai.expect)(obj).to.have.all.keys(['a', 'b', 'c', 'd']);
(0, _chai.expect)(obj).to.eql({ a: null, b: { foo: 'bar' }, c: ['foo', 'bar'], d: 10 });
obj.d = 42;
(0, _chai.expect)(obj.d).to.equal(42);
obj.a = [1, 2, 3];
(0, _chai.expect)(obj.a).to.eql([1, 2, 3]);
obj.b.foo = 'foo';
(0, _chai.expect)(obj.b).to.eql({ foo: 'foo' });
obj.b = 'foobar';
(0, _chai.expect)(obj.b).to.equal('foobar');
setTimeout(function () {
    (0, _chai.expect)(emit.callCount).to.equal(2);
    (0, _chai.expect)(emit.calledWith('obj.a', [1, 2, 3])).to.equal(true);
    (0, _chai.expect)(emit.calledWith('obj.b', 'foobar')).to.equal(true);
    done();
}, 1);
```

<a name="stateeventproxy-stateeventproxy-class"></a>
## StateEventProxy Class
<a name="stateeventproxy-stateeventproxy-class-ismutatefn-method"></a>
### isMutateFn method
should return true if provided key is an Array member-function that mutates
            itself.

```js
(0, _chai.expect)(_stateEventProxy.StateEventProxy.isMutateFn('copyWithin')).to.equal(true);
(0, _chai.expect)(_stateEventProxy.StateEventProxy.isMutateFn('fill')).to.equal(true);
(0, _chai.expect)(_stateEventProxy.StateEventProxy.isMutateFn('pop')).to.equal(true);
(0, _chai.expect)(_stateEventProxy.StateEventProxy.isMutateFn('push')).to.equal(true);
(0, _chai.expect)(_stateEventProxy.StateEventProxy.isMutateFn('reverse')).to.equal(true);
(0, _chai.expect)(_stateEventProxy.StateEventProxy.isMutateFn('shift')).to.equal(true);
(0, _chai.expect)(_stateEventProxy.StateEventProxy.isMutateFn('sort')).to.equal(true);
(0, _chai.expect)(_stateEventProxy.StateEventProxy.isMutateFn('splice')).to.equal(true);
(0, _chai.expect)(_stateEventProxy.StateEventProxy.isMutateFn('unshift')).to.equal(true);
```

should return false if provided key is not an Array member-function that
            mutates itself.

```js
(0, _chai.expect)(_stateEventProxy.StateEventProxy.isMutateFn('concat')).to.equal(false);
(0, _chai.expect)(_stateEventProxy.StateEventProxy.isMutateFn('forEach')).to.equal(false);
(0, _chai.expect)(_stateEventProxy.StateEventProxy.isMutateFn('join')).to.equal(false);
(0, _chai.expect)(_stateEventProxy.StateEventProxy.isMutateFn('slice')).to.equal(false);
(0, _chai.expect)(_stateEventProxy.StateEventProxy.isMutateFn('toString')).to.equal(false);
(0, _chai.expect)(_stateEventProxy.StateEventProxy.isMutateFn('length')).to.equal(false);
```

<a name="stateeventproxy-stateeventproxy-class-emit-method"></a>
### emit method
should call events.emit if the scope is not disabled.

```js
var v = 40,
    obj = {};
(0, _chai.expect)(function () {
    return _stateEventProxy.StateEventProxy.emit('test.scope', v, obj);
}).to.not.throw(Error);
setTimeout(function () {
    (0, _chai.expect)(emit.callCount).to.equal(1);
    (0, _chai.expect)(emit.calledWithExactly('test.scope', v, obj)).to.equal(true);
    done();
}, 1);
```

should not call events.emit if the scope is disabled.

```js
_stateEventProxy.DISABLE['test.scope'] = true;
(0, _chai.expect)(function () {
    return _stateEventProxy.StateEventProxy.emit('test.scope', 30, {});
}).to.not.throw(Error);
setTimeout(function () {
    (0, _chai.expect)(emit.callCount).to.equal(0);
    _stateEventProxy.DISABLE['test.scope'] = false;
    done();
}, 1);
```

<a name="stateeventproxy-stateeventproxy-class-proxifyproperty-method"></a>
### proxifyProperty method
should assign to the provided object a wrapped property that, when
            set, will emit a state event.

```js
var obj = {},
    prop = 'testProp',
    scope = 'test.obj.testProp';
(0, _chai.expect)(function () {
    return _stateEventProxy.StateEventProxy.proxifyProperty(scope, obj, prop);
}).to.not.throw(Error);
(0, _chai.expect)(obj).to.exist;
(0, _chai.expect)(obj).to.have.property('testProp');
(0, _chai.expect)(obj).to.have.key('testProp');
(0, _chai.expect)(obj.testProp).to.not.exist;
(0, _chai.expect)(buildObject.callCount).to.equal(0);
(0, _chai.expect)(buildArray.callCount).to.equal(0);
obj.testProp = 'foobar';
(0, _chai.expect)(obj.testProp).to.equal('foobar');
setTimeout(function () {
    (0, _chai.expect)(emit.callCount).to.equal(1);
    (0, _chai.expect)(emit.calledWithExactly('test.obj.testProp', 'foobar', obj));
    done();
}, 1);
```

should assign to the provided object a deeply-proxied value when
            the value to be assigned is an array and deep=true.

```js
var obj = {},
    prop = 'test',
    scope = 'obj.test',
    v = [1, 2, 3],
    opts = { deep: true, enumerable: true };
(0, _chai.expect)(function () {
    return _stateEventProxy.StateEventProxy.proxifyProperty(scope, obj, prop, v, opts);
}).to.not.throw(Error);
(0, _chai.expect)(obj).to.exist;
(0, _chai.expect)(obj).to.have.property('test').that.eqls([1, 2, 3]);
(0, _chai.expect)(buildObject.callCount).to.equal(0);
(0, _chai.expect)(buildArray.callCount).to.equal(1);
(0, _chai.expect)(buildArray.calledWithExactly(scope, obj, v, opts)).to.equal(true);
obj.test = [3, 2];
(0, _chai.expect)(obj.test).to.eql([3, 2]);
(0, _chai.expect)(buildArray.callCount).to.equal(2);
(0, _chai.expect)(buildArray.calledWithExactly(scope, obj, [3, 2], opts));
setTimeout(function () {
    (0, _chai.expect)(emit.callCount).to.equal(1);
    (0, _chai.expect)(emit.calledWithExactly(scope, [3, 2], obj)).to.equal(true);
    done();
}, 1);
```

should assign to the provided object a deeply-proxied value when
            the value to be assigned is an object and deep=true.

```js
var obj = {},
    prop = 'test',
    scope = 'obj.test',
    v = { foo: 'bar' },
    opts = { deep: true, enumerable: true };
(0, _chai.expect)(function () {
    return _stateEventProxy.StateEventProxy.proxifyProperty(scope, obj, prop, v, opts);
}).to.not.throw(Error);
(0, _chai.expect)(obj).to.exist;
(0, _chai.expect)(obj).to.have.property('test').that.eqls(v);
(0, _chai.expect)(buildArray.callCount).to.equal(0);
(0, _chai.expect)(buildObject.callCount).to.equal(1);
(0, _chai.expect)(buildObject.calledWithExactly(scope, v, opts)).to.equal(true);
obj.test = { bar: 'foo' };
(0, _chai.expect)(obj.test).to.eql({ bar: 'foo' });
(0, _chai.expect)(buildObject.callCount).to.equal(2);
(0, _chai.expect)(buildObject.calledWithExactly(scope, { bar: 'foo' }, opts));
setTimeout(function () {
    (0, _chai.expect)(emit.callCount).to.equal(1);
    (0, _chai.expect)(emit.calledWithExactly(scope, { bar: 'foo' }, obj)).to.equal(true);
    done();
}, 1);
```

should assign to the provided object a wrapped property that is
            not enumerable when enumerable=false.

```js
var obj = {},
    prop = 'testProp',
    scope = 'test.obj.testProp';
(0, _chai.expect)(function () {
    return _stateEventProxy.StateEventProxy.proxifyProperty(scope, obj, prop, 42, {
        enumerable: false
    });
}).to.not.throw(Error);
(0, _chai.expect)(obj).to.exist;
(0, _chai.expect)(obj).to.have.property('testProp');
(0, _chai.expect)(obj).to.not.have.key('testProp');
(0, _chai.expect)(obj.testProp).to.equal(42);
(0, _chai.expect)(buildObject.callCount).to.equal(0);
(0, _chai.expect)(buildArray.callCount).to.equal(0);
obj.testProp = 'foobar';
(0, _chai.expect)(obj.testProp).to.equal('foobar');
setTimeout(function () {
    (0, _chai.expect)(emit.callCount).to.equal(1);
    (0, _chai.expect)(emit.calledWithExactly('test.obj.testProp', 'foobar', obj));
    done();
}, 1);
```

<a name="stateeventproxy-stateeventproxy-class-buildproxyobject-method"></a>
### buildProxyObject method
should return an object that has proxified properties forEach
            each property on the original object.

```js
var p = void 0,
    scope = 'test.obj.obj',
    obj = {
    foo: 'bar',
    bar: 'foo'
},
    opts = { deep: true };
(0, _chai.expect)(function () {
    return p = _stateEventProxy.StateEventProxy.buildProxyObject(scope, obj, opts);
}).to.not.throw(Error);
(0, _chai.expect)(p).to.exist;
(0, _chai.expect)(proxify.callCount).to.equal(2);
(0, _chai.expect)(proxify.calledWithExactly(scope + '.foo', p, 'foo', 'bar', opts)).to.equal(true);
(0, _chai.expect)(proxify.calledWithExactly(scope + '.bar', p, 'bar', 'foo', opts)).to.equal(true);
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
(0, _chai.expect)(function () {
    return p = _stateEventProxy.StateEventProxy.buildProxyArray(scope, obj, arr, opts);
}).to.not.throw(Error);
(0, _chai.expect)(p).to.exist;
(0, _chai.expect)(p.length).to.equal(4);
(0, _chai.expect)(p[0].length).to.equal(3);
(0, _chai.expect)(p.sort()).to.eql(arr.sort());
(0, _chai.expect)(buildObject.callCount).to.equal(1);
(0, _chai.expect)(buildObject.calledWithExactly(scope + '[3]', { foo: 'bar' }, opts)).to.equal(true);
p[1] = 8;
delete p[0][1];
setTimeout(function () {
    (0, _chai.expect)(emit.callCount).to.equal(3);
    (0, _chai.expect)(emit.calledWithExactly(scope, p, obj)).to.equal(true);
    (0, _chai.expect)(emit.calledWithExactly(scope + '[1]', 8, p)).to.equal(true);
    (0, _chai.expect)(emit.calledWithExactly(scope + '[0][1]', undefined, p[0])).to.equal(true);
    done();
}, 1);
```

<a name="stateeventmanager"></a>
# StateEventManager
should have emit and on methods for dispatching and subscribing to
    events.

```js
(0, _chai.expect)(_stateEvents.Events).to.exist;
(0, _chai.expect)(_stateEvents.Events).to.have.property('emit').that.is.a('function');
(0, _chai.expect)(_stateEvents.Events).to.have.property('on').that.is.a('function');
```

should dispatch an event with the emit method and callback the events
    listener for that event, registered with the on method.

```js
var test = 0;
(0, _chai.expect)(function () {
    _stateEvents.Events.on('test', function (data) {
        (0, _chai.expect)(data).to.equal('foobar');
        test++;
    });
    _stateEvents.Events.on('finish', function () {
        (0, _chai.expect)(test).to.equal(2);
        _stateEvents.Events.removeAllListeners('test');
        _stateEvents.Events.removeAllListeners('finish');
        _stateEvents.Events.removeAllListeners('foo');
        done();
    });
    _stateEvents.Events.on('foo', function () {
        done('No foo event emitted, but handler called.');
    });
    _stateEvents.Events.emit('test', 'foobar');
    _stateEvents.Events.emit('bar');
    _stateEvents.Events.emit('test', 'foobar');
    _stateEvents.Events.emit('finish');
}).to.not.throw(Error);
```

