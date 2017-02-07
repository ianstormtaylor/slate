'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _getLeafText = require('../utils/get-leaf-text');

var _getLeafText2 = _interopRequireDefault(_getLeafText);

var _warn = require('../utils/warn');

var _warn2 = _interopRequireDefault(_warn);

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
  anchorKey: null,
  anchorOffset: 0,
  focusKey: null,
  focusOffset: 0,
  isBackward: null,
  isFocused: false,
  marks: null
};

/**
 * Selection.
 *
 * @type {Selection}
 */

var Selection = function (_ref) {
  _inherits(Selection, _ref);

  function Selection() {
    _classCallCheck(this, Selection);

    return _possibleConstructorReturn(this, (Selection.__proto__ || Object.getPrototypeOf(Selection)).apply(this, arguments));
  }

  _createClass(Selection, [{
    key: 'hasAnchorAtStartOf',


    /**
     * Check whether anchor point of the selection is at the start of a `node`.
     *
     * @param {Node} node
     * @return {Boolean}
     */

    value: function hasAnchorAtStartOf(node) {
      if (this.anchorOffset != 0) return false;
      var first = node.kind == 'text' ? node : node.getFirstText();
      return this.anchorKey == first.key;
    }

    /**
     * Check whether anchor point of the selection is at the end of a `node`.
     *
     * @param {Node} node
     * @return {Boolean}
     */

  }, {
    key: 'hasAnchorAtEndOf',
    value: function hasAnchorAtEndOf(node) {
      var last = node.kind == 'text' ? node : node.getLastText();
      return this.anchorKey == last.key && this.anchorOffset == last.length;
    }

    /**
     * Check whether the anchor edge of a selection is in a `node` and at an
     * offset between `start` and `end`.
     *
     * @param {Node} node
     * @param {Number} start
     * @param {Number} end
     * @return {Boolean}
     */

  }, {
    key: 'hasAnchorBetween',
    value: function hasAnchorBetween(node, start, end) {
      return this.anchorOffset <= end && start <= this.anchorOffset && this.hasAnchorIn(node);
    }

    /**
     * Check whether the anchor edge of a selection is in a `node`.
     *
     * @param {Node} node
     * @return {Boolean}
     */

  }, {
    key: 'hasAnchorIn',
    value: function hasAnchorIn(node) {
      if (node.kind == 'text') {
        return node.key === this.anchorKey;
      } else {
        return node.hasDescendant(this.anchorKey);
      }
    }

    /**
     * Check whether focus point of the selection is at the end of a `node`.
     *
     * @param {Node} node
     * @return {Boolean}
     */

  }, {
    key: 'hasFocusAtEndOf',
    value: function hasFocusAtEndOf(node) {
      var last = node.kind == 'text' ? node : node.getLastText();
      return this.focusKey == last.key && this.focusOffset == last.length;
    }

    /**
     * Check whether focus point of the selection is at the start of a `node`.
     *
     * @param {Node} node
     * @return {Boolean}
     */

  }, {
    key: 'hasFocusAtStartOf',
    value: function hasFocusAtStartOf(node) {
      if (this.focusOffset != 0) return false;
      var first = node.kind == 'text' ? node : node.getFirstText();
      return this.focusKey == first.key;
    }

    /**
     * Check whether the focus edge of a selection is in a `node` and at an
     * offset between `start` and `end`.
     *
     * @param {Node} node
     * @param {Number} start
     * @param {Number} end
     * @return {Boolean}
     */

  }, {
    key: 'hasFocusBetween',
    value: function hasFocusBetween(node, start, end) {
      return start <= this.focusOffset && this.focusOffset <= end && this.hasFocusIn(node);
    }

    /**
     * Check whether the focus edge of a selection is in a `node`.
     *
     * @param {Node} node
     * @return {Boolean}
     */

  }, {
    key: 'hasFocusIn',
    value: function hasFocusIn(node) {
      if (node.kind == 'text') {
        return node.key === this.focusKey;
      } else {
        return node.hasDescendant(this.focusKey);
      }
    }

    /**
     * Check whether the selection is at the start of a `node`.
     *
     * @param {Node} node
     * @return {Boolean}
     */

  }, {
    key: 'isAtStartOf',
    value: function isAtStartOf(node) {
      var isExpanded = this.isExpanded,
          startKey = this.startKey,
          startOffset = this.startOffset;

      if (isExpanded) return false;
      if (startOffset != 0) return false;
      var first = node.kind == 'text' ? node : node.getFirstText();
      return startKey == first.key;
    }

    /**
     * Check whether the selection is at the end of a `node`.
     *
     * @param {Node} node
     * @return {Boolean}
     */

  }, {
    key: 'isAtEndOf',
    value: function isAtEndOf(node) {
      var endKey = this.endKey,
          endOffset = this.endOffset,
          isExpanded = this.isExpanded;

      if (isExpanded) return false;
      var last = node.kind == 'text' ? node : node.getLastText();
      return endKey == last.key && endOffset == last.length;
    }

    /**
     * Normalize the selection, relative to a `node`, ensuring that the anchor
     * and focus nodes of the selection always refer to leaf text nodes.
     *
     * @param {Node} node
     * @return {Selection}
     */

  }, {
    key: 'normalize',
    value: function normalize(node) {
      var selection = this;
      var anchorKey = selection.anchorKey,
          anchorOffset = selection.anchorOffset,
          focusKey = selection.focusKey,
          focusOffset = selection.focusOffset,
          isBackward = selection.isBackward;

      // If the selection isn't formed yet or is malformed, ensure that it is
      // properly zeroed out.

      if (anchorKey == null || focusKey == null || !node.hasDescendant(anchorKey) || !node.hasDescendant(focusKey)) {
        return selection.merge({
          anchorKey: null,
          anchorOffset: 0,
          focusKey: null,
          focusOffset: 0,
          isBackward: false
        });
      }

      // Get the anchor and focus nodes.
      var anchorNode = node.getDescendant(anchorKey);
      var focusNode = node.getDescendant(focusKey);

      // If the anchor node isn't a text node, match it to one.
      if (anchorNode.kind != 'text') {
        (0, _warn2.default)('The selection anchor was set to a Node that is not a Text node. This should not happen and can degrade performance. The node in question was:', anchorNode);
        var anchorText = anchorNode.getTextAtOffset(anchorOffset);
        var offset = anchorNode.getOffset(anchorText);
        anchorOffset = anchorOffset - offset;
        anchorNode = anchorText;
      }

      // If the focus node isn't a text node, match it to one.
      if (focusNode.kind != 'text') {
        (0, _warn2.default)('The selection focus was set to a Node that is not a Text node. This should not happen and can degrade performance. The node in question was:', focusNode);
        var focusText = focusNode.getTextAtOffset(focusOffset);
        var _offset = focusNode.getOffset(focusText);
        focusOffset = focusOffset - _offset;
        focusNode = focusText;
      }

      // If `isBackward` is not set, derive it.
      if (isBackward == null) {
        if (anchorNode.key === focusNode.key) {
          isBackward = anchorOffset > focusOffset;
        } else {
          isBackward = !node.areDescendantSorted(anchorNode.key, focusNode.key);
        }
      }

      // Merge in any updated properties.
      return selection.merge({
        anchorKey: anchorNode.key,
        anchorOffset: anchorOffset,
        focusKey: focusNode.key,
        focusOffset: focusOffset,
        isBackward: isBackward
      });
    }

    /**
     * Focus the selection.
     *
     * @return {Selection}
     */

  }, {
    key: 'focus',
    value: function focus() {
      return this.merge({
        isFocused: true
      });
    }

    /**
     * Blur the selection.
     *
     * @return {Selection}
     */

  }, {
    key: 'blur',
    value: function blur() {
      return this.merge({
        isFocused: false
      });
    }

    /**
     * Move the focus point to the anchor point.
     *
     * @return {Selection}
     */

  }, {
    key: 'collapseToAnchor',
    value: function collapseToAnchor() {
      return this.merge({
        focusKey: this.anchorKey,
        focusOffset: this.anchorOffset,
        isBackward: false
      });
    }

    /**
     * Move the anchor point to the focus point.
     *
     * @return {Selection}
     */

  }, {
    key: 'collapseToFocus',
    value: function collapseToFocus() {
      return this.merge({
        anchorKey: this.focusKey,
        anchorOffset: this.focusOffset,
        isBackward: false
      });
    }

    /**
     * Move to the start of a `node`.
     *
     * @param {Node} node
     * @return {Selection}
     */

  }, {
    key: 'collapseToStartOf',
    value: function collapseToStartOf(node) {
      node = (0, _getLeafText2.default)(node);

      return this.merge({
        anchorKey: node.key,
        anchorOffset: 0,
        focusKey: node.key,
        focusOffset: 0,
        isBackward: false
      });
    }

    /**
     * Move to the end of a `node`.
     *
     * @return {Selection}
     */

  }, {
    key: 'collapseToEndOf',
    value: function collapseToEndOf(node) {
      node = (0, _getLeafText2.default)(node);

      return this.merge({
        anchorKey: node.key,
        anchorOffset: node.length,
        focusKey: node.key,
        focusOffset: node.length,
        isBackward: false
      });
    }

    /**
     * Move to the entire range of `start` and `end` nodes.
     *
     * @param {Node} start
     * @param {Node} end (optional)
     * @param {Document} document
     * @return {Selection}
     */

  }, {
    key: 'moveToRangeOf',
    value: function moveToRangeOf(start) {
      var end = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : start;

      start = (0, _getLeafText2.default)(start);
      end = (0, _getLeafText2.default)(end);

      return this.merge({
        anchorKey: start.key,
        anchorOffset: 0,
        focusKey: end.key,
        focusOffset: end.length,
        isBackward: null
      });
    }

    /**
     * Move the selection forward `n` characters.
     *
     * @param {Number} n (optional)
     * @return {Selection}
     */

  }, {
    key: 'moveForward',
    value: function moveForward() {
      var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      return this.merge({
        anchorOffset: this.anchorOffset + n,
        focusOffset: this.focusOffset + n
      });
    }

    /**
     * Move the selection backward `n` characters.
     *
     * @param {Number} n (optional)
     * @return {Selection}
     */

  }, {
    key: 'moveBackward',
    value: function moveBackward() {
      var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      return this.merge({
        anchorOffset: this.anchorOffset - n,
        focusOffset: this.focusOffset - n
      });
    }

    /**
     * Move the selection to `anchor` and `focus` offsets.
     *
     * @param {Number} anchor
     * @param {Number} focus (optional)
     * @return {Selection}
     */

  }, {
    key: 'moveToOffsets',
    value: function moveToOffsets(anchor) {
      var focus = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : anchor;

      var props = {};
      props.anchorOffset = anchor;
      props.focusOffset = focus;

      if (this.anchorKey == this.focusKey) {
        props.isBackward = anchor > focus;
      }

      return this.merge(props);
    }

    /**
     * Extend the focus point forward `n` characters.
     *
     * @param {Number} n (optional)
     * @return {Selection}
     */

  }, {
    key: 'extendForward',
    value: function extendForward() {
      var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      return this.merge({
        focusOffset: this.focusOffset + n,
        isBackward: null
      });
    }

    /**
     * Extend the focus point backward `n` characters.
     *
     * @param {Number} n (optional)
     * @return {Selection}
     */

  }, {
    key: 'extendBackward',
    value: function extendBackward() {
      var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      return this.merge({
        focusOffset: this.focusOffset - n,
        isBackward: null
      });
    }

    /**
     * Move the anchor offset `n` characters.
     *
     * @param {Number} n (optional)
     * @return {Selection}
     */

  }, {
    key: 'moveAnchorOffset',
    value: function moveAnchorOffset() {
      var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var anchorKey = this.anchorKey,
          focusKey = this.focusKey,
          focusOffset = this.focusOffset;

      var anchorOffset = this.anchorOffset + n;
      return this.merge({
        anchorOffset: anchorOffset,
        isBackward: anchorKey == focusKey ? anchorOffset > focusOffset : this.isBackward
      });
    }

    /**
     * Move the anchor offset `n` characters.
     *
     * @param {Number} n (optional)
     * @return {Selection}
     */

  }, {
    key: 'moveFocusOffset',
    value: function moveFocusOffset() {
      var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var focusKey = this.focusKey,
          anchorKey = this.anchorKey,
          anchorOffset = this.anchorOffset;

      var focusOffset = this.focusOffset + n;
      return this.merge({
        focusOffset: focusOffset,
        isBackward: focusKey == anchorKey ? anchorOffset > focusOffset : this.isBackward
      });
    }

    /**
     * Move the start key, while preserving the direction
     *
     * @param {String} key
     * @return {Selection}
     */

  }, {
    key: 'moveStartTo',
    value: function moveStartTo(key) {
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      if (this.isBackward) {
        return this.merge({
          focusKey: key,
          focusOffset: offset,
          isBackward: null
        });
      } else {
        return this.merge({
          anchorKey: key,
          anchorOffset: offset,
          isBackward: null
        });
      }
    }

    /**
     * Move the end key, while preserving the direction
     *
     * @param {String} key
     * @return {Selection}
     */

  }, {
    key: 'moveEndTo',
    value: function moveEndTo(key) {
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      if (this.isBackward) {
        return this.merge({
          anchorKey: key,
          anchorOffset: offset,
          isBackward: null
        });
      } else {
        return this.merge({
          focusKey: key,
          focusOffset: offset,
          isBackward: null
        });
      }
    }

    /**
     * Extend the focus point to the start of a `node`.
     *
     * @param {Node} node
     * @return {Selection}
     */

  }, {
    key: 'extendToStartOf',
    value: function extendToStartOf(node) {
      return this.merge({
        focusKey: node.key,
        focusOffset: 0,
        isBackward: null
      });
    }

    /**
     * Extend the focus point to the end of a `node`.
     *
     * @param {Node} node
     * @return {Selection}
     */

  }, {
    key: 'extendToEndOf',
    value: function extendToEndOf(node) {
      return this.merge({
        focusKey: node.key,
        focusOffset: node.length,
        isBackward: null
      });
    }

    /**
     * Unset the selection
     *
     * @return {Selection}
     */

  }, {
    key: 'unset',
    value: function unset() {
      return this.merge({
        anchorKey: null,
        anchorOffset: 0,
        focusKey: null,
        focusOffset: 0,
        isFocused: false,
        isBackward: false
      });
    }

    /**
     * Flip the selection.
     *
     * @return {Selection}
     */

  }, {
    key: 'flip',
    value: function flip() {
      return this.merge({
        anchorKey: this.focusKey,
        anchorOffset: this.focusOffset,
        focusKey: this.anchorKey,
        focusOffset: this.anchorOffset,
        isBackward: this.isBackward == null ? null : !this.isBackward
      });
    }
  }, {
    key: 'kind',


    /**
     * Get the kind.
     *
     * @return {String}
     */

    get: function get() {
      return 'selection';
    }

    /**
     * Get whether the selection is blurred.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isBlurred',
    get: function get() {
      return !this.isFocused;
    }

    /**
     * Get whether the selection is collapsed.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isCollapsed',
    get: function get() {
      return this.anchorKey == this.focusKey && this.anchorOffset == this.focusOffset;
    }

    /**
     * Get whether the selection is expanded.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isExpanded',
    get: function get() {
      return !this.isCollapsed;
    }

    /**
     * Get whether the selection is forward.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isForward',
    get: function get() {
      return this.isBackward == null ? null : !this.isBackward;
    }

    /**
     * Check whether the selection's keys are set.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isSet',
    get: function get() {
      return this.anchorKey != null && this.focusKey != null;
    }

    /**
     * Check whether the selection's keys are not set.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isUnset',
    get: function get() {
      return !this.isSet;
    }

    /**
     * Get the start key.
     *
     * @return {String}
     */

  }, {
    key: 'startKey',
    get: function get() {
      return this.isBackward ? this.focusKey : this.anchorKey;
    }
  }, {
    key: 'startOffset',
    get: function get() {
      return this.isBackward ? this.focusOffset : this.anchorOffset;
    }
  }, {
    key: 'endKey',
    get: function get() {
      return this.isBackward ? this.anchorKey : this.focusKey;
    }
  }, {
    key: 'endOffset',
    get: function get() {
      return this.isBackward ? this.anchorOffset : this.focusOffset;
    }
  }], [{
    key: 'create',


    /**
     * Create a new `Selection` with `properties`.
     *
     * @param {Object|Selection} properties
     * @return {Selection}
     */

    value: function create() {
      var properties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (properties instanceof Selection) return properties;
      return new Selection(properties);
    }
  }]);

  return Selection;
}(new _immutable.Record(DEFAULTS));

/**
 * Add start, end and edge convenience methods.
 */

[['has', 'AtStartOf', true], ['has', 'AtEndOf', true], ['has', 'Between', true], ['has', 'In', true], ['collapseTo', ''], ['move', 'Offset']].forEach(function (opts) {
  var _opts = _slicedToArray(opts, 3),
      p = _opts[0],
      s = _opts[1],
      hasEdge = _opts[2];

  var anchor = p + 'Anchor' + s;
  var edge = p + 'Edge' + s;
  var end = p + 'End' + s;
  var focus = p + 'Focus' + s;
  var start = p + 'Start' + s;

  Selection.prototype[start] = function () {
    return this.isBackward ? this[focus].apply(this, arguments) : this[anchor].apply(this, arguments);
  };

  Selection.prototype[end] = function () {
    return this.isBackward ? this[anchor].apply(this, arguments) : this[focus].apply(this, arguments);
  };

  if (hasEdge) {
    Selection.prototype[edge] = function () {
      return this[anchor].apply(this, arguments) || this[focus].apply(this, arguments);
    };
  }
});

/**
 * Export.
 *
 * @type {Selection}
 */

exports.default = Selection;