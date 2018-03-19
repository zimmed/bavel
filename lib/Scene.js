'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash.mapvalues');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.pickby');

var _lodash4 = _interopRequireDefault(_lodash3);

var _lodash5 = require('lodash.get');

var _lodash6 = _interopRequireDefault(_lodash5);

var _lodash7 = require('lodash.foreach');

var _lodash8 = _interopRequireDefault(_lodash7);

var _lodash9 = require('lodash.noop');

var _lodash10 = _interopRequireDefault(_lodash9);

var _Entity = require('./Entity');

var _Entity2 = _interopRequireDefault(_Entity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var instance = null;

var Scene = function () {
  _createClass(Scene, null, [{
    key: 'destroy',
    value: function destroy() {
      instance = null;
    }
  }, {
    key: 'create',
    value: function create() {
      return instance ? instance : new Scene();
    }
  }, {
    key: 'instance',
    get: function get() {
      return instance;
    }
  }]);

  function Scene() {
    _classCallCheck(this, Scene);

    if (instance) throw new Error('Cannot instantiate more than one instance of Scene');

    this.children = {};

    this.activeCamera = null;
    Object.defineProperty(this, '_baby', {
      value: null,
      writable: true
    });

    this._baby = null;
    instance = this;
  }

  _createClass(Scene, [{
    key: 'mount',
    value: function mount(engine) {
      this._baby = new engine.GL.Scene(engine.baby);
    }
  }, {
    key: 'dismount',
    value: function dismount(engine) {
      this.children = (0, _lodash4.default)((0, _lodash2.default)(this.children, function (e) {
        return _Entity2.default.dismount(engine, e);
      }));
      (0, _lodash6.default)(this, '_baby.dispose', _lodash10.default)();
      this._baby = null;
      return null;
    }
  }, {
    key: 'getEntity',
    value: function getEntity(uid) {
      return (0, _lodash6.default)(this.children, uid);
    }
  }, {
    key: 'updateEntity',
    value: function updateEntity(engine, entityData) {
      var _this = this;

      return _Entity2.default.update(engine, this.children[entityData.uid], entityData).then(function (e) {
        return _this.children[entityData.uid] = e;
      });
    }
  }, {
    key: 'updateEntities',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(engine, entities) {
        var _this2 = this;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return entities.reduce(function (promise, e) {
                  return promise.then(function () {
                    return _this2.updateEntity(engine, e);
                  });
                }, Promise.resolve());

              case 2:
                return _context.abrupt('return', this);

              case 3:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function updateEntities(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return updateEntities;
    }()
  }, {
    key: 'removeEntity',
    value: function removeEntity(engine, entityUid) {
      return this.children[entityUid] = _Entity2.default.dismount(engine, (0, _lodash6.default)(this.children, entityUid));
    }
  }, {
    key: 'tick',
    value: function tick(engine, t, dt) {
      (0, _lodash8.default)(this.children, function (e) {
        _Entity2.default.tick(engine, e, t, dt);
      });
    }
  }, {
    key: 'baby',
    get: function get() {
      return this._baby;
    }
  }]);

  return Scene;
}();

exports.default = Scene;