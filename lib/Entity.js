'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash.merge');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.omit');

var _lodash4 = _interopRequireDefault(_lodash3);

var _lodash5 = require('lodash.get');

var _lodash6 = _interopRequireDefault(_lodash5);

var _lodash7 = require('lodash.foreach');

var _lodash8 = _interopRequireDefault(_lodash7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var nonCompKeys = ['id', 'uid', 'tick', 'mesh', '_primaryMesh'];

var asyncStep = 50;

var asyncTimeout = 2000;

var Entity = function () {
    function Entity() {
        _classCallCheck(this, Entity);

        throw new Error('Cannot instantiate static class Entity');
    }

    _createClass(Entity, null, [{
        key: 'create',
        value: function create(engine, data) {
            var ticks = {};
            var id = data.id,
                uid = data.uid;

            var polyData = (0, _lodash2.default)(engine.provider.getEntity(id), data);
            var componentData = (0, _lodash4.default)(polyData, nonCompKeys);
            var entity = Object.defineProperties({ id: id, uid: uid }, {
                mesh: { get: function get() {
                        return (0, _lodash6.default)(entity, polyData._primaryMesh);
                    } },
                tick: {
                    get: function get() {
                        return function (eng, t, dt) {
                            return (0, _lodash8.default)(ticks, function (v, k) {
                                v(eng, entity, entity[k], t, dt);
                            });
                        };
                    },
                    set: function set(_ref) {
                        var id = _ref.id,
                            tick = _ref.tick;
                        return tick ? ticks[id] = tick : delete ticks[id];
                    }
                },
                meshAsync: {
                    get: function get() {
                        return new Promise(function (res, rej) {
                            var t = Date.now();
                            var stop = setInterval(function () {
                                if (entity.mesh) {
                                    clearInterval(stop);
                                    if (Object.getOwnPropertyDescriptor(entity, 'meshAsync').get) {
                                        Object.defineProperty(entity, 'meshAsync', {
                                            value: Promise.resolve(entity.mesh),
                                            configurable: false,
                                            writable: false
                                        });
                                    }
                                    res(entity.mesh);
                                } else if (Date.now() - t > asyncTimeout) {
                                    clearInterval(stop);
                                    rej(new Error('Timed out waiting for mesh of entity: ' + uid));
                                }
                            }, asyncStep);
                        });
                    },
                    configurable: true
                }
            });

            return this.updateComponents(engine, entity, componentData);
        }
    }, {
        key: 'updateComponent',
        value: function () {
            var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(engine, entity, id, data) {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return engine.provider.getComponent(id).update(engine, entity, entity[id], id, data);

                            case 2:
                                return _context.abrupt('return', entity[id] = _context.sent);

                            case 3:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function updateComponent(_x, _x2, _x3, _x4) {
                return _ref2.apply(this, arguments);
            }

            return updateComponent;
        }()
    }, {
        key: 'updateComponents',
        value: function () {
            var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(engine, entity, componentData) {
                var _this = this;

                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return Object.entries(componentData).reduce(function (promise, _ref4) {
                                    var _ref5 = _slicedToArray(_ref4, 2),
                                        k = _ref5[0],
                                        v = _ref5[1];

                                    return promise.then(function () {
                                        return _this.updateComponent(engine, entity, k, v);
                                    });
                                }, Promise.resolve());

                            case 2:
                                return _context2.abrupt('return', entity);

                            case 3:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function updateComponents(_x5, _x6, _x7) {
                return _ref3.apply(this, arguments);
            }

            return updateComponents;
        }()
    }, {
        key: 'dismountComponent',
        value: function dismountComponent(engine, entity, id) {
            return entity[id] = engine.provider.getComponent(id).dismount(engine, entity, entity[id]);
        }
    }, {
        key: 'update',
        value: function update(engine, entity, data) {
            if (!entity) {
                return this.create(engine, data);
            }
            return this.updateComponents(engine, entity, (0, _lodash4.default)(data, nonCompKeys));
        }
    }, {
        key: 'dismount',
        value: function dismount(engine, entity) {
            var _this2 = this;

            (0, _lodash8.default)((0, _lodash4.default)(entity, nonCompKeys), function (v, k) {
                _this2.dismountComponent(engine, entity, k);
            });
            return null;
        }
    }, {
        key: 'tick',
        value: function tick(engine, entity, t, dt) {
            entity.tick(engine, t, dt);
        }
    }]);

    return Entity;
}();

exports.default = Entity;