'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mark = require('./mark');

var _mark2 = _interopRequireDefault(_mark);

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
  marks: new _immutable.Set(),
  text: ''
};

/**
 * Character.
 *
 * @type {Character}
 */

var Character = function (_ref) {
  _inherits(Character, _ref);

  function Character() {
    _classCallCheck(this, Character);

    return _possibleConstructorReturn(this, (Character.__proto__ || Object.getPrototypeOf(Character)).apply(this, arguments));
  }

  _createClass(Character, [{
    key: 'kind',


    /**
     * Get the kind.
     *
     * @return {String}
     */

    get: function get() {
      return 'character';
    }
  }], [{
    key: 'create',


    /**
     * Create a character record with `properties`.
     *
     * @param {Object|Character} properties
     * @return {Character}
     */

    value: function create() {
      var properties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (properties instanceof Character) return properties;
      properties.marks = _mark2.default.createSet(properties.marks);
      return new Character(properties);
    }

    /**
     * Create a characters list from an array of characters.
     *
     * @param {Array<Object|Character>} array
     * @return {List<Character>}
     */

  }, {
    key: 'createList',
    value: function createList() {
      var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (_immutable.List.isList(array)) return array;
      return new _immutable.List(array.map(Character.create));
    }

    /**
     * Create a characters list from a `string` and optional `marks`.
     *
     * @param {String} string
     * @param {Set<Mark>} marks (optional)
     * @return {List<Character>}
     */

  }, {
    key: 'createListFromText',
    value: function createListFromText(string, marks) {
      var chars = string.split('').map(function (text) {
        return { text: text, marks: marks };
      });
      var list = Character.createList(chars);
      return list;
    }
  }]);

  return Character;
}(new _immutable.Record(DEFAULTS));

/**
 * Export.
 *
 * @type {Character}
 */

exports.default = Character;