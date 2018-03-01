import Singleton from 'basic-singleton';
import forEach from 'lodash.foreach';
import get from 'lodash.get';
import noop from 'lodash.noop';
import Scene from './Scene';
import StateEventProxy from './StateEventProxy';
import stateEvents from './stateEvents';

// Cannot use require.ensure when not using webpack (i.e., mocha environment)
//  so this polyfill is required to not break run.
if (typeof require.ensure !== 'function') {
    require.ensure = (dep, cb) => cb(dep);
}

let // Local vars for read-only class members
    loader,
    logger,
    playerController,
    GraphicsLibrary,
    resourceProvider,
    canvasElement,
    babylonEngine,
    terrainEntity;

/**
 * The game engine class (abstraction of BabylonJS Engine).
 *
 * @example <caption>Basic construction with default args</caption>
 * let engine = Engine.init(logger, () => Promise.resolve(resourceProvider));
 * @example <caption>One-line runner</caption>
 * Engine.init(myLogger, myResourceLazyLoader, MyPlayerCtrl, settings)
 *     .mount(document.getElementById('my-canvas'))
 *     .then(engine => engine.run(entityData))
 *     .then(engine => window.addEventListener('resize', () => engine.resize()));
 */
export default class Engine extends Singleton {

    /**
     * The general creation/initialization method for the class. Creates an
     * engine instance or returns the existing one if already instantiated.
     *
     * @param {Logger} loggerService
     * @param {ResourceLoader} resourceProviderLoader
     * @param {class} [PlayerController]
     * @param {Settings} [settings={}]
     * @return {Engine}
     */
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

    /**
     * For testing purposes -- cannot stub constructor
     *
     * @access private
     */
    static constructorHelper(engine, ...args) {
        engine.constructorHelper(...args);
    }

    /**
     * For testing purposes -- cannot stub constructor
     *
     * @access private
     */
    constructorHelper(loggerService, PlayerController, settings) {
        if (!PlayerController) {
            PlayerController = require('./PlayerController').default;
        }
        StateEventProxy.create(this, 'engine', ['fps', 'loading']);
        /**
         * The currently rendered frames-per-second.
         *
         * @type {ProxyValue}
         */
        this.fps = 0;
        /**
         * The current loading state of the engine.
         *
         * @type {ProxyValue}
         */
        this.loading = LoadStates.BOOT;
        /** @type {?Scene} **/
        this.scene = null
        /** @type {boolean} **/
        this.running = false;
        /** @type {Settings} **/
        this.settings = settings;
        logger = loggerService;
        playerController = new PlayerController(this);
    }

    /**
     * @access private
     */
    constructor(...args) {
        super();
        Engine.constructorHelper(this, ...args);
    }

    /**
     * The BabylonJS graphics library.
     *
     * @type {?BabylonJS}
     */
    get GL() { return GraphicsLibrary; }
    /**
     * The BabylonJS.Engine instance.
     *
     * @type {?BabylonJS.Engine}
     */
    get baby() { return babylonEngine; }
    /**
     * The canvas element to which the engine has been mounted.
     *
     * @type {?DOMElement}
     */
    get canvas() { return canvasElement; }
    /**
     * @type {?ResourceProvider}
     */
    get provider() { return resourceProvider; }
    /**
     * @type {?PlayerController}
     */
    get ctrl() { return playerController; }
    /**
     * @type {Logger}
     */
    get logger() { return logger; }
    /**
     * The scene's default terrain entity.
     *
     * @type {?EntityInstance}
     */
    get terrain() { return terrainEntity; }
    /**
     * @type {EntityInstance}
     */
    set terrain(v) { return terrainEntity = v; }

    /**
     * Mount the engine to the given canvas.
     *
     * @access public
     * @param {DOMElement} canvas
     * @return {Promise<Engine>}
     */
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

    /**
     * Dismount engine from canvas.
     *
     * @access public
     * @return {Promise<Engine>}
     */
    dismount() {
        logger.debug('Dismounting from to canvas...');
        return new Promise(res => {
            if (this.running) {
                this.stop();
            }
            this.scene = this.scene.dismount(this);
            get(babylonEngine, 'dispose', noop)();
            babylonEngine = null;
            canvasElement = null;
            logger.info('Engine dismounted.');
            res(this);
        });
    }

