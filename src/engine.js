import {_} from './utils';
import Singleton from 'basic-singleton';
import Promise from 'bluebird';
import Scene from './scene';
import EventProxy from './state-event-proxy';
import events from './state-events';

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

const _engine = {};

let loader = null,
    GraphicsLibrary = null;

export default class Engine extends Singleton {

    static init(
        logger,
        resourceProviderLoader,
        PlayerController,
        settings={}
    ) {
        let engine = this.getInstance();

        if (engine) return engine;
        engine = new this(logger, PlayerController, settings);
        engine.loading = LoadStates.RES;
        loader = resourceProviderLoader().then(provider => {
            _engine.provider = provider;
            engine.loading = LoadStates.INIT;
            engine.scene = new Scene(engine);
        });
        return engine;
    }

    constructor(logger, PlayerController, settings) {
        super();
        if (!PlayerController) {
            PlayerController = require('./player-controller').default;
        }
        _.assign(EventProxy(this, 'engine', {
            fps: 0,
            loading: LoadStates.BOOT
        }), {
            scene: null,
            running: false,
            settings
        });
        _.assign(_engine, {
            logger,
            playerCtrl: new PlayerController(this)
        });
    }

    get GL() { return GraphicsLibrary; }
    get baby() { return _engine.baby; }
    get canvas() { return _engine.canvas; }
    get provider() { return _engine.provider; }
    get playerCtrl() { return _engine.playerCtrl; }
    get logger() { return _engine.logger; }
    get terrain() { return _engine.terrain; }
    set terrain(v) { return _engine.terrain = v; }

    mount(canvas) {
        return loader
            .then(() => {
                this.logger.debug('Mounting engine to canvas...');
                this.loading = LoadStates.GL;
                return new Promise(res => {
                    require.ensure(['babylonjs'], () => {
                        res(require('babylonjs'));
                    }, 'graphics');
                });
            })
            .then(BabylonJS => {
                GraphicsLibrary = BabylonJS;

                _engine.loading = LoadStates.GAME;
                _engine.baby = new GraphicsLibrary.Engine(canvas, true);
                _engine.canvas = canvas;
                this.logger.debug('Loading scene...');
                return this.scene.mount(this);
            })
            .then(() => {
                this.loading = LoadStates.DATA;
                this.logger.info('Engine mounted.');
                return this;
            });
    }

    dismount() {
        this.logger.debug('Dismounting from to canvas...');
        return new Promise(res => {
            if (this.running) {
                Engine.stop();
            }
            this.scene.dismount(this);
            delete this.scene;
            _.get(_engine, 'baby.dispose', _.noop)();
            delete _engine.baby;
            delete _engine.canvas;
            this.logger.info('Engine dismounted.');
            res(this);
        });
    }

    run(entities) {
        const step = 1000 / 20;
        let count,
            time,
            accum = 0,
            defer = Promise.resolve(this);


        if (!this.running && this.loading === LoadStates.DATA) {
            if (entities) {
                this.loading = LoadStates.PROC;
                this.logger.debug('Adding initial entities to scene...');
                defer = this.scene.updateEntities(this, entities);
            }
            defer.then(() => {
                this.playerCtrl.setup(this.settings);
                _.forEach(this.playerCtrl.DOM_EVENTS, (fn, name) =>
                    this.canvas.addEventListener(name, e =>
                        e.preventDefault() && false || this.playerCtrl[fn](e)));
                this.loading = LoadStates.REND;
                this.logger.debug('Starting engine render loop. ENGINE: ', this);
                this.baby.before
                this.baby.runRenderLoop(() => {
                    count = 0;
                    time = Date.now();
                    accum = this.baby.getDeltaTime();
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
                setTimeout(() => this.loading = LoadStates.DONE, 1000);
                setInterval(() => this.fps = Math.floor(this.baby.fps), 500);
                this.running = true;
                return this;
            });
        }
        return defer;
    }

    stop() {
        if (this.running) {
            this.logger.debug('Stopping engine render loop.');
            this.baby.stopRenderLoop();
            this.running = false;
            this.loading = LoadStates.DATA;
        }
        return this;
    }

    resize() {
        return _.get(_engine, 'baby.resize', _.noop)();
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
        return events.emit(`${scope}`, v, undefined, obj);
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
                        clickT, e => this.playerCtrl.entityClick(entity, e)));
                }
                if (altClick) {
                    am.registerAction(new ExecuteCodeAction(
                        altClickT, e => this.playerCtrl.entityAltClick(entity, e)));
                }
                if (over) {
                    am.registerAction(new ExecuteCodeAction(
                        overT, e => this.playerCtrl.entityOver(entity, e)));
                }
                if (out) {
                    am.registerAction(new ExecuteCodeAction(
                        outT, e => this.playerCtrl.entityOut(entity, e)));
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
};
