'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _basicStatic = require('basic-static');

var _basicStatic2 = _interopRequireDefault(_basicStatic);

var _reducePromise = require('reduce-promise');

var _reducePromise2 = _interopRequireDefault(_reducePromise);

var _lodash = require('lodash.merge');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.omit');

var _lodash4 = _interopRequireDefault(_lodash3);

var _lodash5 = require('lodash.get');

var _lodash6 = _interopRequireDefault(_lodash5);

var _lodash7 = require('lodash.foreach');

var _lodash8 = _interopRequireDefault(_lodash7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var nonCompKeys = ['id', 'uid', 'tick', 'mesh', '_primaryMesh'];

var asyncStep = 10;

var asyncTimeout = 2000;

var Entity = function (_Static) {
    _inherits(Entity, _Static);

    function Entity() {
        _classCallCheck(this, Entity);

        return _possibleConstructorReturn(this, (Entity.__proto__ || Object.getPrototypeOf(Entity)).apply(this, arguments));
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
        value: function updateComponent(engine, entity, id, data) {
            return engine.provider.getComponent(id).update(engine, entity, entity[id], id, data).then(function (comp) {
                return entity[id] = comp;
            });
        }
    }, {
        key: 'updateComponents',
        value: function updateComponents(engine, entity, componentData) {
            var _this2 = this;

            return (0, _reducePromise2.default)(componentData, function (v, k) {
                return _this2.updateComponent(engine, entity, k, v);
            }).then(function () {
                return entity;
            });
        }
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
            var _this3 = this;

            (0, _lodash8.default)((0, _lodash4.default)(entity, nonCompKeys), function (v, k) {
                _this3.dismountComponent(engine, entity, k);
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
}(_basicStatic2.default);

exports.default = Entity;