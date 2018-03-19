import noop from 'lodash.noop';
import StateEventProxy from 'src/StateEventProxy';
import stateEvents from 'src/stateEvents';
import Scene from 'src/Scene';
import PlayerController from 'src/PlayerController';
import MockScene from './Scene.mock';
import MockCtrl from './PlayerController.mock';
import Engine, { getPrivateDataForTest, LoadStates } from 'src/Engine';

const params = {
    logger: { info: noop, debug: noop, error: noop, warn: noop },
    provider: {},
    resourceLoader: () => Promise.resolve(params.provider),
    settings: { debug: true, statsInterval: 100 },
    canvas: {
        addEventListener: noop
    }
};

describe('The Engine Class', () => {
    const mockScene = new MockScene();
    let PC;

    beforeEach(() => {
        sandbox.stub(PlayerController, 'create').callsFake(ref => MockCtrl(ref));
        sandbox.stub(Scene, 'create').callsFake(MockScene);
    });
    afterEach(() => {
        Engine.destroy();
    });

    it(`should be a singleton class`, () => {
        let engine = new Engine();
        expect(() => engine = new Engine()).to.throw(Error);
    });

    describe('init method', () => {

        beforeEach(() => {
            sandbox.stub(params, 'resourceLoader').callsFake(() => Promise.resolve(params.provider));
            sandbox.stub(Engine, 'constructorHelper');
        });

        it(`should initialize a new Engine instance if none exist by calling the
        Engine constructor, and kicking off the resourceLoader`, async () => {
            let engine, load;

            expect(Engine.instance).to.not.exist;
            engine = Engine.init(params.logger, params.resourceLoader, undefined, params.settings);
            expect(engine).to.exist;
            expect(Engine.instance).to.equal(engine);
            expect(engine.loading).to.equal(LoadStates.RES);
            expect(Engine.constructorHelper.callCount).to.equal(1);
            expect(Engine.constructorHelper).to.have.been.calledWithExactly(engine, params.logger, undefined, params.settings);
            expect(params.resourceLoader.callCount).to.equal(1);
            load = getPrivateDataForTest().loader;
            expect(load).to.exist;
            await load;
            const { resourceProvider } = getPrivateDataForTest();
            expect(resourceProvider).to.exist;
            expect(resourceProvider).to.equal(params.provider);
            expect(engine.loading).to.equal(LoadStates.INIT);
            expect(engine.scene).to.exist;
        });

        it(`should return the engine instance if it has already been initialized`, () => {
            const engine = Engine.init(params.logger, params.resourceLoader, undefined, params.settings);
            let ngn;

            params.resourceLoader.reset();
            Engine.constructorHelper.reset();
            ngn = Engine.init();
            expect(ngn).to.exist;
            expect(ngn).to.equal(engine);
            expect(params.resourceLoader.callCount).to.equal(0);
            expect(Engine.constructorHelper.callCount).to.equal(0);
        });
    });

    describe('constructor', () => {

        beforeEach(() => sandbox.stub(StateEventProxy, 'create').returns({}));

        it(`should create a new Engine instance with EventProxied properties
        (fps, loading) and standard enumerable properties (scene, running,
        settings)`, () => {
            const engine = new Engine(params.logger, undefined, params.settings);

            expect(engine).to.exist;
            expect(StateEventProxy.create.callCount).to.equal(1);
            expect(StateEventProxy.create.calledWithExactly(engine, 'engine', { fps: 0, loading: LoadStates.BOOT }));
            expect(engine).to.have.property('fps').that.equals(0);
            expect(engine).to.have.property('loading').that.equals(LoadStates.BOOT);
            expect(engine).to.have.property('scene').that.equals(null);
            expect(engine).to.have.property('running').that.equals(false);
            expect(engine).to.have.property('settings').that.equals(params.settings);

            const { logger, playerController } = getPrivateDataForTest();
            expect(logger).to.equal(params.logger);
            expect(playerController).to.exist;
            expect(playerController.constructor).to.have.been.calledWithExactly(engine);
        });
    });

    describe('Engine instance', () => {
        let engine;

        beforeEach(() => {
            engine = Engine.init(params.logger, params.resourceLoader, undefined, params.settings);
        });

        describe('GL getter method', () => {

            it(`should return the read-only GraphicsLibary once loaded`, async () => {
                const gl = engine.GL;

                expect(gl).to.equal(null);
                await engine.mount({});
                expect(engine.GL).to.equal(BabylonJS);
                expect(gl).to.not.equal(engine.GL);
            });
        });

        describe('baby getter method', () => {

            it(`should return the read-only GraphicsLibary Engine instance once
            mounted`, async () => {
                const canvas = {};
                
                expect(engine.baby).to.equal(null);
                await engine.mount(canvas);
                expect(engine.baby).to.not.equal(null);
            });
        });

        describe('canvas getter method', () => {

            it(`should return the read-only canvas element once mounted`, async () => {
                const canvas = {};
                
                expect(engine.canvas).to.equal(null);
                await engine.mount(canvas);
                expect(engine.canvas).to.not.equal(null);
                expect(engine.canvas).to.equal(canvas);
            });
        });

        describe('provider getter method', () => {

            it(`should return the read-only ResourceProvider once loaded`, () => {
                const provider = engine.provider;

                // expect(provider).to.equal(null); has already loaded in test env
                expect(engine.provider).to.not.equal(null);
                expect(engine.provider).to.equal(params.provider);
            });
        });

        describe('ctrl getter method', () => {

            it(`should return the read-only PlayerController instance`, () => {
                const ctrl = engine.ctrl;

                expect(ctrl).to.not.equal(null);
                expect(ctrl.constructor).to.have.been.calledWithExactly(engine);
            });
        });

        describe('logger getter method', () => {

            it(`should return the read-only logger instance`, () => {
                const logger = engine.logger;

                expect(logger).to.not.equal(null);
                expect(logger).to.equal(params.logger);
            });
        });

        describe('terrain getter and setter methods', () => {

            it(`should set and get the engine's terrain entity`, () => {
                const terrain = {};
                let t = engine.terrain;

                expect(t).to.equal(null);
                engine.terrain = terrain;
                t = engine.terrain;
                expect(t).to.equal(terrain);
            });
        });

        describe('mount method', () => {

            it(`should return a promise that mounts the engine to the provided
            canvas element after the ResourceProvider and GraphicsLibrary have
            been loaded (resolves to self)`, async () => {
                const canvas = {};
                const e = await engine.mount(canvas);
                const { GraphicsLibrary, babylonEngine, canvasElement } = getPrivateDataForTest();

                expect(e).to.equal(engine);
                expect(engine.loading).to.equal(LoadStates.DATA);
                expect(GraphicsLibrary).to.equal(BabylonJS);
                expect(babylonEngine.constructor).to.have.been.calledWithExactly(canvas, true);
                expect(canvasElement).to.equal(canvas);
                expect(engine.scene.mount.callCount).to.equal(1);
                expect(engine.scene.mount.calledWithExactly(engine)).to.equal(true);
            });
        });

        describe('dismount method', () => {
            let stop, scene, baby;

            beforeEach(async () => {
                await engine.mount({});
                stop = sandbox.stub(engine, 'stop');
                if (!engine.scene) throw new Error('Test setup failed. No engine.scene exists!');
                scene = engine.scene;
                baby = engine.baby;
            });

            it(`should return a promise that stops the engine render process when
            running, dismounts and deletes the scene, along with the GraphicsLibrary
            Engine instance and canvas element before resolving to self`, async () => {
                engine.running = true;
                const e = await engine.dismount();
                const { babylonEngine, canvasElement } = getPrivateDataForTest();

                expect(e).to.equal(engine);
                expect(scene.dismount.callCount).to.equal(1);
                expect(scene.dismount.calledWithExactly(engine)).to.equal(true);
                expect(baby.dispose.callCount).to.equal(1);
                expect(babylonEngine).to.equal(null);
                expect(canvasElement).to.equal(null);
                expect(stop.callCount).to.equal(1);
            });

            it(`should return a promise dismounts and deletes the scene, along
            with the GraphicsLibrary Engine instance and canvas element before
            resolving to self`, async () => {
                await engine.dismount();
                const { babylonEngine, canvasElement } = getPrivateDataForTest();

                expect(scene.dismount.callCount).to.equal(1);
                expect(scene.dismount.calledWithExactly(engine)).to.equal(true);
                expect(baby.dispose.callCount).to.equal(1);
                expect(babylonEngine).to.equal(null);
                expect(canvasElement).to.equal(null);
                expect(stop.callCount).to.equal(0);
            });
        });

        describe('run method', () => {
            let addListener;

            beforeEach(async () => {
                await engine.mount(params.canvas);
                addListener = sinon.stub(params.canvas, 'addEventListener');
            });
            afterEach(async () => {
                await engine.dismount();
                addListener.restore();
            });

            it(`should return a promise that initializes the scene with the provided
            entities, attaches event listeners to the canvas element, and begins
            the main render/update loop before resolving to self`, async () => {
                const data = [
                    { id: 'foo', uid: 'foo' },
                    { id: 'bar', uid: 'bar' }
                ];

                expect(engine.running).to.equal(false);
                const e = await engine.run(data);

                expect(e).to.equal(engine);
                expect(engine.ctrl.setup.callCount).to.equal(1);
                expect(engine.ctrl.setup).to.have.been.calledWithExactly(engine.settings);
                expect(engine.scene.updateEntities.callCount).to.equal(1);
                expect(engine.scene.updateEntities).to.have.been.calledWithExactly(engine, data);
                expect(addListener.callCount).to.equal(2);
                expect(addListener).to.have.been.calledWith('click');
                expect(addListener).to.have.been.calledWith('contextmenu');
                expect(engine.baby.runRenderLoop.callCount).to.equal(1);
                expect(engine.loading).to.equal(LoadStates.DONE);
                expect(engine.fps).to.equal(0);
                expect(engine.running).to.equal(true);
                await wait(engine.settings.statsInterval + 1);
                expect(engine.fps).to.equal(60);
            });

            it(`should return a promise that attaches event listeners to the canvas
            element and begins the main render/update loop without adding new
            entites, when none provided, before resolving to self`, async () => {
                expect(engine.running).to.equal(false);
                await engine.run();
                expect(engine.ctrl.setup.callCount).to.equal(1);
                expect(engine.ctrl.setup).to.have.been.calledWithExactly(engine.settings);
                expect(engine.scene.updateEntities.callCount).to.equal(0);
                expect(addListener.callCount).to.equal(2);
                expect(addListener).to.have.been.calledWith('click');
                expect(addListener).to.have.been.calledWith('contextmenu');
                expect(engine.baby.runRenderLoop.callCount).to.equal(1);
                expect(engine.loading).to.equal(LoadStates.DONE);
                expect(engine.fps).to.equal(0);
                expect(engine.running).to.equal(true);
            });

            it(`should return a promise that resolves to self with engine is already
            running`, async () => {
                engine.running = true;
                await engine.run();
                expect(addListener.callCount).to.equal(0);
                expect(engine.scene.updateEntities.callCount).to.equal(0);
                expect(engine.ctrl.setup.callCount).to.equal(0);
                expect(engine.baby.runRenderLoop.callCount).to.equal(0);
                expect(engine.loading).to.equal(LoadStates.DATA);
            });

            it(`should return a promise that resolves to self with engine is not in
            the correct loading state`, async () => {
                engine.loading = LoadStates.RES;
                await engine.run();
                expect(addListener.callCount).to.equal(0);
                expect(engine.scene.updateEntities.callCount).to.equal(0);
                expect(engine.ctrl.setup.callCount).to.equal(0);
                expect(engine.baby.runRenderLoop.callCount).to.equal(0);
                expect(engine.loading).to.equal(LoadStates.RES);
                expect(engine.running).to.equal(false);
            });
        });

        describe('stop method', () => {

            beforeEach(async () => {
                await engine.mount(params.canvas);
                await engine.run();
                engine.baby.reset();
            });

            when('engine is running', () => {
                it(`should stop the render/update loop if running`, () => {
                    let e; 
    
                    expect(engine.running).to.equal(true);
                    e = engine.stop();
                    expect(e).to.equal(engine);
                    expect(engine.running).to.equal(false);
                    expect(engine.loading).to.equal(LoadStates.DATA);
                    expect(engine.baby.stopRenderLoop.callCount).to.equal(1);
                });
            });

            when('engine is not running', () => {
                beforeEach(async () => {
                    await engine.stop();
                    engine.baby.reset();
                });

                it(`should just return self when engine is not running`, () => {
                    let e;
    
                    expect(engine.running).to.equal(false);
                    e = engine.stop();
                    expect(e).to.equal(engine);
                    expect(engine.loading).to.equal(LoadStates.DATA);
                    expect(engine.baby.stopRenderLoop.callCount).to.equal(0);
                });
            });
        });

        describe('resize method', () => {

            beforeEach(async () => {
                await engine.mount(params.canvas);
            });

            it(`should call the resize method of the GraphicsLibrary engine
            instance`, () => {
                engine.resize();
                expect(engine.baby.resize.callCount).to.equal(1);
            });
        });

        describe('toVector method', () => {

            beforeEach(async () => {
                await engine.mount({});
            });

            it(`should convert a plain object with (x,y,z) properties into a 3D
            Vector object`, () => {
                const v = engine.toVector({ x: 1, y: 3.3, z: 4 });

                expect(v).to.exist;
                expect(BabylonJS.Vector3.callCount).to.equal(1);
                expect(BabylonJS.Vector3.calledWithExactly(1, 3.3, 4)).to.equal(true);
            });

            it(`should return a new zero vector by default`, () => {
                const v = engine.toVector();

                expect(v).to.exist;
                expect(BabylonJS.Vector3.callCount).to.equal(1);
                expect(BabylonJS.Vector3.calledWithExactly(0, 0, 0)).to.equal(true);
            });
        });

        describe('emitDebugEvent method', () => {
            beforeEach(() => {
                sandbox.stub(engine, 'emitEvent');
            });
            afterEach(() => {
                params.settings.debug = true;
            });

            it(`should emit a state event if settings.debug = true`, () => {
                engine.emitDebugEvent('test', {});
                expect(engine.emitEvent.callCount).to.equal(1);
                expect(engine.emitEvent.calledWithExactly('test', {})).to.equal(true);
            });

            it(`should not emit an event if settings.debug = false`, () => {
                params.settings.debug = false;
                engine.emitDebugEvent('test', {});
                expect(engine.emitEvent.callCount).to.equal(0);
            });
        });

        describe('onDebugEvent method', () => {
            beforeEach(() => {
                sandbox.stub(engine, 'onEvent',);
            });
            afterEach(() => {
                params.settings.debug = true;
            });

            it(`should add an event listener if settings.debug = true`, () => {
                engine.onDebugEvent('test', noop);
                expect(engine.onEvent.callCount).to.equal(1);
                expect(engine.onEvent.calledWithExactly('test', noop)).to.equal(true);
            });
            it(`should not add an event listener if settings.debug = false`, () => {
                params.settings.debug = false;
                engine.onDebugEvent('test', noop);
                expect(engine.onEvent.callCount).to.equal(0);
            });
        });

        describe('emitEvent method', () => {
            beforeEach(() => sandbox.stub(stateEvents, 'emit'));

            it(`should unconditionally emit a state event`, () => {
                engine.emitEvent('test', 40, {});
                expect(stateEvents.emit.callCount).to.equal(1);
                expect(stateEvents.emit.calledWithExactly('test', 40, {})).to.equal(true);
            });
        });

        describe('onEvent method', () => {
            beforeEach(() => sandbox.stub(stateEvents, 'on'));

            it(`should unconditionally listen to a state event`, () => {
                engine.onEvent('test', noop);
                expect(stateEvents.on.callCount).to.equal(1);
                expect(stateEvents.on.calledWithExactly('test', noop)).to.equal(true);
            });
        });

        describe('registerKeyAction method', () => {
            let handler = noop;

            beforeEach(async () => {
                await engine.mount({})
            });

            it(`should register event listeners to fire the handler provided for
            the key event specified, onKeyUp or onKeyDown`, () => {
                engine.registerKeyAction('f', { handler });
                expect(engine.scene.baby.actionManager).to.exist;
                expect(BabylonJS.ActionManager.callCount).to.equal(1);
                expect(BabylonJS.ActionManager.calledWithExactly(engine.scene.baby))
                    .to.equal(true);
                expect(engine.scene.baby.actionManager.registerAction.callCount).to.equal(2);
                expect(BabylonJS.ExecuteCodeAction.callCount).to.equal(2);
                expect(BabylonJS.ExecuteCodeAction.calledWith({ trigger: 'down', parameter: 'f' }))
                    .to.equal(true);
                expect(BabylonJS.ExecuteCodeAction.calledWith({ trigger: 'up', parameter: 'f' }))
                    .to.equal(true);
            });

            it(`should register an event listener for the onKeyUp event for the
            provided key if the upHandler argument is set`, () => {
                engine.registerKeyAction('g', { upHandler: handler });
                expect(engine.scene.baby.actionManager).to.exist;
                expect(BabylonJS.ActionManager.callCount).to.equal(1);
                expect(BabylonJS.ActionManager.calledWithExactly(engine.scene.baby))
                    .to.equal(true);
                expect(engine.scene.baby.actionManager.registerAction.callCount).to.equal(1);
                expect(BabylonJS.ExecuteCodeAction.callCount).to.equal(1);
                expect(BabylonJS.ExecuteCodeAction.calledWith({ trigger: 'up', parameter: 'g' }))
                    .to.equal(true);
            });

            it(`should register an event listener for the onKeyDown event for the
            provided key if the downHandler argument is set`, () => {
                engine.registerKeyAction('h', { downHandler: handler });
                expect(engine.scene.baby.actionManager).to.exist;
                expect(BabylonJS.ActionManager.callCount).to.equal(1);
                expect(BabylonJS.ActionManager.calledWithExactly(engine.scene.baby))
                    .to.equal(true);
                expect(engine.scene.baby.actionManager.registerAction.callCount).to.equal(1);
                expect(BabylonJS.ExecuteCodeAction.callCount).to.equal(1);
                expect(BabylonJS.ExecuteCodeAction.calledWith({ trigger: 'down', parameter: 'h' }))
                    .to.equal(true);
            });
        });

        describe('registerMouseEventsForEntity method', () => {
            let baby;
            const entity = {
                meshAsync: Promise.resolve({
                    ready: () => Promise.resolve({baby})
                })
            };
            const handler = noop;

            beforeEach(() => {
                baby = {};
                return engine.mount({});
            });

            it(`should set the hover cursor for the entity's primary mesh if cursor
            arugment is provided`, async () => {
                await engine.registerMouseEventsForEntity(entity, { cursor: 'pointer' });
                expect(BabylonJS.ActionManager.callCount).to.equal(1);
                expect(BabylonJS.ActionManager.calledWithExactly(engine.scene.baby))
                    .to.equal(true);
                expect(baby.actionManager).to.exist;
                expect(baby.actionManager.hoverCursor).to.equal('pointer');
                expect(baby.actionManager.registerAction.callCount).to.equal(0);
                expect(BabylonJS.ExecuteCodeAction.callCount).to.equal(0);
            });

            it(`should set an entityClick event listener on the entity's primary
            mesh if click argument is provided`, async () => {
                await engine.registerMouseEventsForEntity(entity, { click: handler });
                expect(BabylonJS.ActionManager.callCount).to.equal(1);
                expect(BabylonJS.ActionManager.calledWithExactly(engine.scene.baby))
                    .to.equal(true);
                expect(baby.actionManager).to.exist;
                expect(baby.actionManager.hoverCursor).to.not.exist;
                expect(baby.actionManager.registerAction.callCount).to.equal(1);
                expect(BabylonJS.ExecuteCodeAction.callCount).to.equal(1);
                expect(BabylonJS.ExecuteCodeAction.calledWith('left'))
                    .to.equal(true);
            });

            it(`should set an entityAltClick event listener on the entity's primary
            mesh if the altClick argument is provided`, async () => {
                await engine.registerMouseEventsForEntity(entity, { altClick: handler });
                expect(BabylonJS.ActionManager.callCount).to.equal(1);
                expect(BabylonJS.ActionManager.calledWithExactly(engine.scene.baby))
                    .to.equal(true);
                expect(baby.actionManager).to.exist;
                expect(baby.actionManager.hoverCursor).to.not.exist;
                expect(baby.actionManager.registerAction.callCount).to.equal(1);
                expect(BabylonJS.ExecuteCodeAction.callCount).to.equal(1);
                expect(BabylonJS.ExecuteCodeAction.calledWith('right'))
                    .to.equal(true);
            });

            it(`should set an entityOver event listener on the entity's primary
            mesh if the over argument is provided`, async () => {
                await engine.registerMouseEventsForEntity(entity, { over: handler });
                expect(BabylonJS.ActionManager.callCount).to.equal(1);
                expect(BabylonJS.ActionManager.calledWithExactly(engine.scene.baby))
                    .to.equal(true);
                expect(baby.actionManager).to.exist;
                expect(baby.actionManager.hoverCursor).to.not.exist;
                expect(baby.actionManager.registerAction.callCount).to.equal(1);
                expect(BabylonJS.ExecuteCodeAction.callCount).to.equal(1);
                expect(BabylonJS.ExecuteCodeAction.calledWith('over'))
                    .to.equal(true);
            });

            it(`should set an entityOut event listener on the entity's primrary
            mesh if the out argument is provided`, async () => {
                await engine.registerMouseEventsForEntity(entity, { out: handler });
                expect(BabylonJS.ActionManager.callCount).to.equal(1);
                expect(BabylonJS.ActionManager.calledWithExactly(engine.scene.baby))
                    .to.equal(true);
                expect(baby.actionManager).to.exist;
                expect(baby.actionManager.hoverCursor).to.not.exist;
                expect(baby.actionManager.registerAction.callCount).to.equal(1);
                expect(BabylonJS.ExecuteCodeAction.callCount).to.equal(1);
                expect(BabylonJS.ExecuteCodeAction.calledWith('out'))
                    .to.equal(true);
            });
        });

        describe('deregisterMouseEventsForEntity method', () => {
            let baby = {};
            const entity = {
                mesh: { baby },
                meshAsync: Promise.resolve({
                    ready: () => Promise.resolve({ baby })
                }),
            };
            const handler = noop;

            beforeEach(() => engine.mount({}).then(() =>
                engine.registerMouseEventsForEntity(entity, {
                    click: handler,
                    altClick: handler,
                    over: handler,
                    out: handler,
                    cursor: 'crosshair',
                })
            ));
            afterEach(() => baby = {});

            it(`should remove all click/altClick/over/out event listeners for the
            given entity's primary mesh, and reset the hover cursor style`, () => {
                expect(baby.actionManager.actions).to.have.length(4);
                engine.deregisterMouseEventsForEntity(entity);
                expect(baby.actionManager.actions).to.have.length(0);
                expect(baby.actionManager.hoverCursor).to.equal('default');
            });
        });
    });
});