    /**
     * Initialize given entities (if any), then begin rendering to mounted canvas.
     *
     * @access public
     * @param {EntityMetaData[]} [entities]
     * @return {Promise<Engine>}
     */
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
                forEach(this.ctrl.DOM_EVENTS, (fn, name) =>
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
                setInterval(() => {
                    this.fps = Math.floor(this.baby.fps)
                }, 500);
                this.running = true;
                return this;
            });
        }
        return defer;
    }

    /**
     * Stop the rendering loop.
     *
     * @access public
     * @return {Engine}
     */
    stop() {
        if (this.running) {
            logger.debug('Stopping engine render loop.');
            babylonEngine.stopRenderLoop();
            this.running = false;
            this.loading = LoadStates.DATA;
        }
        return this;
    }

    /**
     * Passthrough to BabylonJS.Engine#resize method.
     *
     * @access public
     * @return {undefined}
     */
    resize() {
        return get(babylonEngine, 'resize', noop)();
    }

    /**
     * Creates a new BabylonJS.Vector3.
     *
     * @access public
     * @param {Object} param
     * @param {number} [param.x=0]
     * @param {number} [param.y=0]
     * @param {number} [param.z=0]
     * @return {BabylonJS.Vector3}
     */
    toVector({x=0, y=0, z=0}={}) {
        return new this.GL.Vector3(x, y, z);
    }

    /**
     * Emits the given state event, only when settings.debug = true. See {@link Engine#emitEvent}.
     *
     * @access public
     * @return {undefined}
     */
    emitDebugEvent(...args) {
        return this.settings.debug ? this.emitEvent(...args) : false;
    }

    /**
     * Adds state event listener only when settings.debug = true. See {@link Engine#onEvent}.
     *
     * @access public
     * @return {undefined}
     */
    onDebugEvent(...args) {
        return this.settings.debug ? this.onEvent(...args) : false;
    }

    /**
     * Emits the given state event.
     *
     * @access public
     * @param {string} scope - The scoped event name (e.g., 'engine.fps').
     * @param {*} v - The changed value.
     * @param {Object} obj - The parent object who's property changed.
     * @return {undefined}
     */
    emitEvent(scope, v, obj) {
        return stateEvents.emit(scope, v, obj);
    }

    /**
     * Registers a listener method for a state event.
     *
     * @access public
     * @param {string} event - The scoped event name.
     * @param {function(value: *, obj: Object)} handler - The event handler.
     * @return {undefined}
     */
    onEvent(event, handler) {
        return stateEvents.on(event, handler);
    }

    /**
     * Hooks a Keyboard Key action listener into the engine.
     *
     * @access public
     * @param {string} key - The event key to listen for (e.g., 'w', 'a', 's', 'd', ' ', etc.).
     * @param {Object} handlers
     * @param {KeyHandler} [handlers.downHandler] - Handler method for KeyDown event.
     * @param {KeyHandler} [handlers.upHandler] - Handler method for KeyUp event.
     * @param {KeyHandler} [handlers.handler] - Handler method for both events.
     * @return {undefined}
     */
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

    /**
     * Hooks Mouse action listener(s) into the engine for a given Entity.
     *
     * @access public
     * @param {Entity} entity
     * @param {Object} opts
     * @param {bool} [opts.click] - Hooks the left-click (or equivalent) when true.
     * @param {bool} [opts.altClick] - Hooks the right-click (or equivalent) when true.
     * @param {bool} [opts.over] - Hooks the mouse-over when true.
     * @param {bool} [opts.out] - Hooks the mouse-out when true.
     * @param {string} [opts.cursor] - Changes the mouse-over cursor when set.
     * @return {undefined}
     */
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

    /**
     * Removes all Mouse action listeners and mouse-over cursor for a given entity.
     *
     * @access public
     * @return {undefined}
     */
    deregisterMouseEventsForEntity(entity) {
        let am = entity.mesh.baby.actionManager;

        if (am) {
            am.hoverCursor = 'default';
            while (am.actions.length) { am.actions.pop(); }
        }
    }
}

/**
 * The various states of Engine#loading.
 *
 * @access protected
 * @type {Object}
 * @property {string} BOOT
 * @property {string} RES
 * @property {string} INIT
 * @property {string} GL
 * @property {string} GAME
 * @property {string} DATA
 * @property {string} PROC
 * @property {string} REND
 * @property {null} DONE
 */
export const LoadStates = {
    BOOT: 'Booting Up',
    RES: 'Loading Resources',
    INIT: 'Initial Setup',
    GL: 'Loading Graphics Libraries',
    GAME: 'Loading Game Engine',
    DATA: 'Waiting For Initial Data',
    PROC: 'Processing Initial Data',
    REND: 'Rendering To Canvas',
    DONE: null
};

/**
 * @access private
 */
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
