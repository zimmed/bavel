import {_} from '../src/utils';
import {expect} from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import Promise from 'bluebird';
import {instances} from 'basic-singleton';

require.ensure = _.noop;
const SceneMock = require('./scene.mock');
const PlayerControllerMock = require('./player-controller.mock');
const BabylonJSMock = require('./babylonjs.mock');
const EventProxyMock = sinon.spy(function (obj, s, p) { return _.assign(obj, p); });
const eventsMock = {
    emit: sinon.spy(_.noop),
    on: sinon.spy(_.noop),
    reset: () => {eventsMock.emit.reset(); eventsMock.on.reset();}
};

proxyquire.noCallThru();
const EngineModule = proxyquire('../src/engine.js', {
    './scene': SceneMock,
    './player-controller': PlayerControllerMock,
    './state-event-proxy': EventProxyMock,
    './state-events': eventsMock,
    'babylonjs': BabylonJSMock
});
const Engine = EngineModule.default;
const {getPrivateDataForTest, LoadStates} = EngineModule;

const params = {
    logger: {info: _.noop, debug: _.noop, error: _.noop, warn: _.noop},
    provider: {},
    resourceLoader: () => Promise.resolve(params.provider),
    settings: {debug: true},
    canvas: {
        addEventListener: _.noop
    }
};

