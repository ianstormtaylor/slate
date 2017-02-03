'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _character = require('./character');

var _character2 = _interopRequireDefault(_character);

var _mark = require('./mark');

var _mark2 = _interopRequireDefault(_mark);

var _range = require('./range');

var _range2 = _interopRequireDefault(_range);

var _memoize = require('../utils/memoize');

var _memoize2 = _interopRequireDefault(_memoize);

var _generateKey = require('../utils/generate-key');

var _generateKey2 = _interopRequireDefault(_generateKey);

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
  characters: new _immutable.List(),
  key: null
};

/**
 * Text.
 *
 * @type {Text}
 */

var Text = function (_ref) {
  _inherits(Text, _ref);

  function Text() {
    _classCallCheck(this, Text);

    return _possibleConstructorReturn(this, (Text.__proto__ || Object.getPrototypeOf(Text)).apply(this, arguments));
  }

  _createClass(Text, [{
    key: 'addMark',


    /**
     * Add a `mark` at `index` and `length`.
     *
     * @param {Number} index
     * @param {Number} length
     * @param {Mark} mark
     * @return {Text}
     */

    value: function addMark(index, length, mark) {
      var characters = this.characters.map(function (char, i) {
        if (i < index) return char;
        if (i >= index + length) return char;
        var _char = char,
            marks = _char.marks;

        marks = marks.add(mark);
        char = char.merge({ marks: marks });
        return char;
      });

      return this.merge({ characters: characters });
    }

    /**
     * Derive a set of decorated characters with `decorators`.
     *
     * @param {Array} decorators
     * @return {List<Character>}
     */

  }, {
    key: 'getDecorations',
    value: function getDecorations(decorators) {
      var node = this;
      var characters = node.characters;

      if (characters.size == 0) return characters;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = decorators[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var decorator = _step.value;

          var decorateds = decorator(node);
          characters = characters.merge(decorateds);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return characters;
    }

    /**
     * Get the decorations for the node from a `schema`.
     *
     * @param {Schema} schema
     * @return {Array}
     */

  }, {
    key: 'getDecorators',
    value: function getDecorators(schema) {
      return schema.__getDecorators(this);
    }

    /**
     * Get the marks on the text at `index`.
     *
     * @param {Number} index
     * @return {Set<Mark>}
     */

  }, {
    key: 'getMarksAtIndex',
    value: function getMarksAtIndex(index) {
      if (index == 0) return _mark2.default.createSet();
      var characters = this.characters;

      var char = characters.get(index - 1);
      if (!char) return _mark2.default.createSet();
      return char.marks;
    }

    /**
     * Get a node by `key`, to parallel other nodes.
     *
     * @param {String} key
     * @return {Node|Null}
     */

  }, {
    key: 'getNode',
    value: function getNode(key) {
      return this.key == key ? this : null;
    }

    /**
     * Derive the ranges for a list of `characters`.
     *
     * @param {Array|Void} decorators (optional)
     * @return {List<Range>}
     */

  }, {
    key: 'getRanges',
    value: function getRanges() {
      var decorators = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      var list = new _immutable.List();
      var characters = this.getDecorations(decorators);

      // If there are no characters, return one empty range.
      if (characters.size == 0) {
        return list.push(new _range2.default());
      }

      // Convert the now-decorated characters into ranges.
      var ranges = characters.reduce(function (memo, char, i) {
        var marks = char.marks,
            text = char.text;

        // The first one can always just be created.

        if (i == 0) {
          return memo.push(new _range2.default({ text: text, marks: marks }));
        }

        // Otherwise, compare to the previous and see if a new range should be
        // created, or whether the text should be added to the previous range.
        var previous = characters.get(i - 1);
        var prevMarks = previous.marks;
        var added = marks.filterNot(function (mark) {
          return prevMarks.includes(mark);
        });
        var removed = prevMarks.filterNot(function (mark) {
          return marks.includes(mark);
        });
        var isSame = !added.size && !removed.size;

        // If the marks are the same, add the text to the previous range.
        if (isSame) {
          var index = memo.size - 1;
          var prevRange = memo.get(index);
          var prevText = prevRange.get('text');
          prevRange = prevRange.set('text', prevText += text);
          return memo.set(index, prevRange);
        }

        // Otherwise, create a new range.
        return memo.push(new _range2.default({ text: text, marks: marks }));
      }, list);

      // Return the ranges.
      return ranges;
    }

    /**
     * Check if the node has a node by `key`, to parallel other nodes.
     *
     * @param {String} key
     * @return {Boolean}
     */

  }, {
    key: 'hasNode',
    value: function hasNode(key) {
      return !!this.getNode(key);
    }

    /**
     * Insert `text` at `index`.
     *
     * @param {Numbder} index
     * @param {String} text
     * @param {String} marks (optional)
     * @return {Text}
     */

  }, {
    key: 'insertText',
    value: function insertText(index, text, marks) {
      marks = marks || this.getMarksAtIndex(index);
      var characters = this.characters;

      var chars = _character2.default.createListFromText(text, marks);

      characters = characters.slice(0, index).concat(chars).concat(characters.slice(index));

      return this.merge({ characters: characters });
    }

    /**
     * Regenerate the node's key.
     *
     * @return {Text}
     */

  }, {
    key: 'regenerateKey',
    value: function regenerateKey() {
      return this.merge({ key: (0, _generateKey2.default)() });
    }

    /**
     * Remove a `mark` at `index` and `length`.
     *
     * @param {Number} index
     * @param {Number} length
     * @param {Mark} mark
     * @return {Text}
     */

  }, {
    key: 'removeMark',
    value: function removeMark(index, length, mark) {
      var characters = this.characters.map(function (char, i) {
        if (i < index) return char;
        if (i >= index + length) return char;
        var _char2 = char,
            marks = _char2.marks;

        marks = marks.remove(mark);
        char = char.merge({ marks: marks });
        return char;
      });

      return this.merge({ characters: characters });
    }

    /**
     * Remove text from the text node at `index` for `length`.
     *
     * @param {Number} index
     * @param {Number} length
     * @return {Text}
     */

  }, {
    key: 'removeText',
    value: function removeText(index, length) {
      var characters = this.characters;

      var start = index;
      var end = index + length;
      characters = characters.filterNot(function (char, i) {
        return start <= i && i < end;
      });
      return this.merge({ characters: characters });
    }

    /**
     * Update a `mark` at `index` and `length` with `properties`.
     *
     * @param {Number} index
     * @param {Number} length
     * @param {Mark} mark
     * @param {Mark} newMark
     * @return {Text}
     */

  }, {
    key: 'updateMark',
    value: function updateMark(index, length, mark, newMark) {
      var characters = this.characters.map(function (char, i) {
        if (i < index) return char;
        if (i >= index + length) return char;
        var _char3 = char,
            marks = _char3.marks;

        if (!marks.has(mark)) return char;
        marks = marks.remove(mark);
        marks = marks.add(newMark);
        char = char.merge({ marks: marks });
        return char;
      });

      return this.merge({ characters: characters });
    }

    /**
     * Validate the text node against a `schema`.
     *
     * @param {Schema} schema
     * @return {Object|Void}
     */

  }, {
    key: 'validate',
    value: function validate(schema) {
      return schema.__validate(this);
    }
  }, {
    key: 'kind',


    /**
     * Get the node's kind.
     *
     * @return {String}
     */

    get: function get() {
      return 'text';
    }

    /**
     * Is the node empty?
     *
     * @return {Boolean}
     */

  }, {
    key: 'isEmpty',
    get: function get() {
      return this.text == '';
    }

    /**
     * Get the length of the concatenated text of the node.
     *
     * @return {Number}
     */

  }, {
    key: 'length',
    get: function get() {
      return this.text.length;
    }

    /**
     * Get the concatenated text of the node.
     *
     * @return {String}
     */

  }, {
    key: 'text',
    get: function get() {
      return this.characters.reduce(function (result, char) {
        return result + char.text;
      }, '');
    }
  }], [{
    key: 'create',


    /**
     * Create a new `Text` with `properties`.
     *
     * @param {Object|Text} properties
     * @return {Text}
     */

    value: function create() {
      var properties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (properties instanceof Text) return properties;
      properties.key = properties.key || (0, _generateKey2.default)();
      properties.characters = _character2.default.createList(properties.characters);
      return new Text(properties);
    }

    /**
     * Create a new `Text` from a string
     *
     * @param {String} text
     * @param {Set<Mark>} marks (optional)
     * @return {Text}
     */

  }, {
    key: 'createFromString',
    value: function createFromString(text) {
      var marks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0, _immutable.Set)();

      return Text.createFromRanges([_range2.default.create({ text: text, marks: marks })]);
    }

    /**
     * Create a new `Text` from a list of ranges
     *
     * @param {List<Range>|Array<Range>} ranges
     * @return {Text}
     */

  }, {
    key: 'createFromRanges',
    value: function createFromRanges(ranges) {
      return Text.create({
        characters: ranges.reduce(function (characters, range) {
          range = _range2.default.create(range);
          return characters.concat(range.getCharacters());
        }, _character2.default.createList())
      });
    }

    /**
     * Create a list of `Texts` from an array.
     *
     * @param {Array} elements
     * @return {List<Text>}
     */

  }, {
    key: 'createList',
    value: function createList() {
      var elements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (_immutable.List.isList(elements)) return elements;
      return new _immutable.List(elements.map(Text.create));
    }
  }]);

  return Text;
}(new _immutable.Record(DEFAULTS));

/**
 * Memoize read methods.
 */

(0, _memoize2.default)(Text.prototype, ['getDecorations', 'getDecorators', 'getRanges', 'validate']);

/**
 * Export.
 *
 * @type {Text}
 */

exports.default = Text;