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

var _slate = require('slate');

var _leaf = require('./leaf');

var _leaf2 = _interopRequireDefault(_leaf);

var _offsetKey = require('../utils/offset-key');

var _offsetKey2 = _interopRequireDefault(_offsetKey);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Debug.
 *
 * @type {Function}
 */

var debug = (0, _debug2.default)('slate:void');

/**
 * Void.
 *
 * @type {Component}
 */

var Void = function (_React$Component) {
  _inherits(Void, _React$Component);

  function Void() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Void);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Void.__proto__ || Object.getPrototypeOf(Void)).call.apply(_ref, [this].concat(args))), _this), _initialiseProps.call(_this), _temp), _possibleConstructorReturn(_this, _ret);
  }

  /**
   * Property types.
   *
   * @type {Object}
   */

  /**
   * State
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
   * When one of the wrapper elements it clicked, select the void node.
   *
   * @param {Event} event
   */

  /**
   * Increment counter, and temporarily switch node to editable to allow drop events
   * Counter required as onDragLeave fires when hovering over child elements
   *
   * @param {Event} event
   */

  /**
   * Decrement counter, and if counter 0, then no longer dragging over node
   * and thus switch back to non-editable
   *
   * @param {Event} event
   */

  /**
   * If dropped item onto node, then reset state
   *
   * @param {Event} event
   */

  _createClass(Void, [{
    key: 'render',


    /**
     * Render.
     *
     * @return {Element}
     */

    value: function render() {
      var props = this.props;
      var children = props.children,
          node = props.node;

      var Tag = void 0,
          style = void 0;

      if (node.kind === 'block') {
        Tag = 'div';
        style = {
          display: 'inline-block',
          verticalAlign: 'top',
          width: '100%'
        };
      } else {
        Tag = 'span';
      }

      this.debug('render', { props: props });

      return _react2.default.createElement(
        Tag,
        {
          'data-slate-void': true,
          onClick: this.onClick,
          onDragEnter: this.onDragEnter,
          onDragLeave: this.onDragLeave,
          onDrop: this.onDrop
        },
        this.renderSpacer(),
        _react2.default.createElement(
          Tag,
          { contentEditable: this.state.editable, style: style },
          children
        )
      );
    }

    /**
     * Render a fake spacer leaf, which will catch the cursor when it the void
     * node is navigated to with the arrow keys. Having this spacer there means
     * the browser continues to manage the selection natively, so it keeps track
     * of the right offset when moving across the block.
     *
     * @return {Element}
     */

    /**
     * Render a fake leaf.
     *
     * @return {Element}
     */

  }]);

  return Void;
}(_react2.default.Component);

/**
 * Export.
 *
 * @type {Component}
 */

Void.propTypes = {
  block: _slatePropTypes2.default.block,
  children: _propTypes2.default.any.isRequired,
  editor: _propTypes2.default.object.isRequired,
  node: _slatePropTypes2.default.node.isRequired,
  parent: _slatePropTypes2.default.node.isRequired,
  readOnly: _propTypes2.default.bool.isRequired,
  schema: _slatePropTypes2.default.schema.isRequired,
  state: _slatePropTypes2.default.state.isRequired
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.state = {
    dragCounter: 0,
    editable: false
  };

  this.debug = function (message) {
    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    var node = _this2.props.node;
    var key = node.key,
        type = node.type;

    var id = key + ' (' + type + ')';
    debug.apply(undefined, [message, '' + id].concat(args));
  };

  this.onClick = function (event) {
    if (_this2.props.readOnly) return;

    _this2.debug('onClick', { event: event });

    var _props = _this2.props,
        node = _props.node,
        editor = _props.editor;


    editor.change(function (change) {
      change
      // COMPAT: In Chrome & Safari, selections that are at the zero offset of
      // an inline node will be automatically replaced to be at the last
      // offset of a previous inline node, which screws us up, so we always
      // want to set it to the end of the node. (2016/11/29)
      .collapseToEndOf(node).focus();
    });
  };

  this.onDragEnter = function () {
    _this2.setState(function (prevState) {
      var dragCounter = prevState.dragCounter + 1;
      return { dragCounter: dragCounter, editable: undefined };
    });
  };

  this.onDragLeave = function () {
    _this2.setState(function (prevState) {
      var dragCounter = prevState.dragCounter - 1;
      var editable = dragCounter === 0 ? false : undefined;
      return { dragCounter: dragCounter, editable: editable };
    });
  };

  this.onDrop = function () {
    _this2.setState({ dragCounter: 0, editable: false });
  };

  this.renderSpacer = function () {
    var node = _this2.props.node;

    var style = void 0;

    if (node.kind == 'block') {
      style = {
        display: 'inline-block',
        verticalAlign: 'top',
        width: '0',
        color: 'transparent'
      };
    } else {
      style = {
        color: 'transparent'
      };
    }

    return _react2.default.createElement(
      'span',
      { style: style },
      _this2.renderLeaf()
    );
  };

  this.renderLeaf = function () {
    var _props2 = _this2.props,
        block = _props2.block,
        node = _props2.node,
        schema = _props2.schema,
        state = _props2.state,
        editor = _props2.editor;

    var child = node.getFirstText();
    var ranges = child.getRanges();
    var text = '';
    var offset = 0;
    var marks = _slate.Mark.createSet();
    var index = 0;
    var offsetKey = _offsetKey2.default.stringify({
      key: child.key,
      index: index
    });

    return _react2.default.createElement(_leaf2.default, {
      key: offsetKey,
      block: node.kind == 'block' ? node : block,
      editor: editor,
      index: index,
      marks: marks,
      node: child,
      offset: offset,
      parent: node,
      ranges: ranges,
      schema: schema,
      state: state,
      text: text
    });
  };
};

exports.default = Void;