'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.round = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('./utils');

var _basicSingleton = require('basic-singleton');

var _basicSingleton2 = _interopRequireDefault(_basicSingleton);

var _stateEventProxy = require('./state-event-proxy');

var _stateEventProxy2 = _interopRequireDefault(_stateEventProxy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _engine = void 0;

var PlayerController = function (_Singleton) {
    _inherits(PlayerController, _Singleton);

    _createClass(PlayerController, [{
        key: 'DOM_EVENTS',
        get: function get() {
            return {
                click: 'mClick',
                contextmenu: 'mAltClick',
                wheel: 'mWheel',
                mouseover: 'mOver',
                mouseout: 'mOut'
            };
        }
    }], [{
        key: 'getTime',
        value: function getTime() {
            var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();

            return _utils._.padStart(date.getHours(), 2, '0') + ':' + _utils._.padStart(date.getMinutes(), 2, '0') + ':' + _utils._.padStart(date.getSeconds(), 2, '0');
        }
    }]);

    function PlayerController(engine) {
        _classCallCheck(this, PlayerController);

        var _this = _possibleConstructorReturn(this, (PlayerController.__proto__ || Object.getPrototypeOf(PlayerController)).call(this));

        (0, _stateEventProxy2.default)(_this, 'engine.ctrl', ['messages', 'player', 'target']);

        _this.messages = [];

        _this.player = null;

        _this.target = null;
        _engine = engine;
        return _this;
    }

    _createClass(PlayerController, [{
        key: 'setup',
        value: function setup(settings) {
            this.registerKeyActions(_utils._.get(settings, 'input.keys', []));
        }
    }, {
        key: 'registerKeyActions',
        value: function registerKeyActions(keyHandlers) {
            var _this2 = this;

            _utils._.forEach(keyHandlers, function (desc) {
                _this2.engine.registerKeyAction(desc.key, desc);
            });
        }
    }, {
        key: 'message',
        value: function message(type, sender, _message) {
            var max = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this.constructor.MAX_MESSAGES;

            return this.messages = _utils._.take(_utils._.concat({ time: this.constructor.getTime(), type: type, sender: sender, message: _message }, this.messages), max);
        }
    }, {
        key: 'entityOver',
        value: function entityOver(entity, event) {
            if (!entity || !event) {
                throw new Error('Improper arguments passed to entityOver');
            }
            this.target = entity;
        }
    }, {
        key: 'entityOut',
        value: function entityOut(entity, event) {
            if (!entity || !event) {
                throw new Error('Improper arguments passed to entityOut');
            }
            if (!this.target || this.target.uid === entity.uid) {
                this.target = null;
            }
        }
    }, {
        key: 'entityClick',
        value: function entityClick(entity, _ref) {
            var pointerX = _ref.pointerX,
                pointerY = _ref.pointerY;

            if (!entity || _utils._.isUndefined(pointerX) || _utils._.isUndefined(pointerY)) {
                throw new Error('Improper arguments passed to entityClick');
            }
            var _engine$scene$baby$pi = this.engine.scene.baby.pick(pointerX, pointerY).pickedPoint,
                x = _engine$scene$baby$pi.x,
                y = _engine$scene$baby$pi.y,
                z = _engine$scene$baby$pi.z;


            this.engine.logger.debug('3D Click on ' + entity.uid + ' at (' + round(x) + ', ' + round(y) + ', ' + round(z) + ')');
        }
    }, {
        key: 'entityAltClick',
        value: function entityAltClick(entity, _ref2) {
            var pointerX = _ref2.pointerX,
                pointerY = _ref2.pointerY;

            if (!entity || _utils._.isUndefined(pointerX) || _utils._.isUndefined(pointerY)) {
                throw new Error('Improper arguments passed to entityAltClick');
            }
            var _engine$scene$baby$pi2 = this.engine.scene.baby.pick(pointerX, pointerY).pickedPoint,
                x = _engine$scene$baby$pi2.x,
                y = _engine$scene$baby$pi2.y,
                z = _engine$scene$baby$pi2.z;


            this.engine.logger.debug('3D Alt Click on ' + entity.uid + ' at (' + round(x) + ', ' + round(y) + ', ' + round(z) + ')');
        }
    }, {
        key: 'mClick',
        value: function mClick(_ref3) {
            var pageX = _ref3.pageX,
                pageY = _ref3.pageY;

            if (_utils._.isUndefined(pageX) || _utils._.isUndefined(pageY)) {
                throw new Error('Improper event passed to mClick');
            }
            this.engine.logger.debug('Click at (' + pageX + ', ' + pageY + ')');
        }
    }, {
        key: 'mAltClick',
        value: function mAltClick(_ref4) {
            var pageX = _ref4.pageX,
                pageY = _ref4.pageY;

            if (_utils._.isUndefined(pageX) || _utils._.isUndefined(pageY)) {
                throw new Error('Improper event passed to mAltClick');
            }
            this.engine.logger.debug('Alt Click at (' + pageX + ', ' + pageY + ')');
        }
    }, {
        key: 'mWheel',
        value: function mWheel(_ref5) {
            var deltaX = _ref5.deltaX,
                deltaY = _ref5.deltaY,
                deltaZ = _ref5.deltaZ;

            if (_utils._.isUndefined(deltaY) && _utils._.isUndefined(deltaX) && _utils._.isUndefined(deltaX)) {
                throw new Error('Improper event passed to mWheel');
            }
            if (deltaY) {
                this.engine.logger.debug('MouseWheel scroll ' + (deltaY > 0 ? 'out' : 'in') + ' ' + deltaY);
            }
        }
    }, {
        key: 'mOver',
        value: function mOver(_ref6) {
            var pageX = _ref6.pageX,
                pageY = _ref6.pageY;

            if (_utils._.isUndefined(pageX) || _utils._.isUndefined(pageY)) {
                throw new Error('Improper event passed to mAltClick');
            }
            this.engine.logger.debug('Pointer has entered canvas element.');
        }
    }, {
        key: 'mOut',
        value: function mOut(_ref7) {
            var pageX = _ref7.pageX,
                pageY = _ref7.pageY;

            if (_utils._.isUndefined(pageX) || _utils._.isUndefined(pageY)) {
                throw new Error('Improper event passed to mAltClick');
            }
            this.engine.logger.debug('Pointer has left cavnas element.');
        }
    }, {
        key: 'engine',
        get: function get() {
            return _engine;
        }
    }]);

    return PlayerController;
}(_basicSingleton2.default);

exports.default = PlayerController;

PlayerController.MAX_MESSAGES = 100;

var round = exports.round = function round(x) {
    return Math.floor(x * 100 + .5) / 100;
};