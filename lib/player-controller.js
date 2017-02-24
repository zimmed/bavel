'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

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
        var uiData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, PlayerController);

        var _this = _possibleConstructorReturn(this, (PlayerController.__proto__ || Object.getPrototypeOf(PlayerController)).call(this));

        (0, _stateEventProxy2.default)(_this, 'engine.' + _this.constructor.name, _utils._.assign({
            messages: [],
            player: null,
            target: null
        }, uiData));
        Object.defineProperty(_this, 'engine', {
            get: function get() {
                return engine;
            }
        });
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
        value: function message(type, sender, msg) {
            return this.messages = _utils._.take(_utils._.concat({ time: this.constructor.getTime(), type: type, sender: sender, msg: msg }, this.messages), this.constructor.MAX_MESSAGES);
        }
    }, {
        key: 'mClick',
        value: function mClick(_ref) {
            var pageX = _ref.pageX,
                pageY = _ref.pageY;

            this.engine.logger.debug('Click at (' + pageX + ', ' + pageY + ')');
        }
    }, {
        key: 'mAltClick',
        value: function mAltClick(_ref2) {
            var pageX = _ref2.pageX,
                pageY = _ref2.pageY;

            this.engine.logger.debug('Alt Click at (' + pageX + ', ' + pageY + ')');
        }
    }, {
        key: 'mWheel',
        value: function mWheel(_ref3) {
            var deltaY = _ref3.deltaY;

            if (deltaY) {
                this.engine.logger.debug('MouseWheel scroll ' + (deltaY > 0 ? 'out' : 'in') + ' ' + deltaY);
            }
        }
    }, {
        key: 'mOver',
        value: function mOver(evt) {
            this.engine.logger.debug('Pointer has entered canvas element.');
        }
    }, {
        key: 'mOut',
        value: function mOut(evt) {
            this.engine.logger.debug('Pointer has left cavnas element.');
        }
    }, {
        key: 'entityOver',
        value: function entityOver(entity, evt) {
            this.target = entity;
        }
    }, {
        key: 'entityOut',
        value: function entityOut(entity, evt) {
            if (this.target.uid === entity.uid) {
                this.target = null;
            }
        }
    }, {
        key: 'entityClick',
        value: function entityClick(entity, _ref4) {
            var pointerX = _ref4.pointerX,
                pointerY = _ref4.pointerY;
            var _engine$scene$baby$pi = this.engine.scene.baby.pick(pointerX, pointerY).pickedPoint,
                x = _engine$scene$baby$pi.x,
                y = _engine$scene$baby$pi.y,
                z = _engine$scene$baby$pi.z;


            this.engine.instance.logger.debug('3D Click on ' + entity.uid + ' at (' + round(x) + ', ' + round(y) + ', ' + round(z) + ')');
        }
    }, {
        key: 'entityAltClick',
        value: function entityAltClick(entity, _ref5) {
            var pointerX = _ref5.pointerX,
                pointerY = _ref5.pointerY;
            var _engine$scene$baby$pi2 = this.engine.scene.baby.pick(pointerX, pointerY).pickedPoint,
                x = _engine$scene$baby$pi2.x,
                y = _engine$scene$baby$pi2.y,
                z = _engine$scene$baby$pi2.z;


            this.engine.instance.logger.debug('3D Alt Click on ' + entity.uid + ' at (' + round(x) + ', ' + round(y) + ', ' + round(z) + ')');
        }
    }]);

    return PlayerController;
}(_basicSingleton2.default);

exports.default = PlayerController;


PlayerController.MAX_MESSAGES = 100;

var round = function round(x) {
    return Math.floor(x * 100 + .5) / 100;
};