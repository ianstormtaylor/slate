'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slateBase64Serializer = require('slate-base64-serializer');

var _slateBase64Serializer2 = _interopRequireDefault(_slateBase64Serializer);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _slatePropTypes = require('slate-prop-types');

var _slatePropTypes2 = _interopRequireDefault(_slatePropTypes);

var _slateDevLogger = require('slate-dev-logger');

var _slateDevLogger2 = _interopRequireDefault(_slateDevLogger);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _transferTypes = require('../constants/transfer-types');

var _transferTypes2 = _interopRequireDefault(_transferTypes);

var _void = require('./void');

var _void2 = _interopRequireDefault(_void);

var _text = require('./text');

var _text2 = _interopRequireDefault(_text);

var _setTransferData = require('../utils/set-transfer-data');

var _setTransferData2 = _interopRequireDefault(_setTransferData);

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
    _this.state.Component = node.getComponent(schema);
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
   * On drag start, add a serialized representation of the node to the data.
   *
   * @param {Event} e
   */

  _createClass(Node, [{
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

      var editor = props.editor,
          isSelected = props.isSelected,
          node = props.node,
          parent = props.parent,
          readOnly = props.readOnly,
          state = props.state;
      var Component = this.state.Component;
      var selection = state.selection;

      var indexes = node.getSelectionIndexes(selection, isSelected);
      var children = node.nodes.toArray().map(function (child, i) {
        var isChildSelected = !!indexes && indexes.start <= i && i < indexes.end;
        return _this2.renderNode(child, isChildSelected);
      });

      // Attributes that the developer must to mix into the element in their
      // custom node renderer component.
      var attributes = {
        'data-key': node.key,
        'onDragStart': this.onDragStart
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
          editor: editor,
          isSelected: isSelected,
          key: node.key,
          node: node,
          parent: parent,
          readOnly: readOnly,
          state: state
        },
        children
      );

      return node.isVoid ? _react2.default.createElement(
        _void2.default,
        this.props,
        element
      ) : element;
    }

    /**
     * Render a `child` node.
     *
     * @param {Node} child
     * @param {Boolean} isSelected
     * @return {Element}
     */

  }]);

  return Node;
}(_react2.default.Component);

/**
 * Export.
 *
 * @type {Component}
 */

Node.propTypes = {
  block: _slatePropTypes2.default.block,
  editor: _propTypes2.default.object.isRequired,
  isSelected: _propTypes2.default.bool.isRequired,
  node: _slatePropTypes2.default.node.isRequired,
  parent: _slatePropTypes2.default.node.isRequired,
  readOnly: _propTypes2.default.bool.isRequired,
  schema: _slatePropTypes2.default.schema.isRequired,
  state: _slatePropTypes2.default.state.isRequired
};

var _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.debug = function (message) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var node = _this3.props.node;
    var key = node.key,
        type = node.type;

    debug.apply(undefined, [message, key + ' (' + type + ')'].concat(args));
  };

  this.componentWillReceiveProps = function (props) {
    if (props.node == _this3.props.node) return;
    var Component = props.node.getComponent(props.schema);
    _this3.setState({ Component: Component });
  };

  this.shouldComponentUpdate = function (nextProps) {
    var props = _this3.props;
    var Component = _this3.state.Component;

    var n = nextProps;
    var p = props;

    // If the `Component` has enabled suppression of update checking, always
    // return true so that it can deal with update checking itself.
    if (Component && Component.suppressShouldComponentUpdate) {
      _slateDevLogger2.default.deprecate('2.2.0', 'The `suppressShouldComponentUpdate` property is deprecated because it led to an important performance loss, use `shouldNodeComponentUpdate` instead.');
      return true;
    }

    // If the `Component` has a custom logic to determine whether the component
    // needs to be updated or not, return true if it returns true.
    // If it returns false, we still want to benefit from the
    // performance gain of the rest of the logic.
    if (Component && Component.shouldNodeComponentUpdate) {
      var shouldUpdate = Component.shouldNodeComponentUpdate(p, n);

      if (shouldUpdate) {
        return true;
      }

      if (shouldUpdate === false) {
        _slateDevLogger2.default.warn('Returning false in `shouldNodeComponentUpdate` does not disable Slate\'s internal `shouldComponentUpdate` logic. If you want to prevent updates, use React\'s `shouldComponentUpdate` instead.');
      }
    }

    // If the `readOnly` status has changed, re-render in case there is any
    // user-land logic that depends on it, like nested editable contents.
    if (n.readOnly != p.readOnly) return true;

    // If the node has changed, update. PERF: There are cases where it will have
    // changed, but it's properties will be exactly the same (eg. copy-paste)
    // which this won't catch. But that's rare and not a drag on performance, so
    // for simplicity we just let them through.
    if (n.node != p.node) return true;

    // If the selection state of the node or of some of its children has changed,
    // re-render in case there is any user-land logic depends on it to render.
    // if the node is selected update it, even if it was already selected: the
    // selection state of some of its children could have been changed and they
    // need to be rendered again.
    if (n.isSelected || p.isSelected) return true;

    // Otherwise, don't update.
    return false;
  };

  this.onDragStart = function (e) {
    var node = _this3.props.node;

    // Only void node are draggable

    if (!node.isVoid) {
      return;
    }

    var encoded = _slateBase64Serializer2.default.serializeNode(node, { preserveKeys: true });
    var dataTransfer = e.nativeEvent.dataTransfer;


    (0, _setTransferData2.default)(dataTransfer, _transferTypes2.default.NODE, encoded);

    _this3.debug('onDragStart', e);
  };

  this.renderNode = function (child, isSelected) {
    var _props = _this3.props,
        block = _props.block,
        editor = _props.editor,
        node = _props.node,
        readOnly = _props.readOnly,
        schema = _props.schema,
        state = _props.state;

    var Component = child.kind === 'text' ? _text2.default : Node;
    return _react2.default.createElement(Component, {
      block: node.kind == 'block' ? node : block,
      editor: editor,
      isSelected: isSelected,
      key: child.key,
      node: child,
      parent: node,
      readOnly: readOnly,
      schema: schema,
      state: state
    });
  };
};

exports.default = Node;