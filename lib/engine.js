'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getPrivateDataForTest = exports.LoadStates = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash.foreach');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.get');

var _lodash4 = _interopRequireDefault(_lodash3);

var _lodash5 = require('lodash.noop');

var _lodash6 = _interopRequireDefault(_lodash5);

var _Scene = require('./Scene');

var _Scene2 = _interopRequireDefault(_Scene);

var _StateEventProxy = require('./StateEventProxy');

var _StateEventProxy2 = _interopRequireDefault(_StateEventProxy);

var _stateEvents = require('./stateEvents');

var _stateEvents2 = _interopRequireDefault(_stateEvents);

var _PlayerController = require('./PlayerController');

var _PlayerController2 = _interopRequireDefault(_PlayerController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var loader = void 0,
    logger = void 0,
    playerController = void 0,
    GraphicsLibrary = void 0,
    resourceProvider = void 0,
    canvasElement = void 0,
    babylonEngine = void 0,
    terrainEntity = void 0,
    instance = null;

var Engine = function () {
    _createClass(Engine, [{
        key: 'constructorHelper',
        value: function constructorHelper(loggerService, PlayerCtrlClass, settings) {
            _StateEventProxy2.default.create(this, 'engine', ['fps', 'loading']);

            this.fps = 0;

            this.loading = LoadStates.BOOT;

            this.scene = null;

            this.running = false;

            this.settings = settings;

            this.statsInterval = null;
            logger = loggerService;
            playerController = _PlayerController2.default.create(this, PlayerCtrlClass);
        }
    }], [{
        key: 'destroy',
        value: function destroy() {
            instance = null;
        }
    }, {
        key: 'init',
        value: function init(loggerService, resourceProviderLoader, PlayerController) {
            var settings = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

            var engine = instance;

            if (engine) return engine;
            loader = logger = playerController = GraphicsLibrary = terrainEntity = resourceProvider = canvasElement = babylonEngine = null;
            engine = new this(loggerService, PlayerController, settings);
            engine.loading = LoadStates.RES;
            loader = resourceProviderLoader().then(function (provider) {
                resourceProvider = provider;
                engine.loading = LoadStates.INIT;
                engine.scene = _Scene2.default.create();
            });
            return engine;
        }
    }, {
        key: 'constructorHelper',
        value: function constructorHelper(engine) {
            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            engine.constructorHelper.apply(engine, args);
        }
    }, {
        key: 'instance',
        get: function get() {
            return instance;
        }
    }]);

    function Engine() {
        _classCallCheck(this, Engine);

        if (instance) throw new Error('Cannot instantiate more than one instance of Engine');

        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
        }

        Engine.constructorHelper.apply(Engine, [this].concat(args));
        instance = this;
    }

    _createClass(Engine, [{
        key: 'mount',
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(canvas) {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return loader;

                            case 2:
                                logger.debug('Mounting engine to canvas...');
                                this.loading = LoadStates.GL;
                                GraphicsLibrary = BabylonJS;
                                this.loading = LoadStates.GAME;
                                babylonEngine = new GraphicsLibrary.Engine(canvas, true);
                                canvasElement = canvas;
                                logger.debug('Loading scene...');
                                _context.next = 11;
                                return this.scene.mount(this);

                            case 11:
                                this.loading = LoadStates.DATA;
                                logger.info('Engine mounted.');
                                return _context.abrupt('return', this);

                            case 14:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function mount(_x2) {
                return _ref.apply(this, arguments);
            }

            return mount;
        }()
    }, {
        key: 'dismount',
        value: function dismount() {
            logger.debug('Dismounting from to canvas...');
            if (this.running) {
                this.stop();
            }
            this.scene = this.scene.dismount(this);
            (0, _lodash4.default)(babylonEngine, 'dispose', _lodash6.default)();
            babylonEngine = null;
            canvasElement = null;
            logger.info('Engine dismounted.');
            return Promise.resolve(this);
        }
    }, {
        key: 'run',
        value: function () {
            var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(entities) {
                var _this = this;

                var step, count, time, accum, defer;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                step = 1000 / 60;
                                count = void 0, time = void 0, accum = 0, defer = Promise.resolve(this);

                                if (!(!this.running && this.loading === LoadStates.DATA)) {
                                    _context2.next = 15;
                                    break;
                                }

                                if (entities) {
                                    this.loading = LoadStates.PROC;
                                    logger.debug('Adding initial entities to scene...');
                                    defer = this.scene.updateEntities(this, entities);
                                }
                                _context2.next = 6;
                                return defer;

                            case 6:
                                this.ctrl.setup(this.settings);
                                (0, _lodash2.default)(this.ctrl.DOM_EVENTS, function (fn, name) {
                                    return canvasElement.addEventListener(name, function (e) {
                                        return e.preventDefault() && false || _this.ctrl[fn](e);
                                    });
                                });
                                this.loading = LoadStates.REND;
                                logger.debug('Starting engine render loop. ENGINE: ');
                                babylonEngine.runRenderLoop(function () {
                                    count = 0;
                                    time = Date.now();
                                    accum = babylonEngine.getDeltaTime();

                                    _this.scene.tick(_this, time, accum);
                                    _this.scene.baby.render();
                                });
                                this.loading = LoadStates.DONE;
                                this.statsInterval = setInterval(function () {
                                    _this.fps = Math.floor(_this.baby.getFps());
                                }, this.settings.statsInterval || 1000);
                                this.running = true;
                                return _context2.abrupt('return', this);

                            case 15:
                                return _context2.abrupt('return', this);

                            case 16:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function run(_x3) {
                return _ref2.apply(this, arguments);
            }

            return run;
        }()
    }, {
        key: 'stop',
        value: function stop() {
            if (this.running) {
                logger.debug('Stopping engine render loop.');
                babylonEngine.stopRenderLoop();
                this.running = false;
                this.loading = LoadStates.DATA;
                clearInterval(this.statsInterval);
            }
            return this;
        }
    }, {
        key: 'resize',
        value: function resize() {
            return (0, _lodash4.default)(babylonEngine, 'resize', _lodash6.default)();
        }
    }, {
        key: 'toVector',
        value: function toVector() {
            var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                _ref3$x = _ref3.x,
                x = _ref3$x === undefined ? 0 : _ref3$x,
                _ref3$y = _ref3.y,
                y = _ref3$y === undefined ? 0 : _ref3$y,
                _ref3$z = _ref3.z,
                z = _ref3$z === undefined ? 0 : _ref3$z;

            return new this.GL.Vector3(x, y, z);
        }
    }, {
        key: 'emitDebugEvent',
        value: function emitDebugEvent() {
            return this.settings.debug ? this.emitEvent.apply(this, arguments) : false;
        }
    }, {
        key: 'onDebugEvent',
        value: function onDebugEvent() {
            return this.settings.debug ? this.onEvent.apply(this, arguments) : false;
        }
    }, {
        key: 'emitEvent',
        value: function emitEvent(scope, v, obj) {
            return _stateEvents2.default.emit(scope, v, obj);
        }
    }, {
        key: 'onEvent',
        value: function onEvent(event, handler) {
            return _stateEvents2.default.on(event, handler);
        }
    }, {
        key: 'registerKeyAction',
        value: function registerKeyAction(key) {
            var _this2 = this;

            var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                downHandler = _ref4.downHandler,
                upHandler = _ref4.upHandler,
                handler = _ref4.handler;

            var _GL = this.GL,
                ActionManager = _GL.ActionManager,
                ExecuteCodeAction = _GL.ExecuteCodeAction;

            var kUp = ActionManager.OnKeyUpTrigger;
            var kDn = ActionManager.OnKeyDownTrigger;
            var am = this.scene.baby.actionManager;

            if (!am) {
                am = this.scene.baby.actionManager = new ActionManager(this.scene.baby);
            }
            if (handler || downHandler) {
                am.registerAction(new ExecuteCodeAction({ trigger: kDn, parameter: key }, function () {
                    return (handler || downHandler)(_this2, key, true);
                }));
            }
            if (handler || upHandler) {
                am.registerAction(new ExecuteCodeAction({ trigger: kUp, parameter: key }, function () {
                    return (handler || upHandler)(_this2, key, false);
                }));
            }
        }
    }, {
        key: 'registerMouseEventsForEntity',
        value: function () {
            var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(entity) {
                var _this3 = this;

                var _ref6 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                    click = _ref6.click,
                    altClick = _ref6.altClick,
                    over = _ref6.over,
                    out = _ref6.out,
                    cursor = _ref6.cursor;

                var _GL2, ActionManager, ExecuteCodeAction, clickT, altClickT, overT, outT, mesh, _ref7, baby, am;

                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _GL2 = this.GL, ActionManager = _GL2.ActionManager, ExecuteCodeAction = _GL2.ExecuteCodeAction;
                                clickT = ActionManager.OnLeftPickTrigger;
                                altClickT = ActionManager.OnRightPickTrigger;
                                overT = ActionManager.OnPointerOverTrigger;
                                outT = ActionManager.OnPointerOutTrigger;
                                _context3.next = 7;
                                return entity.meshAsync;

                            case 7:
                                mesh = _context3.sent;
                                _context3.next = 10;
                                return mesh.ready();

                            case 10:
                                _ref7 = _context3.sent;
                                baby = _ref7.baby;
                                am = baby.actionManager;


                                if (!am) {
                                    am = baby.actionManager = new ActionManager(this.scene.baby);
                                }
                                if (cursor) {
                                    am.hoverCursor = cursor;
                                }
                                if (click) {
                                    am.registerAction(new ExecuteCodeAction(clickT, function (e) {
                                        return _this3.ctrl.entityClick(entity, e);
                                    }));
                                }
                                if (altClick) {
                                    am.registerAction(new ExecuteCodeAction(altClickT, function (e) {
                                        return _this3.ctrl.entityAltClick(entity, e);
                                    }));
                                }
                                if (over) {
                                    am.registerAction(new ExecuteCodeAction(overT, function (e) {
                                        return _this3.ctrl.entityOver(entity, e);
                                    }));
                                }
                                if (out) {
                                    am.registerAction(new ExecuteCodeAction(outT, function (e) {
                                        return _this3.ctrl.entityOut(entity, e);
                                    }));
                                }

                            case 19:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function registerMouseEventsForEntity(_x7) {
                return _ref5.apply(this, arguments);
            }

            return registerMouseEventsForEntity;
        }()
    }, {
        key: 'deregisterMouseEventsForEntity',
        value: function deregisterMouseEventsForEntity(entity) {
            var am = entity.mesh.baby.actionManager;

            if (am) {
                am.hoverCursor = 'default';
                while (am.actions.length) {
                    am.actions.pop();
                }
            }
        }
    }, {
        key: 'GL',
        get: function get() {
            return GraphicsLibrary;
        }
    }, {
        key: 'baby',
        get: function get() {
            return babylonEngine;
        }
    }, {
        key: 'canvas',
        get: function get() {
            return canvasElement;
        }
    }, {
        key: 'provider',
        get: function get() {
            return resourceProvider;
        }
    }, {
        key: 'ctrl',
        get: function get() {
            return playerController;
        }
    }, {
        key: 'logger',
        get: function get() {
            return logger;
        }
    }, {
        key: 'terrain',
        get: function get() {
            return terrainEntity;
        },
        set: function set(v) {
            return terrainEntity = v;
        }
    }]);

    return Engine;
}();

exports.default = Engine;
var LoadStates = exports.LoadStates = {
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

var getPrivateDataForTest = exports.getPrivateDataForTest = function getPrivateDataForTest() {
    return {
        loader: loader,
        logger: logger,
        playerController: playerController,
        GraphicsLibrary: GraphicsLibrary,
        resourceProvider: resourceProvider,
        canvasElement: canvasElement,
        babylonEngine: babylonEngine,
        terrainEntity: terrainEntity
    };
};