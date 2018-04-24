'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _slateDevLogger = require('slate-dev-logger');

var _slateDevLogger2 = _interopRequireDefault(_slateDevLogger);

var _node = require('../models/node');

var _node2 = _interopRequireDefault(_node);

var _mark = require('../models/mark');

var _mark2 = _interopRequireDefault(_mark);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Debug.
 *
 * @type {Function}
 */

var debug = (0, _debug2.default)('slate:operation:apply');

/**
 * Applying functions.
 *
 * @type {Object}
 */

var APPLIERS = {

  /**
   * Add mark to text at `offset` and `length` in node by `path`.
   *
   * @param {State} state
   * @param {Object} operation
   * @return {State}
   */

  add_mark: function add_mark(state, operation) {
    var path = operation.path,
        offset = operation.offset,
        length = operation.length;

    var mark = _mark2.default.create(operation.mark);
    var _state = state,
        document = _state.document;

    var node = document.assertPath(path);
    node = node.addMark(offset, length, mark);
    document = document.updateNode(node);
    state = state.set('document', document);
    return state;
  },


  /**
   * Insert a `node` at `index` in a node by `path`.
   *
   * @param {State} state
   * @param {Object} operation
   * @return {State}
   */

  insert_node: function insert_node(state, operation) {
    var path = operation.path;

    var node = _node2.default.create(operation.node);
    var index = path[path.length - 1];
    var rest = path.slice(0, -1);
    var _state2 = state,
        document = _state2.document;

    var parent = document.assertPath(rest);
    parent = parent.insertNode(index, node);
    document = document.updateNode(parent);
    state = state.set('document', document);
    return state;
  },


  /**
   * Insert `text` at `offset` in node by `path`.
   *
   * @param {State} state
   * @param {Object} operation
   * @return {State}
   */

  insert_text: function insert_text(state, operation) {
    var path = operation.path,
        offset = operation.offset,
        text = operation.text;
    var marks = operation.marks;

    if (Array.isArray(marks)) marks = _mark2.default.createSet(marks);

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
    document = document.updateNode(node);

    // Update the selection
    if (anchorKey == node.key && anchorOffset >= offset) {
      selection = selection.moveAnchor(text.length);
    }
    if (focusKey == node.key && focusOffset >= offset) {
      selection = selection.moveFocus(text.length);
    }

    state = state.set('document', document).set('selection', selection);
    return state;
  },


  /**
   * Merge a node at `path` with the previous node.
   *
   * @param {State} state
   * @param {Object} operation
   * @return {State}
   */

  merge_node: function merge_node(state, operation) {
    var path = operation.path;

    var withPath = path.slice(0, path.length - 1).concat([path[path.length - 1] - 1]);
    var _state4 = state,
        document = _state4.document,
        selection = _state4.selection;

    var one = document.assertPath(withPath);
    var two = document.assertPath(path);
    var parent = document.getParent(one.key);
    var oneIndex = parent.nodes.indexOf(one);
    var twoIndex = parent.nodes.indexOf(two);

    // Perform the merge in the document.
    parent = parent.mergeNode(oneIndex, twoIndex);
    document = document.updateNode(parent);

    // If the nodes are text nodes and the selection is inside the second node
    // update it to refer to the first node instead.
    if (one.kind == 'text') {
      var _selection2 = selection,
          anchorKey = _selection2.anchorKey,
          anchorOffset = _selection2.anchorOffset,
          focusKey = _selection2.focusKey,
          focusOffset = _selection2.focusOffset;

      var normalize = false;

      if (anchorKey == two.key) {
        selection = selection.moveAnchorTo(one.key, one.text.length + anchorOffset);
        normalize = true;
      }

      if (focusKey == two.key) {
        selection = selection.moveFocusTo(one.key, one.text.length + focusOffset);
        normalize = true;
      }

      if (normalize) {
        selection = selection.normalize(document);
      }
    }

    // Update the document and selection.
    state = state.set('document', document).set('selection', selection);
    return state;
  },


  /**
   * Move a node by `path` to `newPath`.
   *
   * @param {State} state
   * @param {Object} operation
   * @return {State}
   */

  move_node: function move_node(state, operation) {
    var path = operation.path,
        newPath = operation.newPath;

    var newIndex = newPath[newPath.length - 1];
    var newParentPath = newPath.slice(0, -1);
    var oldParentPath = path.slice(0, -1);
    var oldIndex = path[path.length - 1];
    var _state5 = state,
        document = _state5.document;

    var node = document.assertPath(path);

    // Remove the node from its current parent.
    var parent = document.getParent(node.key);
    parent = parent.removeNode(oldIndex);
    document = document.updateNode(parent);

    // Find the new target...
    var target = void 0;

    // If the old path and the rest of the new path are the same, then the new
    // target is the old parent.
    if (oldParentPath.every(function (x, i) {
      return x === newParentPath[i];
    }) && oldParentPath.length === newParentPath.length) {
      target = parent;
    }

    // Otherwise, if the old path removal resulted in the new path being no longer
    // correct, we need to decrement the new path at the old path's last index.
    else if (oldParentPath.every(function (x, i) {
        return x === newParentPath[i];
      }) && oldIndex < newParentPath[oldParentPath.length]) {
        newParentPath[oldParentPath.length]--;
        target = document.assertPath(newParentPath);
      }

      // Otherwise, we can just grab the target normally...
      else {
          target = document.assertPath(newParentPath);
        }

    // Insert the new node to its new parent.
    target = target.insertNode(newIndex, node);
    document = document.updateNode(target);
    state = state.set('document', document);
    return state;
  },


  /**
   * Remove mark from text at `offset` and `length` in node by `path`.
   *
   * @param {State} state
   * @param {Object} operation
   * @return {State}
   */

  remove_mark: function remove_mark(state, operation) {
    var path = operation.path,
        offset = operation.offset,
        length = operation.length;

    var mark = _mark2.default.create(operation.mark);
    var _state6 = state,
        document = _state6.document;

    var node = document.assertPath(path);
    node = node.removeMark(offset, length, mark);
    document = document.updateNode(node);
    state = state.set('document', document);
    return state;
  },


  /**
   * Remove a node by `path`.
   *
   * @param {State} state
   * @param {Object} operation
   * @return {State}
   */

  remove_node: function remove_node(state, operation) {
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
      var first = node.kind == 'text' ? node : node.getFirstText() || node;
      var last = node.kind == 'text' ? node : node.getLastText() || node;
      var prev = document.getPreviousText(first.key);
      var next = document.getNextText(last.key);

      // If the start point was in this node, update it to be just before/after.
      if (hasStartNode) {
        if (prev) {
          selection = selection.moveStartTo(prev.key, prev.text.length);
        } else if (next) {
          selection = selection.moveStartTo(next.key, 0);
        } else {
          selection = selection.deselect();
        }
      }

      // If the end point was in this node, update it to be just before/after.
      if (selection.isSet && hasEndNode) {
        if (prev) {
          selection = selection.moveEndTo(prev.key, prev.text.length);
        } else if (next) {
          selection = selection.moveEndTo(next.key, 0);
        } else {
          selection = selection.deselect();
        }
      }

      // If the selection wasn't deselected, normalize it.
      if (selection.isSet) {
        selection = selection.normalize(document);
      }
    }

    // Remove the node from the document.
    var parent = document.getParent(node.key);
    var index = parent.nodes.indexOf(node);
    parent = parent.removeNode(index);
    document = document.updateNode(parent);

    // Update the document and selection.
    state = state.set('document', document).set('selection', selection);
    return state;
  },


  /**
   * Remove `text` at `offset` in node by `path`.
   *
   * @param {State} state
   * @param {Object} operation
   * @return {State}
   */

  remove_text: function remove_text(state, operation) {
    var path = operation.path,
        offset = operation.offset,
        text = operation.text;
    var length = text.length;

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

    // Update the selection.
    if (anchorKey == node.key && anchorOffset >= rangeOffset) {
      selection = selection.moveAnchor(-length);
    }

    if (focusKey == node.key && focusOffset >= rangeOffset) {
      selection = selection.moveFocus(-length);
    }

    node = node.removeText(offset, length);
    document = document.updateNode(node);
    state = state.set('document', document).set('selection', selection);
    return state;
  },


  /**
   * Set `data` on `state`.
   *
   * @param {State} state
   * @param {Object} operation
   * @return {State}
   */

  set_data: function set_data(state, operation) {
    var properties = operation.properties;
    var _state9 = state,
        data = _state9.data;


    data = data.merge(properties);
    state = state.set('data', data);
    return state;
  },


  /**
   * Set `properties` on mark on text at `offset` and `length` in node by `path`.
   *
   * @param {State} state
   * @param {Object} operation
   * @return {State}
   */

  set_mark: function set_mark(state, operation) {
    var path = operation.path,
        offset = operation.offset,
        length = operation.length,
        properties = operation.properties;

    var mark = _mark2.default.create(operation.mark);
    var _state10 = state,
        document = _state10.document;

    var node = document.assertPath(path);
    node = node.updateMark(offset, length, mark, properties);
    document = document.updateNode(node);
    state = state.set('document', document);
    return state;
  },


  /**
   * Set `properties` on a node by `path`.
   *
   * @param {State} state
   * @param {Object} operation
   * @return {State}
   */

  set_node: function set_node(state, operation) {
    var path = operation.path,
        properties = operation.properties;
    var _state11 = state,
        document = _state11.document;

    var node = document.assertPath(path);

    // Warn when trying to overwite a node's children.
    if (properties.nodes && properties.nodes != node.nodes) {
      _slateDevLogger2.default.warn('Updating a Node\'s `nodes` property via `setNode()` is not allowed. Use the appropriate insertion and removal operations instead. The opeartion in question was:', operation);
      delete properties.nodes;
    }

    // Warn when trying to change a node's key.
    if (properties.key && properties.key != node.key) {
      _slateDevLogger2.default.warn('Updating a Node\'s `key` property via `setNode()` is not allowed. There should be no reason to do this. The opeartion in question was:', operation);
      delete properties.key;
    }

    node = node.merge(properties);
    document = document.updateNode(node);
    state = state.set('document', document);
    return state;
  },


  /**
   * Set `properties` on the selection.
   *
   * @param {State} state
   * @param {Object} operation
   * @return {State}
   */

  set_selection: function set_selection(state, operation) {
    var properties = _extends({}, operation.properties);
    var _state12 = state,
        document = _state12.document,
        selection = _state12.selection;


    if (properties.marks != null) {
      properties.marks = _mark2.default.createSet(properties.marks);
    }

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
    state = state.set('selection', selection);
    return state;
  },


  /**
   * Split a node by `path` at `offset`.
   *
   * @param {State} state
   * @param {Object} operation
   * @return {State}
   */

  split_node: function split_node(state, operation) {
    var path = operation.path,
        position = operation.position;
    var _state13 = state,
        document = _state13.document,
        selection = _state13.selection;

    // Calculate a few things...

    var node = document.assertPath(path);
    var parent = document.getParent(node.key);
    var index = parent.nodes.indexOf(node);

    // Split the node by its parent.
    parent = parent.splitNode(index, position);
    document = document.updateNode(parent);

    // Determine whether we need to update the selection...
    var _selection5 = selection,
        startKey = _selection5.startKey,
        endKey = _selection5.endKey,
        startOffset = _selection5.startOffset,
        endOffset = _selection5.endOffset;

    var next = document.getNextText(node.key);
    var normalize = false;

    // If the start point is after or equal to the split, update it.
    if (node.key == startKey && position <= startOffset) {
      selection = selection.moveStartTo(next.key, startOffset - position);
      normalize = true;
    }

    // If the end point is after or equal to the split, update it.
    if (node.key == endKey && position <= endOffset) {
      selection = selection.moveEndTo(next.key, endOffset - position);
      normalize = true;
    }

    // Normalize the selection if we changed it, since the methods we use might
    // leave it in a non-normalized state.
    if (normalize) {
      selection = selection.normalize(document);
    }

    // Return the updated state.
    state = state.set('document', document).set('selection', selection);
    return state;
  }
};

/**
 * Apply an `operation` to a `state`.
 *
 * @param {State} state
 * @param {Object} operation
 * @return {State} state
 */

function applyOperation(state, operation) {
  var type = operation.type;

  var apply = APPLIERS[type];

  if (!apply) {
    throw new Error('Unknown operation type: "' + type + '".');
  }

  debug(type, operation);
  state = apply(state, operation);
  return state;
}

/**
 * Export.
 *
 * @type {Function}
 */

exports.default = applyOperation;