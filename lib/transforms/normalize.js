'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalize = normalize;
exports.normalizeDocument = normalizeDocument;
exports.normalizeNodeByKey = normalizeNodeByKey;
exports.normalizeSelection = normalizeSelection;

var _normalize = require('../utils/normalize');

var _normalize2 = _interopRequireDefault(_normalize);

var _schema = require('../models/schema');

var _schema2 = _interopRequireDefault(_schema);

var _warn = require('../utils/warn');

var _warn2 = _interopRequireDefault(_warn);

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Normalize the document and selection with a `schema`.
 *
 * @param {Transform} transform
 * @param {Schema} schema
 */

function normalize(transform, schema) {
  transform.normalizeDocument(schema);
  transform.normalizeSelection(schema);
}

/**
 * Normalize the document with a `schema`.
 *
 * @param {Transform} transform
 * @param {Schema} schema
 */

function normalizeDocument(transform, schema) {
  var state = transform.state;
  var document = state.document;

  transform.normalizeNodeByKey(document.key, schema);
}

/**
 * Normalize a `node` and its children with a `schema`.
 *
 * @param {Transform} transform
 * @param {Node|String} key
 * @param {Schema} schema
 */

function normalizeNodeByKey(transform, key, schema) {
  assertSchema(schema);

  // If the schema has no validation rules, there's nothing to normalize.
  if (!schema.hasValidators) return;

  key = _normalize2.default.key(key);
  var state = transform.state;
  var document = state.document;

  var node = document.assertNode(key);

  normalizeNodeAndChildren(transform, node, schema);
}

/**
 * Normalize the selection.
 *
 * @param {Transform} transform
 */

function normalizeSelection(transform) {
  var state = transform.state;
  var _state = state,
      document = _state.document,
      selection = _state.selection;

  selection = selection.normalize(document);

  // If the selection is unset, or the anchor or focus key in the selection are
  // pointing to nodes that no longer exist, warn and reset the selection.
  if (selection.isUnset || !document.hasDescendant(selection.anchorKey) || !document.hasDescendant(selection.focusKey)) {
    (0, _warn2.default)('The selection was invalid and was reset to start of the document. The selection in question was:', selection);

    var firstText = document.getFirstText();
    selection = selection.merge({
      anchorKey: firstText.key,
      anchorOffset: 0,
      focusKey: firstText.key,
      focusOffset: 0,
      isBackward: false
    });
  }

  state = state.merge({ selection: selection });
  transform.state = state;
}

/**
 * Normalize a `node` and its children with a `schema`.
 *
 * @param {Transform} transform
 * @param {Node} node
 * @param {Schema} schema
 */

function normalizeNodeAndChildren(transform, node, schema) {
  if (node.kind == 'text') {
    normalizeNode(transform, node, schema);
    return;
  }

  // We can't just loop the children and normalize them, because in the process
  // of normalizing one child, we might end up creating another. Instead, we
  // have to normalize one at a time, and check for new children along the way.
  var stack = node.nodes.map(function (n) {
    return n.key;
  }).toStack();
  var set = new _immutable.Set();

  // While there is still a child key that hasn't been normalized yet...
  while (stack.size) {
    var ops = transform.operations.length;
    var key = void 0;

    // Unwind the stack, normalizing every child and adding it to the set.
    while (key = stack.peek()) {
      var child = node.getChild(key);
      normalizeNodeAndChildren(transform, child, schema);
      set = set.add(key);
      stack = stack.pop();
    }

    // PERF: Only re-find the node and re-normalize any new children if
    // operations occured that might have changed it.
    if (transform.operations.length != ops) {
      node = refindNode(transform, node);

      // Add any new children back onto the stack.
      node.nodes.forEach(function (n) {
        if (set.has(n.key)) return;
        stack = stack.push(n.key);
      });
    }
  }

  // Normalize the node itself if it still exists.
  if (node) {
    normalizeNode(transform, node, schema);
  }
}

/**
 * Re-find a reference to a node that may have been modified or removed
 * entirely by a transform.
 *
 * @param {Transform} transform
 * @param {Node} node
 * @return {Node}
 */

function refindNode(transform, node) {
  var state = transform.state;
  var document = state.document;

  return node.kind == 'document' ? document : document.getDescendant(node.key);
}

/**
 * Normalize a `node` with a `schema`, but not its children.
 *
 * @param {Transform} transform
 * @param {Node} node
 * @param {Schema} schema
 */

function normalizeNode(transform, node, schema) {
  var max = schema.rules.length;
  var iterations = 0;

  function iterate(t, n) {
    var failure = n.validate(schema);
    if (!failure) return;

    // Run the `normalize` function for the rule with the invalid value.
    var value = failure.value,
        rule = failure.rule;

    rule.normalize(t, n, value);

    // Re-find the node reference, in case it was updated. If the node no longer
    // exists, we're done for this branch.
    n = refindNode(t, n);
    if (!n) return;

    // Increment the iterations counter, and check to make sure that we haven't
    // exceeded the max. Without this check, it's easy for the `validate` or
    // `normalize` function of a schema rule to be written incorrectly and for
    // an infinite invalid loop to occur.
    iterations++;

    if (iterations > max) {
      throw new Error('A schema rule could not be validated after sufficient iterations. This is usually due to a `rule.validate` or `rule.normalize` function of a schema being incorrectly written, causing an infinite loop.');
    }

    // Otherwise, iterate again.
    iterate(t, n);
  }

  iterate(transform, node);
}

/**
 * Assert that a `schema` exists.
 *
 * @param {Schema} schema
 */

function assertSchema(schema) {
  if (schema instanceof _schema2.default) {
    return;
  } else if (schema == null) {
    throw new Error('You must pass a `schema` object.');
  } else {
    throw new Error('You passed an invalid `schema` object: ' + schema + '.');
  }
}