'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _slatePropTypes = require('slate-prop-types');

var _slatePropTypes2 = _interopRequireDefault(_slatePropTypes);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _leaf = require('./leaf');

var _leaf2 = _interopRequireDefault(_leaf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Debug.
 *
 * @type {Function}
 */

var debug = (0, _debug2.default)('slate:node');

var Text = function (_React$Component) {
  _inherits(Text, _React$Component);

  function Text() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Text);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Text.__proto__ || Object.getPrototypeOf(Text)).call.apply(_ref, [this].concat(args))), _this), _initialiseProps.call(_this), _temp), _possibleConstructorReturn(_this, _ret);
  }

  /**
   * Property types.
   *
   * @type {Object}
   */

  /**
   * Debug.
   *
   * @param {String} message
   * @param {Mixed} ...args
   */

  /**
   * Should the node update?
   *
   * @param {Object} nextProps
   * @param {Object} state
   * @return {Boolean}
   */

  _createClass(Text, [{
    key: 'render',


    /**
     * Render.
     *
     * @return {Element}
     */

    value: function render() {
      var _this2 = this;

      var props = this.props;

      this.debug('render', { props: props });

      var node = props.node,
          schema = props.schema,
          state = props.state;
      var document = state.document;

      var decorators = schema.hasDecorators ? document.getDescendantDecorators(node.key, schema) : [];
      var ranges = node.getRanges(decorators);
      var offset = 0;

      var leaves = ranges.map(function (range, i) {
        var leaf = _this2.renderLeaf(ranges, range, i, offset);
        offset += range.text.length;
        return leaf;
      });

      return _react2.default.createElement(
        'span',
        { 'data-key': node.key },
        leaves
      );
    }

    /**
     * Render a single leaf node given a `range` and `offset`.
     *
     * @param {List<Range>} ranges
     * @param {Range} range
     * @param {Number} index
     * @param {Number} offset
     * @return {Element} leaf
     */

  }]);

  return Text;
}(_react2.default.Component);

/**
 * Export.
 *
 * @type {Component}
 */

Text.propTypes = {
  block: _slatePropTypes2.default.block,
  editor: _propTypes2.default.object.isRequired,
  node: _slatePropTypes2.default.node.isRequired,
  parent: _slatePropTypes2.default.node.isRequired,
  schema: _slatePropTypes2.default.schema.isRequired,
  state: _slatePropTypes2.default.state.isRequired
};

var _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.debug = function (message) {
    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    var node = _this3.props.node;
    var key = node.key;

    debug.apply(undefined, [message, key + ' (text)'].concat(args));
  };

  this.shouldComponentUpdate = function (nextProps) {
    var props = _this3.props;

    var n = nextProps;
    var p = props;

    // If the node has changed, update. PERF: There are cases where it will have
    // changed, but it's properties will be exactly the same (eg. copy-paste)
    // which this won't catch. But that's rare and not a drag on performance, so
    // for simplicity we just let them through.
    if (n.node != p.node) return true;

    // Re-render if the current decorations have changed, even if the content of
    // the text node itself hasn't.
    if (n.schema.hasDecorators) {
      var nDecorators = n.state.document.getDescendantDecorators(n.node.key, n.schema);
      var pDecorators = p.state.document.getDescendantDecorators(p.node.key, p.schema);
      var nRanges = n.node.getRanges(nDecorators);
      var pRanges = p.node.getRanges(pDecorators);
      if (!nRanges.equals(pRanges)) return true;
    }

    // If the node parent is a block node, and it was the last child of the
    // block, re-render to cleanup extra `<br/>` or `\n`.
    if (n.parent.kind == 'block') {
      var pLast = p.parent.nodes.last();
      var nLast = n.parent.nodes.last();
      if (p.node == pLast && n.node != nLast) return true;
    }

    // Otherwise, don't update.
    return false;
  };

  this.renderLeaf = function (ranges, range, index, offset) {
    var _props = _this3.props,
        block = _props.block,
        node = _props.node,
        parent = _props.parent,
        schema = _props.schema,
        state = _props.state,
        editor = _props.editor;
    var text = range.text,
        marks = range.marks;


    return _react2.default.createElement(_leaf2.default, {
      key: node.key + '-' + index,
      block: block,
      editor: editor,
      index: index,
      marks: marks,
      node: node,
      offset: offset,
      parent: parent,
      ranges: ranges,
      schema: schema,
      state: state,
      text: text
    });
  };
};

exports.default = Text;