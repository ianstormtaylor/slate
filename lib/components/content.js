'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _base = require('../serializers/base-64');

var _base2 = _interopRequireDefault(_base);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _node = require('./node');

var _node2 = _interopRequireDefault(_node);

var _offsetKey = require('../utils/offset-key');

var _offsetKey2 = _interopRequireDefault(_offsetKey);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _selection = require('../models/selection');

var _selection2 = _interopRequireDefault(_selection);

var _getTransferData = require('../utils/get-transfer-data');

var _getTransferData2 = _interopRequireDefault(_getTransferData);

var _types = require('../constants/types');

var _types2 = _interopRequireDefault(_types);

var _getWindow = require('get-window');

var _getWindow2 = _interopRequireDefault(_getWindow);

var _keycode = require('keycode');

var _keycode2 = _interopRequireDefault(_keycode);

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

var debug = (0, _debug2.default)('slate:content');

/**
 * Content.
 *
 * @type {Component}
 */

var Content = function (_React$Component) {
  _inherits(Content, _React$Component);

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

  function Content(props) {
    _classCallCheck(this, Content);

    var _this = _possibleConstructorReturn(this, (Content.__proto__ || Object.getPrototypeOf(Content)).call(this, props));

    _initialiseProps.call(_this);

    _this.tmp = {};
    _this.tmp.compositions = 0;
    _this.forces = 0;
    return _this;
  }

  /**
   * Should the component update?
   *
   * @param {Object} props
   * @param {Object} state
   * @return {Boolean}
   */

  /**
   * Default properties.
   *
   * @type {Object}
   */

  /**
   * On update, if the state is blurred now, but was focused before, and the
   * DOM still has a node inside the editor selected, we need to blur it.
   *
   * @param {Object} prevProps
   * @param {Object} prevState
   */

  _createClass(Content, [{
    key: 'getPoint',


    /**
     * Get a point from a native selection's DOM `element` and `offset`.
     *
     * @param {Element} element
     * @param {Number} offset
     * @return {Object}
     */

    value: function getPoint(element, offset) {
      var _props = this.props,
          state = _props.state,
          editor = _props.editor;
      var document = state.document;

      var schema = editor.getSchema();
      var offsetKey = _offsetKey2.default.findKey(element, offset);
      if (!offsetKey) return null;

      var key = offsetKey.key;

      var node = document.getDescendant(key);
      var decorators = document.getDescendantDecorators(key, schema);
      var ranges = node.getRanges(decorators);
      var point = _offsetKey2.default.findPoint(offsetKey, ranges);
      return point;
    }

    /**
     * The React ref method to set the root content element locally.
     *
     * @param {Element} n
     */

    /**
     * Check if an `event` is being fired from within the contenteditable element.
     * This will return false for edits happening in non-contenteditable children,
     * such as void nodes and other nested Slate editors.
     *
     * @param {Event} event
     * @return {Boolean}
     */

    /**
     * On before input, bubble up.
     *
     * @param {Event} event
     */

    /**
     * On blur, update the selection to be not focused.
     *
     * @param {Event} event
     */

    /**
     * On change, bubble up.
     *
     * @param {State} state
     */

    /**
     * On composition start, set the `isComposing` flag.
     *
     * @param {Event} event
     */

    /**
     * On composition end, remove the `isComposing` flag on the next tick. Also
     * increment the `forces` key, which will force the contenteditable element
     * to completely re-render, since IME puts React in an unreconcilable state.
     *
     * @param {Event} event
     */

    /**
     * On copy, defer to `onCutCopy`, then bubble up.
     *
     * @param {Event} event
     */

    /**
     * On cut, defer to `onCutCopy`, then bubble up.
     *
     * @param {Event} event
     */

    /**
     * On drag end, unset the `isDragging` flag.
     *
     * @param {Event} event
     */

    /**
     * On drag over, set the `isDragging` flag and the `isInternalDrag` flag.
     *
     * @param {Event} event
     */

    /**
     * On drag start, set the `isDragging` flag and the `isInternalDrag` flag.
     *
     * @param {Event} event
     */

    /**
     * On drop.
     *
     * @param {Event} event
     */

    /**
     * On input, handle spellcheck and other similar edits that don't go trigger
     * the `onBeforeInput` and instead update the DOM directly.
     *
     * @param {Event} event
     */

    /**
     * On key down, prevent the default behavior of certain commands that will
     * leave the editor in an out-of-sync state, then bubble up.
     *
     * @param {Event} event
     */

    /**
     * On key up, unset the `isShifting` flag.
     *
     * @param {Event} event
     */

    /**
     * On paste, determine the type and bubble up.
     *
     * @param {Event} event
     */

    /**
     * On select, update the current state's selection.
     *
     * @param {Event} event
     */

    /**
     * Render the editor content.
     *
     * @return {Element}
     */

    /**
     * Render a `node`.
     *
     * @param {Node} node
     * @return {Element}
     */

  }]);

  return Content;
}(_react2.default.Component);

