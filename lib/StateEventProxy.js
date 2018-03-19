'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DISABLE = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash.foreach');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.isobject');

var _lodash4 = _interopRequireDefault(_lodash3);

var _lodash5 = require('lodash.isplainobject');

var _lodash6 = _interopRequireDefault(_lodash5);

var _lodash7 = require('lodash.isnumber');

var _lodash8 = _interopRequireDefault(_lodash7);

var _stateEvents = require('./stateEvents');

var _stateEvents2 = _interopRequireDefault(_stateEvents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DISABLE = exports.DISABLE = {};

var StateEventProxy = function () {
    function StateEventProxy() {
        _classCallCheck(this, StateEventProxy);

        throw new Error('Cannot instantiate static class StateEventProxy');
    }

    _createClass(StateEventProxy, null, [{
        key: 'create',
        value: function create(obj, scope, properties) {
            var _this = this;

            var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

            var self = obj || {};

            (0, _lodash2.default)(properties, function (prop, k) {
                var name = (0, _lodash8.default)(k) ? prop : k,
                    value = (0, _lodash8.default)(k) ? options.def : prop;

                _this.proxifyProperty(scope + '.' + name, obj, name, value, options);
            });
            return self;
        }
    }, {
        key: 'proxifyProperty',
        value: function proxifyProperty(scope, obj, prop, value) {
            var _this2 = this;

            var _ref = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {},
                _ref$deep = _ref.deep,
                deep = _ref$deep === undefined ? false : _ref$deep,
                _ref$enumerable = _ref.enumerable,
                enumerable = _ref$enumerable === undefined ? true : _ref$enumerable;

            var p = value;

            if (deep && (0, _lodash6.default)(value)) {
                p = this.buildProxyObject(scope, value, { deep: deep, enumerable: enumerable });
            } else if (deep && Array.isArray(value)) {
                p = this.buildProxyArray(scope, obj, value, { deep: deep, enumerable: enumerable });
            }
            Object.defineProperty(obj, prop, {
                get: function get() {
                    return p;
                },
                set: function set(v) {
                    if (deep && (0, _lodash4.default)(v)) {
                        v = Array.isArray(v) ? _this2.buildProxyArray(scope, obj, v, { deep: deep, enumerable: enumerable }) : _this2.buildProxyObject(scope, v, { deep: deep, enumerable: enumerable });
                    }
                    _this2.emit(scope, v, obj);
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
            var _this3 = this;

            var p = {};

            (0, _lodash2.default)(obj, function (v, k) {
                return _this3.proxifyProperty(scope + '.' + k, p, k, v, o);
            });
            return p;
        }
    }, {
        key: 'buildProxyArray',
        value: function buildProxyArray(scope, parent, arr, o) {
            var _this4 = this;

            var ret = new Proxy(arr.map(function (e, i) {
                return (0, _lodash6.default)(e) && _this4.buildProxyObject(scope + '[' + i + ']', e, o) || Array.isArray(e) && _this4.buildProxyArray(scope + '[' + i + ']', ret, e, o) || e;
            }), {
                get: function get(target, key) {
                    if (_this4.isMutateFn(key)) {
                        return function () {
                            DISABLE[scope] = true;
                            var v = target[key].apply(target, arguments);

                            delete DISABLE[scope];
                            _this4.emit(scope, ret, parent);
                            return v;
                        };
                    }
                    return target[key];
                },
                set: function set(target, i, v) {
                    if (!isNaN(i)) {
                        v = (0, _lodash6.default)(v) && _this4.buildProxyObject(scope + '[' + i + ']', v, o) || Array.isArray(v) && _this4.buildProxyArray(scope + '[' + i + ']', ret, v, o) || v;
                        _this4.emit(scope + '[' + i + ']', v, ret);
                    }
                    target[i] = v;
                    return true;
                },
                deleteProperty: function deleteProperty(target, i) {
                    if (!isNaN(i)) {
                        _this4.emit(scope + '[' + i + ']', undefined, ret);
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
                    return _stateEvents2.default.emit(scope, v, obj);
                });
            }
        }
    }, {
        key: 'isMutateFn',
        value: function isMutateFn(key) {
            return ['copyWithin', 'fill', 'pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'].includes(key);
        }
    }]);

    return StateEventProxy;
}();

exports.default = StateEventProxy;