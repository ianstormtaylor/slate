"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.redo = redo;
exports.save = save;
exports.undo = undo;

/**
 * Redo to the next state in the history.
 *
 * @param {Transform} transform
 */

function redo(transform) {
  var state = transform.state;
  var _state = state,
      history = _state.history;
  var _history = history,
      undos = _history.undos,
      redos = _history.redos;

  // If there's no next snapshot, abort.

  var next = redos.peek();
  if (!next) return;

  // Shift the next state into the undo stack.
  redos = redos.pop();
  undos = undos.push(next);

  // Replay the next operations.
  next.forEach(function (op) {
    transform.applyOperation(op);
  });

  // Update the history.
  state = transform.state;
  history = history.merge({ undos: undos, redos: redos });
  state = state.merge({ history: history });

  // Update the transform.
  transform.state = state;
}

/**
 * Save the operations into the history.
 *
 * @param {Transform} transform
 * @param {Object} options
 */

function save(transform) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _options$merge = options.merge,
      merge = _options$merge === undefined ? false : _options$merge;
  var state = transform.state,
      operations = transform.operations;
  var _state2 = state,
      history = _state2.history;
  var _history2 = history,
      undos = _history2.undos,
      redos = _history2.redos;

  // If there are no operations, abort.

  if (!operations.length) return;

  // Create a new save point or merge the operations into the previous one.
  if (merge) {
    var previous = undos.peek();
    undos = undos.pop();
    previous = previous.concat(operations);
    undos = undos.push(previous);
  } else {
    undos = undos.push(operations);
  }

  // Clear the redo stack and constrain the undos stack.
  if (undos.size > 100) undos = undos.take(100);
  redos = redos.clear();

  // Update the state.
  history = history.merge({ undos: undos, redos: redos });
  state = state.merge({ history: history });

  // Update the transform.
  transform.state = state;
}

/**
 * Undo the previous operations in the history.
 *
 * @param {Transform} transform
 */

function undo(transform) {
  var state = transform.state;
  var _state3 = state,
      history = _state3.history;
  var _history3 = history,
      undos = _history3.undos,
      redos = _history3.redos;

  // If there's no previous snapshot, abort.

  var previous = undos.peek();
  if (!previous) return;

  // Shift the previous operations into the redo stack.
  undos = undos.pop();
  redos = redos.push(previous);

  // Replay the inverse of the previous operations.
  previous.slice().reverse().forEach(function (op) {
    op.inverse.forEach(function (inv) {
      transform.applyOperation(inv);
    });
  });

  // Update the history.
  state = transform.state;
  history = history.merge({ undos: undos, redos: redos });
  state = state.merge({ history: history });

  // Update the transform.
  transform.state = state;
}