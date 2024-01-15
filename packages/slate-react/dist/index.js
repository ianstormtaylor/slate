'use strict';

var getDirection = require('direction');
var debounce = require('lodash/debounce');
var throttle = require('lodash/throttle');
var React = require('react');
var scrollIntoView = require('scroll-into-view-if-needed');
var slate = require('slate');
var resizeObserver = require('@juggle/resize-observer');
var isHotkey = require('is-hotkey');
var ReactDOM = require('react-dom');

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var arrayWithHoles = createCommonjsModule(function (module) {
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
module.exports = _arrayWithHoles, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

unwrapExports(arrayWithHoles);

var iterableToArrayLimit = createCommonjsModule(function (module) {
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = !0, n = r;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
module.exports = _iterableToArrayLimit, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

unwrapExports(iterableToArrayLimit);

var arrayLikeToArray = createCommonjsModule(function (module) {
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
module.exports = _arrayLikeToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
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
module.exports = _unsupportedIterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

unwrapExports(unsupportedIterableToArray);

var nonIterableRest = createCommonjsModule(function (module) {
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
module.exports = _nonIterableRest, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

unwrapExports(nonIterableRest);

var slicedToArray = createCommonjsModule(function (module) {
function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
}
module.exports = _slicedToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
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
module.exports = _objectWithoutPropertiesLoose, module.exports.__esModule = true, module.exports["default"] = module.exports;
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
module.exports = _objectWithoutProperties, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var _objectWithoutProperties = unwrapExports(objectWithoutProperties);

var _typeof_1 = createCommonjsModule(function (module) {
function _typeof(o) {
  "@babel/helpers - typeof";

  return (module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports), _typeof(o);
}
module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

unwrapExports(_typeof_1);

var toPrimitive = createCommonjsModule(function (module) {
var _typeof = _typeof_1["default"];
function _toPrimitive(input, hint) {
  if (_typeof(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (_typeof(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
module.exports = _toPrimitive, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

unwrapExports(toPrimitive);

var toPropertyKey = createCommonjsModule(function (module) {
var _typeof = _typeof_1["default"];

function _toPropertyKey(arg) {
  var key = toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}
module.exports = _toPropertyKey, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

unwrapExports(toPropertyKey);

var defineProperty = createCommonjsModule(function (module) {
function _defineProperty(obj, key, value) {
  key = toPropertyKey(key);
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
module.exports = _defineProperty, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var _defineProperty = unwrapExports(defineProperty);

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

var REACT_MAJOR_VERSION = parseInt(React.version.split('.')[0], 10);
var IS_IOS = typeof navigator !== 'undefined' && typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
var IS_APPLE = typeof navigator !== 'undefined' && /Mac OS X/.test(navigator.userAgent);
var IS_ANDROID = typeof navigator !== 'undefined' && /Android/.test(navigator.userAgent);
var IS_FIREFOX = typeof navigator !== 'undefined' && /^(?!.*Seamonkey)(?=.*Firefox).*/i.test(navigator.userAgent);
var IS_WEBKIT = typeof navigator !== 'undefined' && /AppleWebKit(?!.*Chrome)/i.test(navigator.userAgent);
// "modern" Edge was released at 79.x
var IS_EDGE_LEGACY = typeof navigator !== 'undefined' && /Edge?\/(?:[0-6][0-9]|[0-7][0-8])(?:\.)/i.test(navigator.userAgent);
var IS_CHROME = typeof navigator !== 'undefined' && /Chrome/i.test(navigator.userAgent);
// Native `beforeInput` events don't work well with react on Chrome 75
// and older, Chrome 76+ can use `beforeInput` though.
var IS_CHROME_LEGACY = typeof navigator !== 'undefined' && /Chrome?\/(?:[0-7][0-5]|[0-6][0-9])(?:\.)/i.test(navigator.userAgent);
var IS_ANDROID_CHROME_LEGACY = IS_ANDROID && typeof navigator !== 'undefined' && /Chrome?\/(?:[0-5]?\d)(?:\.)/i.test(navigator.userAgent);
// Firefox did not support `beforeInput` until `v87`.
var IS_FIREFOX_LEGACY = typeof navigator !== 'undefined' && /^(?!.*Seamonkey)(?=.*Firefox\/(?:[0-7][0-9]|[0-8][0-6])(?:\.)).*/i.test(navigator.userAgent);
// UC mobile browser
var IS_UC_MOBILE = typeof navigator !== 'undefined' && /.*UCBrowser/.test(navigator.userAgent);
// Wechat browser (not including mac wechat)
var IS_WECHATBROWSER = typeof navigator !== 'undefined' && /.*Wechat/.test(navigator.userAgent) && !/.*MacWechat/.test(navigator.userAgent); // avoid lookbehind (buggy in safari < 16.4)
// Check if DOM is available as React does internally.
// https://github.com/facebook/react/blob/master/packages/shared/ExecutionEnvironment.js
var CAN_USE_DOM = !!(typeof window !== 'undefined' && typeof window.document !== 'undefined' && typeof window.document.createElement !== 'undefined');
// COMPAT: Firefox/Edge Legacy don't support the `beforeinput` event
// Chrome Legacy doesn't support `beforeinput` correctly
var HAS_BEFORE_INPUT_SUPPORT = (!IS_CHROME_LEGACY || !IS_ANDROID_CHROME_LEGACY) && !IS_EDGE_LEGACY &&
// globalThis is undefined in older browsers
typeof globalThis !== 'undefined' && globalThis.InputEvent &&
// @ts-ignore The `getTargetRanges` property isn't recognized.
typeof globalThis.InputEvent.prototype.getTargetRanges === 'function';

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
var EDITOR_TO_PLACEHOLDER_ELEMENT = new WeakMap();
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
var EDITOR_TO_USER_SELECTION = new WeakMap();
/**
 * Weak map for associating the context `onChange` context with the plugin.
 */
var EDITOR_TO_ON_CHANGE = new WeakMap();
/**
 * Weak maps for saving pending state on composition stage.
 */
var EDITOR_TO_SCHEDULE_FLUSH = new WeakMap();
var EDITOR_TO_PENDING_INSERTION_MARKS = new WeakMap();
var EDITOR_TO_USER_MARKS = new WeakMap();
/**
 * Android input handling specific weak-maps
 */
var EDITOR_TO_PENDING_DIFFS = new WeakMap();
var EDITOR_TO_PENDING_ACTION = new WeakMap();
var EDITOR_TO_PENDING_SELECTION = new WeakMap();
var EDITOR_TO_FORCE_RENDER = new WeakMap();
/**
 * Symbols.
 */
var PLACEHOLDER_SYMBOL = Symbol('placeholder');
var MARK_PLACEHOLDER_SYMBOL = Symbol('mark-placeholder');

var arrayWithoutHoles = createCommonjsModule(function (module) {
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return arrayLikeToArray(arr);
}
module.exports = _arrayWithoutHoles, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

unwrapExports(arrayWithoutHoles);

var iterableToArray = createCommonjsModule(function (module) {
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
module.exports = _iterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

unwrapExports(iterableToArray);

var nonIterableSpread = createCommonjsModule(function (module) {
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
module.exports = _nonIterableSpread, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

unwrapExports(nonIterableSpread);

var toConsumableArray = createCommonjsModule(function (module) {
function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
}
module.exports = _toConsumableArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var _toConsumableArray = unwrapExports(toConsumableArray);

function _createForOfIteratorHelper$3(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$3(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray$3(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$3(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$3(o, minLen); }
function _arrayLikeToArray$3(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var DOMText = globalThis.Text;
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
    offset = _domPoint[1];
  // If it's an element node, its offset refers to the index of its children
  // including comment nodes, so try to find the right text child node.
  if (isDOMElement(node) && node.childNodes.length) {
    var isLast = offset === node.childNodes.length;
    var index = isLast ? offset - 1 : offset;
    // If the editable child found is in front of input offset, we instead seek to its end
    var _getEditableChildAndI = getEditableChildAndIndex(node, index, isLast ? 'backward' : 'forward');
    var _getEditableChildAndI2 = _slicedToArray(_getEditableChildAndI, 2);
    node = _getEditableChildAndI2[0];
    index = _getEditableChildAndI2[1];
    isLast = index < offset;
    // If the node has children, traverse until we have a leaf node. Leaf nodes
    // can be either text nodes, or other void DOM nodes.
    while (isDOMElement(node) && node.childNodes.length) {
      var i = isLast ? node.childNodes.length - 1 : 0;
      node = getEditableChild(node, i, isLast ? 'backward' : 'forward');
    }
    // Determine the new offset inside the text node.
    offset = isLast && node.textContent != null ? node.textContent.length : 0;
  }
  // Return the node and offset.
  return [node, offset];
};
/**
 * Determines whether the active element is nested within a shadowRoot
 */
var hasShadowRoot = function hasShadowRoot(node) {
  var parent = node && node.parentNode;
  while (parent) {
    if (parent.toString() === '[object ShadowRoot]') {
      return true;
    }
    parent = parent.parentNode;
  }
  return false;
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
  var triedBackward = false;
  // While the child is a comment node, or an element node with no children,
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
 * Check whether a mutation originates from a editable element inside the editor.
 */
var isTrackedMutation = function isTrackedMutation(editor, mutation, batch) {
  var target = mutation.target;
  if (isDOMElement(target) && target.matches('[contentEditable="false"]')) {
    return false;
  }
  var _ReactEditor$getWindo = ReactEditor.getWindow(editor),
    document = _ReactEditor$getWindo.document;
  if (document.contains(target)) {
    return ReactEditor.hasDOMNode(editor, target, {
      editable: true
    });
  }
  var parentMutation = batch.find(function (_ref3) {
    var addedNodes = _ref3.addedNodes,
      removedNodes = _ref3.removedNodes;
    var _iterator = _createForOfIteratorHelper$3(addedNodes),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var node = _step.value;
        if (node === target || node.contains(target)) {
          return true;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    var _iterator2 = _createForOfIteratorHelper$3(removedNodes),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var _node = _step2.value;
        if (_node === target || _node.contains(target)) {
          return true;
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  });
  if (!parentMutation || parentMutation === mutation) {
    return false;
  }
  // Target add/remove is tracked. Track the mutation if we track the parent mutation.
  return isTrackedMutation(editor, parentMutation, batch);
};

var createClass = createCommonjsModule(function (module) {
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
module.exports = _createClass, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var _createClass = unwrapExports(createClass);

var classCallCheck = createCommonjsModule(function (module) {
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
module.exports = _classCallCheck, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var _classCallCheck = unwrapExports(classCallCheck);

/**
 * An auto-incrementing identifier for keys.
 */
var n = 0;
/**
 * A class that keeps track of a key string. We use a full class here because we
 * want to be able to use them as keys in `WeakMap` objects.
 */
var Key = /*#__PURE__*/_createClass(function Key() {
  _classCallCheck(this, Key);
  _defineProperty(this, "id", void 0);
  this.id = "".concat(n++);
});

// eslint-disable-next-line no-redeclare
var ReactEditor = {
  androidPendingDiffs: function androidPendingDiffs(editor) {
    return EDITOR_TO_PENDING_DIFFS.get(editor);
  },
  androidScheduleFlush: function androidScheduleFlush(editor) {
    var _EDITOR_TO_SCHEDULE_F;
    (_EDITOR_TO_SCHEDULE_F = EDITOR_TO_SCHEDULE_FLUSH.get(editor)) === null || _EDITOR_TO_SCHEDULE_F === void 0 || _EDITOR_TO_SCHEDULE_F();
  },
  blur: function blur(editor) {
    var el = ReactEditor.toDOMNode(editor, editor);
    var root = ReactEditor.findDocumentOrShadowRoot(editor);
    IS_FOCUSED.set(editor, false);
    if (root.activeElement === el) {
      el.blur();
    }
  },
  deselect: function deselect(editor) {
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
  findDocumentOrShadowRoot: function findDocumentOrShadowRoot(editor) {
    var el = ReactEditor.toDOMNode(editor, editor);
    var root = el.getRootNode();
    if ((root instanceof Document || root instanceof ShadowRoot) && root.getSelection != null) {
      return root;
    }
    return el.ownerDocument;
  },
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
    var path = ReactEditor.findPath(editor, node);
    // If the drop target is inside a void node, move it into either the
    // next or previous node, depending on which side the `x` and `y`
    // coordinates are closest to.
    if (slate.Element.isElement(node) && slate.Editor.isVoid(editor, node)) {
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
    }
    // Else resolve a range from the caret position where the drop occured.
    var domRange;
    var _ReactEditor$getWindo = ReactEditor.getWindow(editor),
      document = _ReactEditor$getWindo.document;
    // COMPAT: In Firefox, `caretRangeFromPoint` doesn't exist. (2016/07/25)
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
    }
    // Resolve a Slate range from the DOM range.
    var range = ReactEditor.toSlateRange(editor, domRange, {
      exactMatch: false,
      suppressThrow: false
    });
    return range;
  },
  findKey: function findKey(editor, node) {
    var key = NODE_TO_KEY.get(node);
    if (!key) {
      key = new Key();
      NODE_TO_KEY.set(node, key);
    }
    return key;
  },
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
  focus: function focus(editor) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      retries: 5
    };
    // Return if already focused
    if (IS_FOCUSED.get(editor)) {
      return;
    }
    // Retry setting focus if the editor has pending operations.
    // The DOM (selection) is unstable while changes are applied.
    // Retry until retries are exhausted or editor is focused.
    if (options.retries <= 0) {
      throw new Error('Could not set focus, editor seems stuck with pending operations');
    }
    if (editor.operations.length > 0) {
      setTimeout(function () {
        ReactEditor.focus(editor, {
          retries: options.retries - 1
        });
      }, 10);
      return;
    }
    var el = ReactEditor.toDOMNode(editor, editor);
    var root = ReactEditor.findDocumentOrShadowRoot(editor);
    if (root.activeElement !== el) {
      // Ensure that the DOM selection state is set to the editor's selection
      if (editor.selection && root instanceof Document) {
        var domSelection = root.getSelection();
        var domRange = ReactEditor.toDOMRange(editor, editor.selection);
        domSelection === null || domSelection === void 0 || domSelection.removeAllRanges();
        domSelection === null || domSelection === void 0 || domSelection.addRange(domRange);
      }
      // Create a new selection in the top of the document if missing
      if (!editor.selection) {
        slate.Transforms.select(editor, slate.Editor.start(editor, []));
        editor.onChange();
      }
      el.focus({
        preventScroll: true
      });
      IS_FOCUSED.set(editor, true);
    }
  },
  getWindow: function getWindow(editor) {
    var window = EDITOR_TO_WINDOW.get(editor);
    if (!window) {
      throw new Error('Unable to find a host window element for this editor');
    }
    return window;
  },
  hasDOMNode: function hasDOMNode(editor, target) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var _options$editable = options.editable,
      editable = _options$editable === void 0 ? false : _options$editable;
    var editorEl = ReactEditor.toDOMNode(editor, editor);
    var targetEl;
    // COMPAT: In Firefox, reading `target.nodeType` will throw an error if
    // target is originating from an internal "restricted" element (e.g. a
    // stepper arrow on a number input). (2018/05/04)
    // https://github.com/ianstormtaylor/slate/issues/1819
    try {
      targetEl = isDOMElement(target) ? target : target.parentElement;
    } catch (err) {
      if (err instanceof Error && !err.message.includes('Permission denied to access property "nodeType"')) {
        throw err;
      }
    }
    if (!targetEl) {
      return false;
    }
    return targetEl.closest("[data-slate-editor]") === editorEl && (!editable || targetEl.isContentEditable ? true : typeof targetEl.isContentEditable === 'boolean' &&
    // isContentEditable exists only on HTMLElement, and on other nodes it will be undefined
    // this is the core logic that lets you know you got the right editor.selection instead of null when editor is contenteditable="false"(readOnly)
    targetEl.closest('[contenteditable="false"]') === editorEl || !!targetEl.getAttribute('data-slate-zero-width'));
  },
  hasEditableTarget: function hasEditableTarget(editor, target) {
    return isDOMNode(target) && ReactEditor.hasDOMNode(editor, target, {
      editable: true
    });
  },
  hasRange: function hasRange(editor, range) {
    var anchor = range.anchor,
      focus = range.focus;
    return slate.Editor.hasPath(editor, anchor.path) && slate.Editor.hasPath(editor, focus.path);
  },
  hasSelectableTarget: function hasSelectableTarget(editor, target) {
    return ReactEditor.hasEditableTarget(editor, target) || ReactEditor.isTargetInsideNonReadonlyVoid(editor, target);
  },
  hasTarget: function hasTarget(editor, target) {
    return isDOMNode(target) && ReactEditor.hasDOMNode(editor, target);
  },
  insertData: function insertData(editor, data) {
    editor.insertData(data);
  },
  insertFragmentData: function insertFragmentData(editor, data) {
    return editor.insertFragmentData(data);
  },
  insertTextData: function insertTextData(editor, data) {
    return editor.insertTextData(data);
  },
  isComposing: function isComposing(editor) {
    return !!IS_COMPOSING.get(editor);
  },
  isFocused: function isFocused(editor) {
    return !!IS_FOCUSED.get(editor);
  },
  isReadOnly: function isReadOnly(editor) {
    return !!IS_READ_ONLY.get(editor);
  },
  isTargetInsideNonReadonlyVoid: function isTargetInsideNonReadonlyVoid(editor, target) {
    if (IS_READ_ONLY.get(editor)) return false;
    var slateNode = ReactEditor.hasTarget(editor, target) && ReactEditor.toSlateNode(editor, target);
    return slate.Element.isElement(slateNode) && slate.Editor.isVoid(editor, slateNode);
  },
  setFragmentData: function setFragmentData(editor, data, originEvent) {
    return editor.setFragmentData(data, originEvent);
  },
  toDOMNode: function toDOMNode(editor, node) {
    var KEY_TO_ELEMENT = EDITOR_TO_KEY_TO_ELEMENT.get(editor);
    var domNode = slate.Editor.isEditor(node) ? EDITOR_TO_ELEMENT.get(editor) : KEY_TO_ELEMENT === null || KEY_TO_ELEMENT === void 0 ? void 0 : KEY_TO_ELEMENT.get(ReactEditor.findKey(editor, node));
    if (!domNode) {
      throw new Error("Cannot resolve a DOM node from Slate node: ".concat(slate.Scrubber.stringify(node)));
    }
    return domNode;
  },
  toDOMPoint: function toDOMPoint(editor, point) {
    var _Editor$node = slate.Editor.node(editor, point.path),
      _Editor$node2 = _slicedToArray(_Editor$node, 1),
      node = _Editor$node2[0];
    var el = ReactEditor.toDOMNode(editor, node);
    var domPoint;
    // If we're inside a void node, force the offset to 0, otherwise the zero
    // width spacing character will result in an incorrect offset of 1
    if (slate.Editor["void"](editor, {
      at: point
    })) {
      point = {
        path: point.path,
        offset: 0
      };
    }
    // For each leaf, we need to isolate its content, which means filtering
    // to its direct text and zero-width spans. (We have to filter out any
    // other siblings that may have been rendered alongside them.)
    var selector = "[data-slate-string], [data-slate-zero-width]";
    var texts = Array.from(el.querySelectorAll(selector));
    var start = 0;
    for (var i = 0; i < texts.length; i++) {
      var text = texts[i];
      var domNode = text.childNodes[0];
      if (domNode == null || domNode.textContent == null) {
        continue;
      }
      var length = domNode.textContent.length;
      var attr = text.getAttribute('data-slate-length');
      var trueLength = attr == null ? length : parseInt(attr, 10);
      var end = start + trueLength;
      // Prefer putting the selection inside the mark placeholder to ensure
      // composed text is displayed with the correct marks.
      var nextText = texts[i + 1];
      if (point.offset === end && nextText !== null && nextText !== void 0 && nextText.hasAttribute('data-slate-mark-placeholder')) {
        var _nextText$textContent;
        var domText = nextText.childNodes[0];
        domPoint = [
        // COMPAT: If we don't explicity set the dom point to be on the actual
        // dom text element, chrome will put the selection behind the actual dom
        // text element, causing domRange.getBoundingClientRect() calls on a collapsed
        // selection to return incorrect zero values (https://bugs.chromium.org/p/chromium/issues/detail?id=435438)
        // which will cause issues when scrolling to it.
        domText instanceof DOMText ? domText : nextText, (_nextText$textContent = nextText.textContent) !== null && _nextText$textContent !== void 0 && _nextText$textContent.startsWith("\uFEFF") ? 1 : 0];
        break;
      }
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
      endOffset = _ref4[1];
    // A slate Point at zero-width Leaf always has an offset of 0 but a native DOM selection at
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
      var _domNode$textContent, _domNode$textContent2;
      var editorEl = ReactEditor.toDOMNode(editor, editor);
      var potentialVoidNode = parentNode.closest('[data-slate-void="true"]');
      // Need to ensure that the closest void node is actually a void node
      // within this editor, and not a void node within some parent editor. This can happen
      // if this editor is within a void node of another editor ("nested editors", like in
      // the "Editable Voids" example on the docs site).
      var voidNode = potentialVoidNode && editorEl.contains(potentialVoidNode) ? potentialVoidNode : null;
      var leafNode = parentNode.closest('[data-slate-leaf]');
      var domNode = null;
      // Calculate how far into the text node the `nearestNode` is, so that we
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
            // COMPAT: While composing at the start of a text node, some keyboards put
            // the text content inside the zero width space.
            if (IS_ANDROID && !exactMatch && el.hasAttribute('data-slate-zero-width') && el.textContent.length > 0 && el.textContext !== "\uFEFF") {
              if (el.textContent.startsWith("\uFEFF")) {
                el.textContent = el.textContent.slice(1);
              }
              return;
            }
            el.parentNode.removeChild(el);
          });
          // COMPAT: Edge has a bug where Range.prototype.toString() will
          // convert \n into \r\n. The bug causes a loop when slate-react
          // attempts to reposition its cursor to match the native position. Use
          // textContent.length instead.
          // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/10291116/
          offset = contents.textContent.length;
          domNode = textNode;
        }
      } else if (voidNode) {
        // For void nodes, the element with the offset key will be a cousin, not an
        // ancestor, so find it by going down from the nearest void parent and taking the
        // first one that isn't inside a nested editor.
        var leafNodes = voidNode.querySelectorAll('[data-slate-leaf]');
        for (var index = 0; index < leafNodes.length; index++) {
          var current = leafNodes[index];
          if (ReactEditor.hasDOMNode(editor, current)) {
            leafNode = current;
            break;
          }
        }
        // COMPAT: In read-only editors the leaf is not rendered.
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
      if (domNode && offset === domNode.textContent.length &&
      // COMPAT: Android IMEs might remove the zero width space while composing,
      // and we don't add it for line-breaks.
      IS_ANDROID && domNode.getAttribute('data-slate-zero-width') === 'z' && (_domNode$textContent = domNode.textContent) !== null && _domNode$textContent !== void 0 && _domNode$textContent.startsWith("\uFEFF") && (
      // COMPAT: If the parent node is a Slate zero-width space, editor is
      // because the text node should have no characters. However, during IME
      // composition the ASCII characters will be prepended to the zero-width
      // space, so subtract 1 from the offset to account for the zero-width
      // space character.
      parentNode.hasAttribute('data-slate-zero-width') ||
      // COMPAT: In Firefox, `range.cloneContents()` returns an extra trailing '\n'
      // when the document ends with a new-line character. This results in the offset
      // length being off by one, so we need to subtract one to account for this.
      IS_FIREFOX && (_domNode$textContent2 = domNode.textContent) !== null && _domNode$textContent2 !== void 0 && _domNode$textContent2.endsWith('\n\n'))) {
        offset--;
      }
    }
    if (IS_ANDROID && !textNode && !exactMatch) {
      var node = parentNode.hasAttribute('data-slate-node') ? parentNode : parentNode.closest('[data-slate-node]');
      if (node && ReactEditor.hasDOMNode(editor, node, {
        editable: true
      })) {
        var _slateNode = ReactEditor.toSlateNode(editor, node);
        var _Editor$start = slate.Editor.start(editor, ReactEditor.findPath(editor, _slateNode)),
          _path = _Editor$start.path,
          _offset = _Editor$start.offset;
        if (!node.querySelector('[data-slate-leaf]')) {
          _offset = nearestOffset;
        }
        return {
          path: _path,
          offset: _offset
        };
      }
    }
    if (!textNode) {
      if (suppressThrow) {
        return null;
      }
      throw new Error("Cannot resolve a Slate point from DOM point: ".concat(domPoint));
    }
    // COMPAT: If someone is clicking from one Slate editor into another,
    // the select event fires twice, once for the old editor's `element`
    // first, and then afterwards for the correct `element`. (2017/03/03)
    var slateNode = ReactEditor.toSlateNode(editor, textNode);
    var path = ReactEditor.findPath(editor, slateNode);
    return {
      path: path,
      offset: offset
    };
  },
  toSlateRange: function toSlateRange(editor, domRange, options) {
    var _focusNode$textConten;
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
        // COMPAT: In firefox the normal seletion way does not work
        // (https://github.com/ianstormtaylor/slate/pull/5486#issue-1820720223)
        if (IS_FIREFOX && domRange.rangeCount > 1) {
          focusNode = domRange.focusNode; // Focus node works fine
          var firstRange = domRange.getRangeAt(0);
          var lastRange = domRange.getRangeAt(domRange.rangeCount - 1);
          // Here we are in the contenteditable mode of a table in firefox
          if (focusNode instanceof HTMLTableRowElement && firstRange.startContainer instanceof HTMLTableRowElement && lastRange.startContainer instanceof HTMLTableRowElement) {
            // HTMLElement, becouse Element is a slate element
            var getLastChildren = function getLastChildren(element) {
              if (element.childElementCount > 0) {
                return getLastChildren(element.children[0]);
              } else {
                return element;
              }
            };
            var firstNodeRow = firstRange.startContainer;
            var lastNodeRow = lastRange.startContainer;
            // This should never fail as "The HTMLElement interface represents any HTML element."
            var firstNode = getLastChildren(firstNodeRow.children[firstRange.startOffset]);
            var lastNode = getLastChildren(lastNodeRow.children[lastRange.startOffset]);
            // Zero, as we allways take the right one as the anchor point
            focusOffset = 0;
            if (lastNode.childNodes.length > 0) {
              anchorNode = lastNode.childNodes[0];
            } else {
              anchorNode = lastNode;
            }
            if (firstNode.childNodes.length > 0) {
              focusNode = firstNode.childNodes[0];
            } else {
              focusNode = firstNode;
            }
            if (lastNode instanceof HTMLElement) {
              anchorOffset = lastNode.innerHTML.length;
            } else {
              // Fallback option
              anchorOffset = 0;
            }
          } else {
            // This is the read only mode of a firefox table
            // Right to left
            if (firstRange.startContainer === focusNode) {
              anchorNode = lastRange.endContainer;
              anchorOffset = lastRange.endOffset;
              focusOffset = firstRange.startOffset;
            } else {
              // Left to right
              anchorNode = firstRange.startContainer;
              anchorOffset = firstRange.endOffset;
              focusOffset = lastRange.startOffset;
            }
          }
        } else {
          anchorNode = domRange.anchorNode;
          anchorOffset = domRange.anchorOffset;
          focusNode = domRange.focusNode;
          focusOffset = domRange.focusOffset;
        }
        // COMPAT: There's a bug in chrome that always returns `true` for
        // `isCollapsed` for a Selection that comes from a ShadowRoot.
        // (2020/08/08)
        // https://bugs.chromium.org/p/chromium/issues/detail?id=447523
        // IsCollapsed might not work in firefox, but this will
        if (IS_CHROME && hasShadowRoot(anchorNode) || IS_FIREFOX) {
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
    // COMPAT: Firefox sometimes includes an extra \n (rendered by TextString
    // when isTrailing is true) in the focusOffset, resulting in an invalid
    // Slate point. (2023/11/01)
    if (IS_FIREFOX && (_focusNode$textConten = focusNode.textContent) !== null && _focusNode$textConten !== void 0 && _focusNode$textConten.endsWith('\n\n') && focusOffset === focusNode.textContent.length) {
      focusOffset--;
    }
    // COMPAT: Triple-clicking a word in chrome will sometimes place the focus
    // inside a `contenteditable="false"` DOM node following the word, which
    // will cause `toSlatePoint` to throw an error. (2023/03/07)
    if ('getAttribute' in focusNode && focusNode.getAttribute('contenteditable') === 'false' && focusNode.getAttribute('data-slate-void') !== 'true') {
      var _anchorNode$textConte;
      focusNode = anchorNode;
      focusOffset = ((_anchorNode$textConte = anchorNode.textContent) === null || _anchorNode$textConte === void 0 ? void 0 : _anchorNode$textConte.length) || 0;
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
    };
    // if the selection is a hanging range that ends in a void
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
  }
};

/**
 * Check whether a text diff was applied in a way we can perform the pending action on /
 * recover the pending selection.
 */
function verifyDiffState(editor, textDiff) {
  var path = textDiff.path,
    diff = textDiff.diff;
  if (!slate.Editor.hasPath(editor, path)) {
    return false;
  }
  var node = slate.Node.get(editor, path);
  if (!slate.Text.isText(node)) {
    return false;
  }
  if (diff.start !== node.text.length || diff.text.length === 0) {
    return node.text.slice(diff.start, diff.start + diff.text.length) === diff.text;
  }
  var nextPath = slate.Path.next(path);
  if (!slate.Editor.hasPath(editor, nextPath)) {
    return false;
  }
  var nextNode = slate.Node.get(editor, nextPath);
  return slate.Text.isText(nextNode) && nextNode.text.startsWith(diff.text);
}
function applyStringDiff(text) {
  for (var _len = arguments.length, diffs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    diffs[_key - 1] = arguments[_key];
  }
  return diffs.reduce(function (text, diff) {
    return text.slice(0, diff.start) + diff.text + text.slice(diff.end);
  }, text);
}
function longestCommonPrefixLength(str, another) {
  var length = Math.min(str.length, another.length);
  for (var i = 0; i < length; i++) {
    if (str.charAt(i) !== another.charAt(i)) {
      return i;
    }
  }
  return length;
}
function longestCommonSuffixLength(str, another, max) {
  var length = Math.min(str.length, another.length, max);
  for (var i = 0; i < length; i++) {
    if (str.charAt(str.length - i - 1) !== another.charAt(another.length - i - 1)) {
      return i;
    }
  }
  return length;
}
/**
 * Remove redundant changes from the diff so that it spans the minimal possible range
 */
function normalizeStringDiff(targetText, diff) {
  var start = diff.start,
    end = diff.end,
    text = diff.text;
  var removedText = targetText.slice(start, end);
  var prefixLength = longestCommonPrefixLength(removedText, text);
  var max = Math.min(removedText.length - prefixLength, text.length - prefixLength);
  var suffixLength = longestCommonSuffixLength(removedText, text, max);
  var normalized = {
    start: start + prefixLength,
    end: end - suffixLength,
    text: text.slice(prefixLength, text.length - suffixLength)
  };
  if (normalized.start === normalized.end && normalized.text.length === 0) {
    return null;
  }
  return normalized;
}
/**
 * Return a string diff that is equivalent to applying b after a spanning the range of
 * both changes
 */
function mergeStringDiffs(targetText, a, b) {
  var start = Math.min(a.start, b.start);
  var overlap = Math.max(0, Math.min(a.start + a.text.length, b.end) - b.start);
  var applied = applyStringDiff(targetText, a, b);
  var sliceEnd = Math.max(b.start + b.text.length, a.start + a.text.length + (a.start + a.text.length > b.start ? b.text.length : 0) - overlap);
  var text = applied.slice(start, sliceEnd);
  var end = Math.max(a.end, b.end - a.text.length + (a.end - a.start));
  return normalizeStringDiff(targetText, {
    start: start,
    end: end,
    text: text
  });
}
/**
 * Get the slate range the text diff spans.
 */
function targetRange(textDiff) {
  var path = textDiff.path,
    diff = textDiff.diff;
  return {
    anchor: {
      path: path,
      offset: diff.start
    },
    focus: {
      path: path,
      offset: diff.end
    }
  };
}
/**
 * Normalize a 'pending point' a.k.a a point based on the dom state before applying
 * the pending diffs. Since the pending diffs might have been inserted with different
 * marks we have to 'walk' the offset from the starting position to ensure we still
 * have a valid point inside the document
 */
function normalizePoint(editor, point) {
  var path = point.path,
    offset = point.offset;
  if (!slate.Editor.hasPath(editor, path)) {
    return null;
  }
  var leaf = slate.Node.get(editor, path);
  if (!slate.Text.isText(leaf)) {
    return null;
  }
  var parentBlock = slate.Editor.above(editor, {
    match: function match(n) {
      return slate.Element.isElement(n) && slate.Editor.isBlock(editor, n);
    },
    at: path
  });
  if (!parentBlock) {
    return null;
  }
  while (offset > leaf.text.length) {
    var entry = slate.Editor.next(editor, {
      at: path,
      match: slate.Text.isText
    });
    if (!entry || !slate.Path.isDescendant(entry[1], parentBlock[1])) {
      return null;
    }
    offset -= leaf.text.length;
    leaf = entry[0];
    path = entry[1];
  }
  return {
    path: path,
    offset: offset
  };
}
/**
 * Normalize a 'pending selection' to ensure it's valid in the current document state.
 */
function normalizeRange(editor, range) {
  var anchor = normalizePoint(editor, range.anchor);
  if (!anchor) {
    return null;
  }
  if (slate.Range.isCollapsed(range)) {
    return {
      anchor: anchor,
      focus: anchor
    };
  }
  var focus = normalizePoint(editor, range.focus);
  if (!focus) {
    return null;
  }
  return {
    anchor: anchor,
    focus: focus
  };
}
function transformPendingPoint(editor, point, op) {
  var pendingDiffs = EDITOR_TO_PENDING_DIFFS.get(editor);
  var textDiff = pendingDiffs === null || pendingDiffs === void 0 ? void 0 : pendingDiffs.find(function (_ref) {
    var path = _ref.path;
    return slate.Path.equals(path, point.path);
  });
  if (!textDiff || point.offset <= textDiff.diff.start) {
    return slate.Point.transform(point, op, {
      affinity: 'backward'
    });
  }
  var diff = textDiff.diff;
  // Point references location inside the diff => transform the point based on the location
  // the diff will be applied to and add the offset inside the diff.
  if (point.offset <= diff.start + diff.text.length) {
    var _anchor = {
      path: point.path,
      offset: diff.start
    };
    var _transformed = slate.Point.transform(_anchor, op, {
      affinity: 'backward'
    });
    if (!_transformed) {
      return null;
    }
    return {
      path: _transformed.path,
      offset: _transformed.offset + point.offset - diff.start
    };
  }
  // Point references location after the diff
  var anchor = {
    path: point.path,
    offset: point.offset - diff.text.length + diff.end - diff.start
  };
  var transformed = slate.Point.transform(anchor, op, {
    affinity: 'backward'
  });
  if (!transformed) {
    return null;
  }
  if (op.type === 'split_node' && slate.Path.equals(op.path, point.path) && anchor.offset < op.position && diff.start < op.position) {
    return transformed;
  }
  return {
    path: transformed.path,
    offset: transformed.offset + diff.text.length - diff.end + diff.start
  };
}
function transformPendingRange(editor, range, op) {
  var anchor = transformPendingPoint(editor, range.anchor, op);
  if (!anchor) {
    return null;
  }
  if (slate.Range.isCollapsed(range)) {
    return {
      anchor: anchor,
      focus: anchor
    };
  }
  var focus = transformPendingPoint(editor, range.focus, op);
  if (!focus) {
    return null;
  }
  return {
    anchor: anchor,
    focus: focus
  };
}
function transformTextDiff(textDiff, op) {
  var path = textDiff.path,
    diff = textDiff.diff,
    id = textDiff.id;
  switch (op.type) {
    case 'insert_text':
      {
        if (!slate.Path.equals(op.path, path) || op.offset >= diff.end) {
          return textDiff;
        }
        if (op.offset <= diff.start) {
          return {
            diff: {
              start: op.text.length + diff.start,
              end: op.text.length + diff.end,
              text: diff.text
            },
            id: id,
            path: path
          };
        }
        return {
          diff: {
            start: diff.start,
            end: diff.end + op.text.length,
            text: diff.text
          },
          id: id,
          path: path
        };
      }
    case 'remove_text':
      {
        if (!slate.Path.equals(op.path, path) || op.offset >= diff.end) {
          return textDiff;
        }
        if (op.offset + op.text.length <= diff.start) {
          return {
            diff: {
              start: diff.start - op.text.length,
              end: diff.end - op.text.length,
              text: diff.text
            },
            id: id,
            path: path
          };
        }
        return {
          diff: {
            start: diff.start,
            end: diff.end - op.text.length,
            text: diff.text
          },
          id: id,
          path: path
        };
      }
    case 'split_node':
      {
        if (!slate.Path.equals(op.path, path) || op.position >= diff.end) {
          return {
            diff: diff,
            id: id,
            path: slate.Path.transform(path, op, {
              affinity: 'backward'
            })
          };
        }
        if (op.position > diff.start) {
          return {
            diff: {
              start: diff.start,
              end: Math.min(op.position, diff.end),
              text: diff.text
            },
            id: id,
            path: path
          };
        }
        return {
          diff: {
            start: diff.start - op.position,
            end: diff.end - op.position,
            text: diff.text
          },
          id: id,
          path: slate.Path.transform(path, op, {
            affinity: 'forward'
          })
        };
      }
    case 'merge_node':
      {
        if (!slate.Path.equals(op.path, path)) {
          return {
            diff: diff,
            id: id,
            path: slate.Path.transform(path, op)
          };
        }
        return {
          diff: {
            start: diff.start + op.position,
            end: diff.end + op.position,
            text: diff.text
          },
          id: id,
          path: slate.Path.transform(path, op)
        };
      }
  }
  var newPath = slate.Path.transform(path, op);
  if (!newPath) {
    return null;
  }
  return {
    diff: diff,
    path: newPath,
    id: id
  };
}

function ownKeys$6(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$6(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$6(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$6(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
// https://github.com/facebook/draft-js/blob/main/src/component/handlers/composition/DraftEditorCompositionHandler.js#L41
// When using keyboard English association function, conpositionEnd triggered too fast, resulting in after `insertText` still maintain association state.
var RESOLVE_DELAY = 25;
// Time with no user interaction before the current user action is considered as done.
var FLUSH_DELAY = 200;
// Replace with `const debug = console.log` to debug
var debug = function debug() {};
// Type guard to check if a value is a DataTransfer
var isDataTransfer = function isDataTransfer(value) {
  return (value === null || value === void 0 ? void 0 : value.constructor.name) === 'DataTransfer';
};
function createAndroidInputManager(_ref) {
  var editor = _ref.editor,
    scheduleOnDOMSelectionChange = _ref.scheduleOnDOMSelectionChange,
    onDOMSelectionChange = _ref.onDOMSelectionChange;
  var flushing = false;
  var compositionEndTimeoutId = null;
  var flushTimeoutId = null;
  var actionTimeoutId = null;
  var idCounter = 0;
  var insertPositionHint = false;
  var applyPendingSelection = function applyPendingSelection() {
    var pendingSelection = EDITOR_TO_PENDING_SELECTION.get(editor);
    EDITOR_TO_PENDING_SELECTION["delete"](editor);
    if (pendingSelection) {
      var selection = editor.selection;
      var normalized = normalizeRange(editor, pendingSelection);
      if (normalized && (!selection || !slate.Range.equals(normalized, selection))) {
        slate.Transforms.select(editor, normalized);
      }
    }
  };
  var performAction = function performAction() {
    var action = EDITOR_TO_PENDING_ACTION.get(editor);
    EDITOR_TO_PENDING_ACTION["delete"](editor);
    if (!action) {
      return;
    }
    if (action.at) {
      var target = slate.Point.isPoint(action.at) ? normalizePoint(editor, action.at) : normalizeRange(editor, action.at);
      if (!target) {
        return;
      }
      var _targetRange = slate.Editor.range(editor, target);
      if (!editor.selection || !slate.Range.equals(editor.selection, _targetRange)) {
        slate.Transforms.select(editor, target);
      }
    }
    action.run();
  };
  var flush = function flush() {
    if (flushTimeoutId) {
      clearTimeout(flushTimeoutId);
      flushTimeoutId = null;
    }
    if (actionTimeoutId) {
      clearTimeout(actionTimeoutId);
      actionTimeoutId = null;
    }
    if (!hasPendingDiffs() && !hasPendingAction()) {
      applyPendingSelection();
      return;
    }
    if (!flushing) {
      flushing = true;
      setTimeout(function () {
        return flushing = false;
      });
    }
    if (hasPendingAction()) {
      flushing = 'action';
    }
    var selectionRef = editor.selection && slate.Editor.rangeRef(editor, editor.selection, {
      affinity: 'forward'
    });
    EDITOR_TO_USER_MARKS.set(editor, editor.marks);
    debug('flush', EDITOR_TO_PENDING_ACTION.get(editor), EDITOR_TO_PENDING_DIFFS.get(editor));
    var scheduleSelectionChange = hasPendingDiffs();
    var diff;
    while (diff = (_EDITOR_TO_PENDING_DI = EDITOR_TO_PENDING_DIFFS.get(editor)) === null || _EDITOR_TO_PENDING_DI === void 0 ? void 0 : _EDITOR_TO_PENDING_DI[0]) {
      var _EDITOR_TO_PENDING_DI, _EDITOR_TO_PENDING_DI2;
      var pendingMarks = EDITOR_TO_PENDING_INSERTION_MARKS.get(editor);
      if (pendingMarks !== undefined) {
        EDITOR_TO_PENDING_INSERTION_MARKS["delete"](editor);
        editor.marks = pendingMarks;
      }
      if (pendingMarks && insertPositionHint === false) {
        insertPositionHint = null;
      }
      var range = targetRange(diff);
      if (!editor.selection || !slate.Range.equals(editor.selection, range)) {
        slate.Transforms.select(editor, range);
      }
      if (diff.diff.text) {
        slate.Editor.insertText(editor, diff.diff.text);
      } else {
        slate.Editor.deleteFragment(editor);
      }
      // Remove diff only after we have applied it to account for it when transforming
      // pending ranges.
      EDITOR_TO_PENDING_DIFFS.set(editor, (_EDITOR_TO_PENDING_DI2 = EDITOR_TO_PENDING_DIFFS.get(editor)) === null || _EDITOR_TO_PENDING_DI2 === void 0 ? void 0 : _EDITOR_TO_PENDING_DI2.filter(function (_ref2) {
        var id = _ref2.id;
        return id !== diff.id;
      }));
      if (!verifyDiffState(editor, diff)) {
        scheduleSelectionChange = false;
        EDITOR_TO_PENDING_ACTION["delete"](editor);
        EDITOR_TO_USER_MARKS["delete"](editor);
        flushing = 'action';
        // Ensure we don't restore the pending user (dom) selection
        // since the document and dom state do not match.
        EDITOR_TO_PENDING_SELECTION["delete"](editor);
        scheduleOnDOMSelectionChange.cancel();
        onDOMSelectionChange.cancel();
        selectionRef === null || selectionRef === void 0 || selectionRef.unref();
      }
    }
    var selection = selectionRef === null || selectionRef === void 0 ? void 0 : selectionRef.unref();
    if (selection && !EDITOR_TO_PENDING_SELECTION.get(editor) && (!editor.selection || !slate.Range.equals(selection, editor.selection))) {
      slate.Transforms.select(editor, selection);
    }
    if (hasPendingAction()) {
      performAction();
      return;
    }
    // COMPAT: The selectionChange event is fired after the action is performed,
    // so we have to manually schedule it to ensure we don't 'throw away' the selection
    // while rendering if we have pending changes.
    if (scheduleSelectionChange) {
      scheduleOnDOMSelectionChange();
    }
    scheduleOnDOMSelectionChange.flush();
    onDOMSelectionChange.flush();
    applyPendingSelection();
    var userMarks = EDITOR_TO_USER_MARKS.get(editor);
    EDITOR_TO_USER_MARKS["delete"](editor);
    if (userMarks !== undefined) {
      editor.marks = userMarks;
      editor.onChange();
    }
  };
  var handleCompositionEnd = function handleCompositionEnd(_event) {
    if (compositionEndTimeoutId) {
      clearTimeout(compositionEndTimeoutId);
    }
    compositionEndTimeoutId = setTimeout(function () {
      IS_COMPOSING.set(editor, false);
      flush();
    }, RESOLVE_DELAY);
  };
  var handleCompositionStart = function handleCompositionStart(_event) {
    IS_COMPOSING.set(editor, true);
    if (compositionEndTimeoutId) {
      clearTimeout(compositionEndTimeoutId);
      compositionEndTimeoutId = null;
    }
  };
  var updatePlaceholderVisibility = function updatePlaceholderVisibility() {
    var forceHide = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var placeholderElement = EDITOR_TO_PLACEHOLDER_ELEMENT.get(editor);
    if (!placeholderElement) {
      return;
    }
    if (hasPendingDiffs() || forceHide) {
      placeholderElement.style.display = 'none';
      return;
    }
    placeholderElement.style.removeProperty('display');
  };
  var storeDiff = function storeDiff(path, diff) {
    var _EDITOR_TO_PENDING_DI3;
    var pendingDiffs = (_EDITOR_TO_PENDING_DI3 = EDITOR_TO_PENDING_DIFFS.get(editor)) !== null && _EDITOR_TO_PENDING_DI3 !== void 0 ? _EDITOR_TO_PENDING_DI3 : [];
    EDITOR_TO_PENDING_DIFFS.set(editor, pendingDiffs);
    var target = slate.Node.leaf(editor, path);
    var idx = pendingDiffs.findIndex(function (change) {
      return slate.Path.equals(change.path, path);
    });
    if (idx < 0) {
      var normalized = normalizeStringDiff(target.text, diff);
      if (normalized) {
        pendingDiffs.push({
          path: path,
          diff: diff,
          id: idCounter++
        });
      }
      updatePlaceholderVisibility();
      return;
    }
    var merged = mergeStringDiffs(target.text, pendingDiffs[idx].diff, diff);
    if (!merged) {
      pendingDiffs.splice(idx, 1);
      updatePlaceholderVisibility();
      return;
    }
    pendingDiffs[idx] = _objectSpread$6(_objectSpread$6({}, pendingDiffs[idx]), {}, {
      diff: merged
    });
  };
  var scheduleAction = function scheduleAction(run) {
    var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      at = _ref3.at;
    insertPositionHint = false;
    EDITOR_TO_PENDING_SELECTION["delete"](editor);
    scheduleOnDOMSelectionChange.cancel();
    onDOMSelectionChange.cancel();
    if (hasPendingAction()) {
      flush();
    }
    EDITOR_TO_PENDING_ACTION.set(editor, {
      at: at,
      run: run
    });
    // COMPAT: When deleting before a non-contenteditable element chrome only fires a beforeinput,
    // (no input) and doesn't perform any dom mutations. Without a flush timeout we would never flush
    // in this case and thus never actually perform the action.
    actionTimeoutId = setTimeout(flush);
  };
  var handleDOMBeforeInput = function handleDOMBeforeInput(event) {
    var _targetRange2;
    if (flushTimeoutId) {
      clearTimeout(flushTimeoutId);
      flushTimeoutId = null;
    }
    var type = event.inputType;
    var targetRange = null;
    var data = event.dataTransfer || event.data || undefined;
    if (insertPositionHint !== false && type !== 'insertText' && type !== 'insertCompositionText') {
      insertPositionHint = false;
    }
    var _event$getTargetRange = event.getTargetRanges(),
      _event$getTargetRange2 = _slicedToArray(_event$getTargetRange, 1),
      nativeTargetRange = _event$getTargetRange2[0];
    if (nativeTargetRange) {
      targetRange = ReactEditor.toSlateRange(editor, nativeTargetRange, {
        exactMatch: false,
        suppressThrow: true
      });
    }
    // COMPAT: SelectionChange event is fired after the action is performed, so we
    // have to manually get the selection here to ensure it's up-to-date.
    var window = ReactEditor.getWindow(editor);
    var domSelection = window.getSelection();
    if (!targetRange && domSelection) {
      nativeTargetRange = domSelection;
      targetRange = ReactEditor.toSlateRange(editor, domSelection, {
        exactMatch: false,
        suppressThrow: true
      });
    }
    targetRange = (_targetRange2 = targetRange) !== null && _targetRange2 !== void 0 ? _targetRange2 : editor.selection;
    if (!targetRange) {
      return;
    }
    // By default, the input manager tries to store text diffs so that we can
    // defer flushing them at a later point in time. We don't want to flush
    // for every input event as this can be expensive. However, there are some
    // scenarios where we cannot safely store the text diff and must instead
    // schedule an action to let Slate normalize the editor state.
    var canStoreDiff = true;
    if (type.startsWith('delete')) {
      if (slate.Range.isExpanded(targetRange)) {
        var _Range$edges = slate.Range.edges(targetRange),
          _Range$edges2 = _slicedToArray(_Range$edges, 2),
          _start = _Range$edges2[0],
          _end = _Range$edges2[1];
        var _leaf = slate.Node.leaf(editor, _start.path);
        if (_leaf.text.length === _start.offset && _end.offset === 0) {
          var next = slate.Editor.next(editor, {
            at: _start.path,
            match: slate.Text.isText
          });
          if (next && slate.Path.equals(next[1], _end.path)) {
            targetRange = {
              anchor: _end,
              focus: _end
            };
          }
        }
      }
      var direction = type.endsWith('Backward') ? 'backward' : 'forward';
      var _Range$edges3 = slate.Range.edges(targetRange),
        _Range$edges4 = _slicedToArray(_Range$edges3, 2),
        start = _Range$edges4[0],
        end = _Range$edges4[1];
      var _Editor$leaf = slate.Editor.leaf(editor, start.path),
        _Editor$leaf2 = _slicedToArray(_Editor$leaf, 2),
        leaf = _Editor$leaf2[0],
        path = _Editor$leaf2[1];
      var diff = {
        text: '',
        start: start.offset,
        end: end.offset
      };
      var pendingDiffs = EDITOR_TO_PENDING_DIFFS.get(editor);
      var relevantPendingDiffs = pendingDiffs === null || pendingDiffs === void 0 ? void 0 : pendingDiffs.find(function (change) {
        return slate.Path.equals(change.path, path);
      });
      var diffs = relevantPendingDiffs ? [relevantPendingDiffs.diff, diff] : [diff];
      var text = applyStringDiff.apply(void 0, [leaf.text].concat(diffs));
      if (text.length === 0) {
        // Text leaf will be removed, so we need to schedule an
        // action to remove it so that Slate can normalize instead
        // of storing as a diff
        canStoreDiff = false;
      }
      if (slate.Range.isExpanded(targetRange)) {
        if (canStoreDiff && slate.Path.equals(targetRange.anchor.path, targetRange.focus.path)) {
          var point = {
            path: targetRange.anchor.path,
            offset: start.offset
          };
          var range = slate.Editor.range(editor, point, point);
          handleUserSelect(range);
          return storeDiff(targetRange.anchor.path, {
            text: '',
            end: end.offset,
            start: start.offset
          });
        }
        return scheduleAction(function () {
          return slate.Editor.deleteFragment(editor, {
            direction: direction
          });
        }, {
          at: targetRange
        });
      }
    }
    switch (type) {
      case 'deleteByComposition':
      case 'deleteByCut':
      case 'deleteByDrag':
        {
          return scheduleAction(function () {
            return slate.Editor.deleteFragment(editor);
          }, {
            at: targetRange
          });
        }
      case 'deleteContent':
      case 'deleteContentForward':
        {
          var _targetRange3 = targetRange,
            anchor = _targetRange3.anchor;
          if (canStoreDiff && slate.Range.isCollapsed(targetRange)) {
            var targetNode = slate.Node.leaf(editor, anchor.path);
            if (anchor.offset < targetNode.text.length) {
              return storeDiff(anchor.path, {
                text: '',
                start: anchor.offset,
                end: anchor.offset + 1
              });
            }
          }
          return scheduleAction(function () {
            return slate.Editor.deleteForward(editor);
          }, {
            at: targetRange
          });
        }
      case 'deleteContentBackward':
        {
          var _nativeTargetRange;
          var _targetRange4 = targetRange,
            _anchor = _targetRange4.anchor;
          // If we have a mismatch between the native and slate selection being collapsed
          // we are most likely deleting a zero-width placeholder and thus should perform it
          // as an action to ensure correct behavior (mostly happens with mark placeholders)
          var nativeCollapsed = isDOMSelection(nativeTargetRange) ? nativeTargetRange.isCollapsed : !!((_nativeTargetRange = nativeTargetRange) !== null && _nativeTargetRange !== void 0 && _nativeTargetRange.collapsed);
          if (canStoreDiff && nativeCollapsed && slate.Range.isCollapsed(targetRange) && _anchor.offset > 0) {
            return storeDiff(_anchor.path, {
              text: '',
              start: _anchor.offset - 1,
              end: _anchor.offset
            });
          }
          return scheduleAction(function () {
            return slate.Editor.deleteBackward(editor);
          }, {
            at: targetRange
          });
        }
      case 'deleteEntireSoftLine':
        {
          return scheduleAction(function () {
            slate.Editor.deleteBackward(editor, {
              unit: 'line'
            });
            slate.Editor.deleteForward(editor, {
              unit: 'line'
            });
          }, {
            at: targetRange
          });
        }
      case 'deleteHardLineBackward':
        {
          return scheduleAction(function () {
            return slate.Editor.deleteBackward(editor, {
              unit: 'block'
            });
          }, {
            at: targetRange
          });
        }
      case 'deleteSoftLineBackward':
        {
          return scheduleAction(function () {
            return slate.Editor.deleteBackward(editor, {
              unit: 'line'
            });
          }, {
            at: targetRange
          });
        }
      case 'deleteHardLineForward':
        {
          return scheduleAction(function () {
            return slate.Editor.deleteForward(editor, {
              unit: 'block'
            });
          }, {
            at: targetRange
          });
        }
      case 'deleteSoftLineForward':
        {
          return scheduleAction(function () {
            return slate.Editor.deleteForward(editor, {
              unit: 'line'
            });
          }, {
            at: targetRange
          });
        }
      case 'deleteWordBackward':
        {
          return scheduleAction(function () {
            return slate.Editor.deleteBackward(editor, {
              unit: 'word'
            });
          }, {
            at: targetRange
          });
        }
      case 'deleteWordForward':
        {
          return scheduleAction(function () {
            return slate.Editor.deleteForward(editor, {
              unit: 'word'
            });
          }, {
            at: targetRange
          });
        }
      case 'insertLineBreak':
        {
          return scheduleAction(function () {
            return slate.Editor.insertSoftBreak(editor);
          }, {
            at: targetRange
          });
        }
      case 'insertParagraph':
        {
          return scheduleAction(function () {
            return slate.Editor.insertBreak(editor);
          }, {
            at: targetRange
          });
        }
      case 'insertCompositionText':
      case 'deleteCompositionText':
      case 'insertFromComposition':
      case 'insertFromDrop':
      case 'insertFromPaste':
      case 'insertFromYank':
      case 'insertReplacementText':
      case 'insertText':
        {
          if (isDataTransfer(data)) {
            return scheduleAction(function () {
              return ReactEditor.insertData(editor, data);
            }, {
              at: targetRange
            });
          }
          var _text = data !== null && data !== void 0 ? data : '';
          // COMPAT: If we are writing inside a placeholder, the ime inserts the text inside
          // the placeholder itself and thus includes the zero-width space inside edit events.
          if (EDITOR_TO_PENDING_INSERTION_MARKS.get(editor)) {
            _text = _text.replace("\uFEFF", '');
          }
          // Pastes from the Android clipboard will generate `insertText` events.
          // If the copied text contains any newlines, Android will append an
          // extra newline to the end of the copied text.
          if (type === 'insertText' && /.*\n.*\n$/.test(_text)) {
            _text = _text.slice(0, -1);
          }
          // If the text includes a newline, split it at newlines and paste each component
          // string, with soft breaks in between each.
          if (_text.includes('\n')) {
            return scheduleAction(function () {
              var parts = _text.split('\n');
              parts.forEach(function (line, i) {
                if (line) {
                  slate.Editor.insertText(editor, line);
                }
                if (i !== parts.length - 1) {
                  slate.Editor.insertSoftBreak(editor);
                }
              });
            }, {
              at: targetRange
            });
          }
          if (slate.Path.equals(targetRange.anchor.path, targetRange.focus.path)) {
            var _Range$edges5 = slate.Range.edges(targetRange),
              _Range$edges6 = _slicedToArray(_Range$edges5, 2),
              _start2 = _Range$edges6[0],
              _end2 = _Range$edges6[1];
            var _diff = {
              start: _start2.offset,
              end: _end2.offset,
              text: _text
            };
            // COMPAT: Swiftkey has a weird bug where the target range of the 2nd word
            // inserted after a mark placeholder is inserted with an anchor offset off by 1.
            // So writing 'some text' will result in 'some ttext'. Luckily all 'normal' insert
            // text events are fired with the correct target ranges, only the final 'insertComposition'
            // isn't, so we can adjust the target range start offset if we are confident this is the
            // swiftkey insert causing the issue.
            if (_text && insertPositionHint && type === 'insertCompositionText') {
              var hintPosition = insertPositionHint.start + insertPositionHint.text.search(/\S|$/);
              var diffPosition = _diff.start + _diff.text.search(/\S|$/);
              if (diffPosition === hintPosition + 1 && _diff.end === insertPositionHint.start + insertPositionHint.text.length) {
                _diff.start -= 1;
                insertPositionHint = null;
                scheduleFlush();
              } else {
                insertPositionHint = false;
              }
            } else if (type === 'insertText') {
              if (insertPositionHint === null) {
                insertPositionHint = _diff;
              } else if (insertPositionHint && slate.Range.isCollapsed(targetRange) && insertPositionHint.end + insertPositionHint.text.length === _start2.offset) {
                insertPositionHint = _objectSpread$6(_objectSpread$6({}, insertPositionHint), {}, {
                  text: insertPositionHint.text + _text
                });
              } else {
                insertPositionHint = false;
              }
            } else {
              insertPositionHint = false;
            }
            if (canStoreDiff) {
              storeDiff(_start2.path, _diff);
              return;
            }
          }
          return scheduleAction(function () {
            return slate.Editor.insertText(editor, _text);
          }, {
            at: targetRange
          });
        }
    }
  };
  var hasPendingAction = function hasPendingAction() {
    return !!EDITOR_TO_PENDING_ACTION.get(editor);
  };
  var hasPendingDiffs = function hasPendingDiffs() {
    var _EDITOR_TO_PENDING_DI4;
    return !!((_EDITOR_TO_PENDING_DI4 = EDITOR_TO_PENDING_DIFFS.get(editor)) !== null && _EDITOR_TO_PENDING_DI4 !== void 0 && _EDITOR_TO_PENDING_DI4.length);
  };
  var hasPendingChanges = function hasPendingChanges() {
    return hasPendingAction() || hasPendingDiffs();
  };
  var isFlushing = function isFlushing() {
    return flushing;
  };
  var handleUserSelect = function handleUserSelect(range) {
    EDITOR_TO_PENDING_SELECTION.set(editor, range);
    if (flushTimeoutId) {
      clearTimeout(flushTimeoutId);
      flushTimeoutId = null;
    }
    var selection = editor.selection;
    if (!range) {
      return;
    }
    var pathChanged = !selection || !slate.Path.equals(selection.anchor.path, range.anchor.path);
    var parentPathChanged = !selection || !slate.Path.equals(selection.anchor.path.slice(0, -1), range.anchor.path.slice(0, -1));
    if (pathChanged && insertPositionHint || parentPathChanged) {
      insertPositionHint = false;
    }
    if (pathChanged || hasPendingDiffs()) {
      flushTimeoutId = setTimeout(flush, FLUSH_DELAY);
    }
  };
  var handleInput = function handleInput() {
    if (hasPendingAction() || !hasPendingDiffs()) {
      flush();
    }
  };
  var handleKeyDown = function handleKeyDown(_) {
    // COMPAT: Swiftkey closes the keyboard when typing inside a empty node
    // directly next to a non-contenteditable element (= the placeholder).
    // The only event fired soon enough for us to allow hiding the placeholder
    // without swiftkey picking it up is the keydown event, so we have to hide it
    // here. See https://github.com/ianstormtaylor/slate/pull/4988#issuecomment-1201050535
    if (!hasPendingDiffs()) {
      updatePlaceholderVisibility(true);
      setTimeout(updatePlaceholderVisibility);
    }
  };
  var scheduleFlush = function scheduleFlush() {
    if (!hasPendingAction()) {
      actionTimeoutId = setTimeout(flush);
    }
  };
  var handleDomMutations = function handleDomMutations(mutations) {
    if (hasPendingDiffs() || hasPendingAction()) {
      return;
    }
    if (mutations.some(function (mutation) {
      return isTrackedMutation(editor, mutation, mutations);
    })) {
      var _EDITOR_TO_FORCE_REND;
      // Cause a re-render to restore the dom state if we encounter tracked mutations without
      // a corresponding pending action.
      (_EDITOR_TO_FORCE_REND = EDITOR_TO_FORCE_RENDER.get(editor)) === null || _EDITOR_TO_FORCE_REND === void 0 || _EDITOR_TO_FORCE_REND();
    }
  };
  return {
    flush: flush,
    scheduleFlush: scheduleFlush,
    hasPendingDiffs: hasPendingDiffs,
    hasPendingAction: hasPendingAction,
    hasPendingChanges: hasPendingChanges,
    isFlushing: isFlushing,
    handleUserSelect: handleUserSelect,
    handleCompositionEnd: handleCompositionEnd,
    handleCompositionStart: handleCompositionStart,
    handleDOMBeforeInput: handleDOMBeforeInput,
    handleKeyDown: handleKeyDown,
    handleDomMutations: handleDomMutations,
    handleInput: handleInput
  };
}

function useIsMounted() {
  var isMountedRef = React.useRef(false);
  React.useEffect(function () {
    isMountedRef.current = true;
    return function () {
      isMountedRef.current = false;
    };
  }, []);
  return isMountedRef.current;
}

/**
 * Prevent warning on SSR by falling back to useEffect when DOM isn't available
 */
var useIsomorphicLayoutEffect = CAN_USE_DOM ? React.useLayoutEffect : React.useEffect;

function useMutationObserver(node, callback, options) {
  var _useState = React.useState(function () {
      return new MutationObserver(callback);
    }),
    _useState2 = _slicedToArray(_useState, 1),
    mutationObserver = _useState2[0];
  useIsomorphicLayoutEffect(function () {
    // Discard mutations caused during render phase. This works due to react calling
    // useLayoutEffect synchronously after the render phase before the next tick.
    mutationObserver.takeRecords();
  });
  React.useEffect(function () {
    if (!node.current) {
      throw new Error('Failed to attach MutationObserver, `node` is undefined');
    }
    mutationObserver.observe(node.current, options);
    return function () {
      return mutationObserver.disconnect();
    };
  }, [mutationObserver, node, options]);
}

var _excluded$3 = ["node"];
function ownKeys$5(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$5(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$5(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$5(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var MUTATION_OBSERVER_CONFIG$1 = {
  subtree: true,
  childList: true,
  characterData: true
};
var useAndroidInputManager = !IS_ANDROID ? function () {
  return null;
} : function (_ref) {
  var node = _ref.node,
    options = _objectWithoutProperties(_ref, _excluded$3);
  if (!IS_ANDROID) {
    return null;
  }
  var editor = useSlateStatic();
  var isMounted = useIsMounted();
  var _useState = React.useState(function () {
      return createAndroidInputManager(_objectSpread$5({
        editor: editor
      }, options));
    }),
    _useState2 = _slicedToArray(_useState, 1),
    inputManager = _useState2[0];
  useMutationObserver(node, inputManager.handleDomMutations, MUTATION_OBSERVER_CONFIG$1);
  EDITOR_TO_SCHEDULE_FLUSH.set(editor, inputManager.scheduleFlush);
  if (isMounted) {
    inputManager.flush();
  }
  return inputManager;
};

var _excluded$2 = ["anchor", "focus"],
  _excluded2$1 = ["anchor", "focus"];
var shallowCompare = function shallowCompare(obj1, obj2) {
  return Object.keys(obj1).length === Object.keys(obj2).length && Object.keys(obj1).every(function (key) {
    return obj2.hasOwnProperty(key) && obj1[key] === obj2[key];
  });
};
var isDecorationFlagsEqual = function isDecorationFlagsEqual(range, other) {
  range.anchor;
    range.focus;
    var rangeOwnProps = _objectWithoutProperties(range, _excluded$2);
  other.anchor;
    other.focus;
    var otherOwnProps = _objectWithoutProperties(other, _excluded2$1);
  return range[PLACEHOLDER_SYMBOL] === other[PLACEHOLDER_SYMBOL] && shallowCompare(rangeOwnProps, otherOwnProps);
};
/**
 * Check if a list of decorator ranges are equal to another.
 *
 * PERF: this requires the two lists to also have the ranges inside them in the
 * same order, but this is an okay constraint for us since decorations are
 * kept in order, and the odd case where they aren't is okay to re-render for.
 */
var isElementDecorationsEqual = function isElementDecorationsEqual(list, another) {
  if (list.length !== another.length) {
    return false;
  }
  for (var i = 0; i < list.length; i++) {
    var range = list[i];
    var other = another[i];
    if (!slate.Range.equals(range, other) || !isDecorationFlagsEqual(range, other)) {
      return false;
    }
  }
  return true;
};
/**
 * Check if a list of decorator ranges are equal to another.
 *
 * PERF: this requires the two lists to also have the ranges inside them in the
 * same order, but this is an okay constraint for us since decorations are
 * kept in order, and the odd case where they aren't is okay to re-render for.
 */
var isTextDecorationsEqual = function isTextDecorationsEqual(list, another) {
  if (list.length !== another.length) {
    return false;
  }
  for (var i = 0; i < list.length; i++) {
    var range = list[i];
    var other = another[i];
    // compare only offsets because paths doesn't matter for text
    if (range.anchor.offset !== other.anchor.offset || range.focus.offset !== other.focus.offset || !isDecorationFlagsEqual(range, other)) {
      return false;
    }
  }
  return true;
};

function ownKeys$4(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$4(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$4(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$4(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
/**
 * Leaf content strings.
 */
var String$1 = function String(props) {
  var isLast = props.isLast,
    leaf = props.leaf,
    parent = props.parent,
    text = props.text;
  var editor = useSlateStatic();
  var path = ReactEditor.findPath(editor, text);
  var parentPath = slate.Path.parent(path);
  var isMarkPlaceholder = Boolean(leaf[MARK_PLACEHOLDER_SYMBOL]);
  // COMPAT: Render text inside void nodes with a zero-width space.
  // So the node can contain selection but the text is not visible.
  if (editor.isVoid(parent)) {
    return /*#__PURE__*/React.createElement(ZeroWidthString, {
      length: slate.Node.string(parent).length
    });
  }
  // COMPAT: If this is the last text node in an empty block, render a zero-
  // width space that will convert into a line break when copying and pasting
  // to support expected plain text.
  if (leaf.text === '' && parent.children[parent.children.length - 1] === text && !editor.isInline(parent) && slate.Editor.string(editor, parentPath) === '') {
    return /*#__PURE__*/React.createElement(ZeroWidthString, {
      isLineBreak: true,
      isMarkPlaceholder: isMarkPlaceholder
    });
  }
  // COMPAT: If the text is empty, it's because it's on the edge of an inline
  // node, so we render a zero-width space so that the selection can be
  // inserted next to it still.
  if (leaf.text === '') {
    return /*#__PURE__*/React.createElement(ZeroWidthString, {
      isMarkPlaceholder: isMarkPlaceholder
    });
  }
  // COMPAT: Browsers will collapse trailing new lines at the end of blocks,
  // so we need to add an extra trailing new lines to prevent that.
  if (isLast && leaf.text.slice(-1) === '\n') {
    return /*#__PURE__*/React.createElement(TextString, {
      isTrailing: true,
      text: leaf.text
    });
  }
  return /*#__PURE__*/React.createElement(TextString, {
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
  };
  var _useState = React.useState(getTextContent),
    _useState2 = _slicedToArray(_useState, 1),
    initialText = _useState2[0];
  // This is the actual text rendering boundary where we interface with the DOM
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
    }
    // intentionally not specifying dependencies, so that this effect runs on every render
    // as this effectively replaces "specifying the text in the virtual DOM under the <span> below" on each render
  });
  // We intentionally render a memoized <span> that only receives the initial text content when the component is mounted.
  // We defer to the layout effect above to update the `textContent` of the span element when needed.
  return /*#__PURE__*/React.createElement(MemoizedText$1, {
    ref: ref
  }, initialText);
};
var MemoizedText$1 = /*#__PURE__*/React.memo( /*#__PURE__*/React.forwardRef(function (props, ref) {
  return /*#__PURE__*/React.createElement("span", {
    "data-slate-string": true,
    ref: ref
  }, props.children);
}));
/**
 * Leaf strings without text, render as zero-width strings.
 */
var ZeroWidthString = function ZeroWidthString(props) {
  var _props$length = props.length,
    length = _props$length === void 0 ? 0 : _props$length,
    _props$isLineBreak = props.isLineBreak,
    isLineBreak = _props$isLineBreak === void 0 ? false : _props$isLineBreak,
    _props$isMarkPlacehol = props.isMarkPlaceholder,
    isMarkPlaceholder = _props$isMarkPlacehol === void 0 ? false : _props$isMarkPlacehol;
  var attributes = {
    'data-slate-zero-width': isLineBreak ? 'n' : 'z',
    'data-slate-length': length
  };
  if (isMarkPlaceholder) {
    attributes['data-slate-mark-placeholder'] = true;
  }
  return /*#__PURE__*/React.createElement("span", _objectSpread$4({}, attributes), !IS_ANDROID || !isLineBreak ? "\uFEFF" : null, isLineBreak ? /*#__PURE__*/React.createElement("br", null) : null);
};

function ownKeys$3(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$3(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$3(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$3(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
// Delay the placeholder on Android to prevent the keyboard from closing.
// (https://github.com/ianstormtaylor/slate/pull/5368)
var PLACEHOLDER_DELAY = IS_ANDROID ? 300 : 0;
function disconnectPlaceholderResizeObserver(placeholderResizeObserver, releaseObserver) {
  if (placeholderResizeObserver.current) {
    placeholderResizeObserver.current.disconnect();
    if (releaseObserver) {
      placeholderResizeObserver.current = null;
    }
  }
}
function clearTimeoutRef(timeoutRef) {
  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }
}
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
      return /*#__PURE__*/React.createElement(DefaultLeaf, _objectSpread$3({}, props));
    } : _props$renderLeaf;
  var editor = useSlateStatic();
  var placeholderResizeObserver = React.useRef(null);
  var placeholderRef = React.useRef(null);
  var _useState = React.useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    showPlaceholder = _useState2[0],
    setShowPlaceholder = _useState2[1];
  var showPlaceholderTimeoutRef = React.useRef(null);
  var callbackPlaceholderRef = React.useCallback(function (placeholderEl) {
    disconnectPlaceholderResizeObserver(placeholderResizeObserver, placeholderEl == null);
    if (placeholderEl == null) {
      var _leaf$onPlaceholderRe;
      EDITOR_TO_PLACEHOLDER_ELEMENT["delete"](editor);
      (_leaf$onPlaceholderRe = leaf.onPlaceholderResize) === null || _leaf$onPlaceholderRe === void 0 || _leaf$onPlaceholderRe.call(leaf, null);
    } else {
      EDITOR_TO_PLACEHOLDER_ELEMENT.set(editor, placeholderEl);
      if (!placeholderResizeObserver.current) {
        // Create a new observer and observe the placeholder element.
        var ResizeObserver = window.ResizeObserver || resizeObserver.ResizeObserver;
        placeholderResizeObserver.current = new ResizeObserver(function () {
          var _leaf$onPlaceholderRe2;
          (_leaf$onPlaceholderRe2 = leaf.onPlaceholderResize) === null || _leaf$onPlaceholderRe2 === void 0 || _leaf$onPlaceholderRe2.call(leaf, placeholderEl);
        });
      }
      placeholderResizeObserver.current.observe(placeholderEl);
      placeholderRef.current = placeholderEl;
    }
  }, [placeholderRef, leaf, editor]);
  var children = /*#__PURE__*/React.createElement(String$1, {
    isLast: isLast,
    leaf: leaf,
    parent: parent,
    text: text
  });
  var leafIsPlaceholder = Boolean(leaf[PLACEHOLDER_SYMBOL]);
  React.useEffect(function () {
    if (leafIsPlaceholder) {
      if (!showPlaceholderTimeoutRef.current) {
        // Delay the placeholder, so it will not render in a selection
        showPlaceholderTimeoutRef.current = setTimeout(function () {
          setShowPlaceholder(true);
          showPlaceholderTimeoutRef.current = null;
        }, PLACEHOLDER_DELAY);
      }
    } else {
      clearTimeoutRef(showPlaceholderTimeoutRef);
      setShowPlaceholder(false);
    }
    return function () {
      return clearTimeoutRef(showPlaceholderTimeoutRef);
    };
  }, [leafIsPlaceholder, setShowPlaceholder]);
  if (leafIsPlaceholder && showPlaceholder) {
    var placeholderProps = {
      children: leaf.placeholder,
      attributes: {
        'data-slate-placeholder': true,
        style: {
          position: 'absolute',
          top: 0,
          pointerEvents: 'none',
          width: '100%',
          maxWidth: '100%',
          display: 'block',
          opacity: '0.333',
          userSelect: 'none',
          textDecoration: 'none',
          // Fixes https://github.com/udecode/plate/issues/2315
          WebkitUserModify: IS_WEBKIT ? 'inherit' : undefined
        },
        contentEditable: false,
        ref: callbackPlaceholderRef
      }
    };
    children = /*#__PURE__*/React.createElement(React.Fragment, null, renderPlaceholder(placeholderProps), children);
  }
  // COMPAT: Having the `data-` attributes on these leaf elements ensures that
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
var MemoizedLeaf = /*#__PURE__*/React.memo(Leaf, function (prev, next) {
  return next.parent === prev.parent && next.isLast === prev.isLast && next.renderLeaf === prev.renderLeaf && next.renderPlaceholder === prev.renderPlaceholder && next.text === prev.text && slate.Text.equals(next.leaf, prev.leaf) && next.leaf[PLACEHOLDER_SYMBOL] === prev.leaf[PLACEHOLDER_SYMBOL];
});
var DefaultLeaf = function DefaultLeaf(props) {
  var attributes = props.attributes,
    children = props.children;
  return /*#__PURE__*/React.createElement("span", _objectSpread$3({}, attributes), children);
};

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
    children.push( /*#__PURE__*/React.createElement(MemoizedLeaf, {
      isLast: isLast && i === leaves.length - 1,
      key: "".concat(key.id, "-").concat(i),
      renderPlaceholder: renderPlaceholder,
      leaf: leaf,
      text: text,
      parent: parent,
      renderLeaf: renderLeaf
    }));
  }
  // Update element-related weak maps with the DOM element ref.
  var callbackRef = React.useCallback(function (span) {
    var KEY_TO_ELEMENT = EDITOR_TO_KEY_TO_ELEMENT.get(editor);
    if (span) {
      KEY_TO_ELEMENT === null || KEY_TO_ELEMENT === void 0 || KEY_TO_ELEMENT.set(key, span);
      NODE_TO_ELEMENT.set(text, span);
      ELEMENT_TO_NODE.set(span, text);
    } else {
      KEY_TO_ELEMENT === null || KEY_TO_ELEMENT === void 0 || KEY_TO_ELEMENT["delete"](key);
      NODE_TO_ELEMENT["delete"](text);
      if (ref.current) {
        ELEMENT_TO_NODE["delete"](ref.current);
      }
    }
    ref.current = span;
  }, [ref, editor, key, text]);
  return /*#__PURE__*/React.createElement("span", {
    "data-slate-node": "text",
    ref: callbackRef
  }, children);
};
var MemoizedText = /*#__PURE__*/React.memo(Text, function (prev, next) {
  return next.parent === prev.parent && next.isLast === prev.isLast && next.renderLeaf === prev.renderLeaf && next.renderPlaceholder === prev.renderPlaceholder && next.text === prev.text && isTextDecorationsEqual(next.decorations, prev.decorations);
});

function ownKeys$2(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$2(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$2(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$2(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
/**
 * Element.
 */
var Element = function Element(props) {
  var decorations = props.decorations,
    element = props.element,
    _props$renderElement = props.renderElement,
    renderElement = _props$renderElement === void 0 ? function (p) {
      return /*#__PURE__*/React.createElement(DefaultElement, _objectSpread$2({}, p));
    } : _props$renderElement,
    renderPlaceholder = props.renderPlaceholder,
    renderLeaf = props.renderLeaf,
    selection = props.selection;
  var editor = useSlateStatic();
  var readOnly = useReadOnly();
  var isInline = editor.isInline(element);
  var key = ReactEditor.findKey(editor, element);
  var ref = React.useCallback(function (ref) {
    // Update element-related weak maps with the DOM element ref.
    var KEY_TO_ELEMENT = EDITOR_TO_KEY_TO_ELEMENT.get(editor);
    if (ref) {
      KEY_TO_ELEMENT === null || KEY_TO_ELEMENT === void 0 || KEY_TO_ELEMENT.set(key, ref);
      NODE_TO_ELEMENT.set(element, ref);
      ELEMENT_TO_NODE.set(ref, element);
    } else {
      KEY_TO_ELEMENT === null || KEY_TO_ELEMENT === void 0 || KEY_TO_ELEMENT["delete"](key);
      NODE_TO_ELEMENT["delete"](element);
    }
  }, [editor, key, element]);
  var children = useChildren({
    decorations: decorations,
    node: element,
    renderElement: renderElement,
    renderPlaceholder: renderPlaceholder,
    renderLeaf: renderLeaf,
    selection: selection
  });
  // Attributes that the developer must mix into the element in their
  // custom node renderer component.
  var attributes = {
    'data-slate-node': 'element',
    ref: ref
  };
  if (isInline) {
    attributes['data-slate-inline'] = true;
  }
  // If it's a block node with inline children, add the proper `dir` attribute
  // for text direction.
  if (!isInline && slate.Editor.hasInlines(editor, element)) {
    var text = slate.Node.string(element);
    var dir = getDirection(text);
    if (dir === 'rtl') {
      attributes.dir = dir;
    }
  }
  // If it's a void node, wrap the children in extra void-specific elements.
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
    children = /*#__PURE__*/React.createElement(Tag, {
      "data-slate-spacer": true,
      style: {
        height: '0',
        color: 'transparent',
        outline: 'none',
        position: 'absolute'
      }
    }, /*#__PURE__*/React.createElement(MemoizedText, {
      renderPlaceholder: renderPlaceholder,
      decorations: [],
      isLast: false,
      parent: element,
      text: _text
    }));
    NODE_TO_INDEX.set(_text, 0);
    NODE_TO_PARENT.set(_text, element);
  }
  return renderElement({
    attributes: attributes,
    children: children,
    element: element
  });
};
var MemoizedElement = /*#__PURE__*/React.memo(Element, function (prev, next) {
  return prev.element === next.element && prev.renderElement === next.renderElement && prev.renderLeaf === next.renderLeaf && prev.renderPlaceholder === next.renderPlaceholder && isElementDecorationsEqual(prev.decorations, next.decorations) && (prev.selection === next.selection || !!prev.selection && !!next.selection && slate.Range.equals(prev.selection, next.selection));
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
  return /*#__PURE__*/React.createElement(Tag, _objectSpread$2(_objectSpread$2({}, attributes), {}, {
    style: {
      position: 'relative'
    }
  }), children);
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

function _createForOfIteratorHelper$2(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$2(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray$2(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$2(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$2(o, minLen); }
function _arrayLikeToArray$2(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
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
    var _iterator = _createForOfIteratorHelper$2(decorations),
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
      children.push( /*#__PURE__*/React.createElement(SelectedContext.Provider, {
        key: "provider-".concat(key.id),
        value: !!sel
      }, /*#__PURE__*/React.createElement(MemoizedElement, {
        decorations: ds,
        element: n,
        key: key.id,
        renderElement: renderElement,
        renderPlaceholder: renderPlaceholder,
        renderLeaf: renderLeaf,
        selection: sel
      })));
    } else {
      children.push( /*#__PURE__*/React.createElement(MemoizedText, {
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
 * A React context for sharing the `readOnly` state of the editor.
 */
var ReadOnlyContext = /*#__PURE__*/React.createContext(false);
/**
 * Get the current `readOnly` state of the editor.
 */
var useReadOnly = function useReadOnly() {
  return React.useContext(ReadOnlyContext);
};

var SlateContext = /*#__PURE__*/React.createContext(null);
/**
 * Get the current editor object from the React context.
 */
var useSlate = function useSlate() {
  var context = React.useContext(SlateContext);
  if (!context) {
    throw new Error("The `useSlate` hook must be used inside the <Slate> component's context.");
  }
  var editor = context.editor;
  return editor;
};
var useSlateWithV = function useSlateWithV() {
  var context = React.useContext(SlateContext);
  if (!context) {
    throw new Error("The `useSlate` hook must be used inside the <Slate> component's context.");
  }
  return context;
};

function useTrackUserInput() {
  var editor = useSlateStatic();
  var receivedUserInput = React.useRef(false);
  var animationFrameIdRef = React.useRef(0);
  var onUserInput = React.useCallback(function () {
    if (receivedUserInput.current) {
      return;
    }
    receivedUserInput.current = true;
    var window = ReactEditor.getWindow(editor);
    window.cancelAnimationFrame(animationFrameIdRef.current);
    animationFrameIdRef.current = window.requestAnimationFrame(function () {
      receivedUserInput.current = false;
    });
  }, [editor]);
  React.useEffect(function () {
    return function () {
      return cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, []);
  return {
    receivedUserInput: receivedUserInput,
    onUserInput: onUserInput
  };
}

var TRIPLE_CLICK = 3;

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
  var isGeneric = generic && isHotkey.isHotkey(generic);
  var isApple = apple && isHotkey.isHotkey(apple);
  var isWindows = windows && isHotkey.isHotkey(windows);
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

var assertThisInitialized = createCommonjsModule(function (module) {
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
module.exports = _assertThisInitialized, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var _assertThisInitialized = unwrapExports(assertThisInitialized);

var setPrototypeOf = createCommonjsModule(function (module) {
function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  return _setPrototypeOf(o, p);
}
module.exports = _setPrototypeOf, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

unwrapExports(setPrototypeOf);

var inherits = createCommonjsModule(function (module) {
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) setPrototypeOf(subClass, superClass);
}
module.exports = _inherits, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var _inherits = unwrapExports(inherits);

var possibleConstructorReturn = createCommonjsModule(function (module) {
var _typeof = _typeof_1["default"];

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return assertThisInitialized(self);
}
module.exports = _possibleConstructorReturn, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var _possibleConstructorReturn = unwrapExports(possibleConstructorReturn);

var getPrototypeOf = createCommonjsModule(function (module) {
function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  return _getPrototypeOf(o);
}
module.exports = _getPrototypeOf, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var _getPrototypeOf = unwrapExports(getPrototypeOf);

var createRestoreDomManager = function createRestoreDomManager(editor, receivedUserInput) {
  var bufferedMutations = [];
  var clear = function clear() {
    bufferedMutations = [];
  };
  var registerMutations = function registerMutations(mutations) {
    var _bufferedMutations;
    if (!receivedUserInput.current) {
      return;
    }
    var trackedMutations = mutations.filter(function (mutation) {
      return isTrackedMutation(editor, mutation, mutations);
    });
    (_bufferedMutations = bufferedMutations).push.apply(_bufferedMutations, _toConsumableArray(trackedMutations));
  };
  function restoreDOM() {
    if (bufferedMutations.length > 0) {
      bufferedMutations.reverse().forEach(function (mutation) {
        if (mutation.type === 'characterData') {
          // We don't want to restore the DOM for characterData mutations
          // because this interrupts the composition.
          return;
        }
        mutation.removedNodes.forEach(function (node) {
          mutation.target.insertBefore(node, mutation.nextSibling);
        });
        mutation.addedNodes.forEach(function (node) {
          mutation.target.removeChild(node);
        });
      });
      // Clear buffered mutations to ensure we don't undo them twice
      clear();
    }
  }
  return {
    registerMutations: registerMutations,
    restoreDOM: restoreDOM,
    clear: clear
  };
};

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var MUTATION_OBSERVER_CONFIG = {
  subtree: true,
  childList: true,
  characterData: true,
  characterDataOldValue: true
};
// We have to use a class component here since we rely on `getSnapshotBeforeUpdate` which has no FC equivalent
// to run code synchronously immediately before react commits the component update to the DOM.
var RestoreDOMComponent = /*#__PURE__*/function (_Component) {
  _inherits(RestoreDOMComponent, _Component);
  var _super = _createSuper(RestoreDOMComponent);
  function RestoreDOMComponent() {
    var _this;
    _classCallCheck(this, RestoreDOMComponent);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "context", null);
    _defineProperty(_assertThisInitialized(_this), "manager", null);
    _defineProperty(_assertThisInitialized(_this), "mutationObserver", null);
    return _this;
  }
  _createClass(RestoreDOMComponent, [{
    key: "observe",
    value: function observe() {
      var _this$mutationObserve;
      var node = this.props.node;
      if (!node.current) {
        throw new Error('Failed to attach MutationObserver, `node` is undefined');
      }
      (_this$mutationObserve = this.mutationObserver) === null || _this$mutationObserve === void 0 || _this$mutationObserve.observe(node.current, MUTATION_OBSERVER_CONFIG);
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var receivedUserInput = this.props.receivedUserInput;
      var editor = this.context;
      this.manager = createRestoreDomManager(editor, receivedUserInput);
      this.mutationObserver = new MutationObserver(this.manager.registerMutations);
      this.observe();
    }
  }, {
    key: "getSnapshotBeforeUpdate",
    value: function getSnapshotBeforeUpdate() {
      var _this$mutationObserve2, _this$mutationObserve3, _this$manager2;
      var pendingMutations = (_this$mutationObserve2 = this.mutationObserver) === null || _this$mutationObserve2 === void 0 ? void 0 : _this$mutationObserve2.takeRecords();
      if (pendingMutations !== null && pendingMutations !== void 0 && pendingMutations.length) {
        var _this$manager;
        (_this$manager = this.manager) === null || _this$manager === void 0 || _this$manager.registerMutations(pendingMutations);
      }
      (_this$mutationObserve3 = this.mutationObserver) === null || _this$mutationObserve3 === void 0 || _this$mutationObserve3.disconnect();
      (_this$manager2 = this.manager) === null || _this$manager2 === void 0 || _this$manager2.restoreDOM();
      return null;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var _this$manager3;
      (_this$manager3 = this.manager) === null || _this$manager3 === void 0 || _this$manager3.clear();
      this.observe();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var _this$mutationObserve4;
      (_this$mutationObserve4 = this.mutationObserver) === null || _this$mutationObserve4 === void 0 || _this$mutationObserve4.disconnect();
    }
  }, {
    key: "render",
    value: function render() {
      return this.props.children;
    }
  }]);
  return RestoreDOMComponent;
}(React.Component);
_defineProperty(RestoreDOMComponent, "contextType", EditorContext);
var RestoreDOM = IS_ANDROID ? RestoreDOMComponent : function (_ref) {
  var children = _ref.children;
  return /*#__PURE__*/React.createElement(React.Fragment, null, children);
};

var _excluded$1 = ["autoFocus", "decorate", "onDOMBeforeInput", "placeholder", "readOnly", "renderElement", "renderLeaf", "renderPlaceholder", "scrollSelectionIntoView", "style", "as", "disableDefaultStyles"],
  _excluded2 = ["text"];
function _createForOfIteratorHelper$1(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$1(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray$1(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$1(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen); }
function _arrayLikeToArray$1(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function ownKeys$1(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$1(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$1(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$1(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var Children = function Children(props) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, useChildren(props));
};
/**
 * Editable.
 */
var Editable = function Editable(props) {
  var defaultRenderPlaceholder = React.useCallback(function (props) {
    return /*#__PURE__*/React.createElement(DefaultPlaceholder, _objectSpread$1({}, props));
  }, []);
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
    renderPlaceholder = _props$renderPlacehol === void 0 ? defaultRenderPlaceholder : _props$renderPlacehol,
    _props$scrollSelectio = props.scrollSelectionIntoView,
    scrollSelectionIntoView = _props$scrollSelectio === void 0 ? defaultScrollSelectionIntoView : _props$scrollSelectio,
    _props$style = props.style,
    userStyle = _props$style === void 0 ? {} : _props$style,
    _props$as = props.as,
    Component = _props$as === void 0 ? 'div' : _props$as,
    _props$disableDefault = props.disableDefaultStyles,
    disableDefaultStyles = _props$disableDefault === void 0 ? false : _props$disableDefault,
    attributes = _objectWithoutProperties(props, _excluded$1);
  var editor = useSlate();
  // Rerender editor when composition status changed
  var _useState = React.useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    isComposing = _useState2[0],
    setIsComposing = _useState2[1];
  var ref = React.useRef(null);
  var deferredOperations = React.useRef([]);
  var _useState3 = React.useState(),
    _useState4 = _slicedToArray(_useState3, 2),
    placeholderHeight = _useState4[0],
    setPlaceholderHeight = _useState4[1];
  var _useTrackUserInput = useTrackUserInput(),
    onUserInput = _useTrackUserInput.onUserInput,
    receivedUserInput = _useTrackUserInput.receivedUserInput;
  var _useReducer = React.useReducer(function (s) {
      return s + 1;
    }, 0),
    _useReducer2 = _slicedToArray(_useReducer, 2),
    forceRender = _useReducer2[1];
  EDITOR_TO_FORCE_RENDER.set(editor, forceRender);
  // Update internal state on each render.
  IS_READ_ONLY.set(editor, readOnly);
  // Keep track of some state for the event handler logic.
  var state = React.useMemo(function () {
    return {
      isDraggingInternally: false,
      isUpdatingSelection: false,
      latestElement: null,
      hasMarkPlaceholder: false
    };
  }, []);
  // The autoFocus TextareaHTMLAttribute doesn't do anything on a div, so it
  // needs to be manually focused.
  React.useEffect(function () {
    if (ref.current && autoFocus) {
      ref.current.focus();
    }
  }, [autoFocus]);
  /**
   * The AndroidInputManager object has a cyclical dependency on onDOMSelectionChange
   *
   * It is defined as a reference to simplify hook dependencies and clarify that
   * it needs to be initialized.
   */
  var androidInputManagerRef = React.useRef();
  // Listen on the native `selectionchange` event to be able to update any time
  // the selection changes. This is required because React's `onSelect` is leaky
  // and non-standard so it doesn't fire until after a selection has been
  // released. This causes issues in situations where another change happens
  // while a selection is being dragged.
  var onDOMSelectionChange = React.useMemo(function () {
    return throttle(function () {
      var androidInputManager = androidInputManagerRef.current;
      if ((IS_ANDROID || !ReactEditor.isComposing(editor)) && (!state.isUpdatingSelection || androidInputManager !== null && androidInputManager !== void 0 && androidInputManager.isFlushing()) && !state.isDraggingInternally) {
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
        var anchorNodeSelectable = ReactEditor.hasEditableTarget(editor, anchorNode) || ReactEditor.isTargetInsideNonReadonlyVoid(editor, anchorNode);
        var focusNodeSelectable = ReactEditor.hasEditableTarget(editor, focusNode) || ReactEditor.isTargetInsideNonReadonlyVoid(editor, focusNode);
        if (anchorNodeSelectable && focusNodeSelectable) {
          var range = ReactEditor.toSlateRange(editor, domSelection, {
            exactMatch: false,
            suppressThrow: true
          });
          if (range) {
            if (!ReactEditor.isComposing(editor) && !(androidInputManager !== null && androidInputManager !== void 0 && androidInputManager.hasPendingChanges()) && !(androidInputManager !== null && androidInputManager !== void 0 && androidInputManager.isFlushing())) {
              slate.Transforms.select(editor, range);
            } else {
              androidInputManager === null || androidInputManager === void 0 || androidInputManager.handleUserSelect(range);
            }
          }
        }
        // Deselect the editor if the dom selection is not selectable in readonly mode
        if (readOnly && (!anchorNodeSelectable || !focusNodeSelectable)) {
          slate.Transforms.deselect(editor);
        }
      }
    }, 100);
  }, [editor, readOnly, state]);
  var scheduleOnDOMSelectionChange = React.useMemo(function () {
    return debounce(onDOMSelectionChange, 0);
  }, [onDOMSelectionChange]);
  androidInputManagerRef.current = useAndroidInputManager({
    node: ref,
    onDOMSelectionChange: onDOMSelectionChange,
    scheduleOnDOMSelectionChange: scheduleOnDOMSelectionChange
  });
  useIsomorphicLayoutEffect(function () {
    var _androidInputManagerR, _androidInputManagerR2;
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
    // Make sure the DOM selection state is in sync.
    var selection = editor.selection;
    var root = ReactEditor.findDocumentOrShadowRoot(editor);
    var domSelection = root.getSelection();
    if (!domSelection || !ReactEditor.isFocused(editor) || (_androidInputManagerR = androidInputManagerRef.current) !== null && _androidInputManagerR !== void 0 && _androidInputManagerR.hasPendingAction()) {
      return;
    }
    var setDomSelection = function setDomSelection(forceChange) {
      var hasDomSelection = domSelection.type !== 'None';
      // If the DOM selection is properly unset, we're done.
      if (!selection && !hasDomSelection) {
        return;
      }
      // Get anchorNode and focusNode
      var focusNode = domSelection.focusNode;
      var anchorNode;
      // COMPAT: In firefox the normal seletion way does not work
      // (https://github.com/ianstormtaylor/slate/pull/5486#issue-1820720223)
      if (IS_FIREFOX && domSelection.rangeCount > 1) {
        var firstRange = domSelection.getRangeAt(0);
        var lastRange = domSelection.getRangeAt(domSelection.rangeCount - 1);
        // Right to left
        if (firstRange.startContainer === focusNode) {
          anchorNode = lastRange.endContainer;
        } else {
          // Left to right
          anchorNode = firstRange.startContainer;
        }
      } else {
        anchorNode = domSelection.anchorNode;
      }
      // verify that the dom selection is in the editor
      var editorElement = EDITOR_TO_ELEMENT.get(editor);
      var hasDomSelectionInEditor = false;
      if (editorElement.contains(anchorNode) && editorElement.contains(focusNode)) {
        hasDomSelectionInEditor = true;
      }
      // If the DOM selection is in the editor and the editor selection is already correct, we're done.
      if (hasDomSelection && hasDomSelectionInEditor && selection && !forceChange) {
        var slateRange = ReactEditor.toSlateRange(editor, domSelection, {
          exactMatch: true,
          // domSelection is not necessarily a valid Slate range
          // (e.g. when clicking on contentEditable:false element)
          suppressThrow: true
        });
        if (slateRange && slate.Range.equals(slateRange, selection)) {
          var _anchorNode;
          if (!state.hasMarkPlaceholder) {
            return;
          }
          // Ensure selection is inside the mark placeholder
          if ((_anchorNode = anchorNode) !== null && _anchorNode !== void 0 && (_anchorNode = _anchorNode.parentElement) !== null && _anchorNode !== void 0 && _anchorNode.hasAttribute('data-slate-mark-placeholder')) {
            return;
          }
        }
      }
      // when <Editable/> is being controlled through external value
      // then its children might just change - DOM responds to it on its own
      // but Slate's value is not being updated through any operation
      // and thus it doesn't transform selection on its own
      if (selection && !ReactEditor.hasRange(editor, selection)) {
        editor.selection = ReactEditor.toSlateRange(editor, domSelection, {
          exactMatch: false,
          suppressThrow: true
        });
        return;
      }
      // Otherwise the DOM selection is out of sync, so update it.
      state.isUpdatingSelection = true;
      var newDomRange = selection && ReactEditor.toDOMRange(editor, selection);
      if (newDomRange) {
        if (ReactEditor.isComposing(editor) && !IS_ANDROID) {
          domSelection.collapseToEnd();
        } else if (slate.Range.isBackward(selection)) {
          domSelection.setBaseAndExtent(newDomRange.endContainer, newDomRange.endOffset, newDomRange.startContainer, newDomRange.startOffset);
        } else {
          domSelection.setBaseAndExtent(newDomRange.startContainer, newDomRange.startOffset, newDomRange.endContainer, newDomRange.endOffset);
        }
        scrollSelectionIntoView(editor, newDomRange);
      } else {
        domSelection.removeAllRanges();
      }
      return newDomRange;
    };
    // In firefox if there is more then 1 range and we call setDomSelection we remove the ability to select more cells in a table
    if (domSelection.rangeCount <= 1) {
      setDomSelection();
    }
    var ensureSelection = ((_androidInputManagerR2 = androidInputManagerRef.current) === null || _androidInputManagerR2 === void 0 ? void 0 : _androidInputManagerR2.isFlushing()) === 'action';
    if (!IS_ANDROID || !ensureSelection) {
      setTimeout(function () {
        state.isUpdatingSelection = false;
      });
      return;
    }
    var timeoutId = null;
    var animationFrameId = requestAnimationFrame(function () {
      if (ensureSelection) {
        var ensureDomSelection = function ensureDomSelection(forceChange) {
          try {
            var el = ReactEditor.toDOMNode(editor, editor);
            el.focus();
            setDomSelection(forceChange);
          } catch (e) {
            // Ignore, dom and state might be out of sync
          }
        };
        // Compat: Android IMEs try to force their selection by manually re-applying it even after we set it.
        // This essentially would make setting the slate selection during an update meaningless, so we force it
        // again here. We can't only do it in the setTimeout after the animation frame since that would cause a
        // visible flicker.
        ensureDomSelection();
        timeoutId = setTimeout(function () {
          // COMPAT: While setting the selection in an animation frame visually correctly sets the selection,
          // it doesn't update GBoards spellchecker state. We have to manually trigger a selection change after
          // the animation frame to ensure it displays the correct state.
          ensureDomSelection(true);
          state.isUpdatingSelection = false;
        });
      }
    });
    return function () {
      cancelAnimationFrame(animationFrameId);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  });
  // Listen on the native `beforeinput` event to get real "Level 2" events. This
  // is required because React's `beforeinput` is fake and never really attaches
  // to the real event sadly. (2019/11/01)
  // https://github.com/facebook/react/issues/11211
  var onDOMBeforeInput = React.useCallback(function (event) {
    onUserInput();
    if (!readOnly && ReactEditor.hasEditableTarget(editor, event.target) && !isDOMEventHandled(event, propsOnDOMBeforeInput)) {
      var _EDITOR_TO_USER_SELEC;
      // COMPAT: BeforeInput events aren't cancelable on android, so we have to handle them differently using the android input manager.
      if (androidInputManagerRef.current) {
        return androidInputManagerRef.current.handleDOMBeforeInput(event);
      }
      // Some IMEs/Chrome extensions like e.g. Grammarly set the selection immediately before
      // triggering a `beforeinput` expecting the change to be applied to the immediately before
      // set selection.
      scheduleOnDOMSelectionChange.flush();
      onDOMSelectionChange.flush();
      var selection = editor.selection;
      var type = event.inputType;
      var data = event.dataTransfer || event.data || undefined;
      var isCompositionChange = type === 'insertCompositionText' || type === 'deleteCompositionText';
      // COMPAT: use composition change events as a hint to where we should insert
      // composition text if we aren't composing to work around https://github.com/ianstormtaylor/slate/issues/5038
      if (isCompositionChange && ReactEditor.isComposing(editor)) {
        return;
      }
      var _native = false;
      if (type === 'insertText' && selection && slate.Range.isCollapsed(selection) &&
      // Only use native character insertion for single characters a-z or space for now.
      // Long-press events (hold a + press 4 = ä) to choose a special character otherwise
      // causes duplicate inserts.
      event.data && event.data.length === 1 && /[a-z ]/i.test(event.data) &&
      // Chrome has issues correctly editing the start of nodes: https://bugs.chromium.org/p/chromium/issues/detail?id=1249405
      // When there is an inline element, e.g. a link, and you select
      // right after it (the start of the next node).
      selection.anchor.offset !== 0) {
        var _node$parentElement, _window$getComputedSt;
        _native = true;
        // Skip native if there are marks, as
        // `insertText` will insert a node, not just text.
        if (editor.marks) {
          _native = false;
        }
        // Chrome also has issues correctly editing the end of anchor elements: https://bugs.chromium.org/p/chromium/issues/detail?id=1259100
        // Therefore we don't allow native events to insert text at the end of anchor nodes.
        var anchor = selection.anchor;
        var _ReactEditor$toDOMPoi = ReactEditor.toDOMPoint(editor, anchor),
          _ReactEditor$toDOMPoi2 = _slicedToArray(_ReactEditor$toDOMPoi, 2),
          node = _ReactEditor$toDOMPoi2[0],
          offset = _ReactEditor$toDOMPoi2[1];
        var anchorNode = (_node$parentElement = node.parentElement) === null || _node$parentElement === void 0 ? void 0 : _node$parentElement.closest('a');
        var window = ReactEditor.getWindow(editor);
        if (_native && anchorNode && ReactEditor.hasDOMNode(editor, anchorNode)) {
          var _lastText$textContent;
          // Find the last text node inside the anchor.
          var lastText = window === null || window === void 0 ? void 0 : window.document.createTreeWalker(anchorNode, NodeFilter.SHOW_TEXT).lastChild();
          if (lastText === node && ((_lastText$textContent = lastText.textContent) === null || _lastText$textContent === void 0 ? void 0 : _lastText$textContent.length) === offset) {
            _native = false;
          }
        }
        // Chrome has issues with the presence of tab characters inside elements with whiteSpace = 'pre'
        // causing abnormal insert behavior: https://bugs.chromium.org/p/chromium/issues/detail?id=1219139
        if (_native && node.parentElement && (window === null || window === void 0 || (_window$getComputedSt = window.getComputedStyle(node.parentElement)) === null || _window$getComputedSt === void 0 ? void 0 : _window$getComputedSt.whiteSpace) === 'pre') {
          var block = slate.Editor.above(editor, {
            at: anchor.path,
            match: function match(n) {
              return slate.Element.isElement(n) && slate.Editor.isBlock(editor, n);
            }
          });
          if (block && slate.Node.string(block[0]).includes('\t')) {
            _native = false;
          }
        }
      }
      // COMPAT: For the deleting forward/backward input types we don't want
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
            var selectionRef = !isCompositionChange && editor.selection && slate.Editor.rangeRef(editor, editor.selection);
            slate.Transforms.select(editor, range);
            if (selectionRef) {
              EDITOR_TO_USER_SELECTION.set(editor, selectionRef);
            }
          }
        }
      }
      // Composition change types occur while a user is composing text and can't be
      // cancelled. Let them through and wait for the composition to end.
      if (isCompositionChange) {
        return;
      }
      if (!_native) {
        event.preventDefault();
      }
      // COMPAT: If the selection is expanded, even if the command seems like
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
            }
            // use a weak comparison instead of 'instanceof' to allow
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
      }
      // Restore the actual user section if nothing manually set it.
      var toRestore = (_EDITOR_TO_USER_SELEC = EDITOR_TO_USER_SELECTION.get(editor)) === null || _EDITOR_TO_USER_SELEC === void 0 ? void 0 : _EDITOR_TO_USER_SELEC.unref();
      EDITOR_TO_USER_SELECTION["delete"](editor);
      if (toRestore && (!editor.selection || !slate.Range.equals(editor.selection, toRestore))) {
        slate.Transforms.select(editor, toRestore);
      }
    }
  }, [editor, onDOMSelectionChange, onUserInput, propsOnDOMBeforeInput, readOnly, scheduleOnDOMSelectionChange]);
  var callbackRef = React.useCallback(function (node) {
    if (node == null) {
      onDOMSelectionChange.cancel();
      scheduleOnDOMSelectionChange.cancel();
      EDITOR_TO_ELEMENT["delete"](editor);
      NODE_TO_ELEMENT["delete"](editor);
      if (ref.current && HAS_BEFORE_INPUT_SUPPORT) {
        // @ts-ignore The `beforeinput` event isn't recognized.
        ref.current.removeEventListener('beforeinput', onDOMBeforeInput);
      }
    } else {
      // Attach a native DOM event handler for `beforeinput` events, because React's
      // built-in `onBeforeInput` is actually a leaky polyfill that doesn't expose
      // real `beforeinput` events sadly... (2019/11/04)
      // https://github.com/facebook/react/issues/11211
      if (HAS_BEFORE_INPUT_SUPPORT) {
        // @ts-ignore The `beforeinput` event isn't recognized.
        node.addEventListener('beforeinput', onDOMBeforeInput);
      }
    }
    ref.current = node;
  }, [onDOMSelectionChange, scheduleOnDOMSelectionChange, editor, onDOMBeforeInput]);
  // Attach a native DOM event handler for `selectionchange`, because React's
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
  var showPlaceholder = placeholder && editor.children.length === 1 && Array.from(slate.Node.texts(editor)).length === 1 && slate.Node.string(editor) === '' && !isComposing;
  var placeHolderResizeHandler = React.useCallback(function (placeholderEl) {
    if (placeholderEl && showPlaceholder) {
      var _placeholderEl$getBou;
      setPlaceholderHeight((_placeholderEl$getBou = placeholderEl.getBoundingClientRect()) === null || _placeholderEl$getBou === void 0 ? void 0 : _placeholderEl$getBou.height);
    } else {
      setPlaceholderHeight(undefined);
    }
  }, [showPlaceholder]);
  if (showPlaceholder) {
    var _decorations$push;
    var start = slate.Editor.start(editor, []);
    decorations.push((_decorations$push = {}, _defineProperty(_decorations$push, PLACEHOLDER_SYMBOL, true), _defineProperty(_decorations$push, "placeholder", placeholder), _defineProperty(_decorations$push, "onPlaceholderResize", placeHolderResizeHandler), _defineProperty(_decorations$push, "anchor", start), _defineProperty(_decorations$push, "focus", start), _decorations$push));
  }
  var marks = editor.marks;
  state.hasMarkPlaceholder = false;
  if (editor.selection && slate.Range.isCollapsed(editor.selection) && marks) {
    var anchor = editor.selection.anchor;
    var leaf = slate.Node.leaf(editor, anchor.path);
    leaf.text;
      var rest = _objectWithoutProperties(leaf, _excluded2);
    // While marks isn't a 'complete' text, we can still use loose Text.equals
    // here which only compares marks anyway.
    if (!slate.Text.equals(leaf, marks, {
      loose: true
    })) {
      state.hasMarkPlaceholder = true;
      var unset = Object.fromEntries(Object.keys(rest).map(function (mark) {
        return [mark, null];
      }));
      decorations.push(_objectSpread$1(_objectSpread$1(_objectSpread$1(_defineProperty({}, MARK_PLACEHOLDER_SYMBOL, true), unset), marks), {}, {
        anchor: anchor,
        focus: anchor
      }));
    }
  }
  // Update EDITOR_TO_MARK_PLACEHOLDER_MARKS in setTimeout useEffect to ensure we don't set it
  // before we receive the composition end event.
  React.useEffect(function () {
    setTimeout(function () {
      var selection = editor.selection;
      if (selection) {
        var _anchor = selection.anchor;
        var _text = slate.Node.leaf(editor, _anchor.path);
        // While marks isn't a 'complete' text, we can still use loose Text.equals
        // here which only compares marks anyway.
        if (marks && !slate.Text.equals(_text, marks, {
          loose: true
        })) {
          EDITOR_TO_PENDING_INSERTION_MARKS.set(editor, marks);
          return;
        }
      }
      EDITOR_TO_PENDING_INSERTION_MARKS["delete"](editor);
    });
  });
  return /*#__PURE__*/React.createElement(ReadOnlyContext.Provider, {
    value: readOnly
  }, /*#__PURE__*/React.createElement(DecorateContext.Provider, {
    value: decorate
  }, /*#__PURE__*/React.createElement(RestoreDOM, {
    node: ref,
    receivedUserInput: receivedUserInput
  }, /*#__PURE__*/React.createElement(Component, _objectSpread$1(_objectSpread$1({
    role: readOnly ? undefined : 'textbox',
    "aria-multiline": readOnly ? undefined : true
  }, attributes), {}, {
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
    ref: callbackRef,
    style: _objectSpread$1(_objectSpread$1({}, disableDefaultStyles ? {} : _objectSpread$1({
      // Allow positioning relative to the editable element.
      position: 'relative',
      // Preserve adjacent whitespace and new lines.
      whiteSpace: 'pre-wrap',
      // Allow words to break if they are too long.
      wordWrap: 'break-word'
    }, placeholderHeight ? {
      minHeight: placeholderHeight
    } : {})), userStyle),
    onBeforeInput: React.useCallback(function (event) {
      // COMPAT: Certain browsers don't support the `beforeinput` event, so we
      // fall back to React's leaky polyfill instead just for it. It
      // only works for the `insertText` input type.
      if (!HAS_BEFORE_INPUT_SUPPORT && !readOnly && !isEventHandled(event, attributes.onBeforeInput) && ReactEditor.hasSelectableTarget(editor, event.target)) {
        event.preventDefault();
        if (!ReactEditor.isComposing(editor)) {
          var _text2 = event.data;
          slate.Editor.insertText(editor, _text2);
        }
      }
    }, [attributes.onBeforeInput, editor, readOnly]),
    onInput: React.useCallback(function (event) {
      if (isEventHandled(event, attributes.onInput)) {
        return;
      }
      if (androidInputManagerRef.current) {
        androidInputManagerRef.current.handleInput();
        return;
      }
      // Flush native operations, as native events will have propogated
      // and we can correctly compare DOM text values in components
      // to stop rendering, so that browser functions like autocorrect
      // and spellcheck work as expected.
      var _iterator = _createForOfIteratorHelper$1(deferredOperations.current),
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
    }, [attributes.onInput]),
    onBlur: React.useCallback(function (event) {
      if (readOnly || state.isUpdatingSelection || !ReactEditor.hasSelectableTarget(editor, event.target) || isEventHandled(event, attributes.onBlur)) {
        return;
      }
      // COMPAT: If the current `activeElement` is still the previous
      // one, this is due to the window being blurred when the tab
      // itself becomes unfocused, so we want to abort early to allow to
      // editor to stay focused when the tab becomes focused again.
      var root = ReactEditor.findDocumentOrShadowRoot(editor);
      if (state.latestElement === root.activeElement) {
        return;
      }
      var relatedTarget = event.relatedTarget;
      var el = ReactEditor.toDOMNode(editor, editor);
      // COMPAT: The event should be ignored if the focus is returning
      // to the editor from an embedded editable element (eg. an <input>
      // element inside a void node).
      if (relatedTarget === el) {
        return;
      }
      // COMPAT: The event should be ignored if the focus is moving from
      // the editor to inside a void node's spacer element.
      if (isDOMElement(relatedTarget) && relatedTarget.hasAttribute('data-slate-spacer')) {
        return;
      }
      // COMPAT: The event should be ignored if the focus is moving to a
      // non- editable section of an element that isn't a void node (eg.
      // a list item of the check list example).
      if (relatedTarget != null && isDOMNode(relatedTarget) && ReactEditor.hasDOMNode(editor, relatedTarget)) {
        var node = ReactEditor.toSlateNode(editor, relatedTarget);
        if (slate.Element.isElement(node) && !editor.isVoid(node)) {
          return;
        }
      }
      // COMPAT: Safari doesn't always remove the selection even if the content-
      // editable element no longer has focus. Refer to:
      // https://stackoverflow.com/questions/12353247/force-contenteditable-div-to-stop-accepting-input-after-it-loses-focus-under-web
      if (IS_WEBKIT) {
        var domSelection = root.getSelection();
        domSelection === null || domSelection === void 0 || domSelection.removeAllRanges();
      }
      IS_FOCUSED["delete"](editor);
    }, [readOnly, state.isUpdatingSelection, state.latestElement, editor, attributes.onBlur]),
    onClick: React.useCallback(function (event) {
      if (ReactEditor.hasTarget(editor, event.target) && !isEventHandled(event, attributes.onClick) && isDOMNode(event.target)) {
        var node = ReactEditor.toSlateNode(editor, event.target);
        var path = ReactEditor.findPath(editor, node);
        // At this time, the Slate document may be arbitrarily different,
        // because onClick handlers can change the document before we get here.
        // Therefore we must check that this path actually exists,
        // and that it still refers to the same node.
        if (!slate.Editor.hasPath(editor, path) || slate.Node.get(editor, path) !== node) {
          return;
        }
        if (event.detail === TRIPLE_CLICK && path.length >= 1) {
          var blockPath = path;
          if (!(slate.Element.isElement(node) && slate.Editor.isBlock(editor, node))) {
            var _block$;
            var block = slate.Editor.above(editor, {
              match: function match(n) {
                return slate.Element.isElement(n) && slate.Editor.isBlock(editor, n);
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
    }, [editor, attributes.onClick, readOnly]),
    onCompositionEnd: React.useCallback(function (event) {
      if (ReactEditor.hasSelectableTarget(editor, event.target)) {
        var _androidInputManagerR3;
        if (ReactEditor.isComposing(editor)) {
          Promise.resolve().then(function () {
            setIsComposing(false);
            IS_COMPOSING.set(editor, false);
          });
        }
        (_androidInputManagerR3 = androidInputManagerRef.current) === null || _androidInputManagerR3 === void 0 || _androidInputManagerR3.handleCompositionEnd(event);
        if (isEventHandled(event, attributes.onCompositionEnd) || IS_ANDROID) {
          return;
        }
        // COMPAT: In Chrome, `beforeinput` events for compositions
        // aren't correct and never fire the "insertFromComposition"
        // type that we need. So instead, insert whenever a composition
        // ends since it will already have been committed to the DOM.
        if (!IS_WEBKIT && !IS_FIREFOX_LEGACY && !IS_IOS && !IS_WECHATBROWSER && !IS_UC_MOBILE && event.data) {
          var placeholderMarks = EDITOR_TO_PENDING_INSERTION_MARKS.get(editor);
          EDITOR_TO_PENDING_INSERTION_MARKS["delete"](editor);
          // Ensure we insert text with the marks the user was actually seeing
          if (placeholderMarks !== undefined) {
            EDITOR_TO_USER_MARKS.set(editor, editor.marks);
            editor.marks = placeholderMarks;
          }
          slate.Editor.insertText(editor, event.data);
          var userMarks = EDITOR_TO_USER_MARKS.get(editor);
          EDITOR_TO_USER_MARKS["delete"](editor);
          if (userMarks !== undefined) {
            editor.marks = userMarks;
          }
        }
      }
    }, [attributes.onCompositionEnd, editor]),
    onCompositionUpdate: React.useCallback(function (event) {
      if (ReactEditor.hasSelectableTarget(editor, event.target) && !isEventHandled(event, attributes.onCompositionUpdate)) {
        if (!ReactEditor.isComposing(editor)) {
          setIsComposing(true);
          IS_COMPOSING.set(editor, true);
        }
      }
    }, [attributes.onCompositionUpdate, editor]),
    onCompositionStart: React.useCallback(function (event) {
      if (ReactEditor.hasSelectableTarget(editor, event.target)) {
        var _androidInputManagerR4;
        (_androidInputManagerR4 = androidInputManagerRef.current) === null || _androidInputManagerR4 === void 0 || _androidInputManagerR4.handleCompositionStart(event);
        if (isEventHandled(event, attributes.onCompositionStart) || IS_ANDROID) {
          return;
        }
        setIsComposing(true);
        var selection = editor.selection;
        if (selection) {
          if (slate.Range.isExpanded(selection)) {
            slate.Editor.deleteFragment(editor);
            return;
          }
          var inline = slate.Editor.above(editor, {
            match: function match(n) {
              return slate.Element.isElement(n) && slate.Editor.isInline(editor, n);
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
          }
        }
      }
    }, [attributes.onCompositionStart, editor]),
    onCopy: React.useCallback(function (event) {
      if (ReactEditor.hasSelectableTarget(editor, event.target) && !isEventHandled(event, attributes.onCopy) && !isDOMEventTargetInput(event)) {
        event.preventDefault();
        ReactEditor.setFragmentData(editor, event.clipboardData, 'copy');
      }
    }, [attributes.onCopy, editor]),
    onCut: React.useCallback(function (event) {
      if (!readOnly && ReactEditor.hasSelectableTarget(editor, event.target) && !isEventHandled(event, attributes.onCut) && !isDOMEventTargetInput(event)) {
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
    }, [readOnly, editor, attributes.onCut]),
    onDragOver: React.useCallback(function (event) {
      if (ReactEditor.hasTarget(editor, event.target) && !isEventHandled(event, attributes.onDragOver)) {
        // Only when the target is void, call `preventDefault` to signal
        // that drops are allowed. Editable content is droppable by
        // default, and calling `preventDefault` hides the cursor.
        var node = ReactEditor.toSlateNode(editor, event.target);
        if (slate.Element.isElement(node) && slate.Editor.isVoid(editor, node)) {
          event.preventDefault();
        }
      }
    }, [attributes.onDragOver, editor]),
    onDragStart: React.useCallback(function (event) {
      if (!readOnly && ReactEditor.hasTarget(editor, event.target) && !isEventHandled(event, attributes.onDragStart)) {
        var node = ReactEditor.toSlateNode(editor, event.target);
        var path = ReactEditor.findPath(editor, node);
        var voidMatch = slate.Element.isElement(node) && slate.Editor.isVoid(editor, node) || slate.Editor["void"](editor, {
          at: path,
          voids: true
        });
        // If starting a drag on a void node, make sure it is selected
        // so that it shows up in the selection's fragment.
        if (voidMatch) {
          var range = slate.Editor.range(editor, path);
          slate.Transforms.select(editor, range);
        }
        state.isDraggingInternally = true;
        ReactEditor.setFragmentData(editor, event.dataTransfer, 'drag');
      }
    }, [readOnly, editor, attributes.onDragStart, state]),
    onDrop: React.useCallback(function (event) {
      if (!readOnly && ReactEditor.hasTarget(editor, event.target) && !isEventHandled(event, attributes.onDrop)) {
        event.preventDefault();
        // Keep a reference to the dragged range before updating selection
        var draggedRange = editor.selection;
        // Find the range where the drop happened
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
        ReactEditor.insertData(editor, data);
        // When dragging from another source into the editor, it's possible
        // that the current editor does not have focus.
        if (!ReactEditor.isFocused(editor)) {
          ReactEditor.focus(editor);
        }
      }
      state.isDraggingInternally = false;
    }, [readOnly, editor, attributes.onDrop, state]),
    onDragEnd: React.useCallback(function (event) {
      if (!readOnly && state.isDraggingInternally && attributes.onDragEnd && ReactEditor.hasTarget(editor, event.target)) {
        attributes.onDragEnd(event);
      }
      // When dropping on a different droppable element than the current editor,
      // `onDrop` is not called. So we need to clean up in `onDragEnd` instead.
      // Note: `onDragEnd` is only called when `onDrop` is not called
      state.isDraggingInternally = false;
    }, [readOnly, state, attributes, editor]),
    onFocus: React.useCallback(function (event) {
      if (!readOnly && !state.isUpdatingSelection && ReactEditor.hasEditableTarget(editor, event.target) && !isEventHandled(event, attributes.onFocus)) {
        var el = ReactEditor.toDOMNode(editor, editor);
        var root = ReactEditor.findDocumentOrShadowRoot(editor);
        state.latestElement = root.activeElement;
        // COMPAT: If the editor has nested editable elements, the focus
        // can go to them. In Firefox, this must be prevented because it
        // results in issues with keyboard navigation. (2017/03/30)
        if (IS_FIREFOX && event.target !== el) {
          el.focus();
          return;
        }
        IS_FOCUSED.set(editor, true);
      }
    }, [readOnly, state, editor, attributes.onFocus]),
    onKeyDown: React.useCallback(function (event) {
      if (!readOnly && ReactEditor.hasEditableTarget(editor, event.target)) {
        var _androidInputManagerR5;
        (_androidInputManagerR5 = androidInputManagerRef.current) === null || _androidInputManagerR5 === void 0 || _androidInputManagerR5.handleKeyDown(event);
        var nativeEvent = event.nativeEvent;
        // COMPAT: The composition end event isn't fired reliably in all browsers,
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
        var isRTL = getDirection(slate.Node.string(element)) === 'rtl';
        // COMPAT: Since we prevent the default behavior on
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
        }
        // COMPAT: Certain browsers don't handle the selection updates
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
        }
        // COMPAT: If a void node is selected, or a zero-width text node
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
              edge: isRTL ? 'end' : 'start'
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
              edge: isRTL ? 'start' : 'end'
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
        }
        // COMPAT: Certain browsers don't support the `beforeinput` event, so we
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
          if (IS_CHROME || IS_WEBKIT) {
            // COMPAT: Chrome and Safari support `beforeinput` event but do not fire
            // an event when deleting backwards in a selected void inline node
            if (selection && (Hotkeys.isDeleteBackward(nativeEvent) || Hotkeys.isDeleteForward(nativeEvent)) && slate.Range.isCollapsed(selection)) {
              var currentNode = slate.Node.parent(editor, selection.anchor.path);
              if (slate.Element.isElement(currentNode) && slate.Editor.isVoid(editor, currentNode) && (slate.Editor.isInline(editor, currentNode) || slate.Editor.isBlock(editor, currentNode))) {
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
    }, [readOnly, editor, attributes.onKeyDown]),
    onPaste: React.useCallback(function (event) {
      if (!readOnly && ReactEditor.hasEditableTarget(editor, event.target) && !isEventHandled(event, attributes.onPaste)) {
        // COMPAT: Certain browsers don't support the `beforeinput` event, so we
        // fall back to React's `onPaste` here instead.
        // COMPAT: Firefox, Chrome and Safari don't emit `beforeinput` events
        // when "paste without formatting" is used, so fallback. (2020/02/20)
        // COMPAT: Safari InputEvents generated by pasting won't include
        // application/x-slate-fragment items, so use the
        // ClipboardEvent here. (2023/03/15)
        if (!HAS_BEFORE_INPUT_SUPPORT || isPlainTextOnlyPaste(event.nativeEvent) || IS_WEBKIT) {
          event.preventDefault();
          ReactEditor.insertData(editor, event.clipboardData);
        }
      }
    }, [readOnly, editor, attributes.onPaste])
  }), /*#__PURE__*/React.createElement(Children, {
    decorations: decorations,
    node: editor,
    renderElement: renderElement,
    renderPlaceholder: renderPlaceholder,
    renderLeaf: renderLeaf,
    selection: editor.selection
  })))));
};
/**
 * The default placeholder element
 */
var DefaultPlaceholder = function DefaultPlaceholder(_ref) {
  var attributes = _ref.attributes,
    children = _ref.children;
  return (
    /*#__PURE__*/
    // COMPAT: Artificially add a line-break to the end on the placeholder element
    // to prevent Android IMEs to pick up its content in autocorrect and to auto-capitalize the first letter
    React.createElement("span", _objectSpread$1({}, attributes), children, IS_ANDROID && /*#__PURE__*/React.createElement("br", null))
  );
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
  if (domRange.getBoundingClientRect && (!editor.selection || editor.selection && slate.Range.isCollapsed(editor.selection))) {
    var leafEl = domRange.startContainer.parentElement;
    leafEl.getBoundingClientRect = domRange.getBoundingClientRect.bind(domRange);
    scrollIntoView(leafEl, {
      scrollMode: 'if-needed'
    });
    // @ts-expect-error an unorthodox delete D:
    delete leafEl.getBoundingClientRect;
  }
};
/**
 * Check if an event is overrided by a handler.
 */
var isEventHandled = function isEventHandled(event, handler) {
  if (!handler) {
    return false;
  }
  // The custom event handler may return a boolean to specify whether the event
  // shall be treated as being handled or not.
  var shouldTreatEventAsHandled = handler(event);
  if (shouldTreatEventAsHandled != null) {
    return shouldTreatEventAsHandled;
  }
  return event.isDefaultPrevented() || event.isPropagationStopped();
};
/**
 * Check if the event's target is an input element
 */
var isDOMEventTargetInput = function isDOMEventTargetInput(event) {
  return isDOMNode(event.target) && (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement);
};
/**
 * Check if a DOM event is overrided by a handler.
 */
var isDOMEventHandled = function isDOMEventHandled(event, handler) {
  if (!handler) {
    return false;
  }
  // The custom event handler may return a boolean to specify whether the event
  // shall be treated as being handled or not.
  var shouldTreatEventAsHandled = handler(event);
  if (shouldTreatEventAsHandled != null) {
    return shouldTreatEventAsHandled;
  }
  return event.defaultPrevented;
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
        if (err instanceof Error) {
          latestSubscriptionCallbackError.current = err;
        } else {
          latestSubscriptionCallbackError.current = new Error(String(err));
        }
      }
      forceRender();
    }
    var unsubscribe = addEventListener(checkForUpdates);
    checkForUpdates();
    return function () {
      return unsubscribe();
    };
  },
  // don't rerender on equalityFn change since we want to be able to define it inline
  [addEventListener, getSlate]);
  return selectedState;
}
/**
 * Create selector context with editor updating on every editor change
 */
function useSelectorContext(editor) {
  var eventListeners = React.useRef([]).current;
  var slateRef = React.useRef({
    editor: editor
  }).current;
  var onChange = React.useCallback(function (editor) {
    slateRef.editor = editor;
    eventListeners.forEach(function (listener) {
      return listener(editor);
    });
  }, [eventListeners, slateRef]);
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

var _excluded = ["editor", "children", "onChange", "onSelectionChange", "onValueChange", "initialValue"];
/**
 * A wrapper around the provider to handle `onChange` events, because the editor
 * is a mutable singleton so it won't ever register as "changed" otherwise.
 */
var Slate = function Slate(props) {
  var editor = props.editor,
    children = props.children,
    onChange = props.onChange,
    onSelectionChange = props.onSelectionChange,
    onValueChange = props.onValueChange,
    initialValue = props.initialValue,
    rest = _objectWithoutProperties(props, _excluded);
  var _React$useState = React.useState(function () {
      if (!slate.Node.isNodeList(initialValue)) {
        throw new Error("[Slate] initialValue is invalid! Expected a list of elements but got: ".concat(slate.Scrubber.stringify(initialValue)));
      }
      if (!slate.Editor.isEditor(editor)) {
        throw new Error("[Slate] editor is invalid! You passed: ".concat(slate.Scrubber.stringify(editor)));
      }
      editor.children = initialValue;
      Object.assign(editor, rest);
      return {
        v: 0,
        editor: editor
      };
    }),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    context = _React$useState2[0],
    setContext = _React$useState2[1];
  var _useSelectorContext = useSelectorContext(editor),
    selectorContext = _useSelectorContext.selectorContext,
    handleSelectorChange = _useSelectorContext.onChange;
  var onContextChange = React.useCallback(function (options) {
    var _options$operation;
    if (onChange) {
      onChange(editor.children);
    }
    switch (options === null || options === void 0 || (_options$operation = options.operation) === null || _options$operation === void 0 ? void 0 : _options$operation.type) {
      case 'set_selection':
        onSelectionChange === null || onSelectionChange === void 0 || onSelectionChange(editor.selection);
        break;
      default:
        onValueChange === null || onValueChange === void 0 || onValueChange(editor.children);
    }
    setContext(function (prevContext) {
      return {
        v: prevContext.v + 1,
        editor: editor
      };
    });
    handleSelectorChange(editor);
  }, [editor, handleSelectorChange, onChange, onSelectionChange, onValueChange]);
  React.useEffect(function () {
    EDITOR_TO_ON_CHANGE.set(editor, onContextChange);
    return function () {
      EDITOR_TO_ON_CHANGE.set(editor, function () {});
    };
  }, [editor, onContextChange]);
  var _useState = React.useState(ReactEditor.isFocused(editor)),
    _useState2 = _slicedToArray(_useState, 2),
    isFocused = _useState2[0],
    setIsFocused = _useState2[1];
  React.useEffect(function () {
    setIsFocused(ReactEditor.isFocused(editor));
  }, [editor]);
  useIsomorphicLayoutEffect(function () {
    var fn = function fn() {
      return setIsFocused(ReactEditor.isFocused(editor));
    };
    if (REACT_MAJOR_VERSION >= 17) {
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
  return /*#__PURE__*/React.createElement(SlateSelectorContext.Provider, {
    value: selectorContext
  }, /*#__PURE__*/React.createElement(SlateContext.Provider, {
    value: context
  }, /*#__PURE__*/React.createElement(EditorContext.Provider, {
    value: context.editor
  }, /*#__PURE__*/React.createElement(FocusedContext.Provider, {
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
 * Get the current slate selection.
 * Only triggers a rerender when the selection actually changes
 */
var useSlateSelection = function useSlateSelection() {
  return useSlateSelector(function (editor) {
    return editor.selection;
  }, isSelectionEqual);
};
var isSelectionEqual = function isSelectionEqual(a, b) {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return slate.Range.equals(a, b);
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
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
/**
 * `withReact` adds React and DOM specific behaviors to the editor.
 *
 * If you are using TypeScript, you must extend Slate's CustomTypes to use
 * this plugin.
 *
 * See https://docs.slatejs.org/concepts/11-typescript to learn how.
 */
var withReact = function withReact(editor) {
  var clipboardFormatKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'x-slate-fragment';
  var e = editor;
  var apply = e.apply,
    onChange = e.onChange,
    deleteBackward = e.deleteBackward,
    addMark = e.addMark,
    removeMark = e.removeMark;
  // The WeakMap which maps a key to a specific HTMLElement must be scoped to the editor instance to
  // avoid collisions between editors in the DOM that share the same value.
  EDITOR_TO_KEY_TO_ELEMENT.set(e, new WeakMap());
  e.addMark = function (key, value) {
    var _EDITOR_TO_SCHEDULE_F, _EDITOR_TO_PENDING_DI;
    (_EDITOR_TO_SCHEDULE_F = EDITOR_TO_SCHEDULE_FLUSH.get(e)) === null || _EDITOR_TO_SCHEDULE_F === void 0 || _EDITOR_TO_SCHEDULE_F();
    if (!EDITOR_TO_PENDING_INSERTION_MARKS.get(e) && (_EDITOR_TO_PENDING_DI = EDITOR_TO_PENDING_DIFFS.get(e)) !== null && _EDITOR_TO_PENDING_DI !== void 0 && _EDITOR_TO_PENDING_DI.length) {
      // Ensure the current pending diffs originating from changes before the addMark
      // are applied with the current formatting
      EDITOR_TO_PENDING_INSERTION_MARKS.set(e, null);
    }
    EDITOR_TO_USER_MARKS["delete"](e);
    addMark(key, value);
  };
  e.removeMark = function (key) {
    var _EDITOR_TO_PENDING_DI2;
    if (!EDITOR_TO_PENDING_INSERTION_MARKS.get(e) && (_EDITOR_TO_PENDING_DI2 = EDITOR_TO_PENDING_DIFFS.get(e)) !== null && _EDITOR_TO_PENDING_DI2 !== void 0 && _EDITOR_TO_PENDING_DI2.length) {
      // Ensure the current pending diffs originating from changes before the addMark
      // are applied with the current formatting
      EDITOR_TO_PENDING_INSERTION_MARKS.set(e, null);
    }
    EDITOR_TO_USER_MARKS["delete"](e);
    removeMark(key);
  };
  e.deleteBackward = function (unit) {
    if (unit !== 'line') {
      return deleteBackward(unit);
    }
    if (e.selection && slate.Range.isCollapsed(e.selection)) {
      var parentBlockEntry = slate.Editor.above(e, {
        match: function match(n) {
          return slate.Element.isElement(n) && slate.Editor.isBlock(e, n);
        },
        at: e.selection
      });
      if (parentBlockEntry) {
        var _parentBlockEntry = _slicedToArray(parentBlockEntry, 2),
          parentBlockPath = _parentBlockEntry[1];
        var parentElementRange = slate.Editor.range(e, parentBlockPath, e.selection.anchor);
        var currentLineRange = findCurrentLineRange(e, parentElementRange);
        if (!slate.Range.isCollapsed(currentLineRange)) {
          slate.Transforms["delete"](e, {
            at: currentLineRange
          });
        }
      }
    }
  };
  // This attempts to reset the NODE_TO_KEY entry to the correct value
  // as apply() changes the object reference and hence invalidates the NODE_TO_KEY entry
  e.apply = function (op) {
    var matches = [];
    var pathRefMatches = [];
    var pendingDiffs = EDITOR_TO_PENDING_DIFFS.get(e);
    if (pendingDiffs !== null && pendingDiffs !== void 0 && pendingDiffs.length) {
      var transformed = pendingDiffs.map(function (textDiff) {
        return transformTextDiff(textDiff, op);
      }).filter(Boolean);
      EDITOR_TO_PENDING_DIFFS.set(e, transformed);
    }
    var pendingSelection = EDITOR_TO_PENDING_SELECTION.get(e);
    if (pendingSelection) {
      EDITOR_TO_PENDING_SELECTION.set(e, transformPendingRange(e, pendingSelection, op));
    }
    var pendingAction = EDITOR_TO_PENDING_ACTION.get(e);
    if (pendingAction !== null && pendingAction !== void 0 && pendingAction.at) {
      var at = slate.Point.isPoint(pendingAction === null || pendingAction === void 0 ? void 0 : pendingAction.at) ? transformPendingPoint(e, pendingAction.at, op) : transformPendingRange(e, pendingAction.at, op);
      EDITOR_TO_PENDING_ACTION.set(e, at ? _objectSpread(_objectSpread({}, pendingAction), {}, {
        at: at
      }) : null);
    }
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
          (_EDITOR_TO_USER_SELEC = EDITOR_TO_USER_SELECTION.get(e)) === null || _EDITOR_TO_USER_SELEC === void 0 || _EDITOR_TO_USER_SELEC.unref();
          EDITOR_TO_USER_SELECTION["delete"](e);
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
          var changedPath;
          if (slate.Path.isBefore(op.path, op.newPath)) {
            matches.push.apply(matches, _toConsumableArray(getMatches(e, slate.Path.parent(op.path))));
            changedPath = op.newPath;
          } else {
            matches.push.apply(matches, _toConsumableArray(getMatches(e, slate.Path.parent(op.newPath))));
            changedPath = op.path;
          }
          var changedNode = slate.Node.get(editor, slate.Path.parent(changedPath));
          var changedNodeKey = ReactEditor.findKey(e, changedNode);
          var changedPathRef = slate.Editor.pathRef(e, slate.Path.parent(changedPath));
          pathRefMatches.push([changedPathRef, changedNodeKey]);
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
    for (var _i2 = 0, _pathRefMatches = pathRefMatches; _i2 < _pathRefMatches.length; _i2++) {
      var _pathRefMatches$_i = _slicedToArray(_pathRefMatches[_i2], 2),
        pathRef = _pathRefMatches$_i[0],
        _key = _pathRefMatches$_i[1];
      if (pathRef.current) {
        var _Editor$node3 = slate.Editor.node(e, pathRef.current),
          _Editor$node4 = _slicedToArray(_Editor$node3, 1),
          _node = _Editor$node4[0];
        NODE_TO_KEY.set(_node, _key);
      }
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
    }
    // Create a fake selection so that we can add a Base64-encoded copy of the
    // fragment to the HTML, to decode on future pastes.
    var domRange = ReactEditor.toDOMRange(e, selection);
    var contents = domRange.cloneContents();
    var attach = contents.childNodes[0];
    // Make sure attach is non-empty, since empty nodes will not get copied.
    contents.childNodes.forEach(function (node) {
      if (node.textContent && node.textContent.trim() !== '') {
        attach = node;
      }
    });
    // COMPAT: If the end node is a void node, we need to move the end of the
    // range from the void node's spacer span, to the end of the void node's
    // content, since the spacer is before void's content in the DOM.
    if (endVoid) {
      var _endVoid = _slicedToArray(endVoid, 1),
        voidNode = _endVoid[0];
      var r = domRange.cloneRange();
      var domNode = ReactEditor.toDOMNode(e, voidNode);
      r.setEndAfter(domNode);
      contents = r.cloneContents();
    }
    // COMPAT: If the start node is a void node, we need to attach the encoded
    // fragment to the void node's content node instead of the spacer, because
    // attaching it to empty `<div>/<span>` nodes will end up having it erased by
    // most browsers. (2018/04/27)
    if (startVoid) {
      attach = contents.querySelector('[data-slate-spacer]');
    }
    // Remove any zero-width space spans from the cloned DOM so that they don't
    // show up elsewhere when pasted.
    Array.from(contents.querySelectorAll('[data-slate-zero-width]')).forEach(function (zw) {
      var isNewline = zw.getAttribute('data-slate-zero-width') === 'n';
      zw.textContent = isNewline ? '\n' : '';
    });
    // Set a `data-slate-fragment` attribute on a non-empty node, so it shows up
    // in the HTML, and can be used for intra-Slate pasting. If it's a text
    // node, wrap it in a `<span>` so we have something to set an attribute on.
    if (isDOMText(attach)) {
      var span = attach.ownerDocument.createElement('span');
      // COMPAT: In Chrome and Safari, if we don't add the `white-space` style
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
    data.setData("application/".concat(clipboardFormatKey), encoded);
    // Add the content to a <div> so that we can get its inner HTML.
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
    var fragment = data.getData("application/".concat(clipboardFormatKey)) || getSlateFragmentAttribute(data);
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
  e.onChange = function (options) {
    // COMPAT: React < 18 doesn't batch `setState` hook calls, which means
    // that the children and selection can get out of sync for one render
    // pass. So we have to use this unstable API to ensure it batches them.
    // (2019/12/03)
    // https://github.com/facebook/react/issues/14259#issuecomment-439702367
    var maybeBatchUpdates = REACT_MAJOR_VERSION < 18 ? ReactDOM.unstable_batchedUpdates : function (callback) {
      return callback();
    };
    maybeBatchUpdates(function () {
      var onContextChange = EDITOR_TO_ON_CHANGE.get(e);
      if (onContextChange) {
        onContextChange(options);
      }
      onChange(options);
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
exports.useSlateSelection = useSlateSelection;
exports.useSlateSelector = useSlateSelector;
exports.useSlateStatic = useSlateStatic;
exports.useSlateWithV = useSlateWithV;
exports.withReact = withReact;
//# sourceMappingURL=index.js.map