describe('The Engine Class', () => {
    let sceneSpy, playerCtrlSpy;

    before(() => {
        sceneSpy = sinon.spy(SceneMock, 'default');
        playerCtrlSpy = sinon.spy(PlayerControllerMock, 'default');
    });
    afterEach(() => {
        delete instances['Engine'];
        sceneSpy.reset();
        playerCtrlSpy.reset();
        BabylonJSMock.reset();
        EventProxyMock.reset();
        eventsMock.reset();
    });

    it(`should be a singleton class`, () => {
        expect(Engine).to.be.a('function');
        expect(Engine.__proto__.name).to.equal('Singleton');
    });

    describe('init method', () => {
        let loader, initialize;

        beforeEach(() => {
            loader = sinon.stub(params, 'resourceLoader', () => Promise.resolve(params.provider));
            initialize = sinon.stub(Engine, 'constructorHelper', _.noop);
        });
        afterEach(() => {
            loader.restore();
            initialize.restore();
        });

        it(`should initialize a new Engine instance if none exist by calling the
        Engine constructor, and kicking off the resourceLoader`, (done) => {
            let engine, load;

            expect(Engine.instance).to.not.exist;
            expect(() => engine = Engine.init(params.logger, params.resourceLoader, null, params.settings))
                .to.not.throw(Error);
            expect(engine).to.exist;
            expect(engine.loading).to.equal(LoadStates.RES);
            expect(initialize.callCount).to.equal(1);
            expect(initialize.calledWithExactly(engine, params.logger, null, params.settings)).to.equal(true);
            expect(loader.callCount).to.equal(1);
            load = getPrivateDataForTest().loader;
            expect(load).to.exist;
            expect(() => load.then(() => {
                let {resourceProvider} = getPrivateDataForTest();

                expect(resourceProvider).to.exist;
                expect(resourceProvider).to.equal(params.provider);
                expect(engine.loading).to.equal(LoadStates.INIT);
                expect(sceneSpy.callCount).to.equal(1);
                expect(engine.scene).to.exist;
                expect(engine.scene.stubs.constructor.calledWith).to.eql([engine]);
                done();
            }).catch(done)).to.not.throw(Error);
        });

        it(`should return the engine instance if it has already been initialized`, () => {
            let ngn, engine = Engine.init(params.logger, params.resourceLoader, null, params.settings);

            loader.reset();
            initialize.reset();
            expect(() => ngn = Engine.init())
                .to.not.throw(Error);
            expect(ngn).to.exist;
            expect(ngn).to.equal(engine);
            expect(loader.callCount).to.equal(0);
            expect(initialize.callCount).to.equal(0);
        });
    });

    describe('constructor', () => {

        it(`should instantiate a new Engine instance with EventProxied properties
        (fps, loading) and standard enumerable properties (scene, running,
        settings)`, () => {
            let engine;

            expect(() => engine = new Engine(params.logger, null, params.settings))
                .to.not.throw(Error);
            expect(engine).to.exist;
            expect(EventProxyMock.callCount).to.equal(1);
            expect(EventProxyMock.calledWithExactly(engine, 'engine', {fps: 0, loading: LoadStates.BOOT}));
            expect(engine).to.have.property('fps').that.equals(0);
            expect(engine).to.have.property('loading').that.equals(LoadStates.BOOT);
            expect(engine).to.have.property('scene').that.equals(null);
            expect(engine).to.have.property('running').that.equals(false);
            expect(engine).to.have.property('settings').that.equals(params.settings);
            let {logger, playerController} = getPrivateDataForTest();
            expect(logger).to.exist;
            expect(logger).to.equal(params.logger);
            expect(playerController).to.exist;
            expect(playerController.stubs.constructor.calledWith).to.eql([engine]);
        });
    });

    describe('Engine instance', () => {
        let engine;

        beforeEach(() => {
            engine = Engine.init(params.logger, params.resourceLoader, null, params.settings);
        });
        afterEach(() => {
        });

        describe('GL getter method', () => {

            it(`should return the read-only GraphicsLibary once loaded`, (done) => {
                let gl;

                expect(() => gl = engine.GL).to.not.throw(Error);
                expect(gl).to.equal(null);
                engine.mount({}).then(() => {
                    expect(() => gl = engine.GL).to.not.throw(Error);
                    expect(gl).to.equal(BabylonJSMock);
                    done();
                }).catch(done);
            });
        });

        describe('baby getter method', () => {

            it(`should return the read-only GraphicsLibary Engine instance once
            mounted`, (done) => {
                let baby, canvas = {};

                expect(() => baby = engine.baby).to.not.throw(Error);
                expect(baby).to.equal(null);
                engine.mount(canvas).then(() => {
                    expect(() => baby = engine.baby).to.not.throw(Error);
                    expect(baby).to.not.equal(null);
                    done();
                }).catch(done);
            });
        });

        describe('canvas getter method', () => {

            it(`should return the read-only canvas element once mounted`, (done) => {
                let c, canvas = {};

                expect(() => c = engine.canvas).to.not.throw(Error);
                expect(c).to.equal(null);
                engine.mount(canvas).then(() => {
                    expect(() => c = engine.canvas).to.not.throw(Error);
                    expect(c).to.not.equal(null);
                    expect(c).to.equal(canvas);
                    done();
                }).catch(done);
            });
        });

        describe('provider getter method', () => {

            it(`should return the read-only ResourceProvider once loaded`, () => {
                let provider;

                expect(() => provider = engine.provider).to.not.throw(Error);
                // expect(provider).to.equal(null); has already loaded in test env
                expect(engine.provider).to.not.equal(null);
                expect(engine.provider).to.equal(params.provider);
            });
        });

        describe('ctrl getter method', () => {

            it(`should return the read-only PlayerController instance`, () => {
                let ctrl;

                expect(() => ctrl = engine.ctrl).to.not.throw(Error);
                expect(ctrl).to.not.equal(null);
                expect(ctrl.stubs.constructor.calledWith).to.eql([engine]);
            });
        });

        describe('logger getter method', () => {

            it(`should return the read-only logger instance`, () => {
                let logger;

                expect(() => logger = engine.logger).to.not.throw(Error);
                expect(logger).to.not.equal(null);
                expect(logger).to.equal(params.logger);
            });
        });

        describe('terrain getter and setter methods', () => {

            it(`should set and get the engine's terrain entity`, () => {
                let terrain = {}, t;

                expect(() => t = engine.terrain).to.not.throw(Error);
                expect(t).to.equal(null);
                expect(() => engine.terrain = terrain).to.not.throw(Error);
                expect(() => t = engine.terrain).to.not.throw(Error);
                expect(t).to.equal(terrain);
            });
        });

        describe('mount method', () => {

            it(`should return a promise that mounts the engine to the provided
            canvas element after the ResourceProvider and GraphicsLibrary have
            been loaded (resolves to self)`, (done) => {
                let canvas = {};

                expect(() => engine.mount(canvas).then(e => {
                    let {GraphicsLibrary, babylonEngine, canvasElement} = getPrivateDataForTest();

                    expect(e).to.equal(engine);
                    expect(engine.loading).to.equal(LoadStates.DATA);
                    expect(GraphicsLibrary).to.equal(BabylonJSMock);
                    expect(babylonEngine.stubs.constructor.calledWith).to.eql([canvas, true]);
                    expect(canvasElement).to.equal(canvas);
                    expect(engine.scene.stubs.mount.callCount).to.equal(1);
                    expect(engine.scene.stubs.mount.calledWithExactly(engine)).to.equal(true);
                    done();
                }).catch(done)).to.not.throw(Error);
            });
        });

        describe('dismount method', () => {
            let stop, scene, baby;

            beforeEach(() => engine.mount({}).then(() => {
                stop = sinon.stub(engine, 'stop', _.noop);
                expect(engine.scene).to.exist;
                scene = engine.scene;
                baby = engine.baby;
            }));
            afterEach(() => stop.restore());

            it(`should return a promise that stops the engine render process when
            running, dismounts and deletes the scene, along with the GraphicsLibrary
            Engine instance and canvas element before resolving to self`, (done) => {
                engine.running = true;
                expect(() => engine.dismount().then(e => {
                    let {babylonEngine, canvasElement} = getPrivateDataForTest();

                    expect(e).to.equal(engine);
                    expect(scene.stubs.dismount.callCount).to.equal(1);
                    expect(scene.stubs.dismount.calledWithExactly(engine)).to.equal(true);
                    expect(baby.stubs.dispose.callCount).to.equal(1);
                    expect(babylonEngine).to.equal(null);
                    expect(canvasElement).to.equal(null);
                    expect(stop.callCount).to.equal(1);
                    done();
                }).catch(done)).to.not.throw(Error);
            });

            it(`should return a promise dismounts and deletes the scene, along
            with the GraphicsLibrary Engine instance and canvas element before
            resolving to self`, (done) => {
                expect(() => engine.dismount().then(e => {
                    let {babylonEngine, canvasElement} = getPrivateDataForTest();

                    expect(e).to.equal(engine);
                    expect(scene.stubs.dismount.callCount).to.equal(1);
                    expect(scene.stubs.dismount.calledWithExactly(engine)).to.equal(true);
                    expect(baby.stubs.dispose.callCount).to.equal(1);
                    expect(babylonEngine).to.equal(null);
                    expect(canvasElement).to.equal(null);
                    expect(stop.callCount).to.equal(0);
                    done();
                }).catch(done)).to.not.throw(Error);
            });
        });

        describe('run method', () => {
            let addListener;

            beforeEach(() => engine.mount(params.canvas).then(() => {
                addListener = sinon.stub(params.canvas, 'addEventListener');
            }));
            afterEach(() => engine.dismount().then(() => {
                addListener.restore();
            }));

            it(`should return a promise that initializes the scene with the provided
            entities, attaches event listeners to the canvas element, and begins
            the main render/update loop before resolving to self`, (done) => {
                let data = [{id: 'foo', uid: 'foo'}, {id: 'bar', uid: 'bar'}];

                expect(engine.running).to.equal(false);
                expect(() => engine.run(data)
                    .then(e => {
                        expect(e).to.equal(engine);
                        expect(engine.ctrl.stubs.setup.callCount).to.equal(1);
                        expect(engine.ctrl.stubs.setup.calledWithExactly(engine.settings)).to.equal(true);
                        expect(engine.scene.stubs.updateEntities.callCount).to.equal(1);
                        expect(engine.scene.stubs.updateEntities.calledWithExactly(engine, data))
                        expect(addListener.callCount).to.equal(2);
                        expect(addListener.calledWith('click')).to.equal(true);
                        expect(addListener.calledWith('contextmenu')).to.equal(true);
                        expect(engine.baby.stubs.runRenderLoop.callCount).to.equal(1);
                        expect(engine.loading).to.equal(LoadStates.DONE);
                        expect(engine.fps).to.equal(0);
                        expect(engine.running).to.equal(true);
                        setTimeout(() => {
                            expect(engine.fps).to.equal(60);
                            done();
                        }, 501);
                    }).catch(done)
                ).to.not.throw(Error);
            });

            it(`should return a promise that attaches event listeners to the canvas
            element and begins the main render/update loop without adding new
            entites, when none provided, before resolving to self`, (done) => {
                expect(engine.running).to.equal(false);
                expect(() => engine.run()
                    .then(e => {
                        expect(e).to.equal(engine);
                        expect(engine.ctrl.stubs.setup.callCount).to.equal(1);
                        expect(engine.ctrl.stubs.setup.calledWithExactly(engine.settings)).to.equal(true);
                        expect(engine.scene.stubs.updateEntities.callCount).to.equal(0);
                        expect(addListener.callCount).to.equal(2);
                        expect(addListener.calledWith('click')).to.equal(true);
                        expect(addListener.calledWith('contextmenu')).to.equal(true);
                        expect(engine.baby.stubs.runRenderLoop.callCount).to.equal(1);
                        expect(engine.loading).to.equal(LoadStates.DONE);
                        expect(engine.fps).to.equal(0);
                        expect(engine.running).to.equal(true);
                        done();
                    }).catch(done)
                ).to.not.throw(Error);
            });

            it(`should return a promise that resolves to self with engine is already
            running`, (done) => {
                engine.running = true;
                expect(() => engine.run().then(e => {
                    expect(e).to.equal(engine);
                    expect(addListener.callCount).to.equal(0);
                    expect(engine.scene.stubs.updateEntities.callCount).to.equal(0);
                    expect(engine.ctrl.stubs.setup.callCount).to.equal(0);
                    expect(engine.baby.stubs.runRenderLoop.callCount).to.equal(0);
                    expect(engine.loading).to.equal(LoadStates.DATA);
                    done();
                }).catch(done)).to.not.throw(Error);
            });

            it(`should return a promise that resolves to self with engine is not in
            the correct loading state`, (done) => {
                engine.loading = LoadStates.RES;
                expect(() => engine.run().then(e => {
                    expect(e).to.equal(engine);
                    expect(addListener.callCount).to.equal(0);
                    expect(engine.scene.stubs.updateEntities.callCount).to.equal(0);
                    expect(engine.ctrl.stubs.setup.callCount).to.equal(0);
                    expect(engine.baby.stubs.runRenderLoop.callCount).to.equal(0);
                    expect(engine.loading).to.equal(LoadStates.RES);
                    expect(engine.running).to.equal(false);
                    done();
                }).catch(done)).to.not.throw(Error);
            });
        });

        describe('stop method', () => {

            beforeEach(() => engine.mount(params.canvas).then(() => engine.run()));

            it(`should stop the render/update loop if running`, () => {
                let e;

                expect(engine.running).to.equal(true);
                expect(() => e = engine.stop()).to.not.throw(Error);
                expect(e).to.equal(engine);
                expect(engine.running).to.equal(false);
                expect(engine.loading).to.equal(LoadStates.DATA);
                expect(engine.baby.stubs.stopRenderLoop.callCount).to.equal(1);
            });

            it(`should just return self when engine is not running`, () => {
                let e;

                engine.running = false;
                expect(() => e = engine.stop()).to.not.throw(Error);
                expect(e).to.equal(engine);
                expect(engine.loading).to.equal(LoadStates.DONE);
                expect(engine.baby.stubs.stopRenderLoop.callCount).to.equal(0);
            });
        });

        describe('resize method', () => {

            beforeEach(() => engine.mount(params.canvas));

            it(`should call the resize method of the GraphicsLibrary engine
            instance`, () => {
                expect(() => engine.resize()).to.not.throw(Error);
                expect(engine.baby.stubs.resize.callCount).to.equal(1);
            });
        });

        describe('toVector method', () => {

            beforeEach(() => engine.mount({}));

            it(`should convert a plain object with (x,y,z) properties into a 3D
            Vector object`, () => {
                let v;

                expect(() => v = engine.toVector({x: 1, y: 3.3, z: 4})).to.not.throw(Error);
                expect(v).to.exist;
                expect(BabylonJSMock.Vector3.callCount).to.equal(1);
                expect(BabylonJSMock.Vector3.calledWithExactly(1, 3.3, 4)).to.equal(true);
            });

            it(`should return a new zero vector by default`, () => {
                let v;

                expect(() => v = engine.toVector()).to.not.throw(Error);
                expect(v).to.exist;
                expect(BabylonJSMock.Vector3.callCount).to.equal(1);
                expect(BabylonJSMock.Vector3.calledWithExactly(0, 0, 0)).to.equal(true);
            });
        });

        describe('emitDebugEvent method', () => {
            let emit;

            beforeEach(() => {
                emit = sinon.stub(engine, 'emitEvent', _.noop);
            });
            afterEach(() => {
                emit.restore();
                params.settings.debug = true;
            });

            it(`should emit a state event if settings.debug = true`, () => {
                expect(() => engine.emitDebugEvent('test', {})).to.not.throw(Error);
                expect(emit.callCount).to.equal(1);
                expect(emit.calledWithExactly('test', {})).to.equal(true);
            });

            it(`should not emit an event if settings.debug = false`, () => {
                params.settings.debug = false;
                expect(() => engine.emitDebugEvent('test', {})).to.not.throw(Error);
                expect(emit.callCount).to.equal(0);
            });
        });

        describe('onDebugEvent method', () => {
            let on;

            beforeEach(() => {
                on = sinon.stub(engine, 'onEvent', _.noop);
            });
            afterEach(() => {
                on.restore();
                params.settings.debug = true;
            });

            it(`should add an event listener if settings.debug = true`, () => {
                expect(() => engine.onDebugEvent('test', _.noop)).to.not.throw(Error);
                expect(on.callCount).to.equal(1);
                expect(on.calledWithExactly('test', _.noop)).to.equal(true);
            });
            it(`should not add an event listener if settings.debug = false`, () => {
                params.settings.debug = false;
                expect(() => engine.onDebugEvent('test', _.noop)).to.not.throw(Error);
                expect(on.callCount).to.equal(0);
            });
        });

        describe('emitEvent method', () => {

            it(`should unconditionally emit a state event`, () => {
                expect(() => engine.emitEvent('test', 40, {})).to.not.throw(Error);
                expect(eventsMock.emit.callCount).to.equal(1);
                expect(eventsMock.emit.calledWithExactly('test', 40, {})).to.equal(true);
            });
        });

        describe('onEvent method', () => {

            it(`should unconditionally listen to a state event`, () => {
                expect(() => engine.onEvent('test', _.noop)).to.not.throw(Error);
                expect(eventsMock.on.callCount).to.equal(1);
                expect(eventsMock.on.calledWithExactly('test', _.noop)).to.equal(true);
            });
        });

        describe('registerKeyAction method', () => {
            let handler = _.noop;

            beforeEach(() => engine.mount({}));

            it(`should register event listeners to fire the handler provided for
            the key event specified, onKeyUp or onKeyDown`, () => {
                expect(() => engine.registerKeyAction('f', {handler}))
                    .to.not.throw(Error);
                expect(engine.scene.baby.actionManager).to.exist;
                expect(BabylonJSMock.ActionManager.callCount).to.equal(1);
                expect(BabylonJSMock.ActionManager.calledWithExactly(engine.scene.baby))
                    .to.equal(true);
                expect(engine.scene.baby.actionManager.registerAction.callCount).to.equal(2);
                expect(BabylonJSMock.ExecuteCodeAction.callCount).to.equal(2);
                expect(BabylonJSMock.ExecuteCodeAction.calledWith({trigger: 'down', parameter: 'f'}))
                    .to.equal(true);
                expect(BabylonJSMock.ExecuteCodeAction.calledWith({trigger: 'up', parameter: 'f'}))
                    .to.equal(true);
            });

            it(`should register an event listener for the onKeyUp event for the
            provided key if the upHandler argument is set`, () => {
                expect(() => engine.registerKeyAction('g', {upHandler: handler}))
                    .to.not.throw(Error);
                expect(engine.scene.baby.actionManager).to.exist;
                expect(BabylonJSMock.ActionManager.callCount).to.equal(1);
                expect(BabylonJSMock.ActionManager.calledWithExactly(engine.scene.baby))
                    .to.equal(true);
                expect(engine.scene.baby.actionManager.registerAction.callCount).to.equal(1);
                expect(BabylonJSMock.ExecuteCodeAction.callCount).to.equal(1);
                expect(BabylonJSMock.ExecuteCodeAction.calledWith({trigger: 'up', parameter: 'g'}))
                    .to.equal(true);
            });

            it(`should register an event listener for the onKeyDown event for the
            provided key if the downHandler argument is set`, () => {
                expect(() => engine.registerKeyAction('h', {downHandler: handler}))
                    .to.not.throw(Error);
                expect(engine.scene.baby.actionManager).to.exist;
                expect(BabylonJSMock.ActionManager.callCount).to.equal(1);
                expect(BabylonJSMock.ActionManager.calledWithExactly(engine.scene.baby))
                    .to.equal(true);
                expect(engine.scene.baby.actionManager.registerAction.callCount).to.equal(1);
                expect(BabylonJSMock.ExecuteCodeAction.callCount).to.equal(1);
                expect(BabylonJSMock.ExecuteCodeAction.calledWith({trigger: 'down', parameter: 'h'}))
                    .to.equal(true);
            });
        });

        describe('registerMouseEventsForEntity method', () => {
            let baby, entity = {
                    meshAsync: Promise.resolve({
                        ready: () => Promise.resolve({baby})
                    })
                },
                handler = _.noop;

            beforeEach(() => {
                baby = {};
                return engine.mount({});
            });

            it(`should set the hover cursor for the entity's primary mesh if cursor
            arugment is provided`, (done) => {
                expect(() => engine.registerMouseEventsForEntity(entity, {cursor: 'pointer'})
                    .then(() => {
                        expect(BabylonJSMock.ActionManager.callCount).to.equal(1);
                        expect(BabylonJSMock.ActionManager.calledWithExactly(engine.scene.baby))
                            .to.equal(true);
                        expect(baby.actionManager).to.exist;
                        expect(baby.actionManager.hoverCursor).to.equal('pointer');
                        expect(baby.actionManager.registerAction.callCount).to.equal(0);
                        expect(BabylonJSMock.ExecuteCodeAction.callCount).to.equal(0);
                        done();
                    }).catch(done)
                ).to.not.throw(Error);
            });

            it(`should set an entityClick event listener on the entity's primary
            mesh if click argument is provided`, (done) => {
                expect(() => engine.registerMouseEventsForEntity(entity, {click: handler})
                    .then(() => {
                        expect(BabylonJSMock.ActionManager.callCount).to.equal(1);
                        expect(BabylonJSMock.ActionManager.calledWithExactly(engine.scene.baby))
                            .to.equal(true);
                        expect(baby.actionManager).to.exist;
                        expect(baby.actionManager.hoverCursor).to.not.exist;
                        expect(baby.actionManager.registerAction.callCount).to.equal(1);
                        expect(BabylonJSMock.ExecuteCodeAction.callCount).to.equal(1);
                        expect(BabylonJSMock.ExecuteCodeAction.calledWith('left'))
                            .to.equal(true);
                        done();
                    }).catch(done)
                ).to.not.throw(Error);
            });

            it(`should set an entityAltClick event listener on the entity's primary
            mesh if the altClick argument is provided`, (done) => {
                expect(() => engine.registerMouseEventsForEntity(entity, {altClick: handler})
                    .then(() => {
                        expect(BabylonJSMock.ActionManager.callCount).to.equal(1);
                        expect(BabylonJSMock.ActionManager.calledWithExactly(engine.scene.baby))
                            .to.equal(true);
                        expect(baby.actionManager).to.exist;
                        expect(baby.actionManager.hoverCursor).to.not.exist;
                        expect(baby.actionManager.registerAction.callCount).to.equal(1);
                        expect(BabylonJSMock.ExecuteCodeAction.callCount).to.equal(1);
                        expect(BabylonJSMock.ExecuteCodeAction.calledWith('right'))
                            .to.equal(true);
                        done();
                    }).catch(done)
                ).to.not.throw(Error);
            });

            it(`should set an entityOver event listener on the entity's primary
            mesh if the over argument is provided`, (done) => {
                expect(() => engine.registerMouseEventsForEntity(entity, {over: handler})
                    .then(() => {
                        expect(BabylonJSMock.ActionManager.callCount).to.equal(1);
                        expect(BabylonJSMock.ActionManager.calledWithExactly(engine.scene.baby))
                            .to.equal(true);
                        expect(baby.actionManager).to.exist;
                        expect(baby.actionManager.hoverCursor).to.not.exist;
                        expect(baby.actionManager.registerAction.callCount).to.equal(1);
                        expect(BabylonJSMock.ExecuteCodeAction.callCount).to.equal(1);
                        expect(BabylonJSMock.ExecuteCodeAction.calledWith('over'))
                            .to.equal(true);
                        done();
                    }).catch(done)
                ).to.not.throw(Error);
            });

            it(`should set an entityOut event listener on the entity's primrary
            mesh if the out argument is provided`, (done) => {
                expect(() => engine.registerMouseEventsForEntity(entity, {out: handler})
                    .then(() => {
                        expect(BabylonJSMock.ActionManager.callCount).to.equal(1);
                        expect(BabylonJSMock.ActionManager.calledWithExactly(engine.scene.baby))
                            .to.equal(true);
                        expect(baby.actionManager).to.exist;
                        expect(baby.actionManager.hoverCursor).to.not.exist;
                        expect(baby.actionManager.registerAction.callCount).to.equal(1);
                        expect(BabylonJSMock.ExecuteCodeAction.callCount).to.equal(1);
                        expect(BabylonJSMock.ExecuteCodeAction.calledWith('out'))
                            .to.equal(true);
                        done();
                    }).catch(done)
                ).to.not.throw(Error);
            });
        });

        describe('deregisterMouseEventsForEntity method', () => {
            let baby = {}, entity = {
                    mesh: {baby},
                    meshAsync: Promise.resolve({
                        ready: () => Promise.resolve({baby})
                    })
                },
                handler = _.noop;

            beforeEach(() => engine.mount({}).then(() => {
                return engine.registerMouseEventsForEntity(entity, {
                    click: handler, altClick: handler, over: handler, out: handler, cursor: 'crosshair'
                });
            }));
            afterEach(() => baby = {});

            it(`should remove all click/altClick/over/out event listeners for the
            given entity's primary mesh, and reset the hover cursor style`, () => {
                expect(baby.actionManager.actions).to.have.length(4);
                expect(() => engine.deregisterMouseEventsForEntity(entity))
                    .to.not.throw(Error);
                expect(baby.actionManager.actions).to.have.length(0);
                expect(baby.actionManager.hoverCursor).to.equal('default');
            });
        });
    });
});
