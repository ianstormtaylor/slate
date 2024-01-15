import { isPlainObject } from 'is-plain-object';
import { Text, Range, Node, Element, createEditor as createEditor$1 } from 'slate';

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}

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

function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}

function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
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
class Token {}
/**
 * Anchor tokens represent the selection's anchor point.
 */
class AnchorToken extends Token {
  constructor() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    super();
    _defineProperty(this, "offset", void 0);
    _defineProperty(this, "path", void 0);
    var {
      offset,
      path
    } = props;
    this.offset = offset;
    this.path = path;
  }
}
/**
 * Focus tokens represent the selection's focus point.
 */
class FocusToken extends Token {
  constructor() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    super();
    _defineProperty(this, "offset", void 0);
    _defineProperty(this, "path", void 0);
    var {
      offset,
      path
    } = props;
    this.offset = offset;
    this.path = path;
  }
}
/**
 * Add an anchor token to the end of a text node.
 */
var addAnchorToken = (text, token) => {
  var offset = text.text.length;
  ANCHOR.set(text, [offset, token]);
};
/**
 * Get the offset if a text node has an associated anchor token.
 */
var getAnchorOffset = text => {
  return ANCHOR.get(text);
};
/**
 * Add a focus token to the end of a text node.
 */
var addFocusToken = (text, token) => {
  var offset = text.text.length;
  FOCUS.set(text, [offset, token]);
};
/**
 * Get the offset if a text node has an associated focus token.
 */
var getFocusOffset = text => {
  return FOCUS.get(text);
};

function ownKeys$1(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$1(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$1(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$1(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
/**
 * Resolve the descedants of a node by normalizing the children that can be
 * passed into a hyperscript creator function.
 */
var STRINGS = new WeakSet();
var resolveDescendants = children => {
  var nodes = [];
  var addChild = child => {
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
    if (Text.isText(child)) {
      var c = child; // HACK: fix typescript complaining
      if (Text.isText(prev) && STRINGS.has(prev) && STRINGS.has(c) && Text.equals(prev, c, {
        loose: true
      })) {
        prev.text += c.text;
      } else {
        nodes.push(c);
      }
    } else if (Element.isElement(child)) {
      nodes.push(child);
    } else if (child instanceof Token) {
      var n = nodes[nodes.length - 1];
      if (!Text.isText(n)) {
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
  for (var child of children.flat(Infinity)) {
    addChild(child);
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
  var anchor = children.find(c => c instanceof AnchorToken);
  var focus = children.find(c => c instanceof FocusToken);
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
  var [node] = nodes;
  if (node == null) {
    node = {
      text: ''
    };
  }
  if (!Text.isText(node)) {
    throw new Error("\n    The <text> hyperscript tag can only contain text content as children.");
  }
  // COMPAT: If they used the <text> tag we want to guarantee that it won't be
  // merge with other string children.
  STRINGS.delete(node);
  Object.assign(node, attributes);
  return node;
}
/**
 * Create a top-level `Editor` object.
 */
var createEditor = makeEditor => (tagName, attributes, children) => {
  var otherChildren = [];
  var selectionChild;
  for (var child of children) {
    if (Range.isRange(child)) {
      selectionChild = child;
    } else {
      otherChildren.push(child);
    }
  }
  var descendants = resolveDescendants(otherChildren);
  var selection = {};
  var editor = makeEditor();
  Object.assign(editor, attributes);
  editor.children = descendants;
  // Search the document's texts to see if any of them have tokens associated
  // that need incorporated into the selection.
  for (var [node, path] of Node.texts(editor)) {
    var anchor = getAnchorOffset(node);
    var focus = getFocusOffset(node);
    if (anchor != null) {
      var [offset] = anchor;
      selection.anchor = {
        path,
        offset
      };
    }
    if (focus != null) {
      var [_offset] = focus;
      selection.focus = {
        path,
        offset: _offset
      };
    }
  }
  if (selection.anchor && !selection.focus) {
    throw new Error("Slate hyperscript ranges must have both `<anchor />` and `<focus />` defined if one is defined, but you only defined `<anchor />`. For collapsed selections, use `<cursor />` instead.");
  }
  if (!selection.anchor && selection.focus) {
    throw new Error("Slate hyperscript ranges must have both `<anchor />` and `<focus />` defined if one is defined, but you only defined `<focus />`. For collapsed selections, use `<cursor />` instead.");
  }
  if (selectionChild != null) {
    editor.selection = selectionChild;
  } else if (Range.isRange(selection)) {
    editor.selection = selection;
  }
  return editor;
};

function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
/**
 * The default creators for Slate objects.
 */
var DEFAULT_CREATORS = {
  anchor: createAnchor,
  cursor: createCursor,
  editor: createEditor(createEditor$1),
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
  var {
    elements = {}
  } = options;
  var elementCreators = normalizeElements(elements);
  var creators = _objectSpread(_objectSpread(_objectSpread({}, DEFAULT_CREATORS), elementCreators), options.creators);
  var jsx = createFactory(creators);
  return jsx;
};
/**
 * Create a Slate hyperscript function with `options`.
 */
var createFactory = creators => {
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
    if (!isPlainObject(attributes)) {
      children = [attributes].concat(children);
      attributes = {};
    }
    children = children.filter(child => Boolean(child)).flat();
    var ret = creator(tagName, attributes, children);
    return ret;
  };
  return jsx;
};
/**
 * Normalize a dictionary of element shorthands into creator functions.
 */
var normalizeElements = elements => {
  var creators = {};
  var _loop = function _loop() {
    var props = elements[tagName];
    if (typeof props !== 'object') {
      throw new Error("Properties specified for a hyperscript shorthand should be an object, but for the custom element <".concat(tagName, ">  tag you passed: ").concat(props));
    }
    creators[tagName] = (tagName, attributes, children) => {
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

export { createEditor, createHyperscript, createText, jsx };
//# sourceMappingURL=index.es.js.map
