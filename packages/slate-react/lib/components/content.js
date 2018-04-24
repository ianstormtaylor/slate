'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slateBase64Serializer = require('slate-base64-serializer');

var _slateBase64Serializer2 = _interopRequireDefault(_slateBase64Serializer);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _slatePropTypes = require('slate-prop-types');

var _slatePropTypes2 = _interopRequireDefault(_slatePropTypes);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _getWindow = require('get-window');

var _getWindow2 = _interopRequireDefault(_getWindow);

var _keycode = require('keycode');

var _keycode2 = _interopRequireDefault(_keycode);

var _slate = require('slate');

var _transferTypes = require('../constants/transfer-types');

var _transferTypes2 = _interopRequireDefault(_transferTypes);

var _node = require('./node');

var _node2 = _interopRequireDefault(_node);

var _extendSelection = require('../utils/extend-selection');

var _extendSelection2 = _interopRequireDefault(_extendSelection);

var _findClosestNode = require('../utils/find-closest-node');

var _findClosestNode2 = _interopRequireDefault(_findClosestNode);

var _getCaretPosition = require('../utils/get-caret-position');

var _getCaretPosition2 = _interopRequireDefault(_getCaretPosition);

var _getHtmlFromNativePaste = require('../utils/get-html-from-native-paste');

var _getHtmlFromNativePaste2 = _interopRequireDefault(_getHtmlFromNativePaste);

var _getPoint = require('../utils/get-point');

var _getPoint2 = _interopRequireDefault(_getPoint);

var _getTransferData = require('../utils/get-transfer-data');

var _getTransferData2 = _interopRequireDefault(_getTransferData);

var _setTransferData = require('../utils/set-transfer-data');

var _setTransferData2 = _interopRequireDefault(_setTransferData);

var _scrollToSelection = require('../utils/scroll-to-selection');

