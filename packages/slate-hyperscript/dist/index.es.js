import isPlainObject from 'is-plain-object';
import { Text, Range, createEditor as createEditor$1, Node, Element } from 'slate';

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

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
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
  return _objectSpread({}, attributes, {
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

  return _objectSpread({
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
  } // COMPAT: If they used the <text> tag we want to guarantee that it won't be
  // merge with other string children.


  STRINGS.delete(node);
  Object.assign(node, attributes);
  return node;
}
/**
 * Create a top-level `Editor` object.
 */

function createEditor(tagName, attributes, children) {
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
  var editor = createEditor$1();
  Object.assign(editor, attributes);
  editor.children = descendants; // Search the document's texts to see if any of them have tokens associated
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
}

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
/**
 * The default creators for Slate objects.
 */

var DEFAULT_CREATORS = {
  anchor: createAnchor,
  cursor: createCursor,
  editor: createEditor,
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

  var creators = _objectSpread$1({}, DEFAULT_CREATORS, {}, elementCreators, {}, options.creators);

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

  var _loop = function _loop(tagName) {
    var props = elements[tagName];

    if (typeof props !== 'object') {
      throw new Error("Properties specified for a hyperscript shorthand should be an object, but for the custom element <".concat(tagName, ">  tag you passed: ").concat(props));
    }

    creators[tagName] = (tagName, attributes, children) => {
      return createElement('element', _objectSpread$1({}, props, {}, attributes), children);
    };
  };

  for (var tagName in elements) {
    _loop(tagName);
  }

  return creators;
};

/**
 * The default hyperscript factory that ships with Slate, without custom tags.
 */

var jsx = createHyperscript();

export { createHyperscript, jsx };
//# sourceMappingURL=index.es.js.map
