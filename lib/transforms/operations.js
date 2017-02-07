'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addMarkOperation = addMarkOperation;
exports.insertNodeOperation = insertNodeOperation;
exports.insertTextOperation = insertTextOperation;
exports.joinNodeOperation = joinNodeOperation;
exports.moveNodeOperation = moveNodeOperation;
exports.removeMarkOperation = removeMarkOperation;
exports.removeNodeOperation = removeNodeOperation;
exports.removeTextOperation = removeTextOperation;
exports.setMarkOperation = setMarkOperation;
exports.setNodeOperation = setNodeOperation;
exports.setSelectionOperation = setSelectionOperation;
exports.splitNodeAtOffsetOperation = splitNodeAtOffsetOperation;
exports.splitNodeOperation = splitNodeOperation;

var _normalize = require('../utils/normalize');

var _normalize2 = _interopRequireDefault(_normalize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Add mark to text at `offset` and `length` in node by `path`.
 *
 * @param {Transform} transform
 * @param {Array} path
 * @param {Number} offset
 * @param {Number} length
 * @param {Mixed} mark
 */

function addMarkOperation(transform, path, offset, length, mark) {
  var inverse = [{
    type: 'remove_mark',
    path: path,
    offset: offset,
    length: length,
    mark: mark
  }];

  var operation = {
    type: 'add_mark',
    path: path,
    offset: offset,
    length: length,
    mark: mark,
    inverse: inverse
  };

  transform.applyOperation(operation);
}

/**
 * Insert a `node` at `index` in a node by `path`.
 *
 * @param {Transform} transform
 * @param {Array} path
 * @param {Number} index
 * @param {Node} node
 */

function insertNodeOperation(transform, path, index, node) {
  var inversePath = path.slice().concat([index]);
  var inverse = [{
    type: 'remove_node',
    path: inversePath
  }];

  var operation = {
    type: 'insert_node',
    path: path,
    index: index,
    node: node,
    inverse: inverse
  };

  transform.applyOperation(operation);
}

/**
 * Insert `text` at `offset` in node by `path`.
 *
 * @param {Transform} transform
 * @param {Array} path
 * @param {Number} offset
 * @param {String} text
 * @param {Set<Mark>} marks (optional)
 */

function insertTextOperation(transform, path, offset, text, marks) {
  var inverseLength = text.length;
  var inverse = [{
    type: 'remove_text',
    path: path,
    offset: offset,
    length: inverseLength
  }];

  var operation = {
    type: 'insert_text',
    path: path,
    offset: offset,
    text: text,
    marks: marks,
    inverse: inverse
  };

  transform.applyOperation(operation);
}

/**
 * Join a node by `path` with a node `withPath`.
 *
 * @param {Transform} transform
 * @param {Array} path
 * @param {Array} withPath
 */

function joinNodeOperation(transform, path, withPath) {
  var state = transform.state;
  var document = state.document;

  var node = document.assertPath(withPath);

  var inverse = void 0;
  if (node.kind === 'text') {
    var offset = node.length;

    inverse = [{
      type: 'split_node',
      path: withPath,
      offset: offset
    }];
  } else {
    // The number of children after which we split
    var count = node.nodes.count();

    inverse = [{
      type: 'split_node',
      path: withPath,
      count: count
    }];
  }

  var operation = {
    type: 'join_node',
    path: path,
    withPath: withPath,
    inverse: inverse
  };

  transform.applyOperation(operation);
}

/**
 * Move a node by `path` to a `newPath` and `newIndex`.
 *
 * @param {Transform} transform
 * @param {Array} path
 * @param {Array} newPath
 * @param {Number} newIndex
 */

function moveNodeOperation(transform, path, newPath, newIndex) {
  var parentPath = path.slice(0, -1);
  var parentIndex = path[path.length - 1];
  var inversePath = newPath.slice().concat([newIndex]);

  var inverse = [{
    type: 'move_node',
    path: inversePath,
    newPath: parentPath,
    newIndex: parentIndex
  }];

  var operation = {
    type: 'move_node',
    path: path,
    newPath: newPath,
    newIndex: newIndex,
    inverse: inverse
  };

  transform.applyOperation(operation);
}

/**
 * Remove mark from text at `offset` and `length` in node by `path`.
 *
 * @param {Transform} transform
 * @param {Array} path
 * @param {Number} offset
 * @param {Number} length
 * @param {Mark} mark
 */

function removeMarkOperation(transform, path, offset, length, mark) {
  var inverse = [{
    type: 'add_mark',
    path: path,
    offset: offset,
    length: length,
    mark: mark
  }];

  var operation = {
    type: 'remove_mark',
    path: path,
    offset: offset,
    length: length,
    mark: mark,
    inverse: inverse
  };

  transform.applyOperation(operation);
}

/**
 * Remove a node by `path`.
 *
 * @param {Transform} transform
 * @param {Array} path
 */

function removeNodeOperation(transform, path) {
  var state = transform.state;
  var document = state.document;

  var node = document.assertPath(path);
  var inversePath = path.slice(0, -1);
  var inverseIndex = path[path.length - 1];

  var inverse = [{
    type: 'insert_node',
    path: inversePath,
    index: inverseIndex,
    node: node
  }];

  var operation = {
    type: 'remove_node',
    path: path,
    inverse: inverse
  };

  transform.applyOperation(operation);
}

/**
 * Remove text at `offset` and `length` in node by `path`.
 *
 * @param {Transform} transform
 * @param {Array} path
 * @param {Number} offset
 * @param {Number} length
 */

function removeTextOperation(transform, path, offset, length) {
  var state = transform.state;
  var document = state.document;

  var node = document.assertPath(path);
  var ranges = node.getRanges();
  var inverse = [];

  // Loop the ranges of text in the node, creating inverse insert operations for
  // each of the ranges that overlap with the remove operation. This is
  // necessary because insert's can only have a single set of marks associated
  // with them, but removes can remove many.
  ranges.reduce(function (start, range) {
    var text = range.text,
        marks = range.marks;

    var end = start + text.length;
    if (start > offset + length) return end;
    if (end <= offset) return end;

    var endOffset = Math.min(end, offset + length);
    var string = text.slice(offset - start, endOffset - start);

    inverse.push({
      type: 'insert_text',
      path: path,
      offset: offset,
      text: string,
      marks: marks
    });

    return end;
  }, 0);

  var operation = {
    type: 'remove_text',
    path: path,
    offset: offset,
    length: length,
    inverse: inverse
  };

  transform.applyOperation(operation);
}

/**
 * Set `properties` on mark on text at `offset` and `length` in node by `path`.
 *
 * @param {Transform} transform
 * @param {Array} path
 * @param {Number} offset
 * @param {Number} length
 * @param {Mark} mark
 * @param {Mark} newMark
 */

function setMarkOperation(transform, path, offset, length, mark, newMark) {
  var inverse = [{
    type: 'set_mark',
    path: path,
    offset: offset,
    length: length,
    mark: newMark,
    newMark: mark
  }];

  var operation = {
    type: 'set_mark',
    path: path,
    offset: offset,
    length: length,
    mark: mark,
    newMark: newMark,
    inverse: inverse
  };

  transform.applyOperation(operation);
}

/**
 * Set `properties` on a node by `path`.
 *
 * @param {Transform} transform
 * @param {Array} path
 * @param {Object} properties
 */

function setNodeOperation(transform, path, properties) {
  var state = transform.state;
  var document = state.document;

  var node = document.assertPath(path);
  var inverseProps = {};

  for (var k in properties) {
    inverseProps[k] = node[k];
  }

  var inverse = [{
    type: 'set_node',
    path: path,
    properties: inverseProps
  }];

  var operation = {
    type: 'set_node',
    path: path,
    properties: properties,
    inverse: inverse
  };

  transform.applyOperation(operation);
}

/**
 * Set the selection to a new `selection`.
 *
 * @param {Transform} transform
 * @param {Mixed} selection
 */

function setSelectionOperation(transform, properties) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  properties = _normalize2.default.selectionProperties(properties);

  var state = transform.state;
  var document = state.document,
      selection = state.selection;

  var prevProps = {};
  var props = {};

  // Remove any properties that are already equal to the current selection. And
  // create a dictionary of the previous values for all of the properties that
  // are being changed, for the inverse operation.
  for (var k in properties) {
    if (!options.snapshot && properties[k] == selection[k]) continue;
    props[k] = properties[k];
    prevProps[k] = selection[k];
  }

  // If the selection moves, clear any marks, unless the new selection
  // does change the marks in some way
  var moved = ['anchorKey', 'anchorOffset', 'focusKey', 'focusOffset'].some(function (p) {
    return props.hasOwnProperty(p);
  });

  if (selection.marks && properties.marks == selection.marks && moved) {
    props.marks = null;
  }

  // Resolve the selection keys into paths.
  if (props.anchorKey) {
    props.anchorPath = document.getPath(props.anchorKey);
    delete props.anchorKey;
  }

  if (prevProps.anchorKey) {
    prevProps.anchorPath = document.getPath(prevProps.anchorKey);
    delete prevProps.anchorKey;
  }

  if (props.focusKey) {
    props.focusPath = document.getPath(props.focusKey);
    delete props.focusKey;
  }

  if (prevProps.focusKey) {
    prevProps.focusPath = document.getPath(prevProps.focusKey);
    delete prevProps.focusKey;
  }

  // Define an inverse of the operation for undoing.
  var inverse = [{
    type: 'set_selection',
    properties: prevProps
  }];

  // Define the operation.
  var operation = {
    type: 'set_selection',
    properties: props,
    inverse: inverse
  };

  // Apply the operation.
  transform.applyOperation(operation);
}

/**
 * Split a node by `path` at `offset`.
 *
 * @param {Transform} transform
 * @param {Array} path
 * @param {Number} offset
 */

function splitNodeAtOffsetOperation(transform, path, offset) {
  var inversePath = path.slice();
  inversePath[path.length - 1] += 1;

  var inverse = [{
    type: 'join_node',
    path: inversePath,
    withPath: path,
    // we will split down to the text nodes, so we must join nodes recursively
    deep: true
  }];

  var operation = {
    type: 'split_node',
    path: path,
    offset: offset,
    count: null,
    inverse: inverse
  };

  transform.applyOperation(operation);
}

/**
 * Split a node by `path` after its 'count' child.
 *
 * @param {Transform} transform
 * @param {Array} path
 * @param {Number} count
 */

function splitNodeOperation(transform, path, count) {
  var inversePath = path.slice();
  inversePath[path.length - 1] += 1;

  var inverse = [{
    type: 'join_node',
    path: inversePath,
    withPath: path,
    deep: false
  }];

  var operation = {
    type: 'split_node',
    path: path,
    offset: null,
    count: count,
    inverse: inverse
  };

  transform.applyOperation(operation);
}