'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _content = require('./content');

var _content2 = _interopRequireDefault(_content);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _stack = require('../models/stack');

var _stack2 = _interopRequireDefault(_stack);

var _state = require('../models/state');

var _state2 = _interopRequireDefault(_state);

var _noop = require('../utils/noop');

var _noop2 = _interopRequireDefault(_noop);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Debug.
 *
 * @type {Function}
 */

var debug = (0, _debug2.default)('slate:editor');

/**
 * Event handlers to mix in to the editor.
 *
 * @type {Array}
 */

var EVENT_HANDLERS = ['onBeforeInput', 'onBlur', 'onCopy', 'onCut', 'onDrop', 'onKeyDown', 'onPaste', 'onSelect'];

/**
 * Plugin-related properties of the editor.
 *
 * @type {Array}
 */

var PLUGINS_PROPS = [].concat(EVENT_HANDLERS, ['plugins', 'schema']);

/**
 * Editor.
 *
 * @type {Component}
 */

var Editor = function (_React$Component) {
  _inherits(Editor, _React$Component);

  /**
   * When constructed, create a new `Stack` and run `onBeforeChange`.
   *
   * @param {Object} props
   */

  /**
   * Property types.
   *
   * @type {Object}
   */

  function Editor(props) {
    _classCallCheck(this, Editor);

    var _this = _possibleConstructorReturn(this, (Editor.__proto__ || Object.getPrototypeOf(Editor)).call(this, props));

    _initialiseProps.call(_this);

    _this.tmp = {};
    _this.state = {};

    // Create a new `Stack`, omitting the `onChange` property since that has
    // special significance on the editor itself.

    var onChange = props.onChange,
        rest = _objectWithoutProperties(props, ['onChange']); // eslint-disable-line no-unused-vars


    var stack = _stack2.default.create(rest);
    _this.state.stack = stack;

    // Resolve the state, running `onBeforeChange` first.
    var state = stack.onBeforeChange(props.state, _this);
    _this.cacheState(state);
    _this.state.state = state;

    // Create a bound event handler for each event.
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      var _loop = function _loop() {
        var method = _step.value;

        _this[method] = function () {
          var _this$state$stack;

          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          var next = (_this$state$stack = _this.state.stack)[method].apply(_this$state$stack, [_this.state.state, _this].concat(args));
          _this.onChange(next);
        };
      };

      for (var _iterator = EVENT_HANDLERS[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        _loop();
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

    return _this;
  }

  /**
   * When the `props` are updated, create a new `Stack` if necessary, and
   * run `onBeforeChange`.
   *
   * @param {Object} props
   */

  /**
   * Default properties.
   *
   * @type {Object}
   */

  /**
   * Cache a `state` in memory to be able to compare against it later, for
   * things like `onDocumentChange`.
   *
   * @param {State} state
   */

  /**
   * Programmatically blur the editor.
   */

  /**
   * Programmatically focus the editor.
   */

  /**
   * Get the editor's current schema.
   *
   * @return {Schema}
   */

  /**
   * Get the editor's current state.
   *
   * @return {State}
   */

  /**
   * When the `state` changes, pass through plugins, then bubble up.
   *
   * @param {State} state
   */

  /**
   * Render the editor.
   *
   * @return {Element}
   */

  return Editor;
}(_react2.default.Component);

/**
 * Mix in the property types for the event handlers.
 */

Editor.propTypes = {
  className: _react2.default.PropTypes.string,
  onBeforeChange: _react2.default.PropTypes.func,
  onChange: _react2.default.PropTypes.func,
  onDocumentChange: _react2.default.PropTypes.func,
  onSelectionChange: _react2.default.PropTypes.func,
  placeholder: _react2.default.PropTypes.any,
  placeholderClassName: _react2.default.PropTypes.string,
  placeholderStyle: _react2.default.PropTypes.object,
  plugins: _react2.default.PropTypes.array,
  readOnly: _react2.default.PropTypes.bool,
  schema: _react2.default.PropTypes.object,
  spellCheck: _react2.default.PropTypes.bool,
  state: _react2.default.PropTypes.instanceOf(_state2.default).isRequired,
  style: _react2.default.PropTypes.object
};
Editor.defaultProps = {
  onChange: _noop2.default,
  onDocumentChange: _noop2.default,
  onSelectionChange: _noop2.default,
  plugins: [],
  readOnly: false,
  schema: {},
  spellCheck: true
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.componentWillReceiveProps = function (props) {
    var stack = _this2.state.stack;

    // If any plugin-related properties will change, create a new `Stack`.

    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = PLUGINS_PROPS[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var prop = _step3.value;

        if (props[prop] == _this2.props[prop]) continue;

        var onChange = props.onChange,
            rest = _objectWithoutProperties(props, ['onChange']); // eslint-disable-line no-unused-vars


        stack = _stack2.default.create(rest);
        _this2.setState({ stack: stack });
      }

      // Resolve the state, running the before change handler of the stack.
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

    var state = stack.onBeforeChange(props.state, _this2);
    _this2.cacheState(state);
    _this2.setState({ state: state });
  };

  this.cacheState = function (state) {
    _this2.tmp.document = state.document;
    _this2.tmp.selection = state.selection;
  };

  this.blur = function () {
    var state = _this2.state.state.transform().blur().apply();

    _this2.onChange(state);
  };

  this.focus = function () {
    var state = _this2.state.state.transform().focus().apply();

    _this2.onChange(state);
  };

  this.getSchema = function () {
    return _this2.state.stack.schema;
  };

  this.getState = function () {
    return _this2.state.state;
  };

  this.onChange = function (state) {
    if (state == _this2.state.state) return;
    var tmp = _this2.tmp,
        props = _this2.props;
    var stack = _this2.state.stack;
    var onChange = props.onChange,
        onDocumentChange = props.onDocumentChange,
        onSelectionChange = props.onSelectionChange;


    state = stack.onChange(state, _this2);
    onChange(state);
    if (state.document != tmp.document) onDocumentChange(state.document, state);
    if (state.selection != tmp.selection) onSelectionChange(state.selection, state);

    _this2.cacheState(state);
  };

  this.render = function () {
    var props = _this2.props,
        state = _this2.state;

    var handlers = {};

    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = EVENT_HANDLERS[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var property = _step4.value;

        handlers[property] = _this2[property];
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

    debug('render', { props: props, state: state });

    return _react2.default.createElement(_content2.default, _extends({}, handlers, {
      editor: _this2,
      onChange: _this2.onChange,
      schema: _this2.getSchema(),
      state: _this2.getState(),
      className: props.className,
      readOnly: props.readOnly,
      spellCheck: props.spellCheck,
      style: props.style
    }));
  };
};

var _iteratorNormalCompletion2 = true;
var _didIteratorError2 = false;
var _iteratorError2 = undefined;

try {
  for (var _iterator2 = EVENT_HANDLERS[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
    var property = _step2.value;

    Editor.propTypes[property] = _react2.default.PropTypes.func;
  }

  /**
   * Export.
   *
   * @type {Component}
   */
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

exports.default = Editor;