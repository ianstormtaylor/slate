'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _raw = require('./raw');

var _raw2 = _interopRequireDefault(_raw);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _typeOf = require('type-of');

var _typeOf2 = _interopRequireDefault(_typeOf);

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * String.
 *
 * @type {String}
 */

var String = new _immutable.Record({
  kind: 'string',
  text: ''
});

/**
 * A rule to (de)serialize text nodes. This is automatically added to the HTML
 * serializer so that users don't have to worry about text-level serialization.
 *
 * @type {Object}
 */

var TEXT_RULE = {
  deserialize: function deserialize(el) {
    if (el.tagName == 'br') {
      return {
        kind: 'text',
        text: '\n'
      };
    }

    if (el.type == 'text') {
      return {
        kind: 'text',
        text: el.data
      };
    }
  },
  serialize: function serialize(obj, children) {
    if (obj.kind == 'string') {
      return children.split('\n').reduce(function (array, text, i) {
        if (i != 0) array.push(_react2.default.createElement('br', null));
        array.push(text);
        return array;
      }, []);
    }
  }
};

/**
 * HTML serializer.
 *
 * @type {Html}
 */

var Html =

/**
 * Create a new serializer with `rules`.
 *
 * @param {Object} options
 *   @property {Array} rules
 *   @property {String} defaultBlockType
 */

function Html() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  _classCallCheck(this, Html);

  _initialiseProps.call(this);

  this.rules = [].concat(_toConsumableArray(options.rules || []), [TEXT_RULE]);

  this.defaultBlockType = options.defaultBlockType || 'paragraph';
}

/**
 * Deserialize pasted HTML.
 *
 * @param {String} html
 * @return {State}
 */

/**
 * Deserialize an array of Cheerio `elements`.
 *
 * @param {Array} elements
 * @return {Array}
 */

/**
 * Deserialize a Cheerio `element`.
 *
 * @param {Object} element
 * @return {Any}
 */

/**
 * Deserialize a `mark` object.
 *
 * @param {Object} mark
 * @return {Array}
 */

/**
 * Serialize a `state` object into an HTML string.
 *
 * @param {State} state
 * @param {Object} options
 *   @property {Boolean} render
 * @return {String|Array}
 */

/**
 * Serialize a `node`.
 *
 * @param {Node} node
 * @return {String}
 */

/**
 * Serialize a `range`.
 *
 * @param {Range} range
 * @return {String}
 */

/**
 * Serialize a `string`.
 *
 * @param {String} string
 * @return {String}
 */

;

/**
 * Add a unique key to a React `element`.
 *
 * @param {Element} element
 * @return {Element}
 */

var _initialiseProps = function _initialiseProps() {
  var _this = this;

  this.deserialize = function (html) {
    var $ = _cheerio2.default.load(html).root();
    var children = $.children().toArray();
    var nodes = _this.deserializeElements(children);

    // HACK: ensure for now that all top-level inline are wrapped into a block.
    nodes = nodes.reduce(function (memo, node, i, original) {
      if (node.kind == 'block') {
        memo.push(node);
        return memo;
      }

      if (i > 0 && original[i - 1].kind != 'block') {
        var _block = memo[memo.length - 1];
        _block.nodes.push(node);
        return memo;
      }

      var block = {
        kind: 'block',
        type: _this.defaultBlockType,
        nodes: [node]
      };

      memo.push(block);
      return memo;
    }, []);

    var state = _raw2.default.deserialize({ nodes: nodes }, { terse: true });
    return state;
  };

  this.deserializeElements = function () {
    var elements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    var nodes = [];

    elements.forEach(function (element) {
      var node = _this.deserializeElement(element);
      switch ((0, _typeOf2.default)(node)) {
        case 'array':
          nodes = nodes.concat(node);
          break;
        case 'object':
          nodes.push(node);
          break;
        case 'null':
        case 'undefined':
          return;
        default:
          throw new Error('A rule returned an invalid deserialized representation: "' + node + '".');
      }
    });

    return nodes;
  };

  this.deserializeElement = function (element) {
    var node = void 0;

    var next = function next(elements) {
      switch ((0, _typeOf2.default)(elements)) {
        case 'array':
          return _this.deserializeElements(elements);
        case 'object':
          return _this.deserializeElement(elements);
        case 'null':
        case 'undefined':
          return;
        default:
          throw new Error('The `next` argument was called with invalid children: "' + elements + '".');
      }
    };

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = _this.rules[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var rule = _step.value;

        if (!rule.deserialize) continue;
        var ret = rule.deserialize(element, next);
        if (!ret) continue;
        node = ret.kind == 'mark' ? _this.deserializeMark(ret) : ret;
        break;
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

    return node || next(element.children);
  };

  this.deserializeMark = function (mark) {
    var type = mark.type,
        data = mark.data;


    var applyMark = function applyMark(node) {
      if (node.kind == 'mark') {
        return _this.deserializeMark(node);
      } else if (node.kind == 'text') {
        if (!node.ranges) node.ranges = [{ text: node.text }];
        node.ranges = node.ranges.map(function (range) {
          range.marks = range.marks || [];
          range.marks.push({ type: type, data: data });
          return range;
        });
      } else {
        node.nodes = node.nodes.map(applyMark);
      }

      return node;
    };

    return mark.nodes.reduce(function (nodes, node) {
      var ret = applyMark(node);
      if (Array.isArray(ret)) return nodes.concat(ret);
      nodes.push(ret);
      return nodes;
    }, []);
  };

  this.serialize = function (state) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var document = state.document;

    var elements = document.nodes.map(_this.serializeNode);
    if (options.render === false) return elements;

    var html = _server2.default.renderToStaticMarkup(_react2.default.createElement(
      'body',
      null,
      elements
    ));
    var inner = html.slice(6, -7);
    return inner;
  };

  this.serializeNode = function (node) {
    if (node.kind == 'text') {
      var ranges = node.getRanges();
      return ranges.map(_this.serializeRange);
    }

    var children = node.nodes.map(_this.serializeNode);

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = _this.rules[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var rule = _step2.value;

        if (!rule.serialize) continue;
        var ret = rule.serialize(node, children);
        if (ret) return addKey(ret);
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    throw new Error('No serializer defined for node of type "' + node.type + '".');
  };

  this.serializeRange = function (range) {
    var string = new String({ text: range.text });
    var text = _this.serializeString(string);

    return range.marks.reduce(function (children, mark) {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = _this.rules[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var rule = _step3.value;

          if (!rule.serialize) continue;
          var ret = rule.serialize(mark, children);
          if (ret) return addKey(ret);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      throw new Error('No serializer defined for mark of type "' + mark.type + '".');
    }, text);
  };

  this.serializeString = function (string) {
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = _this.rules[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var rule = _step4.value;

        if (!rule.serialize) continue;
        var ret = rule.serialize(string, string.text);
        if (ret) return ret;
      }
    } catch (err) {
      _didIteratorError4 = true;
      _iteratorError4 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion4 && _iterator4.return) {
          _iterator4.return();
        }
      } finally {
        if (_didIteratorError4) {
          throw _iteratorError4;
        }
      }
    }
  };
};

var key = 0;

function addKey(element) {
  return _react2.default.cloneElement(element, { key: key++ });
}

/**
 * Export.
 *
 * @type {Html}
 */

exports.default = Html;