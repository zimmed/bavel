import {_} from './utils';
import Singleton from 'basic-singleton';
import Promise from 'bluebird';
import Scene from './scene';
import EventProxy from './state-event-proxy';
import events from './state-events';

if (!require.ensure) {
    require.ensure = (dep, cb) => cb(dep);
}

export const LoadStates = {
    BOOT: 'Booting Up',
    RES: 'Loading Resources',
    INIT: 'Initial Setup',
    GL: 'Loading Graphics Libraries',
    GAME: 'Loading Game Engine',
    DATA: 'Waiting For Initial Data',
    PROC: 'Processing Initial Data',
    REND: 'Rendering To Canvas',
    DONE: false
};

let loader,
    logger,
    playerController,
    GraphicsLibrary,
    resourceProvider,
    canvasElement,
    babylonEngine,
    terrainEntity;

export default class Engine extends Singleton {

    static init(
        loggerService,
        resourceProviderLoader,
        PlayerController,
        settings={}
    ) {
        let engine = this.instance;

        if (engine) return engine;
        loader = logger = playerController = GraphicsLibrary = terrainEntity =
            resourceProvider = canvasElement = babylonEngine = null;
        engine = new this(loggerService, PlayerController, settings);
        engine.loading = LoadStates.RES;
        loader = resourceProviderLoader().then(provider => {
            resourceProvider = provider;
            engine.loading = LoadStates.INIT;
            engine.scene = new Scene(engine);
        });
        return engine;
    }

    // For testing purposes -- cannot stub constructor
    static constructorHelper(self, loggerService, PlayerController, settings) {
        if (!PlayerController) {
            PlayerController = require('./player-controller').default;
        }
        _.assign(EventProxy(self, 'engine', {
            fps: 0,
            loading: LoadStates.BOOT
        }), {
            scene: null,
            running: false,
            settings
        });
        logger = loggerService;
        playerController = new PlayerController(self);
    }

    constructor(...args) {
        super();
        Engine.constructorHelper(this, ...args);
    }

    get GL() { return GraphicsLibrary; }
    get baby() { return babylonEngine; }
    get canvas() { return canvasElement; }
    get provider() { return resourceProvider; }
    get ctrl() { return playerController; }
    get logger() { return logger; }
    get terrain() { return terrainEntity; }
    set terrain(v) { return terrainEntity = v; }

    mount(canvas) {
        return loader
            .then(() => {
                logger.debug('Mounting engine to canvas...');
                this.loading = LoadStates.GL;
                return new Promise(res => {
                    require.ensure(['babylonjs'], () => {
                        res(require('babylonjs'));
                    }, 'graphics');
                });
            })
            .then(BabylonJS => {
                GraphicsLibrary = BabylonJS;

                this.loading = LoadStates.GAME;
                babylonEngine = new GraphicsLibrary.Engine(canvas, true);
                canvasElement = canvas;
                logger.debug('Loading scene...');
                return this.scene.mount(this);
            })
            .then(() => {
                this.loading = LoadStates.DATA;
                logger.info('Engine mounted.');
                return this;
            });
    }

    dismount() {
        logger.debug('Dismounting from to canvas...');
        return new Promise(res => {
            if (this.running) {
                this.stop();
            }
            this.scene = this.scene.dismount(this);
            _.get(babylonEngine, 'dispose', _.noop)();
            babylonEngine = null;
            canvasElement = null;
            logger.info('Engine dismounted.');
            res(this);
        });
    }