/**
 * Export.
 *
 * @type {Component}
 */

Content.propTypes = {
  autoCorrect: _react2.default.PropTypes.bool.isRequired,
  children: _react2.default.PropTypes.array.isRequired,
  className: _react2.default.PropTypes.string,
  editor: _react2.default.PropTypes.object.isRequired,
  onBeforeInput: _react2.default.PropTypes.func.isRequired,
  onBlur: _react2.default.PropTypes.func.isRequired,
  onChange: _react2.default.PropTypes.func.isRequired,
  onCopy: _react2.default.PropTypes.func.isRequired,
  onCut: _react2.default.PropTypes.func.isRequired,
  onDrop: _react2.default.PropTypes.func.isRequired,
  onKeyDown: _react2.default.PropTypes.func.isRequired,
  onPaste: _react2.default.PropTypes.func.isRequired,
  onSelect: _react2.default.PropTypes.func.isRequired,
  readOnly: _react2.default.PropTypes.bool.isRequired,
  role: _react2.default.PropTypes.string,
  schema: _react2.default.PropTypes.object,
  spellCheck: _react2.default.PropTypes.bool.isRequired,
  state: _react2.default.PropTypes.object.isRequired,
  style: _react2.default.PropTypes.object,
  tabIndex: _react2.default.PropTypes.number
};
Content.defaultProps = {
  style: {}
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.shouldComponentUpdate = function (props, state) {
    // If the readOnly state has changed, we need to re-render so that
    // the cursor will be added or removed again.
    if (props.readOnly != _this2.props.readOnly) return true;

    // If the state has been transformed natively, never re-render, or else we
    // will end up duplicating content.
    if (props.state.isNative) return false;

    return props.className != _this2.props.className || props.schema != _this2.props.schema || props.autoCorrect != _this2.props.autoCorrect || props.spellCheck != _this2.props.spellCheck || props.state != _this2.props.state || props.style != _this2.props.style;
  };

  this.componentDidUpdate = function (prevProps, prevState) {
    if (_this2.props.state.isBlurred && prevProps.state.isFocused) {
      var el = _reactDom2.default.findDOMNode(_this2);
      var window = (0, _getWindow2.default)(el);
      var native = window.getSelection();
      if (!el.contains(native.anchorNode)) return;
      native.removeAllRanges();
      el.blur();
    }
  };

  this.ref = function (element) {
    _this2.element = element;
  };

  this.isInContentEditable = function (event) {
    var element = _this2.element;
    var target = event.target;

    return target.isContentEditable && (target === element || target.closest('[data-slate-editor]') === element);
  };

  this.onBeforeInput = function (event) {
    if (_this2.props.readOnly) return;
    if (!_this2.isInContentEditable(event)) return;

    var data = {};

    debug('onBeforeInput', { event: event, data: data });
    _this2.props.onBeforeInput(event, data);
  };

  this.onBlur = function (event) {
    if (_this2.props.readOnly) return;
    if (_this2.tmp.isCopying) return;
    if (!_this2.isInContentEditable(event)) return;

    var data = {};

    debug('onBlur', { event: event, data: data });
    _this2.props.onBlur(event, data);
  };

  this.onChange = function (state) {
    debug('onChange', state);
    _this2.props.onChange(state);
  };

  this.onCompositionStart = function (event) {
    if (!_this2.isInContentEditable(event)) return;

    _this2.tmp.isComposing = true;
    _this2.tmp.compositions++;

    debug('onCompositionStart', { event: event });
  };

  this.onCompositionEnd = function (event) {
    if (!_this2.isInContentEditable(event)) return;

    _this2.forces++;
    var count = _this2.tmp.compositions;

    // The `count` check here ensures that if another composition starts
    // before the timeout has closed out this one, we will abort unsetting the
    // `isComposing` flag, since a composition in still in affect.
    setTimeout(function () {
      if (_this2.tmp.compositions > count) return;
      _this2.tmp.isComposing = false;
    });

    debug('onCompositionEnd', { event: event });
  };

  this.onCopy = function (event) {
    if (!_this2.isInContentEditable(event)) return;
    var window = (0, _getWindow2.default)(event.target);

    _this2.tmp.isCopying = true;
    window.requestAnimationFrame(function () {
      _this2.tmp.isCopying = false;
    });

    var state = _this2.props.state;

    var data = {};
    data.type = 'fragment';
    data.fragment = state.fragment;

    debug('onCopy', { event: event, data: data });
    _this2.props.onCopy(event, data);
  };

  this.onCut = function (event) {
    if (_this2.props.readOnly) return;
    if (!_this2.isInContentEditable(event)) return;
    var window = (0, _getWindow2.default)(event.target);

    _this2.tmp.isCopying = true;
    window.requestAnimationFrame(function () {
      _this2.tmp.isCopying = false;
    });

    var state = _this2.props.state;

    var data = {};
    data.type = 'fragment';
    data.fragment = state.fragment;

    debug('onCut', { event: event, data: data });
    _this2.props.onCut(event, data);
  };

  this.onDragEnd = function (event) {
    if (!_this2.isInContentEditable(event)) return;

    _this2.tmp.isDragging = false;
    _this2.tmp.isInternalDrag = null;

    debug('onDragEnd', { event: event });
  };

  this.onDragOver = function (event) {
    if (!_this2.isInContentEditable(event)) return;

    var dataTransfer = event.nativeEvent.dataTransfer;

    var data = (0, _getTransferData2.default)(dataTransfer);

    // Prevent default when nodes are dragged to allow dropping.
    if (data.type == 'node') {
      event.preventDefault();
    }

    if (_this2.tmp.isDragging) return;
    _this2.tmp.isDragging = true;
    _this2.tmp.isInternalDrag = false;

    debug('onDragOver', { event: event });
  };

  this.onDragStart = function (event) {
    if (!_this2.isInContentEditable(event)) return;

    _this2.tmp.isDragging = true;
    _this2.tmp.isInternalDrag = true;
    var dataTransfer = event.nativeEvent.dataTransfer;

    var data = (0, _getTransferData2.default)(dataTransfer);

    // If it's a node being dragged, the data type is already set.
    if (data.type == 'node') return;

    var state = _this2.props.state;
    var fragment = state.fragment;

    var encoded = _base2.default.serializeNode(fragment);
    dataTransfer.setData(_types2.default.FRAGMENT, encoded);

    debug('onDragStart', { event: event });
  };

  this.onDrop = function (event) {
    if (_this2.props.readOnly) return;
    if (!_this2.isInContentEditable(event)) return;

    event.preventDefault();

    var window = (0, _getWindow2.default)(event.target);
    var state = _this2.props.state;
    var nativeEvent = event.nativeEvent;
    var dataTransfer = nativeEvent.dataTransfer,
        x = nativeEvent.x,
        y = nativeEvent.y;

    var data = (0, _getTransferData2.default)(dataTransfer);

    // Resolve the point where the drop occured.
    var range = void 0;

    // COMPAT: In Firefox, `caretRangeFromPoint` doesn't exist. (2016/07/25)
    if (window.document.caretRangeFromPoint) {
      range = window.document.caretRangeFromPoint(x, y);
    } else {
      range = window.document.createRange();
      range.setStart(nativeEvent.rangeParent, nativeEvent.rangeOffset);
    }

    var _range = range,
        startContainer = _range.startContainer,
        startOffset = _range.startOffset;

    var point = _this2.getPoint(startContainer, startOffset);
    if (!point) return;

    var target = _selection2.default.create({
      anchorKey: point.key,
      anchorOffset: point.offset,
      focusKey: point.key,
      focusOffset: point.offset,
      isFocused: true
    });

    // If the target is inside a void node, abort.
    if (state.document.hasVoidParent(point.key)) return;

    // Add drop-specific information to the data.
    data.target = target;
    data.effect = dataTransfer.dropEffect;

    if (data.type == 'fragment' || data.type == 'node') {
      data.isInternal = _this2.tmp.isInternalDrag;
    }

    debug('onDrop', { event: event, data: data });
    _this2.props.onDrop(event, data);
  };

  this.onInput = function (event) {
    if (_this2.tmp.isComposing) return;
    if (_this2.props.state.isBlurred) return;
    if (!_this2.isInContentEditable(event)) return;
    debug('onInput', { event: event });

    var window = (0, _getWindow2.default)(event.target);

    // Get the selection point.
    var native = window.getSelection();
    var anchorNode = native.anchorNode,
        anchorOffset = native.anchorOffset;

    var point = _this2.getPoint(anchorNode, anchorOffset);
    if (!point) return;

    // Get the range in question.
    var key = point.key,
        index = point.index,
        start = point.start,
        end = point.end;
    var _props2 = _this2.props,
        state = _props2.state,
        editor = _props2.editor;
    var document = state.document,
        selection = state.selection;

    var schema = editor.getSchema();
    var decorators = document.getDescendantDecorators(key, schema);
    var node = document.getDescendant(key);
    var block = document.getClosestBlock(node.key);
    var ranges = node.getRanges(decorators);
    var lastText = block.getLastText();

    // Get the text information.
    var textContent = anchorNode.textContent;

    var lastChar = textContent.charAt(textContent.length - 1);
    var isLastText = node == lastText;
    var isLastRange = index == ranges.size - 1;

    // If we're dealing with the last leaf, and the DOM text ends in a new line,
    // we will have added another new line in <Leaf>'s render method to account
    // for browsers collapsing a single trailing new lines, so remove it.
    if (isLastText && isLastRange && lastChar == '\n') {
      textContent = textContent.slice(0, -1);
    }

    // If the text is no different, abort.
    var range = ranges.get(index);
    var text = range.text,
        marks = range.marks;

    if (textContent == text) return;

    // Determine what the selection should be after changing the text.
    var delta = textContent.length - text.length;
    var after = selection.collapseToEnd().moveForward(delta);

    // Create an updated state with the text replaced.
    var next = state.transform().moveTo({
      anchorKey: key,
      anchorOffset: start,
      focusKey: key,
      focusOffset: end
    }).delete().insertText(textContent, marks).moveTo(after).apply();

    // Change the current state.
    _this2.onChange(next);
  };

  this.onKeyDown = function (event) {
    if (_this2.props.readOnly) return;
    if (!_this2.isInContentEditable(event)) return;

    var altKey = event.altKey,
        ctrlKey = event.ctrlKey,
        metaKey = event.metaKey,
        shiftKey = event.shiftKey,
        which = event.which;

    var key = (0, _keycode2.default)(which);
    var data = {};

    // Keep track of an `isShifting` flag, because it's often used to trigger
    // "Paste and Match Style" commands, but isn't available on the event in a
    // normal paste event.
    if (key == 'shift') {
      _this2.tmp.isShifting = true;
    }

    // When composing, these characters commit the composition but also move the
    // selection before we're able to handle it, so prevent their default,
    // selection-moving behavior.
    if (_this2.tmp.isComposing && (key == 'left' || key == 'right' || key == 'up' || key == 'down')) {
      event.preventDefault();
      return;
    }

    // Add helpful properties for handling hotkeys to the data object.
    data.code = which;
    data.key = key;
    data.isAlt = altKey;
    data.isCmd = _environment.IS_MAC ? metaKey && !altKey : false;
    data.isCtrl = ctrlKey && !altKey;
    data.isLine = _environment.IS_MAC ? metaKey : false;
    data.isMeta = metaKey;
    data.isMod = _environment.IS_MAC ? metaKey && !altKey : ctrlKey && !altKey;
    data.isModAlt = _environment.IS_MAC ? metaKey && altKey : ctrlKey && altKey;
    data.isShift = shiftKey;
    data.isWord = _environment.IS_MAC ? altKey : ctrlKey;

    // These key commands have native behavior in contenteditable elements which
    // will cause our state to be out of sync, so prevent them.
    if (key == 'enter' || key == 'backspace' || key == 'delete' || key == 'b' && data.isMod || key == 'i' && data.isMod || key == 'y' && data.isMod || key == 'z' && data.isMod) {
      event.preventDefault();
    }

    debug('onKeyDown', { event: event, data: data });
    _this2.props.onKeyDown(event, data);
  };

  this.onKeyUp = function (event) {
    var which = event.which;

    var key = (0, _keycode2.default)(which);

    if (key == 'shift') {
      _this2.tmp.isShifting = false;
    }
  };

  this.onPaste = function (event) {
    if (_this2.props.readOnly) return;
    if (!_this2.isInContentEditable(event)) return;

    event.preventDefault();
    var data = (0, _getTransferData2.default)(event.clipboardData);

    // Attach the `isShift` flag, so that people can use it to trigger "Paste
    // and Match Style" logic.
    data.isShift = !!_this2.tmp.isShifting;

    debug('onPaste', { event: event, data: data });
    _this2.props.onPaste(event, data);
  };

  this.onSelect = function (event) {
    if (_this2.props.readOnly) return;
    if (_this2.tmp.isCopying) return;
    if (_this2.tmp.isComposing) return;
    if (!_this2.isInContentEditable(event)) return;

    var window = (0, _getWindow2.default)(event.target);
    var state = _this2.props.state;
    var document = state.document,
        selection = state.selection;

    var native = window.getSelection();
    var data = {};

    // If there are no ranges, the editor was blurred natively.
    if (!native.rangeCount) {
      data.selection = selection.merge({ isFocused: false });
      data.isNative = true;
    }

    // Otherwise, determine the Slate selection from the native one.
    else {
        var anchorNode = native.anchorNode,
            anchorOffset = native.anchorOffset,
            focusNode = native.focusNode,
            focusOffset = native.focusOffset;

        var anchor = _this2.getPoint(anchorNode, anchorOffset);
        var focus = _this2.getPoint(focusNode, focusOffset);
        if (!anchor || !focus) return;

        // There are valid situations where a select event will fire when we're
        // already at that position (for example when entering a character), since
        // our `insertText` transform already updates the selection. In those
        // cases we can safely ignore the event.
        if (anchor.key == selection.anchorKey && anchor.offset == selection.anchorOffset && focus.key == selection.focusKey && focus.offset == selection.focusOffset && selection.isFocused) {
          return;
        }

        var properties = {
          anchorKey: anchor.key,
          anchorOffset: anchor.offset,
          focusKey: focus.key,
          focusOffset: focus.offset,
          isFocused: true,
          isBackward: null
        };

        // If the selection is at the end of a non-void inline node, and there is
        // a node after it, put it in the node after instead.
        var anchorText = document.getNode(anchor.key);
        var focusText = document.getNode(focus.key);
        var anchorInline = document.getClosestInline(anchor.key);
        var focusInline = document.getClosestInline(focus.key);

        if (anchorInline && anchorInline.isVoid && anchor.offset == anchorText.length) {
          var block = document.getClosestBlock(anchor.key);
          var next = block.getNextText(anchor.key);
          if (next) {
            properties.anchorKey = next.key;
            properties.anchorOffset = 0;
          }
        }

        if (focusInline && focusInline.isVoid && focus.offset == focusText.length) {
          var _block = document.getClosestBlock(focus.key);
          var _next = _block.getNextText(focus.key);
          if (_next) {
            properties.focusKey = _next.key;
            properties.focusOffset = 0;
          }
        }

        data.selection = selection.merge(properties).normalize(document);
      }

    debug('onSelect', { event: event, data: data });
    _this2.props.onSelect(event, data);
  };

  this.render = function () {
    var props = _this2.props;
    var className = props.className,
        readOnly = props.readOnly,
        state = props.state,
        tabIndex = props.tabIndex,
        role = props.role;
    var document = state.document;

    var children = document.nodes.map(function (node) {
      return _this2.renderNode(node);
    }).toArray();

    var style = _extends({
      // Prevent the default outline styles.
      outline: 'none',
      // Preserve adjacent whitespace and new lines.
      whiteSpace: 'pre-wrap',
      // Allow words to break if they are too long.
      wordWrap: 'break-word'
    }, readOnly ? {} : { WebkitUserModify: 'read-write-plaintext-only' }, props.style);

    // COMPAT: In Firefox, spellchecking can remove entire wrapping elements
    // including inline ones like `<a>`, which is jarring for the user but also
    // causes the DOM to get into an irreconcilable state. (2016/09/01)
    var spellCheck = _environment.IS_FIREFOX ? false : props.spellCheck;

    debug('render', { props: props });

    return _react2.default.createElement(
      'div',
      {
        'data-slate-editor': true,
        key: _this2.forces,
        ref: _this2.ref,
        contentEditable: !readOnly,
        suppressContentEditableWarning: true,
        className: className,
        onBeforeInput: _this2.onBeforeInput,
        onBlur: _this2.onBlur,
        onCompositionEnd: _this2.onCompositionEnd,
        onCompositionStart: _this2.onCompositionStart,
        onCopy: _this2.onCopy,
        onCut: _this2.onCut,
        onDragEnd: _this2.onDragEnd,
        onDragOver: _this2.onDragOver,
        onDragStart: _this2.onDragStart,
        onDrop: _this2.onDrop,
        onInput: _this2.onInput,
        onKeyDown: _this2.onKeyDown,
        onKeyUp: _this2.onKeyUp,
        onPaste: _this2.onPaste,
        onSelect: _this2.onSelect,
        autoCorrect: props.autoCorrect,
        spellCheck: spellCheck,
        style: style,
        role: readOnly ? null : role || 'textbox',
        tabIndex: tabIndex
      },
      children,
      _this2.props.children
    );
  };

  this.renderNode = function (node) {
    var _props3 = _this2.props,
        editor = _props3.editor,
        readOnly = _props3.readOnly,
        schema = _props3.schema,
        state = _props3.state;


    return _react2.default.createElement(_node2.default, {
      key: node.key,
      node: node,
      parent: state.document,
      schema: schema,
      state: state,
      editor: editor,
      readOnly: readOnly
    });
  };
};

exports.default = Content;