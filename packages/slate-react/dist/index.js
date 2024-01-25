'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var slate = require('slate');
var getDirection = require('direction');
var debounce = require('lodash/debounce');
var throttle = require('lodash/throttle');
var scrollIntoView = require('scroll-into-view-if-needed');
var isHotkey = require('is-hotkey');
var ReactDOM = require('react-dom');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var getDirection__default = /*#__PURE__*/_interopDefaultLegacy(getDirection);
var debounce__default = /*#__PURE__*/_interopDefaultLegacy(debounce);
var throttle__default = /*#__PURE__*/_interopDefaultLegacy(throttle);
var scrollIntoView__default = /*#__PURE__*/_interopDefaultLegacy(scrollIntoView);
var ReactDOM__default = /*#__PURE__*/_interopDefaultLegacy(ReactDOM);

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var defineProperty = createCommonjsModule(function (module) {
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

module.exports = _defineProperty;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

var _defineProperty = unwrapExports(defineProperty);

var arrayWithHoles = createCommonjsModule(function (module) {
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

module.exports = _arrayWithHoles;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

unwrapExports(arrayWithHoles);

var iterableToArrayLimit = createCommonjsModule(function (module) {
function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

module.exports = _iterableToArrayLimit;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

unwrapExports(iterableToArrayLimit);

var arrayLikeToArray = createCommonjsModule(function (module) {
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

module.exports = _arrayLikeToArray;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

unwrapExports(arrayLikeToArray);

var unsupportedIterableToArray = createCommonjsModule(function (module) {
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}

module.exports = _unsupportedIterableToArray;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

unwrapExports(unsupportedIterableToArray);

var nonIterableRest = createCommonjsModule(function (module) {
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports = _nonIterableRest;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

unwrapExports(nonIterableRest);

var slicedToArray = createCommonjsModule(function (module) {
function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
}

module.exports = _slicedToArray;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

var _slicedToArray = unwrapExports(slicedToArray);

var objectWithoutPropertiesLoose = createCommonjsModule(function (module) {
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

module.exports = _objectWithoutPropertiesLoose;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

unwrapExports(objectWithoutPropertiesLoose);

var objectWithoutProperties = createCommonjsModule(function (module) {
function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = objectWithoutPropertiesLoose(source, excluded);
  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

module.exports = _objectWithoutProperties;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

var _objectWithoutProperties = unwrapExports(objectWithoutProperties);

var IS_REACT_VERSION_17_OR_ABOVE = parseInt(React__default['default'].version.split('.')[0], 10) >= 17;
var IS_IOS = typeof navigator !== 'undefined' && typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
var IS_APPLE = typeof navigator !== 'undefined' && /Mac OS X/.test(navigator.userAgent);
var IS_ANDROID = typeof navigator !== 'undefined' && /Android/.test(navigator.userAgent);
var IS_FIREFOX = typeof navigator !== 'undefined' && /^(?!.*Seamonkey)(?=.*Firefox).*/i.test(navigator.userAgent);
var IS_SAFARI = typeof navigator !== 'undefined' && /Version\/[\d\.]+.*Safari/.test(navigator.userAgent); // "modern" Edge was released at 79.x

var IS_EDGE_LEGACY = typeof navigator !== 'undefined' && /Edge?\/(?:[0-6][0-9]|[0-7][0-8])(?:\.)/i.test(navigator.userAgent);
var IS_CHROME = typeof navigator !== 'undefined' && /Chrome/i.test(navigator.userAgent); // Native `beforeInput` events don't work well with react on Chrome 75
// and older, Chrome 76+ can use `beforeInput` though.

var IS_CHROME_LEGACY = typeof navigator !== 'undefined' && /Chrome?\/(?:[0-7][0-5]|[0-6][0-9])(?:\.)/i.test(navigator.userAgent); // Firefox did not support `beforeInput` until `v87`.

var IS_FIREFOX_LEGACY = typeof navigator !== 'undefined' && /^(?!.*Seamonkey)(?=.*Firefox\/(?:[0-7][0-9]|[0-8][0-6])(?:\.)).*/i.test(navigator.userAgent); // qq browser

var IS_QQBROWSER = typeof navigator !== 'undefined' && /.*QQBrowser/.test(navigator.userAgent); // UC mobile browser

var IS_UC_MOBILE = typeof navigator !== 'undefined' && /.*UCBrowser/.test(navigator.userAgent); // Wechat browser

var IS_WECHATBROWSER = typeof navigator !== 'undefined' && /.*Wechat/.test(navigator.userAgent); // Check if DOM is available as React does internally.
// https://github.com/facebook/react/blob/master/packages/shared/ExecutionEnvironment.js

var CAN_USE_DOM = !!(typeof window !== 'undefined' && typeof window.document !== 'undefined' && typeof window.document.createElement !== 'undefined'); // COMPAT: Firefox/Edge Legacy don't support the `beforeinput` event
// Chrome Legacy doesn't support `beforeinput` correctly

var HAS_BEFORE_INPUT_SUPPORT = !IS_CHROME_LEGACY && !IS_EDGE_LEGACY && // globalThis is undefined in older browsers
typeof globalThis !== 'undefined' && globalThis.InputEvent && // @ts-ignore The `getTargetRanges` property isn't recognized.
typeof globalThis.InputEvent.prototype.getTargetRanges === 'function';

/**
 * Prevent warning on SSR by falling back to useEffect when DOM isn't available
 */

var useIsomorphicLayoutEffect = CAN_USE_DOM ? React.useLayoutEffect : React.useEffect;

/**
 * Leaf content strings.
 */

var String = function String(props) {
  var isLast = props.isLast,
      leaf = props.leaf,
      parent = props.parent,
      text = props.text;
  var editor = useSlateStatic();
  var path = ReactEditor.findPath(editor, text);
  var parentPath = slate.Path.parent(path); // COMPAT: Render text inside void nodes with a zero-width space.
  // So the node can contain selection but the text is not visible.

  if (editor.isVoid(parent)) {
    return /*#__PURE__*/React__default['default'].createElement(ZeroWidthString, {
      length: slate.Node.string(parent).length
    });
  } // COMPAT: If this is the last text node in an empty block, render a zero-
  // width space that will convert into a line break when copying and pasting
  // to support expected plain text.


  if (leaf.text === '' && parent.children[parent.children.length - 1] === text && !editor.isInline(parent) && slate.Editor.string(editor, parentPath) === '') {
    return /*#__PURE__*/React__default['default'].createElement(ZeroWidthString, {
      isLineBreak: true
    });
  } // COMPAT: If the text is empty, it's because it's on the edge of an inline
  // node, so we render a zero-width space so that the selection can be
  // inserted next to it still.


  if (leaf.text === '') {
    return /*#__PURE__*/React__default['default'].createElement(ZeroWidthString, null);
  } // COMPAT: Browsers will collapse trailing new lines at the end of blocks,
  // so we need to add an extra trailing new lines to prevent that.


  if (isLast && leaf.text.slice(-1) === '\n') {
    return /*#__PURE__*/React__default['default'].createElement(TextString, {
      isTrailing: true,
      text: leaf.text
    });
  }

  return /*#__PURE__*/React__default['default'].createElement(TextString, {
    text: leaf.text
  });
};
/**
 * Leaf strings with text in them.
 */


var TextString = function TextString(props) {
  var text = props.text,
      _props$isTrailing = props.isTrailing,
      isTrailing = _props$isTrailing === void 0 ? false : _props$isTrailing;
  var ref = React.useRef(null);

  var getTextContent = function getTextContent() {
    return "".concat(text !== null && text !== void 0 ? text : '').concat(isTrailing ? '\n' : '');
  }; // This is the actual text rendering boundary where we interface with the DOM
  // The text is not rendered as part of the virtual DOM, as since we handle basic character insertions natively,
  // updating the DOM is not a one way dataflow anymore. What we need here is not reconciliation and diffing
  // with previous version of the virtual DOM, but rather diffing with the actual DOM element, and replace the DOM <span> content
  // exactly if and only if its current content does not match our current virtual DOM.
  // Otherwise the DOM TextNode would always be replaced by React as the user types, which interferes with native text features,
  // eg makes native spellcheck opt out from checking the text node.
  // useLayoutEffect: updating our span before browser paint


  useIsomorphicLayoutEffect(function () {
    // null coalescing text to make sure we're not outputing "null" as a string in the extreme case it is nullish at runtime
    var textWithTrailing = getTextContent();

    if (ref.current && ref.current.textContent !== textWithTrailing) {
      ref.current.textContent = textWithTrailing;
    } // intentionally not specifying dependencies, so that this effect runs on every render
    // as this effectively replaces "specifying the text in the virtual DOM under the <span> below" on each render

  }); // Render text content immediately if it's the first-time render
  // Ensure that text content is rendered on server-side rendering

  if (!ref.current) {
    return /*#__PURE__*/React__default['default'].createElement("span", {
      "data-slate-string": true,
      ref: ref
    }, getTextContent());
  } // the span is intentionally same on every render in virtual DOM, actual rendering happens in the layout effect above


  return /*#__PURE__*/React__default['default'].createElement("span", {
    "data-slate-string": true,
    ref: ref
  });
};
/**
 * Leaf strings without text, render as zero-width strings.
 */


var ZeroWidthString = function ZeroWidthString(props) {
  var _props$length = props.length,
      length = _props$length === void 0 ? 0 : _props$length,
      _props$isLineBreak = props.isLineBreak,
      isLineBreak = _props$isLineBreak === void 0 ? false : _props$isLineBreak;
  return /*#__PURE__*/React__default['default'].createElement("span", {
    "data-slate-zero-width": isLineBreak ? 'n' : 'z',
    "data-slate-length": length
  }, "\uFEFF", isLineBreak ? /*#__PURE__*/React__default['default'].createElement("br", null) : null);
};

/**
 * Two weak maps that allow us rebuild a path given a node. They are populated
 * at render time such that after a render occurs we can always backtrack.
 */
var NODE_TO_INDEX = new WeakMap();
var NODE_TO_PARENT = new WeakMap();
/**
 * Weak maps that allow us to go between Slate nodes and DOM nodes. These
 * are used to resolve DOM event-related logic into Slate actions.
 */

var EDITOR_TO_WINDOW = new WeakMap();
var EDITOR_TO_ELEMENT = new WeakMap();
var ELEMENT_TO_NODE = new WeakMap();
var NODE_TO_ELEMENT = new WeakMap();
var NODE_TO_KEY = new WeakMap();
var EDITOR_TO_KEY_TO_ELEMENT = new WeakMap();
/**
 * Weak maps for storing editor-related state.
 */

var IS_READ_ONLY = new WeakMap();
var IS_FOCUSED = new WeakMap();
var IS_COMPOSING = new WeakMap();
var IS_ON_COMPOSITION_END = new WeakMap();
var EDITOR_TO_USER_SELECTION = new WeakMap();
/**
 * Weak maps for saving text on composition stage.
 */

var EDITOR_ON_COMPOSITION_TEXT = new WeakMap();
/**
 * Weak map for associating the context `onChange` context with the plugin.
 */

var EDITOR_TO_ON_CHANGE = new WeakMap();
var NODE_TO_RESTORE_DOM = new WeakMap();
/**
 * Symbols.
 */

var PLACEHOLDER_SYMBOL = Symbol('placeholder');

/**
 * Individual leaves in a text node with unique formatting.
 */

var Leaf = function Leaf(props) {
  var leaf = props.leaf,
      isLast = props.isLast,
      text = props.text,
      parent = props.parent,
      renderPlaceholder = props.renderPlaceholder,
      _props$renderLeaf = props.renderLeaf,
      renderLeaf = _props$renderLeaf === void 0 ? function (props) {
    return /*#__PURE__*/React__default['default'].createElement(DefaultLeaf, Object.assign({}, props));
  } : _props$renderLeaf;
  var placeholderRef = React.useRef(null);
  React.useEffect(function () {
    var placeholderEl = placeholderRef === null || placeholderRef === void 0 ? void 0 : placeholderRef.current;
    var editorEl = document.querySelector('[data-slate-editor="true"]');

    if (!placeholderEl || !editorEl) {
      return;
    }

    editorEl.style.minHeight = "".concat(placeholderEl.clientHeight, "px");
    return function () {
      editorEl.style.minHeight = 'auto';
    };
  }, [placeholderRef, leaf]);
  var children = /*#__PURE__*/React__default['default'].createElement(String, {
    isLast: isLast,
    leaf: leaf,
    parent: parent,
    text: text
  });

  if (leaf[PLACEHOLDER_SYMBOL]) {
    var placeholderProps = {
      children: leaf.placeholder,
      attributes: {
        'data-slate-placeholder': true,
        style: {
          position: 'absolute',
          pointerEvents: 'none',
          width: '100%',
          maxWidth: '100%',
          display: 'block',
          opacity: '0.333',
          userSelect: 'none',
          textDecoration: 'none'
        },
        contentEditable: false,
        ref: placeholderRef
      }
    };
    children = /*#__PURE__*/React__default['default'].createElement(React__default['default'].Fragment, null, renderPlaceholder(placeholderProps), children);
  } // COMPAT: Having the `data-` attributes on these leaf elements ensures that
  // in certain misbehaving browsers they aren't weirdly cloned/destroyed by
  // contenteditable behaviors. (2019/05/08)


  var attributes = {
    'data-slate-leaf': true
  };
  return renderLeaf({
    attributes: attributes,
    children: children,
    leaf: leaf,
    text: text
  });
};

var MemoizedLeaf = /*#__PURE__*/React__default['default'].memo(Leaf, function (prev, next) {
  return next.parent === prev.parent && next.isLast === prev.isLast && next.renderLeaf === prev.renderLeaf && next.renderPlaceholder === prev.renderPlaceholder && next.text === prev.text && slate.Text.equals(next.leaf, prev.leaf) && next.leaf[PLACEHOLDER_SYMBOL] === prev.leaf[PLACEHOLDER_SYMBOL];
});
var DefaultLeaf = function DefaultLeaf(props) {
  var attributes = props.attributes,
      children = props.children;
  return /*#__PURE__*/React__default['default'].createElement("span", Object.assign({}, attributes), children);
};

var _excluded$3 = ["anchor", "focus"],
    _excluded2 = ["anchor", "focus"];
var shallowCompare = function shallowCompare(obj1, obj2) {
  return Object.keys(obj1).length === Object.keys(obj2).length && Object.keys(obj1).every(function (key) {
    return obj2.hasOwnProperty(key) && obj1[key] === obj2[key];
  });
};
/**
 * Check if a list of decorator ranges are equal to another.
 *
 * PERF: this requires the two lists to also have the ranges inside them in the
 * same order, but this is an okay constraint for us since decorations are
 * kept in order, and the odd case where they aren't is okay to re-render for.
 */

var isDecoratorRangeListEqual = function isDecoratorRangeListEqual(list, another) {
  if (list.length !== another.length) {
    return false;
  }

  for (var i = 0; i < list.length; i++) {
    var range = list[i];
    var other = another[i];

    range.anchor;
        range.focus;
        var rangeOwnProps = _objectWithoutProperties(range, _excluded$3);

    other.anchor;
        other.focus;
        var otherOwnProps = _objectWithoutProperties(other, _excluded2);

    if (!slate.Range.equals(range, other) || range[PLACEHOLDER_SYMBOL] !== other[PLACEHOLDER_SYMBOL] || !shallowCompare(rangeOwnProps, otherOwnProps)) {
      return false;
    }
  }

  return true;
};

function useContentKey(node) {
  var contentKeyRef = React.useRef(0);
  var updateAnimationFrameRef = React.useRef(null);

  var _useState = React.useState(0),
      _useState2 = _slicedToArray(_useState, 2),
      setForceRerenderCounter = _useState2[1];

  React.useEffect(function () {
    NODE_TO_RESTORE_DOM.set(node, function () {
      // Update is already queued and node hasn't re-render yet
      if (updateAnimationFrameRef.current) {
        return;
      }

      updateAnimationFrameRef.current = requestAnimationFrame(function () {
        setForceRerenderCounter(function (state) {
          return state + 1;
        });
        updateAnimationFrameRef.current = null;
      });
      contentKeyRef.current++;
    });
    return function () {
      NODE_TO_RESTORE_DOM["delete"](node);
    };
  }, [node]); // Node was restored => clear scheduled update

  if (updateAnimationFrameRef.current) {
    cancelAnimationFrame(updateAnimationFrameRef.current);
    updateAnimationFrameRef.current = null;
  }

  return contentKeyRef.current;
}

/**
 * Text.
 */

var Text = function Text(props) {
  var decorations = props.decorations,
      isLast = props.isLast,
      parent = props.parent,
      renderPlaceholder = props.renderPlaceholder,
      renderLeaf = props.renderLeaf,
      text = props.text;
  var editor = useSlateStatic();
  var ref = React.useRef(null);
  var leaves = slate.Text.decorations(text, decorations);
  var key = ReactEditor.findKey(editor, text);
  var children = [];

  for (var i = 0; i < leaves.length; i++) {
    var leaf = leaves[i];
    children.push( /*#__PURE__*/React__default['default'].createElement(MemoizedLeaf, {
      isLast: isLast && i === leaves.length - 1,
      key: "".concat(key.id, "-").concat(i),
      renderPlaceholder: renderPlaceholder,
      leaf: leaf,
      text: text,
      parent: parent,
      renderLeaf: renderLeaf
    }));
  } // Update element-related weak maps with the DOM element ref.


  useIsomorphicLayoutEffect(function () {
    var KEY_TO_ELEMENT = EDITOR_TO_KEY_TO_ELEMENT.get(editor);

    if (ref.current) {
      KEY_TO_ELEMENT === null || KEY_TO_ELEMENT === void 0 ? void 0 : KEY_TO_ELEMENT.set(key, ref.current);
      NODE_TO_ELEMENT.set(text, ref.current);
      ELEMENT_TO_NODE.set(ref.current, text);
    } else {
      KEY_TO_ELEMENT === null || KEY_TO_ELEMENT === void 0 ? void 0 : KEY_TO_ELEMENT["delete"](key);
      NODE_TO_ELEMENT["delete"](text);
    }
  });
  var contentKey = IS_ANDROID ? useContentKey(text) : undefined;
  return /*#__PURE__*/React__default['default'].createElement("span", {
    "data-slate-node": "text",
    ref: ref,
    key: contentKey
  }, children);
};

var MemoizedText = /*#__PURE__*/React__default['default'].memo(Text, function (prev, next) {
  return next.parent === prev.parent && next.isLast === prev.isLast && next.renderLeaf === prev.renderLeaf && next.text === prev.text && isDecoratorRangeListEqual(next.decorations, prev.decorations);
});

/**
 * Element.
 */

var Element = function Element(props) {
  var decorations = props.decorations,
      element = props.element,
      _props$renderElement = props.renderElement,
      renderElement = _props$renderElement === void 0 ? function (p) {
    return /*#__PURE__*/React__default['default'].createElement(DefaultElement, Object.assign({}, p));
  } : _props$renderElement,
      renderPlaceholder = props.renderPlaceholder,
      renderLeaf = props.renderLeaf,
      selection = props.selection;
  var ref = React.useRef(null);
  var editor = useSlateStatic();
  var readOnly = useReadOnly();
  var isInline = editor.isInline(element);
  var key = ReactEditor.findKey(editor, element);
  var children = useChildren({
    decorations: decorations,
    node: element,
    renderElement: renderElement,
    renderPlaceholder: renderPlaceholder,
    renderLeaf: renderLeaf,
    selection: selection
  }); // Attributes that the developer must mix into the element in their
  // custom node renderer component.

  var attributes = {
    'data-slate-node': 'element',
    ref: ref
  };

  if (isInline) {
    attributes['data-slate-inline'] = true;
  } // If it's a block node with inline children, add the proper `dir` attribute
  // for text direction.


  if (!isInline && slate.Editor.hasInlines(editor, element)) {
    var text = slate.Node.string(element);
    var dir = getDirection__default['default'](text);

    if (dir === 'rtl') {
      attributes.dir = dir;
    }
  } // If it's a void node, wrap the children in extra void-specific elements.


  if (slate.Editor.isVoid(editor, element)) {
    attributes['data-slate-void'] = true;

    if (!readOnly && isInline) {
      attributes.contentEditable = false;
    }

    var Tag = isInline ? 'span' : 'div';

    var _Node$texts = slate.Node.texts(element),
        _Node$texts2 = _slicedToArray(_Node$texts, 1),
        _Node$texts2$ = _slicedToArray(_Node$texts2[0], 1),
        _text = _Node$texts2$[0];

    children = /*#__PURE__*/React__default['default'].createElement(Tag, {
      "data-slate-spacer": true,
      style: {
        height: '0',
        color: 'transparent',
        outline: 'none',
        position: 'absolute'
      }
    }, /*#__PURE__*/React__default['default'].createElement(MemoizedText, {
      renderPlaceholder: renderPlaceholder,
      decorations: [],
      isLast: false,
      parent: element,
      text: _text
    }));
    NODE_TO_INDEX.set(_text, 0);
    NODE_TO_PARENT.set(_text, element);
  } // Update element-related weak maps with the DOM element ref.


  useIsomorphicLayoutEffect(function () {
    var KEY_TO_ELEMENT = EDITOR_TO_KEY_TO_ELEMENT.get(editor);

    if (ref.current) {
      KEY_TO_ELEMENT === null || KEY_TO_ELEMENT === void 0 ? void 0 : KEY_TO_ELEMENT.set(key, ref.current);
      NODE_TO_ELEMENT.set(element, ref.current);
      ELEMENT_TO_NODE.set(ref.current, element);
    } else {
      KEY_TO_ELEMENT === null || KEY_TO_ELEMENT === void 0 ? void 0 : KEY_TO_ELEMENT["delete"](key);
      NODE_TO_ELEMENT["delete"](element);
    }
  });
  var content = renderElement({
    attributes: attributes,
    children: children,
    element: element
  });

  if (IS_ANDROID) {
    var contentKey = useContentKey(element);
    return /*#__PURE__*/React__default['default'].createElement(React.Fragment, {
      key: contentKey
    }, content);
  }

  return content;
};

var MemoizedElement = /*#__PURE__*/React__default['default'].memo(Element, function (prev, next) {
  return prev.element === next.element && prev.renderElement === next.renderElement && prev.renderLeaf === next.renderLeaf && isDecoratorRangeListEqual(prev.decorations, next.decorations) && (prev.selection === next.selection || !!prev.selection && !!next.selection && slate.Range.equals(prev.selection, next.selection));
});
/**
 * The default element renderer.
 */

var DefaultElement = function DefaultElement(props) {
  var attributes = props.attributes,
      children = props.children,
      element = props.element;
  var editor = useSlateStatic();
  var Tag = editor.isInline(element) ? 'span' : 'div';
  return /*#__PURE__*/React__default['default'].createElement(Tag, Object.assign({}, attributes, {
    style: {
      position: 'relative'
    }
  }), children);
};

/**
 * A React context for sharing the editor object.
 */

var EditorContext = /*#__PURE__*/React.createContext(null);
/**
 * Get the current editor object from the React context.
 */

var useSlateStatic = function useSlateStatic() {
  var editor = React.useContext(EditorContext);

  if (!editor) {
    throw new Error("The `useSlateStatic` hook must be used inside the <Slate> component's context.");
  }

  return editor;
};

/**
 * A React context for sharing the `decorate` prop of the editable.
 */

var DecorateContext = /*#__PURE__*/React.createContext(function () {
  return [];
});
/**
 * Get the current `decorate` prop of the editable.
 */

var useDecorate = function useDecorate() {
  return React.useContext(DecorateContext);
};

/**
 * A React context for sharing the `selected` state of an element.
 */

var SelectedContext = /*#__PURE__*/React.createContext(false);
/**
 * Get the current `selected` state of an element.
 */

var useSelected = function useSelected() {
  return React.useContext(SelectedContext);
};

function _createForOfIteratorHelper$3(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$3(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray$3(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$3(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$3(o, minLen); }

function _arrayLikeToArray$3(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
/**
 * Children.
 */

var useChildren = function useChildren(props) {
  var decorations = props.decorations,
      node = props.node,
      renderElement = props.renderElement,
      renderPlaceholder = props.renderPlaceholder,
      renderLeaf = props.renderLeaf,
      selection = props.selection;
  var decorate = useDecorate();
  var editor = useSlateStatic();
  var path = ReactEditor.findPath(editor, node);
  var children = [];
  var isLeafBlock = slate.Element.isElement(node) && !editor.isInline(node) && slate.Editor.hasInlines(editor, node);

  for (var i = 0; i < node.children.length; i++) {
    var p = path.concat(i);
    var n = node.children[i];
    var key = ReactEditor.findKey(editor, n);
    var range = slate.Editor.range(editor, p);
    var sel = selection && slate.Range.intersection(range, selection);
    var ds = decorate([n, p]);

    var _iterator = _createForOfIteratorHelper$3(decorations),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var dec = _step.value;
        var d = slate.Range.intersection(dec, range);

        if (d) {
          ds.push(d);
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    if (slate.Element.isElement(n)) {
      children.push( /*#__PURE__*/React__default['default'].createElement(SelectedContext.Provider, {
        key: "provider-".concat(key.id),
        value: !!sel
      }, /*#__PURE__*/React__default['default'].createElement(MemoizedElement, {
        decorations: ds,
        element: n,
        key: key.id,
        renderElement: renderElement,
        renderPlaceholder: renderPlaceholder,
        renderLeaf: renderLeaf,
        selection: sel
      })));
    } else {
      children.push( /*#__PURE__*/React__default['default'].createElement(MemoizedText, {
        decorations: ds,
        key: key.id,
        isLast: isLeafBlock && i === node.children.length - 1,
        parent: node,
        renderPlaceholder: renderPlaceholder,
        renderLeaf: renderLeaf,
        text: n
      }));
    }

    NODE_TO_INDEX.set(n, i);
    NODE_TO_PARENT.set(n, node);
  }

  return children;
};

/**
 * Hotkey mappings for each platform.
 */

var HOTKEYS = {
  bold: 'mod+b',
  compose: ['down', 'left', 'right', 'up', 'backspace', 'enter'],
  moveBackward: 'left',
  moveForward: 'right',
  moveWordBackward: 'ctrl+left',
  moveWordForward: 'ctrl+right',
  deleteBackward: 'shift?+backspace',
  deleteForward: 'shift?+delete',
  extendBackward: 'shift+left',
  extendForward: 'shift+right',
  italic: 'mod+i',
  insertSoftBreak: 'shift+enter',
  splitBlock: 'enter',
  undo: 'mod+z'
};
var APPLE_HOTKEYS = {
  moveLineBackward: 'opt+up',
  moveLineForward: 'opt+down',
  moveWordBackward: 'opt+left',
  moveWordForward: 'opt+right',
  deleteBackward: ['ctrl+backspace', 'ctrl+h'],
  deleteForward: ['ctrl+delete', 'ctrl+d'],
  deleteLineBackward: 'cmd+shift?+backspace',
  deleteLineForward: ['cmd+shift?+delete', 'ctrl+k'],
  deleteWordBackward: 'opt+shift?+backspace',
  deleteWordForward: 'opt+shift?+delete',
  extendLineBackward: 'opt+shift+up',
  extendLineForward: 'opt+shift+down',
  redo: 'cmd+shift+z',
  transposeCharacter: 'ctrl+t'
};
var WINDOWS_HOTKEYS = {
  deleteWordBackward: 'ctrl+shift?+backspace',
  deleteWordForward: 'ctrl+shift?+delete',
  redo: ['ctrl+y', 'ctrl+shift+z']
};
/**
 * Create a platform-aware hotkey checker.
 */

var create = function create(key) {
  var generic = HOTKEYS[key];
  var apple = APPLE_HOTKEYS[key];
  var windows = WINDOWS_HOTKEYS[key];
  var isGeneric = generic && isHotkey.isKeyHotkey(generic);
  var isApple = apple && isHotkey.isKeyHotkey(apple);
  var isWindows = windows && isHotkey.isKeyHotkey(windows);
  return function (event) {
    if (isGeneric && isGeneric(event)) return true;
    if (IS_APPLE && isApple && isApple(event)) return true;
    if (!IS_APPLE && isWindows && isWindows(event)) return true;
    return false;
  };
};
/**
 * Hotkeys.
 */


var Hotkeys = {
  isBold: create('bold'),
  isCompose: create('compose'),
  isMoveBackward: create('moveBackward'),
  isMoveForward: create('moveForward'),
  isDeleteBackward: create('deleteBackward'),
  isDeleteForward: create('deleteForward'),
  isDeleteLineBackward: create('deleteLineBackward'),
  isDeleteLineForward: create('deleteLineForward'),
  isDeleteWordBackward: create('deleteWordBackward'),
  isDeleteWordForward: create('deleteWordForward'),
  isExtendBackward: create('extendBackward'),
  isExtendForward: create('extendForward'),
  isExtendLineBackward: create('extendLineBackward'),
  isExtendLineForward: create('extendLineForward'),
  isItalic: create('italic'),
  isMoveLineBackward: create('moveLineBackward'),
  isMoveLineForward: create('moveLineForward'),
  isMoveWordBackward: create('moveWordBackward'),
  isMoveWordForward: create('moveWordForward'),
  isRedo: create('redo'),
  isSoftBreak: create('insertSoftBreak'),
  isSplitBlock: create('splitBlock'),
  isTransposeCharacter: create('transposeCharacter'),
  isUndo: create('undo')
};

/**
 * A React context for sharing the `readOnly` state of the editor.
 */

var ReadOnlyContext = /*#__PURE__*/React.createContext(false);
/**
 * Get the current `readOnly` state of the editor.
 */

var useReadOnly = function useReadOnly() {
  return React.useContext(ReadOnlyContext);
};

/**
 * A React context for sharing the editor object, in a way that re-renders the
 * context whenever changes occur.
 */

var SlateContext = /*#__PURE__*/React.createContext(null);
/**
 * Get the current editor object from the React context.
 */

var useSlate = function useSlate() {
  var context = React.useContext(SlateContext);

  if (!context) {
    throw new Error("The `useSlate` hook must be used inside the <Slate> component's context.");
  }

  var _context = _slicedToArray(context, 1),
      editor = _context[0];

  return editor;
};

/**
 * Returns the host window of a DOM node
 */

var getDefaultView = function getDefaultView(value) {
  return value && value.ownerDocument && value.ownerDocument.defaultView || null;
};
/**
 * Check if a DOM node is a comment node.
 */

var isDOMComment = function isDOMComment(value) {
  return isDOMNode(value) && value.nodeType === 8;
};
/**
 * Check if a DOM node is an element node.
 */

var isDOMElement = function isDOMElement(value) {
  return isDOMNode(value) && value.nodeType === 1;
};
/**
 * Check if a value is a DOM node.
 */

var isDOMNode = function isDOMNode(value) {
  var window = getDefaultView(value);
  return !!window && value instanceof window.Node;
};
/**
 * Check if a value is a DOM selection.
 */

var isDOMSelection = function isDOMSelection(value) {
  var window = value && value.anchorNode && getDefaultView(value.anchorNode);
  return !!window && value instanceof window.Selection;
};
/**
 * Check if a DOM node is an element node.
 */

var isDOMText = function isDOMText(value) {
  return isDOMNode(value) && value.nodeType === 3;
};
/**
 * Checks whether a paste event is a plaintext-only event.
 */

var isPlainTextOnlyPaste = function isPlainTextOnlyPaste(event) {
  return event.clipboardData && event.clipboardData.getData('text/plain') !== '' && event.clipboardData.types.length === 1;
};
/**
 * Normalize a DOM point so that it always refers to a text node.
 */

var normalizeDOMPoint = function normalizeDOMPoint(domPoint) {
  var _domPoint = _slicedToArray(domPoint, 2),
      node = _domPoint[0],
      offset = _domPoint[1]; // If it's an element node, its offset refers to the index of its children
  // including comment nodes, so try to find the right text child node.


  if (isDOMElement(node) && node.childNodes.length) {
    var isLast = offset === node.childNodes.length;
    var index = isLast ? offset - 1 : offset;

    var _getEditableChildAndI = getEditableChildAndIndex(node, index, isLast ? 'backward' : 'forward');

    var _getEditableChildAndI2 = _slicedToArray(_getEditableChildAndI, 2);

    node = _getEditableChildAndI2[0];
    index = _getEditableChildAndI2[1];
    // If the editable child found is in front of input offset, we instead seek to its end
    isLast = index < offset; // If the node has children, traverse until we have a leaf node. Leaf nodes
    // can be either text nodes, or other void DOM nodes.

    while (isDOMElement(node) && node.childNodes.length) {
      var i = isLast ? node.childNodes.length - 1 : 0;
      node = getEditableChild(node, i, isLast ? 'backward' : 'forward');
    } // Determine the new offset inside the text node.


    offset = isLast && node.textContent != null ? node.textContent.length : 0;
  } // Return the node and offset.


  return [node, offset];
};
/**
 * Determines wether the active element is nested within a shadowRoot
 */

var hasShadowRoot = function hasShadowRoot() {
  return !!(window.document.activeElement && window.document.activeElement.shadowRoot);
};
/**
 * Get the nearest editable child and index at `index` in a `parent`, preferring
 * `direction`.
 */

var getEditableChildAndIndex = function getEditableChildAndIndex(parent, index, direction) {
  var childNodes = parent.childNodes;
  var child = childNodes[index];
  var i = index;
  var triedForward = false;
  var triedBackward = false; // While the child is a comment node, or an element node with no children,
  // keep iterating to find a sibling non-void, non-comment node.

  while (isDOMComment(child) || isDOMElement(child) && child.childNodes.length === 0 || isDOMElement(child) && child.getAttribute('contenteditable') === 'false') {
    if (triedForward && triedBackward) {
      break;
    }

    if (i >= childNodes.length) {
      triedForward = true;
      i = index - 1;
      direction = 'backward';
      continue;
    }

    if (i < 0) {
      triedBackward = true;
      i = index + 1;
      direction = 'forward';
      continue;
    }

    child = childNodes[i];
    index = i;
    i += direction === 'forward' ? 1 : -1;
  }

  return [child, index];
};
/**
 * Get the nearest editable child at `index` in a `parent`, preferring
 * `direction`.
 */

var getEditableChild = function getEditableChild(parent, index, direction) {
  var _getEditableChildAndI3 = getEditableChildAndIndex(parent, index, direction),
      _getEditableChildAndI4 = _slicedToArray(_getEditableChildAndI3, 1),
      child = _getEditableChildAndI4[0];

  return child;
};
/**
 * Get a plaintext representation of the content of a node, accounting for block
 * elements which get a newline appended.
 *
 * The domNode must be attached to the DOM.
 */

var getPlainText = function getPlainText(domNode) {
  var text = '';

  if (isDOMText(domNode) && domNode.nodeValue) {
    return domNode.nodeValue;
  }

  if (isDOMElement(domNode)) {
    for (var _i = 0, _Array$from = Array.from(domNode.childNodes); _i < _Array$from.length; _i++) {
      var childNode = _Array$from[_i];
      text += getPlainText(childNode);
    }

    var display = getComputedStyle(domNode).getPropertyValue('display');

    if (display === 'block' || display === 'list' || domNode.tagName === 'BR') {
      text += '\n';
    }
  }

  return text;
};
/**
 * Get x-slate-fragment attribute from data-slate-fragment
 */

var catchSlateFragment = /data-slate-fragment="(.+?)"/m;
var getSlateFragmentAttribute = function getSlateFragmentAttribute(dataTransfer) {
  var htmlData = dataTransfer.getData('text/html');

  var _ref = htmlData.match(catchSlateFragment) || [],
      _ref2 = _slicedToArray(_ref, 2),
      fragment = _ref2[1];

  return fragment;
};
/**
 * Get the x-slate-fragment attribute that exist in text/html data
 * and append it to the DataTransfer object
 */

var getClipboardData = function getClipboardData(dataTransfer) {
  if (!dataTransfer.getData('application/x-slate-fragment')) {
    var fragment = getSlateFragmentAttribute(dataTransfer);

    if (fragment) {
      var clipboardData = new DataTransfer();
      dataTransfer.types.forEach(function (type) {
        clipboardData.setData(type, dataTransfer.getData(type));
      });
      clipboardData.setData('application/x-slate-fragment', fragment);
      return clipboardData;
    }
  }

  return dataTransfer;
};

var TRIPLE_CLICK = 3;

var _excluded$2 = ["autoFocus", "decorate", "onDOMBeforeInput", "placeholder", "readOnly", "renderElement", "renderLeaf", "renderPlaceholder", "scrollSelectionIntoView", "style", "as"];

function _createForOfIteratorHelper$2(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$2(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray$2(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$2(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$2(o, minLen); }

function _arrayLikeToArray$2(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var Children = function Children(props) {
  return /*#__PURE__*/React__default['default'].createElement(React__default['default'].Fragment, null, useChildren(props));
};
/**
 * Editable.
 */


var Editable$1 = function Editable(props) {
  var autoFocus = props.autoFocus,
      _props$decorate = props.decorate,
      decorate = _props$decorate === void 0 ? defaultDecorate : _props$decorate,
      propsOnDOMBeforeInput = props.onDOMBeforeInput,
      placeholder = props.placeholder,
      _props$readOnly = props.readOnly,
      readOnly = _props$readOnly === void 0 ? false : _props$readOnly,
      renderElement = props.renderElement,
      renderLeaf = props.renderLeaf,
      _props$renderPlacehol = props.renderPlaceholder,
      renderPlaceholder = _props$renderPlacehol === void 0 ? function (props) {
    return /*#__PURE__*/React__default['default'].createElement(DefaultPlaceholder, Object.assign({}, props));
  } : _props$renderPlacehol,
      _props$scrollSelectio = props.scrollSelectionIntoView,
      scrollSelectionIntoView = _props$scrollSelectio === void 0 ? defaultScrollSelectionIntoView : _props$scrollSelectio,
      _props$style = props.style,
      style = _props$style === void 0 ? {} : _props$style,
      _props$as = props.as,
      Component = _props$as === void 0 ? 'div' : _props$as,
      attributes = _objectWithoutProperties(props, _excluded$2);

  var editor = useSlate(); // Rerender editor when composition status changed

  var _useState = React.useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      isComposing = _useState2[0],
      setIsComposing = _useState2[1];

  var ref = React.useRef(null);
  var deferredOperations = React.useRef([]); // Update internal state on each render.

  IS_READ_ONLY.set(editor, readOnly); // Keep track of some state for the event handler logic.

  var state = React.useMemo(function () {
    return {
      hasInsertPrefixInCompositon: false,
      isDraggingInternally: false,
      isUpdatingSelection: false,
      latestElement: null
    };
  }, []); // Whenever the editor updates...

  useIsomorphicLayoutEffect(function () {
    // Update element-related weak maps with the DOM element ref.
    var window;

    if (ref.current && (window = getDefaultView(ref.current))) {
      EDITOR_TO_WINDOW.set(editor, window);
      EDITOR_TO_ELEMENT.set(editor, ref.current);
      NODE_TO_ELEMENT.set(editor, ref.current);
      ELEMENT_TO_NODE.set(ref.current, editor);
    } else {
      NODE_TO_ELEMENT["delete"](editor);
    } // Make sure the DOM selection state is in sync.


    var selection = editor.selection;
    var root = ReactEditor.findDocumentOrShadowRoot(editor);
    var domSelection = root.getSelection();

    if (ReactEditor.isComposing(editor) || !domSelection || !ReactEditor.isFocused(editor)) {
      return;
    }

    var hasDomSelection = domSelection.type !== 'None'; // If the DOM selection is properly unset, we're done.

    if (!selection && !hasDomSelection) {
      return;
    } // verify that the dom selection is in the editor


    var editorElement = EDITOR_TO_ELEMENT.get(editor);
    var hasDomSelectionInEditor = false;

    if (editorElement.contains(domSelection.anchorNode) && editorElement.contains(domSelection.focusNode)) {
      hasDomSelectionInEditor = true;
    } // If the DOM selection is in the editor and the editor selection is already correct, we're done.


    if (hasDomSelection && hasDomSelectionInEditor && selection) {
      var slateRange = ReactEditor.toSlateRange(editor, domSelection, {
        exactMatch: true,
        // domSelection is not necessarily a valid Slate range
        // (e.g. when clicking on contentEditable:false element)
        suppressThrow: true
      });

      if (slateRange && slate.Range.equals(slateRange, selection)) {
        return;
      }
    } // when <Editable/> is being controlled through external value
    // then its children might just change - DOM responds to it on its own
    // but Slate's value is not being updated through any operation
    // and thus it doesn't transform selection on its own


    if (selection && !ReactEditor.hasRange(editor, selection)) {
      editor.selection = ReactEditor.toSlateRange(editor, domSelection, {
        exactMatch: false,
        suppressThrow: false
      });
      return;
    } // Otherwise the DOM selection is out of sync, so update it.


    state.isUpdatingSelection = true;
    var newDomRange = selection && ReactEditor.toDOMRange(editor, selection);

    if (newDomRange) {
      if (slate.Range.isBackward(selection)) {
        domSelection.setBaseAndExtent(newDomRange.endContainer, newDomRange.endOffset, newDomRange.startContainer, newDomRange.startOffset);
      } else {
        domSelection.setBaseAndExtent(newDomRange.startContainer, newDomRange.startOffset, newDomRange.endContainer, newDomRange.endOffset);
      }

      scrollSelectionIntoView(editor, newDomRange);
    } else {
      domSelection.removeAllRanges();
    }

    setTimeout(function () {
      // COMPAT: In Firefox, it's not enough to create a range, you also need
      // to focus the contenteditable element too. (2016/11/16)
      if (newDomRange && IS_FIREFOX) {
        var el = ReactEditor.toDOMNode(editor, editor);
        el.focus();
      }

      state.isUpdatingSelection = false;
    });
  }); // The autoFocus TextareaHTMLAttribute doesn't do anything on a div, so it
  // needs to be manually focused.

  React.useEffect(function () {
    if (ref.current && autoFocus) {
      ref.current.focus();
    }
  }, [autoFocus]); // Listen on the native `selectionchange` event to be able to update any time
  // the selection changes. This is required because React's `onSelect` is leaky
  // and non-standard so it doesn't fire until after a selection has been
  // released. This causes issues in situations where another change happens
  // while a selection is being dragged.

  var onDOMSelectionChange = React.useCallback(throttle__default['default'](function () {
    if (!ReactEditor.isComposing(editor) && !state.isUpdatingSelection && !state.isDraggingInternally) {
      var root = ReactEditor.findDocumentOrShadowRoot(editor);
      var activeElement = root.activeElement;
      var el = ReactEditor.toDOMNode(editor, editor);
      var domSelection = root.getSelection();

      if (activeElement === el) {
        state.latestElement = activeElement;
        IS_FOCUSED.set(editor, true);
      } else {
        IS_FOCUSED["delete"](editor);
      }

      if (!domSelection) {
        return slate.Transforms.deselect(editor);
      }

      var anchorNode = domSelection.anchorNode,
          focusNode = domSelection.focusNode;
      var anchorNodeSelectable = hasEditableTarget(editor, anchorNode) || isTargetInsideNonReadonlyVoid(editor, anchorNode);
      var focusNodeSelectable = hasEditableTarget(editor, focusNode) || isTargetInsideNonReadonlyVoid(editor, focusNode);

      if (anchorNodeSelectable && focusNodeSelectable) {
        var range = ReactEditor.toSlateRange(editor, domSelection, {
          exactMatch: false,
          suppressThrow: false
        });
        slate.Transforms.select(editor, range);
      }
    }
  }, 100), [readOnly]);
  var scheduleOnDOMSelectionChange = React.useMemo(function () {
    return debounce__default['default'](onDOMSelectionChange, 0);
  }, [onDOMSelectionChange]); // Listen on the native `beforeinput` event to get real "Level 2" events. This
  // is required because React's `beforeinput` is fake and never really attaches
  // to the real event sadly. (2019/11/01)
  // https://github.com/facebook/react/issues/11211

  var onDOMBeforeInput = React.useCallback(function (event) {
    if (!readOnly && hasEditableTarget(editor, event.target) && !isDOMEventHandled(event, propsOnDOMBeforeInput)) {
      var _EDITOR_TO_USER_SELEC;

      // Some IMEs/Chrome extensions like e.g. Grammarly set the selection immediately before
      // triggering a `beforeinput` expecting the change to be applied to the immediately before
      // set selection.
      scheduleOnDOMSelectionChange.flush();
      onDOMSelectionChange.flush();
      var selection = editor.selection;
      var type = event.inputType;
      var data = event.dataTransfer || event.data || undefined; // These two types occur while a user is composing text and can't be
      // cancelled. Let them through and wait for the composition to end.

      if (type === 'insertCompositionText' || type === 'deleteCompositionText') {
        return;
      }

      var _native = false;

      if (type === 'insertText' && selection && slate.Range.isCollapsed(selection) && // Only use native character insertion for single characters a-z or space for now.
      // Long-press events (hold a + press 4 = ä) to choose a special character otherwise
      // causes duplicate inserts.
      event.data && event.data.length === 1 && /[a-z ]/i.test(event.data) && // Chrome has issues correctly editing the start of nodes: https://bugs.chromium.org/p/chromium/issues/detail?id=1249405
      // When there is an inline element, e.g. a link, and you select
      // right after it (the start of the next node).
      selection.anchor.offset !== 0) {
        var _node$parentElement;

        _native = true; // Skip native if there are marks, as
        // `insertText` will insert a node, not just text.

        if (editor.marks) {
          _native = false;
        } // Chrome also has issues correctly editing the end of anchor elements: https://bugs.chromium.org/p/chromium/issues/detail?id=1259100
        // Therefore we don't allow native events to insert text at the end of anchor nodes.


        var anchor = selection.anchor;

        var _ReactEditor$toDOMPoi = ReactEditor.toDOMPoint(editor, anchor),
            _ReactEditor$toDOMPoi2 = _slicedToArray(_ReactEditor$toDOMPoi, 2),
            node = _ReactEditor$toDOMPoi2[0],
            offset = _ReactEditor$toDOMPoi2[1];

        var anchorNode = (_node$parentElement = node.parentElement) === null || _node$parentElement === void 0 ? void 0 : _node$parentElement.closest('a');

        if (anchorNode && ReactEditor.hasDOMNode(editor, anchorNode)) {
          var _lastText$textContent;

          var _ReactEditor$getWindo = ReactEditor.getWindow(editor),
              document = _ReactEditor$getWindo.document; // Find the last text node inside the anchor.


          var lastText = document.createTreeWalker(anchorNode, NodeFilter.SHOW_TEXT).lastChild();

          if (lastText === node && ((_lastText$textContent = lastText.textContent) === null || _lastText$textContent === void 0 ? void 0 : _lastText$textContent.length) === offset) {
            _native = false;
          }
        }
      } // COMPAT: For the deleting forward/backward input types we don't want
      // to change the selection because it is the range that will be deleted,
      // and those commands determine that for themselves.


      if (!type.startsWith('delete') || type.startsWith('deleteBy')) {
        var _event$getTargetRange = event.getTargetRanges(),
            _event$getTargetRange2 = _slicedToArray(_event$getTargetRange, 1),
            targetRange = _event$getTargetRange2[0];

        if (targetRange) {
          var range = ReactEditor.toSlateRange(editor, targetRange, {
            exactMatch: false,
            suppressThrow: false
          });

          if (!selection || !slate.Range.equals(selection, range)) {
            _native = false;
            var selectionRef = editor.selection && slate.Editor.rangeRef(editor, editor.selection);
            slate.Transforms.select(editor, range);

            if (selectionRef) {
              EDITOR_TO_USER_SELECTION.set(editor, selectionRef);
            }
          }
        }
      }

      if (!_native) {
        event.preventDefault();
      } // COMPAT: If the selection is expanded, even if the command seems like
      // a delete forward/backward command it should delete the selection.


      if (selection && slate.Range.isExpanded(selection) && type.startsWith('delete')) {
        var direction = type.endsWith('Backward') ? 'backward' : 'forward';
        slate.Editor.deleteFragment(editor, {
          direction: direction
        });
        return;
      }

      switch (type) {
        case 'deleteByComposition':
        case 'deleteByCut':
        case 'deleteByDrag':
          {
            slate.Editor.deleteFragment(editor);
            break;
          }

        case 'deleteContent':
        case 'deleteContentForward':
          {
            slate.Editor.deleteForward(editor);
            break;
          }

        case 'deleteContentBackward':
          {
            slate.Editor.deleteBackward(editor);
            break;
          }

        case 'deleteEntireSoftLine':
          {
            slate.Editor.deleteBackward(editor, {
              unit: 'line'
            });
            slate.Editor.deleteForward(editor, {
              unit: 'line'
            });
            break;
          }

        case 'deleteHardLineBackward':
          {
            slate.Editor.deleteBackward(editor, {
              unit: 'block'
            });
            break;
          }

        case 'deleteSoftLineBackward':
          {
            slate.Editor.deleteBackward(editor, {
              unit: 'line'
            });
            break;
          }

        case 'deleteHardLineForward':
          {
            slate.Editor.deleteForward(editor, {
              unit: 'block'
            });
            break;
          }

        case 'deleteSoftLineForward':
          {
            slate.Editor.deleteForward(editor, {
              unit: 'line'
            });
            break;
          }

        case 'deleteWordBackward':
          {
            slate.Editor.deleteBackward(editor, {
              unit: 'word'
            });
            break;
          }

        case 'deleteWordForward':
          {
            slate.Editor.deleteForward(editor, {
              unit: 'word'
            });
            break;
          }

        case 'insertLineBreak':
          slate.Editor.insertSoftBreak(editor);
          break;

        case 'insertParagraph':
          {
            slate.Editor.insertBreak(editor);
            break;
          }

        case 'insertFromComposition':
        case 'insertFromDrop':
        case 'insertFromPaste':
        case 'insertFromYank':
        case 'insertReplacementText':
        case 'insertText':
          {
            var _selection = editor.selection;

            if (_selection) {
              if (slate.Range.isExpanded(_selection)) {
                slate.Editor.deleteFragment(editor);
              }
            }

            if (type === 'insertFromComposition') {
              // COMPAT: in Safari, `compositionend` is dispatched after the
              // `beforeinput` for "insertFromComposition". But if we wait for it
              // then we will abort because we're still composing and the selection
              // won't be updated properly.
              // https://www.w3.org/TR/input-events-2/
              if (ReactEditor.isComposing(editor)) {
                setIsComposing(false);
                IS_COMPOSING.set(editor, false);
              }
            } // use a weak comparison instead of 'instanceof' to allow
            // programmatic access of paste events coming from external windows
            // like cypress where cy.window does not work realibly


            if ((data === null || data === void 0 ? void 0 : data.constructor.name) === 'DataTransfer') {
              ReactEditor.insertData(editor, data);
            } else if (typeof data === 'string') {
              // Only insertText operations use the native functionality, for now.
              // Potentially expand to single character deletes, as well.
              if (_native) {
                deferredOperations.current.push(function () {
                  return slate.Editor.insertText(editor, data);
                });
              } else {
                slate.Editor.insertText(editor, data);
              }
            }

            break;
          }
      } // Restore the actual user section if nothing manually set it.


      var toRestore = (_EDITOR_TO_USER_SELEC = EDITOR_TO_USER_SELECTION.get(editor)) === null || _EDITOR_TO_USER_SELEC === void 0 ? void 0 : _EDITOR_TO_USER_SELEC.unref();
      EDITOR_TO_USER_SELECTION["delete"](editor);

      if (toRestore && (!editor.selection || !slate.Range.equals(editor.selection, toRestore))) {
        slate.Transforms.select(editor, toRestore);
      }
    }
  }, [readOnly, propsOnDOMBeforeInput]); // Attach a native DOM event handler for `beforeinput` events, because React's
  // built-in `onBeforeInput` is actually a leaky polyfill that doesn't expose
  // real `beforeinput` events sadly... (2019/11/04)
  // https://github.com/facebook/react/issues/11211

  useIsomorphicLayoutEffect(function () {
    if (ref.current && HAS_BEFORE_INPUT_SUPPORT) {
      // @ts-ignore The `beforeinput` event isn't recognized.
      ref.current.addEventListener('beforeinput', onDOMBeforeInput);
    }

    return function () {
      if (ref.current && HAS_BEFORE_INPUT_SUPPORT) {
        // @ts-ignore The `beforeinput` event isn't recognized.
        ref.current.removeEventListener('beforeinput', onDOMBeforeInput);
      }
    };
  }, [onDOMBeforeInput]); // Attach a native DOM event handler for `selectionchange`, because React's
  // built-in `onSelect` handler doesn't fire for all selection changes. It's a
  // leaky polyfill that only fires on keypresses or clicks. Instead, we want to
  // fire for any change to the selection inside the editor. (2019/11/04)
  // https://github.com/facebook/react/issues/5785

  useIsomorphicLayoutEffect(function () {
    var window = ReactEditor.getWindow(editor);
    window.document.addEventListener('selectionchange', scheduleOnDOMSelectionChange);
    return function () {
      window.document.removeEventListener('selectionchange', scheduleOnDOMSelectionChange);
    };
  }, [scheduleOnDOMSelectionChange]);
  var decorations = decorate([editor, []]);

  if (placeholder && editor.children.length === 1 && Array.from(slate.Node.texts(editor)).length === 1 && slate.Node.string(editor) === '' && !isComposing) {
    var _decorations$push;

    var start = slate.Editor.start(editor, []);
    decorations.push((_decorations$push = {}, _defineProperty(_decorations$push, PLACEHOLDER_SYMBOL, true), _defineProperty(_decorations$push, "placeholder", placeholder), _defineProperty(_decorations$push, "anchor", start), _defineProperty(_decorations$push, "focus", start), _decorations$push));
  }

  return /*#__PURE__*/React__default['default'].createElement(ReadOnlyContext.Provider, {
    value: readOnly
  }, /*#__PURE__*/React__default['default'].createElement(DecorateContext.Provider, {
    value: decorate
  }, /*#__PURE__*/React__default['default'].createElement(Component, Object.assign({
    role: readOnly ? undefined : 'textbox'
  }, attributes, {
    // COMPAT: Certain browsers don't support the `beforeinput` event, so we'd
    // have to use hacks to make these replacement-based features work.
    // For SSR situations HAS_BEFORE_INPUT_SUPPORT is false and results in prop
    // mismatch warning app moves to browser. Pass-through consumer props when
    // not CAN_USE_DOM (SSR) and default to falsy value
    spellCheck: HAS_BEFORE_INPUT_SUPPORT || !CAN_USE_DOM ? attributes.spellCheck : false,
    autoCorrect: HAS_BEFORE_INPUT_SUPPORT || !CAN_USE_DOM ? attributes.autoCorrect : 'false',
    autoCapitalize: HAS_BEFORE_INPUT_SUPPORT || !CAN_USE_DOM ? attributes.autoCapitalize : 'false',
    "data-slate-editor": true,
    "data-slate-node": "value",
    // explicitly set this
    contentEditable: !readOnly,
    // in some cases, a decoration needs access to the range / selection to decorate a text node,
    // then you will select the whole text node when you select part the of text
    // this magic zIndex="-1" will fix it
    zindex: -1,
    suppressContentEditableWarning: true,
    ref: ref,
    style: _objectSpread$1({
      // Allow positioning relative to the editable element.
      position: 'relative',
      // Prevent the default outline styles.
      outline: 'none',
      // Preserve adjacent whitespace and new lines.
      whiteSpace: 'pre-wrap',
      // Allow words to break if they are too long.
      wordWrap: 'break-word'
    }, style),
    onBeforeInput: React.useCallback(function (event) {
      // COMPAT: Certain browsers don't support the `beforeinput` event, so we
      // fall back to React's leaky polyfill instead just for it. It
      // only works for the `insertText` input type.
      if (!HAS_BEFORE_INPUT_SUPPORT && !readOnly && !isEventHandled(event, attributes.onBeforeInput) && hasEditableTarget(editor, event.target)) {
        event.preventDefault();

        if (!ReactEditor.isComposing(editor)) {
          var text = event.data;
          slate.Editor.insertText(editor, text);
        }
      }
    }, [readOnly]),
    onInput: React.useCallback(function (event) {
      // Flush native operations, as native events will have propogated
      // and we can correctly compare DOM text values in components
      // to stop rendering, so that browser functions like autocorrect
      // and spellcheck work as expected.
      var _iterator = _createForOfIteratorHelper$2(deferredOperations.current),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var op = _step.value;
          op();
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      deferredOperations.current = [];
    }, []),
    onBlur: React.useCallback(function (event) {
      if (readOnly || state.isUpdatingSelection || !hasEditableTarget(editor, event.target) || isEventHandled(event, attributes.onBlur)) {
        return;
      } // COMPAT: If the current `activeElement` is still the previous
      // one, this is due to the window being blurred when the tab
      // itself becomes unfocused, so we want to abort early to allow to
      // editor to stay focused when the tab becomes focused again.


      var root = ReactEditor.findDocumentOrShadowRoot(editor);

      if (state.latestElement === root.activeElement) {
        return;
      }

      var relatedTarget = event.relatedTarget;
      var el = ReactEditor.toDOMNode(editor, editor); // COMPAT: The event should be ignored if the focus is returning
      // to the editor from an embedded editable element (eg. an <input>
      // element inside a void node).

      if (relatedTarget === el) {
        return;
      } // COMPAT: The event should be ignored if the focus is moving from
      // the editor to inside a void node's spacer element.


      if (isDOMElement(relatedTarget) && relatedTarget.hasAttribute('data-slate-spacer')) {
        return;
      } // COMPAT: The event should be ignored if the focus is moving to a
      // non- editable section of an element that isn't a void node (eg.
      // a list item of the check list example).


      if (relatedTarget != null && isDOMNode(relatedTarget) && ReactEditor.hasDOMNode(editor, relatedTarget)) {
        var node = ReactEditor.toSlateNode(editor, relatedTarget);

        if (slate.Element.isElement(node) && !editor.isVoid(node)) {
          return;
        }
      } // COMPAT: Safari doesn't always remove the selection even if the content-
      // editable element no longer has focus. Refer to:
      // https://stackoverflow.com/questions/12353247/force-contenteditable-div-to-stop-accepting-input-after-it-loses-focus-under-web


      if (IS_SAFARI) {
        var domSelection = root.getSelection();
        domSelection === null || domSelection === void 0 ? void 0 : domSelection.removeAllRanges();
      }

      IS_FOCUSED["delete"](editor);
    }, [readOnly, attributes.onBlur]),
    onClick: React.useCallback(function (event) {
      if (hasTarget(editor, event.target) && !isEventHandled(event, attributes.onClick) && isDOMNode(event.target)) {
        var node = ReactEditor.toSlateNode(editor, event.target);
        var path = ReactEditor.findPath(editor, node); // At this time, the Slate document may be arbitrarily different,
        // because onClick handlers can change the document before we get here.
        // Therefore we must check that this path actually exists,
        // and that it still refers to the same node.

        if (!slate.Editor.hasPath(editor, path) || slate.Node.get(editor, path) !== node) {
          return;
        }

        if (event.detail === TRIPLE_CLICK && path.length >= 1) {
          var blockPath = path;

          if (!slate.Editor.isBlock(editor, node)) {
            var _block$;

            var block = slate.Editor.above(editor, {
              match: function match(n) {
                return slate.Editor.isBlock(editor, n);
              },
              at: path
            });
            blockPath = (_block$ = block === null || block === void 0 ? void 0 : block[1]) !== null && _block$ !== void 0 ? _block$ : path.slice(0, 1);
          }

          var range = slate.Editor.range(editor, blockPath);
          slate.Transforms.select(editor, range);
          return;
        }

        if (readOnly) {
          return;
        }

        var _start = slate.Editor.start(editor, path);

        var end = slate.Editor.end(editor, path);
        var startVoid = slate.Editor["void"](editor, {
          at: _start
        });
        var endVoid = slate.Editor["void"](editor, {
          at: end
        });

        if (startVoid && endVoid && slate.Path.equals(startVoid[1], endVoid[1])) {
          var _range = slate.Editor.range(editor, _start);

          slate.Transforms.select(editor, _range);
        }
      }
    }, [readOnly, attributes.onClick]),
    onCompositionEnd: React.useCallback(function (event) {
      if (hasEditableTarget(editor, event.target) && !isEventHandled(event, attributes.onCompositionEnd)) {
        if (ReactEditor.isComposing(editor)) {
          setIsComposing(false);
          IS_COMPOSING.set(editor, false);
        } // COMPAT: In Chrome, `beforeinput` events for compositions
        // aren't correct and never fire the "insertFromComposition"
        // type that we need. So instead, insert whenever a composition
        // ends since it will already have been committed to the DOM.


        if (!IS_SAFARI && !IS_FIREFOX_LEGACY && !IS_IOS && !IS_QQBROWSER && !IS_WECHATBROWSER && !IS_UC_MOBILE && event.data) {
          slate.Editor.insertText(editor, event.data);
        }

        if (editor.selection && slate.Range.isCollapsed(editor.selection)) {
          var leafPath = editor.selection.anchor.path;
          var currentTextNode = slate.Node.leaf(editor, leafPath);

          if (state.hasInsertPrefixInCompositon) {
            state.hasInsertPrefixInCompositon = false;
            slate.Editor.withoutNormalizing(editor, function () {
              // remove Unicode BOM prefix added in `onCompositionStart`
              var text = currentTextNode.text.replace(/^\uFEFF/, '');
              slate.Transforms["delete"](editor, {
                distance: currentTextNode.text.length,
                reverse: true
              });
              slate.Editor.insertText(editor, text);
            });
          }
        }
      }
    }, [attributes.onCompositionEnd]),
    onCompositionUpdate: React.useCallback(function (event) {
      if (hasEditableTarget(editor, event.target) && !isEventHandled(event, attributes.onCompositionUpdate)) {
        if (!ReactEditor.isComposing(editor)) {
          setIsComposing(true);
          IS_COMPOSING.set(editor, true);
        }
      }
    }, [attributes.onCompositionUpdate]),
    onCompositionStart: React.useCallback(function (event) {
      if (hasEditableTarget(editor, event.target) && !isEventHandled(event, attributes.onCompositionStart)) {
        var selection = editor.selection,
            marks = editor.marks;

        if (selection) {
          if (slate.Range.isExpanded(selection)) {
            slate.Editor.deleteFragment(editor);
            return;
          }

          var inline = slate.Editor.above(editor, {
            match: function match(n) {
              return slate.Editor.isInline(editor, n);
            },
            mode: 'highest'
          });

          if (inline) {
            var _inline = _slicedToArray(inline, 2),
                inlinePath = _inline[1];

            if (slate.Editor.isEnd(editor, selection.anchor, inlinePath)) {
              var point = slate.Editor.after(editor, inlinePath);
              slate.Transforms.setSelection(editor, {
                anchor: point,
                focus: point
              });
            }
          } // insert new node in advance to ensure composition text will insert
          // along with final input text
          // add Unicode BOM prefix to avoid normalize removing this node


          if (marks) {
            state.hasInsertPrefixInCompositon = true;
            slate.Transforms.insertNodes(editor, _objectSpread$1({
              text: "\uFEFF"
            }, marks), {
              select: true
            });
          }
        }
      }
    }, [attributes.onCompositionStart]),
    onCopy: React.useCallback(function (event) {
      if (hasEditableTarget(editor, event.target) && !isEventHandled(event, attributes.onCopy)) {
        event.preventDefault();
        ReactEditor.setFragmentData(editor, event.clipboardData, 'copy');
      }
    }, [attributes.onCopy]),
    onCut: React.useCallback(function (event) {
      if (!readOnly && hasEditableTarget(editor, event.target) && !isEventHandled(event, attributes.onCut)) {
        event.preventDefault();
        ReactEditor.setFragmentData(editor, event.clipboardData, 'cut');
        var selection = editor.selection;

        if (selection) {
          if (slate.Range.isExpanded(selection)) {
            slate.Editor.deleteFragment(editor);
          } else {
            var node = slate.Node.parent(editor, selection.anchor.path);

            if (slate.Editor.isVoid(editor, node)) {
              slate.Transforms["delete"](editor);
            }
          }
        }
      }
    }, [readOnly, attributes.onCut]),
    onDragOver: React.useCallback(function (event) {
      if (hasTarget(editor, event.target) && !isEventHandled(event, attributes.onDragOver)) {
        // Only when the target is void, call `preventDefault` to signal
        // that drops are allowed. Editable content is droppable by
        // default, and calling `preventDefault` hides the cursor.
        var node = ReactEditor.toSlateNode(editor, event.target);

        if (slate.Editor.isVoid(editor, node)) {
          event.preventDefault();
        }
      }
    }, [attributes.onDragOver]),
    onDragStart: React.useCallback(function (event) {
      if (!readOnly && hasTarget(editor, event.target) && !isEventHandled(event, attributes.onDragStart)) {
        var node = ReactEditor.toSlateNode(editor, event.target);
        var path = ReactEditor.findPath(editor, node);
        var voidMatch = slate.Editor.isVoid(editor, node) || slate.Editor["void"](editor, {
          at: path,
          voids: true
        }); // If starting a drag on a void node, make sure it is selected
        // so that it shows up in the selection's fragment.

        if (voidMatch) {
          var range = slate.Editor.range(editor, path);
          slate.Transforms.select(editor, range);
        }

        state.isDraggingInternally = true;
        ReactEditor.setFragmentData(editor, event.dataTransfer, 'drag');
      }
    }, [readOnly, attributes.onDragStart]),
    onDrop: React.useCallback(function (event) {
      if (!readOnly && hasTarget(editor, event.target) && !isEventHandled(event, attributes.onDrop)) {
        event.preventDefault(); // Keep a reference to the dragged range before updating selection

        var draggedRange = editor.selection; // Find the range where the drop happened

        var range = ReactEditor.findEventRange(editor, event);
        var data = event.dataTransfer;
        slate.Transforms.select(editor, range);

        if (state.isDraggingInternally) {
          if (draggedRange && !slate.Range.equals(draggedRange, range) && !slate.Editor["void"](editor, {
            at: range,
            voids: true
          })) {
            slate.Transforms["delete"](editor, {
              at: draggedRange
            });
          }
        }

        ReactEditor.insertData(editor, data); // When dragging from another source into the editor, it's possible
        // that the current editor does not have focus.

        if (!ReactEditor.isFocused(editor)) {
          ReactEditor.focus(editor);
        }
      }

      state.isDraggingInternally = false;
    }, [readOnly, attributes.onDrop]),
    onDragEnd: React.useCallback(function (event) {
      if (!readOnly && state.isDraggingInternally && attributes.onDragEnd && hasTarget(editor, event.target)) {
        attributes.onDragEnd(event);
      } // When dropping on a different droppable element than the current editor,
      // `onDrop` is not called. So we need to clean up in `onDragEnd` instead.
      // Note: `onDragEnd` is only called when `onDrop` is not called


      state.isDraggingInternally = false;
    }, [readOnly, attributes.onDragEnd]),
    onFocus: React.useCallback(function (event) {
      if (!readOnly && !state.isUpdatingSelection && hasEditableTarget(editor, event.target) && !isEventHandled(event, attributes.onFocus)) {
        var el = ReactEditor.toDOMNode(editor, editor);
        var root = ReactEditor.findDocumentOrShadowRoot(editor);
        state.latestElement = root.activeElement; // COMPAT: If the editor has nested editable elements, the focus
        // can go to them. In Firefox, this must be prevented because it
        // results in issues with keyboard navigation. (2017/03/30)

        if (IS_FIREFOX && event.target !== el) {
          el.focus();
          return;
        }

        IS_FOCUSED.set(editor, true);
      }
    }, [readOnly, attributes.onFocus]),
    onKeyDown: React.useCallback(function (event) {
      if (!readOnly && hasEditableTarget(editor, event.target)) {
        var nativeEvent = event.nativeEvent; // COMPAT: The composition end event isn't fired reliably in all browsers,
        // so we sometimes might end up stuck in a composition state even though we
        // aren't composing any more.

        if (ReactEditor.isComposing(editor) && nativeEvent.isComposing === false) {
          IS_COMPOSING.set(editor, false);
          setIsComposing(false);
        }

        if (isEventHandled(event, attributes.onKeyDown) || ReactEditor.isComposing(editor)) {
          return;
        }

        var selection = editor.selection;
        var element = editor.children[selection !== null ? selection.focus.path[0] : 0];
        var isRTL = getDirection__default['default'](slate.Node.string(element)) === 'rtl'; // COMPAT: Since we prevent the default behavior on
        // `beforeinput` events, the browser doesn't think there's ever
        // any history stack to undo or redo, so we have to manage these
        // hotkeys ourselves. (2019/11/06)

        if (Hotkeys.isRedo(nativeEvent)) {
          event.preventDefault();
          var maybeHistoryEditor = editor;

          if (typeof maybeHistoryEditor.redo === 'function') {
            maybeHistoryEditor.redo();
          }

          return;
        }

        if (Hotkeys.isUndo(nativeEvent)) {
          event.preventDefault();
          var _maybeHistoryEditor = editor;

          if (typeof _maybeHistoryEditor.undo === 'function') {
            _maybeHistoryEditor.undo();
          }

          return;
        } // COMPAT: Certain browsers don't handle the selection updates
        // properly. In Chrome, the selection isn't properly extended.
        // And in Firefox, the selection isn't properly collapsed.
        // (2017/10/17)


        if (Hotkeys.isMoveLineBackward(nativeEvent)) {
          event.preventDefault();
          slate.Transforms.move(editor, {
            unit: 'line',
            reverse: true
          });
          return;
        }

        if (Hotkeys.isMoveLineForward(nativeEvent)) {
          event.preventDefault();
          slate.Transforms.move(editor, {
            unit: 'line'
          });
          return;
        }

        if (Hotkeys.isExtendLineBackward(nativeEvent)) {
          event.preventDefault();
          slate.Transforms.move(editor, {
            unit: 'line',
            edge: 'focus',
            reverse: true
          });
          return;
        }

        if (Hotkeys.isExtendLineForward(nativeEvent)) {
          event.preventDefault();
          slate.Transforms.move(editor, {
            unit: 'line',
            edge: 'focus'
          });
          return;
        } // COMPAT: If a void node is selected, or a zero-width text node
        // adjacent to an inline is selected, we need to handle these
        // hotkeys manually because browsers won't be able to skip over
        // the void node with the zero-width space not being an empty
        // string.


        if (Hotkeys.isMoveBackward(nativeEvent)) {
          event.preventDefault();

          if (selection && slate.Range.isCollapsed(selection)) {
            slate.Transforms.move(editor, {
              reverse: !isRTL
            });
          } else {
            slate.Transforms.collapse(editor, {
              edge: 'start'
            });
          }

          return;
        }

        if (Hotkeys.isMoveForward(nativeEvent)) {
          event.preventDefault();

          if (selection && slate.Range.isCollapsed(selection)) {
            slate.Transforms.move(editor, {
              reverse: isRTL
            });
          } else {
            slate.Transforms.collapse(editor, {
              edge: 'end'
            });
          }

          return;
        }

        if (Hotkeys.isMoveWordBackward(nativeEvent)) {
          event.preventDefault();

          if (selection && slate.Range.isExpanded(selection)) {
            slate.Transforms.collapse(editor, {
              edge: 'focus'
            });
          }

          slate.Transforms.move(editor, {
            unit: 'word',
            reverse: !isRTL
          });
          return;
        }

        if (Hotkeys.isMoveWordForward(nativeEvent)) {
          event.preventDefault();

          if (selection && slate.Range.isExpanded(selection)) {
            slate.Transforms.collapse(editor, {
              edge: 'focus'
            });
          }

          slate.Transforms.move(editor, {
            unit: 'word',
            reverse: isRTL
          });
          return;
        } // COMPAT: Certain browsers don't support the `beforeinput` event, so we
        // fall back to guessing at the input intention for hotkeys.
        // COMPAT: In iOS, some of these hotkeys are handled in the


        if (!HAS_BEFORE_INPUT_SUPPORT) {
          // We don't have a core behavior for these, but they change the
          // DOM if we don't prevent them, so we have to.
          if (Hotkeys.isBold(nativeEvent) || Hotkeys.isItalic(nativeEvent) || Hotkeys.isTransposeCharacter(nativeEvent)) {
            event.preventDefault();
            return;
          }

          if (Hotkeys.isSoftBreak(nativeEvent)) {
            event.preventDefault();
            slate.Editor.insertSoftBreak(editor);
            return;
          }

          if (Hotkeys.isSplitBlock(nativeEvent)) {
            event.preventDefault();
            slate.Editor.insertBreak(editor);
            return;
          }

          if (Hotkeys.isDeleteBackward(nativeEvent)) {
            event.preventDefault();

            if (selection && slate.Range.isExpanded(selection)) {
              slate.Editor.deleteFragment(editor, {
                direction: 'backward'
              });
            } else {
              slate.Editor.deleteBackward(editor);
            }

            return;
          }

          if (Hotkeys.isDeleteForward(nativeEvent)) {
            event.preventDefault();

            if (selection && slate.Range.isExpanded(selection)) {
              slate.Editor.deleteFragment(editor, {
                direction: 'forward'
              });
            } else {
              slate.Editor.deleteForward(editor);
            }

            return;
          }

          if (Hotkeys.isDeleteLineBackward(nativeEvent)) {
            event.preventDefault();

            if (selection && slate.Range.isExpanded(selection)) {
              slate.Editor.deleteFragment(editor, {
                direction: 'backward'
              });
            } else {
              slate.Editor.deleteBackward(editor, {
                unit: 'line'
              });
            }

            return;
          }

          if (Hotkeys.isDeleteLineForward(nativeEvent)) {
            event.preventDefault();

            if (selection && slate.Range.isExpanded(selection)) {
              slate.Editor.deleteFragment(editor, {
                direction: 'forward'
              });
            } else {
              slate.Editor.deleteForward(editor, {
                unit: 'line'
              });
            }

            return;
          }

          if (Hotkeys.isDeleteWordBackward(nativeEvent)) {
            event.preventDefault();

            if (selection && slate.Range.isExpanded(selection)) {
              slate.Editor.deleteFragment(editor, {
                direction: 'backward'
              });
            } else {
              slate.Editor.deleteBackward(editor, {
                unit: 'word'
              });
            }

            return;
          }

          if (Hotkeys.isDeleteWordForward(nativeEvent)) {
            event.preventDefault();

            if (selection && slate.Range.isExpanded(selection)) {
              slate.Editor.deleteFragment(editor, {
                direction: 'forward'
              });
            } else {
              slate.Editor.deleteForward(editor, {
                unit: 'word'
              });
            }

            return;
          }
        } else {
          if (IS_CHROME || IS_SAFARI) {
            // COMPAT: Chrome and Safari support `beforeinput` event but do not fire
            // an event when deleting backwards in a selected void inline node
            if (selection && (Hotkeys.isDeleteBackward(nativeEvent) || Hotkeys.isDeleteForward(nativeEvent)) && slate.Range.isCollapsed(selection)) {
              var currentNode = slate.Node.parent(editor, selection.anchor.path);

              if (slate.Element.isElement(currentNode) && slate.Editor.isVoid(editor, currentNode) && slate.Editor.isInline(editor, currentNode)) {
                event.preventDefault();
                slate.Editor.deleteBackward(editor, {
                  unit: 'block'
                });
                return;
              }
            }
          }
        }
      }
    }, [readOnly, attributes.onKeyDown]),
    onPaste: React.useCallback(function (event) {
      if (!readOnly && hasEditableTarget(editor, event.target) && !isEventHandled(event, attributes.onPaste)) {
        // COMPAT: Certain browsers don't support the `beforeinput` event, so we
        // fall back to React's `onPaste` here instead.
        // COMPAT: Firefox, Chrome and Safari don't emit `beforeinput` events
        // when "paste without formatting" is used, so fallback. (2020/02/20)
        if (!HAS_BEFORE_INPUT_SUPPORT || isPlainTextOnlyPaste(event.nativeEvent)) {
          event.preventDefault();
          ReactEditor.insertData(editor, event.clipboardData);
        }
      }
    }, [readOnly, attributes.onPaste])
  }), /*#__PURE__*/React__default['default'].createElement(Children, {
    decorations: decorations,
    node: editor,
    renderElement: renderElement,
    renderPlaceholder: renderPlaceholder,
    renderLeaf: renderLeaf,
    selection: editor.selection
  }))));
};
/**
 * The default placeholder element
 */

var DefaultPlaceholder = function DefaultPlaceholder(_ref) {
  var attributes = _ref.attributes,
      children = _ref.children;
  return /*#__PURE__*/React__default['default'].createElement("span", Object.assign({}, attributes), children);
};
/**
 * A default memoized decorate function.
 */

var defaultDecorate = function defaultDecorate() {
  return [];
};
/**
 * A default implement to scroll dom range into view.
 */

var defaultScrollSelectionIntoView = function defaultScrollSelectionIntoView(editor, domRange) {
  // This was affecting the selection of multiple blocks and dragging behavior,
  // so enabled only if the selection has been collapsed.
  if (!editor.selection || editor.selection && slate.Range.isCollapsed(editor.selection)) {
    var leafEl = domRange.startContainer.parentElement;
    leafEl.getBoundingClientRect = domRange.getBoundingClientRect.bind(domRange);
    scrollIntoView__default['default'](leafEl, {
      scrollMode: 'if-needed'
    });
    delete leafEl.getBoundingClientRect;
  }
};
/**
 * Check if the target is in the editor.
 */


var hasTarget = function hasTarget(editor, target) {
  return isDOMNode(target) && ReactEditor.hasDOMNode(editor, target);
};
/**
 * Check if the target is editable and in the editor.
 */

var hasEditableTarget = function hasEditableTarget(editor, target) {
  return isDOMNode(target) && ReactEditor.hasDOMNode(editor, target, {
    editable: true
  });
};
/**
 * Check if the target is inside void and in an non-readonly editor.
 */

var isTargetInsideNonReadonlyVoid = function isTargetInsideNonReadonlyVoid(editor, target) {
  if (IS_READ_ONLY.get(editor)) return false;
  var slateNode = hasTarget(editor, target) && ReactEditor.toSlateNode(editor, target);
  return slate.Editor.isVoid(editor, slateNode);
};
/**
 * Check if an event is overrided by a handler.
 */

var isEventHandled = function isEventHandled(event, handler) {
  if (!handler) {
    return false;
  } // The custom event handler may return a boolean to specify whether the event
  // shall be treated as being handled or not.


  var shouldTreatEventAsHandled = handler(event);

  if (shouldTreatEventAsHandled != null) {
    return shouldTreatEventAsHandled;
  }

  return event.isDefaultPrevented() || event.isPropagationStopped();
};
/**
 * Check if a DOM event is overrided by a handler.
 */

var isDOMEventHandled = function isDOMEventHandled(event, handler) {
  if (!handler) {
    return false;
  } // The custom event handler may return a boolean to specify whether the event
  // shall be treated as being handled or not.


  var shouldTreatEventAsHandled = handler(event);

  if (shouldTreatEventAsHandled != null) {
    return shouldTreatEventAsHandled;
  }

  return event.defaultPrevented;
};

/**
 * Returns the number of characters that are the same at the beginning of the
 * String.
 *
 * @param prev  the previous text
 * @param next  the next text
 * @returns the offset of the start of the difference; null if there is no difference
 */

function getDiffStart(prev, next) {
  var length = Math.min(prev.length, next.length);

  for (var i = 0; i < length; i++) {
    if (prev.charAt(i) !== next.charAt(i)) return i;
  }

  if (prev.length !== next.length) return length;
  return null;
}
/**
 * Returns the number of characters that are the same at the end of the String
 * up to `max`. Max prevents double-counting characters when there are
 * multiple duplicate characters around the diff area.
 *
 * @param prev  the previous text
 * @param next  the next text
 * @param max  the max length to test.
 * @returns number of characters that are the same at the end of the string
 */


function getDiffEnd(prev, next, max) {
  var prevLength = prev.length;
  var nextLength = next.length;
  var length = Math.min(prevLength, nextLength, max);

  for (var i = 0; i < length; i++) {
    var prevChar = prev.charAt(prevLength - i - 1);
    var nextChar = next.charAt(nextLength - i - 1);
    if (prevChar !== nextChar) return i;
  }

  if (prev.length !== next.length) return length;
  return null;
}
/**
 * Takes two strings and returns an object representing two offsets. The
 * first, `start` represents the number of characters that are the same at
 * the front of the String. The `end` represents the number of characters
 * that are the same at the end of the String.
 *
 * Returns null if they are identical.
 *
 * @param prev  the previous text
 * @param next  the next text
 * @returns the difference text range; null if there are no differences.
 */


function getDiffOffsets(prev, next) {
  if (prev === next) return null;
  var start = getDiffStart(prev, next);
  if (start === null) return null;
  var maxEnd = Math.min(prev.length - start, next.length - start);
  var end = getDiffEnd(prev, next, maxEnd);
  if (end === null) return null;
  return {
    start: start,
    end: end
  };
}
/**
 * Takes a text string and returns a slice from the string at the given text range
 *
 * @param text  the text
 * @param offsets  the text range
 * @returns the text slice at text range
 */


function sliceText(text, offsets) {
  return text.slice(offsets.start, text.length - offsets.end);
}
/**
 * Takes two strings and returns a smart diff that can be used to describe the
 * change in a way that can be used as operations like inserting, removing or
 * replacing text.
 *
 * @param prev the previous text
 * @param next the next text
 * @returns the text difference
 */


function diffText(prev, next) {
  if (prev === undefined || next === undefined) return null;
  var offsets = getDiffOffsets(prev, next);
  if (offsets == null) return null;
  var insertText = sliceText(next, offsets);
  var removeText = sliceText(prev, offsets);
  return {
    start: offsets.start,
    end: prev.length - offsets.end,
    insertText: insertText,
    removeText: removeText
  };
}
function combineInsertedText(insertedText) {
  return insertedText.reduce(function (acc, _ref) {
    var text = _ref.text;
    return "".concat(acc).concat(text.insertText);
  }, '');
}
function getTextInsertion(editor, domNode) {
  var node = ReactEditor.toSlateNode(editor, domNode);

  if (!slate.Text.isText(node)) {
    return undefined;
  }

  var prevText = node.text;
  var nextText = domNode.textContent; // textContent will pad an extra \n when the textContent ends with an \n

  if (nextText.endsWith('\n')) {
    nextText = nextText.slice(0, nextText.length - 1);
  } // If the text is no different, there is no diff.


  if (nextText !== prevText) {
    var textDiff = diffText(prevText, nextText);

    if (textDiff !== null) {
      var textPath = ReactEditor.findPath(editor, node);
      return {
        text: textDiff,
        path: textPath
      };
    }
  }

  return undefined;
}
function normalizeTextInsertionRange(editor, range, _ref2) {
  var path = _ref2.path,
      text = _ref2.text;
  var insertionRange = {
    anchor: {
      path: path,
      offset: text.start
    },
    focus: {
      path: path,
      offset: text.end
    }
  };

  if (!range || !slate.Range.isCollapsed(range)) {
    return insertionRange;
  }

  var insertText = text.insertText,
      removeText = text.removeText;
  var isSingleCharacterInsertion = insertText.length === 1 || removeText.length === 1;
  /**
   * This code handles edge cases that arise from text diffing when the
   * inserted or removed character is a single character, and the character
   * right before or after the anchor is the same as the one being inserted or
   * removed.
   *
   * Take this example: hello|o
   *
   * If another `o` is inserted at the selection's anchor in the example above,
   * it should be inserted at the anchor, but using text diffing, we actually
   * detect that the character was inserted after the second `o`:
   *
   * helloo[o]|
   *
   * Instead, in these very specific edge cases, we assume that the character
   * needs to be inserted after the anchor rather than where the diff was found:
   *
   * hello[o]|o
   */

  if (isSingleCharacterInsertion && slate.Path.equals(range.anchor.path, path)) {
    var _Array$from = Array.from(slate.Editor.nodes(editor, {
      at: range,
      match: slate.Text.isText
    })),
        _Array$from2 = _slicedToArray(_Array$from, 1),
        _text = _Array$from2[0];

    if (_text) {
      var _text2 = _slicedToArray(_text, 1),
          node = _text2[0];

      var anchor = range.anchor;
      var characterBeforeAnchor = node.text[anchor.offset - 1];
      var characterAfterAnchor = node.text[anchor.offset];

      if (insertText.length === 1 && insertText === characterAfterAnchor) {
        // Assume text should be inserted at the anchor
        return range;
      }

      if (removeText.length === 1 && removeText === characterBeforeAnchor) {
        // Assume text should be removed right before the anchor
        return {
          anchor: {
            path: path,
            offset: anchor.offset - 1
          },
          focus: {
            path: path,
            offset: anchor.offset
          }
        };
      }
    }
  }

  return insertionRange;
}

var classCallCheck = createCommonjsModule(function (module) {
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

var _classCallCheck = unwrapExports(classCallCheck);

var arrayWithoutHoles = createCommonjsModule(function (module) {
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return arrayLikeToArray(arr);
}

module.exports = _arrayWithoutHoles;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

unwrapExports(arrayWithoutHoles);

var iterableToArray = createCommonjsModule(function (module) {
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

module.exports = _iterableToArray;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

unwrapExports(iterableToArray);

var nonIterableSpread = createCommonjsModule(function (module) {
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports = _nonIterableSpread;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

unwrapExports(nonIterableSpread);

var toConsumableArray = createCommonjsModule(function (module) {
function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
}

module.exports = _toConsumableArray;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

var _toConsumableArray = unwrapExports(toConsumableArray);

/**
 * An auto-incrementing identifier for keys.
 */
var n = 0;
/**
 * A class that keeps track of a key string. We use a full class here because we
 * want to be able to use them as keys in `WeakMap` objects.
 */

var Key = function Key() {
  _classCallCheck(this, Key);

  this.id = "".concat(n++);
};

var ReactEditor = {
  /**
   * Check if the user is currently composing inside the editor.
   */
  isComposing: function isComposing(editor) {
    return !!IS_COMPOSING.get(editor);
  },

  /**
   * Return the host window of the current editor.
   */
  getWindow: function getWindow(editor) {
    var window = EDITOR_TO_WINDOW.get(editor);

    if (!window) {
      throw new Error('Unable to find a host window element for this editor');
    }

    return window;
  },

  /**
   * Find a key for a Slate node.
   */
  findKey: function findKey(editor, node) {
    var key = NODE_TO_KEY.get(node);

    if (!key) {
      key = new Key();
      NODE_TO_KEY.set(node, key);
    }

    return key;
  },

  /**
   * Find the path of Slate node.
   */
  findPath: function findPath(editor, node) {
    var path = [];
    var child = node;

    while (true) {
      var parent = NODE_TO_PARENT.get(child);

      if (parent == null) {
        if (slate.Editor.isEditor(child)) {
          return path;
        } else {
          break;
        }
      }

      var i = NODE_TO_INDEX.get(child);

      if (i == null) {
        break;
      }

      path.unshift(i);
      child = parent;
    }

    throw new Error("Unable to find the path for Slate node: ".concat(slate.Scrubber.stringify(node)));
  },

  /**
   * Find the DOM node that implements DocumentOrShadowRoot for the editor.
   */
  findDocumentOrShadowRoot: function findDocumentOrShadowRoot(editor) {
    var el = ReactEditor.toDOMNode(editor, editor);
    var root = el.getRootNode();

    if ((root instanceof Document || root instanceof ShadowRoot) && root.getSelection != null) {
      return root;
    }

    return el.ownerDocument;
  },

  /**
   * Check if the editor is focused.
   */
  isFocused: function isFocused(editor) {
    return !!IS_FOCUSED.get(editor);
  },

  /**
   * Check if the editor is in read-only mode.
   */
  isReadOnly: function isReadOnly(editor) {
    return !!IS_READ_ONLY.get(editor);
  },

  /**
   * Blur the editor.
   */
  blur: function blur(editor) {
    var el = ReactEditor.toDOMNode(editor, editor);
    var root = ReactEditor.findDocumentOrShadowRoot(editor);
    IS_FOCUSED.set(editor, false);

    if (root.activeElement === el) {
      el.blur();
    }
  },

  /**
   * Focus the editor.
   */
  focus: function focus(editor) {
    var el = ReactEditor.toDOMNode(editor, editor);
    var root = ReactEditor.findDocumentOrShadowRoot(editor);
    IS_FOCUSED.set(editor, true);

    if (root.activeElement !== el) {
      el.focus({
        preventScroll: true
      });
    }
  },

  /**
   * Deselect the editor.
   */
  deselect: function deselect(editor) {
    ReactEditor.toDOMNode(editor, editor);
    var selection = editor.selection;
    var root = ReactEditor.findDocumentOrShadowRoot(editor);
    var domSelection = root.getSelection();

    if (domSelection && domSelection.rangeCount > 0) {
      domSelection.removeAllRanges();
    }

    if (selection) {
      slate.Transforms.deselect(editor);
    }
  },

  /**
   * Check if a DOM node is within the editor.
   */
  hasDOMNode: function hasDOMNode(editor, target) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var _options$editable = options.editable,
        editable = _options$editable === void 0 ? false : _options$editable;
    var editorEl = ReactEditor.toDOMNode(editor, editor);
    var targetEl; // COMPAT: In Firefox, reading `target.nodeType` will throw an error if
    // target is originating from an internal "restricted" element (e.g. a
    // stepper arrow on a number input). (2018/05/04)
    // https://github.com/ianstormtaylor/slate/issues/1819

    try {
      targetEl = isDOMElement(target) ? target : target.parentElement;
    } catch (err) {
      if (!err.message.includes('Permission denied to access property "nodeType"')) {
        throw err;
      }
    }

    if (!targetEl) {
      return false;
    }

    return targetEl.closest("[data-slate-editor]") === editorEl && (!editable || targetEl.isContentEditable ? true : typeof targetEl.isContentEditable === 'boolean' && // isContentEditable exists only on HTMLElement, and on other nodes it will be undefined
    // this is the core logic that lets you know you got the right editor.selection instead of null when editor is contenteditable="false"(readOnly)
    targetEl.closest('[contenteditable="false"]') === editorEl || !!targetEl.getAttribute('data-slate-zero-width'));
  },

  /**
   * Insert data from a `DataTransfer` into the editor.
   */
  insertData: function insertData(editor, data) {
    editor.insertData(data);
  },

  /**
   * Insert fragment data from a `DataTransfer` into the editor.
   */
  insertFragmentData: function insertFragmentData(editor, data) {
    return editor.insertFragmentData(data);
  },

  /**
   * Insert text data from a `DataTransfer` into the editor.
   */
  insertTextData: function insertTextData(editor, data) {
    return editor.insertTextData(data);
  },

  /**
   * Sets data from the currently selected fragment on a `DataTransfer`.
   */
  setFragmentData: function setFragmentData(editor, data, originEvent) {
    editor.setFragmentData(data, originEvent);
  },

  /**
   * Find the native DOM element from a Slate node.
   */
  toDOMNode: function toDOMNode(editor, node) {
    var KEY_TO_ELEMENT = EDITOR_TO_KEY_TO_ELEMENT.get(editor);
    var domNode = slate.Editor.isEditor(node) ? EDITOR_TO_ELEMENT.get(editor) : KEY_TO_ELEMENT === null || KEY_TO_ELEMENT === void 0 ? void 0 : KEY_TO_ELEMENT.get(ReactEditor.findKey(editor, node));

    if (!domNode) {
      throw new Error("Cannot resolve a DOM node from Slate node: ".concat(slate.Scrubber.stringify(node)));
    }

    return domNode;
  },

  /**
   * Find a native DOM selection point from a Slate point.
   */
  toDOMPoint: function toDOMPoint(editor, point) {
    var _Editor$node = slate.Editor.node(editor, point.path),
        _Editor$node2 = _slicedToArray(_Editor$node, 1),
        node = _Editor$node2[0];

    var el = ReactEditor.toDOMNode(editor, node);
    var domPoint; // If we're inside a void node, force the offset to 0, otherwise the zero
    // width spacing character will result in an incorrect offset of 1

    if (slate.Editor["void"](editor, {
      at: point
    })) {
      point = {
        path: point.path,
        offset: 0
      };
    } // For each leaf, we need to isolate its content, which means filtering
    // to its direct text and zero-width spans. (We have to filter out any
    // other siblings that may have been rendered alongside them.)


    var selector = "[data-slate-string], [data-slate-zero-width]";
    var texts = Array.from(el.querySelectorAll(selector));
    var start = 0;

    for (var _i = 0, _texts = texts; _i < _texts.length; _i++) {
      var text = _texts[_i];
      var domNode = text.childNodes[0];

      if (domNode == null || domNode.textContent == null) {
        continue;
      }

      var length = domNode.textContent.length;
      var attr = text.getAttribute('data-slate-length');
      var trueLength = attr == null ? length : parseInt(attr, 10);
      var end = start + trueLength;

      if (point.offset <= end) {
        var offset = Math.min(length, Math.max(0, point.offset - start));
        domPoint = [domNode, offset];
        break;
      }

      start = end;
    }

    if (!domPoint) {
      throw new Error("Cannot resolve a DOM point from Slate point: ".concat(slate.Scrubber.stringify(point)));
    }

    return domPoint;
  },

  /**
   * Find a native DOM range from a Slate `range`.
   *
   * Notice: the returned range will always be ordinal regardless of the direction of Slate `range` due to DOM API limit.
   *
   * there is no way to create a reverse DOM Range using Range.setStart/setEnd
   * according to https://dom.spec.whatwg.org/#concept-range-bp-set.
   */
  toDOMRange: function toDOMRange(editor, range) {
    var anchor = range.anchor,
        focus = range.focus;
    var isBackward = slate.Range.isBackward(range);
    var domAnchor = ReactEditor.toDOMPoint(editor, anchor);
    var domFocus = slate.Range.isCollapsed(range) ? domAnchor : ReactEditor.toDOMPoint(editor, focus);
    var window = ReactEditor.getWindow(editor);
    var domRange = window.document.createRange();

    var _ref = isBackward ? domFocus : domAnchor,
        _ref2 = _slicedToArray(_ref, 2),
        startNode = _ref2[0],
        startOffset = _ref2[1];

    var _ref3 = isBackward ? domAnchor : domFocus,
        _ref4 = _slicedToArray(_ref3, 2),
        endNode = _ref4[0],
        endOffset = _ref4[1]; // A slate Point at zero-width Leaf always has an offset of 0 but a native DOM selection at
    // zero-width node has an offset of 1 so we have to check if we are in a zero-width node and
    // adjust the offset accordingly.


    var startEl = isDOMElement(startNode) ? startNode : startNode.parentElement;
    var isStartAtZeroWidth = !!startEl.getAttribute('data-slate-zero-width');
    var endEl = isDOMElement(endNode) ? endNode : endNode.parentElement;
    var isEndAtZeroWidth = !!endEl.getAttribute('data-slate-zero-width');
    domRange.setStart(startNode, isStartAtZeroWidth ? 1 : startOffset);
    domRange.setEnd(endNode, isEndAtZeroWidth ? 1 : endOffset);
    return domRange;
  },

  /**
   * Find a Slate node from a native DOM `element`.
   */
  toSlateNode: function toSlateNode(editor, domNode) {
    var domEl = isDOMElement(domNode) ? domNode : domNode.parentElement;

    if (domEl && !domEl.hasAttribute('data-slate-node')) {
      domEl = domEl.closest("[data-slate-node]");
    }

    var node = domEl ? ELEMENT_TO_NODE.get(domEl) : null;

    if (!node) {
      throw new Error("Cannot resolve a Slate node from DOM node: ".concat(domEl));
    }

    return node;
  },

  /**
   * Get the target range from a DOM `event`.
   */
  findEventRange: function findEventRange(editor, event) {
    if ('nativeEvent' in event) {
      event = event.nativeEvent;
    }

    var _event = event,
        x = _event.clientX,
        y = _event.clientY,
        target = _event.target;

    if (x == null || y == null) {
      throw new Error("Cannot resolve a Slate range from a DOM event: ".concat(event));
    }

    var node = ReactEditor.toSlateNode(editor, event.target);
    var path = ReactEditor.findPath(editor, node); // If the drop target is inside a void node, move it into either the
    // next or previous node, depending on which side the `x` and `y`
    // coordinates are closest to.

    if (slate.Editor.isVoid(editor, node)) {
      var rect = target.getBoundingClientRect();
      var isPrev = editor.isInline(node) ? x - rect.left < rect.left + rect.width - x : y - rect.top < rect.top + rect.height - y;
      var edge = slate.Editor.point(editor, path, {
        edge: isPrev ? 'start' : 'end'
      });
      var point = isPrev ? slate.Editor.before(editor, edge) : slate.Editor.after(editor, edge);

      if (point) {
        var _range = slate.Editor.range(editor, point);

        return _range;
      }
    } // Else resolve a range from the caret position where the drop occured.


    var domRange;

    var _ReactEditor$getWindo = ReactEditor.getWindow(editor),
        document = _ReactEditor$getWindo.document; // COMPAT: In Firefox, `caretRangeFromPoint` doesn't exist. (2016/07/25)


    if (document.caretRangeFromPoint) {
      domRange = document.caretRangeFromPoint(x, y);
    } else {
      var position = document.caretPositionFromPoint(x, y);

      if (position) {
        domRange = document.createRange();
        domRange.setStart(position.offsetNode, position.offset);
        domRange.setEnd(position.offsetNode, position.offset);
      }
    }

    if (!domRange) {
      throw new Error("Cannot resolve a Slate range from a DOM event: ".concat(event));
    } // Resolve a Slate range from the DOM range.


    var range = ReactEditor.toSlateRange(editor, domRange, {
      exactMatch: false,
      suppressThrow: false
    });
    return range;
  },

  /**
   * Find a Slate point from a DOM selection's `domNode` and `domOffset`.
   */
  toSlatePoint: function toSlatePoint(editor, domPoint, options) {
    var exactMatch = options.exactMatch,
        suppressThrow = options.suppressThrow;

    var _ref5 = exactMatch ? domPoint : normalizeDOMPoint(domPoint),
        _ref6 = _slicedToArray(_ref5, 2),
        nearestNode = _ref6[0],
        nearestOffset = _ref6[1];

    var parentNode = nearestNode.parentNode;
    var textNode = null;
    var offset = 0;

    if (parentNode) {
      var _domNode$textContent;

      var editorEl = ReactEditor.toDOMNode(editor, editor);
      var potentialVoidNode = parentNode.closest('[data-slate-void="true"]'); // Need to ensure that the closest void node is actually a void node
      // within this editor, and not a void node within some parent editor. This can happen
      // if this editor is within a void node of another editor ("nested editors", like in
      // the "Editable Voids" example on the docs site).

      var voidNode = potentialVoidNode && editorEl.contains(potentialVoidNode) ? potentialVoidNode : null;
      var leafNode = parentNode.closest('[data-slate-leaf]');
      var domNode = null; // Calculate how far into the text node the `nearestNode` is, so that we
      // can determine what the offset relative to the text node is.

      if (leafNode) {
        textNode = leafNode.closest('[data-slate-node="text"]');

        if (textNode) {
          var window = ReactEditor.getWindow(editor);
          var range = window.document.createRange();
          range.setStart(textNode, 0);
          range.setEnd(nearestNode, nearestOffset);
          var contents = range.cloneContents();
          var removals = [].concat(_toConsumableArray(Array.prototype.slice.call(contents.querySelectorAll('[data-slate-zero-width]'))), _toConsumableArray(Array.prototype.slice.call(contents.querySelectorAll('[contenteditable=false]'))));
          removals.forEach(function (el) {
            el.parentNode.removeChild(el);
          }); // COMPAT: Edge has a bug where Range.prototype.toString() will
          // convert \n into \r\n. The bug causes a loop when slate-react
          // attempts to reposition its cursor to match the native position. Use
          // textContent.length instead.
          // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/10291116/

          offset = contents.textContent.length;
          domNode = textNode;
        }
      } else if (voidNode) {
        // For void nodes, the element with the offset key will be a cousin, not an
        // ancestor, so find it by going down from the nearest void parent.
        leafNode = voidNode.querySelector('[data-slate-leaf]'); // COMPAT: In read-only editors the leaf is not rendered.

        if (!leafNode) {
          offset = 1;
        } else {
          textNode = leafNode.closest('[data-slate-node="text"]');
          domNode = leafNode;
          offset = domNode.textContent.length;
          domNode.querySelectorAll('[data-slate-zero-width]').forEach(function (el) {
            offset -= el.textContent.length;
          });
        }
      }

      if (domNode && offset === domNode.textContent.length && (parentNode.hasAttribute('data-slate-zero-width') || IS_FIREFOX && (_domNode$textContent = domNode.textContent) !== null && _domNode$textContent !== void 0 && _domNode$textContent.endsWith('\n\n'))) {
        offset--;
      }
    }

    if (!textNode) {
      if (suppressThrow) {
        return null;
      }

      throw new Error("Cannot resolve a Slate point from DOM point: ".concat(domPoint));
    } // COMPAT: If someone is clicking from one Slate editor into another,
    // the select event fires twice, once for the old editor's `element`
    // first, and then afterwards for the correct `element`. (2017/03/03)


    var slateNode = ReactEditor.toSlateNode(editor, textNode);
    var path = ReactEditor.findPath(editor, slateNode);
    return {
      path: path,
      offset: offset
    };
  },

  /**
   * Find a Slate range from a DOM range or selection.
   */
  toSlateRange: function toSlateRange(editor, domRange, options) {
    var exactMatch = options.exactMatch,
        suppressThrow = options.suppressThrow;
    var el = isDOMSelection(domRange) ? domRange.anchorNode : domRange.startContainer;
    var anchorNode;
    var anchorOffset;
    var focusNode;
    var focusOffset;
    var isCollapsed;

    if (el) {
      if (isDOMSelection(domRange)) {
        anchorNode = domRange.anchorNode;
        anchorOffset = domRange.anchorOffset;
        focusNode = domRange.focusNode;
        focusOffset = domRange.focusOffset; // COMPAT: There's a bug in chrome that always returns `true` for
        // `isCollapsed` for a Selection that comes from a ShadowRoot.
        // (2020/08/08)
        // https://bugs.chromium.org/p/chromium/issues/detail?id=447523

        if (IS_CHROME && hasShadowRoot()) {
          isCollapsed = domRange.anchorNode === domRange.focusNode && domRange.anchorOffset === domRange.focusOffset;
        } else {
          isCollapsed = domRange.isCollapsed;
        }
      } else {
        anchorNode = domRange.startContainer;
        anchorOffset = domRange.startOffset;
        focusNode = domRange.endContainer;
        focusOffset = domRange.endOffset;
        isCollapsed = domRange.collapsed;
      }
    }

    if (anchorNode == null || focusNode == null || anchorOffset == null || focusOffset == null) {
      throw new Error("Cannot resolve a Slate range from DOM range: ".concat(domRange));
    }

    var anchor = ReactEditor.toSlatePoint(editor, [anchorNode, anchorOffset], {
      exactMatch: exactMatch,
      suppressThrow: suppressThrow
    });

    if (!anchor) {
      return null;
    }

    var focus = isCollapsed ? anchor : ReactEditor.toSlatePoint(editor, [focusNode, focusOffset], {
      exactMatch: exactMatch,
      suppressThrow: suppressThrow
    });

    if (!focus) {
      return null;
    }

    var range = {
      anchor: anchor,
      focus: focus
    }; // if the selection is a hanging range that ends in a void
    // and the DOM focus is an Element
    // (meaning that the selection ends before the element)
    // unhang the range to avoid mistakenly including the void

    if (slate.Range.isExpanded(range) && slate.Range.isForward(range) && isDOMElement(focusNode) && slate.Editor["void"](editor, {
      at: range.focus,
      mode: 'highest'
    })) {
      range = slate.Editor.unhangRange(editor, range, {
        voids: true
      });
    }

    return range;
  },
  hasRange: function hasRange(editor, range) {
    var anchor = range.anchor,
        focus = range.focus;
    return slate.Editor.hasPath(editor, anchor.path) && slate.Editor.hasPath(editor, focus.path);
  }
};

function gatherMutationData(editor, mutations) {
  var addedNodes = [];
  var removedNodes = [];
  var insertedText = [];
  var characterDataMutations = [];
  mutations.forEach(function (mutation) {
    switch (mutation.type) {
      case 'childList':
        {
          if (mutation.addedNodes.length) {
            mutation.addedNodes.forEach(function (addedNode) {
              addedNodes.push(addedNode);
            });
          }

          mutation.removedNodes.forEach(function (removedNode) {
            removedNodes.push(removedNode);
          });
          break;
        }

      case 'characterData':
        {
          characterDataMutations.push(mutation); // Changes to text nodes should consider the parent element

          var parentNode = mutation.target.parentNode;

          if (!parentNode) {
            return;
          }

          var textInsertion = getTextInsertion(editor, parentNode);

          if (!textInsertion) {
            return;
          } // If we've already detected a diff at that path, we can return early


          if (insertedText.some(function (_ref) {
            var path = _ref.path;
            return slate.Path.equals(path, textInsertion.path);
          })) {
            return;
          } // Add the text diff to the array of detected text insertions that need to be reconciled


          insertedText.push(textInsertion);
        }
    }
  });
  return {
    addedNodes: addedNodes,
    removedNodes: removedNodes,
    insertedText: insertedText,
    characterDataMutations: characterDataMutations
  };
}
/**
 * In general, when a line break occurs, there will be more `addedNodes` than `removedNodes`.
 *
 * This isn't always the case however. In some cases, there will be more `removedNodes` than
 * `addedNodes`.
 *
 * To account for these edge cases, the most reliable strategy to detect line break mutations
 * is to check whether a new block was inserted of the same type as the current block.
 */

var isLineBreak = function isLineBreak(editor, _ref2) {
  var addedNodes = _ref2.addedNodes;
  var selection = editor.selection;
  var parentNode = selection ? slate.Node.parent(editor, selection.anchor.path) : null;
  var parentDOMNode = parentNode ? ReactEditor.toDOMNode(editor, parentNode) : null;

  if (!parentDOMNode) {
    return false;
  }

  return addedNodes.some(function (addedNode) {
    return addedNode instanceof HTMLElement && addedNode.tagName === (parentDOMNode === null || parentDOMNode === void 0 ? void 0 : parentDOMNode.tagName);
  });
};
/**
 * So long as we check for line break mutations before deletion mutations,
 * we can safely assume that a set of mutations was a deletion if there are
 * removed nodes.
 */

var isDeletion = function isDeletion(_, _ref3) {
  var removedNodes = _ref3.removedNodes;
  return removedNodes.length > 0;
};
/**
 * If the selection was expanded and there are removed nodes,
 * the contents of the selection need to be replaced with the diff
 */

var isReplaceExpandedSelection = function isReplaceExpandedSelection(_ref4, _ref5) {
  var selection = _ref4.selection;
  var removedNodes = _ref5.removedNodes;
  return selection ? slate.Range.isExpanded(selection) && removedNodes.length > 0 : false;
};
/**
 * Plain text insertion
 */

var isTextInsertion = function isTextInsertion(_, _ref6) {
  var insertedText = _ref6.insertedText;
  return insertedText.length > 0;
};
/**
 * Edge case. Detect mutations that remove leaf nodes and also update character data
 */

var isRemoveLeafNodes = function isRemoveLeafNodes(_, _ref7) {
  var addedNodes = _ref7.addedNodes,
      characterDataMutations = _ref7.characterDataMutations,
      removedNodes = _ref7.removedNodes;
  return removedNodes.length > 0 && addedNodes.length === 0 && characterDataMutations.length > 0;
};

function _createForOfIteratorHelper$1(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$1(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray$1(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$1(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen); }

function _arrayLikeToArray$1(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
/**
 * Based loosely on:
 *
 * https://github.com/facebook/draft-js/blob/master/src/component/handlers/composition/DOMObserver.js
 * https://github.com/ProseMirror/prosemirror-view/blob/master/src/domobserver.js
 *
 * The input manager attempts to map observed mutations on the document to a
 * set of operations in order to reconcile Slate's internal value with the DOM.
 *
 * Mutations are processed synchronously as they come in. Only mutations that occur
 * during a user input loop are processed, as other mutations can occur within the
 * document that were not initiated by user input.
 *
 * The mutation reconciliation process attempts to match mutations to the following
 * patterns:
 *
 * - Text updates
 * - Deletions
 * - Line breaks
 *
 * @param editor
 * @param restoreDOM
 */


var AndroidInputManager = function AndroidInputManager(editor, restoreDOM) {
  var _this = this;

  _classCallCheck(this, AndroidInputManager);

  this.editor = editor;
  this.restoreDOM = restoreDOM;
  /**
   * Handle MutationObserver flush
   *
   * @param mutations
   */

  this.flush = function (mutations) {

    try {
      _this.reconcileMutations(mutations);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err); // Failed to reconcile mutations, restore DOM to its previous state

      _this.restoreDOM();
    }
  };
  /**
   * Reconcile a batch of mutations
   *
   * @param mutations
   */


  this.reconcileMutations = function (mutations) {
    var mutationData = gatherMutationData(_this.editor, mutations);
    var insertedText = mutationData.insertedText,
        removedNodes = mutationData.removedNodes;

    if (isReplaceExpandedSelection(_this.editor, mutationData)) {
      var text = combineInsertedText(insertedText);

      _this.replaceExpandedSelection(text);
    } else if (isLineBreak(_this.editor, mutationData)) {
      _this.insertBreak();
    } else if (isRemoveLeafNodes(_this.editor, mutationData)) {
      _this.removeLeafNodes(removedNodes);
    } else if (isDeletion(_this.editor, mutationData)) {
      _this.deleteBackward();
    } else if (isTextInsertion(_this.editor, mutationData)) {
      _this.insertText(insertedText);
    }
  };
  /**
   * Apply text diff
   */


  this.insertText = function (insertedText) {
    var selection = _this.editor.selection; // If it is in composing or after `onCompositionend`, set `EDITOR_ON_COMPOSITION_TEXT` and return.
    // Text will be inserted on compositionend event.

    if (ReactEditor.isComposing(_this.editor) || IS_ON_COMPOSITION_END.get(_this.editor)) {
      EDITOR_ON_COMPOSITION_TEXT.set(_this.editor, insertedText);
      IS_ON_COMPOSITION_END.set(_this.editor, false);
      return;
    } // Insert the batched text diffs


    insertedText.forEach(function (insertion) {
      var text = insertion.text.insertText;
      var at = normalizeTextInsertionRange(_this.editor, selection, insertion);
      slate.Transforms.setSelection(_this.editor, at);
      slate.Editor.insertText(_this.editor, text);
    });
  };
  /**
   * Handle line breaks
   */


  this.insertBreak = function () {
    var selection = _this.editor.selection;
    slate.Editor.insertBreak(_this.editor);

    _this.restoreDOM();

    if (selection) {
      // Compat: Move selection to the newly inserted block if it has not moved
      setTimeout(function () {
        if (_this.editor.selection && slate.Range.equals(selection, _this.editor.selection)) {
          slate.Transforms.move(_this.editor);
        }
      }, 100);
    }
  };
  /**
   * Handle expanded selection being deleted or replaced by text
   */


  this.replaceExpandedSelection = function (text) {

    slate.Editor.deleteFragment(_this.editor);

    if (text.length) {
      // Selection was replaced by text, insert the entire text diff
      slate.Editor.insertText(_this.editor, text);
    }

    _this.restoreDOM();
  };
  /**
   * Handle `backspace` that merges blocks
   */


  this.deleteBackward = function () {
    slate.Editor.deleteBackward(_this.editor);
    ReactEditor.focus(_this.editor);

    _this.restoreDOM();
  };
  /**
   * Handle mutations that remove specific leaves
   */


  this.removeLeafNodes = function (nodes) {
    var _iterator = _createForOfIteratorHelper$1(nodes),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var node = _step.value;
        var slateNode = ReactEditor.toSlateNode(_this.editor, node);

        if (slateNode) {
          var path = ReactEditor.findPath(_this.editor, slateNode);
          slate.Transforms["delete"](_this.editor, {
            at: path
          });

          _this.restoreDOM();
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  };

  this.editor = editor;
  this.restoreDOM = restoreDOM;
};

function useMutationObserver(node, callback, options) {
  var _useState = React.useState(function () {
    return new MutationObserver(callback);
  }),
      _useState2 = _slicedToArray(_useState, 1),
      mutationObserver = _useState2[0];

  useIsomorphicLayoutEffect(function () {
    // Disconnect mutation observer during render phase
    mutationObserver.disconnect();
  });
  React.useEffect(function () {
    if (!node.current) {
      throw new Error('Failed to attach MutationObserver, `node` is undefined');
    } // Attach mutation observer after render phase has finished


    mutationObserver.observe(node.current, options); // Clean up after effect

    return mutationObserver.disconnect.bind(mutationObserver);
  });
}

var MUTATION_OBSERVER_CONFIG$1 = {
  childList: true,
  characterData: true,
  subtree: true
};

function findClosestKnowSlateNode(domNode) {
  var _domEl;

  var domEl = isDOMElement(domNode) ? domNode : domNode.parentElement;

  if (domEl && !domEl.hasAttribute('data-slate-node')) {
    domEl = domEl.closest("[data-slate-node]");
  }

  var slateNode = domEl && ELEMENT_TO_NODE.get(domEl);

  if (slateNode) {
    return slateNode;
  } // Unknown dom element with a slate-slate-node attribute => the IME
  // most likely duplicated the node so we have to restore the parent


  return (_domEl = domEl) !== null && _domEl !== void 0 && _domEl.parentElement ? findClosestKnowSlateNode(domEl.parentElement) : null;
}

function useRestoreDom(node, receivedUserInput) {
  var editor = useSlateStatic();
  var mutatedNodes = React.useRef(new Set());
  var handleDOMMutation = React.useCallback(function (mutations) {
    if (!receivedUserInput.current) {
      return;
    }

    mutations.forEach(function (_ref) {
      var target = _ref.target;
      var slateNode = findClosestKnowSlateNode(target);

      if (!slateNode) {
        return;
      }

      return mutatedNodes.current.add(slateNode);
    });
  }, []);
  useMutationObserver(node, handleDOMMutation, MUTATION_OBSERVER_CONFIG$1); // Clear mutated nodes on every render

  mutatedNodes.current.clear();
  var restore = React.useCallback(function () {
    var mutated = Array.from(mutatedNodes.current.values()); // Filter out child nodes of nodes that will be restored anyway

    var nodesToRestore = mutated.filter(function (n) {
      return !mutated.some(function (m) {
        return slate.Path.isParent(ReactEditor.findPath(editor, m), ReactEditor.findPath(editor, n));
      });
    });
    nodesToRestore.forEach(function (n) {
      var _NODE_TO_RESTORE_DOM$;

      (_NODE_TO_RESTORE_DOM$ = NODE_TO_RESTORE_DOM.get(n)) === null || _NODE_TO_RESTORE_DOM$ === void 0 ? void 0 : _NODE_TO_RESTORE_DOM$();
    });
    mutatedNodes.current.clear();
  }, []);
  return restore;
}

function useTrackUserInput() {
  var editor = useSlateStatic();
  var receivedUserInput = React.useRef(false);
  var animationFrameRef = React.useRef(null);
  var onUserInput = React.useCallback(function () {
    if (receivedUserInput.current === false) {
      var window = ReactEditor.getWindow(editor);
      receivedUserInput.current = true;

      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = window.requestAnimationFrame(function () {
        receivedUserInput.current = false;
        animationFrameRef.current = null;
      });
    }
  }, []);
  React.useEffect(function () {
    // Reset user input tracking on every render
    if (receivedUserInput.current) {
      receivedUserInput.current = false;
    }
  });
  return {
    receivedUserInput: receivedUserInput,
    onUserInput: onUserInput
  };
}

var MUTATION_OBSERVER_CONFIG = {
  childList: true,
  characterData: true,
  characterDataOldValue: true,
  subtree: true
};
function useAndroidInputManager(node) {
  var editor = useSlateStatic();

  var _useTrackUserInput = useTrackUserInput(),
      receivedUserInput = _useTrackUserInput.receivedUserInput,
      onUserInput = _useTrackUserInput.onUserInput;

  var restoreDom = useRestoreDom(node, receivedUserInput);
  var inputManager = React.useMemo(function () {
    return new AndroidInputManager(editor, restoreDom);
  }, [restoreDom, editor]);
  var timeoutId = React.useRef(null);
  var isReconciling = React.useRef(false);
  var flush = React.useCallback(function (mutations) {
    if (!receivedUserInput.current) {
      return;
    }

    isReconciling.current = true;
    inputManager.flush(mutations);

    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    timeoutId.current = setTimeout(function () {
      isReconciling.current = false;
      timeoutId.current = null;
    }, 250);
  }, []);
  useMutationObserver(node, flush, MUTATION_OBSERVER_CONFIG);
  return {
    isReconciling: isReconciling,
    onUserInput: onUserInput
  };
}

var _excluded$1 = ["autoFocus", "decorate", "onDOMBeforeInput", "placeholder", "readOnly", "renderElement", "renderLeaf", "renderPlaceholder", "style", "as"];

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
/**
 * Editable.
 */
// https://github.com/facebook/draft-js/blob/main/src/component/handlers/composition/DraftEditorCompositionHandler.js#L41
// When using keyboard English association function, conpositionEnd triggered too fast, resulting in after `insertText` still maintain association state.

var RESOLVE_DELAY = 20;
var AndroidEditable = function AndroidEditable(props) {
  var autoFocus = props.autoFocus,
      _props$decorate = props.decorate,
      decorate = _props$decorate === void 0 ? defaultDecorate : _props$decorate,
      propsOnDOMBeforeInput = props.onDOMBeforeInput,
      placeholder = props.placeholder,
      _props$readOnly = props.readOnly,
      readOnly = _props$readOnly === void 0 ? false : _props$readOnly,
      renderElement = props.renderElement,
      renderLeaf = props.renderLeaf,
      _props$renderPlacehol = props.renderPlaceholder,
      renderPlaceholder = _props$renderPlacehol === void 0 ? function (props) {
    return /*#__PURE__*/React__default['default'].createElement(DefaultPlaceholder, Object.assign({}, props));
  } : _props$renderPlacehol,
      _props$style = props.style,
      style = _props$style === void 0 ? {} : _props$style,
      _props$as = props.as,
      Component = _props$as === void 0 ? 'div' : _props$as,
      attributes = _objectWithoutProperties(props, _excluded$1);

  var editor = useSlate(); // Rerender editor when composition status changed

  var _useState = React.useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      isComposing = _useState2[0],
      setIsComposing = _useState2[1];

  var ref = React.useRef(null);
  var inputManager = useAndroidInputManager(ref); // Update internal state on each render.

  IS_READ_ONLY.set(editor, readOnly); // Keep track of some state for the event handler logic.

  var state = React.useMemo(function () {
    return {
      isComposing: false,
      isUpdatingSelection: false,
      latestElement: null
    };
  }, []);
  var contentKey = useContentKey(editor); // Whenever the editor updates...

  useIsomorphicLayoutEffect(function () {
    // Update element-related weak maps with the DOM element ref.
    var window;

    if (ref.current && (window = getDefaultView(ref.current))) {
      EDITOR_TO_WINDOW.set(editor, window);
      EDITOR_TO_ELEMENT.set(editor, ref.current);
      NODE_TO_ELEMENT.set(editor, ref.current);
      ELEMENT_TO_NODE.set(ref.current, editor);
    } else {
      NODE_TO_ELEMENT["delete"](editor);
    }

    try {
      // Make sure the DOM selection state is in sync.
      var selection = editor.selection;
      var root = ReactEditor.findDocumentOrShadowRoot(editor);
      var domSelection = root.getSelection();

      if (state.isComposing || !domSelection || !ReactEditor.isFocused(editor)) {
        return;
      }

      var hasDomSelection = domSelection.type !== 'None'; // If the DOM selection is properly unset, we're done.

      if (!selection && !hasDomSelection) {
        return;
      } // verify that the dom selection is in the editor


      var editorElement = EDITOR_TO_ELEMENT.get(editor);
      var hasDomSelectionInEditor = false;

      if (editorElement.contains(domSelection.anchorNode) && editorElement.contains(domSelection.focusNode)) {
        hasDomSelectionInEditor = true;
      } // If the DOM selection is in the editor and the editor selection is already correct, we're done.


      if (hasDomSelection && hasDomSelectionInEditor && selection) {
        var slateRange = ReactEditor.toSlateRange(editor, domSelection, {
          exactMatch: true,
          suppressThrow: true
        });

        if (slateRange && slate.Range.equals(slateRange, selection)) {
          return;
        }
      } // when <Editable/> is being controlled through external value
      // then its children might just change - DOM responds to it on its own
      // but Slate's value is not being updated through any operation
      // and thus it doesn't transform selection on its own


      if (selection && !ReactEditor.hasRange(editor, selection)) {
        editor.selection = ReactEditor.toSlateRange(editor, domSelection, {
          exactMatch: false,
          suppressThrow: false
        });
        return;
      } // Otherwise the DOM selection is out of sync, so update it.


      var el = ReactEditor.toDOMNode(editor, editor);
      state.isUpdatingSelection = true;
      var newDomRange = selection && ReactEditor.toDOMRange(editor, selection);

      if (newDomRange) {
        if (slate.Range.isBackward(selection)) {
          domSelection.setBaseAndExtent(newDomRange.endContainer, newDomRange.endOffset, newDomRange.startContainer, newDomRange.startOffset);
        } else {
          domSelection.setBaseAndExtent(newDomRange.startContainer, newDomRange.startOffset, newDomRange.endContainer, newDomRange.endOffset);
        }

        var leafEl = newDomRange.startContainer.parentElement;
        leafEl.getBoundingClientRect = newDomRange.getBoundingClientRect.bind(newDomRange);
        scrollIntoView__default['default'](leafEl, {
          scrollMode: 'if-needed',
          boundary: el
        }); // @ts-ignore

        delete leafEl.getBoundingClientRect;
      } else {
        domSelection.removeAllRanges();
      }

      setTimeout(function () {
        state.isUpdatingSelection = false;
      });
    } catch (_unused) {
      // Failed to update selection, likely due to reconciliation error
      state.isUpdatingSelection = false;
    }
  }); // The autoFocus TextareaHTMLAttribute doesn't do anything on a div, so it
  // needs to be manually focused.

  React.useEffect(function () {
    if (ref.current && autoFocus) {
      ref.current.focus();
    }
  }, [autoFocus]); // Listen on the native `selectionchange` event to be able to update any time
  // the selection changes. This is required because React's `onSelect` is leaky
  // and non-standard so it doesn't fire until after a selection has been
  // released. This causes issues in situations where another change happens
  // while a selection is being dragged.

  var onDOMSelectionChange = React.useCallback(throttle__default['default'](function () {
    try {
      if (!state.isComposing && !state.isUpdatingSelection && !inputManager.isReconciling.current) {
        var root = ReactEditor.findDocumentOrShadowRoot(editor);
        var activeElement = root.activeElement;
        var el = ReactEditor.toDOMNode(editor, editor);
        var domSelection = root.getSelection();

        if (activeElement === el) {
          state.latestElement = activeElement;
          IS_FOCUSED.set(editor, true);
        } else {
          IS_FOCUSED["delete"](editor);
        }

        if (!domSelection) {
          return slate.Transforms.deselect(editor);
        }

        var anchorNode = domSelection.anchorNode,
            focusNode = domSelection.focusNode;
        var anchorNodeSelectable = hasEditableTarget(editor, anchorNode) || isTargetInsideNonReadonlyVoid(editor, anchorNode);
        var focusNodeSelectable = hasEditableTarget(editor, focusNode) || isTargetInsideNonReadonlyVoid(editor, focusNode);

        if (anchorNodeSelectable && focusNodeSelectable) {
          var range = ReactEditor.toSlateRange(editor, domSelection, {
            exactMatch: false,
            suppressThrow: false
          });
          slate.Transforms.select(editor, range);
        } else {
          slate.Transforms.deselect(editor);
        }
      }
    } catch (_unused2) {// Failed to update selection, likely due to reconciliation error
    }
  }, 100), [readOnly]);
  var scheduleOnDOMSelectionChange = React.useMemo(function () {
    return debounce__default['default'](onDOMSelectionChange, 0);
  }, [onDOMSelectionChange]); // Listen on the native `beforeinput` event to get real "Level 2" events. This
  // is required because React's `beforeinput` is fake and never really attaches
  // to the real event sadly. (2019/11/01)
  // https://github.com/facebook/react/issues/11211

  var onDOMBeforeInput = React.useCallback(function (event) {
    if (!readOnly && hasEditableTarget(editor, event.target) && !isDOMEventHandled(event, propsOnDOMBeforeInput)) {
      // Some IMEs/Chrome extensions like e.g. Grammarly set the selection immediately before
      // triggering a `beforeinput` expecting the change to be applied to the immediately before
      // set selection.
      scheduleOnDOMSelectionChange.flush();
      inputManager.onUserInput();
    }
  }, [readOnly, propsOnDOMBeforeInput]); // Attach a native DOM event handler for `beforeinput` events, because React's
  // built-in `onBeforeInput` is actually a leaky polyfill that doesn't expose
  // real `beforeinput` events sadly... (2019/11/04)

  useIsomorphicLayoutEffect(function () {
    var node = ref.current; // @ts-ignore The `beforeinput` event isn't recognized.

    node === null || node === void 0 ? void 0 : node.addEventListener('beforeinput', onDOMBeforeInput); // @ts-ignore The `beforeinput` event isn't recognized.

    return function () {
      return node === null || node === void 0 ? void 0 : node.removeEventListener('beforeinput', onDOMBeforeInput);
    };
  }, [contentKey, propsOnDOMBeforeInput]); // Attach a native DOM event handler for `selectionchange`, because React's
  // built-in `onSelect` handler doesn't fire for all selection changes. It's a
  // leaky polyfill that only fires on keypresses or clicks. Instead, we want to
  // fire for any change to the selection inside the editor. (2019/11/04)
  // https://github.com/facebook/react/issues/5785

  useIsomorphicLayoutEffect(function () {
    var window = ReactEditor.getWindow(editor);
    window.document.addEventListener('selectionchange', scheduleOnDOMSelectionChange);
    return function () {
      window.document.removeEventListener('selectionchange', scheduleOnDOMSelectionChange);
    };
  }, [scheduleOnDOMSelectionChange]);
  var decorations = decorate([editor, []]);

  if (placeholder && editor.children.length === 1 && Array.from(slate.Node.texts(editor)).length === 1 && slate.Node.string(editor) === '' && !isComposing) {
    var _decorations$push;

    var start = slate.Editor.start(editor, []);
    decorations.push((_decorations$push = {}, _defineProperty(_decorations$push, PLACEHOLDER_SYMBOL, true), _defineProperty(_decorations$push, "placeholder", placeholder), _defineProperty(_decorations$push, "anchor", start), _defineProperty(_decorations$push, "focus", start), _decorations$push));
  }

  return /*#__PURE__*/React__default['default'].createElement(ReadOnlyContext.Provider, {
    value: readOnly
  }, /*#__PURE__*/React__default['default'].createElement(DecorateContext.Provider, {
    value: decorate
  }, /*#__PURE__*/React__default['default'].createElement(Component, Object.assign({
    key: contentKey,
    role: readOnly ? undefined : 'textbox'
  }, attributes, {
    spellCheck: attributes.spellCheck,
    autoCorrect: attributes.autoCorrect,
    autoCapitalize: attributes.autoCapitalize,
    "data-slate-editor": true,
    "data-slate-node": "value",
    contentEditable: readOnly ? undefined : true,
    suppressContentEditableWarning: true,
    ref: ref,
    style: _objectSpread({
      // Allow positioning relative to the editable element.
      position: 'relative',
      // Prevent the default outline styles.
      outline: 'none',
      // Preserve adjacent whitespace and new lines.
      whiteSpace: 'pre-wrap',
      // Allow words to break if they are too long.
      wordWrap: 'break-word'
    }, style),
    onCopy: React.useCallback(function (event) {
      if (hasEditableTarget(editor, event.target) && !isEventHandled(event, attributes.onCopy)) {
        event.preventDefault();
        ReactEditor.setFragmentData(editor, event.clipboardData, 'copy');
      }
    }, [attributes.onCopy]),
    onCut: React.useCallback(function (event) {
      if (!readOnly && hasEditableTarget(editor, event.target) && !isEventHandled(event, attributes.onCut)) {
        event.preventDefault();
        ReactEditor.setFragmentData(editor, event.clipboardData, 'cut');
        var selection = editor.selection;

        if (selection) {
          if (slate.Range.isExpanded(selection)) {
            slate.Editor.deleteFragment(editor);
          } else {
            var node = slate.Node.parent(editor, selection.anchor.path);

            if (slate.Editor.isVoid(editor, node)) {
              slate.Transforms["delete"](editor);
            }
          }
        }
      }
    }, [readOnly, attributes.onCut]),
    onFocus: React.useCallback(function (event) {
      if (!readOnly && !state.isUpdatingSelection && hasEditableTarget(editor, event.target) && !isEventHandled(event, attributes.onFocus)) {
        var root = ReactEditor.findDocumentOrShadowRoot(editor);
        state.latestElement = root.activeElement;
        IS_FOCUSED.set(editor, true);
      }
    }, [readOnly, attributes.onFocus]),
    onBlur: React.useCallback(function (event) {
      if (readOnly || state.isUpdatingSelection || !hasEditableTarget(editor, event.target) || isEventHandled(event, attributes.onBlur)) {
        return;
      } // COMPAT: If the current `activeElement` is still the previous
      // one, this is due to the window being blurred when the tab
      // itself becomes unfocused, so we want to abort early to allow to
      // editor to stay focused when the tab becomes focused again.


      var root = ReactEditor.findDocumentOrShadowRoot(editor);

      if (state.latestElement === root.activeElement) {
        return;
      }

      var relatedTarget = event.relatedTarget;
      var el = ReactEditor.toDOMNode(editor, editor); // COMPAT: The event should be ignored if the focus is returning
      // to the editor from an embedded editable element (eg. an <input>
      // element inside a void node).

      if (relatedTarget === el) {
        return;
      } // COMPAT: The event should be ignored if the focus is moving from
      // the editor to inside a void node's spacer element.


      if (isDOMElement(relatedTarget) && relatedTarget.hasAttribute('data-slate-spacer')) {
        return;
      } // COMPAT: The event should be ignored if the focus is moving to a
      // non- editable section of an element that isn't a void node (eg.
      // a list item of the check list example).


      if (relatedTarget != null && isDOMNode(relatedTarget) && ReactEditor.hasDOMNode(editor, relatedTarget)) {
        var node = ReactEditor.toSlateNode(editor, relatedTarget);

        if (slate.Element.isElement(node) && !editor.isVoid(node)) {
          return;
        }
      }

      IS_FOCUSED["delete"](editor);
    }, [readOnly, attributes.onBlur]),
    onClick: React.useCallback(function (event) {
      if (!readOnly && hasTarget(editor, event.target) && !isEventHandled(event, attributes.onClick) && isDOMNode(event.target)) {
        var node = ReactEditor.toSlateNode(editor, event.target);
        var path = ReactEditor.findPath(editor, node); // At this time, the Slate document may be arbitrarily different,
        // because onClick handlers can change the document before we get here.
        // Therefore we must check that this path actually exists,
        // and that it still refers to the same node.

        if (slate.Editor.hasPath(editor, path)) {
          var lookupNode = slate.Node.get(editor, path);

          if (lookupNode === node) {
            var _start = slate.Editor.start(editor, path);

            var end = slate.Editor.end(editor, path);
            var startVoid = slate.Editor["void"](editor, {
              at: _start
            });
            var endVoid = slate.Editor["void"](editor, {
              at: end
            });

            if (startVoid && endVoid && slate.Path.equals(startVoid[1], endVoid[1])) {
              var range = slate.Editor.range(editor, _start);
              slate.Transforms.select(editor, range);
            }
          }
        }
      }
    }, [readOnly, attributes.onClick]),
    onCompositionEnd: React.useCallback(function (event) {
      if (hasEditableTarget(editor, event.target) && !isEventHandled(event, attributes.onCompositionEnd)) {
        scheduleOnDOMSelectionChange.flush();
        setTimeout(function () {
          state.isComposing && setIsComposing(false);
          state.isComposing = false;
          IS_COMPOSING.set(editor, false);
          IS_ON_COMPOSITION_END.set(editor, true);
          var insertedText = EDITOR_ON_COMPOSITION_TEXT.get(editor) || []; // `insertedText` is set in `MutationObserver` constructor.
          // If open phone keyboard association function, `CompositionEvent` will be triggered.

          if (!insertedText.length) {
            return;
          }

          EDITOR_ON_COMPOSITION_TEXT.set(editor, []);
          var selection = editor.selection;
          insertedText.forEach(function (insertion) {
            var text = insertion.text.insertText;
            var at = normalizeTextInsertionRange(editor, selection, insertion);
            slate.Transforms.setSelection(editor, at);
            slate.Editor.insertText(editor, text);
          });
        }, RESOLVE_DELAY);
      }
    }, [attributes.onCompositionEnd]),
    onCompositionUpdate: React.useCallback(function (event) {
      if (hasEditableTarget(editor, event.target) && !isEventHandled(event, attributes.onCompositionUpdate)) {
        !state.isComposing && setIsComposing(true);
        state.isComposing = true;
        IS_COMPOSING.set(editor, true);
      }
    }, [attributes.onCompositionUpdate]),
    onCompositionStart: React.useCallback(function (event) {
      if (hasEditableTarget(editor, event.target) && !isEventHandled(event, attributes.onCompositionStart)) {
        !state.isComposing && setIsComposing(true);
        state.isComposing = true;
        IS_COMPOSING.set(editor, true);
      }
    }, [attributes.onCompositionStart]),
    onPaste: React.useCallback(function (event) {
      // this will make application/x-slate-fragment exist when onPaste attributes is passed
      event.clipboardData = getClipboardData(event.clipboardData); // This unfortunately needs to be handled with paste events instead.

      if (hasEditableTarget(editor, event.target) && !isEventHandled(event, attributes.onPaste) && !readOnly) {
        event.preventDefault();
        ReactEditor.insertData(editor, event.clipboardData);
      }
    }, [readOnly, attributes.onPaste])
  }), useChildren({
    decorations: decorations,
    node: editor,
    renderElement: renderElement,
    renderPlaceholder: renderPlaceholder,
    renderLeaf: renderLeaf,
    selection: editor.selection
  }))));
};

/**
 * A React context for sharing the `focused` state of the editor.
 */

var FocusedContext = /*#__PURE__*/React.createContext(false);
/**
 * Get the current `focused` state of the editor.
 */

var useFocused = function useFocused() {
  return React.useContext(FocusedContext);
};

function isError(error) {
  return error instanceof Error;
}
/**
 * A React context for sharing the editor selector context in a way to control rerenders
 */


var SlateSelectorContext = /*#__PURE__*/React.createContext({});

var refEquality = function refEquality(a, b) {
  return a === b;
};
/**
 * use redux style selectors to prevent rerendering on every keystroke.
 * Bear in mind rerendering can only prevented if the returned value is a value type or for reference types (e.g. objects and arrays) add a custom equality function.
 *
 * Example:
 * ```
 *  const isSelectionActive = useSlateSelector(editor => Boolean(editor.selection));
 * ```
 */


function useSlateSelector(selector) {
  var equalityFn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : refEquality;

  var _useReducer = React.useReducer(function (s) {
    return s + 1;
  }, 0),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      forceRender = _useReducer2[1];

  var context = React.useContext(SlateSelectorContext);

  if (!context) {
    throw new Error("The `useSlateSelector` hook must be used inside the <Slate> component's context.");
  }

  var getSlate = context.getSlate,
      addEventListener = context.addEventListener;
  var latestSubscriptionCallbackError = React.useRef();
  var latestSelector = React.useRef(function () {
    return null;
  });
  var latestSelectedState = React.useRef(null);
  var selectedState;

  try {
    if (selector !== latestSelector.current || latestSubscriptionCallbackError.current) {
      selectedState = selector(getSlate());
    } else {
      selectedState = latestSelectedState.current;
    }
  } catch (err) {
    if (latestSubscriptionCallbackError.current && isError(err)) {
      err.message += "\nThe error may be correlated with this previous error:\n".concat(latestSubscriptionCallbackError.current.stack, "\n\n");
    }

    throw err;
  }

  useIsomorphicLayoutEffect(function () {
    latestSelector.current = selector;
    latestSelectedState.current = selectedState;
    latestSubscriptionCallbackError.current = undefined;
  });
  useIsomorphicLayoutEffect(function () {
    function checkForUpdates() {
      try {
        var newSelectedState = latestSelector.current(getSlate());

        if (equalityFn(newSelectedState, latestSelectedState.current)) {
          return;
        }

        latestSelectedState.current = newSelectedState;
      } catch (err) {
        // we ignore all errors here, since when the component
        // is re-rendered, the selectors are called again, and
        // will throw again, if neither props nor store state
        // changed
        latestSubscriptionCallbackError.current = err;
      }

      forceRender();
    }

    var unsubscribe = addEventListener(checkForUpdates);
    checkForUpdates();
    return function () {
      return unsubscribe();
    };
  }, // don't rerender on equalityFn change since we want to be able to define it inline
  [addEventListener, getSlate]);
  return selectedState;
}
/**
 * Create selector context with editor updating on every editor change
 */

function getSelectorContext(editor) {
  var eventListeners = React.useRef([]).current;
  var slateRef = React.useRef({
    editor: editor
  }).current;
  var onChange = React.useCallback(function (editor) {
    slateRef.editor = editor;
    eventListeners.forEach(function (listener) {
      return listener(editor);
    });
  }, []);
  var selectorContext = React.useMemo(function () {
    return {
      getSlate: function getSlate() {
        return slateRef.editor;
      },
      addEventListener: function addEventListener(callback) {
        eventListeners.push(callback);
        return function () {
          eventListeners.splice(eventListeners.indexOf(callback), 1);
        };
      }
    };
  }, [eventListeners, slateRef]);
  return {
    selectorContext: selectorContext,
    onChange: onChange
  };
}

var _excluded = ["editor", "children", "onChange", "value"];
/**
 * A wrapper around the provider to handle `onChange` events, because the editor
 * is a mutable singleton so it won't ever register as "changed" otherwise.
 */

var Slate = function Slate(props) {
  var editor = props.editor,
      children = props.children,
      onChange = props.onChange,
      value = props.value,
      rest = _objectWithoutProperties(props, _excluded);

  var unmountRef = React.useRef(false);

  var _React$useState = React__default['default'].useState(function () {
    if (!slate.Node.isNodeList(value)) {
      throw new Error("[Slate] value is invalid! Expected a list of elements" + "but got: ".concat(slate.Scrubber.stringify(value)));
    }

    if (!slate.Editor.isEditor(editor)) {
      throw new Error("[Slate] editor is invalid! you passed:" + "".concat(slate.Scrubber.stringify(editor)));
    }

    editor.children = value;
    Object.assign(editor, rest);
    return [editor];
  }),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      context = _React$useState2[0],
      setContext = _React$useState2[1];

  var _getSelectorContext = getSelectorContext(editor),
      selectorContext = _getSelectorContext.selectorContext,
      handleSelectorChange = _getSelectorContext.onChange;

  var onContextChange = React.useCallback(function () {
    if (onChange) {
      onChange(editor.children);
    }

    setContext([editor]);
    handleSelectorChange(editor);
  }, [onChange]);
  EDITOR_TO_ON_CHANGE.set(editor, onContextChange);
  React.useEffect(function () {
    return function () {
      EDITOR_TO_ON_CHANGE.set(editor, function () {});
      unmountRef.current = true;
    };
  }, []);

  var _useState = React.useState(ReactEditor.isFocused(editor)),
      _useState2 = _slicedToArray(_useState, 2),
      isFocused = _useState2[0],
      setIsFocused = _useState2[1];

  React.useEffect(function () {
    setIsFocused(ReactEditor.isFocused(editor));
  });
  useIsomorphicLayoutEffect(function () {
    var fn = function fn() {
      return setIsFocused(ReactEditor.isFocused(editor));
    };

    if (IS_REACT_VERSION_17_OR_ABOVE) {
      // In React >= 17 onFocus and onBlur listen to the focusin and focusout events during the bubbling phase.
      // Therefore in order for <Editable />'s handlers to run first, which is necessary for ReactEditor.isFocused(editor)
      // to return the correct value, we have to listen to the focusin and focusout events without useCapture here.
      document.addEventListener('focusin', fn);
      document.addEventListener('focusout', fn);
      return function () {
        document.removeEventListener('focusin', fn);
        document.removeEventListener('focusout', fn);
      };
    } else {
      document.addEventListener('focus', fn, true);
      document.addEventListener('blur', fn, true);
      return function () {
        document.removeEventListener('focus', fn, true);
        document.removeEventListener('blur', fn, true);
      };
    }
  }, []);
  return /*#__PURE__*/React__default['default'].createElement(SlateSelectorContext.Provider, {
    value: selectorContext
  }, /*#__PURE__*/React__default['default'].createElement(SlateContext.Provider, {
    value: context
  }, /*#__PURE__*/React__default['default'].createElement(EditorContext.Provider, {
    value: editor
  }, /*#__PURE__*/React__default['default'].createElement(FocusedContext.Provider, {
    value: isFocused
  }, children))));
};

/**
 * Get the current editor object from the React context.
 * @deprecated Use useSlateStatic instead.
 */

var useEditor = function useEditor() {
  var editor = React.useContext(EditorContext);

  if (!editor) {
    throw new Error("The `useEditor` hook must be used inside the <Slate> component's context.");
  }

  return editor;
};

/**
 * Utilities for single-line deletion
 */

var doRectsIntersect = function doRectsIntersect(rect, compareRect) {
  var middle = (compareRect.top + compareRect.bottom) / 2;
  return rect.top <= middle && rect.bottom >= middle;
};

var areRangesSameLine = function areRangesSameLine(editor, range1, range2) {
  var rect1 = ReactEditor.toDOMRange(editor, range1).getBoundingClientRect();
  var rect2 = ReactEditor.toDOMRange(editor, range2).getBoundingClientRect();
  return doRectsIntersect(rect1, rect2) && doRectsIntersect(rect2, rect1);
};
/**
 * A helper utility that returns the end portion of a `Range`
 * which is located on a single line.
 *
 * @param {Editor} editor The editor object to compare against
 * @param {Range} parentRange The parent range to compare against
 * @returns {Range} A valid portion of the parentRange which is one a single line
 */


var findCurrentLineRange = function findCurrentLineRange(editor, parentRange) {
  var parentRangeBoundary = slate.Editor.range(editor, slate.Range.end(parentRange));
  var positions = Array.from(slate.Editor.positions(editor, {
    at: parentRange
  }));
  var left = 0;
  var right = positions.length;
  var middle = Math.floor(right / 2);

  if (areRangesSameLine(editor, slate.Editor.range(editor, positions[left]), parentRangeBoundary)) {
    return slate.Editor.range(editor, positions[left], parentRangeBoundary);
  }

  if (positions.length < 2) {
    return slate.Editor.range(editor, positions[positions.length - 1], parentRangeBoundary);
  }

  while (middle !== positions.length && middle !== left) {
    if (areRangesSameLine(editor, slate.Editor.range(editor, positions[middle]), parentRangeBoundary)) {
      right = middle;
    } else {
      left = middle;
    }

    middle = Math.floor((left + right) / 2);
  }

  return slate.Editor.range(editor, positions[right], parentRangeBoundary);
};

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
/**
 * `withReact` adds React and DOM specific behaviors to the editor.
 *
 * If you are using TypeScript, you must extend Slate's CustomTypes to use
 * this plugin.
 *
 * See https://docs.slatejs.org/concepts/11-typescript to learn how.
 */

var withReact = function withReact(editor) {
  var e = editor;
  var apply = e.apply,
      onChange = e.onChange,
      deleteBackward = e.deleteBackward; // The WeakMap which maps a key to a specific HTMLElement must be scoped to the editor instance to
  // avoid collisions between editors in the DOM that share the same value.

  EDITOR_TO_KEY_TO_ELEMENT.set(e, new WeakMap());

  e.deleteBackward = function (unit) {
    if (unit !== 'line') {
      return deleteBackward(unit);
    }

    if (editor.selection && slate.Range.isCollapsed(editor.selection)) {
      var parentBlockEntry = slate.Editor.above(editor, {
        match: function match(n) {
          return slate.Editor.isBlock(editor, n);
        },
        at: editor.selection
      });

      if (parentBlockEntry) {
        var _parentBlockEntry = _slicedToArray(parentBlockEntry, 2),
            parentBlockPath = _parentBlockEntry[1];

        var parentElementRange = slate.Editor.range(editor, parentBlockPath, editor.selection.anchor);
        var currentLineRange = findCurrentLineRange(e, parentElementRange);

        if (!slate.Range.isCollapsed(currentLineRange)) {
          slate.Transforms["delete"](editor, {
            at: currentLineRange
          });
        }
      }
    }
  }; // This attempts to reset the NODE_TO_KEY entry to the correct value
  // as apply() changes the object reference and hence invalidates the NODE_TO_KEY entry


  e.apply = function (op) {
    var matches = [];

    switch (op.type) {
      case 'insert_text':
      case 'remove_text':
      case 'set_node':
      case 'split_node':
        {
          matches.push.apply(matches, _toConsumableArray(getMatches(e, op.path)));
          break;
        }

      case 'set_selection':
        {
          var _EDITOR_TO_USER_SELEC;

          // Selection was manually set, don't restore the user selection after the change.
          (_EDITOR_TO_USER_SELEC = EDITOR_TO_USER_SELECTION.get(editor)) === null || _EDITOR_TO_USER_SELEC === void 0 ? void 0 : _EDITOR_TO_USER_SELEC.unref();
          EDITOR_TO_USER_SELECTION["delete"](editor);
          break;
        }

      case 'insert_node':
      case 'remove_node':
        {
          matches.push.apply(matches, _toConsumableArray(getMatches(e, slate.Path.parent(op.path))));
          break;
        }

      case 'merge_node':
        {
          var prevPath = slate.Path.previous(op.path);
          matches.push.apply(matches, _toConsumableArray(getMatches(e, prevPath)));
          break;
        }

      case 'move_node':
        {
          var commonPath = slate.Path.common(slate.Path.parent(op.path), slate.Path.parent(op.newPath));
          matches.push.apply(matches, _toConsumableArray(getMatches(e, commonPath)));
          break;
        }
    }

    apply(op);

    for (var _i = 0, _matches = matches; _i < _matches.length; _i++) {
      var _matches$_i = _slicedToArray(_matches[_i], 2),
          path = _matches$_i[0],
          key = _matches$_i[1];

      var _Editor$node = slate.Editor.node(e, path),
          _Editor$node2 = _slicedToArray(_Editor$node, 1),
          node = _Editor$node2[0];

      NODE_TO_KEY.set(node, key);
    }
  };

  e.setFragmentData = function (data) {
    var selection = e.selection;

    if (!selection) {
      return;
    }

    var _Range$edges = slate.Range.edges(selection),
        _Range$edges2 = _slicedToArray(_Range$edges, 2),
        start = _Range$edges2[0],
        end = _Range$edges2[1];

    var startVoid = slate.Editor["void"](e, {
      at: start.path
    });
    var endVoid = slate.Editor["void"](e, {
      at: end.path
    });

    if (slate.Range.isCollapsed(selection) && !startVoid) {
      return;
    } // Create a fake selection so that we can add a Base64-encoded copy of the
    // fragment to the HTML, to decode on future pastes.


    var domRange = ReactEditor.toDOMRange(e, selection);
    var contents = domRange.cloneContents();
    var attach = contents.childNodes[0]; // Make sure attach is non-empty, since empty nodes will not get copied.

    contents.childNodes.forEach(function (node) {
      if (node.textContent && node.textContent.trim() !== '') {
        attach = node;
      }
    }); // COMPAT: If the end node is a void node, we need to move the end of the
    // range from the void node's spacer span, to the end of the void node's
    // content, since the spacer is before void's content in the DOM.

    if (endVoid) {
      var _endVoid = _slicedToArray(endVoid, 1),
          voidNode = _endVoid[0];

      var r = domRange.cloneRange();
      var domNode = ReactEditor.toDOMNode(e, voidNode);
      r.setEndAfter(domNode);
      contents = r.cloneContents();
    } // COMPAT: If the start node is a void node, we need to attach the encoded
    // fragment to the void node's content node instead of the spacer, because
    // attaching it to empty `<div>/<span>` nodes will end up having it erased by
    // most browsers. (2018/04/27)


    if (startVoid) {
      attach = contents.querySelector('[data-slate-spacer]');
    } // Remove any zero-width space spans from the cloned DOM so that they don't
    // show up elsewhere when pasted.


    Array.from(contents.querySelectorAll('[data-slate-zero-width]')).forEach(function (zw) {
      var isNewline = zw.getAttribute('data-slate-zero-width') === 'n';
      zw.textContent = isNewline ? '\n' : '';
    }); // Set a `data-slate-fragment` attribute on a non-empty node, so it shows up
    // in the HTML, and can be used for intra-Slate pasting. If it's a text
    // node, wrap it in a `<span>` so we have something to set an attribute on.

    if (isDOMText(attach)) {
      var span = attach.ownerDocument.createElement('span'); // COMPAT: In Chrome and Safari, if we don't add the `white-space` style
      // then leading and trailing spaces will be ignored. (2017/09/21)

      span.style.whiteSpace = 'pre';
      span.appendChild(attach);
      contents.appendChild(span);
      attach = span;
    }

    var fragment = e.getFragment();
    var string = JSON.stringify(fragment);
    var encoded = window.btoa(encodeURIComponent(string));
    attach.setAttribute('data-slate-fragment', encoded);
    data.setData('application/x-slate-fragment', encoded); // Add the content to a <div> so that we can get its inner HTML.

    var div = contents.ownerDocument.createElement('div');
    div.appendChild(contents);
    div.setAttribute('hidden', 'true');
    contents.ownerDocument.body.appendChild(div);
    data.setData('text/html', div.innerHTML);
    data.setData('text/plain', getPlainText(div));
    contents.ownerDocument.body.removeChild(div);
    return data;
  };

  e.insertData = function (data) {
    if (!e.insertFragmentData(data)) {
      e.insertTextData(data);
    }
  };

  e.insertFragmentData = function (data) {
    /**
     * Checking copied fragment from application/x-slate-fragment or data-slate-fragment
     */
    var fragment = data.getData('application/x-slate-fragment') || getSlateFragmentAttribute(data);

    if (fragment) {
      var decoded = decodeURIComponent(window.atob(fragment));
      var parsed = JSON.parse(decoded);
      e.insertFragment(parsed);
      return true;
    }

    return false;
  };

  e.insertTextData = function (data) {
    var text = data.getData('text/plain');

    if (text) {
      var lines = text.split(/\r\n|\r|\n/);
      var split = false;

      var _iterator = _createForOfIteratorHelper(lines),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var line = _step.value;

          if (split) {
            slate.Transforms.splitNodes(e, {
              always: true
            });
          }

          e.insertText(line);
          split = true;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return true;
    }

    return false;
  };

  e.onChange = function () {
    // COMPAT: React doesn't batch `setState` hook calls, which means that the
    // children and selection can get out of sync for one render pass. So we
    // have to use this unstable API to ensure it batches them. (2019/12/03)
    // https://github.com/facebook/react/issues/14259#issuecomment-439702367
    ReactDOM__default['default'].unstable_batchedUpdates(function () {
      var onContextChange = EDITOR_TO_ON_CHANGE.get(e);

      if (onContextChange) {
        onContextChange();
      }

      onChange();
    });
  };

  return e;
};

var getMatches = function getMatches(e, path) {
  var matches = [];

  var _iterator2 = _createForOfIteratorHelper(slate.Editor.levels(e, {
    at: path
  })),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var _step2$value = _slicedToArray(_step2.value, 2),
          n = _step2$value[0],
          p = _step2$value[1];

      var key = ReactEditor.findKey(e, n);
      matches.push([p, key]);
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  return matches;
};

// Components
var Editable = IS_ANDROID ? AndroidEditable : Editable$1;

exports.AndroidEditable = AndroidEditable;
exports.DefaultEditable = Editable$1;
exports.DefaultElement = DefaultElement;
exports.DefaultLeaf = DefaultLeaf;
exports.DefaultPlaceholder = DefaultPlaceholder;
exports.Editable = Editable;
exports.ReactEditor = ReactEditor;
exports.Slate = Slate;
exports.useEditor = useEditor;
exports.useFocused = useFocused;
exports.useReadOnly = useReadOnly;
exports.useSelected = useSelected;
exports.useSlate = useSlate;
exports.useSlateSelector = useSlateSelector;
exports.useSlateStatic = useSlateStatic;
exports.withReact = withReact;
//# sourceMappingURL=index.js.map
