'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('../serializers/base-64');

var _base2 = _interopRequireDefault(_base);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _types = require('../constants/types');

var _types2 = _interopRequireDefault(_types);

var _leaf = require('./leaf');

var _leaf2 = _interopRequireDefault(_leaf);

var _void = require('./void');

var _void2 = _interopRequireDefault(_void);

var _scrollTo = require('../utils/scroll-to');

var _scrollTo2 = _interopRequireDefault(_scrollTo);

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

/**
 * Node.
 *
 * @type {Component}
 */

var Node = function (_React$Component) {
  _inherits(Node, _React$Component);

  /**
   * Constructor.
   *
   * @param {Object} props
   */

  function Node(props) {
    _classCallCheck(this, Node);

    var _this = _possibleConstructorReturn(this, (Node.__proto__ || Object.getPrototypeOf(Node)).call(this, props));

    _initialiseProps.call(_this);

    var node = props.node,
        schema = props.schema;

    _this.state = {};
    _this.state.Component = node.kind == 'text' ? null : node.getComponent(schema);
    return _this;
  }

  /**
   * Debug.
   *
   * @param {String} message
   * @param {Mixed} ...args
   */

  /**
   * Property types.
   *
   * @type {Object}
   */

  /**
   * On receiving new props, update the `Component` renderer.
   *
   * @param {Object} props
   */

  /**
   * Should the node update?
   *
   * @param {Object} nextProps
   * @param {Object} state
   * @return {Boolean}
   */

  /**
   * On mount, update the scroll position.
   */

  /**
   * After update, update the scroll position if the node's content changed.
   *
   * @param {Object} prevProps
   * @param {Object} prevState
   */

  /**
   * Update the scroll position after a change as occured if this is a leaf
   * block and it has the selection's ending edge. This ensures that scrolling
   * matches native `contenteditable` behavior even for cases where the edit is
   * not applied natively, like when enter is pressed.
   */

  /**
   * On drag start, add a serialized representation of the node to the data.
   *
   * @param {Event} e
   */

  /**
   * Render.
   *
   * @return {Element}
   */

  /**
   * Render a `child` node.
   *
   * @param {Node} child
   * @return {Element}
   */

  /**
   * Render an element `node`.
   *
   * @return {Element}
   */

  /**
   * Render a text node.
   *
   * @return {Element}
   */

  /**
   * Render a single leaf node given a `range` and `offset`.
   *
   * @param {List<Range>} ranges
   * @param {Range} range
   * @param {Number} index
   * @param {Number} offset
   * @return {Element} leaf
   */

  return Node;
}(_react2.default.Component);

/**
 * Export.
 *
 * @type {Component}
 */

