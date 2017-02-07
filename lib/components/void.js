'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _leaf = require('./leaf');

var _leaf2 = _interopRequireDefault(_leaf);

var _mark = require('../models/mark');

var _mark2 = _interopRequireDefault(_mark);

var _offsetKey = require('../utils/offset-key');

var _offsetKey2 = _interopRequireDefault(_offsetKey);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _noop = require('../utils/noop');

var _noop2 = _interopRequireDefault(_noop);

var _environment = require('../constants/environment');

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
   * Render.
   *
   * @return {Element}
   */

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

  return Void;
}(_react2.default.Component);

/**
 * Export.
 *
 * @type {Component}
 */

Void.propTypes = {
  children: _react2.default.PropTypes.any.isRequired,
  editor: _react2.default.PropTypes.object.isRequired,
  node: _react2.default.PropTypes.object.isRequired,
  parent: _react2.default.PropTypes.object.isRequired,
  schema: _react2.default.PropTypes.object.isRequired,
  state: _react2.default.PropTypes.object.isRequired
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

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
    event.preventDefault();
    _this2.debug('onClick', { event: event });

    var _props = _this2.props,
        node = _props.node,
        editor = _props.editor;

    var next = editor.getState().transform()
    // COMPAT: In Chrome & Safari, selections that are at the zero offset of
    // an inline node will be automatically replaced to be at the last offset
    // of a previous inline node, which screws us up, so we always want to set
    // it to the end of the node. (2016/11/29)
    .collapseToEndOf(node).focus().apply();

    editor.onChange(next);
  };

  this.render = function () {
    var props = _this2.props;
    var children = props.children,
        node = props.node;

    var Tag = node.kind == 'block' ? 'div' : 'span';

    // Make the outer wrapper relative, so the spacer can overlay it.
    var style = {
      position: 'relative'
    };

    _this2.debug('render', { props: props });

    return _react2.default.createElement(
      Tag,
      { 'data-slate-void': true, style: style, onClick: _this2.onClick },
      _this2.renderSpacer(),
      _react2.default.createElement(
        Tag,
        { contentEditable: false },
        children
      )
    );
  };

  this.renderSpacer = function () {
    var node = _this2.props.node;

    var style = void 0;

    if (node.kind == 'block') {
      style = _environment.IS_FIREFOX ? {
        pointerEvents: 'none',
        width: '0px',
        height: '0px',
        lineHeight: '0px',
        visibility: 'hidden'
      } : {
        position: 'absolute',
        top: '0px',
        left: '-9999px',
        textIndent: '-9999px'
      };
    } else {
      style = {
        position: 'relative',
        top: '0px',
        left: '-9999px',
        textIndent: '-9999px'
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
        node = _props2.node,
        schema = _props2.schema,
        state = _props2.state;

    var child = node.getFirstText();
    var ranges = child.getRanges();
    var text = '';
    var marks = _mark2.default.createSet();
    var index = 0;
    var offsetKey = _offsetKey2.default.stringify({
      key: child.key,
      index: index
    });

    return _react2.default.createElement(_leaf2.default, {
      isVoid: true,
      renderMark: _noop2.default,
      key: offsetKey,
      schema: schema,
      state: state,
      node: child,
      parent: node,
      ranges: ranges,
      index: index,
      text: text,
      marks: marks
    });
  };
};

exports.default = Void;