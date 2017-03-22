'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _offsetKey = require('../utils/offset-key');

var _offsetKey2 = _interopRequireDefault(_offsetKey);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _getWindow = require('get-window');

var _getWindow2 = _interopRequireDefault(_getWindow);

var _environment = require('../constants/environment');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Debugger.
 *
 * @type {Function}
 */

var debug = (0, _debug2.default)('slate:leaf');

/**
 * Leaf.
 *
 * @type {Component}
 */

var Leaf = function (_React$Component) {
  _inherits(Leaf, _React$Component);

  /**
   * Constructor.
   *
   * @param {Object} props
   */

  /**
   * Property types.
   *
   * @type {Object}
   */

  function Leaf(props) {
    _classCallCheck(this, Leaf);

    var _this = _possibleConstructorReturn(this, (Leaf.__proto__ || Object.getPrototypeOf(Leaf)).call(this, props));

    _this.debug = function (message) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      debug.apply(undefined, [message, _this.props.node.key + '-' + _this.props.index].concat(args));
    };

    _this.tmp = {};
    _this.tmp.renders = 0;
    return _this;
  }

  /**
   * Debug.
   *
   * @param {String} message
   * @param {Mixed} ...args
   */

  /**
   * Default properties.
   *
   * @type {Object}
   */

  _createClass(Leaf, [{
    key: 'shouldComponentUpdate',


    /**
     * Should component update?
     *
     * @param {Object} props
     * @return {Boolean}
     */

    value: function shouldComponentUpdate(props) {
      // If any of the regular properties have changed, re-render.
      if (props.index != this.props.index || props.marks != this.props.marks || props.schema != this.props.schema || props.text != this.props.text) {
        return true;
      }

      // If the DOM text does not equal the `text` property, re-render, this can
      // happen because React gets out of sync when previously natively rendered.
      var el = findDeepestNode(_reactDom2.default.findDOMNode(this));
      var text = this.renderText(props);
      if (el.textContent != text) return true;

      // If the selection was previously focused, and now it isn't, re-render so
      // that the selection will be properly removed.
      if (this.props.state.isFocused && props.state.isBlurred) {
        var _props = this.props,
            index = _props.index,
            node = _props.node,
            ranges = _props.ranges,
            state = _props.state;

        var _OffsetKey$findBounds = _offsetKey2.default.findBounds(index, ranges),
            start = _OffsetKey$findBounds.start,
            end = _OffsetKey$findBounds.end;

        if (state.selection.hasEdgeBetween(node, start, end)) return true;
      }

      // If the selection will be focused, only re-render if this leaf contains
      // one or both of the selection's edges.
      if (props.state.isFocused) {
        var _index = props.index,
            _node = props.node,
            _ranges = props.ranges,
            _state = props.state;

        var _OffsetKey$findBounds2 = _offsetKey2.default.findBounds(_index, _ranges),
            _start = _OffsetKey$findBounds2.start,
            _end = _OffsetKey$findBounds2.end;

        if (_state.selection.hasEdgeBetween(_node, _start, _end)) return true;
      }

      // Otherwise, don't update.
      return false;
    }

    /**
     * When the DOM updates, try updating the selection.
     */

  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.updateSelection();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.updateSelection();
    }

    /**
     * Update the DOM selection if it's inside the leaf.
     */

  }, {
    key: 'updateSelection',
    value: function updateSelection() {
      var _props2 = this.props,
          state = _props2.state,
          ranges = _props2.ranges;
      var selection = state.selection;

      // If the selection is blurred we have nothing to do.

      if (selection.isBlurred) return;

      var _props3 = this.props,
          node = _props3.node,
          index = _props3.index;

      var _OffsetKey$findBounds3 = _offsetKey2.default.findBounds(index, ranges),
          start = _OffsetKey$findBounds3.start,
          end = _OffsetKey$findBounds3.end;

      var anchorOffset = selection.anchorOffset - start;
      var focusOffset = selection.focusOffset - start;

      // If neither matches, the selection doesn't start or end here, so exit.
      var hasAnchor = selection.hasAnchorBetween(node, start, end);
      var hasFocus = selection.hasFocusBetween(node, start, end);
      if (!hasAnchor && !hasFocus) return;

      // We have a selection to render, so prepare a few things...
      var ref = _reactDom2.default.findDOMNode(this);
      var el = findDeepestNode(ref);
      var window = (0, _getWindow2.default)(el);
      var native = window.getSelection();
      var parent = ref.closest('[contenteditable]');

      // COMPAT: In Firefox, it's not enough to create a range, you also need to
      // focus the contenteditable element. (2016/11/16)
      function focus() {
        if (!_environment.IS_FIREFOX) return;
        if (parent) setTimeout(function () {
          return parent.focus();
        });
      }

      // If both the start and end are here, set the selection all at once.
      if (hasAnchor && hasFocus) {
        native.removeAllRanges();
        var range = window.document.createRange();
        range.setStart(el, anchorOffset);
        native.addRange(range);
        native.extend(el, focusOffset);
        focus();
      }

      // Otherwise we need to set the selection across two different leaves.
      else {
          // If the selection is forward, we can set things in sequence. In the
          // first leaf to render, reset the selection and set the new start. And
          // then in the second leaf to render, extend to the new end.
          if (selection.isForward) {
            if (hasAnchor) {
              native.removeAllRanges();
              var _range = window.document.createRange();
              _range.setStart(el, anchorOffset);
              native.addRange(_range);
            } else if (hasFocus) {
              native.extend(el, focusOffset);
              focus();
            }
          }

          // Otherwise, if the selection is backward, we need to hack the order a bit.
          // In the first leaf to render, set a phony start anchor to store the true
          // end position. And then in the second leaf to render, set the start and
          // extend the end to the stored value.
          else {
              if (hasFocus) {
                native.removeAllRanges();
                var _range2 = window.document.createRange();
                _range2.setStart(el, focusOffset);
                native.addRange(_range2);
              } else if (hasAnchor) {
                var endNode = native.focusNode;
                var endOffset = native.focusOffset;
                native.removeAllRanges();
                var _range3 = window.document.createRange();
                _range3.setStart(el, anchorOffset);
                native.addRange(_range3);
                native.extend(endNode, endOffset);
                focus();
              }
            }
        }

      this.debug('updateSelection', { selection: selection });
    }

    /**
     * Render the leaf.
     *
     * @return {Element}
     */

  }, {
    key: 'render',
    value: function render() {
      var props = this.props;
      var node = props.node,
          index = props.index;

      var offsetKey = _offsetKey2.default.stringify({
        key: node.key,
        index: index
      });

      // Increment the renders key, which forces a re-render whenever this
      // component is told it should update. This is required because "native"
      // renders where we don't update the leaves cause React's internal state to
      // get out of sync, causing it to not realize the DOM needs updating.
      this.tmp.renders++;

      this.debug('render', { props: props });

      return _react2.default.createElement(
        'span',
        { key: this.tmp.renders, 'data-offset-key': offsetKey },
        this.renderMarks(props)
      );
    }

    /**
     * Render the text content of the leaf, accounting for browsers.
     *
     * @param {Object} props
     * @return {Element}
     */

  }, {
    key: 'renderText',
    value: function renderText(props) {
      var node = props.node,
          state = props.state,
          parent = props.parent,
          text = props.text,
          index = props.index,
          ranges = props.ranges;

      // COMPAT: If the text is empty and it's the only child, we need to render a
      // <br/> to get the block to have the proper height.

      if (text == '' && parent.kind == 'block' && parent.text == '') return _react2.default.createElement('br', null);

      // COMPAT: If the text is empty otherwise, it's because it's on the edge of
      // an inline void node, so we render a zero-width space so that the
      // selection can be inserted next to it still.
      if (text == '') return _react2.default.createElement(
        'span',
        { 'data-slate-zero-width': true },
        '\u200B'
      );

      // COMPAT: Browsers will collapse trailing new lines at the end of blocks,
      // so we need to add an extra trailing new lines to prevent that.
      var block = state.document.getClosestBlock(node.key);
      var lastText = block.getLastText();
      var lastChar = text.charAt(text.length - 1);
      var isLastText = node == lastText;
      var isLastRange = index == ranges.size - 1;
      if (isLastText && isLastRange && lastChar == '\n') return text + '\n';

      // Otherwise, just return the text.
      return text;
    }

    /**
     * Render all of the leaf's mark components.
     *
     * @param {Object} props
     * @return {Element}
     */

  }, {
    key: 'renderMarks',
    value: function renderMarks(props) {
      var marks = props.marks,
          schema = props.schema;

      var text = this.renderText(props);

      return marks.reduce(function (children, mark) {
        var Component = mark.getComponent(schema);
        if (!Component) return children;
        return _react2.default.createElement(
          Component,
          { mark: mark, marks: marks },
          children
        );
      }, text);
    }
  }]);

  return Leaf;
}(_react2.default.Component);

/**
 * Find the deepest descendant of a DOM `element`.
 *
 * @param {Element} node
 * @return {Element}
 */

Leaf.propTypes = {
  index: _react2.default.PropTypes.number.isRequired,
  isVoid: _react2.default.PropTypes.bool,
  marks: _react2.default.PropTypes.object.isRequired,
  node: _react2.default.PropTypes.object.isRequired,
  parent: _react2.default.PropTypes.object.isRequired,
  ranges: _react2.default.PropTypes.object.isRequired,
  schema: _react2.default.PropTypes.object.isRequired,
  state: _react2.default.PropTypes.object.isRequired,
  text: _react2.default.PropTypes.string.isRequired
};
Leaf.defaultProps = {
  isVoid: false
};
function findDeepestNode(element) {
  return element.firstChild ? findDeepestNode(element.firstChild) : element;
}

/**
 * Export.
 *
 * @type {Component}
 */

exports.default = Leaf;