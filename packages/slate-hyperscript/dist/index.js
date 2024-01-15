'use strict';

var isPlainObject = require('is-plain-object');
var slate = require('slate');

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

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

var _typeof = unwrapExports(_typeof_1);

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

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
/**
 * A weak map to hold anchor tokens.
 */
var ANCHOR = new WeakMap();
/**
 * A weak map to hold focus tokens.
 */
var FOCUS = new WeakMap();
/**
 * All tokens inherit from a single constructor for `instanceof` checking.
 */
var Token = /*#__PURE__*/_createClass(function Token() {
  _classCallCheck(this, Token);
});
/**
 * Anchor tokens represent the selection's anchor point.
 */
var AnchorToken = /*#__PURE__*/function (_Token) {
  _inherits(AnchorToken, _Token);
  var _super = _createSuper(AnchorToken);
  function AnchorToken() {
    var _this;
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, AnchorToken);
    _this = _super.call(this);
    _defineProperty(_assertThisInitialized(_this), "offset", void 0);
    _defineProperty(_assertThisInitialized(_this), "path", void 0);
    var offset = props.offset,
      path = props.path;
    _this.offset = offset;
    _this.path = path;
    return _this;
  }
  return _createClass(AnchorToken);
}(Token);
/**
 * Focus tokens represent the selection's focus point.
 */
var FocusToken = /*#__PURE__*/function (_Token2) {
  _inherits(FocusToken, _Token2);
  var _super2 = _createSuper(FocusToken);
  function FocusToken() {
    var _this2;
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, FocusToken);
    _this2 = _super2.call(this);
    _defineProperty(_assertThisInitialized(_this2), "offset", void 0);
    _defineProperty(_assertThisInitialized(_this2), "path", void 0);
    var offset = props.offset,
      path = props.path;
    _this2.offset = offset;
    _this2.path = path;
    return _this2;
  }
  return _createClass(FocusToken);
}(Token);
/**
 * Add an anchor token to the end of a text node.
 */
var addAnchorToken = function addAnchorToken(text, token) {
  var offset = text.text.length;
  ANCHOR.set(text, [offset, token]);
};
/**
 * Get the offset if a text node has an associated anchor token.
 */
var getAnchorOffset = function getAnchorOffset(text) {
  return ANCHOR.get(text);
};
/**
 * Add a focus token to the end of a text node.
 */
var addFocusToken = function addFocusToken(text, token) {
  var offset = text.text.length;
  FOCUS.set(text, [offset, token]);
};
/**
 * Get the offset if a text node has an associated focus token.
 */
var getFocusOffset = function getFocusOffset(text) {
  return FOCUS.get(text);
};

