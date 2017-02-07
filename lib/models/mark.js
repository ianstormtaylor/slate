'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _data = require('./data');

var _data2 = _interopRequireDefault(_data);

var _memoize = require('../utils/memoize');

var _memoize2 = _interopRequireDefault(_memoize);

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Default properties.
 *
 * @type {Object}
 */

var DEFAULTS = {
  data: new _immutable.Map(),
  type: null
};

/**
 * Mark.
 *
 * @type {Mark}
 */

var Mark = function (_ref) {
  _inherits(Mark, _ref);

  function Mark() {
    _classCallCheck(this, Mark);

    return _possibleConstructorReturn(this, (Mark.__proto__ || Object.getPrototypeOf(Mark)).apply(this, arguments));
  }

  _createClass(Mark, [{
    key: 'getComponent',


    /**
     * Get the component for the node from a `schema`.
     *
     * @param {Schema} schema
     * @return {Component|Void}
     */

    value: function getComponent(schema) {
      return schema.__getComponent(this);
    }
  }, {
    key: 'kind',


    /**
     * Get the kind.
     *
     * @return {String}
     */

    get: function get() {
      return 'mark';
    }
  }], [{
    key: 'create',


    /**
     * Create a new `Mark` with `properties`.
     *
     * @param {Object|Mark} properties
     * @return {Mark}
     */

    value: function create() {
      var properties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (properties instanceof Mark) return properties;
      if (!properties.type) throw new Error('You must provide a `type` for the mark.');
      properties.data = _data2.default.create(properties.data);
      return new Mark(properties);
    }

    /**
     * Create a marks set from an array of marks.
     *
     * @param {Array<Object|Mark>} array
     * @return {Set<Mark>}
     */

  }, {
    key: 'createSet',
    value: function createSet() {
      var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (_immutable.Set.isSet(array)) return array;
      return new _immutable.Set(array.map(Mark.create));
    }
  }]);

  return Mark;
}(new _immutable.Record(DEFAULTS));

/**
 * Memoize read methods.
 */

(0, _memoize2.default)(Mark.prototype, ['getComponent']);

/**
 * Export.
 *
 * @type {Mark}
 */

exports.default = Mark;