Node.propTypes = {
  editor: _react2.default.PropTypes.object.isRequired,
  node: _react2.default.PropTypes.object.isRequired,
  parent: _react2.default.PropTypes.object.isRequired,
  readOnly: _react2.default.PropTypes.bool.isRequired,
  schema: _react2.default.PropTypes.object.isRequired,
  state: _react2.default.PropTypes.object.isRequired
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.debug = function (message) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var node = _this2.props.node;
    var key = node.key,
        kind = node.kind,
        type = node.type;

    var id = kind == 'text' ? key + ' (' + kind + ')' : key + ' (' + type + ')';
    debug.apply(undefined, [message, '' + id].concat(args));
  };

  this.componentWillReceiveProps = function (props) {
    if (props.node.kind == 'text') return;
    if (props.node == _this2.props.node) return;
    var Component = props.node.getComponent(props.schema);
    _this2.setState({ Component: Component });
  };

  this.shouldComponentUpdate = function (nextProps) {
    var Component = _this2.state.Component;

    // If the node is rendered with a `Component` that has enabled suppression
    // of update checking, always return true so that it can deal with update
    // checking itself.

    if (Component && Component.suppressShouldComponentUpdate) {
      return true;
    }

    // If the `readOnly` status has changed, we need to re-render in case there is
    // any user-land logic that depends on it, like nested editable contents.
    if (nextProps.readOnly !== _this2.props.readOnly) return true;

    // If the node has changed, update. PERF: There are certain cases where the
    // node instance will have changed, but it's properties will be exactly the
    // same (copy-paste, delete backwards, etc.) in which case this will not
    // catch a potentially avoidable re-render. But those cases are rare enough
    // that they aren't really a drag on performance, so for simplicity we just
    // let them through.
    if (nextProps.node != _this2.props.node) {
      return true;
    }

    var nextHasEdgeIn = nextProps.state.selection.hasEdgeIn(nextProps.node);

    // If the selection is focused and is inside the node, we need to update so
    // that the selection will be set by one of the <Leaf> components.
    if (nextProps.state.isFocused && nextHasEdgeIn) {
      return true;
    }

    var hasEdgeIn = _this2.props.state.selection.hasEdgeIn(nextProps.node);
    // If the selection is blurred but was previously focused (or vice versa) inside the node,
    // we need to update to ensure the selection gets updated by re-rendering.
    if (_this2.props.state.isFocused != nextProps.state.isFocused && (hasEdgeIn || nextHasEdgeIn)) {
      return true;
    }

    // For block and inline nodes, which can have custom renderers, we need to
    // include another check for whether the previous selection had an edge in
    // the node, to allow for intuitive selection-based rendering.
    if (_this2.props.node.kind != 'text' && hasEdgeIn != nextHasEdgeIn) {
      return true;
    }

    // For text nodes, which can have custom decorations, we need to check to
    // see if the block has changed, which has caused the decorations to change.
    if (nextProps.node.kind == 'text' && nextProps.schema.hasDecorators) {
      var node = nextProps.node,
          schema = nextProps.schema,
          state = nextProps.state;
      var document = state.document;

      var decorators = document.getDescendantDecorators(node.key, schema);
      var ranges = node.getRanges(decorators);

      var prevNode = _this2.props.node;
      var prevSchema = _this2.props.schema;
      var prevDocument = _this2.props.state.document;
      var prevDecorators = prevDocument.getDescendantDecorators(prevNode.key, prevSchema);
      var prevRanges = prevNode.getRanges(prevDecorators);

      if (!ranges.equals(prevRanges)) {
        return true;
      }
    }

    // Otherwise, don't update.
    return false;
  };

  this.componentDidMount = function () {
    _this2.updateScroll();
  };

  this.componentDidUpdate = function (prevProps, prevState) {
    if (_this2.props.node != prevProps.node) _this2.updateScroll();
  };

  this.updateScroll = function () {
    var _props = _this2.props,
        node = _props.node,
        state = _props.state;
    var selection = state.selection;

    // If this isn't a block, or it's a wrapping block, abort.

    if (node.kind != 'block') return;
    if (node.nodes.first().kind == 'block') return;

    // If the selection is blurred, or this block doesn't contain it, abort.
    if (selection.isBlurred) return;
    if (!selection.hasEndIn(node)) return;

    var el = _reactDom2.default.findDOMNode(_this2);
    (0, _scrollTo2.default)(el);

    _this2.debug('updateScroll', el);
  };

  this.onDragStart = function (e) {
    var node = _this2.props.node;

    var encoded = _base2.default.serializeNode(node, { preserveKeys: true });
    var data = e.nativeEvent.dataTransfer;
    data.setData(_types2.default.NODE, encoded);

    _this2.debug('onDragStart', e);
  };

  this.render = function () {
    var props = _this2.props;
    var node = _this2.props.node;


    _this2.debug('render', { props: props });

    return node.kind == 'text' ? _this2.renderText() : _this2.renderElement();
  };

  this.renderNode = function (child) {
    return _react2.default.createElement(Node, {
      key: child.key,
      node: child,
      parent: _this2.props.node,
      editor: _this2.props.editor,
      readOnly: _this2.props.readOnly,
      schema: _this2.props.schema,
      state: _this2.props.state
    });
  };

  this.renderElement = function () {
    var _props2 = _this2.props,
        editor = _props2.editor,
        node = _props2.node,
        parent = _props2.parent,
        readOnly = _props2.readOnly,
        state = _props2.state;
    var Component = _this2.state.Component;

    var children = node.nodes.map(function (child) {
      return _this2.renderNode(child);
    }).toArray();

    // Attributes that the developer must to mix into the element in their
    // custom node renderer component.
    var attributes = {
      'data-key': node.key,
      'onDragStart': _this2.onDragStart
    };

    // If it's a block node with inline children, add the proper `dir` attribute
    // for text direction.
    if (node.kind == 'block' && node.nodes.first().kind != 'block') {
      var direction = node.getTextDirection();
      if (direction == 'rtl') attributes.dir = 'rtl';
    }

    var element = _react2.default.createElement(
      Component,
      {
        attributes: attributes,
        key: node.key,
        editor: editor,
        parent: parent,
        node: node,
        readOnly: readOnly,
        state: state
      },
      children
    );

    return node.isVoid ? _react2.default.createElement(
      _void2.default,
      _this2.props,
      element
    ) : element;
  };

  this.renderText = function () {
    var _props3 = _this2.props,
        node = _props3.node,
        schema = _props3.schema,
        state = _props3.state;
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
  };

  this.renderLeaf = function (ranges, range, index, offset) {
    var _props4 = _this2.props,
        node = _props4.node,
        parent = _props4.parent,
        schema = _props4.schema,
        state = _props4.state,
        editor = _props4.editor;
    var text = range.text,
        marks = range.marks;


    return _react2.default.createElement(_leaf2.default, {
      key: node.key + '-' + index,
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

exports.default = Node;