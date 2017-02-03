'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.applyOperation = applyOperation;

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _warn = require('../utils/warn');

var _warn2 = _interopRequireDefault(_warn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Debug.
 *
 * @type {Function}
 */

var debug = (0, _debug2.default)('slate:operation');

/**
 * Operations.
 *
 * @type {Object}
 */

var OPERATIONS = {
  // Text operations.
  insert_text: insertText,
  remove_text: removeText,
  // Mark operations.
  add_mark: addMark,
  remove_mark: removeMark,
  set_mark: setMark,
  // Node operations.
  insert_node: insertNode,
  join_node: joinNode,
  move_node: moveNode,
  remove_node: removeNode,
  set_node: setNode,
  split_node: splitNode,
  // Selection operations.
  set_selection: setSelection
};

/**
 * Apply an `operation` to the current state.
 *
 * @param {Transform} transform
 * @param {Object} operation
 */

function applyOperation(transform, operation) {
  var state = transform.state,
      operations = transform.operations;
  var type = operation.type;

  var fn = OPERATIONS[type];

  if (!fn) {
    throw new Error('Unknown operation type: "' + type + '".');
  }

  debug(type, operation);
  transform.state = fn(state, operation);
  transform.operations = operations.concat([operation]);
}

/**
 * Add mark to text at `offset` and `length` in node by `path`.
 *
 * @param {State} state
 * @param {Object} operation
 * @return {State}
 */

function addMark(state, operation) {
  var path = operation.path,
      offset = operation.offset,
      length = operation.length,
      mark = operation.mark;
  var _state = state,
      document = _state.document;

  var node = document.assertPath(path);
  node = node.addMark(offset, length, mark);
  document = document.updateDescendant(node);
  state = state.merge({ document: document });
  return state;
}

/**
 * Insert a `node` at `index` in a node by `path`.
 *
 * @param {State} state
 * @param {Object} operation
 * @return {State}
 */

function insertNode(state, operation) {
  var path = operation.path,
      index = operation.index,
      node = operation.node;
  var _state2 = state,
      document = _state2.document;

  var parent = document.assertPath(path);
  var isParent = document == parent;
  parent = parent.insertNode(index, node);
  document = isParent ? parent : document.updateDescendant(parent);
  state = state.merge({ document: document });
  return state;
}

/**
 * Insert `text` at `offset` in node by `path`.
 *
 * @param {State} state
 * @param {Object} operation
 * @return {State}
 */

function insertText(state, operation) {
  var path = operation.path,
      offset = operation.offset,
      text = operation.text,
      marks = operation.marks;
  var _state3 = state,
      document = _state3.document,
      selection = _state3.selection;
  var _selection = selection,
      anchorKey = _selection.anchorKey,
      focusKey = _selection.focusKey,
      anchorOffset = _selection.anchorOffset,
      focusOffset = _selection.focusOffset;

  var node = document.assertPath(path);

  // Update the document
  node = node.insertText(offset, text, marks);
  document = document.updateDescendant(node);

  // Update the selection
  if (anchorKey == node.key && anchorOffset >= offset) {
    selection = selection.moveAnchorOffset(text.length);
  }
  if (focusKey == node.key && focusOffset >= offset) {
    selection = selection.moveFocusOffset(text.length);
  }

  state = state.merge({ document: document, selection: selection });
  return state;
}

/**
 * Join a node by `path` with a node `withPath`.
 *
 * @param {State} state
 * @param {Object} operation
 *   @param {Boolean} operation.deep (optional) Join recursively the
 *   respective last node and first node of the nodes' children. Like a zipper :)
 * @return {State}
 */

function joinNode(state, operation) {
  var path = operation.path,
      withPath = operation.withPath,
      _operation$deep = operation.deep,
      deep = _operation$deep === undefined ? false : _operation$deep;
  var _state4 = state,
      document = _state4.document,
      selection = _state4.selection;

  var first = document.assertPath(withPath);
  var second = document.assertPath(path);

  document = document.joinNode(first, second, { deep: deep });

  // If the operation is deep, or the nodes are text nodes, it means we will be
  // merging two text nodes together, so we need to update the selection.
  if (deep || second.kind == 'text') {
    var _selection2 = selection,
        anchorKey = _selection2.anchorKey,
        anchorOffset = _selection2.anchorOffset,
        focusKey = _selection2.focusKey,
        focusOffset = _selection2.focusOffset;

    var firstText = first.kind == 'text' ? first : first.getLastText();
    var secondText = second.kind == 'text' ? second : second.getFirstText();

    if (anchorKey == secondText.key) {
      selection = selection.merge({
        anchorKey: firstText.key,
        anchorOffset: anchorOffset + firstText.characters.size
      });
    }

    if (focusKey == secondText.key) {
      selection = selection.merge({
        focusKey: firstText.key,
        focusOffset: focusOffset + firstText.characters.size
      });
    }
  }

  state = state.merge({ document: document, selection: selection });
  return state;
}

/**
 * Move a node by `path` to a new parent by `path` and `index`.
 *
 * @param {State} state
 * @param {Object} operation
 * @return {State}
 */

function moveNode(state, operation) {
  var path = operation.path,
      newPath = operation.newPath,
      newIndex = operation.newIndex;
  var _state5 = state,
      document = _state5.document;

  var node = document.assertPath(path);

  // Remove the node from its current parent
  var parent = document.getParent(node.key);
  var isParent = document == parent;
  var index = parent.nodes.indexOf(node);
  parent = parent.removeNode(index);
  document = isParent ? parent : document.updateDescendant(parent);

  // Insert the new node to its new parent
  var target = document.assertPath(newPath);
  var isTarget = document == target;
  target = target.insertNode(newIndex, node);
  document = isTarget ? target : document.updateDescendant(target);

  state = state.merge({ document: document });
  return state;
}

/**
 * Remove mark from text at `offset` and `length` in node by `path`.
 *
 * @param {State} state
 * @param {Object} operation
 * @return {State}
 */

function removeMark(state, operation) {
  var path = operation.path,
      offset = operation.offset,
      length = operation.length,
      mark = operation.mark;
  var _state6 = state,
      document = _state6.document;

  var node = document.assertPath(path);
  node = node.removeMark(offset, length, mark);
  document = document.updateDescendant(node);
  state = state.merge({ document: document });
  return state;
}

/**
 * Remove a node by `path`.
 *
 * @param {State} state
 * @param {Object} operation
 * @return {State}
 */

function removeNode(state, operation) {
  var path = operation.path;
  var _state7 = state,
      document = _state7.document,
      selection = _state7.selection;
  var _selection3 = selection,
      startKey = _selection3.startKey,
      endKey = _selection3.endKey;

  var node = document.assertPath(path);

  // If the selection is set, check to see if it needs to be updated.
  if (selection.isSet) {
    var hasStartNode = node.hasNode(startKey);
    var hasEndNode = node.hasNode(endKey);

    // If one of the selection's nodes is being removed, we need to update it.
    if (hasStartNode) {
      var prev = document.getPreviousText(startKey);
      var next = document.getNextText(startKey);

      if (prev) {
        selection = selection.moveStartTo(prev.key, prev.length);
      } else if (next) {
        selection = selection.moveStartTo(next.key, 0);
      } else {
        selection = selection.unset();
      }
    }

    if (hasEndNode) {
      var _prev = document.getPreviousText(endKey);
      var _next = document.getNextText(endKey);

      if (_prev) {
        selection = selection.moveEndTo(_prev.key, _prev.length);
      } else if (_next) {
        selection = selection.moveEndTo(_next.key, 0);
      } else {
        selection = selection.unset();
      }
    }
  }

  // Remove the node from the document.
  var parent = document.getParent(node.key);
  var index = parent.nodes.indexOf(node);
  var isParent = document == parent;
  parent = parent.removeNode(index);
  document = isParent ? parent : document.updateDescendant(parent);

  // Update the document and selection.
  state = state.merge({ document: document, selection: selection });
  return state;
}

/**
 * Remove text at `offset` and `length` in node by `path`.
 *
 * @param {State} state
 * @param {Object} operation
 * @return {State}
 */

function removeText(state, operation) {
  var path = operation.path,
      offset = operation.offset,
      length = operation.length;

  var rangeOffset = offset + length;
  var _state8 = state,
      document = _state8.document,
      selection = _state8.selection;
  var _selection4 = selection,
      anchorKey = _selection4.anchorKey,
      focusKey = _selection4.focusKey,
      anchorOffset = _selection4.anchorOffset,
      focusOffset = _selection4.focusOffset;

  var node = document.assertPath(path);

  // Update the selection
  if (anchorKey == node.key && anchorOffset >= rangeOffset) {
    selection = selection.moveAnchorOffset(-length);
  }
  if (focusKey == node.key && focusOffset >= rangeOffset) {
    selection = selection.moveFocusOffset(-length);
  }

  node = node.removeText(offset, length);
  document = document.updateDescendant(node);
  state = state.merge({ document: document, selection: selection });
  return state;
}

/**
 * Set `properties` on mark on text at `offset` and `length` in node by `path`.
 *
 * @param {State} state
 * @param {Object} operation
 * @return {State}
 */

function setMark(state, operation) {
  var path = operation.path,
      offset = operation.offset,
      length = operation.length,
      mark = operation.mark,
      newMark = operation.newMark;
  var _state9 = state,
      document = _state9.document;

  var node = document.assertPath(path);
  node = node.updateMark(offset, length, mark, newMark);
  document = document.updateDescendant(node);
  state = state.merge({ document: document });
  return state;
}

/**
 * Set `properties` on a node by `path`.
 *
 * @param {State} state
 * @param {Object} operation
 * @return {State}
 */

function setNode(state, operation) {
  var path = operation.path,
      properties = operation.properties;
  var _state10 = state,
      document = _state10.document;

  var node = document.assertPath(path);

  // Deprecate the ability to overwite a node's children.
  if (properties.nodes && properties.nodes != node.nodes) {
    (0, _warn2.default)('Updating a Node\'s `nodes` property via `setNode()` is not allowed. Use the appropriate insertion and removal operations instead. The opeartion in question was:', operation);
    delete properties.nodes;
  }

  // Deprecate the ability to change a node's key.
  if (properties.key && properties.key != node.key) {
    (0, _warn2.default)('Updating a Node\'s `key` property via `setNode()` is not allowed. There should be no reason to do this. The opeartion in question was:', operation);
    delete properties.key;
  }

  node = node.merge(properties);
  document = document.updateDescendant(node);
  state = state.merge({ document: document });
  return state;
}

/**
 * Set `properties` on the selection.
 *
 * @param {State} state
 * @param {Object} operation
 * @return {State}
 */

function setSelection(state, operation) {
  var properties = _extends({}, operation.properties);
  var _state11 = state,
      document = _state11.document,
      selection = _state11.selection;


  if (properties.anchorPath !== undefined) {
    properties.anchorKey = properties.anchorPath === null ? null : document.assertPath(properties.anchorPath).key;
    delete properties.anchorPath;
  }

  if (properties.focusPath !== undefined) {
    properties.focusKey = properties.focusPath === null ? null : document.assertPath(properties.focusPath).key;
    delete properties.focusPath;
  }

  selection = selection.merge(properties);
  selection = selection.normalize(document);
  state = state.merge({ selection: selection });
  return state;
}

/**
 * Split a node by `path` at `offset`.
 *
 * @param {State} state
 * @param {Object} operation
 *   @param {Array} operation.path The path of the node to split
 *   @param {Number} operation.offset (optional) Split using a relative offset
 *   @param {Number} operation.count (optional) Split after `count`
 *   children. Cannot be used in combination with offset.
 * @return {State}
 */

function splitNode(state, operation) {
  var path = operation.path,
      offset = operation.offset,
      count = operation.count;
  var _state12 = state,
      document = _state12.document,
      selection = _state12.selection;

  // If there's no offset, it's using the `count` instead.

  if (offset == null) {
    document = document.splitNodeAfter(path, count);
    state = state.merge({ document: document });
    return state;
  }

  // Otherwise, split using the `offset`, but calculate a few things first.
  var node = document.assertPath(path);
  var text = node.kind == 'text' ? node : node.getTextAtOffset(offset);
  var textOffset = node.kind == 'text' ? offset : offset - node.getOffset(text.key);
  var _selection5 = selection,
      anchorKey = _selection5.anchorKey,
      anchorOffset = _selection5.anchorOffset,
      focusKey = _selection5.focusKey,
      focusOffset = _selection5.focusOffset;


  document = document.splitNode(path, offset);

  // Determine whether we need to update the selection.
  var splitAnchor = text.key == anchorKey && textOffset <= anchorOffset;
  var splitFocus = text.key == focusKey && textOffset <= focusOffset;

  // If either the anchor of focus was after the split, we need to update them.
  if (splitFocus || splitAnchor) {
    var nextText = document.getNextText(text.key);

    if (splitAnchor) {
      selection = selection.merge({
        anchorKey: nextText.key,
        anchorOffset: anchorOffset - textOffset
      });
    }

    if (splitFocus) {
      selection = selection.merge({
        focusKey: nextText.key,
        focusOffset: focusOffset - textOffset
      });
    }
  }

  state = state.merge({ document: document, selection: selection });
  return state;
}