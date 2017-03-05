'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.StateEventProxy = exports.DISABLE = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = EventProxy;

var _utils = require('./utils');

var _basicStatic = require('basic-static');

var _basicStatic2 = _interopRequireDefault(_basicStatic);

var _stateEvents = require('./state-events');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function EventProxy(obj, scope, properties, options) {
    return StateEventProxy.create(obj, scope, properties, options);
}

var DISABLE = exports.DISABLE = {};

var StateEventProxy = exports.StateEventProxy = function (_Static) {
    _inherits(StateEventProxy, _Static);

    function StateEventProxy() {
        _classCallCheck(this, StateEventProxy);

        return _possibleConstructorReturn(this, (StateEventProxy.__proto__ || Object.getPrototypeOf(StateEventProxy)).apply(this, arguments));
    }

    _createClass(StateEventProxy, null, [{
        key: 'create',
        value: function create(obj, scope, properties, options) {
            var _this2 = this;

            var self = obj || {};

            _utils._.forEach(properties, function (prop, k) {
                var name = _utils._.isNumber(k) ? prop : k,
                    value = _utils._.isNumber(k) ? options.def : prop;

                _this2.proxifyProperty(scope + '.' + name, obj, name, value, options);
            });
            return self;
        }
    }, {
        key: 'proxifyProperty',
        value: function proxifyProperty(scope, obj, prop, value) {
            var _this3 = this;

            var _ref = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {},
                _ref$deep = _ref.deep,
                deep = _ref$deep === undefined ? false : _ref$deep,
                _ref$enumerable = _ref.enumerable,
                enumerable = _ref$enumerable === undefined ? true : _ref$enumerable;

            var p = value;

            if (deep && _utils._.isPlainObject(value)) {
                p = this.buildProxyObject(scope, value, { deep: deep, enumerable: enumerable });
            } else if (deep && _utils._.isArray(value)) {
                p = this.buildProxyArray(scope, obj, value, { deep: deep, enumerable: enumerable });
            }
            Object.defineProperty(obj, prop, {
                get: function get() {
                    return p;
                },
                set: function set(v) {
                    if (deep && _utils._.isObject(v)) {
                        v = _utils._.isArray(v) ? _this3.buildProxyArray(scope, obj, v, { deep: deep, enumerable: enumerable }) : _this3.buildProxyObject(scope, v, { deep: deep, enumerable: enumerable });
                    }
                    _this3.emit(scope, v, obj);
                    p = v;
                    return true;
                },
                configurable: true,
                enumerable: enumerable
            });
        }
    }, {
        key: 'buildProxyObject',
        value: function buildProxyObject(scope, obj, o) {
            var _this4 = this;

            var p = {};

            _utils._.forEach(obj, function (v, k) {
                return _this4.proxifyProperty(scope + '.' + k, p, k, v, o);
            });
            return p;
        }
    }, {
        key: 'buildProxyArray',
        value: function buildProxyArray(scope, parent, arr, o) {
            var _this5 = this;

            var ret = new Proxy(_utils._.map(arr, function (e, i) {
                return _utils._.isPlainObject(e) && _this5.buildProxyObject(scope + '[' + i + ']', e, o) || _utils._.isArray(e) && _this5.buildProxyArray(scope + '[' + i + ']', ret, e, o) || e;
            }), {
                get: function get(target, key) {
                    if (_this5.isMutateFn(key)) {
                        return function () {
                            DISABLE[scope] = true;
                            var v = target[key].apply(target, arguments);

                            delete DISABLE[scope];
                            _this5.emit(scope, ret, parent);
                            return v;
                        };
                    }
                    return target[key];
                },
                set: function set(target, i, v) {
                    if (!isNaN(i)) {
                        v = _utils._.isPlainObject(v) && _this5.buildProxyObject(scope + '[' + i + ']', v, o) || _utils._.isArray(v) && _this5.buildProxyArray(scope + '[' + i + ']', ret, v, o) || v;
                        _this5.emit(scope + '[' + i + ']', v, ret);
                    }
                    target[i] = v;
                    return true;
                },
                deleteProperty: function deleteProperty(target, i) {
                    if (!isNaN(i)) {
                        _this5.emit(scope + '[' + i + ']', undefined, ret);
                    }
                    delete target[i];
                    return true;
                }
            });

            return ret;
        }
    }, {
        key: 'emit',
        value: function emit(scope, v, obj) {
            if (!DISABLE[scope]) {
                setTimeout(function () {
                    return _stateEvents.Events.emit(scope, v, obj);
                });
            }
        }
    }, {
        key: 'isMutateFn',
        value: function isMutateFn(key) {
            return _utils._.includes(['copyWithin', 'fill', 'pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], key);
        }
    }]);

    return StateEventProxy;
}(_basicStatic2.default);