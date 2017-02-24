'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.proxifyProperty = proxifyProperty;
exports.buildProxyObject = buildProxyObject;
exports.buildProxyArray = buildProxyArray;
exports.emit = emit;
exports.isMutateFn = isMutateFn;

var _utils = require('./utils');

var _stateEvents = require('./state-events');

var _stateEvents2 = _interopRequireDefault(_stateEvents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DISABLE = {};

exports.default = function (obj, scope, properties) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    var self = obj || {};

    _utils._.forEach(properties, function (prop, k) {
        var name = _utils._.isNumber(k) ? prop : k,
            value = _utils._.isNumber(k) ? options.def : prop;

        proxifyProperty(scope + '.' + name, obj, name, value, options);
    });
    return self;
};

function proxifyProperty(scope, obj, prop, value) {
    var _ref = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {},
        _ref$deep = _ref.deep,
        deep = _ref$deep === undefined ? false : _ref$deep,
        _ref$enumerable = _ref.enumerable,
        enumerable = _ref$enumerable === undefined ? true : _ref$enumerable;

    var p = value;

    if (deep && _utils._.isPlainObject(value)) {
        p = buildProxyObject(scope, value, { deep: deep, enumerable: enumerable });
    } else if (deep && _utils._.isArray(value)) {
        p = buildProxyArray(scope, obj, value, { deep: deep, enumerable: enumerable });
    }
    Object.defineProperty(obj, prop, {
        get: function get() {
            return p;
        },
        set: function set(v) {
            if (deep && _utils._.isObject(v)) {
                v = _utils._.isArray(v) ? buildProxyArray(scope, obj, v, { deep: deep, enumerable: enumerable }) : buildProxyObject(scope, v, { deep: deep, enumerable: enumerable });
            }
            emit(scope, v, obj);
            p = v;
            return true;
        },
        configurable: true,
        enumerable: enumerable
    });
}

function buildProxyObject(scope, obj, o) {
    var p = {};

    _utils._.forEach(obj, function (v, k) {
        return proxifyProperty(scope + '.' + k, p, k, v, o);
    });
    return p;
}

function buildProxyArray(scope, parent, arr, o) {
    var ret = new Proxy(_utils._.map(arr, function (e, i) {
        return _utils._.isPlainObject(e) && buildProxyObject(scope + '[' + i + ']', e, o) || _utils._.isArray(e) && buildProxyArray(scope + '[' + i + ']', e, o) || e;
    }), {
        get: function get(target, key) {
            if (isMutateFn(key)) {
                return function () {
                    DISABLE[scope] = true;
                    var v = target[key].apply(target, arguments);

                    delete DISABLE[scope];
                    emit(scope, ret, parent);
                    return v;
                };
            }
            return target[key];
        },
        set: function set(target, i, v) {
            if (_utils._.isNumber(i)) {
                v = _utils._.isPlainObject(v) && buildProxyObject(scope + '[' + i + ']', v, o) || _utils._.isArray(v) && buildProxyArray(scope + '[' + i + ']', ret, v, o) || v;
                emit(scope + '[' + i + ']', v, ret);
            }
            target[i] = v;
            return true;
        },
        deleteProperty: function deleteProperty(target, i) {
            if (_utils._.isNumber(i)) {
                emit(scope + '[' + i + ']', undefined, ret);
            }
            delete target[i];
            return true;
        }
    });
}

function emit(scope, v, obj) {
    if (!DISABLE[scope]) {
        setTimeout(function () {
            return _stateEvents2.default.emit(scope, v, obj);
        });
    }
}

function isMutateFn(key) {
    return _utils._.includes(['push', 'pop', 'shift', 'unshift', 'splice'], key);
}