function ownKeys$1(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$1(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$1(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$1(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
/**
 * Resolve the descedants of a node by normalizing the children that can be
 * passed into a hyperscript creator function.
 */
var STRINGS = new WeakSet();
var resolveDescendants = function resolveDescendants(children) {
  var nodes = [];
  var addChild = function addChild(child) {
    if (child == null) {
      return;
    }
    var prev = nodes[nodes.length - 1];
    if (typeof child === 'string') {
      var text = {
        text: child
      };
      STRINGS.add(text);
      child = text;
    }
    if (slate.Text.isText(child)) {
      var c = child; // HACK: fix typescript complaining
      if (slate.Text.isText(prev) && STRINGS.has(prev) && STRINGS.has(c) && slate.Text.equals(prev, c, {
        loose: true
      })) {
        prev.text += c.text;
      } else {
        nodes.push(c);
      }
    } else if (slate.Element.isElement(child)) {
      nodes.push(child);
    } else if (child instanceof Token) {
      var n = nodes[nodes.length - 1];
      if (!slate.Text.isText(n)) {
        addChild('');
        n = nodes[nodes.length - 1];
      }
      if (child instanceof AnchorToken) {
        addAnchorToken(n, child);
      } else if (child instanceof FocusToken) {
        addFocusToken(n, child);
      }
    } else {
      throw new Error("Unexpected hyperscript child object: ".concat(child));
    }
  };
  var _iterator = _createForOfIteratorHelper(children.flat(Infinity)),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var child = _step.value;
      addChild(child);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return nodes;
};
/**
 * Create an anchor token.
 */
function createAnchor(tagName, attributes, children) {
  return new AnchorToken(attributes);
}
/**
 * Create an anchor and a focus token.
 */
function createCursor(tagName, attributes, children) {
  return [new AnchorToken(attributes), new FocusToken(attributes)];
}
/**
 * Create an `Element` object.
 */
function createElement(tagName, attributes, children) {
  return _objectSpread$1(_objectSpread$1({}, attributes), {}, {
    children: resolveDescendants(children)
  });
}
/**
 * Create a focus token.
 */
function createFocus(tagName, attributes, children) {
  return new FocusToken(attributes);
}
/**
 * Create a fragment.
 */
function createFragment(tagName, attributes, children) {
  return resolveDescendants(children);
}
/**
 * Create a `Selection` object.
 */
function createSelection(tagName, attributes, children) {
  var anchor = children.find(function (c) {
    return c instanceof AnchorToken;
  });
  var focus = children.find(function (c) {
    return c instanceof FocusToken;
  });
  if (!anchor || anchor.offset == null || anchor.path == null) {
    throw new Error("The <selection> hyperscript tag must have an <anchor> tag as a child with `path` and `offset` attributes defined.");
  }
  if (!focus || focus.offset == null || focus.path == null) {
    throw new Error("The <selection> hyperscript tag must have a <focus> tag as a child with `path` and `offset` attributes defined.");
  }
  return _objectSpread$1({
    anchor: {
      offset: anchor.offset,
      path: anchor.path
    },
    focus: {
      offset: focus.offset,
      path: focus.path
    }
  }, attributes);
}
/**
 * Create a `Text` object.
 */
function createText(tagName, attributes, children) {
  var nodes = resolveDescendants(children);
  if (nodes.length > 1) {
    throw new Error("The <text> hyperscript tag must only contain a single node's worth of children.");
  }
  var _nodes = _slicedToArray(nodes, 1),
    node = _nodes[0];
  if (node == null) {
    node = {
      text: ''
    };
  }
  if (!slate.Text.isText(node)) {
    throw new Error("\n    The <text> hyperscript tag can only contain text content as children.");
  }
  // COMPAT: If they used the <text> tag we want to guarantee that it won't be
  // merge with other string children.
  STRINGS["delete"](node);
  Object.assign(node, attributes);
  return node;
}
/**
 * Create a top-level `Editor` object.
 */
var createEditor = function createEditor(makeEditor) {
  return function (tagName, attributes, children) {
    var otherChildren = [];
    var selectionChild;
    var _iterator2 = _createForOfIteratorHelper(children),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var child = _step2.value;
        if (slate.Range.isRange(child)) {
          selectionChild = child;
        } else {
          otherChildren.push(child);
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    var descendants = resolveDescendants(otherChildren);
    var selection = {};
    var editor = makeEditor();
    Object.assign(editor, attributes);
    editor.children = descendants;
    // Search the document's texts to see if any of them have tokens associated
    // that need incorporated into the selection.
    var _iterator3 = _createForOfIteratorHelper(slate.Node.texts(editor)),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var _step3$value = _slicedToArray(_step3.value, 2),
          node = _step3$value[0],
          path = _step3$value[1];
        var anchor = getAnchorOffset(node);
        var focus = getFocusOffset(node);
        if (anchor != null) {
          var _anchor = _slicedToArray(anchor, 1),
            offset = _anchor[0];
          selection.anchor = {
            path: path,
            offset: offset
          };
        }
        if (focus != null) {
          var _focus = _slicedToArray(focus, 1),
            _offset = _focus[0];
          selection.focus = {
            path: path,
            offset: _offset
          };
        }
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
    if (selection.anchor && !selection.focus) {
      throw new Error("Slate hyperscript ranges must have both `<anchor />` and `<focus />` defined if one is defined, but you only defined `<anchor />`. For collapsed selections, use `<cursor />` instead.");
    }
    if (!selection.anchor && selection.focus) {
      throw new Error("Slate hyperscript ranges must have both `<anchor />` and `<focus />` defined if one is defined, but you only defined `<focus />`. For collapsed selections, use `<cursor />` instead.");
    }
    if (selectionChild != null) {
      editor.selection = selectionChild;
    } else if (slate.Range.isRange(selection)) {
      editor.selection = selection;
    }
    return editor;
  };
};

function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
/**
 * The default creators for Slate objects.
 */
var DEFAULT_CREATORS = {
  anchor: createAnchor,
  cursor: createCursor,
  editor: createEditor(slate.createEditor),
  element: createElement,
  focus: createFocus,
  fragment: createFragment,
  selection: createSelection,
  text: createText
};
/**
 * Create a Slate hyperscript function with `options`.
 */
var createHyperscript = function createHyperscript() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _options$elements = options.elements,
    elements = _options$elements === void 0 ? {} : _options$elements;
  var elementCreators = normalizeElements(elements);
  var creators = _objectSpread(_objectSpread(_objectSpread({}, DEFAULT_CREATORS), elementCreators), options.creators);
  var jsx = createFactory(creators);
  return jsx;
};
/**
 * Create a Slate hyperscript function with `options`.
 */
var createFactory = function createFactory(creators) {
  var jsx = function jsx(tagName, attributes) {
    for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }
    var creator = creators[tagName];
    if (!creator) {
      throw new Error("No hyperscript creator found for tag: <".concat(tagName, ">"));
    }
    if (attributes == null) {
      attributes = {};
    }
    if (!isPlainObject.isPlainObject(attributes)) {
      children = [attributes].concat(children);
      attributes = {};
    }
    children = children.filter(function (child) {
      return Boolean(child);
    }).flat();
    var ret = creator(tagName, attributes, children);
    return ret;
  };
  return jsx;
};
/**
 * Normalize a dictionary of element shorthands into creator functions.
 */
var normalizeElements = function normalizeElements(elements) {
  var creators = {};
  var _loop = function _loop() {
    var props = elements[tagName];
    if (_typeof(props) !== 'object') {
      throw new Error("Properties specified for a hyperscript shorthand should be an object, but for the custom element <".concat(tagName, ">  tag you passed: ").concat(props));
    }
    creators[tagName] = function (tagName, attributes, children) {
      return createElement('element', _objectSpread(_objectSpread({}, props), attributes), children);
    };
  };
  for (var tagName in elements) {
    _loop();
  }
  return creators;
};

/**
 * The default hyperscript factory that ships with Slate, without custom tags.
 */
var jsx = createHyperscript();

exports.createEditor = createEditor;
exports.createHyperscript = createHyperscript;
exports.createText = createText;
exports.jsx = jsx;
//# sourceMappingURL=index.js.map