    run(entities) {
        const step = 1000 / 60;
        let count,
            time,
            accum = 0,
            defer = Promise.resolve(this);

        if (!this.running && this.loading === LoadStates.DATA) {
            if (entities) {
                this.loading = LoadStates.PROC;
                logger.debug('Adding initial entities to scene...');
                defer = this.scene.updateEntities(this, entities);
            }
            defer = defer.then(() => {
                this.ctrl.setup(this.settings);
                _.forEach(this.ctrl.DOM_EVENTS, (fn, name) =>
                    canvasElement.addEventListener(name, e =>
                        e.preventDefault() && false || this.ctrl[fn](e)));
                this.loading = LoadStates.REND;
                logger.debug('Starting engine render loop. ENGINE: ', this);
                babylonEngine.runRenderLoop(() => {
                    count = 0;
                    time = Date.now();
                    accum = babylonEngine.getDeltaTime();
                    // accum += engine.baby.getDeltaTime();
                    // while (accum >= step) {
                    //     count++;
                    //     engine.scene.tick(engine, time, step);
                    //     accum -= step;
                    //     if (count > 5) accum = 0;
                    // }
                    this.scene.tick(this, time, accum);
                    this.scene.baby.render();
                });
                this.loading = LoadStates.DONE;
                setInterval(() => this.fps = Math.floor(this.baby.fps), 500);
                this.running = true;
                return this;
            });
        }
        return defer;
    }

    stop() {
        if (this.running) {
            logger.debug('Stopping engine render loop.');
            babylonEngine.stopRenderLoop();
            this.running = false;
            this.loading = LoadStates.DATA;
        }
        return this;
    }

    resize() {
        return _.get(babylonEngine, 'resize', _.noop)();
    }

    toVector({x=0, y=0, z=0}={}) {
        return new this.GL.Vector3(..._.values({x, y, z}));
    }

    emitDebugEvent(...args) {
        return this.settings.debug ? this.emitEvent(...args) : false;
    }

    onDebugEvent(...args) {
        return this.settings.debug ? this.onEvent(...args) : false;
    }

    emitEvent(scope, v, obj) {
        return events.emit(scope, v, obj);
    }

    onEvent(event, handler) {
        return events.on(event, handler);
    }

    registerKeyAction(key, {downHandler, upHandler, handler}={}) {
        const {ActionManager, ExecuteCodeAction} = this.GL;
        const kUp = ActionManager.OnKeyUpTrigger;
        const kDn = ActionManager.OnKeyDownTrigger;
        let am = this.scene.baby.actionManager;

        if (!am) {
            am = this.scene.baby.actionManager = new ActionManager(this.scene.baby);
        }
        if (handler || downHandler) {
            am.registerAction(new ExecuteCodeAction(
                {trigger: kDn, parameter: key},
                () => (handler || downHandler)(this, key, true)));
        }
        if (handler || upHandler) {
            am.registerAction(new ExecuteCodeAction(
                {trigger: kUp, parameter: key},
                () => (handler || upHandler)(this, key, false)));
        }
    }

    registerMouseEventsForEntity(entity, {click, altClick, over, out, cursor}={}) {
        const {ActionManager, ExecuteCodeAction} = this.GL;
        const clickT = ActionManager.OnLeftPickTrigger;
        const altClickT = ActionManager.OnRightPickTrigger;
        const overT = ActionManager.OnPointerOverTrigger;
        const outT = ActionManager.OnPointerOutTrigger;

        return entity.meshAsync
            .then(mesh => mesh.ready())
            .then(({baby}) => {
                let am = baby.actionManager;

                if (!am) {
                    am = baby.actionManager = new ActionManager(this.scene.baby);
                }
                if (cursor) {
                    am.hoverCursor = cursor;
                }
                if (click) {
                    am.registerAction(new ExecuteCodeAction(
                        clickT, e => this.ctrl.entityClick(entity, e)));
                }
                if (altClick) {
                    am.registerAction(new ExecuteCodeAction(
                        altClickT, e => this.ctrl.entityAltClick(entity, e)));
                }
                if (over) {
                    am.registerAction(new ExecuteCodeAction(
                        overT, e => this.ctrl.entityOver(entity, e)));
                }
                if (out) {
                    am.registerAction(new ExecuteCodeAction(
                        outT, e => this.ctrl.entityOut(entity, e)));
                }
            });
    }

    deregisterMouseEventsForEntity(entity) {
        let am = entity.mesh.baby.actionManager;

        if (am) {
            am.hoverCursor = 'default';
            while (am.actions.length) { am.actions.pop(); }
        }
    }
}

export const getPrivateDataForTest = () => ({
    loader,
    logger,
    playerController,
    GraphicsLibrary,
    resourceProvider,
    canvasElement,
    babylonEngine,
    terrainEntity
});
