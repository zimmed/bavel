'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LoadStates = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('./utils');

var _basicSingleton = require('basic-singleton');

var _basicSingleton2 = _interopRequireDefault(_basicSingleton);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _scene = require('./scene');

var _scene2 = _interopRequireDefault(_scene);

var _stateEventProxy = require('./state-event-proxy');

var _stateEventProxy2 = _interopRequireDefault(_stateEventProxy);

var _stateEvents = require('./state-events');

var _stateEvents2 = _interopRequireDefault(_stateEvents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LoadStates = exports.LoadStates = {
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

var _engine = {};

var loader = null,
    GraphicsLibrary = null;

var Engine = function (_Singleton) {
    _inherits(Engine, _Singleton);

    _createClass(Engine, null, [{
        key: 'init',
        value: function init(logger, resourceProviderLoader, PlayerController) {
            var settings = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

            var engine = this.getInstance();

            if (engine) return engine;
            engine = new this(logger, PlayerController, settings);
            engine.loading = LoadStates.RES;
            loader = resourceProviderLoader().then(function (provider) {
                _engine.provider = provider;
                engine.loading = LoadStates.INIT;
                engine.scene = new _scene2.default(engine);
            });
            return engine;
        }
    }]);

    function Engine(logger, PlayerController, settings) {
        _classCallCheck(this, Engine);

        var _this = _possibleConstructorReturn(this, (Engine.__proto__ || Object.getPrototypeOf(Engine)).call(this));

        if (!PlayerController) {
            PlayerController = require('./player-controller').default;
        }
        _utils._.assign((0, _stateEventProxy2.default)(_this, 'engine', {
            fps: 0,
            loading: LoadStates.BOOT
        }), {
            scene: null,
            running: false,
            settings: settings
        });
        _utils._.assign(_engine, {
            logger: logger,
            playerCtrl: new PlayerController(_this)
        });
        return _this;
    }

    _createClass(Engine, [{
        key: 'mount',
        value: function mount(canvas) {
            var _this2 = this;

            return loader.then(function () {
                _this2.logger.debug('Mounting engine to canvas...');
                _this2.loading = LoadStates.GL;
                return new _bluebird2.default(function (res) {
                    require.ensure(['babylonjs'], function () {
                        res(require('babylonjs'));
                    }, 'graphics');
                });
            }).then(function (BabylonJS) {
                GraphicsLibrary = BabylonJS;

                _engine.loading = LoadStates.GAME;
                _engine.baby = new GraphicsLibrary.Engine(canvas, true);
                _engine.canvas = canvas;
                _this2.logger.debug('Loading scene...');
                return _this2.scene.mount(_this2);
            }).then(function () {
                _this2.loading = LoadStates.DATA;
                _this2.logger.info('Engine mounted.');
                return _this2;
            });
        }
    }, {
        key: 'dismount',
        value: function dismount() {
            var _this3 = this;

            this.logger.debug('Dismounting from to canvas...');
            return new _bluebird2.default(function (res) {
                if (_this3.running) {
                    Engine.stop();
                }
                _this3.scene.dismount(_this3);
                delete _this3.scene;
                _utils._.get(_engine, 'baby.dispose', _utils._.noop)();
                delete _engine.baby;
                delete _engine.canvas;
                _this3.logger.info('Engine dismounted.');
                res(_this3);
            });
        }
    }, {
        key: 'run',
        value: function run(entities) {
            var _this4 = this;

            var step = 1000 / 20;
            var count = void 0,
                time = void 0,
                accum = 0,
                defer = _bluebird2.default.resolve(this);

            if (!this.running && this.loading === LoadStates.DATA) {
                if (entities) {
                    this.loading = LoadStates.PROC;
                    this.logger.debug('Adding initial entities to scene...');
                    defer = this.scene.updateEntities(this, entities);
                }
                defer.then(function () {
                    _this4.playerCtrl.setup(_this4.settings);
                    _utils._.forEach(_this4.playerCtrl.DOM_EVENTS, function (fn, name) {
                        return _this4.canvas.addEventListener(name, function (e) {
                            return e.preventDefault() && false || _this4.playerCtrl[fn](e);
                        });
                    });
                    _this4.loading = LoadStates.REND;
                    _this4.logger.debug('Starting engine render loop. ENGINE: ', _this4);
                    _this4.baby.before;
                    _this4.baby.runRenderLoop(function () {
                        count = 0;
                        time = Date.now();
                        accum = _this4.baby.getDeltaTime();
                        // accum += engine.baby.getDeltaTime();
                        // while (accum >= step) {
                        //     count++;
                        //     engine.scene.tick(engine, time, step);
                        //     accum -= step;
                        //     if (count > 5) accum = 0;
                        // }
                        _this4.scene.tick(_this4, time, accum);
                        _this4.scene.baby.render();
                    });
                    setTimeout(function () {
                        return _this4.loading = LoadStates.DONE;
                    }, 1000);
                    setInterval(function () {
                        return _this4.fps = Math.floor(_this4.baby.fps);
                    }, 500);
                    _this4.running = true;
                    return _this4;
                });
            }
            return defer;
        }
    }, {
        key: 'stop',
        value: function stop() {
            if (this.running) {
                this.logger.debug('Stopping engine render loop.');
                this.baby.stopRenderLoop();
                this.running = false;
                this.loading = LoadStates.DATA;
            }
            return this;
        }
    }, {
        key: 'resize',
        value: function resize() {
            return _utils._.get(_engine, 'baby.resize', _utils._.noop)();
        }
    }, {
        key: 'toVector',
        value: function toVector() {
            var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                _ref$x = _ref.x,
                x = _ref$x === undefined ? 0 : _ref$x,
                _ref$y = _ref.y,
                y = _ref$y === undefined ? 0 : _ref$y,
                _ref$z = _ref.z,
                z = _ref$z === undefined ? 0 : _ref$z;

            return new (Function.prototype.bind.apply(this.GL.Vector3, [null].concat(_toConsumableArray(_utils._.values({ x: x, y: y, z: z })))))();
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
            return _stateEvents2.default.emit('' + scope, v, undefined, obj);
        }
    }, {
        key: 'onEvent',
        value: function onEvent(event, handler) {
            return _stateEvents2.default.on(event, handler);
        }
    }, {
        key: 'registerKeyAction',
        value: function registerKeyAction(key) {
            var _this5 = this;

            var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                downHandler = _ref2.downHandler,
                upHandler = _ref2.upHandler,
                handler = _ref2.handler;

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
                    return (handler || downHandler)(_this5, key, true);
                }));
            }
            if (handler || upHandler) {
                am.registerAction(new ExecuteCodeAction({ trigger: kUp, parameter: key }, function () {
                    return (handler || upHandler)(_this5, key, false);
                }));
            }
        }
    }, {
        key: 'registerMouseEventsForEntity',
        value: function registerMouseEventsForEntity(entity) {
            var _this6 = this;

            var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                click = _ref3.click,
                altClick = _ref3.altClick,
                over = _ref3.over,
                out = _ref3.out,
                cursor = _ref3.cursor;

            var _GL2 = this.GL,
                ActionManager = _GL2.ActionManager,
                ExecuteCodeAction = _GL2.ExecuteCodeAction;

            var clickT = ActionManager.OnLeftPickTrigger;
            var altClickT = ActionManager.OnRightPickTrigger;
            var overT = ActionManager.OnPointerOverTrigger;
            var outT = ActionManager.OnPointerOutTrigger;

            return entity.meshAsync.then(function (mesh) {
                return mesh.ready();
            }).then(function (_ref4) {
                var baby = _ref4.baby;

                var am = baby.actionManager;

                if (!am) {
                    am = baby.actionManager = new ActionManager(_this6.scene.baby);
                }
                if (cursor) {
                    am.hoverCursor = cursor;
                }
                if (click) {
                    am.registerAction(new ExecuteCodeAction(clickT, function (e) {
                        return _this6.playerCtrl.entityClick(entity, e);
                    }));
                }
                if (altClick) {
                    am.registerAction(new ExecuteCodeAction(altClickT, function (e) {
                        return _this6.playerCtrl.entityAltClick(entity, e);
                    }));
                }
                if (over) {
                    am.registerAction(new ExecuteCodeAction(overT, function (e) {
                        return _this6.playerCtrl.entityOver(entity, e);
                    }));
                }
                if (out) {
                    am.registerAction(new ExecuteCodeAction(outT, function (e) {
                        return _this6.playerCtrl.entityOut(entity, e);
                    }));
                }
            });
        }
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
            return _engine.baby;
        }
    }, {
        key: 'canvas',
        get: function get() {
            return _engine.canvas;
        }
    }, {
        key: 'provider',
        get: function get() {
            return _engine.provider;
        }
    }, {
        key: 'playerCtrl',
        get: function get() {
            return _engine.playerCtrl;
        }
    }, {
        key: 'logger',
        get: function get() {
            return _engine.logger;
        }
    }, {
        key: 'terrain',
        get: function get() {
            return _engine.terrain;
        },
        set: function set(v) {
            return _engine.terrain = v;
        }
    }]);

    return Engine;
}(_basicSingleton2.default);

exports.default = Engine;
;