var _scrollToSelection2 = _interopRequireDefault(_scrollToSelection);

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

    _this.componentDidMount = function () {
      _this.updateSelection();

      if (_this.props.autoFocus) {
        _this.element.focus();
      }
    };

    _this.componentDidUpdate = function () {
      _this.updateSelection();
    };

    _this.updateSelection = function () {
      var _this$props = _this.props,
          editor = _this$props.editor,
          state = _this$props.state;
      var selection = state.selection;

      var window = (0, _getWindow2.default)(_this.element);
      var native = window.getSelection();

      // If both selections are blurred, do nothing.
      if (!native.rangeCount && selection.isBlurred) return;

      // If the selection has been blurred, but is still inside the editor in the
      // DOM, blur it manually.
      if (selection.isBlurred) {
        if (!_this.isInEditor(native.anchorNode)) return;
        native.removeAllRanges();
        _this.element.blur();
        debug('updateSelection', { selection: selection, native: native });
        return;
      }

      // If the selection isn't set, do nothing.
      if (selection.isUnset) return;

      // Otherwise, figure out which DOM nodes should be selected...
      var anchorKey = selection.anchorKey,
          anchorOffset = selection.anchorOffset,
          focusKey = selection.focusKey,
          focusOffset = selection.focusOffset,
          isCollapsed = selection.isCollapsed;

      var anchor = (0, _getCaretPosition2.default)(anchorKey, anchorOffset, state, editor, _this.element);
      var focus = isCollapsed ? anchor : (0, _getCaretPosition2.default)(focusKey, focusOffset, state, editor, _this.element);

      // If they are already selected, do nothing.
      if (anchor.node == native.anchorNode && anchor.offset == native.anchorOffset && focus.node == native.focusNode && focus.offset == native.focusOffset) {
        return;
      }

      // Otherwise, set the `isSelecting` flag and update the selection.
      _this.tmp.isSelecting = true;
      native.removeAllRanges();
      var range = window.document.createRange();
      range.setStart(anchor.node, anchor.offset);
      native.addRange(range);
      if (!isCollapsed) (0, _extendSelection2.default)(native, focus.node, focus.offset);

      (0, _scrollToSelection2.default)(native);

      // Then unset the `isSelecting` flag after a delay.
      setTimeout(function () {
        // COMPAT: In Firefox, it's not enough to create a range, you also need to
        // focus the contenteditable element too. (2016/11/16)
        if (_environment.IS_FIREFOX) _this.element.focus();
        _this.tmp.isSelecting = false;
      });

      debug('updateSelection', { selection: selection, native: native });
    };

    _this.ref = function (element) {
      _this.element = element;
    };

    _this.isInEditor = function (target) {
      var element = _this.element;
      // COMPAT: Text nodes don't have `isContentEditable` property. So, when
      // `target` is a text node use its parent node for check.

      var el = target.nodeType === 3 ? target.parentNode : target;
      return el.isContentEditable && (el === element || (0, _findClosestNode2.default)(el, '[data-slate-editor]') === element);
    };

    _this.onBeforeInput = function (event) {
      if (_this.props.readOnly) return;
      if (!_this.isInEditor(event.target)) return;

      var data = {};

      debug('onBeforeInput', { event: event, data: data });
      _this.props.onBeforeInput(event, data);
    };

    _this.onBlur = function (event) {
      if (_this.props.readOnly) return;
      if (_this.tmp.isCopying) return;
      if (!_this.isInEditor(event.target)) return;

      // If the active element is still the editor, the blur event is due to the
      // window itself being blurred (eg. when changing tabs) so we should ignore
      // the event, since we want to maintain focus when returning.
      var window = (0, _getWindow2.default)(_this.element);
      if (window.document.activeElement == _this.element) return;

      var data = {};

      debug('onBlur', { event: event, data: data });
      _this.props.onBlur(event, data);
    };

    _this.onFocus = function (event) {
      if (_this.props.readOnly) return;
      if (_this.tmp.isCopying) return;
      if (!_this.isInEditor(event.target)) return;

      // COMPAT: If the editor has nested editable elements, the focus can go to
      // those elements. In Firefox, this must be prevented because it results in
      // issues with keyboard navigation. (2017/03/30)
      if (_environment.IS_FIREFOX && event.target != _this.element) {
        _this.element.focus();
        return;
      }

      var data = {};

      debug('onFocus', { event: event, data: data });
      _this.props.onFocus(event, data);
    };

    _this.onCompositionStart = function (event) {
      if (!_this.isInEditor(event.target)) return;

      _this.tmp.isComposing = true;
      _this.tmp.compositions++;

      debug('onCompositionStart', { event: event });
    };

    _this.onCompositionEnd = function (event) {
      if (!_this.isInEditor(event.target)) return;

      _this.tmp.forces++;
      var count = _this.tmp.compositions;

      // The `count` check here ensures that if another composition starts
      // before the timeout has closed out this one, we will abort unsetting the
      // `isComposing` flag, since a composition in still in affect.
      setTimeout(function () {
        if (_this.tmp.compositions > count) return;
        _this.tmp.isComposing = false;
      });

      debug('onCompositionEnd', { event: event });
    };

    _this.onCopy = function (event) {
      if (!_this.isInEditor(event.target)) return;
      var window = (0, _getWindow2.default)(event.target);

      _this.tmp.isCopying = true;
      window.requestAnimationFrame(function () {
        _this.tmp.isCopying = false;
      });

      var state = _this.props.state;

      var data = {};
      data.type = 'fragment';
      data.fragment = state.fragment;

      debug('onCopy', { event: event, data: data });
      _this.props.onCopy(event, data);
    };

    _this.onCut = function (event) {
      if (_this.props.readOnly) return;
      if (!_this.isInEditor(event.target)) return;
      var window = (0, _getWindow2.default)(event.target);

      _this.tmp.isCopying = true;
      window.requestAnimationFrame(function () {
        _this.tmp.isCopying = false;
      });

      var state = _this.props.state;

      var data = {};
      data.type = 'fragment';
      data.fragment = state.fragment;

      debug('onCut', { event: event, data: data });
      _this.props.onCut(event, data);
    };

    _this.onDragEnd = function (event) {
      if (!_this.isInEditor(event.target)) return;

      _this.tmp.isDragging = false;
      _this.tmp.isInternalDrag = null;

      debug('onDragEnd', { event: event });
    };

    _this.onDragOver = function (event) {
      if (!_this.isInEditor(event.target)) return;
      if (_this.tmp.isDragging) return;
      _this.tmp.isDragging = true;
      _this.tmp.isInternalDrag = false;

      debug('onDragOver', { event: event });
    };

    _this.onDragStart = function (event) {
      if (!_this.isInEditor(event.target)) return;

      _this.tmp.isDragging = true;
      _this.tmp.isInternalDrag = true;
      var dataTransfer = event.nativeEvent.dataTransfer;

      var data = (0, _getTransferData2.default)(dataTransfer);

      // If it's a node being dragged, the data type is already set.
      if (data.type == 'node') return;

      var state = _this.props.state;
      var fragment = state.fragment;

      var encoded = _slateBase64Serializer2.default.serializeNode(fragment);

      (0, _setTransferData2.default)(dataTransfer, _transferTypes2.default.FRAGMENT, encoded);

      debug('onDragStart', { event: event });
    };

    _this.onDrop = function (event) {
      event.preventDefault();

      if (_this.props.readOnly) return;
      if (!_this.isInEditor(event.target)) return;

      var window = (0, _getWindow2.default)(event.target);
      var _this$props2 = _this.props,
          state = _this$props2.state,
          editor = _this$props2.editor;
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

      var point = (0, _getPoint2.default)(startContainer, startOffset, state, editor);
      if (!point) return;

      var target = _slate.Selection.create({
        anchorKey: point.key,
        anchorOffset: point.offset,
        focusKey: point.key,
        focusOffset: point.offset,
        isFocused: true
      });

      // Add drop-specific information to the data.
      data.target = target;

      // COMPAT: Edge throws "Permission denied" errors when
      // accessing `dropEffect` or `effectAllowed` (2017/7/12)
      try {
        data.effect = dataTransfer.dropEffect;
      } catch (err) {
        data.effect = null;
      }

      if (data.type == 'fragment' || data.type == 'node') {
        data.isInternal = _this.tmp.isInternalDrag;
      }

      debug('onDrop', { event: event, data: data });
      _this.props.onDrop(event, data);
    };

    _this.onInput = function (event) {
      if (_this.tmp.isComposing) return;
      if (_this.props.state.isBlurred) return;
      if (!_this.isInEditor(event.target)) return;
      debug('onInput', { event: event });

      var window = (0, _getWindow2.default)(event.target);
      var _this$props3 = _this.props,
          state = _this$props3.state,
          editor = _this$props3.editor;

      // Get the selection point.

      var native = window.getSelection();
      var anchorNode = native.anchorNode,
          anchorOffset = native.anchorOffset;

      var point = (0, _getPoint2.default)(anchorNode, anchorOffset, state, editor);
      if (!point) return;

      // Get the range in question.
      var key = point.key,
          index = point.index,
          start = point.start,
          end = point.end;
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
      var after = selection.collapseToEnd().move(delta);

      // Change the current state to have the text replaced.
      editor.change(function (change) {
        change.select({
          anchorKey: key,
          anchorOffset: start,
          focusKey: key,
          focusOffset: end
        }).delete().insertText(textContent, marks).select(after);
      });
    };

    _this.onKeyDown = function (event) {
      if (_this.props.readOnly) return;
      if (!_this.isInEditor(event.target)) return;

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
        _this.tmp.isShifting = true;
      }

      // When composing, these characters commit the composition but also move the
      // selection before we're able to handle it, so prevent their default,
      // selection-moving behavior.
      if (_this.tmp.isComposing && (key == 'left' || key == 'right' || key == 'up' || key == 'down')) {
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
      _this.props.onKeyDown(event, data);
    };

    _this.onKeyUp = function (event) {
      var altKey = event.altKey,
          ctrlKey = event.ctrlKey,
          metaKey = event.metaKey,
          shiftKey = event.shiftKey,
          which = event.which;

      var key = (0, _keycode2.default)(which);
      var data = {};

      if (key == 'shift') {
        _this.tmp.isShifting = false;
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

      debug('onKeyUp', { event: event, data: data });
      _this.props.onKeyUp(event, data);
    };

    _this.onPaste = function (event) {
      if (_this.props.readOnly) return;
      if (!_this.isInEditor(event.target)) return;

      var data = (0, _getTransferData2.default)(event.clipboardData);

      // Attach the `isShift` flag, so that people can use it to trigger "Paste
      // and Match Style" logic.
      data.isShift = !!_this.tmp.isShifting;
      debug('onPaste', { event: event, data: data });

      // COMPAT: In IE 11, only plain text can be retrieved from the event's
      // `clipboardData`. To get HTML, use the browser's native paste action which
      // can only be handled synchronously. (2017/06/23)
      if (_environment.IS_IE) {
        // Do not use `event.preventDefault()` as we need the native paste action.
        (0, _getHtmlFromNativePaste2.default)(event.target, function (html) {
          // If pasted HTML can be retreived, it is added to the `data` object,
          // setting the `type` to `html`.
          _this.props.onPaste(event, html === undefined ? data : _extends({}, data, { html: html, type: 'html' }));
        });
      } else {
        event.preventDefault();
        _this.props.onPaste(event, data);
      }
    };

    _this.onSelect = function (event) {
      if (_this.props.readOnly) return;
      if (_this.tmp.isCopying) return;
      if (_this.tmp.isComposing) return;
      if (_this.tmp.isSelecting) return;
      if (!_this.isInEditor(event.target)) return;

      var window = (0, _getWindow2.default)(event.target);
      var _this$props4 = _this.props,
          state = _this$props4.state,
          editor = _this$props4.editor;
      var document = state.document,
          selection = state.selection;

      var native = window.getSelection();
      var data = {};

      // If there are no ranges, the editor was blurred natively.
      if (!native.rangeCount) {
        data.selection = selection.set('isFocused', false);
      }

      // Otherwise, determine the Slate selection from the native one.
      else {
          var anchorNode = native.anchorNode,
              anchorOffset = native.anchorOffset,
              focusNode = native.focusNode,
              focusOffset = native.focusOffset;

          var anchor = (0, _getPoint2.default)(anchorNode, anchorOffset, state, editor);
          var focus = (0, _getPoint2.default)(focusNode, focusOffset, state, editor);
          if (!anchor || !focus) return;

          // There are situations where a select event will fire with a new native
          // selection that resolves to the same internal position. In those cases
          // we don't need to trigger any changes, since our internal model is
          // already up to date, but we do want to update the native selection again
          // to make sure it is in sync.
          if (anchor.key == selection.anchorKey && anchor.offset == selection.anchorOffset && focus.key == selection.focusKey && focus.offset == selection.focusOffset && selection.isFocused) {
            _this.updateSelection();
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

          var anchorText = document.getNode(anchor.key);
          var focusText = document.getNode(focus.key);
          var anchorInline = document.getClosestInline(anchor.key);
          var focusInline = document.getClosestInline(focus.key);
          var focusBlock = document.getClosestBlock(focus.key);
          var anchorBlock = document.getClosestBlock(anchor.key);

          // COMPAT: If the anchor point is at the start of a non-void, and the
          // focus point is inside a void node with an offset that isn't `0`, set
          // the focus offset to `0`. This is due to void nodes <span>'s being
          // positioned off screen, resulting in the offset always being greater
          // than `0`. Since we can't know what it really should be, and since an
          // offset of `0` is less destructive because it creates a hanging
          // selection, go with `0`. (2017/09/07)
          if (anchorBlock && !anchorBlock.isVoid && anchor.offset == 0 && focusBlock && focusBlock.isVoid && focus.offset != 0) {
            properties.focusOffset = 0;
          }

          // COMPAT: If the selection is at the end of a non-void inline node, and
          // there is a node after it, put it in the node after instead. This
          // standardizes the behavior, since it's indistinguishable to the user.
          if (anchorInline && !anchorInline.isVoid && anchor.offset == anchorText.text.length) {
            var block = document.getClosestBlock(anchor.key);
            var next = block.getNextText(anchor.key);
            if (next) {
              properties.anchorKey = next.key;
              properties.anchorOffset = 0;
            }
          }

          if (focusInline && !focusInline.isVoid && focus.offset == focusText.text.length) {
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
      _this.props.onSelect(event, data);
    };

    _this.renderNode = function (child, isSelected) {
      var _this$props5 = _this.props,
          editor = _this$props5.editor,
          readOnly = _this$props5.readOnly,
          schema = _this$props5.schema,
          state = _this$props5.state;
      var document = state.document;

      return _react2.default.createElement(_node2.default, {
        block: null,
        editor: editor,
        isSelected: isSelected,
        key: child.key,
        node: child,
        parent: document,
        readOnly: readOnly,
        schema: schema,
        state: state
      });
    };

    _this.tmp = {};
    _this.tmp.compositions = 0;
    _this.tmp.forces = 0;
    return _this;
  }

  /**
   * When the editor first mounts in the DOM we need to:
   *
   *   - Update the selection, in case it starts focused.
   *   - Focus the editor if `autoFocus` is set.
   */

  /**
   * Default properties.
   *
   * @type {Object}
   */

  /**
   * On update, update the selection.
   */

  /**
   * Update the native DOM selection to reflect the internal model.
   */

  /**
   * The React ref method to set the root content element locally.
   *
   * @param {Element} element
   */

  /**
   * Check if an event `target` is fired from within the contenteditable
   * element. This should be false for edits happening in non-contenteditable
   * children, such as void nodes and other nested Slate editors.
   *
   * @param {Element} target
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
   * On focus, update the selection to be focused.
   *
   * @param {Event} event
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

  _createClass(Content, [{
    key: 'render',


    /**
     * Render the editor content.
     *
     * @return {Element}
     */

    value: function render() {
      var _this2 = this;

      var props = this.props;
      var className = props.className,
          readOnly = props.readOnly,
          state = props.state,
          tabIndex = props.tabIndex,
          role = props.role,
          tagName = props.tagName;

      var Container = tagName;
      var document = state.document,
          selection = state.selection;

      var indexes = document.getSelectionIndexes(selection, selection.isFocused);
      var children = document.nodes.toArray().map(function (child, i) {
        var isSelected = !!indexes && indexes.start <= i && i < indexes.end;
        return _this2.renderNode(child, isSelected);
      });

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
        Container,
        {
          'data-slate-editor': true,
          key: this.tmp.forces,
          ref: this.ref,
          'data-key': document.key,
          contentEditable: !readOnly,
          suppressContentEditableWarning: true,
          className: className,
          onBeforeInput: this.onBeforeInput,
          onBlur: this.onBlur,
          onFocus: this.onFocus,
          onCompositionEnd: this.onCompositionEnd,
          onCompositionStart: this.onCompositionStart,
          onCopy: this.onCopy,
          onCut: this.onCut,
          onDragEnd: this.onDragEnd,
          onDragOver: this.onDragOver,
          onDragStart: this.onDragStart,
          onDrop: this.onDrop,
          onInput: this.onInput,
          onKeyDown: this.onKeyDown,
          onKeyUp: this.onKeyUp,
          onPaste: this.onPaste,
          onSelect: this.onSelect,
          autoCorrect: props.autoCorrect ? 'on' : 'off',
          spellCheck: spellCheck,
          style: style,
          role: readOnly ? null : role || 'textbox',
          tabIndex: tabIndex
          // COMPAT: The Grammarly Chrome extension works by changing the DOM out
          // from under `contenteditable` elements, which leads to weird behaviors
          // so we have to disable it like this. (2017/04/24)
          , 'data-gramm': false
        },
        children,
        this.props.children
      );
    }

    /**
     * Render a `child` node of the document.
     *
     * @param {Node} child
     * @param {Boolean} isSelected
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
  autoCorrect: _propTypes2.default.bool.isRequired,
  autoFocus: _propTypes2.default.bool.isRequired,
  children: _propTypes2.default.array.isRequired,
  className: _propTypes2.default.string,
  editor: _propTypes2.default.object.isRequired,
  onBeforeInput: _propTypes2.default.func.isRequired,
  onBlur: _propTypes2.default.func.isRequired,
  onCopy: _propTypes2.default.func.isRequired,
  onCut: _propTypes2.default.func.isRequired,
  onDrop: _propTypes2.default.func.isRequired,
  onFocus: _propTypes2.default.func.isRequired,
  onKeyDown: _propTypes2.default.func.isRequired,
  onKeyUp: _propTypes2.default.func.isRequired,
  onPaste: _propTypes2.default.func.isRequired,
  onSelect: _propTypes2.default.func.isRequired,
  readOnly: _propTypes2.default.bool.isRequired,
  role: _propTypes2.default.string,
  schema: _slatePropTypes2.default.schema.isRequired,
  spellCheck: _propTypes2.default.bool.isRequired,
  state: _slatePropTypes2.default.state.isRequired,
  style: _propTypes2.default.object,
  tabIndex: _propTypes2.default.number,
  tagName: _propTypes2.default.string
};
Content.defaultProps = {
  style: {},
  tagName: 'div'
};
exports.default = Content;