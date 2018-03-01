'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _reducePromise = require('reduce-promise');

var _reducePromise2 = _interopRequireDefault(_reducePromise);

var _basicSingleton = require('basic-singleton');

var _basicSingleton2 = _interopRequireDefault(_basicSingleton);

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

var _Entity = require('../Entity');

var _Entity2 = _interopRequireDefault(_Entity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Scene = function (_Singleton) {
  _inherits(Scene, _Singleton);

  function Scene() {
    _classCallCheck(this, Scene);

    var _this = _possibleConstructorReturn(this, (Scene.__proto__ || Object.getPrototypeOf(Scene)).call(this));

    _this.children = {};

    _this.activeCamera = null;
    Object.defineProperty(_this, '_baby', {
      value: null,
      writable: true
    });
    return _this;
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
      var _this2 = this;

      return _Entity2.default.update(engine, this.children[entityData.uid], entityData).then(function (e) {
        return _this2.children[entityData.uid] = e;
      });
    }
  }, {
    key: 'updateEntities',
    value: function updateEntities(engine, entities) {
      var _this3 = this;

      return (0, _reducePromise2.default)(entities, function (e) {
        return _this3.updateEntity(engine, e);
      }).then(function () {
        return _this3;
      });
    }
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
}(_basicSingleton2.default);

exports.default = Scene;